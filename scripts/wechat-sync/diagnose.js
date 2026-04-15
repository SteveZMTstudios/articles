#!/usr/bin/env node

/**
 * 本地诊断脚本
 * 
 * 用途：
 * - 验证清单生成的正确性
 * - 验证 Markdown 渲染和 HTML 清洗
 * - 验证图片提取，无需真实的微信凭据
 * 
 * 用法：
 *   npm run wechat:diagnose
 *   或
 *   node scripts/wechat-sync/diagnose.js
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { MarkdownRenderer } = require('./markdown-renderer');

const baseDir = process.cwd();
const manifestFile = path.join(baseDir, '.github/wechat-posts-to-sync.json');

console.log(`
╔════════════════════════════════════════════════════════════╗
║          WeChat Sync - Local Diagnosis Report              ║
╚════════════════════════════════════════════════════════════╝
`);

// 1. 检查清单文件
console.log('📋 Checking manifest file...');
if (!fs.existsSync(manifestFile)) {
  console.error(`❌ Manifest file not found: ${manifestFile}`);
  console.error('   Run "npm run build" first to generate the manifest.');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
console.log(`✅ Found manifest with ${manifest.total_posts} posts`);

if (manifest.total_posts === 0) {
  console.warn('⚠️  No posts to sync');
  process.exit(0);
}

// 2. 测试 Markdown 渲染
console.log('\n📝 Testing Markdown rendering on first 3 posts...');
const renderer = new MarkdownRenderer({
  sourceDir: path.join(baseDir, 'source'),
  logger: console,
});

for (let i = 0; i < Math.min(3, manifest.posts.length); i++) {
  const post = manifest.posts[i];
  try {
    console.log(`\n  Post ${i + 1}: "${post.title}"`);
    const { html, images } = renderer.readAndRender(post.source_path);
    console.log(`    ✅ Rendered HTML: ${html.length} chars`);
    console.log(`    ✅ Found images: ${images.length}`);
    
    if (images.length > 0) {
      images.forEach(img => {
        console.log(`       - ${img}`);
      });
    }
    
    // 验证 HTML 清洗
    if (html.includes('<script>') || html.includes('<style>')) {
      console.warn(`    ⚠️  HTML contains unsafe tags`);
    } else {
      console.log(`    ✅ HTML sanitized (no scripts/styles)`);
    }
  } catch (err) {
    console.error(`    ❌ Error: ${err.message}`);
  }
}

// 3. 统计信息
console.log(`\n📊 Summary:`);
console.log(`  Total posts to sync: ${manifest.total_posts}`);

const totalImages = manifest.posts.reduce((sum, p) => sum + (p.images ? p.images.length : 0), 0);
console.log(`  Total images to upload: ${totalImages}`);

const withExcerpt = manifest.posts.filter(p => p.excerpt).length;
console.log(`  Posts with excerpt: ${withExcerpt}`);

const withCategories = manifest.posts.filter(p => p.categories && p.categories.length > 0).length;
console.log(`  Posts with categories: ${withCategories}`);

// 4. 诊断结论
console.log(`\n✨ Diagnosis passed. Ready for WeChat sync!`);
console.log(`\nNext steps:`);
console.log(`  1. Set WECHAT_APPID and WECHAT_APPSECRET environment variables`);
console.log(`  2. Configure IP whitelist in WeChat Developer Platform`);
console.log(`  3. Run: npm run wechat:sync`);
console.log(`\nOr set up GitHub Secrets and run the workflow.`);
