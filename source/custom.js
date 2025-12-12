document.addEventListener('DOMContentLoaded', function() {
    // Inject HTML
    const lightboxHTML = `
        <div id="lightbox-overlay">
            <div class="lightbox-loader"></div>
            <div id="lightbox-image-container">
                <img id="lightbox-image" src="" alt="">
            </div>
            <div class="lightbox-controls">
                <button class="lightbox-btn" id="lb-zoom-in" title="放大"><i class="mdui-icon material-icons">zoom_in</i></button>
                <button class="lightbox-btn" id="lb-zoom-out" title="缩小"><i class="mdui-icon material-icons">zoom_out</i></button>
                <button class="lightbox-btn" id="lb-rotate" title="旋转"><i class="mdui-icon material-icons">rotate_right</i></button>
                <button class="lightbox-btn" id="lb-copy" title="复制图片"><i class="mdui-icon material-icons">content_copy</i></button>
                <button class="lightbox-btn" id="lb-download" title="下载"><i class="mdui-icon material-icons">file_download</i></button>
                <button class="lightbox-btn" id="lb-ocr" title="OCR 文字识别"><i class="mdui-icon material-icons">text_fields</i></button>
            </div>
            <div class="lightbox-close"><i class="mdui-icon material-icons">close</i></div>
            <div class="lightbox-nav lightbox-prev"><i class="mdui-icon material-icons">chevron_left</i></div>
            <div class="lightbox-nav lightbox-next"><i class="mdui-icon material-icons">chevron_right</i></div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);

    const overlay = document.getElementById('lightbox-overlay');
    const img = document.getElementById('lightbox-image');
    const loader = document.querySelector('.lightbox-loader');
    let currentScale = 1;
    let currentRotation = 0;
    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;
    let galleryImages = [];
    let currentIndex = 0;

    // Helper: Reset view
    function resetView() {
        currentScale = 1;
        currentRotation = 0;
        translateX = 0;
        translateY = 0;
        updateTransform();
    }

    function updateTransform() {
        img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale}) rotate(${currentRotation}deg)`;
    }

    // Helper: Button Feedback
    function showFeedback(btnId, success) {
        const btn = document.getElementById(btnId);
        if (!btn) return;
        const icon = btn.querySelector('i');
        const originalIcon = icon.innerText;
        
        btn.classList.add(success ? 'success' : 'error');
        icon.innerText = success ? 'check' : 'close';
        
        setTimeout(() => {
            btn.classList.remove('success', 'error');
            icon.innerText = originalIcon;
        }, 1500);
    }

    // Open Lightbox
    function openLightbox(src, index) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        currentIndex = index; // Update index BEFORE loading image
        loadImage(src);
        resetView();
    }

    // Close Lightbox
    function closeLightbox() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            img.src = '';
            img.classList.remove('loaded');
        }, 300);
    }

    // Load Image with High Res check
    function loadImage(src) {
        loader.style.display = 'block';
        img.classList.remove('loaded');
        
        // Handle Lazyload: if src is loading icon, try to find real src from galleryImages
        // But wait, src passed here might already be the placeholder.
        // We should check if the passed src is a placeholder or if we have a better one in the gallery list?
        // Actually, when we click, we pass the current src. If it's lazyloaded, it might be the placeholder.
        // So we should rely on the index to get the best URL from galleryImages (which we will fix to store data-original)
        
        // However, if openLightbox is called with a src that is not in galleryImages (edge case), we use it as is.
        let targetSrc = src;
        if (galleryImages[currentIndex] && galleryImages[currentIndex] !== src) {
             targetSrc = galleryImages[currentIndex];
        }

        // Check for compressed
        if (targetSrc.includes('_compressed.jpg')) {
            const base = targetSrc.replace('_compressed.jpg', '');
            const extensions = ['.jpg', '.png', '.jpeg'];
            
            // Load compressed first
            setImgSrc(targetSrc);
            
            // Try to find better version
            (async () => {
                let found = false;
                let highResUrl = targetSrc;
                for (const ext of extensions) {
                    const testUrl = base + ext;
                    try {
                        const response = await fetch(testUrl, { method: 'HEAD' });
                        if (response.ok) {
                            highResUrl = testUrl;
                            found = true;
                            break;
                        }
                    } catch (e) {}
                }
                
                if (found && highResUrl !== targetSrc) {
                    const highResImg = new Image();
                    highResImg.onload = () => {
                        setImgSrc(highResUrl);
                    };
                    highResImg.src = highResUrl;
                }
            })();
        } else {
            setImgSrc(targetSrc);
        }
    }

    function setImgSrc(url) {
        const tempImg = new Image();
        tempImg.onload = () => {
            img.src = url;
            img.classList.add('loaded');
            loader.style.display = 'none';
        };
        tempImg.onerror = () => {
            loader.style.display = 'none';
            showFeedback('lightbox-image-container', false); // Visual cue if load fails
        };
        tempImg.src = url;
    }

    // Event Delegation for Images
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'IMG' && e.target.closest('.mdui-card-content')) {
            // Collect images
            const content = e.target.closest('.mdui-card-content');
            const imgs = Array.from(content.querySelectorAll('img'));
            
            // Store the BEST available URL for each image
            galleryImages = imgs.map(img => img.getAttribute('data-original') || img.src);
            
            // Find index based on the clicked element
            // We compare both src and data-original to be safe
            const clickedSrc = e.target.getAttribute('data-original') || e.target.src;
            const index = galleryImages.findIndex(url => url === clickedSrc || url === e.target.src);
            
            if (index !== -1) {
                openLightbox(galleryImages[index], index);
            }
        }
    });

    // Controls
    document.getElementById('lb-zoom-in').addEventListener('click', (e) => {
        e.stopPropagation();
        currentScale += 0.2;
        updateTransform();
    });

    document.getElementById('lb-zoom-out').addEventListener('click', (e) => {
        e.stopPropagation();
        currentScale = Math.max(0.1, currentScale - 0.2);
        updateTransform();
    });

    document.getElementById('lb-rotate').addEventListener('click', (e) => {
        e.stopPropagation();
        currentRotation += 90;
        updateTransform();
    });

    document.getElementById('lb-copy').addEventListener('click', async (e) => {
        e.stopPropagation();
        try {
            // Use Canvas to convert image to PNG for clipboard compatibility
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            canvas.toBlob(async (blob) => {
                if (!blob) {
                    showFeedback('lb-copy', false);
                    return;
                }
                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({
                            'image/png': blob
                        })
                    ]);
                    showFeedback('lb-copy', true);
                } catch (err) {
                    console.error('Clipboard write failed:', err);
                    showFeedback('lb-copy', false);
                }
            }, 'image/png');
        } catch (err) {
            console.error(err);
            showFeedback('lb-copy', false);
        }
    });

    document.getElementById('lb-download').addEventListener('click', (e) => {
        e.stopPropagation();
        try {
            const link = document.createElement('a');
            link.href = img.src;
            link.download = img.src.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showFeedback('lb-download', true);
        } catch (e) {
            showFeedback('lb-download', false);
        }
    });

    let ocrState = 'idle'; // idle, processing
    let ocrResult = '';

    // Inject OCR Dialog
    const ocrDialogHTML = `
        <div class="mdui-dialog" id="ocr-dialog" style="z-index: 10005 !important;">
            <div class="mdui-dialog-title">OCR 识别结果</div>
            <div class="mdui-dialog-content">
                <div class="mdui-textfield">
                    <textarea class="mdui-textfield-input" rows="10" readonly id="ocr-result-text"></textarea>
                </div>
            </div>
            <div class="mdui-dialog-actions">
                <button class="mdui-btn mdui-ripple" mdui-dialog-close>关闭</button>
                <button class="mdui-btn mdui-ripple mdui-text-color-theme-accent" id="ocr-dialog-copy">复制</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', ocrDialogHTML);

    function showOCRDialog(text) {
        const textarea = document.getElementById('ocr-result-text');
        textarea.value = text;
        
        const dialog = new mdui.Dialog('#ocr-dialog', {history: false});
        dialog.open();
        
        // Handle Copy in Dialog
        const copyBtn = document.getElementById('ocr-dialog-copy');
        // Remove old listeners to avoid duplicates if any (though we create dialog once)
        const newCopyBtn = copyBtn.cloneNode(true);
        copyBtn.parentNode.replaceChild(newCopyBtn, copyBtn);
        
        newCopyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(text).then(() => {
                mdui.snackbar({message: '已复制到剪贴板'});
            }).catch(() => {
                // Fallback: Select text for manual copy
                textarea.select();
                document.execCommand('copy');
                mdui.snackbar({message: '已尝试复制'});
            });
        });
    }

    document.getElementById('lb-ocr').addEventListener('click', async (e) => {
        e.stopPropagation();
        const btn = document.getElementById('lb-ocr');
        const icon = btn.querySelector('i');

        // State: Processing -> Ignore
        if (ocrState === 'processing') return;

        // State: Idle -> Start OCR
        ocrState = 'processing';
        icon.innerText = 'access_time'; // Clock icon
        btn.title = '正在识别...';
        
        // Option 1: OCR.space API (Requires Key)
        // Get a free key at https://ocr.space/ocrapi
        const ocrSpaceKey = 'K86964996388957'; // Put your key here if you want to use API
        
        if (ocrSpaceKey) {
            try {
                const formData = new FormData();
                formData.append('base64Image', await toBase64(img.src));
                formData.append('language', 'chs'); // Chinese Simplified
                formData.append('apikey', ocrSpaceKey);
                
                const res = await fetch('https://api.ocr.space/parse/image', {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                
                if (data.ParsedResults && data.ParsedResults.length > 0) {
                    ocrResult = data.ParsedResults[0].ParsedText;
                    ocrSuccess();
                } else {
                    throw new Error('No text found');
                }
            } catch (err) {
                console.error(err);
                ocrFail();
            }
            return;
        }

        // Option 2: Tesseract.js (Fallback)
        if (!window.Tesseract) {
            const script = document.createElement('script');
            script.src = 'https://gcore.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
            script.onload = runOCR;
            script.onerror = () => {
                ocrFail();
            };
            document.head.appendChild(script);
        } else {
            runOCR();
        }

        async function runOCR() {
            try {
                // Use worker with specific options to reduce warnings if possible, 
                // but mainly we just want it to work.
                const worker = await Tesseract.createWorker('chi_sim+eng', 1, {
                    logger: m => console.log(m),
                    errorHandler: err => console.error(err)
                });
                
                const ret = await worker.recognize(img.src);
                await worker.terminate();
                
                if (!ret.data.text || ret.data.text.trim().length === 0) {
                     ocrFail();
                     return;
                }

                ocrResult = ret.data.text;
                ocrSuccess();
            } catch (err) {
                console.error(err);
                ocrFail();
            }
        }

        function ocrSuccess() {
            ocrState = 'idle';
            icon.innerText = 'text_fields';
            btn.title = 'OCR 文字识别';
            showFeedback('lb-ocr', true);
            showOCRDialog(ocrResult);
        }

        function ocrFail() {
            ocrState = 'idle';
            showFeedback('lb-ocr', false);
            setTimeout(() => {
                icon.innerText = 'text_fields';
                btn.title = 'OCR 文字识别';
            }, 1500);
        }
    });
    
    // Helper: Image to Base64 (for API)
    async function toBase64(url) {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    // Navigation
    function showNext() {
        if (currentIndex < galleryImages.length - 1) {
            currentIndex++;
            loadImage(galleryImages[currentIndex]);
            resetView();
        }
    }

    function showPrev() {
        if (currentIndex > 0) {
            currentIndex--;
            loadImage(galleryImages[currentIndex]);
            resetView();
        }
    }

    document.querySelector('.lightbox-next').addEventListener('click', (e) => {
        e.stopPropagation();
        showNext();
    });

    document.querySelector('.lightbox-prev').addEventListener('click', (e) => {
        e.stopPropagation();
        showPrev();
    });

    // Close events
    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.id === 'lightbox-image-container') {
            closeLightbox();
        }
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (!overlay.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });

    // Mouse Wheel Zoom
    overlay.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY * -0.001;
        currentScale = Math.min(Math.max(.125, currentScale + delta), 4);
        updateTransform();
    });

    // Dragging
    img.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        img.classList.add('grabbing');
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateTransform();
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        img.classList.remove('grabbing');
    });
    
    document.addEventListener('mouseleave', () => {
        isDragging = false;
        img.classList.remove('grabbing');
    });

    // Touch Events for Mobile Dragging
    img.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            e.preventDefault();
            isDragging = true;
            startX = e.touches[0].clientX - translateX;
            startY = e.touches[0].clientY - translateY;
            img.classList.add('grabbing');
        }
    });

    img.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        if (e.touches.length === 1) {
            translateX = e.touches[0].clientX - startX;
            translateY = e.touches[0].clientY - startY;
            updateTransform();
        }
    });

    img.addEventListener('touchend', () => {
        isDragging = false;
        img.classList.remove('grabbing');
    });
});
