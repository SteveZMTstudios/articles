'use strict';

/**
 * Hexo 脚本：导出待同步微信公众号的文章清单
 * 
 * 功能：
 * - 在 Hexo 生成完成后，读取所有 post
 * - 过滤：layout=post、非草稿、有 uuid、发布时间 ≤ 当前
 * - 增量：与历史状态文件比对，仅导出未同步的 uuid
 * - 输出：JSON 清单到 `.github/wechat-posts-to-sync.json`
 */

const fs = require('hexo-fs');
const path = require('path');

async function exportSyncList() {
  const hexo = this;
  const config = hexo.config.wechat_sync || {};
  
  // 出口开关
  if (config.enabled === false) {
    hexo.log.info('[WeChat Sync] WeChat sync export is disabled');
    return;
  }

  const outputDir = path.join(hexo.base_dir, '.github');
  const outputFile = path.join(outputDir, 'wechat-posts-to-sync.json');
  const stateFile = path.join(outputDir, 'wechat-sync-state.json');

  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 读取历史同步状态
  let syncedUuids = new Set();
  if (fs.existsSync(stateFile)) {
    try {
      const stateData = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
      if (stateData.synced_uuids) {
        syncedUuids = new Set(stateData.synced_uuids);
      }
    } catch (e) {
      hexo.log.warn('[WeChat Sync] Failed to read state file, will treat all posts as new', e);
    }
  }

  // 收集待同步文章
  const postsToSync = [];
  const now = new Date();

  hexo.database.model('Post').forEach((post) => {
    // 过滤条件：
    // 1. layout 必须是 post
    // 2. 不是草稿
    // 3. 必须有 uuid
    // 4. 发布时间 ≤ 当前（支持定时发布）
    // 5. 还未同步过的 uuid（增量规则）
    if (
      post.layout === 'post' &&
      !post.draft &&
      post.uuid &&
      post.date <= now &&
      !syncedUuids.has(post.uuid)
    ) {
      postsToSync.push({
        uuid: post.uuid,
        title: post.title,
        date: post.date ? post.date.toISOString() : '',
        author: post.author || hexo.config.author || '',
        categories: post.categories ? post.categories.map(c => c.name) : [],
        tags: post.tags ? post.tags.map(t => t.name) : [],
        permalink: post.permalink || '',
        excerpt: post.excerpt || post.description || '',
        thumbnail: post.thumbnail || post.cover || '',  // 从前置条件读取头图
        source_path: post.source,        // 相对于 source/ 的相对路径
        content_raw: post._content || '', // 原始 markdown 内容（如果可用）
      });
    }
  });

  // 输出清单
  const manifest = {
    generated_at: new Date().toISOString(),
    total_posts: postsToSync.length,
    posts: postsToSync,
    // 包含微信同步配置（排除敏感信息如 appid/appsecret）
    wechat_config: {
      article_prefix: config.article_prefix || '',
      article_suffix: config.article_suffix || '',
      cover: config.cover || {
        use_default_when_missing: true,
        default_cover_dir: '/images/random',
      },
      origin: config.origin || hexo.config.url,
      author: config.author || hexo.config.author,
    },
  };

  fs.writeFileSync(
    outputFile,
    JSON.stringify(manifest, null, 2),
    'utf8'
  );

  hexo.log.info(`[WeChat Sync] Exported ${postsToSync.length} posts to sync to ${outputFile}`);
}

// 注册钩子：在 Hexo 生成完成后执行
hexo.on('generateAfter', function() {
  exportSyncList.call(this);
});

module.exports = { exportSyncList };
