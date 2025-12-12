---
title: 博客编辑器
date: false
layout: page
comments: false
excerpt: markdown 博客编辑器
---

<style>
    /* Dark Mode Adaptation */
    .editor-drag-active {
        background-color: rgba(0, 0, 0, 0.05) !important;
    }
    .mdui-theme-layout-dark .editor-drag-active {
        background-color: rgba(255, 255, 255, 0.05) !important;
    }
    
    /* Markdown Preview Dark Mode Fixes */
    .mdui-theme-layout-dark .markdown-body {
        background-color: #303030 !important; /* Match MDUI dark card */
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
    
    #editor-card .mdui-fullscreen {
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
    
    /* Editor Textarea */
    #editor-content {
        color: inherit; 
        background: transparent;
    }

</style>

<div id="app" class="mdui-container-fluid mdui-p-y-2">
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
        <!-- <button class="mdui-btn mdui-btn-icon mdui-ripple mdui-m-l-1 mdui-m-b-1" onclick="toggleDarkMode()" mdui-tooltip="{content: '切换深色模式'}">
            <i class="mdui-icon material-icons">brightness_4</i>
        </button> -->
      </div>
    </div>
    <div class="mdui-row">
       <div class="mdui-col-md-6">
        <div class="mdui-textfield mdui-textfield-floating-label">
          <label class="mdui-textfield-label">标签 (逗号分隔)</label>
          <input class="mdui-textfield-input" type="text" id="post-tags" />
        </div>
      </div>
      <div class="mdui-col-md-6">
        <div class="mdui-textfield mdui-textfield-floating-label">
          <label class="mdui-textfield-label">分类 (逗号分隔)</label>
          <input class="mdui-textfield-input" type="text" id="post-categories" />
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
                             <div class="mdui-col-md-12">
                                <div class="mdui-textfield mdui-textfield-floating-label">
                                  <label class="mdui-textfield-label">版权声明 (License) - 留空为默认，填 false 关闭</label>
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
  <div class="mdui-card" id="editor-card" style="height: 70vh; display: flex; flex-direction: column; position: relative;">
    <div class="mdui-toolbar" style="flex-shrink: 0; overflow-x: auto; overflow-y: hidden; white-space: nowrap; border-bottom: 1px solid rgba(0,0,0,0.1);">
      <!-- History/General -->
      <button class="mdui-btn mdui-btn-icon" onclick="undo()" mdui-tooltip="{content: '撤销 (Ctrl+Z)'}"><i class="mdui-icon material-icons">undo</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="redo()" mdui-tooltip="{content: '重做 (Ctrl+Y)'}"><i class="mdui-icon material-icons">redo</i></button>
      <!-- Text Style -->
      <button class="mdui-btn mdui-btn-icon" onclick="insertText('**', '**')" mdui-tooltip="{content: '粗体'}"><i class="mdui-icon material-icons">format_bold</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="insertText('*', '*')" mdui-tooltip="{content: '斜体'}"><i class="mdui-icon material-icons">format_italic</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="insertText('<u>', '</u>')" mdui-tooltip="{content: '下划线'}"><i class="mdui-icon material-icons">format_underlined</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="insertText('~~', '~~')" mdui-tooltip="{content: '删除线'}"><i class="mdui-icon material-icons">format_strikethrough</i></button>
      <button class="mdui-btn mdui-btn-icon" id="font-size-btn" mdui-tooltip="{content: '字体大小'}"><i class="mdui-icon material-icons">format_size</i></button>
      <button class="mdui-btn mdui-btn-icon" id="text-color-btn" mdui-tooltip="{content: '文本颜色'}"><i class="mdui-icon material-icons">format_color_text</i></button>
    <!-- Paragraph Style -->
      <button class="mdui-btn mdui-btn-icon" onclick="insertText('# ', '')" mdui-tooltip="{content: '标题'}"><i class="mdui-icon material-icons">title</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="setAlign('left')" mdui-tooltip="{content: '左对齐'}"><i class="mdui-icon material-icons">format_align_left</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="setAlign('center')" mdui-tooltip="{content: '居中对齐'}"><i class="mdui-icon material-icons">format_align_center</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="setAlign('right')" mdui-tooltip="{content: '右对齐'}"><i class="mdui-icon material-icons">format_align_right</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="clearFormatting()" mdui-tooltip="{content: '清除格式'}"><i class="mdui-icon material-icons">format_clear</i></button>
      <!-- Insert -->
      <button class="mdui-btn mdui-btn-icon" onclick="insertText('- ', '')" mdui-tooltip="{content: '列表'}"><i class="mdui-icon material-icons">format_list_bulleted</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="insertText('[', '](url)')" mdui-tooltip="{content: '链接'}"><i class="mdui-icon material-icons">link</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="document.getElementById('image-input').click()" mdui-tooltip="{content: '插入图片'}"><i class="mdui-icon material-icons">image</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="insertTable()" mdui-tooltip="{content: '表格'}"><i class="mdui-icon material-icons">grid_on</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="insertText('```\n', '\n```')" mdui-tooltip="{content: '代码块'}"><i class="mdui-icon material-icons">code</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="insertText('\n<\!-- more -->\n', '')" mdui-tooltip="{content: '插入摘要分隔符'}"><i class="mdui-icon material-icons">more_horiz</i></button>
      <div class="mdui-toolbar-spacer"></div>
      <!-- View -->
      <button class="mdui-btn mdui-btn-icon" onclick="toggleFullscreen()" mdui-tooltip="{content: '全屏模式'}"><i class="mdui-icon material-icons" id="fullscreen-icon">fullscreen</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="togglePreview()" mdui-tooltip="{content: '切换预览'}"><i class="mdui-icon material-icons">visibility</i></button>
      <!-- Menus (Must be siblings of triggers) -->
      <ul class="mdui-menu" id="font-size-menu">
        <li class="mdui-menu-item"><a style="font-size:12px" href="javascript:;" onclick="setFontSize('12px')">12px (小)</a></li>
        <li class="mdui-menu-item"><a style="font-size:14px" href="javascript:;" onclick="setFontSize('14px')">14px (正常)</a></li>
        <li class="mdui-menu-item"><a style="font-size:16px" href="javascript:;" onclick="setFontSize('16px')">16px (中)</a></li>
        <li class="mdui-menu-item"><a style="font-size:20px" href="javascript:;" onclick="setFontSize('20px')">20px (大)</a></li>
            <li class="mdui-menu-item mdui-p-a-2" style="min-width: 200px; max-width: 240px;">
                <div class="mdui-typo-caption mdui-text-color-grey-600 mdui-text-center">自定义大小</div>
                <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
                    <label class="mdui-slider mdui-slider-discrete" style="width: 90%; margin: 0 auto;">
                        <input type="range" step="1" min="10" max="60" value="16" style="width: 100%;" oninput="document.getElementById('custom-font-size-val').innerText = this.value + 'px'" onchange="setFontSize(this.value + 'px')"/>
                    </label>
                    <div class="mdui-text-center mdui-text-color-grey-600" id="custom-font-size-val" style="width: 100%;">16px</div>
                </div>
            </li>
            <div class="mdui-text-center" id="custom-font-size-val">16px</div>
        </li>
      </ul>
      <ul class="mdui-menu" id="text-color-menu">
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
    
