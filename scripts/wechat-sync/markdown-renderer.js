'use strict';

/**
 * 微信公众号专用 Markdown 渲染器与排版引擎
 * 
 * 特性：
 * - 语法高亮：基于 highlight.js，并将 token class 转换为微信兼容的内联色彩样式
 * - 优雅现代技术风：精致标题层级、圆角深色代码容器、左侧色条引用、斑马纹表格、居中圆角图片
 * - 微信外链转文末脚注：自动提取非锚点超链接为序号，文末生成「参考链接」清单
 * - 清洗 Hexo 专用标签（如 <!-- more -->）与控制字符
 */

const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');
const hljs = require('highlight.js');

// Highlight.js token class -> Inline style 映射（基于 One Dark / GitHub Dark 优化配色）
const HLJS_STYLE_MAP = {
  'hljs-keyword': 'color: #e06c75; font-weight: 600;',
  'hljs-built_in': 'color: #e5c07b;',
  'hljs-type': 'color: #e5c07b;',
  'hljs-literal': 'color: #56b6c2;',
  'hljs-number': 'color: #d19a66;',
  'hljs-operator': 'color: #56b6c2;',
  'hljs-punctuation': 'color: #abb2bf;',
  'hljs-property': 'color: #e06c75;',
  'hljs-regexp': 'color: #98c379;',
  'hljs-string': 'color: #98c379;',
  'hljs-char\\.escape_': 'color: #56b6c2;',
  'hljs-subst': 'color: #e06c75;',
  'hljs-symbol': 'color: #61afef;',
  'hljs-class': 'color: #e5c07b;',
  'hljs-function': 'color: #61afef;',
  'hljs-title': 'color: #61afef; font-weight: 600;',
  'hljs-title\\.class_': 'color: #e5c07b; font-weight: 600;',
  'hljs-title\\.function_': 'color: #61afef;',
  'hljs-params': 'color: #abb2bf;',
  'hljs-comment': 'color: #7f848e; font-style: italic;',
  'hljs-doctag': 'color: #c678dd;',
  'hljs-meta': 'color: #e5c07b;',
  'hljs-meta\\.keyword': 'color: #e06c75;',
  'hljs-meta\\.string': 'color: #98c379;',
  'hljs-variable': 'color: #e06c75;',
  'hljs-variable\\.language_': 'color: #e5c07b;',
  'hljs-attr': 'color: #d19a66;',
  'hljs-attribute': 'color: #98c379;',
  'hljs-section': 'color: #e06c75; font-weight: 600;',
  'hljs-name': 'color: #e06c75; font-weight: 600;',
  'hljs-tag': 'color: #e06c75;',
  'hljs-selector-tag': 'color: #e06c75; font-weight: 600;',
  'hljs-selector-id': 'color: #61afef;',
  'hljs-selector-class': 'color: #e5c07b;',
  'hljs-selector-attr': 'color: #d19a66;',
  'hljs-selector-pseudo': 'color: #56b6c2;',
  'hljs-addition': 'color: #98c379; background-color: rgba(152, 195, 121, 0.15);',
  'hljs-deletion': 'color: #e06c75; background-color: rgba(224, 108, 117, 0.15);',
};

// 预编译替换正则
const HLJS_CLASS_REGEXES = Object.keys(HLJS_STYLE_MAP).map(className => ({
  regex: new RegExp(`<span class="${className.replace('\\.', '\\.')}">`, 'g'),
  style: HLJS_STYLE_MAP[className],
}));

class MarkdownRenderer {
  constructor(config = {}) {
    this.sourceDir = config.sourceDir || 'source';
    this.logger = config.logger || console;
    this.themeColor = config.themeColor || '#0052cc'; // 优雅技术蓝
    this.links = [];

    this._initMarkdownIt();
  }

