// 微信公众号同步执行器
// 
// 流程：
// 1. 读取清单文件 (.github/wechat-posts-to-sync.json)
// 2. 初始化微信 API 客户端，进行诊断
// 3. 对每篇文章：
//    - 读取并渲染 markdown
//    - 上传图片到微信素材库，替换 URL
//    - 创建草稿
// 4. 生成同步报告与状态文件

'use strict';

const fs = require('fs');
const path = require('path');
const { WeChatAPIClient, WeChatAPIError } = require('./wechat-api');
const { MarkdownRenderer } = require('./markdown-renderer');

const MANIFEST_FILE = '.github/wechat-posts-to-sync.json';
const STATE_FILE = '.github/wechat-sync-state.json';
const REPORT_FILE = '.github/wechat-sync-report.json';

class WeChatSyncExecutor {
  constructor(config) {
    this.config = config;
    this.baseDir = config.baseDir || process.cwd();
    this.sourceDir = path.join(this.baseDir, config.sourceDir || 'source');
    this.logger = config.logger || console;
    
    // 初始化 API 客户端和渲染器
    this.apiClient = new WeChatAPIClient({
      appid: config.appid,
      appsecret: config.appsecret,
      baseDir: this.baseDir,
      logger: this.logger,
      timeout: config.timeout || 30000,
    });

    this.renderer = new MarkdownRenderer({
      sourceDir: this.sourceDir,
      logger: this.logger,
      tagWhitelist: config.tagWhitelist,
    });

    // 初始化统计
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
  }

