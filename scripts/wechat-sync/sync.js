// 微信公众号同步执行器
// 
// 流程：
// 1. 扫描 source/_posts/ 目录下所有文章并解析 Front-matter
// 2. 初始化微信 API 客户端并进行诊断
// 3. 调用 draft/batchget 与 freepublish/batchget 获取远端已有草稿和已发布文章
// 4. 实时比对标题与 UUID，精准跳过已同步内容（彻底防止重复上传）
// 5. 对待同步文章：
//    - 使用带语法高亮与现代优雅技术风排版引擎渲染 Markdown
//    - 自动提取外链并生成文末「参考链接」脚注清单
//    - 上传正文图片到微信素材库并替换 URL
//    - 上传文章封面并生成草稿
// 6. 输出同步报告与本地状态文件

'use strict';

const fs = require('fs');
const path = require('path');
const { WeChatAPIClient, WeChatAPIError } = require('./wechat-api');
const { MarkdownRenderer } = require('./markdown-renderer');

const STATE_FILE = '.github/wechat-sync-state.json';
const REPORT_FILE = '.github/wechat-sync-report.json';

class WeChatSyncExecutor {
  constructor(config = {}) {
    this.config = config;
    this.baseDir = config.baseDir || process.cwd();
    this.sourceDir = path.join(this.baseDir, config.sourceDir || 'source');
    this.logger = config.logger || console;
    
    // 初始化 API 客户端
    this.apiClient = new WeChatAPIClient({
      appid: config.appid,
      appsecret: config.appsecret,
      baseDir: this.baseDir,
      logger: this.logger,
      timeout: config.timeout || 30000,
    });

    // 初始化微信专用排版渲染器
    this.renderer = new MarkdownRenderer({
      sourceDir: this.sourceDir,
      logger: this.logger,
      themeColor: config.themeColor || '#0052cc',
    });

    // 初始化统计报告
    this.report = {
      timestamp: new Date().toISOString(),
      total: 0,
      succeeded: 0,
      failed: 0,
      skipped: 0,
      posts: [],
      errors: [],
    };

    this.syncedUuids = [];
    
    // 本地状态
    this.state = {
      last_sync_at: null,
      synced_uuids: [],
      uuid_to_media_id: {},
    };
    
    // 微信后台现有稿件缓存（title -> { media_id, status, update_time, url }）
    this.wechatTitleMap = {};
    
    // 被强制同步的 uuid 列表
    this.forceUuids = new Set(
      (process.env.WECHAT_FORCE_UUIDS || '').split(',').map(s => s.trim()).filter(Boolean)
    );
  }

  /**
   * 执行同步全流程
   */
  async execute() {
    this.logger.info('[Sync] Starting WeChat sync process...');
    
    try {
      // 1. 诊断 API 连通性与权限
      await this._diagnose();

      // 2. 扫描微信后台现有草稿和已发布文章
      await this._scanWeChatExistingContent();

      // 3. 读取待同步文章列表（优先直接扫描本地 source/_posts/）
      const posts = this._collectPostsFromSource();
      this.logger.info(`[Sync] Found ${posts.length} eligible posts in local repository`);

      if (posts.length === 0) {
        this.logger.info('[Sync] No posts found to sync');
        return this._finalize();
      }

      this.report.total = posts.length;

      // 4. 加载本地状态（用于辅助记录）
      this._loadState();

      // 5. 遍历各文章并执行同步
      for (const post of posts) {
        await this._syncPost(post);
      }

      return this._finalize();
    } catch (err) {
      this.logger.error('[Sync] Unexpected error:', err);
      this.report.errors.push(err.message);
      return this._finalize();
    }
  }

  // ========== Private Methods ==========

  /**
   * 诊断 API 可用性
   */
  async _diagnose() {
    this.logger.info('[Sync] Diagnosing WeChat API...');
    
    const diagnosis = await this.apiClient.diagnose();
    this.report.diagnosis = diagnosis;

    if (!diagnosis.token_ok) {
      throw new Error(`Failed to get access_token: ${diagnosis.errors.join('\n')}`);
    }

    if (!diagnosis.draft_api_ok) {
      throw new Error(`Draft API not available: ${diagnosis.errors.join('\n')}`);
    }

    this.logger.info('[Sync] API diagnosis passed');
  }