  _initMarkdownIt() {
    this.md = new MarkdownIt({
      html: true,
      breaks: true,
      linkify: true,
      typographer: true,
      highlight: (str, lang) => {
        let highlightedCode = '';
        const validLang = lang && hljs.getLanguage(lang) ? lang : '';

        if (validLang) {
          try {
            highlightedCode = hljs.highlight(str, { language: validLang, ignoreIllegals: true }).value;
          } catch (_) {
            highlightedCode = this._escapeHtml(str);
          }
        } else {
          highlightedCode = this._escapeHtml(str);
        }

        // 将 highlight.js 生成的 class 转为微信兼容的 inline style
        for (const { regex, style } of HLJS_CLASS_REGEXES) {
          highlightedCode = highlightedCode.replace(regex, `<span style="${style}">`);
        }

        // 清理剩余的未匹配 class
        highlightedCode = highlightedCode.replace(/<span class="hljs-[^"]*">/g, '<span>');

        return `<pre style="margin: 14px 0; padding: 12px 14px; background: #282c34; border-radius: 6px; overflow-x: auto; font-family: Menlo, Monaco, Consolas, 'Courier New', monospace; font-size: 13px; line-height: 1.6; color: #abb2bf; -webkit-overflow-scrolling: touch; white-space: pre; word-wrap: normal;"><code>${highlightedCode}</code></pre>`;
      },
    });

    // 自定义代码块 fence 渲染规则
    this.md.renderer.rules.fence = function (tokens, idx) {
      const token = tokens[idx];
      const info = token.info ? token.info.trim() : '';
      const lang = info ? info.split(/\s+/)[0] : '';
      const str = token.content;

      let highlightedCode = '';
      const validLang = lang && hljs.getLanguage(lang) ? lang : '';

      if (validLang) {
        try {
          highlightedCode = hljs.highlight(str, { language: validLang, ignoreIllegals: true }).value;
        } catch (_) {
          highlightedCode = self._escapeHtml(str);
        }
      } else {
        highlightedCode = self._escapeHtml(str);
      }

      // 将 highlight.js 生成的 class 转为微信兼容的 inline style
      for (const { regex, style } of HLJS_CLASS_REGEXES) {
        highlightedCode = highlightedCode.replace(regex, `<span style="${style}">`);
      }

      // 清理剩余的未匹配 class
      highlightedCode = highlightedCode.replace(/<span class="hljs-[^"]*">/g, '<span>');

      return `<pre style="margin: 14px 0; padding: 12px 14px; background: #282c34; border-radius: 6px; overflow-x: auto; font-family: Menlo, Monaco, Consolas, 'Courier New', monospace; font-size: 13px; line-height: 1.6; color: #abb2bf; -webkit-overflow-scrolling: touch; white-space: pre; word-wrap: normal;"><code>${highlightedCode}</code></pre>\n`;
    };

    // 自定义渲染规则
    this._customRenderRules();
  }