<div class="mdui-row mdui-m-a-0" style="flex: 1; overflow: hidden;">
      <div class="mdui-col-xs-12 mdui-p-a-0" id="editor-col" style="height: 100%;">
        <textarea id="editor-content" class="mdui-p-a-2" style="width: 100%; height: 100%; border: none; resize: none; outline: none; font-family: monospace; font-size: 14px; line-height: 1.5; overflow-y: auto;" placeholder="撰写你的想法..."></textarea>
      </div>
      <div class="mdui-col-xs-12 mdui-p-a-2 markdown-body mdui-typo" id="preview-content" style="height: 100%; overflow-y: auto; display: none;">
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

<script>
// --- State & Config ---
let imageAssets = {}; // In-memory cache of images: { filename: Blob }
const DB_KEY_CONTENT = 'blog_editor_content';
const DB_KEY_IMAGES = 'blog_editor_images';

// --- History Management ---
let historyStack = [];
let redoStack = [];
const MAX_HISTORY = 50;

// --- Auto-save & History Timer ---
let autoSaveTimer;
function triggerAutoSave() {
    const status = document.getElementById('save-status');
    status.innerHTML = '<span class="mdui-text-color-grey-500" style="display: flex; align-items: center;"> 正在保存... </span>';
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(saveState, 2000);
}

let historyDebounceTimer;
function triggerHistorySave() {
    clearTimeout(historyDebounceTimer);
    historyDebounceTimer = setTimeout(recordHistory, 1000);
}