  /**
   * 扫描微信后台现有稿件，建立 title 到 media_id 的映射
   */
  async _scanWeChatExistingContent() {
    this.logger.info('[Sync] Scanning WeChat existing drafts and published articles...');

    try {
      // 1. 获取所有草稿
      const drafts = await this.apiClient.getAllDrafts();
      this.logger.info(`[Sync] Found ${drafts.length} drafts in WeChat draft box`);
      
      for (const draft of drafts) {
        if (draft.title) {
          this.wechatTitleMap[draft.title.trim()] = {
            media_id: draft.media_id,
            status: 'draft',
            url: draft.url,
            content_source_url: draft.content_source_url,
            update_time: draft.update_time,
          };
        }
      }

      // 2. 获取所有已发布文章
      const published = await this.apiClient.getAllPublishedMaterials();
      this.logger.info(`[Sync] Found ${published.length} published articles in WeChat`);
      
      for (const article of published) {
        if (article.title) {
          this.wechatTitleMap[article.title.trim()] = {
            media_id: article.media_id || article.article_id,
            status: 'published',
            url: article.url,
            content_source_url: article.content_source_url,
            update_time: article.update_time,
          };
        }
      }

      this.logger.info(`[Sync] Total tracked existing articles in WeChat: ${Object.keys(this.wechatTitleMap).length}`);
    } catch (err) {
      this.logger.warn(`[Sync] Failed to scan WeChat content: ${err.message}`);
      this.logger.warn('[Sync] Will proceed with caution');
    }
  }

  /**
   * 扫描 source/_posts/ 获取所有符合发布条件的博文
   */
  _collectPostsFromSource() {
    const postsDir = path.join(this.sourceDir, '_posts');
    if (!fs.existsSync(postsDir)) {
      this.logger.warn(`[Sync] Posts directory not found: ${postsDir}`);
      return [];
    }

    const files = fs.readdirSync(postsDir).filter(f => /\.(md|markdown)$/i.test(f));
    const now = new Date();
    const posts = [];

    for (const file of files) {
      const fullPath = path.join(postsDir, file);
      try {
        const rawContent = fs.readFileSync(fullPath, 'utf8');
        const parsed = this._parseFrontMatter(rawContent);
        if (!parsed) continue;

        const data = parsed.data || {};
        
        // 过滤条件：
        // 1. 显式禁用 wechat_sync: false 则跳过
        if (data.wechat_sync === false) {
          continue;
        }

        // 2. 必须非草稿
        if (data.draft === true) {
          continue;
        }

        // 3. 检查发布时间（支持定时发布，未来时间跳过）
        const postDate = data.date ? new Date(data.date) : null;
        if (postDate && postDate > now) {
          continue;
        }

        // 4. 标题与 UUID
        const title = (data.title || path.basename(file, path.extname(file))).trim();
        const uuid = data.uuid || this._generateSimpleUuid(file);

        // 5. 链接构造
        const origin = (this.config.origin || 'https://blog.stevezmt.top').replace(/\/$/, '');
        let permalink = data.permalink || '';
        if (!permalink && postDate) {
          const year = postDate.getUTCFullYear();
          const month = String(postDate.getUTCMonth() + 1).padStart(2, '0');
          const day = String(postDate.getUTCDate()).padStart(2, '0');
          const slug = path.basename(file, path.extname(file));
          permalink = `${origin}/${year}/${month}/${day}/${slug}/`;
        }

        posts.push({
          uuid,
          title,
          date: postDate ? postDate.toISOString() : '',
          author: data.author || this.config.author || 'Steve ZMT',
          categories: Array.isArray(data.categories) ? data.categories : (data.categories ? [data.categories] : []),
          tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
          permalink,
          excerpt: data.excerpt || data.description || '',
          thumbnail: data.thumbnail || data.cover || '',
          source_path: path.join('_posts', file).replace(/\\/g, '/'),
          raw_content: rawContent,
        });
      } catch (err) {
        this.logger.warn(`[Sync] Failed to parse post ${file}: ${err.message}`);
      }
    }

    // 按发布日期从旧到新排序（保证发布顺序）
    posts.sort((a, b) => (new Date(a.date || 0) - new Date(b.date || 0)));

    return posts;
  }

  /**
   * 解析 Front-matter
   */
  _parseFrontMatter(content) {
    if (!content) return null;
    let normalized = content.replace(/^\uFEFF/, '').replace(/^(?:[ \t]*\r?\n)+/, '');
    const match = normalized.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);
    if (!match) {
      return { data: {}, content: normalized };
    }

    const yamlStr = match[1];
    const body = normalized.slice(match[0].length);
    const data = {};

    // 简单高效的 YAML 键值解析
    const lines = yamlStr.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const colonIdx = trimmed.indexOf(':');
      if (colonIdx === -1) continue;

      const key = trimmed.slice(0, colonIdx).trim();
      let val = trimmed.slice(colonIdx + 1).trim();

