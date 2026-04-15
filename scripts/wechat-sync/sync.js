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

      // 2. 上传图片到微信，收集 URL 映射
      const imageUrlMap = {};
      for (const imgPath of imagePaths) {
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

      // 3. 替换 HTML 中的图片 URL
      let finalHtml = html;
      if (Object.keys(imageUrlMap).length > 0) {
        finalHtml = this.renderer.replaceImageUrls(html, imageUrlMap);
      }

      // 4. 创建草稿
      const draftItem = {
        title: title,
        author: this.config.author || 'Steve ZMT',
        digest: post.excerpt || title,
        show_cover_pic: 1, // 显示正文中的首张图
        content: finalHtml,
        content_source_url: `${this.config.origin}${post.permalink}`, // 原文链接
      };

      const draftResult = await this.apiClient.addDraft(draftItem);
      
      this.logger.info(`[Sync]   Draft created: media_id=${draftResult.media_id}`);

      // 5. 记录成功
      this.report.succeeded += 1;
      this.report.posts.push({
        uuid: uuid,
        title: title,
        status: 'success',
        media_id: draftResult.media_id,
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
  const author = process.env.WECHAT_AUTHOR || 'Steve ZMT';
  const origin = process.env.WECHAT_ORIGIN || 'https://blog.stevezmt.top';

  if (!appid || !appsecret) {
    console.error('[Sync] Error: WECHAT_APPID and WECHAT_APPSECRET environment variables are required');
    process.exit(1);
  }

  const executor = new WeChatSyncExecutor({
    appid,
    appsecret,
    author,
    origin,
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