function recordHistory() {
    const editor = document.getElementById('editor-content');
    const content = editor.value;
    
    // Avoid duplicates (only check content)
    if (historyStack.length > 0) {
        const last = historyStack[historyStack.length - 1];
        if (last.content === content) return;
    }

    historyStack.push({
        content: content,
        selectionStart: editor.selectionStart,
        selectionEnd: editor.selectionEnd
    });
    
    if (historyStack.length > MAX_HISTORY) historyStack.shift();
    redoStack = []; // Clear redo on new action
}

function undo() {
    if (historyStack.length === 0) return;
    
    const editor = document.getElementById('editor-content');
    // Save current state to redo
    redoStack.push({
        content: editor.value,
        selectionStart: editor.selectionStart,
        selectionEnd: editor.selectionEnd
    });
    
    const prev = historyStack.pop();
    editor.value = prev.content;
    editor.selectionStart = prev.selectionStart;
    editor.selectionEnd = prev.selectionEnd;
    updatePreview();
    triggerAutoSave(); // Save after undo
}

function redo() {
    if (redoStack.length === 0) return;
    
    const editor = document.getElementById('editor-content');
    // Save current to history
    historyStack.push({
        content: editor.value,
        selectionStart: editor.selectionStart,
        selectionEnd: editor.selectionEnd
    });
    
    const next = redoStack.pop();
    editor.value = next.content;
    editor.selectionStart = next.selectionStart;
    editor.selectionEnd = next.selectionEnd;
    updatePreview();
    triggerAutoSave(); // Save after redo
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Menus
    new mdui.Menu('#font-size-btn', '#font-size-menu', { covered: false, fixed: false,position: 'bottom', align:'right',gutter: 32 });
    new mdui.Menu('#text-color-btn', '#text-color-menu', { covered: false, fixed: false, position: 'bottom', align:'right', gutter: 32 });

    // Configure Marked Renderer for Image Preview
    const renderer = {
        image(href, title, text) {
            // Compatible with Marked v12+ where arguments are passed as an object
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
                    const blob = imageAssets[decodedFilename];
                    const url = URL.createObjectURL(blob);
                    return `<img src="${url}" alt="${text}" title="${title || ''}" style="max-width: 100%;" />`;
                }
            }
            // Fallback
            return `<img src="${href}" alt="${text}"${title ? ` title="${title}"` : ''} style="max-width: 100%;">`;
        }
    };
    marked.use({ renderer });

    // Ensure idbKeyval is available
    if (typeof idbKeyval === 'undefined') {
        console.error('idbKeyval library not loaded!');
        mdui.snackbar({message: '自动保存功能不可用 (库加载失败)'});
        return;
    }

    // Load saved state
    try {
        const savedContent = await idbKeyval.get(DB_KEY_CONTENT);
        if (savedContent) {
            document.getElementById('post-title').value = savedContent.title || '';
            document.getElementById('post-slug').value = savedContent.slug || '';
            document.getElementById('post-tags').value = savedContent.tags || '';
            document.getElementById('post-categories').value = savedContent.categories || '';
            document.getElementById('editor-content').value = savedContent.content || '';
            
            // Load advanced settings
            document.getElementById('post-donate').checked = savedContent.donate !== false;
            document.getElementById('post-toc').checked = savedContent.toc !== false;
            document.getElementById('post-comments').checked = savedContent.comments !== false;
            document.getElementById('post-top').checked = savedContent.top === true;
            if(savedContent.date) document.getElementById('post-date').value = savedContent.date;
            
            if(savedContent.author) document.getElementById('post-author').value = savedContent.author;
            if(savedContent.thumbnail) document.getElementById('post-thumbnail').value = savedContent.thumbnail;
            if(savedContent.excerpt) document.getElementById('post-excerpt').value = savedContent.excerpt;
            if(savedContent.license) document.getElementById('post-license').value = savedContent.license;
            
            document.getElementById('post-count').checked = savedContent.count !== false;
            document.getElementById('post-share_menu').checked = savedContent.share_menu !== false;
            document.getElementById('post-qrcode').checked = savedContent.qrcode !== false;
            document.getElementById('post-thislink').checked = savedContent.thislink !== false;

            updatePreview();
            mdui.updateTextFields();
        } else {
            // Initialize new UUID if empty
            if(!document.getElementById('post-slug').value) {
                 // Maybe don't auto-fill slug yet, wait for title?
            }
        }
        
        const savedImages = await idbKeyval.get(DB_KEY_IMAGES);
        if (savedImages) {
            imageAssets = savedImages;
        }
    } catch (e) {
        console.error("Failed to load saved state", e);
    }

    // Initialize History
    recordHistory();

    // Event Listeners
    const editor = document.getElementById('editor-content');
    editor.addEventListener('input', () => {
        updatePreview();
        triggerAutoSave();
        triggerHistorySave();
    });

    // History Shortcuts & Typing
    editor.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
            e.preventDefault();
            if (e.shiftKey) redo();
            else undo();
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
            e.preventDefault();
            redo();
        } else if (e.key === ' ' || e.key === 'Enter') {
             recordHistory();
        }
    });

    // Attach auto-save to all other inputs
    document.querySelectorAll('.mdui-textfield-input, input[type="checkbox"]').forEach(input => {
        input.addEventListener('input', triggerAutoSave);
        input.addEventListener('change', triggerAutoSave);
    });
    
    // const editor = document.getElementById('editor-content'); // Already defined above
    editor.addEventListener('dragover', (e) => { e.preventDefault(); e.stopPropagation(); editor.classList.add('editor-drag-active'); });
    editor.addEventListener('dragleave', (e) => { e.preventDefault(); e.stopPropagation(); editor.classList.remove('editor-drag-active'); });
    editor.addEventListener('drop', handleDrop);
    
    // Image Input Listener
    document.getElementById('image-input').addEventListener('change', handleImageSelect);
    // Thumbnail Input Listener
    document.getElementById('thumbnail-input').addEventListener('change', handleThumbnailSelect);
    // Zip Input Listener
    document.getElementById('zip-input').addEventListener('change', handleZipImport);
});