      // 去除注释
      const hashIdx = val.indexOf('#');
      if (hashIdx !== -1 && !/['"].*#.*['"]/.test(val)) {
        val = val.slice(0, hashIdx).trim();
      }

      // 类型转换
      if (val === 'true') {
        data[key] = true;
      } else if (val === 'false') {
        data[key] = false;
      } else if (val === 'null' || val === '~') {
        data[key] = null;
      } else if (/^-?\d+(\.\d+)?$/.test(val)) {
        data[key] = Number(val);
      } else if (val.startsWith('[') && val.endsWith(']')) {
        data[key] = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
      } else {
        data[key] = val.replace(/^['"]|['"]$/g, '');
      }
    }

    return { data, content: body };
  }

  /**
   * 同步单篇文章到微信草稿箱
   */
  async _syncPost(post) {
    const { uuid, title, source_path } = post;
    
    this.logger.info(`[Sync] Processing post: "${title}" (uuid: ${uuid})`);

    try {
      // 0. 远端排重检查：比对文章标题
      const existing = this.wechatTitleMap[title.trim()];
      const isForced = this.forceUuids.has(uuid);
      
      if (existing && !isForced) {
        this.logger.info(
          `[Sync]   Skipped: Article already exists in WeChat (${existing.status}, media_id=${existing.media_id})`
        );
        this.report.skipped += 1;
        this.report.posts.push({
          uuid,
          title,
          status: 'skipped',
          reason: `already_${existing.status}`,
          existing_media_id: existing.media_id,
        });
        return;
      }

      // 如果在强制同步列表中且已存在草稿，先删除旧草稿
      if (existing && isForced) {
        try {
          if (existing.status === 'draft') {
            await this.apiClient.deleteDraft(existing.media_id);
            this.logger.info(`[Sync]   Deleted old draft: media_id=${existing.media_id}`);
            delete this.wechatTitleMap[title.trim()];
          } else {
            this.logger.warn(
              `[Sync]   Cannot delete published material (media_id=${existing.media_id}), creating new draft instead`
            );
          }
        } catch (err) {
          this.logger.warn(`[Sync]   Failed to delete old draft: ${err.message}`);
        }
      }

      // 1. 读取并渲染 Markdown
      const { html, images: imagePaths } = this.renderer.readAndRender(source_path);

      // 2. 处理头图 / 封面
      let coverMediaId = null;
      const thumbnail = post.thumbnail;
      
      try {
        if (thumbnail) {
          if (thumbnail.startsWith('http://') || thumbnail.startsWith('https://')) {
            this.logger.warn(`[Sync]   External thumbnail cannot be used directly: ${thumbnail}`);
          } else {
            const thumbnailPath = this._resolveSourcePath(thumbnail);
            if (fs.existsSync(thumbnailPath)) {
              coverMediaId = await this.apiClient.uploadImage(thumbnailPath);
              this.logger.info(`[Sync]   Cover uploaded: ${thumbnail} -> media_id=${coverMediaId}`);
            } else {
              this.logger.warn(`[Sync]   Thumbnail not found: ${thumbnailPath}, will use random cover`);
            }
          }
        }
        
        // 如果无头图，使用默认/随机头图
        if (!coverMediaId && this.config.cover?.use_default_when_missing !== false) {
          const randomCover = await this._getRandomCover();
          if (randomCover) {
            coverMediaId = await this.apiClient.uploadImage(randomCover);
            this.logger.info(`[Sync]   Random cover uploaded: media_id=${coverMediaId}`);
          }
        }
      } catch (err) {
        this.logger.warn(`[Sync]   Failed to upload cover: ${err.message}`);
      }

      // 3. 上传正文图片到微信素材库，收集 URL 映射
      const imageUrlMap = {};
      for (const imgPath of imagePaths) {
        if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
          this.logger.debug(`[Sync]   Skipping external image: ${imgPath}`);
          continue;
        }

        try {
          const fullImgPath = this._resolveSourcePath(imgPath);
          if (fs.existsSync(fullImgPath)) {
            const wechatImageUrl = await this.apiClient.uploadContentImage(fullImgPath);
            if (wechatImageUrl && typeof wechatImageUrl === 'string') {
              imageUrlMap[imgPath] = wechatImageUrl;
              this.logger.info(`[Sync]   Image uploaded: ${imgPath} -> ${wechatImageUrl}`);
            }
          } else {
            this.logger.warn(`[Sync]   Image file not found: ${fullImgPath}`);
          }
        } catch (err) {
          this.logger.warn(`[Sync]   Failed to upload image ${imgPath}: ${err.message}`);
        }
      }

      // 4. 替换 HTML 中的图片 URL 为微信 CDN 链接
      let finalHtml = html;
      if (Object.keys(imageUrlMap).length > 0) {
        finalHtml = this.renderer.replaceImageUrls(html, imageUrlMap);
      }

      // 5. 如果仍然没有封面图，使用正文中第一张本地上传成功的图片作为封面
      if (!coverMediaId) {
        for (const imgPath of imagePaths) {
          if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) continue;
          const localImgPath = this._resolveSourcePath(imgPath);
          if (!fs.existsSync(localImgPath)) continue;
          try {
            coverMediaId = await this.apiClient.uploadImage(localImgPath);
            this.logger.info(`[Sync]   Fallback cover uploaded from content image: media_id=${coverMediaId}`);
            break;
          } catch (err) {
            this.logger.warn(`[Sync]   Failed to upload fallback cover from ${imgPath}: ${err.message}`);
          }
        }
      }

      // 6. 添加可选前缀和后缀段落
      const prefix = (this.config.article_prefix || '').trim();
      const suffix = (this.config.article_suffix || '').trim();
      
      if (prefix) {
        finalHtml = `<p style="margin: 12px 0; color: #6b7280; font-size: 14px;">${prefix.replace(/\n/g, '<br>')}</p>\n${finalHtml}`;
      }
      if (suffix) {
        finalHtml = `${finalHtml}\n<p style="margin: 12px 0; color: #6b7280; font-size: 14px;">${suffix.replace(/\n/g, '<br>')}</p>`;
      }

      // 7. 组装草稿对象
      const origin = (this.config.origin || 'https://blog.stevezmt.top').replace(/\/$/, '');
      const permalink = post.permalink || '';
      const contentSourceUrl = /^https?:\/\//i.test(permalink) ? permalink : `${origin}${permalink}`;
      const digest = this._buildDigest(post, title);

      if (!coverMediaId) {
        throw new Error('No valid cover image available (thumb_media_id is required by WeChat draft API)');
      }

      const draftItem = {
        title: title,
        author: post.author || this.config.author || 'Steve ZMT',
        digest,
        show_cover_pic: 1,
        content: finalHtml,
        content_source_url: contentSourceUrl,
        thumb_media_id: coverMediaId,
      };

      // 8. 提交新增草稿到微信
      const draftResult = await this.apiClient.addDraft(draftItem);
      this.logger.info(`[Sync]   Draft successfully created: media_id=${draftResult.media_id}`);

      // 9. 记录成功结果
      this.report.succeeded += 1;
      this.report.posts.push({
        uuid,
        title,
        status: 'success',
        media_id: draftResult.media_id,
        cover_media_id: coverMediaId,
        images_uploaded: Object.keys(imageUrlMap).length,
      });

      // 更新内存映射和本地状态
      this.wechatTitleMap[title.trim()] = {
        media_id: draftResult.media_id,
        status: 'draft',
        update_time: Math.floor(Date.now() / 1000),
      };

      this.state.uuid_to_media_id[uuid] = {
        media_id: draftResult.media_id,
        title,
        status: 'draft',
        synced_at: new Date().toISOString(),
      };
      
      this.syncedUuids.push(uuid);
    } catch (err) {
      this.logger.error(`[Sync]   Failed to sync "${title}": ${err.message}`);
      this.report.failed += 1;
      this.report.posts.push({
        uuid,
        title,
        status: 'failed',
        error: err.message,
      });
    }
  }

  /**
   * 获取随机头图
   */
  _getRandomCover() {
    try {
      const configuredDir = this.config.cover?.default_cover_dir || 'themes/default/source/images/random';
      const normalizedConfiguredDir = configuredDir.replace(/^[/\\]+/, '');

      const candidateDirs = [
        path.isAbsolute(configuredDir) ? configuredDir : null,
        path.join(this.baseDir, normalizedConfiguredDir),
        path.join(this.sourceDir, normalizedConfiguredDir),
        path.join(this.baseDir, 'themes/default/source/images/random'),
      ].filter(Boolean);

      for (const fullCoverDir of candidateDirs) {
        if (!fs.existsSync(fullCoverDir)) continue;

        const files = fs.readdirSync(fullCoverDir);
        const imageFiles = files.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));

        if (imageFiles.length === 0) continue;

        const randomFile = imageFiles[Math.floor(Math.random() * imageFiles.length)];
        const randomPath = path.join(fullCoverDir, randomFile);
        this.logger.debug(`[Sync]   Selected random cover: ${randomPath}`);
        return randomPath;
      }

      this.logger.warn(`[Sync]   Random cover directory not found. Tried: ${candidateDirs.join(', ')}`);
      return null;
    } catch (err) {
      this.logger.warn(`[Sync]   Failed to get random cover: ${err.message}`);
      return null;
    }
  }

  _resolveSourcePath(assetPath) {
    const normalized = (assetPath || '').replace(/^[./\\]+/, '').replace(/^[/\\]+/, '');
    return path.join(this.sourceDir, normalized);
  }

  _buildDigest(post, title) {
    const raw = (post.excerpt || post.description || title || '').toString();
    const plain = raw
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const fallback = (title || '').toString().trim();
    const source = plain || fallback || '无摘要';

    const maxBytes = Number(this.config?.sync?.digest_max_bytes || 120);
    let out = '';
    for (const ch of source) {
      const next = out + ch;
      if (Buffer.byteLength(next, 'utf8') > maxBytes) {
        break;
      }
      out = next;
    }

    return out || source.slice(0, 30);
  }

  _generateSimpleUuid(filename) {
    let hash = 0;
    for (let i = 0; i < filename.length; i++) {
      hash = ((hash << 5) - hash) + filename.charCodeAt(i);
      hash |= 0;
    }
    return `post-${Math.abs(hash)}`;
  }

  /**
   * 加载本地状态文件
   */
  _loadState() {
    const stateFilePath = path.join(this.baseDir, STATE_FILE);
    if (fs.existsSync(stateFilePath)) {
      try {
        const content = fs.readFileSync(stateFilePath, 'utf8');
        const loaded = JSON.parse(content);
        this.state.last_sync_at = loaded.last_sync_at;
        this.state.synced_uuids = loaded.synced_uuids || [];
        this.state.uuid_to_media_id = loaded.uuid_to_media_id || {};
        this.logger.debug(`[Sync] Loaded state from ${STATE_FILE}`);
      } catch (err) {
        this.logger.warn(`[Sync] Failed to load state file: ${err.message}`);
      }
    }
  }

  /**
   * 生成报告和状态文件
   */
  _finalize() {
    // 写入同步报告
    const reportPath = path.join(this.baseDir, REPORT_FILE);
    try {
      fs.writeFileSync(reportPath, JSON.stringify(this.report, null, 2), 'utf8');
      this.logger.info(`[Sync] Report written to ${reportPath}`);
    } catch (e) {
      this.logger.warn(`[Sync] Failed to write report: ${e.message}`);
    }

    // 更新本地状态文件
    const stateFilePath = path.join(this.baseDir, STATE_FILE);
    try {
      const state = {
        last_sync_at: new Date().toISOString(),
        synced_uuids: Array.from(new Set([...(this.state.synced_uuids || []), ...this.syncedUuids])),
        uuid_to_media_id: this.state.uuid_to_media_id,
        total_synced: Object.keys(this.state.uuid_to_media_id).length,
      };
      fs.writeFileSync(stateFilePath, JSON.stringify(state, null, 2), 'utf8');
      this.logger.info(`[Sync] State file updated: ${stateFilePath}`);
    } catch (e) {
      this.logger.warn(`[Sync] Failed to write state: ${e.message}`);
    }

    // 终端摘要输出
    this.logger.info(`\n[Sync] ================= Summary =================`);
    this.logger.info(`  Total eligible posts: ${this.report.total}`);
    this.logger.info(`  Succeeded:            ${this.report.succeeded}`);
    this.logger.info(`  Skipped (existing):   ${this.report.skipped}`);
    this.logger.info(`  Failed:               ${this.report.failed}`);
    this.logger.info(`=================================================\n`);

    if (this.report.failed > 0) {
      this.logger.warn('[Sync] Some posts failed to sync. Check .github/wechat-sync-report.json for details.');
    }

    return this.report;
  }
}

// ========== CLI 入口 ==========

async function main() {
  const appid = process.env.WECHAT_APPID;
  const appsecret = process.env.WECHAT_APPSECRET;

  if (!appid || !appsecret) {
    console.error('[Sync] Error: WECHAT_APPID and WECHAT_APPSECRET environment variables are required');
    process.exit(1);
  }

  const executor = new WeChatSyncExecutor({
    appid,
    appsecret,
    author: process.env.WECHAT_AUTHOR || 'Steve ZMT',
    origin: process.env.WECHAT_ORIGIN || 'https://blog.stevezmt.top',
    baseDir: process.cwd(),
    sourceDir: 'source',
  });

  try {
    const report = await executor.execute();
    if (report.failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('[Sync] Fatal error:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { WeChatSyncExecutor };