  _customRenderRules() {
    const self = this;

    // 1. 标题 (H1 - H6)
    this.md.renderer.rules.heading_open = function (tokens, idx) {
      const tag = tokens[idx].tag;
      const level = parseInt(tag.substring(1), 10);
      let style = '';

      switch (level) {
        case 1:
          style = `margin: 28px 0 16px; font-size: 20px; font-weight: bold; color: #1f2328; border-bottom: 2px solid ${self.themeColor}; padding-bottom: 8px; line-height: 1.4;`;
          break;
        case 2:
          style = `margin: 24px 0 14px; font-size: 17px; font-weight: bold; color: #1f2328; border-left: 4px solid ${self.themeColor}; padding-left: 10px; line-height: 1.45;`;
          break;
        case 3:
          style = `margin: 20px 0 10px; font-size: 16px; font-weight: bold; color: ${self.themeColor}; line-height: 1.5;`;
          break;
        case 4:
          style = `margin: 16px 0 8px; font-size: 15px; font-weight: bold; color: #333333; line-height: 1.5;`;
          break;
        default:
          style = `margin: 14px 0 6px; font-size: 14px; font-weight: bold; color: #555555; line-height: 1.5;`;
      }
      return `<${tag} style="${style}">`;
    };

    // 2. 段落
    this.md.renderer.rules.paragraph_open = function () {
      return `<p style="margin: 12px 0; line-height: 1.85; font-size: 15px; color: #2b2b2b; text-align: justify; word-break: break-word;">`;
    };

    // 3. 引用块
    this.md.renderer.rules.blockquote_open = function () {
      return `<blockquote style="margin: 16px 0; padding: 12px 16px; background: #f6f8fa; border-left: 4px solid ${self.themeColor}; border-radius: 0 6px 6px 0; color: #57606a; font-size: 14px; line-height: 1.7;">`;
    };

    // 4. 列表 (ul, ol, li)
    this.md.renderer.rules.bullet_list_open = function () {
      return `<ul style="margin: 10px 0; padding-left: 22px; line-height: 1.8; list-style-type: disc;">`;
    };

    this.md.renderer.rules.ordered_list_open = function () {
      return `<ol style="margin: 10px 0; padding-left: 22px; line-height: 1.8; list-style-type: decimal;">`;
    };

    this.md.renderer.rules.list_item_open = function () {
      return `<li style="margin: 4px 0; line-height: 1.8; font-size: 15px; color: #2b2b2b;">`;
    };

    // 5. 行内代码
    this.md.renderer.rules.code_inline = function (tokens, idx) {
      const code = self._escapeHtml(tokens[idx].content);
      return `<code style="padding: 2px 6px; margin: 0 2px; font-size: 13px; font-family: Menlo, Monaco, Consolas, 'Courier New', monospace; background-color: #f3f4f6; color: #c7254e; border-radius: 4px; border: 1px solid #e5e7eb;">${code}</code>`;
    };

    // 6. 表格 (table, thead, tbody, tr, th, td)
    let rowIndex = 0;
    this.md.renderer.rules.table_open = function () {
      rowIndex = 0;
      return `<section style="margin: 16px 0; overflow-x: auto; -webkit-overflow-scrolling: touch;"><table style="width: 100%; border-collapse: collapse; margin: 0; font-size: 14px; word-break: break-word;">`;
    };
    this.md.renderer.rules.table_close = function () {
      return `</table></section>`;
    };
    this.md.renderer.rules.th_open = function () {
      return `<th style="background: #f1f5f9; padding: 10px 12px; border: 1px solid #d0d7de; font-weight: 600; text-align: left; color: #24292f;">`;
    };
    this.md.renderer.rules.tr_open = function () {
      rowIndex++;
      const bg = rowIndex % 2 === 0 ? '#f8fafc' : '#ffffff';
      return `<tr style="background-color: ${bg}; border-top: 1px solid #d0d7de;">`;
    };
    this.md.renderer.rules.td_open = function () {
      return `<td style="padding: 8px 12px; border: 1px solid #d0d7de; line-height: 1.6; color: #24292f;">`;
    };

    // 7. 分割线
    this.md.renderer.rules.hr = function () {
      return `<hr style="border: none; border-top: 1px solid #e1e4e8; margin: 24px 0;" />`;
    };

    // 8. 文本加粗/斜体/删除线
    this.md.renderer.rules.strong_open = function () {
      return `<strong style="font-weight: bold; color: #111827;">`;
    };
    this.md.renderer.rules.em_open = function () {
      return `<em style="font-style: italic; color: #4b5563;">`;
    };
    this.md.renderer.rules.s_open = function () {
      return `<s style="text-decoration: line-through; color: #8c959f;">`;
    };

    // 9. 图片
    this.md.renderer.rules.image = function (tokens, idx) {
      const token = tokens[idx];
      const src = token.attrGet('src') || '';
      const alt = self._escapeHtml(token.content || '');
      const title = token.attrGet('title') ? ` title="${self._escapeHtml(token.attrGet('title'))}"` : '';

      return `<section style="margin: 18px 0; text-align: center;">` +
        `<img src="${src}" alt="${alt}"${title} style="max-width: 100%; height: auto; display: block; margin: 0 auto; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);" />` +
        (alt ? `<figcaption style="margin-top: 6px; font-size: 13px; color: #6b7280; text-align: center;">${alt}</figcaption>` : '') +
        `</section>`;
    };

    // 10. 外链转文末脚注
    this.md.renderer.rules.link_open = function (tokens, idx) {
      const token = tokens[idx];
      const href = token.attrGet('href') || '';

      // 如果是页面内锚点，保持普通文字显示
      if (href.startsWith('#')) {
        return `<span style="color: ${self.themeColor}; font-weight: 500;">`;
      }

      // 提取链接文本（在 link_open 之后收集）
      let linkText = '';
      for (let i = idx + 1; i < tokens.length; i++) {
        if (tokens[i].type === 'link_close') break;
        if (tokens[i].content) linkText += tokens[i].content;
      }

      const linkIndex = self.links.length + 1;
      token.meta = { linkIndex, href, linkText };

      return `<span style="color: ${self.themeColor}; font-weight: 500;">`;
    };

    this.md.renderer.rules.link_close = function (tokens, idx) {
      // 查找对应的 link_open
      let openToken = null;
      for (let i = idx - 1; i >= 0; i--) {
        if (tokens[i].type === 'link_open') {
          openToken = tokens[i];
          break;
        }
      }

      const meta = openToken ? openToken.meta : null;
      if (meta && meta.linkIndex && meta.href) {
        self.links.push({
          index: meta.linkIndex,
          title: meta.linkText || meta.href,
          href: meta.href,
        });
        return `</span><sup style="font-size: 11px; color: ${self.themeColor}; font-weight: bold; margin-left: 2px;">[${meta.linkIndex}]</sup>`;
      }
      return `</span>`;
    };
  }