// --- Core Functions ---

function generateUUID() {
    function s4() { return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function updatePreview() {
    const text = document.getElementById('editor-content').value;
    const html = marked.parse(text);
    document.getElementById('preview-content').innerHTML = html;
}

async function saveState() {
    const state = {
        title: document.getElementById('post-title').value,
        slug: document.getElementById('post-slug').value,
        tags: document.getElementById('post-tags').value,
        categories: document.getElementById('post-categories').value,
        content: document.getElementById('editor-content').value,
        donate: document.getElementById('post-donate').checked,
        toc: document.getElementById('post-toc').checked,
        comments: document.getElementById('post-comments').checked,
        top: document.getElementById('post-top').checked,
        date: document.getElementById('post-date').value,
        author: document.getElementById('post-author').value,
        thumbnail: document.getElementById('post-thumbnail').value,
        excerpt: document.getElementById('post-excerpt').value,
        license: document.getElementById('post-license').value,
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
        const timeStr = new Date().toLocaleTimeString();
        status.innerHTML = '<span class="mdui-text-color-green-500" style="display: flex; align-items: center; font-weight: bold;"><i class="mdui-icon material-icons" style="font-size: 18px; margin-right: 4px;">done_all</i> 已保存 ' + timeStr + '</span>';
        
        setTimeout(() => {
            status.innerHTML = '<span class="mdui-text-color-grey-500" style="display: flex; align-items: center;"><i class="mdui-icon material-icons" style="font-size: 18px; margin-right: 4px;">done</i> 上次保存 ' + timeStr + '</span>';
        }, 3000);
    } catch (e) {
        console.error("Save failed", e);
        document.getElementById('save-status').innerHTML = '<span class="mdui-text-color-red-500">保存失败!</span>';
    }
}

function insertText(before, after) {
    recordHistory();
    const textarea = document.getElementById('editor-content');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selection = text.substring(start, end);
    
    const newText = before + selection + after;
    textarea.value = text.substring(0, start) + newText + text.substring(end);
    
    textarea.selectionStart = start + before.length;
    textarea.selectionEnd = start + before.length + selection.length;
    textarea.focus();
    updatePreview();
    triggerAutoSave();
}

// --- Table Editor ---
let tableEditorState = {
    rows: 3,
    cols: 3,
    alignment: [], 
    data: [], 
    styles: [] 
};
let selectedCell = null;

function insertTable() {
    // 每次都检测并插入到正确父节点
    let dialog = document.getElementById('table-editor-dialog');
    if (dialog) {
        // 若已存在，先移除
        dialog.parentNode && dialog.parentNode.removeChild(dialog);
    }
    initTableEditor();

    // Reset State
    tableEditorState = {
        rows: 3,
        cols: 3,
        alignment: ['left', 'left', 'left'],
        data: [['Header 1', 'Header 2', 'Header 3'], ['Text', 'Text', 'Text'], ['Text', 'Text', 'Text']],
        styles: Array(3).fill().map(() => Array(3).fill({}))
    };

    // Update UI inputs
    const rowsInput = document.getElementById('table-rows');
    const colsInput = document.getElementById('table-cols');
    if(rowsInput) rowsInput.value = 3;
    if(colsInput) colsInput.value = 3;

    renderTableEditor();
    new mdui.Dialog('#table-editor-dialog', { history: false, modal: true }).open();
}

function initTableEditor() {
    // Inject Styles
    const style = document.createElement('style');
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

    // Inject Dialog HTML
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
                 <span class="mdui-typo-caption mdui-text-color-grey-600">点击列头切换对齐方式</span>
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
    // 判断是否全屏，将对话框插入到全屏元素内，否则插入body
    let parent = document.body;
    // 兼容各浏览器全屏API
    const fullscreenElem = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
    if (fullscreenElem && fullscreenElem.id === 'editor-card') {
        parent = fullscreenElem;
    }
    parent.appendChild(div.firstElementChild);

    // Event Listeners
    document.getElementById('table-update-dim').addEventListener('click', () => {
        const r = parseInt(document.getElementById('table-rows').value) || 1;
        const c = parseInt(document.getElementById('table-cols').value) || 1;
        updateTableDims(r, c);
    });
    
    document.getElementById('apply-style-btn').addEventListener('click', applyStyleToSelected);
    document.getElementById('clear-style-btn').addEventListener('click', clearStyleSelected);
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

    // Resize Dialog to fit content
    const dialog = document.getElementById('table-editor-dialog');
    if (dialog) {
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        
        // Calculate optimal width: cols * 120px (min-width 80 + padding) + extra for dialog padding
        let newW = Math.max(600, cols * 120 + 60);
        if (newW > winW * 0.95) newW = winW * 0.95;
        
        // Calculate optimal height: rows * 60px + header/footer/controls (~250px)
        let newH = Math.max(500, rows * 60 + 250);
        if (newH > winH * 0.9) newH = winH * 0.9;
        
        dialog.style.width = newW + 'px';
        dialog.style.maxWidth = '95vw';
        
        const content = dialog.querySelector('.mdui-dialog-content');
        if (content) {
            content.style.height = newH + 'px';
        }
        
        // Trigger MDUI update to re-center
        mdui.mutation();
        window.dispatchEvent(new Event('resize'));
    }
}

function renderTableEditor() {
    const grid = document.getElementById('table-editor-grid');
    grid.style.gridTemplateColumns = `repeat(${tableEditorState.cols}, 1fr)`;
    grid.innerHTML = '';

    // Render Column Controls
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

    // Render Cells
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
    const { rows, cols, data, alignment, styles } = tableEditorState;

    // Header Row (Row 0)
    md += '|';
    for(let j=0; j<cols; j++) {
        md += ` ${formatCell(0, j)} |`;
    }
    md += '\n|';
    
    // Separator Row
    for(let j=0; j<cols; j++) {
        const align = alignment[j];
        if(align === 'left') md += ' :--- |';
        else if(align === 'center') md += ' :---: |';
        else md += ' ---: |';
    }
    md += '\n';

    // Data Rows
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
    // Escape pipes
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
    recordHistory();
    const textarea = document.getElementById('editor-content');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selection = text.substring(start, end);
    
    // Remove span and div tags
    const newText = selection.replace(/<\/?(span|div)[^>]*>/gi, '');
    
    textarea.value = text.substring(0, start) + newText + text.substring(end);
    
    textarea.selectionStart = start;
    textarea.selectionEnd = start + newText.length;
    textarea.focus();
    updatePreview();
    triggerAutoSave();
}

function togglePreview() {
    const editorCol = document.getElementById('editor-col');
    const previewCol = document.getElementById('preview-content');
    
    if (previewCol.style.display === 'none') {
        // Show Preview, Hide Editor
        editorCol.style.display = 'none';
        previewCol.style.display = 'block';
    } else {
        // Show Editor, Hide Preview
        editorCol.style.display = 'block';
        previewCol.style.display = 'none';
    }
}

async function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('editor-content').classList.remove('editor-drag-active');
    
    const files = e.dataTransfer.files;
    if (!files.length) return;
    await processImageFiles(files);
}

async function handleImageSelect(e) {
    const files = e.target.files;
    if (!files.length) return;
    await processImageFiles(files);
    e.target.value = ''; // Reset input
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
        document.getElementById('post-thumbnail').value = imgPath;
        mdui.updateTextFields();
        
        mdui.snackbar({message: `头图已处理`});
    } catch (error) {
        console.error(error);
        mdui.snackbar({message: `头图处理失败: ${error.message}`});
    }
    e.target.value = '';
}

