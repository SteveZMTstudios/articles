'use strict';

/**
 * Markdown 渲染器与 HTML 处理
 * 
 * 功能：
 * - 读取 markdown 源文件
 * - 渲染为 HTML（使用 markdown-it）
 * - 提取图片引用
 * - 清洗 HTML（去除不支持的标签和脚本）
 * - 替换图片 URL
 */

const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');

class MarkdownRenderer {
  constructor(config) {
    this.sourceDir = config.sourceDir || 'source';
    this.logger = config.logger || console;
    
    // 初始化 markdown-it (支持 HTML、断行、链接等)
    this.md = new MarkdownIt({
      html: true,
      breaks: true,
      linkify: true,
      typographer: true,
    });

    // 标签白名单（HTML 标签）
    this.tagWhitelist = config.tagWhitelist || [
      'p', 'br', 'div',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'a', 'strong', 'em', 'u', 'i', 'b', 's',
      'img', 'code', 'pre',
      'blockquote',
      'ol', 'ul', 'li',
      'tr', 'td', 'th', 'table', 'tbody', 'thead',
    ];
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
    
    // 移除 front-matter (YAML)
    const contentWithoutFrontMatter = this._removeFrontMatter(rawContent);

    // 移除潜在控制字符，避免微信接口判定为非法内容
    const normalizedContent = contentWithoutFrontMatter
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '');
    
    // 渲染为 HTML
    const html = this.md.render(normalizedContent);
    
    // 清洗 HTML
    const cleanHtml = this._sanitizeHtml(html);
    
    // 提取图片引用（相对路径）
    const images = this._extractImages(cleanHtml);
    
    return {
      html: cleanHtml,
      images: images,
      rawHtml: html, // 用于调试
    };
  }

  /**
   * 替换 HTML 中的图片 URL
   */
  replaceImageUrls(html, imageUrlMap) {
    let result = html;
    
    for (const [oldUrl, newUrl] of Object.entries(imageUrlMap)) {
      // 转义 URL 中的特殊字符
      const escapedOldUrl = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`src=["']${escapedOldUrl}["']`, 'g');
      result = result.replace(regex, `src="${newUrl}"`);
    }
    
    return result;
  }

  // ========== Private Methods ==========

  /**
   * 移除 YAML front-matter
   */
  _removeFrontMatter(content) {
    if (!content) {
      return '';
    }

    // 兼容 UTF-8 BOM + 前导空行 + CRLF/LF
    let normalized = content.replace(/^\uFEFF/, '');
    normalized = normalized.replace(/^(?:[ \t]*\r?\n)+/, '');

    const frontMatterRegex = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;
    return normalized.replace(frontMatterRegex, '');
  }

  /**
   * 清洗 HTML：移除不在白名单中的标签
   */
  _sanitizeHtml(html) {
    // 简单的标签清洗策略：使用正则移除所有不在白名单中的标签
    // 注意：这是一个简单实现；复杂的 HTML 可能需要更强大的 HTML 解析器
    
    // 首先，移除 <script> 和 <style> 标签及其内容
    let cleaned = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    
    // 移除所有事件处理器（onclick, onload 等）
    cleaned = cleaned.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '');
    
    // 移除不在白名单中的标签（保留标签内容）
    const tagRegex = /<(\/?(?!(?:\/)?(?:p|br|div|h[1-6]|a|strong|em|u|i|b|s|img|code|pre|blockquote|ol|ul|li|tr|td|th|table|tbody|thead)\b)[^>]*)>/gi;
    cleaned = cleaned.replace(tagRegex, '');
    
    return cleaned.trim();
  }

  /**
   * 提取 HTML 中的图片 URL（相对路径）
   */
  _extractImages(html) {
    const images = [];
    const imgRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi;
    
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
      const src = match[1];
      images.push(src);
    }
    
    return images;
  }
}

module.exports = { MarkdownRenderer };