  /**
   * 读取并渲染 markdown 文件
   */
  readAndRender(sourceFile) {
    const fullPath = path.join(this.sourceDir, sourceFile);
    
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Markdown file not found: ${fullPath}`);
    }

    const rawContent = fs.readFileSync(fullPath, 'utf8');
    return this.renderMarkdown(rawContent);
  }

  /**
   * 直接渲染 Markdown 文本
   */
  renderMarkdown(rawContent) {
    this.links = [];

    // 1. 移除 front-matter
    const contentWithoutFrontMatter = this._removeFrontMatter(rawContent);

    // 2. 清洗 Hexo 专用标签（如 <!-- more -->, {% asset_img %}, etc.）
    let cleanContent = this._cleanHexoTags(contentWithoutFrontMatter);

    // 3. 移除控制字符
    cleanContent = cleanContent.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '');

    // 4. Markdown 渲染为带排版样式的 HTML
    let html = this.md.render(cleanContent);

    // 5. 生成并追加文末「参考链接」脚注清单
    if (this.links.length > 0) {
      html += this._generateFootnotesHtml();
    }

    // 6. 对原生 HTML 标签（如 markdown 中直接写的 <img>、<span>）补充内联样式
    html = this._enhanceRawHtmlTags(html);

    // 7. 外层包裹排版容器
    const finalHtml = `<section style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.85; color: #2b2b2b; word-break: break-word; letter-spacing: 0.5px;">\n${html}\n</section>`;

    // 8. 提取图片列表
    const images = this._extractImages(finalHtml);

    return {
      html: finalHtml,
      images: images,
      rawHtml: html,
    };
  }

  /**
   * 替换 HTML 中的图片 URL
   */
  replaceImageUrls(html, imageUrlMap) {
    let result = html;
    
    for (const [oldUrl, newUrl] of Object.entries(imageUrlMap)) {
      const escapedOldUrl = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`src=["']${escapedOldUrl}["']`, 'g');
      result = result.replace(regex, `src="${newUrl}"`);
    }
    
    return result;
  }

  // ========== Private Methods ==========

  _removeFrontMatter(content) {
    if (!content) return '';
    let normalized = content.replace(/^\uFEFF/, '').replace(/^(?:[ \t]*\r?\n)+/, '');
    const frontMatterRegex = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;
    return normalized.replace(frontMatterRegex, '');
  }

  _cleanHexoTags(content) {
    if (!content) return '';
    let text = content;

    // 清洗 <!-- more -->, <!--more-->
    text = text.replace(/<!--\s*more\s*-->/gi, '');

    // 清洗 Hexo 特殊 tag 插件：如 {% asset_img filename.jpg alt text %}
    text = text.replace(/{%\s*asset_img\s+([^\s]+)(?:\s+([^%]+))?\s*%}/gi, (_, filename, alt) => {
      return `![${(alt || '').trim()}](${filename.trim()})`;
    });

    // 清洗其他通用 Hexo tags：如 {% codeblock %}, {% blockquote %} (保留内容或简化)
    text = text.replace(/{%\s*(?:raw|endraw)\s*%}/gi, '');

    return text;
  }

  _generateFootnotesHtml() {
    let listItems = '';
    for (const item of this.links) {
      const title = this._escapeHtml(item.title || item.href);
      const href = this._escapeHtml(item.href);
      listItems += `<p style="margin: 4px 0; line-height: 1.6; word-break: break-all;"><span style="font-weight: 600; color: ${this.themeColor};">[${item.index}]</span> ${title}: <span style="color: #6b7280;">${href}</span></p>\n`;
    }

    return `\n<section style="margin-top: 36px; padding-top: 18px; border-top: 1px dashed #d0d7de; font-size: 13px; color: #57606a;">` +
      `<h4 style="margin: 0 0 12px; font-size: 14px; font-weight: 600; color: #24292f; border-left: 3px solid ${this.themeColor}; padding-left: 8px; line-height: 1.4;">参考链接</h4>` +
      listItems +
      `</section>`;
  }

  _enhanceRawHtmlTags(html) {
    let out = html;

    // 为原生 <img> 注入自适应和居中样式
    out = out.replace(/<img\b(?![^>]*\bstyle=)([^>]*)>/gi, '<img$1 style="max-width: 100%; height: auto; display: block; margin: 16px auto; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">');

    // 移除无用的空的 span
    out = out.replace(/<span>([\s\S]*?)<\/span>/gi, '$1');

    return out;
  }

  _extractImages(html) {
    const images = [];
    const imgRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi;
    
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
      const src = match[1];
      if (src && !images.includes(src)) {
        images.push(src);
      }
    }
    
    return images;
  }

  _escapeHtml(text) {
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

module.exports = { MarkdownRenderer };
