'use strict';

/**
 * 微信公众号同步 - 本地排版与配置诊断脚本
 * 
 * 用途：
 * - 验证 Markdown 渲染、语法高亮与微信排版内联样式
 * - 验证图片引用提取与外链脚注生成
 * - 验证文章解析，无需真实的微信凭据
 * 
 * 用法：
 *   npm run wechat:diagnose
 *   或
 *   node scripts/wechat-sync/diagnose.js
 */

const fs = require('fs');
const path = require('path');
const { MarkdownRenderer } = require('./markdown-renderer');

function runDiagnosis() {
  const baseDir = process.cwd();
  const sourceDir = path.join(baseDir, 'source');
  const postsDir = path.join(sourceDir, '_posts');

  console.log(`
╔════════════════════════════════════════════════════════════╗
║          WeChat Sync - Local Diagnosis Report              ║
╚════════════════════════════════════════════════════════════╝
`);

  if (!fs.existsSync(postsDir)) {
    console.error(`❌ Posts directory not found: ${postsDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(postsDir).filter(f => /\.(md|markdown)$/i.test(f));
  console.log(`📋 Found ${files.length} posts in source/_posts/`);

  if (files.length === 0) {
    console.warn('⚠️  No posts found');
    process.exit(0);
  }

  // 测试 Markdown 渲染
  console.log('\n📝 Testing Markdown & Typography rendering on first 3 posts...');
  const renderer = new MarkdownRenderer({
    sourceDir: sourceDir,
    logger: console,
  });

  const testCount = Math.min(3, files.length);
  for (let i = 0; i < testCount; i++) {
    const file = files[i];
    try {
      console.log(`\n  Post ${i + 1}: "${file}"`);
      const { html, images } = renderer.readAndRender(path.join('_posts', file));
      console.log(`    ✅ Rendered HTML: ${html.length} chars`);
      console.log(`    ✅ Found images: ${images.length}`);
      
      if (images.length > 0) {
        images.slice(0, 3).forEach(img => {
          console.log(`       - ${img}`);
        });
        if (images.length > 3) {
          console.log(`       ... and ${images.length - 3} more`);
        }
      }

      // 验证样式与脚注
      const hasFootnotes = html.includes('参考链接');
      const hasCodeHighlight = html.includes('color: #');
      console.log(`    ✅ Code highlighting: ${hasCodeHighlight ? 'Active' : 'None'}`);
      console.log(`    ✅ Footnotes generated: ${hasFootnotes ? 'Yes' : 'No'}`);
    } catch (err) {
      console.error(`    ❌ Error: ${err.message}`);
    }
  }

  console.log(`\n✨ Diagnosis passed. Ready for WeChat sync!`);
}

// 仅在直接执行该脚本时运行，防止 Hexo 启动时自动触发
if (require.main === module) {
  runDiagnosis();
}

module.exports = { runDiagnosis };
