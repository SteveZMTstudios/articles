---
title: 博客编辑器
date: false
layout: custom
comments: false
excerpt: markdown 博客编辑器
lazyimage: no
---

<!--
Copyright (c) 2026 史蒂夫ZMT工作室 SteveZMTstudios <https://stevezmt.top>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
-->

<!-- CodeMirror Styles (Local Theme Bundle) -->
<link rel="stylesheet" href="/lib/codemirror/codemirror.bundle.css">

<style>
    main#main {
        animation: none !important;
        transform: none !important;
    }

    /* Dark Mode Adaptation */
    .editor-drag-active {
        background-color: rgba(0, 0, 0, 0.05) !important;
    }
    .mdui-theme-layout-dark .editor-drag-active {
        background-color: rgba(255, 255, 255, 0.05) !important;
    }
    
    /* Markdown Preview Dark Mode Fixes */
    .mdui-theme-layout-dark .markdown-body {
        background-color: #424242 !important; /* Match MDUI dark card */
        color: #fff !important;
    }
    .mdui-theme-layout-dark .markdown-body a {
        color: #64b5f6 !important;
    }
    .mdui-theme-layout-dark .markdown-body code {
        background-color: rgba(255, 255, 255, 0.1) !important;
    }
    .mdui-theme-layout-dark .markdown-body pre {
        background-color: #212121 !important;
    }
    
    #editor-card.mdui-fullscreen {
        z-index: 2000; /* Ensure fullscreen editor is above other elements */
    }
    #editor-card .mdui-toolbar {
        background-color: inherit; /* Match card background */
    }
    #editor-card ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    #editor-card .mdui-menu {
        max-height: 300px;
        overflow-x: hidden;
        overflow-y: auto;
    }
    #editor-card .mdui-menu a {
        display: block;
        text-decoration: none;
        color: inherit;
    }

    #editor-card .mdui-menu .mdui-typo a:before {
        height: 0px !important;
    }

    .editor-field-menu,
    .editor-tool-menu {
        max-height: min(300px, calc(100vh - 32px));
        overflow-x: hidden;
        overflow-y: auto;
    }

    .editor-tool-menu {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .editor-tool-menu a {
        display: block;
        text-decoration: none;
        color: inherit;
    }

    .editor-article-card .mdui-card-media > img {
        max-height: 240px;
        width: 100%;
        aspect-ratio: 16 / 9;
        object-fit: cover;
    }

    .editor-article-card .mdui-card-menu .mdui-menu img {
        width: 246px;
        height: 246px;
        display: block;
    }

    .editor-preview-body {
        min-height: 100%;
    }

    .editor-preview-body .center-block {
        display: block !important;
        margin-right: auto !important;
        margin-left: auto !important;
    }

    .editor-preview-body .text-center {
        text-align: center !important;
    }
    .editor-preview-body img {
        max-width: 100%;
        height: auto;
    }

    .editor-setting-switch {
        display: inline-flex;
        align-items: center;
        min-height: 56px;
        margin-top: 8px;
    }

    .editor-select-field {
        min-height: 64px;
        padding-top: 8px;
    }

    .editor-select-label {
        margin-bottom: 4px;
        font-size: 12px;
        line-height: 1.2;
    }

    @media (max-width: 600px) {
        .editor-article-card .mdui-card-menu .mdui-menu img {
            width: 200px;
            height: 200px;
        }
    }
    
    /* CodeMirror Core & Theme Enhancements */
    #editor-container {
        width: 100%;
        height: 100%;
        position: relative;
    }
    .CodeMirror {
        width: 100%;
        height: 100% !important;
        font-family: Consolas, Monaco, "Roboto Mono", "Courier New", monospace;
        font-size: 14px;
        line-height: 1.6;
        color: inherit;
        background: transparent;
        border: none;
    }
    .CodeMirror-scroll {
        height: 100%;
        overflow-y: auto;
        overflow-x: auto;
        box-sizing: border-box;
    }
    .CodeMirror-gutters {
        background: rgba(0, 0, 0, 0.02);
        border-right: 1px solid rgba(0, 0, 0, 0.08);
        white-space: nowrap;
    }
    .CodeMirror-linenumber {
        color: #9e9e9e;
        padding: 0 6px;
        min-width: 20px;
        text-align: right;
    }
    .CodeMirror-activeline-background {
        background: rgba(0, 0, 0, 0.04);
    }
    .CodeMirror-selected {
        background: rgba(33, 150, 243, 0.18) !important;
    }
    .CodeMirror-focused .CodeMirror-selected {
        background: rgba(33, 150, 243, 0.25) !important;
    }
    .CodeMirror-cursor {
        border-left: 2px solid #2196f3;
    }
    .CodeMirror-dialog {
        background: #ffffff;
        color: #212121;
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        z-index: 100;
        font-family: inherit;
        padding: 6px 12px;
    }
    .CodeMirror-dialog input {
        border: 1px solid #ccc;
        outline: none;
        padding: 2px 6px;
        border-radius: 2px;
    }
    .CodeMirror-foldgutter {
        width: 0.3em;
    }
    .CodeMirror-foldgutter-open:after {
        content: "▾";
        color: #999;
    }
    .CodeMirror-foldgutter-folded:after {
        content: "▸";
        color: #2196f3;
        font-weight: bold;
    }

    /* Markdown Highlighting */
    .cm-header { font-weight: bold; color: #1976d2; }
    .cm-link { color: #0288d1; text-decoration: underline; }
    .cm-url { color: #78909c; }
    .cm-quote { color: #388e3c; font-style: italic; }
    .cm-comment { color: #9e9e9e; font-style: italic; }
    .cm-strong { font-weight: bold; }
    .cm-em { font-style: italic; }
    .cm-strikethrough { text-decoration: line-through; }
    .cm-tag { color: #e91e63; }
    .cm-attribute { color: #f57c00; }
    .cm-string { color: #388e3c; }
    .cm-formatting-code, .cm-formatting-code-block { color: #7b1fa2; font-weight: bold; }

    /* CodeMirror Dark Mode (Material Darker / VS Code Dark+ Optimized) */
    .mdui-theme-layout-dark .CodeMirror {
        color: #e0e0e0;
        background: #424242 !important;
    }
    .mdui-theme-layout-dark .CodeMirror-gutters {
        background: #383838;
        border-right: 1px solid rgba(255, 255, 255, 0.08);
    }
    .mdui-theme-layout-dark .CodeMirror-linenumber {
        color: #9e9e9e;
    }
    .mdui-theme-layout-dark .CodeMirror-activeline-background {
        background: rgba(255, 255, 255, 0.06);
    }
    .mdui-theme-layout-dark .CodeMirror-selected {
        background: rgba(100, 181, 246, 0.3) !important;
    }
    .mdui-theme-layout-dark .CodeMirror-focused .CodeMirror-selected {
        background: rgba(100, 181, 246, 0.4) !important;
    }
    .mdui-theme-layout-dark .CodeMirror-cursor {
        border-left: 2px solid #64b5f6;
    }
    .mdui-theme-layout-dark .CodeMirror-dialog {
        background: #424242;
        color: #ffffff;
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    }
    .mdui-theme-layout-dark .CodeMirror-dialog input {
        background: #303030;
        color: #ffffff;
        border: 1px solid #616161;
    }

    /* High-contrast Syntax Tokens in Dark Mode */
    .mdui-theme-layout-dark .CodeMirror span.cm-header,
    .mdui-theme-layout-dark .CodeMirror .cm-header { color: #64b5f6; font-weight: bold; }
    
    .mdui-theme-layout-dark .CodeMirror span.cm-keyword,
    .mdui-theme-layout-dark .CodeMirror .cm-keyword { color: #c792ea; font-weight: 500; }
    
    .mdui-theme-layout-dark .CodeMirror span.cm-atom,
    .mdui-theme-layout-dark .CodeMirror .cm-atom { color: #f07178; }
    
    .mdui-theme-layout-dark .CodeMirror span.cm-number,
    .mdui-theme-layout-dark .CodeMirror .cm-number { color: #ffb74d; }
    
    .mdui-theme-layout-dark .CodeMirror span.cm-def,
    .mdui-theme-layout-dark .CodeMirror .cm-def { color: #82aaff; }
    
    .mdui-theme-layout-dark .CodeMirror span.cm-variable,
    .mdui-theme-layout-dark .CodeMirror .cm-variable { color: #e0e0e0; }
    
    .mdui-theme-layout-dark .CodeMirror span.cm-variable-2,
    .mdui-theme-layout-dark .CodeMirror .cm-variable-2 { color: #80cbc4; } /* Replaces #05a navy with clear teal/mint */
    
    .mdui-theme-layout-dark .CodeMirror span.cm-variable-3,
    .mdui-theme-layout-dark .CodeMirror span.cm-type,
    .mdui-theme-layout-dark .CodeMirror .cm-variable-3,
    .mdui-theme-layout-dark .CodeMirror .cm-type { color: #ffd54f; } /* Replaces #085 dark green with gold */
    
    .mdui-theme-layout-dark .CodeMirror span.cm-property,
    .mdui-theme-layout-dark .CodeMirror .cm-property { color: #80d8ff; }
    
    .mdui-theme-layout-dark .CodeMirror span.cm-operator,
    .mdui-theme-layout-dark .CodeMirror .cm-operator { color: #89ddff; }
    
    .mdui-theme-layout-dark .CodeMirror span.cm-comment,
    .mdui-theme-layout-dark .CodeMirror .cm-comment { color: #9e9e9e; font-style: italic; }
    
    .mdui-theme-layout-dark .CodeMirror span.cm-string,
    .mdui-theme-layout-dark .CodeMirror span.cm-string-2,
    .mdui-theme-layout-dark .CodeMirror .cm-string,
    .mdui-theme-layout-dark .CodeMirror .cm-string-2 { color: #c3e88d; } /* Replaces #a11 & #f50 with crisp lime green */
    
    .mdui-theme-layout-dark .CodeMirror span.cm-meta,
    .mdui-theme-layout-dark .CodeMirror span.cm-qualifier,
    .mdui-theme-layout-dark .CodeMirror .cm-meta,
    .mdui-theme-layout-dark .CodeMirror .cm-qualifier { color: #ffcb6b; }
    
    .mdui-theme-layout-dark .CodeMirror span.cm-builtin,
    .mdui-theme-layout-dark .CodeMirror .cm-builtin { color: #ff80ab; } /* Replaces #30a dark violet with bright pink */
    
    .mdui-theme-layout-dark .CodeMirror span.cm-bracket,
    .mdui-theme-layout-dark .CodeMirror .cm-bracket { color: #cfd8dc; }
    
    .mdui-theme-layout-dark .CodeMirror span.cm-tag,
    .mdui-theme-layout-dark .CodeMirror .cm-tag { color: #f07178; } /* Replaces #170 dark green with coral */
    
    .mdui-theme-layout-dark .CodeMirror span.cm-attribute,
    .mdui-theme-layout-dark .CodeMirror .cm-attribute { color: #ffcb6b; } /* Replaces #00c dark blue with amber */
    
    .mdui-theme-layout-dark .CodeMirror span.cm-hr,
    .mdui-theme-layout-dark .CodeMirror .cm-hr { color: #757575; }
    
    .mdui-theme-layout-dark .CodeMirror span.cm-link,
    .mdui-theme-layout-dark .CodeMirror .cm-link { color: #80d8ff; text-decoration: underline; } /* Replaces #00c dark blue */
    
    .mdui-theme-layout-dark .CodeMirror span.cm-url,
    .mdui-theme-layout-dark .CodeMirror .cm-url { color: #b0bec5; }
    
    .mdui-theme-layout-dark .CodeMirror span.cm-quote,
    .mdui-theme-layout-dark .CodeMirror .cm-quote { color: #aed581; font-style: italic; }
    
    .mdui-theme-layout-dark .CodeMirror span.cm-formatting-code,
    .mdui-theme-layout-dark .CodeMirror span.cm-formatting-code-block,
    .mdui-theme-layout-dark .CodeMirror .cm-formatting-code,
    .mdui-theme-layout-dark .CodeMirror .cm-formatting-code-block { color: #ce93d8; }
    
    .mdui-theme-layout-dark .CodeMirror span.cm-strong,
    .mdui-theme-layout-dark .CodeMirror .cm-strong { color: #ffffff; font-weight: bold; }
    
    .mdui-theme-layout-dark .CodeMirror span.cm-em,
    .mdui-theme-layout-dark .CodeMirror .cm-em { color: #f5f5f5; font-style: italic; }
    
    .mdui-theme-layout-dark .CodeMirror span.cm-strikethrough,
    .mdui-theme-layout-dark .CodeMirror .cm-strikethrough { text-decoration: line-through; color: #9e9e9e; }

</style>

<div id="app" class="mdui-container-fluid mdui-p-y-2">
  <article class="mdui-card mdui-m-b-2 editor-article-card" id="editor-article-preview"></article>

  <!-- Toolbar & Config -->
  <div class="mdui-card mdui-p-a-2 mdui-m-b-2">
    <div class="mdui-row">
      <div class="mdui-col-md-6">
        <div class="mdui-textfield mdui-textfield-floating-label">
          <label class="mdui-textfield-label">文章标题</label>
          <input class="mdui-textfield-input" type="text" id="post-title" />
        </div>
      </div>
      <div class="mdui-col-md-6" style="display: flex; align-items: flex-end;">
        <div class="mdui-textfield mdui-textfield-floating-label" style="flex: 1;">
          <label class="mdui-textfield-label">标识符</label>
          <input class="mdui-textfield-input" type="text" id="post-slug" />
        </div>
      </div>
    </div>
    <div class="mdui-row">
      <div class="mdui-col-md-6">
        <div class="mdui-textfield mdui-textfield-floating-label" style="position: relative;">
          <label class="mdui-textfield-label">标签 (逗号分隔)</label>
          <input class="mdui-textfield-input" type="text" id="post-tags" autocomplete="off" />
          <ul class="mdui-menu editor-field-menu" id="tag-menu"></ul>
        </div>
      </div>
      <div class="mdui-col-md-6">
        <div class="mdui-textfield mdui-textfield-floating-label" style="position: relative;">
          <label class="mdui-textfield-label">分类 (逗号分隔)</label>
          <input class="mdui-textfield-input" type="text" id="post-categories" autocomplete="off" />
          <ul class="mdui-menu editor-field-menu" id="category-menu"></ul>
        </div>
      </div>
    </div>
    <div class="mdui-row mdui-m-t-1">
        <div class="mdui-col-xs-12">
            <div class="mdui-panel" mdui-panel>
                <div class="mdui-panel-item">
                    <div class="mdui-panel-item-header">
                        <div class="mdui-panel-item-title">高级设置 (Front-matter)</div>
                        <i class="mdui-panel-item-arrow mdui-icon material-icons">keyboard_arrow_down</i>
                    </div>
                    <div class="mdui-panel-item-body">
                        <div class="mdui-row">
                            <div class="mdui-col-md-3 mdui-col-xs-6">
                                <label class="mdui-checkbox">
                                    <input type="checkbox" id="post-donate" checked/>
                                    <i class="mdui-checkbox-icon"></i>
                                    开启打赏
                                </label>
                            </div>
                            <div class="mdui-col-md-3 mdui-col-xs-6">
                                <label class="mdui-checkbox">
                                    <input type="checkbox" id="post-toc" checked/>
                                    <i class="mdui-checkbox-icon"></i>
                                    显示目录
                                </label>
                            </div>
                            <div class="mdui-col-md-3 mdui-col-xs-6">
                                <label class="mdui-checkbox">
                                    <input type="checkbox" id="post-comments" checked/>
                                    <i class="mdui-checkbox-icon"></i>
                                    开启评论
                                </label>
                            </div>
                            <div class="mdui-col-md-3 mdui-col-xs-6">
                                <label class="mdui-checkbox">
                                    <input type="checkbox" id="post-top"/>
                                    <i class="mdui-checkbox-icon"></i>
                                    置顶文章
                                </label>
                            </div>
                        </div>
                        <div class="mdui-row mdui-m-t-1">
                             <div class="mdui-col-md-6">
                                <div class="mdui-textfield mdui-textfield-floating-label">
                                  <label class="mdui-textfield-label">自定义日期 (YYYY-MM-DD HH:mm:ss)</label>
                                  <input class="mdui-textfield-input" type="text" id="post-date" />
                                </div>
                             </div>
                             <div class="mdui-col-md-6">
                                <div class="mdui-textfield mdui-textfield-floating-label">
                                  <label class="mdui-textfield-label">作者 (Author)</label>
                                  <input class="mdui-textfield-input" type="text" id="post-author" />
                                </div>
                             </div>
                        </div>
                        <div class="mdui-row">
                             <div class="mdui-col-md-6">
                                <div class="mdui-textfield mdui-textfield-floating-label">
                                  <label class="mdui-textfield-label">头图 URL (Thumbnail)</label>
                                  <input class="mdui-textfield-input" type="text" id="post-thumbnail" />
                                </div>
                             </div>
                             <div class="mdui-col-md-6" style="display: flex; align-items: flex-end;">
                                <button class="mdui-btn mdui-btn-raised mdui-ripple mdui-m-b-1" onclick="document.getElementById('thumbnail-input').click()">
                                    <i class="mdui-icon material-icons">image</i> 上传头图
                                </button>
                                <input type="file" id="thumbnail-input" accept="image/*" style="display: none;" />
                             </div>
                        </div>
                        <div class="mdui-row">
                            <div class="mdui-col-md-3 mdui-col-xs-6">
                                <label class="mdui-checkbox">
                                    <input type="checkbox" id="post-count" checked/>
                                    <i class="mdui-checkbox-icon"></i>
                                    阅读统计
                                </label>
                            </div>
                            <div class="mdui-col-md-3 mdui-col-xs-6">
                                <label class="mdui-checkbox">
                                    <input type="checkbox" id="post-share_menu" checked/>
                                    <i class="mdui-checkbox-icon"></i>
                                    分享菜单
                                </label>
                            </div>
                            <div class="mdui-col-md-3 mdui-col-xs-6">
                                <label class="mdui-checkbox">
                                    <input type="checkbox" id="post-qrcode" checked/>
                                    <i class="mdui-checkbox-icon"></i>
                                    二维码
                                </label>
                            </div>
                            <div class="mdui-col-md-3 mdui-col-xs-6">
                                <label class="mdui-checkbox">
                                    <input type="checkbox" id="post-thislink" checked/>
                                    <i class="mdui-checkbox-icon"></i>
                                    页尾链接
                                </label>
                            </div>
                        </div>
                        <div class="mdui-row">
                             <div class="mdui-col-md-12">
                                <div class="mdui-textfield mdui-textfield-floating-label">
                                  <label class="mdui-textfield-label">摘要 (Excerpt) - 覆盖自动抓取的摘要</label>
                                  <textarea class="mdui-textfield-input" id="post-excerpt"></textarea>
                                </div>
                             </div>
                        </div>
                        <div class="mdui-row">
                             <div class="mdui-col-md-4">
                                <div class="editor-select-field">
                                  <div class="editor-select-label mdui-text-color-grey-600">文章语言</div>
                                  <select class="mdui-select" id="post-lang" mdui-select="{position: 'bottom'}">
                                    <option value="zh-cn">简体中文</option>
                                    <option value="en">English</option>
                                  </select>
                                </div>
                             </div>
                             <div class="mdui-col-md-4">
                                <label class="mdui-checkbox editor-setting-switch">
                                    <input type="checkbox" id="post-license-enabled" checked/>
                                    <i class="mdui-checkbox-icon"></i>
                                    显示版权声明
                                </label>
                             </div>
                             <div class="mdui-col-md-4">
                                <label class="mdui-checkbox editor-setting-switch">
                                    <input type="checkbox" id="post-wechat_sync" checked/>
                                    <i class="mdui-checkbox-icon"></i>
                                    微信同步 (wechat_sync)
                                </label>
                             </div>
                        </div>
                        <div class="mdui-row" id="license-custom-row">
                             <div class="mdui-col-md-12">
                                <div class="mdui-textfield mdui-textfield-floating-label">
                                  <label class="mdui-textfield-label">自定义版权声明 (可选)</label>
                                  <input class="mdui-textfield-input" type="text" id="post-license" />
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

<div class="mdui-row mdui-m-t-2">
      <div class="mdui-col-xs-12">
        <button class="mdui-btn mdui-btn-raised mdui-color-green-600 mdui-ripple mdui-m-r-1" onclick="submitToGitHub()">
          <i class="mdui-icon material-icons">cloud_upload</i> 发布到 GitHub
        </button>
        <button class="mdui-btn mdui-btn-raised mdui-color-theme-accent mdui-ripple" onclick="exportPost()">
          <i class="mdui-icon material-icons">file_download</i> 导出 ZIP
        </button>
        <button class="mdui-btn mdui-btn-raised mdui-ripple" onclick="document.getElementById('zip-input').click()">
          <i class="mdui-icon material-icons">file_upload</i> 导入 ZIP
        </button>
        <button class="mdui-btn mdui-btn-raised mdui-ripple" onclick="resetEditor()">
          <i class="mdui-icon material-icons">refresh</i> 重置
        </button>
        <input type="file" id="zip-input" accept=".zip" style="display: none;" />
        <input type="file" id="image-input" accept="image/*" multiple style="display: none;" />
      </div>
    </div>
  </div>

  <!-- Editor Area -->
  <div class="mdui-card" id="editor-card" style="height: 70vh; display: flex; flex-direction: column; position: relative; overflow: hidden;">
    <div class="mdui-toolbar" style="flex-shrink: 0; overflow-x: auto; overflow-y: hidden; white-space: nowrap; border-bottom: 1px solid rgba(0,0,0,0.1);">
      <!-- History/General -->
      <button class="mdui-btn mdui-btn-icon" onclick="undo()" mdui-tooltip="{content: '撤销 (Ctrl+Z)'}"><i class="mdui-icon material-icons">undo</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="redo()" mdui-tooltip="{content: '重做 (Ctrl+Y)'}"><i class="mdui-icon material-icons">redo</i></button>
      <!-- Text Style -->
      <button class="mdui-btn mdui-btn-icon" onclick="insertText('**', '**')" mdui-tooltip="{content: '粗体 (Ctrl+B)'}"><i class="mdui-icon material-icons">format_bold</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="insertText('*', '*')" mdui-tooltip="{content: '斜体 (Ctrl+I)'}"><i class="mdui-icon material-icons">format_italic</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="insertText('<u>', '</u>')" mdui-tooltip="{content: '下划线 (Ctrl+U)'}"><i class="mdui-icon material-icons">format_underlined</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="insertText('~~', '~~')" mdui-tooltip="{content: '删除线 (Ctrl+Shift+X)'}"><i class="mdui-icon material-icons">format_strikethrough</i></button>
      <button class="mdui-btn mdui-btn-icon" id="font-size-btn" mdui-tooltip="{content: '字体大小'}"><i class="mdui-icon material-icons">format_size</i></button>
      <button class="mdui-btn mdui-btn-icon" id="text-color-btn" mdui-tooltip="{content: '文本颜色'}"><i class="mdui-icon material-icons">format_color_text</i></button>
      <!-- Paragraph Style -->
      <button class="mdui-btn mdui-btn-icon" onclick="insertHeading(1)" mdui-tooltip="{content: '标题 (Ctrl+Alt+1~6)'}"><i class="mdui-icon material-icons">title</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="setAlign('left')" mdui-tooltip="{content: '左对齐'}"><i class="mdui-icon material-icons">format_align_left</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="setAlign('center')" mdui-tooltip="{content: '居中对齐'}"><i class="mdui-icon material-icons">format_align_center</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="setAlign('right')" mdui-tooltip="{content: '右对齐'}"><i class="mdui-icon material-icons">format_align_right</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="clearFormatting()" mdui-tooltip="{content: '清除格式'}"><i class="mdui-icon material-icons">format_clear</i></button>
      <!-- Insert -->
      <button class="mdui-btn mdui-btn-icon" onclick="insertList()" mdui-tooltip="{content: '列表'}"><i class="mdui-icon material-icons">format_list_bulleted</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="insertLink()" mdui-tooltip="{content: '链接 (Ctrl+K)'}"><i class="mdui-icon material-icons">link</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="document.getElementById('image-input').click()" mdui-tooltip="{content: '插入图片'}"><i class="mdui-icon material-icons">image</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="insertTable()" mdui-tooltip="{content: '表格'}"><i class="mdui-icon material-icons">grid_on</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="insertText('```\n', '\n```')" mdui-tooltip="{content: '代码块 (Ctrl+Shift+K)'}"><i class="mdui-icon material-icons">code</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="insertDetails()" mdui-tooltip="{content: '折叠块 (Ctrl+Shift+D)'}"><i class="mdui-icon material-icons">unfold_more</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="insertText('\n<!-- more -->\n', '')" mdui-tooltip="{content: '插入摘要分隔符'}"><i class="mdui-icon material-icons">more_horiz</i></button>
      <div class="mdui-toolbar-spacer"></div>
      <!-- View -->
      <button class="mdui-btn mdui-btn-icon" onclick="toggleFullscreen()" mdui-tooltip="{content: '全屏模式'}"><i class="mdui-icon material-icons" id="fullscreen-icon">fullscreen</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="togglePreview()" mdui-tooltip="{content: '切换预览'}"><i class="mdui-icon material-icons">visibility</i></button>
      <!-- Menus (Must be siblings of triggers) -->
      <ul class="mdui-menu editor-tool-menu" id="font-size-menu">
        <li class="mdui-menu-item"><a style="font-size:12px" href="javascript:;" onclick="setFontSize('12px')">12px (小)</a></li>
        <li class="mdui-menu-item"><a style="font-size:14px" href="javascript:;" onclick="setFontSize('14px')">14px (正常)</a></li>
        <li class="mdui-menu-item"><a style="font-size:16px" href="javascript:;" onclick="setFontSize('16px')">16px (中)</a></li>
        <li class="mdui-menu-item"><a style="font-size:20px" href="javascript:;" onclick="setFontSize('20px')">20px (大)</a></li>
        <li class="mdui-menu-item mdui-p-a-2" style="max-width: 240px;">
            <div class="mdui-typo-caption mdui-text-color-grey-600 mdui-text-center">自定义大小</div>
            <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
                <label class="mdui-slider mdui-slider-discrete" style="width: 90%; margin: 0 auto;">
                    <input type="range" step="1" min="10" max="60" value="16" style="width: 100%;" oninput="document.getElementById('custom-font-size-val').innerText = this.value + 'px'" onchange="setFontSize(this.value + 'px')"/>
                </label>
                <div class="mdui-text-center mdui-text-color-grey-600" id="custom-font-size-val" style="width: 100%;">16px</div>
            </div>
        </li>
      </ul>
      <ul class="mdui-menu editor-tool-menu" id="text-color-menu">
        <li class="mdui-menu-item"><a href="javascript:;" onclick="setColor('#F44336')" class="mdui-text-color-red">● Red</a></li>
        <li class="mdui-menu-item"><a href="javascript:;" onclick="setColor('#E91E63')" class="mdui-text-color-pink">● Pink</a></li>
        <li class="mdui-menu-item"><a href="javascript:;" onclick="setColor('#9C27B0')" class="mdui-text-color-purple">● Purple</a></li>
        <li class="mdui-menu-item"><a href="javascript:;" onclick="setColor('#2196F3')" class="mdui-text-color-blue">● Blue</a></li>
        <li class="mdui-menu-item"><a href="javascript:;" onclick="setColor('#00BCD4')" class="mdui-text-color-cyan">● Cyan</a></li>
        <li class="mdui-menu-item"><a href="javascript:;" onclick="setColor('#4CAF50')" class="mdui-text-color-green">● Green</a></li>
        <li class="mdui-menu-item"><a href="javascript:;" onclick="setColor('#FFEB3B')" class="mdui-text-color-yellow">● Yellow</a></li>
        <li class="mdui-menu-item"><a href="javascript:;" onclick="setColor('#FF9800')" class="mdui-text-color-orange">● Orange</a></li>
        <li class="mdui-menu-item"><a href="javascript:;" onclick="setColor('#9E9E9E')" class="mdui-text-color-grey">● Grey</a></li>
        <li class="mdui-menu-item"><a href="javascript:;" onclick="setColor('#000000')" class="mdui-text-color-black">● Black</a></li>
        <li class="mdui-menu-item"><a href="javascript:;" onclick="setColor('#FFFFFF')" class="mdui-text-color-white mdui-color-grey-800">● White</a></li>
        <li class="mdui-divider"></li>
        <li class="mdui-menu-item mdui-p-a-1">
            <div class="mdui-row mdui-valign mdui-m-0">
                <div class="mdui-col-xs-8 mdui-p-0">
                    <input type="color" id="custom-color-input" value="#000000" style="width: 100%; height: 30px; border: none; cursor: pointer; background: transparent;">
                </div>
                <div class="mdui-col-xs-4 mdui-p-0 mdui-text-right">
                    <button class="mdui-btn mdui-btn-icon mdui-btn-dense mdui-ripple" onclick="setColor(document.getElementById('custom-color-input').value)" mdui-tooltip="{content: '应用颜色'}">
                        <i class="mdui-icon material-icons">check</i>
                    </button>
                </div>
            </div>
        </li>
      </ul>
    </div>
    
<div class="editor-workspace" style="flex: 1 1 0; min-height: 0; position: relative; overflow: hidden; display: flex;">
      <div id="editor-col" style="flex: 1 1 100%; width: 100%; height: 100%; overflow: hidden; position: relative;">
        <div id="editor-container"></div>
      </div>
      <div class="mdui-p-a-2 markdown-body" id="preview-content" style="flex: 1 1 100%; width: 100%; height: 100%; overflow-y: auto; display: none; box-sizing: border-box;">
        <!-- Preview will be rendered here -->
      </div>
    </div>
    <div id="save-status" style="position: absolute; bottom: 16px; right: 24px; font-size: 12px; pointer-events: none; z-index: 10;"></div>
  </div>
</div>

<!-- Dependencies -->
<script src="https://gcore.jsdelivr.net/npm/marked/marked.min.js"></script>
<script src="https://gcore.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>
<script src="https://gcore.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js"></script>
<script src="https://gcore.jsdelivr.net/npm/browser-image-compression@2.0.2/dist/browser-image-compression.js"></script>
<script src="https://unpkg.com/idb-keyval@6.2.1/dist/umd.js"></script>

<!-- CodeMirror 5 Bundle (Core, Modes & Addons) -->
<script src="/lib/codemirror/codemirror.bundle.js"></script>

<script>
// --- State & Config ---
let cmEditor = null;
let imageAssets = {}; // In-memory cache of images: { filename: Blob }
let previewObjectUrls = [];
let _cachedMaterialThumbnail = null; // Cache for deterministic material image
const DB_KEY_CONTENT = 'blog_editor_content';
const DB_KEY_IMAGES = 'blog_editor_images';
const DEFAULT_POST_AUTHOR = 'Steve ZMT';
const SITE_ORIGIN = window.location.origin;

// --- Auto-save Timer ---
let autoSaveTimer;
function triggerAutoSave() {
    const status = document.getElementById('save-status');
    if (status) {
        status.innerHTML = '<span class="mdui-text-color-grey-500" style="display: flex; align-items: center;"> 正在保存... </span>';
    }
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(saveState, 1500);
}

function getEditorContent() {
    return cmEditor ? cmEditor.getValue() : '';
}

function setEditorContent(val) {
    if (cmEditor) {
        cmEditor.setValue(val || '');
        cmEditor.clearHistory();
    }
}

function getEditorSelectionText() {
    return cmEditor ? cmEditor.getSelection() : '';
}

function undo() {
    if (cmEditor) {
        cmEditor.undo();
        cmEditor.focus();
    }
}

function redo() {
    if (cmEditor) {
        cmEditor.redo();
        cmEditor.focus();
    }
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize CodeMirror 5
    const editorMount = document.getElementById('editor-container');
    cmEditor = CodeMirror(editorMount, {
        value: '',
        mode: { name: 'gfm', gitHubSpice: false, highlightFormatting: true },
        lineNumbers: true,
        lineWrapping: true,
        styleActiveLine: true,
        autoCloseBrackets: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        extraKeys: {
            "Ctrl-B": () => insertText('**', '**'),
            "Cmd-B": () => insertText('**', '**'),
            "Ctrl-I": () => insertText('*', '*'),
            "Cmd-I": () => insertText('*', '*'),
            "Ctrl-U": () => insertText('<u>', '</u>'),
            "Cmd-U": () => insertText('<u>', '</u>'),
            "Ctrl-Shift-X": () => insertText('~~', '~~'),
            "Cmd-Shift-X": () => insertText('~~', '~~'),
            "Alt-Shift-5": () => insertText('~~', '~~'),
            "Ctrl-K": () => insertLink(),
            "Cmd-K": () => insertLink(),
            "Ctrl-Shift-K": () => insertText('```\n', '\n```'),
            "Cmd-Shift-K": () => insertText('```\n', '\n```'),
            "Ctrl-Shift-C": () => insertText('```\n', '\n```'),
            "Cmd-Shift-C": () => insertText('```\n', '\n```'),
            "Ctrl-Shift-D": () => insertDetails(),
            "Cmd-Shift-D": () => insertDetails(),
            "Ctrl-S": () => { saveState(); mdui.snackbar({message: '已保存至本地缓存', position: 'bottom'}); },
            "Cmd-S": () => { saveState(); mdui.snackbar({message: '已保存至本地缓存', position: 'bottom'}); },
            "Enter": "newlineAndIndentContinueMarkdownList",
            "Tab": (cm) => {
                if (cm.somethingSelected()) {
                    cm.indentSelection('add');
                } else {
                    cm.replaceSelection('    ', 'end');
                }
            },
            "Shift-Tab": (cm) => {
                cm.indentSelection('subtract');
            },
            "Ctrl-Alt-1": () => insertHeading(1),
            "Ctrl-Alt-2": () => insertHeading(2),
            "Ctrl-Alt-3": () => insertHeading(3),
            "Ctrl-Alt-4": () => insertHeading(4),
            "Ctrl-Alt-5": () => insertHeading(5),
            "Ctrl-Alt-6": () => insertHeading(6)
        }
    });

    // Listen to changes in CodeMirror
    cmEditor.on('change', () => {
        updatePreview();
        triggerAutoSave();
    });

    // Handle Drag & Drop inside CodeMirror
    cmEditor.on('dragover', (cm, e) => {
        e.preventDefault();
        editorMount.classList.add('editor-drag-active');
    });
    cmEditor.on('dragleave', (cm, e) => {
        e.preventDefault();
        editorMount.classList.remove('editor-drag-active');
    });
    cmEditor.on('drop', (cm, e) => {
        editorMount.classList.remove('editor-drag-active');
        const files = e.dataTransfer && e.dataTransfer.files;
        if (files && files.length) {
            e.preventDefault();
            processImageFiles(files);
        }
    });

    // Handle Image Paste inside CodeMirror
    cmEditor.on('paste', (cm, e) => {
        const items = e.clipboardData && e.clipboardData.items;
        if (items) {
            const imageFiles = [];
            for (let i = 0; i < items.length; i++) {
                if (items[i].type && items[i].type.startsWith('image/')) {
                    const file = items[i].getAsFile();
                    if (file) imageFiles.push(file);
                }
            }
            if (imageFiles.length > 0) {
                e.preventDefault();
                processImageFiles(imageFiles);
            }
        }
    });

    // Initialize Floating Menus
    const toolbarMenus = [
        initFloatingMenu('#font-size-btn', '#font-size-menu', { align: 'auto' }),
        initFloatingMenu('#text-color-btn', '#text-color-menu', { align: 'auto' })
    ];
    const editorToolbar = document.querySelector('#editor-card > .mdui-toolbar');
    if (editorToolbar) {
        editorToolbar.addEventListener('scroll', () => {
            toolbarMenus.forEach(menu => {
                if (menu && menu.isOpen()) menu.readjust();
            });
        }, { passive: true });
    }

    // Configure Marked Renderer for Image Preview
    const renderer = {
        image(href, title, text) {
            if (typeof href === 'object' && href !== null) {
                const token = href;
                href = token.href;
                title = token.title;
                text = token.text;
            }

            if (typeof href === 'string' && href) {
                const filename = href.split('/').pop();
                const decodedFilename = decodeURIComponent(filename);
                
                if (imageAssets[decodedFilename]) {
                    const url = getPreviewImageSrc(href);
                    return `<${'img'} src="${escapeAttribute(url)}" alt="${escapeAttribute(text)}" title="${escapeAttribute(title || '')}" style="max-width: 100%;" />`;
                }
            }
            return `<${'img'} src="${escapeAttribute(href)}" alt="${escapeAttribute(text)}"${title ? ` title="${escapeAttribute(title)}"` : ''} style="max-width: 100%;">`;
        }
    };
    marked.use({ renderer });

    // Ensure idbKeyval is available
    if (typeof idbKeyval === 'undefined') {
        console.error('idbKeyval library not loaded!');
        mdui.snackbar({message: '自动保存功能不可用 (库加载失败)'});
    } else {
        // Load saved state
        try {
            const savedContent = await idbKeyval.get(DB_KEY_CONTENT);
            if (savedContent) {
                document.getElementById('post-title').value = savedContent.title || '';
                document.getElementById('post-slug').value = savedContent.slug || '';
                document.getElementById('post-tags').value = savedContent.tags || '';
                document.getElementById('post-categories').value = savedContent.categories || '';
                setEditorContent(savedContent.content || '');
                
                // Load advanced settings
                document.getElementById('post-donate').checked = savedContent.donate !== false;
                document.getElementById('post-toc').checked = savedContent.toc !== false;
                document.getElementById('post-comments').checked = savedContent.comments !== false;
                document.getElementById('post-top').checked = savedContent.top === true;
                if(savedContent.date) document.getElementById('post-date').value = savedContent.date;
                
                if(savedContent.author) document.getElementById('post-author').value = savedContent.author;
                if(savedContent.thumbnail) document.getElementById('post-thumbnail').value = savedContent.thumbnail;
                if(savedContent.excerpt) document.getElementById('post-excerpt').value = savedContent.excerpt;
                applyLicenseFrontMatterValue(savedContent.license || '');
                if(savedContent.lang) document.getElementById('post-lang').value = savedContent.lang;
                if(savedContent.wechat_sync !== undefined) document.getElementById('post-wechat_sync').checked = savedContent.wechat_sync;
                
                document.getElementById('post-count').checked = savedContent.count !== false;
                document.getElementById('post-share_menu').checked = savedContent.share_menu !== false;
                document.getElementById('post-qrcode').checked = savedContent.qrcode !== false;
                document.getElementById('post-thislink').checked = savedContent.thislink !== false;

                mdui.updateTextFields();
            }
            
            const savedImages = await idbKeyval.get(DB_KEY_IMAGES);
            if (savedImages) {
                imageAssets = savedImages;
            }
            updateLicenseVisibility();
            updatePreviewAll();
        } catch (e) {
            console.error("Failed to load saved state", e);
            updateLicenseVisibility();
            updatePreviewAll();
        }
    }

    // Attach auto-save to all other inputs
    document.querySelectorAll('.mdui-textfield-input, input[type="checkbox"], select').forEach(input => {
        input.addEventListener('input', triggerAutoSave);
        input.addEventListener('change', triggerAutoSave);
    });

    const licenseSwitch = document.getElementById('post-license-enabled');
    if (licenseSwitch) {
        licenseSwitch.addEventListener('change', () => {
            updateLicenseVisibility();
            triggerAutoSave();
        });
    }

    ['post-title', 'post-slug', 'post-date', 'post-author', 'post-thumbnail', 'post-count', 'post-qrcode', 'post-share_menu'].forEach(id => {
        const input = document.getElementById(id);
        if (!input) return;
        input.addEventListener('input', updateHeaderPreview);
        input.addEventListener('change', updateHeaderPreview);
    });
    
    // File inputs
    const imgInput = document.getElementById('image-input');
    if (imgInput) imgInput.addEventListener('change', handleImageSelect);
    const thumbInput = document.getElementById('thumbnail-input');
    if (thumbInput) thumbInput.addEventListener('change', handleThumbnailSelect);
    const zipInput = document.getElementById('zip-input');
    if (zipInput) zipInput.addEventListener('change', handleZipImport);
    
    // Fetch Tags and Categories
    initTaxonomyMenus();

    // --- Gutter line-number click/drag selection (VS Code / Word style) ---
    // Clicking a line number selects the whole line.
    // Click-and-drag (or Shift+click) extends the selection across multiple lines.
    (function initGutterLineSelect(cm) {
        let dragAnchorLine = null; // the line where the drag started

        // Select a range of whole lines [fromLine, toLine] (inclusive)
        function selectLines(fromLine, toLine) {
            const doc = cm.getDoc();
            const lastLine = Math.max(fromLine, toLine);
            const firstLine = Math.min(fromLine, toLine);
            const endCh = doc.getLine(lastLine) !== undefined ? doc.getLine(lastLine).length : 0;
            // If drag went upward, anchor is bottom of lastLine, head is start of firstLine
            if (fromLine <= toLine) {
                doc.setSelection(
                    { line: firstLine, ch: 0 },
                    { line: lastLine, ch: endCh }
                );
            } else {
                doc.setSelection(
                    { line: lastLine, ch: endCh },
                    { line: firstLine, ch: 0 }
                );
            }
        }

        cm.on('gutterClick', function(cm, lineNum, gutterId, event) {
            // Only handle clicks on line-number gutter
            if (gutterId !== 'CodeMirror-linenumbers') return;
            event.preventDefault();

            if (event.shiftKey && cm.getDoc().somethingSelected()) {
                // Shift+click: extend selection from current anchor to this line
                const anchor = cm.getDoc().getCursor('anchor');
                const anchorLine = anchor.line;
                selectLines(anchorLine, lineNum);
                dragAnchorLine = anchorLine;
            } else {
                // Normal click: select single line, set drag anchor
                dragAnchorLine = lineNum;
                selectLines(lineNum, lineNum);
            }
            cm.focus();

            // Capture mousemove on the window to extend selection while dragging
            function onMouseMove(e) {
                if (dragAnchorLine === null) return;
                try {
                    const rawLine = cm.lineAtHeight(e.clientY, 'window');
                    const targetLine = Math.max(0, Math.min(rawLine, cm.getDoc().lastLine()));
                    selectLines(dragAnchorLine, targetLine);
                } catch (err) {
                    // Fallback if coordinate is outside
                }
            }

            function onMouseUp() {
                dragAnchorLine = null;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    })(cmEditor);

    // Initial resize refresh
    setTimeout(() => {
        if (cmEditor) cmEditor.refresh();
    }, 100);
});

// --- UI Helpers ---
function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function escapeAttribute(value) {
    return escapeHtml(value);
}

function getBlobDimensions(blob) {
    return new Promise((resolve, reject) => {
        const objectUrl = URL.createObjectURL(blob);
        const image = new Image();

        image.onload = () => {
            const dimensions = {
                width: image.naturalWidth,
                height: image.naturalHeight
            };
            URL.revokeObjectURL(objectUrl);
            resolve(dimensions);
        };

        image.onerror = (error) => {
            URL.revokeObjectURL(objectUrl);
            reject(error);
        };

        image.src = objectUrl;
    });
}

function buildInsertedImageHtml(src, width, height, alt = '') {
    return `<${'img'} src="${escapeAttribute(src)}" width="${escapeAttribute(width)}" height="${escapeAttribute(height)}" alt="${escapeAttribute(alt)}" title="">`;
}

function rewritePreviewImageSources(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div id="preview-root">${html}</div>`, 'text/html');
    const root = doc.getElementById('preview-root');
    if (!root) return html;

    root.querySelectorAll('img').forEach(img => {
        const resolvedSrc = getPreviewImageSrc(img.getAttribute('src'));
        if (resolvedSrc) {
            img.setAttribute('src', resolvedSrc);
        }
        img.setAttribute('no-lazy', '');
    });

    return root.innerHTML;
}

let _lastHeaderHtml = '';
let _lastHeaderThumbnail = '';
function updateHeaderPreview() {
    const headerPreview = document.getElementById('editor-article-preview');
    if (!headerPreview) return;

    const newThumbnail = getPreviewThumbnail();

    if (_lastHeaderThumbnail && newThumbnail === _lastHeaderThumbnail) {
        const img = headerPreview.querySelector('header.mdui-card-media > img');
        const titleEl = headerPreview.querySelector('.mdui-card-primary-title h1');
        const subtitleEl = headerPreview.querySelector('.mdui-card-primary-subtitle');
        if (img && titleEl && subtitleEl) {
            const title = document.getElementById('post-title').value.trim() || 'Untitled';
            const author = document.getElementById('post-author').value.trim() || DEFAULT_POST_AUTHOR;
            const previewDate = getPreviewDate();
            const showCount = document.getElementById('post-count').checked;
            img.alt = escapeAttribute(title);
            titleEl.textContent = title;
            subtitleEl.innerHTML = `<i class="mdui-icon material-icons" translate="no">today</i> ${escapeHtml(previewDate)} / <i class="mdui-icon material-icons" translate="no">person</i> ${escapeHtml(author)}${showCount ? '&nbsp;&nbsp;<span style="display: inline;"><i class="mdui-icon material-icons" translate="no">remove_red_eye</i> 114</span>' : ''}`;
            return;
        }
    }

    const html = buildArticleHeaderHtml();
    if (html === _lastHeaderHtml && newThumbnail === _lastHeaderThumbnail) return;
    _lastHeaderHtml = html;
    _lastHeaderThumbnail = newThumbnail;

    headerPreview.innerHTML = html;
    mdui.mutation();
}

function dispatchInputValue(input, value) {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    const textfield = input.closest('.mdui-textfield');
    if (textfield) mdui.updateTextFields(textfield);
}

function appendTag(tag) {
    const input = document.getElementById('post-tags');
    let vals = input.value.split(',').map(s => s.trim()).filter(Boolean);
    if (!vals.includes(tag)) vals.push(tag);
    dispatchInputValue(input, vals.join(', '));
    input.focus();
}

function appendCategory(cat) {
    const input = document.getElementById('post-categories');
    let vals = input.value.split(',').map(s => s.trim()).filter(Boolean);
    if (!vals.includes(cat)) vals.push(cat);
    dispatchInputValue(input, vals.join(', '));
    input.focus();
}

function createTaxonomyMenuItem(label, onSelect) {
    const li = document.createElement('li');
    const link = document.createElement('a');
    li.className = 'mdui-menu-item';
    link.href = 'javascript:;';
    link.className = 'mdui-ripple';
    link.textContent = label;
    link.addEventListener('click', () => onSelect(label));
    li.appendChild(link);
    return li;
}

function fillTaxonomyMenu(menu, values, onSelect) {
    menu.innerHTML = '';
    values.forEach(value => {
        if (!value) return;
        menu.appendChild(createTaxonomyMenuItem(value, onSelect));
    });
}

async function initTaxonomyMenus() {
    try {
        const res = await fetch('/search.xml', { credentials: 'same-origin' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const parser = new DOMParser();
        const xml = parser.parseFromString(await res.text(), 'application/xml');
        if (xml.querySelector('parsererror')) {
            throw new Error('Invalid search index XML');
        }

        const tags = Array.from(xml.querySelectorAll('tags > tag'))
            .map(node => node.textContent.trim())
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'));
        const categories = Array.from(xml.querySelectorAll('categories > category'))
            .map(node => node.textContent.trim())
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'));

        const uniqueTags = Array.from(new Set(tags));
        const uniqueCategories = Array.from(new Set(categories));

        if (uniqueTags.length) {
            fillTaxonomyMenu(document.getElementById('tag-menu'), uniqueTags, appendTag);
            initFloatingMenu('#post-tags', '#tag-menu', { align: 'left' });
        }

        if (uniqueCategories.length) {
            fillTaxonomyMenu(document.getElementById('category-menu'), uniqueCategories, appendCategory);
            initFloatingMenu('#post-categories', '#category-menu', { align: 'left' });
        }
    } catch (err) {
        console.error('Failed to fetch tags and categories', err);
    }
}

function initFloatingMenu(anchorSelector, menuSelector, options = {}) {
    const anchor = document.querySelector(anchorSelector);
    const menu = document.querySelector(menuSelector);
    if (!anchor || !menu) return null;

    const proxy = document.createElement('span');
    proxy.setAttribute('aria-hidden', 'true');
    proxy.style.cssText = 'position: fixed; width: 0; height: 0; left: 0; top: 0; pointer-events: none; z-index: 2100;';

    const editorCard = document.getElementById('editor-card');

    const updateContainer = () => {
        const isFullscreen = document.fullscreenElement === editorCard || 
                             document.webkitFullscreenElement === editorCard || 
                             document.mozFullScreenElement === editorCard || 
                             document.msFullscreenElement === editorCard;
        const targetParent = (isFullscreen && editorCard) ? editorCard : document.body;
        if (proxy.parentNode !== targetParent) targetParent.appendChild(proxy);
        if (menu.parentNode !== targetParent) targetParent.appendChild(menu);
        menu.style.zIndex = '2200';
    };

    updateContainer();

    const instance = new mdui.Menu(proxy, menu, Object.assign({
        covered: false,
        fixed: true,
        position: 'bottom',
        align: 'left',
        gutter: 8
    }, options));

    const syncProxy = () => {
        updateContainer();
        const rect = anchor.getBoundingClientRect();
        proxy.style.left = `${rect.left}px`;
        proxy.style.top = `${rect.top}px`;
        proxy.style.width = `${rect.width}px`;
        proxy.style.height = `${rect.height}px`;
    };

    anchor.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        syncProxy();
        instance.toggle();
    });

    const readjust = instance.readjust.bind(instance);
    instance.readjust = () => {
        syncProxy();
        readjust();
    };

    window.addEventListener('scroll', () => {
        if (instance.isOpen()) instance.readjust();
    }, { passive: true });

    document.addEventListener('fullscreenchange', () => {
        updateContainer();
        if (instance.isOpen()) instance.readjust();
    });
    document.addEventListener('webkitfullscreenchange', () => {
        updateContainer();
        if (instance.isOpen()) instance.readjust();
    });

    return instance;
}

async function insertLink() {
    try {
        const text = await navigator.clipboard.readText();
        if (text && /^https?:\/\//i.test(text.trim())) {
            insertText('[', `](${text.trim()})`);
            return;
        }
    } catch (e) {
        console.warn("Clipboard access denied or failed", e);
    }
    insertText('[', '](url)');
}

async function insertDetails() {
    let clipboardText = "展开";
    try {
        const text = await navigator.clipboard.readText();
        if (text && text.length < 50 && !text.includes('\n')) {
            clipboardText = text.trim();
        }
    } catch (e) {
        console.warn("Clipboard access denied or failed", e);
    }
    insertText(`<details markdown="1">\n<summary>${clipboardText}</summary>\n\n`, '\n\n</details>');
}

function insertList() {
    insertText('- ', '');
}

// --- Text Operations for CodeMirror ---
function insertText(before, after = '') {
    if (!cmEditor) return;
    const selection = cmEditor.getSelection();
    if (selection) {
        cmEditor.replaceSelection(before + selection + after);
    } else {
        const cursor = cmEditor.getCursor();
        cmEditor.replaceRange(before + after, cursor);
        cmEditor.setCursor({ line: cursor.line, ch: cursor.ch + before.length });
    }
    cmEditor.focus();
}

function insertHeading(level) {
    if (!cmEditor) return;
    const cursor = cmEditor.getCursor();
    const line = cmEditor.getLine(cursor.line);
    const cleaned = line.replace(/^#{1,6}\s*/, '');
    const prefix = '#'.repeat(Math.max(1, Math.min(6, level))) + ' ';
    cmEditor.replaceRange(prefix + cleaned, { line: cursor.line, ch: 0 }, { line: cursor.line, ch: line.length });
    cmEditor.focus();
}

function setFontSize(size) {
    insertText(`<span style="font-size: ${size};">`, '</span>');
}

function setColor(color) {
    insertText(`<span style="color: ${color};">`, '</span>');
}

function setAlign(align) {
    insertText(`\n<div style="text-align: ${align};">\n`, '\n</div>\n');
}

function clearFormatting() {
    if (!cmEditor) return;
    const selection = cmEditor.getSelection();
    if (!selection) return;
    const cleaned = selection
        .replace(/<\/?(span|div)[^>]*>/gi, '')
        .replace(/(\*\*|__)(.*?)\1/g, '$2')
        .replace(/(\*|_)(.*?)\1/g, '$2')
        .replace(/~~(.*?)~~/g, '$1')
        .replace(/`{1,3}(.*?)`{1,3}/g, '$1');
    cmEditor.replaceSelection(cleaned);
    cmEditor.focus();
}

function togglePreview() {
    const editorCol = document.getElementById('editor-col');
    const previewCol = document.getElementById('preview-content');
    if (!editorCol || !previewCol) return;
    
    if (previewCol.style.display === 'none') {
        // Show Preview, Hide Editor
        updatePreview();
        editorCol.style.display = 'none';
        previewCol.style.display = 'block';
    } else {
        // Show Editor, Hide Preview
        editorCol.style.display = 'block';
        previewCol.style.display = 'none';
        if (cmEditor) {
            cmEditor.refresh();
            cmEditor.focus();
        }
    }
}

// --- Core Article Functions ---
function generateUUID() {
    function s4() { return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function deterministicMaterial(seed) {
    seed = String(seed || '');
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
    }
    return `/images/random/material-${Math.abs(hash % 19) + 1}.png`;
}

function getPreviewImageSrc(src) {
    if (!src) return '';
    const filename = decodeURIComponent(src.split('/').pop() || '');
    const blob = imageAssets[filename];
    if (!blob) return src;
    const objectUrl = URL.createObjectURL(blob);
    previewObjectUrls.push(objectUrl);
    return objectUrl;
}

function releasePreviewObjectUrls() {
    previewObjectUrls.forEach(url => URL.revokeObjectURL(url));
    previewObjectUrls = [];
}

function getPreviewDate() {
    const rawDate = document.getElementById('post-date').value.trim();
    const sourceDate = rawDate || new Date();
    const date = sourceDate instanceof Date ? sourceDate : new Date(sourceDate.replace(' ', 'T'));
    if (Number.isNaN(date.getTime())) return rawDate;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getPreviewThumbnail() {
    const thumbnail = document.getElementById('post-thumbnail').value.trim();
    if (thumbnail) {
        _cachedMaterialThumbnail = null;
        return getPreviewImageSrc(thumbnail);
    }

    if (_cachedMaterialThumbnail) return _cachedMaterialThumbnail;

    const seed = document.getElementById('post-slug').value
        || document.getElementById('post-title').value
        || 'editor-preview';
    _cachedMaterialThumbnail = deterministicMaterial(seed);
    return _cachedMaterialThumbnail;
}

function getPreviewSlug() {
    return document.getElementById('post-slug').value.trim() || 'editor-preview';
}

function getPreviewPermalink() {
    return `${SITE_ORIGIN}/p/${encodeURIComponent(getPreviewSlug())}/`;
}

function buildQrCodeUrl(value) {
    return `${encodeURIComponent(value)}`;
}

function buildPreviewShareMenu(title, permalink, thumbnail) {
    const encodedTitle = encodeURIComponent(title);
    const encodedPermalink = encodeURIComponent(permalink);
    const encodedThumb = encodeURIComponent(thumbnail);

    return `
        <ul class="mdui-menu" id="editor-preview-share-menu">
            <li class="mdui-menu-item">
                <a href="javascript:void(0);" class="mdui-ripple" onclick="copyToClipboard('${escapeAttribute(permalink)}');">复制链接</a>
            </li>
            <li class="mdui-menu-item">
                <a href="//service.weibo.com/share/share.php?appkey=&title=${encodedTitle}&url=${encodedPermalink}&pic=${encodedThumb}&searchPic=false&style=simple" target="_blank" class="mdui-ripple">微博</a>
            </li>
            <li class="mdui-menu-item">
                <a href="//twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedPermalink}&via=${encodeURIComponent(DEFAULT_POST_AUTHOR)}" target="_blank" class="mdui-ripple">Twitter</a>
            </li>
            <li class="mdui-menu-item">
                <a href="//www.facebook.com/sharer/sharer.php?u=${encodedPermalink}" target="_blank" class="mdui-ripple">Facebook</a>
            </li>
            <li class="mdui-menu-item">
                <a href="//connect.qq.com/widget/shareqq/index.html?site=${encodeURIComponent(document.title)}&title=${encodedTitle}&pics=${encodedThumb}&url=${encodedPermalink}" target="_blank" class="mdui-ripple">QQ</a>
            </li>
            <li class="mdui-menu-item">
                <a href="//telegram.me/share/url?url=${encodedPermalink}&text=${encodedTitle}" target="_blank" class="mdui-ripple">Telegram</a>
            </li>
            <li class="mdui-menu-item">
                <a href="javascript:void(0);" class="mdui-ripple" onclick="sharePageviaSystem();">系统分享</a>
            </li>
        </ul>
    `;
}

function buildArticleHeaderHtml() {
    const title = document.getElementById('post-title').value.trim() || 'Untitled';
    const author = document.getElementById('post-author').value.trim() || DEFAULT_POST_AUTHOR;
    const thumbnail = getPreviewThumbnail();
    const previewDate = getPreviewDate();
    const permalink = getPreviewPermalink();
    const showCount = document.getElementById('post-count').checked;
    const showQrcode = document.getElementById('post-qrcode').checked;
    const showShareMenu = document.getElementById('post-share_menu').checked;

    return `
        <header class="mdui-card-media">
            <img src="${escapeAttribute(thumbnail)}" no-lazy fetchpriority="high" width="1280" height="720" decoding="async" alt="${escapeAttribute(title)}">
            <div class="mdui-card-media-covered">
                <div class="mdui-card-primary">
                    <div class="mdui-card-primary-title">
                        <h1 style="margin: 0; font-size: inherit; font-weight: inherit;">${escapeHtml(title)}</h1>
                    </div>
                    <div class="mdui-card-primary-subtitle">
                        <i class="mdui-icon material-icons" translate="no">today</i> ${escapeHtml(previewDate)}
                        /
                        <i class="mdui-icon material-icons" translate="no">person</i> ${escapeHtml(author)}
                        ${showCount ? `&nbsp;&nbsp;<span style="display: inline;"><i class="mdui-icon material-icons" translate="no">remove_red_eye</i> 114</span>` : ''}
                    </div>
                </div>
            </div>
            <div class="mdui-card-menu">
                ${showQrcode ? `
                    <button class="mdui-btn mdui-btn-icon mdui-text-color-white" mdui-menu="{target: '#editor-preview-qrcode', align: 'right'}">
                        <i class="mdui-icon material-icons" translate="no">devices</i>
                    </button>
                    <ul class="mdui-menu" id="editor-preview-qrcode">
                        <li class="mdui-menu-item" disabled>
                            Here will be a QR code when the post upload.
                        </li>
                    </ul>
                ` : ''}
                ${showShareMenu ? `
                    <button class="mdui-btn mdui-btn-icon mdui-text-color-white" mdui-menu="{target: '#editor-preview-share-menu', align: 'right'}">
                        <i class="mdui-icon material-icons" translate="no">share</i>
                    </button>
                    ${buildPreviewShareMenu(title, permalink, thumbnail)}
                ` : ''}
            </div>
        </header>
    `;
}

function buildPreviewBodyHtml(contentHtml) {
    return `
        <div class="mdui-typo markdown-body editor-preview-body">
            ${contentHtml}
        </div>
    `;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        mdui.snackbar({message: '已复制链接!', position: 'top', buttonText: '好'});
    }, err => {
        console.error('Could not copy text: ', err);
    });
}

function sharePageviaSystem() {
    const title = document.getElementById('post-title').value.trim() || 'Untitled';
    const excerpt = document.getElementById('post-excerpt').value.trim();
    const url = getPreviewPermalink();

    if (navigator.share) {
        navigator.share({ title, text: excerpt, url }).catch(console.error);
    } else {
        mdui.snackbar({message: '您的浏览器不支持此方式。', position: 'top', buttonText: '好吧'});
    }
}

function updateLicenseVisibility() {
    const enabledInput = document.getElementById('post-license-enabled');
    const customRow = document.getElementById('license-custom-row');
    if (!enabledInput || !customRow) return;

    customRow.style.display = enabledInput.checked ? 'block' : 'none';
}

function getLicenseFrontMatterValue() {
    const enabled = document.getElementById('post-license-enabled').checked;
    if (!enabled) return 'false';
    return document.getElementById('post-license').value.trim();
}

function applyLicenseFrontMatterValue(value) {
    const enabledInput = document.getElementById('post-license-enabled');
    const licenseInput = document.getElementById('post-license');

    if (value === 'false') {
        enabledInput.checked = false;
        licenseInput.value = '';
    } else {
        enabledInput.checked = true;
        licenseInput.value = value || '';
    }

    updateLicenseVisibility();
}

function updatePreview() {
    releasePreviewObjectUrls();
    const text = getEditorContent();
    const html = rewritePreviewImageSources(marked.parse(text));
    const previewBody = document.getElementById('preview-content');
    if (previewBody) {
        previewBody.innerHTML = buildPreviewBodyHtml(html);
        mdui.mutation();
    }
}

function updatePreviewAll() {
    updateHeaderPreview();
    updatePreview();
}

async function saveState() {
    if (typeof idbKeyval === 'undefined') return;

    const state = {
        title: document.getElementById('post-title').value,
        slug: document.getElementById('post-slug').value,
        tags: document.getElementById('post-tags').value,
        categories: document.getElementById('post-categories').value,
        content: getEditorContent(),
        donate: document.getElementById('post-donate').checked,
        toc: document.getElementById('post-toc').checked,
        comments: document.getElementById('post-comments').checked,
        top: document.getElementById('post-top').checked,
        date: document.getElementById('post-date').value,
        author: document.getElementById('post-author').value,
        thumbnail: document.getElementById('post-thumbnail').value,
        excerpt: document.getElementById('post-excerpt').value,
        license: getLicenseFrontMatterValue(),
        lang: document.getElementById('post-lang').value,
        wechat_sync: document.getElementById('post-wechat_sync').checked,
        count: document.getElementById('post-count').checked,
        share_menu: document.getElementById('post-share_menu').checked,
        qrcode: document.getElementById('post-qrcode').checked,
        thislink: document.getElementById('post-thislink').checked,
        timestamp: new Date().getTime()
    };
    
    try {
        await idbKeyval.set(DB_KEY_CONTENT, state);
        await idbKeyval.set(DB_KEY_IMAGES, imageAssets);
        const status = document.getElementById('save-status');
        if (status) {
            const timeStr = new Date().toLocaleTimeString();
            status.innerHTML = '<span class="mdui-text-color-green-500" style="display: flex; align-items: center; font-weight: bold;"><i class="mdui-icon material-icons" style="font-size: 18px; margin-right: 4px;">done_all</i> 已保存 ' + timeStr + '</span>';
            
            setTimeout(() => {
                status.innerHTML = '<span class="mdui-text-color-grey-500" style="display: flex; align-items: center;"><i class="mdui-icon material-icons" style="font-size: 18px; margin-right: 4px;">done</i> 上次保存 ' + timeStr + '</span>';
            }, 3000);
        }
    } catch (e) {
        console.error("Save failed", e);
        const status = document.getElementById('save-status');
        if (status) status.innerHTML = '<span class="mdui-text-color-red-500">保存失败!</span>';
    }
}

// --- Enhanced Table Editor with Clipboard Parsing ---
let tableEditorState = {
    rows: 3,
    cols: 3,
    alignment: ['left', 'left', 'left'], 
    data: [['Header 1', 'Header 2', 'Header 3'], ['Text', 'Text', 'Text'], ['Text', 'Text', 'Text']], 
    styles: Array(3).fill().map(() => Array(3).fill({})) 
};
let selectedCell = null;

function insertTable() {
    let dialog = document.getElementById('table-editor-dialog');
    if (dialog && dialog.parentNode) {
        dialog.parentNode.removeChild(dialog);
    }
    initTableEditor();

    tableEditorState = {
        rows: 3,
        cols: 3,
        alignment: ['left', 'left', 'left'],
        data: [['Header 1', 'Header 2', 'Header 3'], ['Text', 'Text', 'Text'], ['Text', 'Text', 'Text']],
        styles: Array(3).fill().map(() => Array(3).fill({}))
    };

    const rowsInput = document.getElementById('table-rows');
    const colsInput = document.getElementById('table-cols');
    if(rowsInput) rowsInput.value = 3;
    if(colsInput) colsInput.value = 3;

    renderTableEditor();
    new mdui.Dialog('#table-editor-dialog', { history: false, modal: true }).open();
}

function initTableEditor() {
    if (!document.getElementById('table-editor-style')) {
        const style = document.createElement('style');
        style.id = 'table-editor-style';
        style.innerHTML = `
            #table-editor-grid {
                display: grid;
                gap: 8px;
                overflow: auto;
                max-height: 400px;
                padding: 10px;
                background: rgba(0,0,0,0.02);
                border: 1px solid rgba(0,0,0,0.1);
            }
            .table-cell-input, .table-col-control {
                width: 100%;
                min-width: 80px;
                box-sizing: border-box;
            }
            .table-cell-input {
                border: 1px solid rgba(0,0,0,0.1);
                padding: 8px;
                border-radius: 4px;
                background: #fff;
                transition: all 0.2s;
            }
            .table-cell-input:focus {
                border-color: var(--color-theme-accent);
                box-shadow: 0 0 0 2px rgba(0,0,0,0.1);
            }
            .table-col-control {
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                padding: 8px;
                background: rgba(0,0,0,0.05);
                border-radius: 4px;
                user-select: none;
            }
            .table-col-control:hover {
                background: rgba(0,0,0,0.1);
            }
            .mdui-theme-layout-dark .table-cell-input {
                background: #424242;
                border-color: rgba(255,255,255,0.1);
                color: #fff;
            }
            .mdui-theme-layout-dark #table-editor-grid {
                background: rgba(255,255,255,0.02);
                border-color: rgba(255,255,255,0.1);
            }
        `;
        document.head.appendChild(style);
    }

    const dialogHtml = `
    <div class="mdui-dialog" id="table-editor-dialog" style="max-width: 95vw; width: 900px;">
        <div class="mdui-dialog-title">插入表格</div>
        <div class="mdui-dialog-content" style="overflow: hidden; display: flex; flex-direction: column; height: 600px; padding-bottom: 0;">
            
            <!-- Controls -->
            <div class="mdui-row mdui-m-b-2">
                <div class="mdui-col-xs-3">
                    <div class="mdui-textfield mdui-p-a-0">
                        <label class="mdui-textfield-label">行数</label>
                        <input class="mdui-textfield-input" type="number" id="table-rows" value="3" min="1">
                    </div>
                </div>
                <div class="mdui-col-xs-3">
                    <div class="mdui-textfield mdui-p-a-0">
                        <label class="mdui-textfield-label">列数</label>
                        <input class="mdui-textfield-input" type="number" id="table-cols" value="3" min="1">
                    </div>
                </div>
                <div class="mdui-col-xs-6 mdui-valign" style="height: 60px;">
                    <button class="mdui-btn mdui-btn-raised mdui-btn-dense mdui-ripple mdui-color-theme-accent" id="table-update-dim">
                        <i class="mdui-icon material-icons mdui-icon-left">grid_on</i> 应用网格
                    </button>
                    <button class="mdui-btn mdui-btn-raised mdui-btn-dense mdui-ripple mdui-m-l-1" id="table-paste-btn" type="button" mdui-tooltip="{content: '从剪贴板读取并自动解析 HTML/Excel/TSV/Markdown 表格'}">
                        <i class="mdui-icon material-icons mdui-icon-left">content_paste</i> 粘贴表格
                    </button>
                </div>
            </div>

            <!-- Style Toolbar -->
            <div class="mdui-toolbar mdui-m-b-1" style="min-height: 48px; border-radius: 4px;">
                 <div class="mdui-valign mdui-m-r-2">
                    <i class="mdui-icon material-icons mdui-m-r-1">format_color_text</i>
                    <input type="color" id="cell-fg-color" title="文字颜色" value="#000000" style="height: 24px; width: 40px; border: none; background: none; cursor: pointer;">
                 </div>
                 <div class="mdui-valign mdui-m-r-2">
                    <i class="mdui-icon material-icons mdui-m-r-1">format_color_fill</i>
                    <input type="color" id="cell-bg-color" title="背景颜色" value="#ffffff" style="height: 24px; width: 40px; border: none; background: none; cursor: pointer;">
                 </div>
                 <button class="mdui-btn mdui-btn-icon mdui-ripple" id="apply-style-btn" mdui-tooltip="{content: '应用颜色到选中单元格'}">
                    <i class="mdui-icon material-icons">check</i>
                 </button>
                 <button class="mdui-btn mdui-btn-icon mdui-ripple" id="clear-style-btn" mdui-tooltip="{content: '清除选中单元格样式'}">
                    <i class="mdui-icon material-icons">format_clear</i>
                 </button>
                 <div class="mdui-toolbar-spacer"></div>
                 <span class="mdui-typo-caption mdui-text-color-grey-600">点击列头切换对齐 / 支持 Ctrl+V 快捷粘贴表格</span>
            </div>

            <!-- Grid -->
            <div id="table-editor-grid" class="mdui-typo custom-scroll" style="flex: 1;"></div>

        </div>
        <div class="mdui-dialog-actions">
            <button class="mdui-btn mdui-ripple" mdui-dialog-close>取消</button>
            <button class="mdui-btn mdui-ripple mdui-color-theme-accent" onclick="confirmInsertTable()">插入表格</button>
        </div>
    </div>
    `;

    const div = document.createElement('div');
    div.innerHTML = dialogHtml;
    
    let parent = document.body;
    const fullscreenElem = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
    if (fullscreenElem && fullscreenElem.id === 'editor-card') {
        parent = fullscreenElem;
    }
    parent.appendChild(div.firstElementChild);

    document.getElementById('table-update-dim').addEventListener('click', () => {
        const r = parseInt(document.getElementById('table-rows').value) || 1;
        const c = parseInt(document.getElementById('table-cols').value) || 1;
        updateTableDims(r, c);
    });

    document.getElementById('table-paste-btn').addEventListener('click', parseAndLoadClipboardTable);
    document.getElementById('apply-style-btn').addEventListener('click', applyStyleToSelected);
    document.getElementById('clear-style-btn').addEventListener('click', clearStyleSelected);

    // Support Ctrl+V paste inside dialog
    const dialogElem = document.getElementById('table-editor-dialog');
    if (dialogElem) {
        dialogElem.addEventListener('paste', (e) => {
            // If focused on an input inside dialog, allow normal text editing unless entire table is copied
            const target = e.target;
            const clipboardData = e.clipboardData;
            if (!clipboardData) return;
            const html = clipboardData.getData('text/html');
            const text = clipboardData.getData('text/plain');
            if ((html && html.includes('<table')) || (text && (text.includes('\t') || (text.includes('|') && text.includes('\n'))))) {
                e.preventDefault();
                parseAndApplyTableData(html, text);
            }
        });
    }
}

async function parseAndLoadClipboardTable() {
    try {
        let text = '';
        let html = '';
        if (navigator.clipboard && navigator.clipboard.read) {
            try {
                const items = await navigator.clipboard.read();
                for (const item of items) {
                    if (item.types.includes('text/html')) {
                        const blob = await item.getType('text/html');
                        html = await blob.text();
                    }
                    if (item.types.includes('text/plain')) {
                        const blob = await item.getType('text/plain');
                        text = await blob.text();
                    }
                }
            } catch (e) {
                text = await navigator.clipboard.readText();
            }
        } else if (navigator.clipboard && navigator.clipboard.readText) {
            text = await navigator.clipboard.readText();
        }

        if (!html && !text) {
            mdui.snackbar({ message: '剪贴板为空或未授予读取权限' });
            return;
        }

        parseAndApplyTableData(html, text);
    } catch (err) {
        console.error('Failed to read table from clipboard', err);
        mdui.snackbar({ message: `读取剪贴板失败: ${err.message}` });
    }
}

function parseAndApplyTableData(html, text) {
    let parsed = null;
    if (html && html.includes('<table')) {
        parsed = parseHtmlTable(html);
    }
    if (!parsed && text) {
        parsed = parseTextTable(text);
    }

    if (parsed && parsed.data.length > 0 && parsed.cols > 0) {
        tableEditorState.rows = parsed.rows;
        tableEditorState.cols = parsed.cols;
        tableEditorState.data = parsed.data;
        tableEditorState.alignment = parsed.alignment || Array(parsed.cols).fill('left');
        tableEditorState.styles = parsed.styles || Array(parsed.rows).fill().map(() => Array(parsed.cols).fill({}));

        const rowsInput = document.getElementById('table-rows');
        const colsInput = document.getElementById('table-cols');
        if (rowsInput) rowsInput.value = parsed.rows;
        if (colsInput) colsInput.value = parsed.cols;

        renderTableEditor();
        updateTableDims(parsed.rows, parsed.cols);
        mdui.snackbar({ message: `已成功读取剪贴板表格 (${parsed.rows} 行 x ${parsed.cols} 列)` });
    } else {
        mdui.snackbar({ message: '未能识别剪贴板中的表格内容' });
    }
}

function parseHtmlTable(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const table = doc.querySelector('table');
    if (!table) return null;

    const trs = Array.from(table.querySelectorAll('tr'));
    if (!trs.length) return null;

    const data = [];
    const styles = [];
    let maxCols = 0;

    trs.forEach((tr) => {
        const rowData = [];
        const rowStyles = [];
        const cells = Array.from(tr.querySelectorAll('th, td'));
        if (cells.length > maxCols) maxCols = cells.length;

        cells.forEach((cell) => {
            rowData.push(cell.innerText.trim());
            const cellStyle = {};
            const fg = cell.style.color;
            const bg = cell.style.backgroundColor;
            if (fg) cellStyle.color = fg;
            if (bg) cellStyle.bg = bg;
            rowStyles.push(cellStyle);
        });

        data.push(rowData);
        styles.push(rowStyles);
    });

    data.forEach((row, i) => {
        while (row.length < maxCols) {
            row.push('');
            styles[i].push({});
        }
    });

    return {
        rows: data.length,
        cols: maxCols,
        data: data,
        styles: styles,
        alignment: Array(maxCols).fill('left')
    };
}

function parseTextTable(text) {
    const lines = text.trim().split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (!lines.length) return null;

    // Check Markdown table
    if (lines.length >= 2 && lines.some(l => l.includes('|'))) {
        const mdRows = [];
        let alignments = [];
        lines.forEach(line => {
            if (/^\|?(\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?$/.test(line)) {
                const parts = line.replace(/^\|/, '').replace(/\|$/, '').split('|').map(s => s.trim());
                alignments = parts.map(p => {
                    if (p.startsWith(':') && p.endsWith(':')) return 'center';
                    if (p.endsWith(':')) return 'right';
                    return 'left';
                });
                return;
            }
            if (line.includes('|')) {
                const cells = line.replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim().replace(/\\\|/g, '|'));
                mdRows.push(cells);
            }
        });

        if (mdRows.length) {
            let maxCols = Math.max(...mdRows.map(r => r.length));
            mdRows.forEach(r => { while (r.length < maxCols) r.push(''); });
            while (alignments.length < maxCols) alignments.push('left');
            return {
                rows: mdRows.length,
                cols: maxCols,
                data: mdRows,
                styles: Array(mdRows.length).fill().map(() => Array(maxCols).fill({})),
                alignment: alignments
            };
        }
    }

    // Check TSV or CSV
    const isTSV = lines.some(l => l.includes('\t'));
    const delimiter = isTSV ? '\t' : (lines.some(l => l.includes(',')) ? ',' : null);

    if (delimiter) {
        const data = lines.map(l => l.split(delimiter).map(c => c.trim().replace(/^"|"$/g, '')));
        let maxCols = Math.max(...data.map(r => r.length));
        data.forEach(r => { while (r.length < maxCols) r.push(''); });
        return {
            rows: data.length,
            cols: maxCols,
            data: data,
            styles: Array(data.length).fill().map(() => Array(maxCols).fill({})),
            alignment: Array(maxCols).fill('left')
        };
    }

    return null;
}

function updateTableDims(rows, cols) {
    const newData = [];
    const newStyles = [];
    const newAlign = [];

    for(let i=0; i<rows; i++) {
        newData[i] = [];
        newStyles[i] = [];
        for(let j=0; j<cols; j++) {
            newData[i][j] = (tableEditorState.data[i] && tableEditorState.data[i][j]) || '';
            newStyles[i][j] = (tableEditorState.styles[i] && tableEditorState.styles[i][j]) || {};
        }
    }
    
    for(let j=0; j<cols; j++) {
        newAlign[j] = tableEditorState.alignment[j] || 'left';
    }

    tableEditorState.rows = rows;
    tableEditorState.cols = cols;
    tableEditorState.data = newData;
    tableEditorState.styles = newStyles;
    tableEditorState.alignment = newAlign;
    
    renderTableEditor();

    const dialog = document.getElementById('table-editor-dialog');
    if (dialog) {
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        
        let newW = Math.max(600, cols * 120 + 60);
        if (newW > winW * 0.95) newW = winW * 0.95;
        
        let newH = Math.max(500, rows * 60 + 250);
        if (newH > winH * 0.9) newH = winH * 0.9;
        
        dialog.style.width = newW + 'px';
        dialog.style.maxWidth = '95vw';
        
        const content = dialog.querySelector('.mdui-dialog-content');
        if (content) {
            content.style.height = newH + 'px';
        }
        
        mdui.mutation();
        window.dispatchEvent(new Event('resize'));
    }
}

function renderTableEditor() {
    const grid = document.getElementById('table-editor-grid');
    if (!grid) return;
    grid.style.gridTemplateColumns = `repeat(${tableEditorState.cols}, 1fr)`;
    grid.innerHTML = '';

    for(let j=0; j<tableEditorState.cols; j++) {
        const align = tableEditorState.alignment[j];
        let icon = 'format_align_left';
        if(align === 'center') icon = 'format_align_center';
        if(align === 'right') icon = 'format_align_right';
        
        const colHeader = document.createElement('div');
        colHeader.className = 'table-col-control';
        colHeader.innerHTML = `<i class="mdui-icon material-icons" style="font-size: 18px;">${icon}</i>`;
        colHeader.title = '切换对齐方式';
        colHeader.onclick = () => toggleAlign(j);
        grid.appendChild(colHeader);
    }

    for(let i=0; i<tableEditorState.rows; i++) {
        for(let j=0; j<tableEditorState.cols; j++) {
            const cell = document.createElement('input');
            cell.className = 'table-cell-input';
            cell.value = tableEditorState.data[i][j];
            cell.placeholder = i === 0 ? '标题' : '内容';
            
            const style = tableEditorState.styles[i][j];
            if(style.color) cell.style.color = style.color;
            if(style.bg) cell.style.backgroundColor = style.bg;
            
            cell.onfocus = () => { selectedCell = {r:i, c:j}; };
            cell.oninput = (e) => { tableEditorState.data[i][j] = e.target.value; };
            
            grid.appendChild(cell);
        }
    }
}

function toggleAlign(colIndex) {
    const aligns = ['left', 'center', 'right'];
    const current = tableEditorState.alignment[colIndex];
    const next = aligns[(aligns.indexOf(current) + 1) % 3];
    tableEditorState.alignment[colIndex] = next;
    renderTableEditor();
}

function applyStyleToSelected() {
    if(!selectedCell) {
        mdui.snackbar({message: '请先选择一个单元格'});
        return;
    }
    const color = document.getElementById('cell-fg-color').value;
    const bg = document.getElementById('cell-bg-color').value;
    
    tableEditorState.styles[selectedCell.r][selectedCell.c] = {
        color: color,
        bg: bg !== '#ffffff' ? bg : null
    };
    renderTableEditor();
}

function clearStyleSelected() {
    if(!selectedCell) return;
    tableEditorState.styles[selectedCell.r][selectedCell.c] = {};
    renderTableEditor();
}

function confirmInsertTable() {
    let md = '';
    const { rows, cols, alignment } = tableEditorState;

    md += '|';
    for(let j=0; j<cols; j++) {
        md += ` ${formatCell(0, j)} |`;
    }
    md += '\n|';
    
    for(let j=0; j<cols; j++) {
        const align = alignment[j];
        if(align === 'left') md += ' :--- |';
        else if(align === 'center') md += ' :---: |';
        else md += ' ---: |';
    }
    md += '\n';

    for(let i=1; i<rows; i++) {
        md += '|';
        for(let j=0; j<cols; j++) {
            md += ` ${formatCell(i, j)} |`;
        }
        md += '\n';
    }

    insertText(md, '');
    new mdui.Dialog('#table-editor-dialog').close();
}

function formatCell(r, c) {
    let text = tableEditorState.data[r][c] || ' ';
    text = text.replace(/\|/g, '\\|');
    
    const style = tableEditorState.styles[r][c];
    
    if (style && (style.color || style.bg)) {
        let styleStr = '';
        if(style.color) styleStr += `color: ${style.color}; `;
        if(style.bg) styleStr += `background-color: ${style.bg}; `;
        return `<span style="${styleStr}">${text}</span>`;
    }
    return text;
}

// --- Image Handling ---
async function handleImageSelect(e) {
    const files = e.target.files;
    if (!files.length) return;
    await processImageFiles(files);
    e.target.value = '';
}

async function handleThumbnailSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const slug = document.getElementById('post-slug').value || 'untitled';
    
    try {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true
        };
        const compressedFile = await imageCompression(file, options);
        
        const ext = file.name.split('.').pop();
        const filename = `thumb_${Date.now()}.${ext}`;
        
        imageAssets[filename] = compressedFile;
        
        const imgPath = `/images/blog/${slug}/${filename}`;
        dispatchInputValue(document.getElementById('post-thumbnail'), imgPath);
        
        mdui.snackbar({message: `头图已处理`});
    } catch (error) {
        console.error(error);
        mdui.snackbar({message: `头图处理失败: ${error.message}`});
    }
    e.target.value = '';
}

async function processImageFiles(files) {
    const slug = document.getElementById('post-slug').value || 'untitled';
    const selectedText = getEditorSelectionText();
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;

        const ext = file.name.split('.').pop();
        const timestamp = Date.now();
        const baseName = `img_${timestamp}_${i}`;
        const originalFilename = `${baseName}.${ext}`;
        const compressedFilename = `${baseName}_compressed.jpg`;

        imageAssets[originalFilename] = file;

        try {
            const options = {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 1600,
                useWebWorker: true,
                fileType: 'image/jpeg',
                initialQuality: 0.5
            };
            const compressedFile = await imageCompression(file, options);
            const dimensions = await getBlobDimensions(compressedFile);
            
            imageAssets[compressedFilename] = compressedFile;
            
            const imgPath = `${SITE_ORIGIN}/images/blog/${slug}/${compressedFilename}`;
            const imageHtml = buildInsertedImageHtml(imgPath, dimensions.width, dimensions.height, selectedText);
            insertText(imageHtml, '');
            
            mdui.snackbar({message: `图片 ${file.name} 已处理并添加`});
        } catch (error) {
            console.error(error);
            mdui.snackbar({message: `图片处理失败: ${error.message}`});
        }
    }
    updatePreview();
}

// --- Import & Export ---
async function handleZipImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
        const zip = await JSZip.loadAsync(file);
        
        let mdFile = null;
        let mdContent = '';
        
        zip.forEach((relativePath, zipEntry) => {
            if (relativePath.endsWith('.md') && relativePath.includes('source/_posts/')) {
                mdFile = zipEntry;
            }
        });
        
        if (!mdFile) {
            throw new Error('未找到文章 Markdown 文件');
        }
        
        mdContent = await mdFile.async('string');
        
        const fmRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
        const match = mdContent.match(fmRegex);
        
        if (match) {
            const fmText = match[1];
            const content = match[2];
            
            const getVal = (key) => {
                const regex = new RegExp(`^${key}:\\s*(.*)$`, 'm');
                const m = fmText.match(regex);
                return m ? m[1].trim() : null;
            };
            
            const getArr = (key) => {
                const val = getVal(key);
                if (!val) return '';
                return val.replace(/^\[|\]$/g, '').trim();
            };

            document.getElementById('post-title').value = getVal('title') || '';
            const slugMatch = mdFile.name.match(/source\/_posts\/(.*)\.md/);
            document.getElementById('post-slug').value = slugMatch ? slugMatch[1] : (getVal('title') || '');
            
            document.getElementById('post-tags').value = getArr('tags');
            document.getElementById('post-categories').value = getArr('categories');
            document.getElementById('post-date').value = getVal('date') || '';
            
            document.getElementById('post-donate').checked = getVal('donate') !== 'false';
            document.getElementById('post-toc').checked = getVal('toc') !== 'false';
            document.getElementById('post-comments').checked = getVal('comments') !== 'false';
            document.getElementById('post-top').checked = getVal('top') === 'true';
            
            document.getElementById('post-author').value = getVal('author') || '';
            document.getElementById('post-thumbnail').value = getVal('thumbnail') || '';
            document.getElementById('post-excerpt').value = getVal('excerpt') || '';
            applyLicenseFrontMatterValue(getVal('license') || '');
            document.getElementById('post-lang').value = getVal('lang') || 'zh-cn';
            
            document.getElementById('post-count').checked = getVal('count') !== 'false';
            document.getElementById('post-share_menu').checked = getVal('share_menu') !== 'false';
            document.getElementById('post-qrcode').checked = getVal('qrcode') !== 'false';
            document.getElementById('post-thislink').checked = getVal('thislink') !== 'false';

            setEditorContent(content.trim());
        } else {
            setEditorContent(mdContent);
        }
        
        imageAssets = {};
        const imgPromises = [];
        zip.forEach((relativePath, zipEntry) => {
            if (relativePath.startsWith('source/images/blog/') && !zipEntry.dir) {
                imgPromises.push(async () => {
                    const blob = await zipEntry.async('blob');
                    const filename = relativePath.split('/').pop();
                    imageAssets[filename] = blob;
                });
            }
        });
        
        await Promise.all(imgPromises.map(p => p()));
        
        updatePreviewAll();
        mdui.updateTextFields();
        mdui.snackbar({message: '导入成功'});
        
    } catch (error) {
        console.error(error);
        mdui.snackbar({message: `导入失败: ${error.message}`});
    }
    e.target.value = '';
}

async function exportPost() {
    const zip = new JSZip();
    
    const title = document.getElementById('post-title').value || 'Untitled';
    const slug = document.getElementById('post-slug').value || 'untitled';
    const tags = document.getElementById('post-tags').value.split(',').map(t => t.trim()).filter(t => t);
    const categories = document.getElementById('post-categories').value.split(',').map(c => c.trim()).filter(c => c);
    const content = getEditorContent();
    
    const donate = document.getElementById('post-donate').checked;
    const toc = document.getElementById('post-toc').checked;
    const comments = document.getElementById('post-comments').checked;
    const top = document.getElementById('post-top').checked;
    const customDate = document.getElementById('post-date').value;
    
    const author = document.getElementById('post-author').value;
    const thumbnail = document.getElementById('post-thumbnail').value;
    const excerpt = document.getElementById('post-excerpt').value;
    const license = getLicenseFrontMatterValue();
    const lang = document.getElementById('post-lang').value;
    const wechat_sync = document.getElementById('post-wechat_sync').checked;
    const count = document.getElementById('post-count').checked;
    const share_menu = document.getElementById('post-share_menu').checked;
    const qrcode = document.getElementById('post-qrcode').checked;
    const thislink = document.getElementById('post-thislink').checked;

    const dateStr = customDate || new Date().toISOString().replace('T', ' ').substring(0, 19);
    const uuid = generateUUID();
    
    let frontMatter = `---
uuid: ${uuid}
title: ${title}
date: ${dateStr}
tags: [${tags.join(', ')}]
categories: [${categories.join(', ')}]
donate: ${donate}
toc: ${toc}
comments: ${comments}
`;
    if(top) frontMatter += `top: true\n`;
    if(author) frontMatter += `author: ${author}\n`;
    if(thumbnail) frontMatter += `thumbnail: ${thumbnail}\n`;
    if(excerpt) frontMatter += `excerpt: ${excerpt}\n`;
    if(license) frontMatter += `license: ${license}\n`;
    if(lang !== 'zh-cn') frontMatter += `lang: ${lang}\n`;
    if(!wechat_sync) frontMatter += `wechat_sync: false\n`;
    if(!count) frontMatter += `count: false\n`;
    if(!share_menu) frontMatter += `share_menu: false\n`;
    if(!qrcode) frontMatter += `qrcode: false\n`;
    if(!thislink) frontMatter += `thislink: false\n`;
    
    frontMatter += `---\n\n${content}\n`;

    zip.file(`source/_posts/${slug}.md`, frontMatter);
    
    const imgFolder = zip.folder(`source/images/blog/${slug}`);
    
    let thumbnailFilename = '';
    if (thumbnail && thumbnail.startsWith(`/images/blog/${slug}/`)) {
        thumbnailFilename = thumbnail.split('/').pop();
    }
    
    for (const [filename, blob] of Object.entries(imageAssets)) {
        let shouldInclude = false;
        
        if (content.includes(filename) || filename === thumbnailFilename) {
            shouldInclude = true;
        } else {
            const lastDotIndex = filename.lastIndexOf('.');
            if (lastDotIndex !== -1) {
                const nameWithoutExt = filename.substring(0, lastDotIndex);
                const compressedName = nameWithoutExt + '_compressed.jpg';
                if (content.includes(compressedName) || compressedName === thumbnailFilename) {
                    shouldInclude = true;
                }
            }
        }

        if (shouldInclude) {
             imgFolder.file(filename, blob);
        }
    }
    
    const contentZip = await zip.generateAsync({type:"blob"});
    saveAs(contentZip, `${slug}-blog-post.zip`);
    
    mdui.snackbar({message: '导出成功！解压到项目根目录即可。'});
}

function resetEditor() {
    if(confirm('确定要清空编辑器吗？未保存的内容将丢失。')) {
        document.getElementById('post-title').value = '';
        document.getElementById('post-slug').value = '';
        document.getElementById('post-tags').value = '';
        document.getElementById('post-categories').value = '';
        document.getElementById('post-date').value = '';
        document.getElementById('post-author').value = '';
        document.getElementById('post-thumbnail').value = '';
        document.getElementById('post-excerpt').value = '';
        applyLicenseFrontMatterValue('');
        document.getElementById('post-lang').value = 'zh-cn';
        document.getElementById('post-wechat_sync').checked = true;
        setEditorContent('');
        
        document.getElementById('post-donate').checked = true;
        document.getElementById('post-toc').checked = true;
        document.getElementById('post-comments').checked = true;
        document.getElementById('post-top').checked = false;
        
        document.getElementById('post-count').checked = true;
        document.getElementById('post-share_menu').checked = true;
        document.getElementById('post-qrcode').checked = true;
        document.getElementById('post-thislink').checked = true;

        imageAssets = {};
        _cachedMaterialThumbnail = null;
        _lastHeaderHtml = '';
        _lastHeaderThumbnail = '';
        if (typeof idbKeyval !== 'undefined') {
            idbKeyval.del(DB_KEY_CONTENT);
            idbKeyval.del(DB_KEY_IMAGES);
        }
        updatePreviewAll();
        mdui.updateTextFields();
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('mdui-theme-layout-dark');
}

function toggleFullscreen() {
    const elem = document.getElementById('editor-card');
    const icon = document.getElementById('fullscreen-icon');
    
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
        if (icon) icon.innerText = 'fullscreen_exit';
        elem.style.height = '100vh';
        elem.style.borderRadius = '0';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        if (icon) icon.innerText = 'fullscreen';
        elem.style.height = '70vh';
        elem.style.borderRadius = '';
    }
    setTimeout(() => {
        if (cmEditor) cmEditor.refresh();
    }, 100);
}

document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

function handleFullscreenChange() {
    const elem = document.getElementById('editor-card');
    const icon = document.getElementById('fullscreen-icon');
    
    if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
        if (icon) icon.innerText = 'fullscreen';
        if (elem) {
            elem.style.height = '70vh';
            elem.style.borderRadius = '';
        }
    } else {
        if (icon) icon.innerText = 'fullscreen_exit';
        if (elem) {
            elem.style.height = '100vh';
            elem.style.borderRadius = '0';
        }
    }
    setTimeout(() => {
        if (cmEditor) cmEditor.refresh();
    }, 100);
}

// --- GitHub Submission ---
const WORKER_URL = 'https://pr-helper.cf.miniproj.stevezmt.top'; 

async function submitToGitHub() {
    const token = localStorage.getItem('github_token');
    if (!token) {
        if (confirm('需要登录 GitHub 才能提交。是否现在登录？')) {
            loginWithGitHub();
        }
        return;
    }

    const slug = document.getElementById('post-slug').value || 'untitled';
    const defaultMsg = `发布 ${slug}`;
    
    const message = await showCommitDialog(defaultMsg);
    if (!message) return;

    const files = [];
    
    const title = document.getElementById('post-title').value || 'Untitled';
    const tags = document.getElementById('post-tags').value.split(',').map(t => t.trim()).filter(t => t);
    const categories = document.getElementById('post-categories').value.split(',').map(c => c.trim()).filter(c => c);
    const content = getEditorContent();
    
    const donate = document.getElementById('post-donate').checked;
    const toc = document.getElementById('post-toc').checked;
    const comments = document.getElementById('post-comments').checked;
    const top = document.getElementById('post-top').checked;
    const customDate = document.getElementById('post-date').value;
    
    const author = document.getElementById('post-author').value;
    const thumbnail = document.getElementById('post-thumbnail').value;
    const excerpt = document.getElementById('post-excerpt').value;
    const license = getLicenseFrontMatterValue();
    const lang = document.getElementById('post-lang').value;
    const wechat_sync = document.getElementById('post-wechat_sync').checked;
    const count = document.getElementById('post-count').checked;
    const share_menu = document.getElementById('post-share_menu').checked;
    const qrcode = document.getElementById('post-qrcode').checked;
    const thislink = document.getElementById('post-thislink').checked;

    const dateStr = customDate || new Date().toISOString().replace('T', ' ').substring(0, 19);
    const uuid = generateUUID(); 
    
    let frontMatter = `---
uuid: ${uuid}
title: ${title}
date: ${dateStr}
tags: [${tags.join(', ')}]
categories: [${categories.join(', ')}]
donate: ${donate}
toc: ${toc}
comments: ${comments}
`;
    if(top) frontMatter += `top: true\n`;
    if(author) frontMatter += `author: ${author}\n`;
    if(thumbnail) frontMatter += `thumbnail: ${thumbnail}\n`;
    if(excerpt) frontMatter += `excerpt: ${excerpt}\n`;
    if(license) frontMatter += `license: ${license}\n`;
    if(lang !== 'zh-cn') frontMatter += `lang: ${lang}\n`;
    if(!wechat_sync) frontMatter += `wechat_sync: false\n`;
    if(!count) frontMatter += `count: false\n`;
    if(!share_menu) frontMatter += `share_menu: false\n`;
    if(!qrcode) frontMatter += `qrcode: false\n`;
    if(!thislink) frontMatter += `thislink: false\n`;
    
    frontMatter += `---\n\n${content}\n`;
    
    files.push({
        path: `source/_posts/${slug}.md`,
        content: frontMatter,
        encoding: 'utf-8'
    });

    let thumbnailFilename = '';
    if (thumbnail && thumbnail.startsWith(`/images/blog/${slug}/`)) {
        thumbnailFilename = thumbnail.split('/').pop();
    }
    
    for (const [filename, blob] of Object.entries(imageAssets)) {
        let shouldInclude = false;
        
        if (content.includes(filename) || filename === thumbnailFilename) {
            shouldInclude = true;
        } else {
            const lastDotIndex = filename.lastIndexOf('.');
            if (lastDotIndex !== -1) {
                const nameWithoutExt = filename.substring(0, lastDotIndex);
                const compressedName = nameWithoutExt + '_compressed.jpg';
                if (content.includes(compressedName) || compressedName === thumbnailFilename) {
                    shouldInclude = true;
                }
            }
        }

        if (shouldInclude) {
             const base64 = await blobToBase64(blob);
             files.push({
                 path: `source/images/blog/${slug}/${filename}`,
                 content: base64,
                 encoding: 'base64'
             });
        }
    }

    const snackbar = mdui.snackbar({message: '正在提交到 GitHub...', timeout: 0});
    
    try {
        const response = await fetch(`${WORKER_URL}/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token,
                files,
                message
            })
        });
        
        const result = await response.json();
        snackbar.close();
        
        if (result.success) {
            mdui.dialog({
                title: '提交成功',
                content: `Pull Request 已创建: <a href="${result.pr_url}" target="_blank">#${result.pr_number}</a>`,
                buttons: [{text: '确定'}]
            });
        } else {
            throw new Error(result.error || 'Unknown error');
        }
    } catch (e) {
        snackbar.close();
        console.error(e);
        mdui.snackbar({message: `提交失败: ${e.message}`});
    }
}

function loginWithGitHub() {
    const width = 600;
    const height = 700;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;
    window.open(`${WORKER_URL}/auth`, 'github_oauth', `width=${width},height=${height},top=${top},left=${left}`);
}

window.addEventListener('message', (event) => {
    if (event.data.type === 'github-token') {
        localStorage.setItem('github_token', event.data.token);
        mdui.snackbar({message: 'GitHub 登录成功'});
    }
});

function showCommitDialog(defaultMsg) {
    return new Promise((resolve) => {
        const dialogHtml = `
            <div class="mdui-dialog" id="commit-dialog">
                <div class="mdui-dialog-title">提交到 GitHub</div>
                <div class="mdui-dialog-content">
                    <div class="mdui-textfield">
                        <label class="mdui-textfield-label">Commit Message / PR Title</label>
                        <input class="mdui-textfield-input" type="text" id="commit-message" value="${defaultMsg}"/>
                    </div>
                </div>
                <div class="mdui-dialog-actions">
                    <button class="mdui-btn mdui-ripple" mdui-dialog-close onclick="window._commitDialogResolve(null)">取消</button>
                    <button class="mdui-btn mdui-ripple mdui-color-theme-accent" mdui-dialog-close onclick="window._commitDialogResolve(document.getElementById('commit-message').value)">提交</button>
                </div>
            </div>
        `;
        
        const div = document.createElement('div');
        div.innerHTML = dialogHtml;
        document.body.appendChild(div.firstElementChild);
        
        window._commitDialogResolve = (val) => {
            resolve(val);
            delete window._commitDialogResolve;
            const d = document.getElementById('commit-dialog');
            if(d) d.parentNode.removeChild(d);
        };
        
        new mdui.Dialog('#commit-dialog', {history: false, modal: true}).open();
    });
}

function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}
</script>
