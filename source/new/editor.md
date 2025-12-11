---
title: 博客编辑器
date: false
layout: page
comments: false
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
    <div class="mdui-toolbar" style="flex-shrink: 0; overflow-x: auto; white-space: nowrap; border-bottom: 1px solid rgba(0,0,0,0.1);">
      <button class="mdui-btn mdui-btn-icon" onclick="insertText('**', '**')" mdui-tooltip="{content: '粗体'}"><i class="mdui-icon material-icons">format_bold</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="insertText('*', '*')" mdui-tooltip="{content: '斜体'}"><i class="mdui-icon material-icons">format_italic</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="insertText('<u>', '</u>')" mdui-tooltip="{content: '下划线'}"><i class="mdui-icon material-icons">format_underlined</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="insertText('~~', '~~')" mdui-tooltip="{content: '删除线'}"><i class="mdui-icon material-icons">format_strikethrough</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="insertText('# ', '')" mdui-tooltip="{content: '标题'}"><i class="mdui-icon material-icons">title</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="insertText('- ', '')" mdui-tooltip="{content: '列表'}"><i class="mdui-icon material-icons">format_list_bulleted</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="insertText('[', '](url)')" mdui-tooltip="{content: '链接'}"><i class="mdui-icon material-icons">link</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="document.getElementById('image-input').click()" mdui-tooltip="{content: '插入图片'}"><i class="mdui-icon material-icons">image</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="insertTable()" mdui-tooltip="{content: '表格'}"><i class="mdui-icon material-icons">grid_on</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="insertText('```\n', '\n```')" mdui-tooltip="{content: '代码块'}"><i class="mdui-icon material-icons">code</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="insertText('\n<\!-- more -->\n', '')" mdui-tooltip="{content: '插入摘要分隔符'}"><i class="mdui-icon material-icons">more_horiz</i></button>
      <div class="mdui-toolbar-spacer"></div>
      <button class="mdui-btn mdui-btn-icon" onclick="toggleFullscreen()" mdui-tooltip="{content: '全屏模式'}"><i class="mdui-icon material-icons" id="fullscreen-icon">fullscreen</i></button>
      <button class="mdui-btn mdui-btn-icon" onclick="togglePreview()" mdui-tooltip="{content: '切换预览'}"><i class="mdui-icon material-icons">visibility</i></button>
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

// --- Initialization ---
document.addEventListener('DOMContentLoaded', async () => {
    // Configure Marked Renderer for Image Preview
    const renderer = new marked.Renderer();
    const originalImage = renderer.image;
    renderer.image = function(href, title, text) {
        // Check if href matches a cached image
        // href format: /images/blog/<slug>/<filename>
        const filename = href.split('/').pop();
        if (imageAssets[filename]) {
            const blob = imageAssets[filename];
            const url = URL.createObjectURL(blob);
            // Note: This creates object URLs that should ideally be revoked.
            // Given the simplicity, we rely on page refresh to clear them, 
            // or we could track them in a list and revoke on next update.
            return `<img src="${url}" alt="${text}" title="${title || ''}" style="max-width: 100%;" />`;
        }
        return originalImage.call(this, href, title, text);
    };
    marked.setOptions({ renderer: renderer });

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

    // Auto-save Logic (Debounce 2s)
    let autoSaveTimer;
    function triggerAutoSave() {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(saveState, 2000);
    }

    // Event Listeners
    document.getElementById('editor-content').addEventListener('input', () => {
        updatePreview();
        triggerAutoSave();
    });

    // Attach auto-save to all other inputs
    document.querySelectorAll('.mdui-textfield-input, input[type="checkbox"]').forEach(input => {
        input.addEventListener('input', triggerAutoSave);
        input.addEventListener('change', triggerAutoSave);
    });
    
    const editor = document.getElementById('editor-content');
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
    status.innerHTML = '<span class="mdui-text-color-grey-500" style="display: flex; align-items: center;"> 正在保存... </span>';
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
}

function insertTable() {
    const table = `
| Column 1 | Column 2 | Column 3 |
| :--- | :---: | ---: |
| Text | Text | Text |
| Text | Text | Text |
`;
    insertText(table, '');
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
    
    const slug = document.getElementById('post-slug').value || 'temp';
    
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
    const slug = document.getElementById('post-slug').value || 'temp';
    
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
</script>