async function processImageFiles(files) {
    recordHistory();
    const slug = document.getElementById('post-slug').value || 'untitled';
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;

        // Compress
        try {
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true
            };
            const compressedFile = await imageCompression(file, options);
            
            // Generate filename
            const ext = file.name.split('.').pop();
            const filename = `img_${Date.now()}_${i}.${ext}`;
            
            // Store
            imageAssets[filename] = compressedFile;
            
            // Insert Markdown
            // Path convention: /images/blog/<slug>/<filename>
            const imgPath = `/images/blog/${slug}/${filename}`;
            insertText(`![](${imgPath})`, '');
            
            mdui.snackbar({message: `图片 ${file.name} 已处理并添加`});
        } catch (error) {
            console.error(error);
            mdui.snackbar({message: `图片处理失败: ${error.message}`});
        }
    }
    updatePreview();
}

async function handleZipImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    recordHistory();

    try {
        const zip = await JSZip.loadAsync(file);
        
        // Find .md file
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
        
        // Parse Front Matter
        const fmRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
        const match = mdContent.match(fmRegex);
        
        if (match) {
            const fmText = match[1];
            const content = match[2];
            
            // Simple YAML parser (assuming standard format generated by this tool)
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
            // Slug from filename or title? Better from filename if possible, but here we rely on user input or existing.
            // Let's try to extract slug from zip path: source/_posts/slug.md
            const slugMatch = mdFile.name.match(/source\/_posts\/(.*)\.md/);
            document.getElementById('post-slug').value = slugMatch ? slugMatch[1] : (getVal('title') || '');
            
            document.getElementById('post-tags').value = getArr('tags');
            document.getElementById('post-categories').value = getArr('categories');
            document.getElementById('post-date').value = getVal('date') || '';
            
            document.getElementById('post-donate').checked = getVal('donate') !== 'false';
            document.getElementById('post-toc').checked = getVal('toc') !== 'false';
            document.getElementById('post-comments').checked = getVal('comments') !== 'false';
            // top is usually not there unless true
            document.getElementById('post-top').checked = getVal('top') === 'true';
            
            document.getElementById('post-author').value = getVal('author') || '';
            document.getElementById('post-thumbnail').value = getVal('thumbnail') || '';
            document.getElementById('post-excerpt').value = getVal('excerpt') || '';
            document.getElementById('post-license').value = getVal('license') || '';
            
            document.getElementById('post-count').checked = getVal('count') !== 'false';
            document.getElementById('post-share_menu').checked = getVal('share_menu') !== 'false';
            document.getElementById('post-qrcode').checked = getVal('qrcode') !== 'false';
            document.getElementById('post-thislink').checked = getVal('thislink') !== 'false';

            document.getElementById('editor-content').value = content.trim();
        } else {
            document.getElementById('editor-content').value = mdContent;
        }
        
        // Load Images
        imageAssets = {};
        const imgFolderPrefix = `source/images/blog/${document.getElementById('post-slug').value}/`;
        
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
        
        updatePreview();
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
    const content = document.getElementById('editor-content').value;
    
    const donate = document.getElementById('post-donate').checked;
    const toc = document.getElementById('post-toc').checked;
    const comments = document.getElementById('post-comments').checked;
    const top = document.getElementById('post-top').checked;
    const customDate = document.getElementById('post-date').value;
    
    const author = document.getElementById('post-author').value;
    const thumbnail = document.getElementById('post-thumbnail').value;
    const excerpt = document.getElementById('post-excerpt').value;
    const license = document.getElementById('post-license').value;
    const count = document.getElementById('post-count').checked;
    const share_menu = document.getElementById('post-share_menu').checked;
    const qrcode = document.getElementById('post-qrcode').checked;
    const thislink = document.getElementById('post-thislink').checked;

    // Generate Front Matter
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
    if(!count) frontMatter += `count: false\n`;
    if(!share_menu) frontMatter += `share_menu: false\n`;
    if(!qrcode) frontMatter += `qrcode: false\n`;
    if(!thislink) frontMatter += `thislink: false\n`;
    
    frontMatter += `---\n\n${content}\n`;

    // Add Post File
    zip.file(`source/_posts/${slug}.md`, frontMatter);
    
    // Add Images
    const imgFolder = zip.folder(`source/images/blog/${slug}`);
    for (const [filename, blob] of Object.entries(imageAssets)) {
        if (content.includes(filename)) {
             imgFolder.file(filename, blob);
        }
    }
    
    // Generate Zip
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
        document.getElementById('post-license').value = '';
        document.getElementById('editor-content').value = '';
        
        document.getElementById('post-donate').checked = true;
        document.getElementById('post-toc').checked = true;
        document.getElementById('post-comments').checked = true;
        document.getElementById('post-top').checked = false;
        
        document.getElementById('post-count').checked = true;
        document.getElementById('post-share_menu').checked = true;
        document.getElementById('post-qrcode').checked = true;
        document.getElementById('post-thislink').checked = true;

        imageAssets = {};
        idbKeyval.del(DB_KEY_CONTENT);
        idbKeyval.del(DB_KEY_IMAGES);
        updatePreview();
        mdui.updateTextFields();
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('mdui-theme-layout-dark');
}