  /**
   * 执行同步
   */
  async execute() {
    this.logger.info('[Sync] Starting WeChat sync process...');
    
    try {
      // 读取清单文件
      const manifest = this._readManifest();
      if (!manifest || !manifest.posts || manifest.posts.length === 0) {
        this.logger.info('[Sync] No posts to sync');
        return this._finalize();
      }

      // 从清单中合并配置
      if (manifest.wechat_config) {
        this.config = {
          ...this.config,
          ...manifest.wechat_config,
        };
        this.logger.debug('[Sync] Loaded wechat config from manifest');
      }

      this.report.total = manifest.posts.length;

      // 诊断阶段
      await this._diagnose();

      // 同步各文章
      for (const post of manifest.posts) {
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
   * 同步单篇文章
   */
  async _syncPost(post) {
    const { uuid, title, source_path } = post;
    
    this.logger.info(`[Sync] Processing post: ${title} (uuid: ${uuid})`);

    try {
      // 1. 读取并渲染 markdown
      const { html, images: imagePaths } = this.renderer.readAndRender(source_path);

      // 2. 处理头图
      let coverUrl = null;
      const thumbnail = post.thumbnail; // 前置条件中的头图
      
      try {
        if (thumbnail) {
          // 使用文章指定的头图
          const thumbnailPath = path.join(this.sourceDir, thumbnail);
          if (fs.existsSync(thumbnailPath)) {
            coverUrl = await this.apiClient.uploadContentImage(thumbnailPath);
            this.logger.info(`[Sync]   Cover uploaded: ${thumbnail} -> ${coverUrl}`);
          } else {
            this.logger.warn(`[Sync]   Thumbnail not found: ${thumbnailPath}, will use random cover`);
          }
        }
        
        // 如果无头图，使用随机头图
        if (!coverUrl && this.config.cover?.use_default_when_missing) {
          const randomCover = await this._getRandomCover();
          if (randomCover) {
            coverUrl = await this.apiClient.uploadContentImage(randomCover);
            this.logger.info(`[Sync]   Random cover uploaded: ${coverUrl}`);
          }
        }
      } catch (err) {
        // 头图上传失败不中断同步，仅记录警告
        this.logger.warn(`[Sync]   Failed to upload cover: ${err.message}`);
      }

      // 3. 上传正文图片到微信，收集 URL 映射
      const imageUrlMap = {};
      for (const imgPath of imagePaths) {
        // 跳过绝对 URL（如 https://example.com/image.jpg）
        if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
          this.logger.debug(`[Sync]   Skipping external image: ${imgPath}`);
          continue;
        }

        try {
          const fullImgPath = path.join(this.sourceDir, imgPath);
          if (fs.existsSync(fullImgPath)) {
            const wechatImageUrl = await this.apiClient.uploadContentImage(fullImgPath);
            imageUrlMap[imgPath] = wechatImageUrl;
            this.logger.info(`[Sync]   Image uploaded: ${imgPath} -> ${wechatImageUrl}`);
          } else {
            this.logger.warn(`[Sync]   Image not found: ${fullImgPath}`);
          }
        } catch (err) {
          // 图片上传失败不阻断整篇文章，仅记录警告
          this.logger.warn(`[Sync]   Failed to upload image ${imgPath}: ${err.message}`);
        }
      }

      // 4. 替换 HTML 中的图片 URL
      let finalHtml = html;
      if (Object.keys(imageUrlMap).length > 0) {
        finalHtml = this.renderer.replaceImageUrls(html, imageUrlMap);
      }

      // 5. 添加前缀和后缀
      const prefix = this.config.article_prefix ? this.config.article_prefix.trim() : '';
      const suffix = this.config.article_suffix ? this.config.article_suffix.trim() : '';
      
      if (prefix) {
        finalHtml = `<p>${prefix.replace(/\n/g, '</p><p>')}</p>\n${finalHtml}`;
      }
      if (suffix) {
        finalHtml = `${finalHtml}\n<p>${suffix.replace(/\n/g, '</p><p>')}</p>`;
      }

      // 6. 创建草稿
      const draftItem = {
        title: title,
        author: this.config.author || 'Steve ZMT',
        digest: post.excerpt || title,
        show_cover_pic: 1, // 显示正文中的首张图
        content: finalHtml,
        content_source_url: `${this.config.origin}${post.permalink}`, // 原文链接
      };

      // 如果有头图，添加到草稿
      if (coverUrl) {
        draftItem.thumb_media_id = coverUrl; // 微信 API 需要使用 media_id，但如果是 URL 可能需要调整
      }

      const draftResult = await this.apiClient.addDraft(draftItem);
      
      this.logger.info(`[Sync]   Draft created: media_id=${draftResult.media_id}`);

      // 7. 记录成功
      this.report.succeeded += 1;
      this.report.posts.push({
        uuid: uuid,
        title: title,
        status: 'success',
        media_id: draftResult.media_id,
        cover_url: coverUrl,
        images_uploaded: Object.keys(imageUrlMap).length,
      });

      this.syncedUuids.push(uuid);
    } catch (err) {
      this.logger.error(`[Sync]   Failed: ${err.message}`);
      this.report.failed += 1;
      this.report.posts.push({
        uuid: uuid,
        title: title,
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
      const coverDir = this.config.cover?.default_cover_dir || '/images/random';
      const fullCoverDir = path.join(this.sourceDir, coverDir);
      
      if (!fs.existsSync(fullCoverDir)) {
        this.logger.warn(`[Sync]   Random cover directory not found: ${fullCoverDir}`);
        return null;
      }

      const files = fs.readdirSync(fullCoverDir);
      const imageFiles = files.filter(f => 
        /\.(jpg|jpeg|png|gif|webp)$/i.test(f)
      );

      if (imageFiles.length === 0) {
        this.logger.warn(`[Sync]   No image files found in cover directory: ${fullCoverDir}`);
        return null;
      }

      // 随机选择一张
      const randomFile = imageFiles[Math.floor(Math.random() * imageFiles.length)];
      const randomPath = path.join(fullCoverDir, randomFile);
      
      this.logger.debug(`[Sync]   Selected random cover: ${randomFile}`);
      return randomPath;
    } catch (err) {
      this.logger.warn(`[Sync]   Failed to get random cover: ${err.message}`);
      return null;
    }
  }

  /**
   * 最终化：生成报告和状态文件
   */
  _finalize() {
    // 生成同步报告
    const reportPath = path.join(this.baseDir, REPORT_FILE);
    fs.writeFileSync(reportPath, JSON.stringify(this.report, null, 2), 'utf8');
    this.logger.info(`[Sync] Report written to ${reportPath}`);

    // 更新状态文件
    const stateFilePath = path.join(this.baseDir, STATE_FILE);
    const state = {
      last_sync_at: new Date().toISOString(),
      synced_uuids: this.syncedUuids,
      total_synced: this.syncedUuids.length,
    };
    fs.writeFileSync(stateFilePath, JSON.stringify(state, null, 2), 'utf8');
    this.logger.info(`[Sync] State file updated: ${stateFilePath}`);

    // 输出摘要
    this.logger.info(`\n[Sync] Summary:`);
    this.logger.info(`  Total: ${this.report.total}`);
    this.logger.info(`  Succeeded: ${this.report.succeeded}`);
    this.logger.info(`  Failed: ${this.report.failed}`);
    this.logger.info(`  Skipped: ${this.report.skipped}`);

    if (this.report.failed > 0) {
      this.logger.warn('[Sync] Some posts failed to sync. Check the report for details.');
      if (this.report.errors.length > 0) {
        this.logger.warn('[Sync] Errors:');
        for (const err of this.report.errors) {
          this.logger.warn(`  - ${err}`);
        }
      }
    }

    return this.report;
  }

  /**
   * 读取清单文件
   */
  _readManifest() {
    const manifestPath = path.join(this.baseDir, MANIFEST_FILE);
    
    if (!fs.existsSync(manifestPath)) {
      this.logger.warn(`[Sync] Manifest file not found: ${manifestPath}`);
      return null;
    }

    try {
      const content = fs.readFileSync(manifestPath, 'utf8');
      return JSON.parse(content);
    } catch (err) {
      throw new Error(`Failed to read manifest: ${err.message}`);
    }
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

  // 默认配置
  let wechatConfig = {
    appid,
    appsecret,
    author: process.env.WECHAT_AUTHOR || 'Steve ZMT',
    origin: process.env.WECHAT_ORIGIN || 'https://blog.stevezmt.top',
    article_prefix: '',
    article_suffix: '',
    cover: {
      use_default_when_missing: true,
      default_cover_dir: '/images/random',
    },
    content: {},
  };

  const executor = new WeChatSyncExecutor({
    ...wechatConfig,
    baseDir: process.cwd(),
    sourceDir: 'source',
  });

  try {
    const report = await executor.execute();
    
    // 根据结果退出码
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

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = { WeChatSyncExecutor };