function toggleFullscreen() {
    const elem = document.getElementById('editor-card');
    const icon = document.getElementById('fullscreen-icon');
    
    if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }
        icon.innerText = 'fullscreen_exit';
        elem.style.height = '100vh'; // Force full height
        elem.style.borderRadius = '0';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
        icon.innerText = 'fullscreen';
        elem.style.height = '70vh'; // Restore original height
        elem.style.borderRadius = '';
    }
}

// Listen for fullscreen change events (e.g. user presses Esc)
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

function handleFullscreenChange() {
    const elem = document.getElementById('editor-card');
    const icon = document.getElementById('fullscreen-icon');
    
    if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
        icon.innerText = 'fullscreen';
        elem.style.height = '70vh';
        elem.style.borderRadius = '';
    } else {
        icon.innerText = 'fullscreen_exit';
        elem.style.height = '100vh';
        elem.style.borderRadius = '0';
    }
}

// --- GitHub Submission ---
const WORKER_URL = 'https://pr-helper.cf.miniproj.stevezmt.top'; // TODO: Replace with your Worker URL
// REPO_OWNER and REPO_NAME are now enforced by the Worker, but we keep them here if needed for other logic or future use.
// The Worker will ignore these if sent in the body, but for compatibility we can leave them or remove them from the body payload.

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
    if (!message) return; // User cancelled

    // Prepare files
    const files = [];
    
    // 1. Markdown
    const title = document.getElementById('post-title').value || 'Untitled';
    const tags = document.getElementById('post-tags').value.split(',').map(t => t.trim()).filter(t => t);
    const categories = document.getElementById('post-categories').value.split(',').map(c => c.trim()).filter(c => c);
    const content = document.getElementById('editor-content').value;
    
    const donate = document.getElementById('post-donate').checked;
    const toc = document.getElementById('post-toc').checked;
    const comments = document.getElementById('post-comments').checked;
    const top = document.getElementById('post-top').checked;
    const customDate = document.getElementById('post-date').value;
    
    const author = document.getElementById('post-author').value;
    const thumbnail = document.getElementById('post-thumbnail').value;
    const excerpt = document.getElementById('post-excerpt').value;
    const license = document.getElementById('post-license').value;
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

    // 2. Images
    for (const [filename, blob] of Object.entries(imageAssets)) {
        if (content.includes(filename)) {
             const base64 = await blobToBase64(blob);
             files.push({
                 path: `source/images/blog/${slug}/${filename}`,
                 content: base64,
                 encoding: 'base64'
             });
        }
    }

    // Send to Worker
    const snackbar = mdui.snackbar({message: '正在提交到 GitHub...', timeout: 0});
    
    try {
        const response = await fetch(`${WORKER_URL}/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token,
                files,
                message
                // owner and repo are removed from payload as they are enforced by server
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
