(function () {
  'use strict';

  var TESSERACT_SRC = 'https://gcore.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
  var MIN_SCALE = 1;
  var MAX_SCALE = 6;
  var ZOOM_STEP = 1.25;
  var DOUBLE_TAP_DELAY = 320;
  var CONTROLS_HIDE_DELAY = 2400;
  var PLACEHOLDERS = ['/images/loading.svg', '/images/grey.png'];

  var dom = {};
  var state = {
    initialized: false,
    listeners: [],
    items: [],
    index: -1,
    isOpen: false,
    hasImage: false,
    loadToken: 0,
    currentUrl: '',
    naturalWidth: 0,
    naturalHeight: 0,
    baseWidth: 0,
    baseHeight: 0,
    transform: {
      scale: 1,
      x: 0,
      y: 0,
      rotation: 0
    },
    pointers: new Map(),
    drag: null,
    pinch: null,
    gestureWasPinch: false,
    lastTap: {
      time: 0,
      x: 0,
      y: 0
    },
    lastFocus: null,
    previousBodyOverflow: '',
    closeTimer: null,
    controlsTimer: null,
    toastTimer: null,
    ocrScriptPromise: null,
    ocrState: 'idle',
    ocrDialogInstance: null
  };

  function addListener(target, type, handler, options) {
    if (!target) return;
    target.addEventListener(type, handler, options);
    state.listeners.push([target, type, handler, options]);
  }

  function removeListeners() {
    state.listeners.forEach(function (entry) {
      entry[0].removeEventListener(entry[1], entry[2], entry[3]);
    });
    state.listeners = [];
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
      return;
    }
    fn();
  }

  function icon(name) {
    return '<i class="mdui-icon material-icons" translate="no" aria-hidden="true">' + name + '</i>';
  }

  function createButton(action, label, iconName, extraClass) {
    return '<button class="site-lightbox__button ' + (extraClass || '') + '" type="button" data-site-lightbox-action="' + action + '" title="' + label + '" aria-label="' + label + '">' + icon(iconName) + '</button>';
  }

  function createDom() {
    if (dom.overlay) return;

    var overlay = document.createElement('div');
    overlay.className = 'site-lightbox';
    overlay.hidden = true;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', '图片查看器');
    overlay.tabIndex = -1;
    overlay.innerHTML = [
      '<div class="site-lightbox__viewport" data-site-lightbox-viewport>',
      '  <div class="site-lightbox__loader" aria-hidden="true" hidden></div>',
      '  <img class="site-lightbox__image" alt="" draggable="false">',
      '  <div class="site-lightbox__error" role="status" hidden>图片加载失败</div>',
      '</div>',
      '<div class="site-lightbox__topbar">',
      '  <div class="site-lightbox__meta">',
      '    <span class="site-lightbox__counter" aria-live="polite"></span>',
      '    <span class="site-lightbox__caption"></span>',
      '  </div>',
      createButton('close', '关闭', 'close', 'site-lightbox__button--close'),
      '</div>',
      '<button class="site-lightbox__nav site-lightbox__nav--prev" type="button" data-site-lightbox-action="prev" title="上一张" aria-label="上一张">' + icon('chevron_left') + '</button>',
      '<button class="site-lightbox__nav site-lightbox__nav--next" type="button" data-site-lightbox-action="next" title="下一张" aria-label="下一张">' + icon('chevron_right') + '</button>',
      '<div class="site-lightbox__toolbar" role="toolbar" aria-label="图片工具">',
      createButton('zoom-out', '缩小', 'zoom_out'),
      createButton('zoom-in', '放大', 'zoom_in'),
      createButton('reset', '重置', 'center_focus_strong'),
      createButton('rotate', '旋转', 'rotate_right'),
      createButton('copy', '复制图片', 'content_copy'),
      createButton('open', '在新标签页打开', 'open_in_new'),
      createButton('download', '下载', 'file_download'),
      createButton('ocr', 'OCR 文字识别', 'text_fields'),
      '</div>',
      '<div class="site-lightbox__toast" role="status" aria-live="polite"></div>'
    ].join('');

    document.body.appendChild(overlay);

    dom.overlay = overlay;
    dom.viewport = overlay.querySelector('[data-site-lightbox-viewport]');
    dom.loader = overlay.querySelector('.site-lightbox__loader');
    dom.image = overlay.querySelector('.site-lightbox__image');
    dom.error = overlay.querySelector('.site-lightbox__error');
    dom.counter = overlay.querySelector('.site-lightbox__counter');
    dom.caption = overlay.querySelector('.site-lightbox__caption');
    dom.toolbar = overlay.querySelector('.site-lightbox__toolbar');
    dom.toast = overlay.querySelector('.site-lightbox__toast');
    dom.prev = overlay.querySelector('[data-site-lightbox-action="prev"]');
    dom.next = overlay.querySelector('[data-site-lightbox-action="next"]');
    dom.close = overlay.querySelector('[data-site-lightbox-action="close"]');

    createOcrDialog();
  }

  function createOcrDialog() {
    var dialog = document.getElementById('site-lightbox-ocr-dialog');
    if (!dialog) {
      dialog = document.createElement('div');
      dialog.className = 'mdui-dialog site-lightbox-ocr-dialog';
      dialog.id = 'site-lightbox-ocr-dialog';
      dialog.innerHTML = [
        '<div class="mdui-dialog-title">OCR 识别结果</div>',
        '<div class="mdui-dialog-content">',
        '  <div class="mdui-textfield">',
        '    <textarea class="mdui-textfield-input site-lightbox-ocr-dialog__text" rows="10" readonly></textarea>',
        '  </div>',
        '</div>',
        '<div class="mdui-dialog-actions">',
        '  <button class="mdui-btn mdui-ripple" type="button" mdui-dialog-close>关闭</button>',
        '  <button class="mdui-btn mdui-ripple mdui-text-color-theme-accent" type="button" data-site-lightbox-ocr-copy>复制</button>',
        '</div>'
      ].join('');
      document.body.appendChild(dialog);
    }

    dom.ocrDialog = dialog;
    dom.ocrText = dialog.querySelector('.site-lightbox-ocr-dialog__text');
    dom.ocrCopy = dialog.querySelector('[data-site-lightbox-ocr-copy]');
  }

  function bindEvents() {
    addListener(document, 'click', handleDocumentClick, true);
    addListener(document, 'keydown', handleDocumentKeydown, true);
    addListener(document, 'page:phase', handlePagePhase);
    addListener(document, 'page:updated', function () { refresh(document); });
    addListener(document, 'pjax:success', function () { refresh(document); });
    addListener(window, 'resize', handleResize);

    addListener(dom.overlay, 'click', handleOverlayClick);
    addListener(dom.toolbar, 'click', handleActionClick);
    addListener(dom.overlay, 'click', handleActionClick);
    addListener(dom.overlay, 'pointermove', handleControlsActivity, { passive: true });
    addListener(dom.overlay, 'pointerdown', handleControlsActivity, { passive: true });
    addListener(dom.overlay, 'focusin', handleControlsActivity);
    addListener(dom.overlay, 'focusout', function () { scheduleControlsHide(600); });
    addListener(dom.viewport, 'wheel', handleWheel, { passive: false });
    addListener(dom.viewport, 'pointerdown', handlePointerDown);
    addListener(dom.viewport, 'pointermove', handlePointerMove);
    addListener(dom.viewport, 'pointerup', handlePointerUp);
    addListener(dom.viewport, 'pointercancel', handlePointerUp);
    addListener(dom.image, 'dblclick', handleDoubleClick);
    addListener(dom.ocrCopy, 'click', copyOcrResult);
  }

  function init() {
    if (state.initialized) return window.SiteLightbox;
    if (!document.body) {
      ready(init);
      return window.SiteLightbox;
    }

    createDom();
    bindEvents();
    state.initialized = true;
    refresh(document);
    return window.SiteLightbox;
  }

  function destroy() {
    close();
    removeListeners();
    if (dom.overlay && dom.overlay.parentNode) dom.overlay.parentNode.removeChild(dom.overlay);
    if (dom.ocrDialog && dom.ocrDialog.parentNode) dom.ocrDialog.parentNode.removeChild(dom.ocrDialog);
    dom = {};
    state.initialized = false;
    state.items = [];
    state.index = -1;
    state.pointers.clear();
  }

  function handlePagePhase(event) {
    if (!event || !event.detail) return;
    if (event.detail.stage === 'core-init' || event.detail.stage === 'after-visible') {
      refresh(document);
    }
  }

  function refresh(root) {
    root = root || document;

    var main = document.getElementById('main');
    if (!main) return false;

    if (main.dataset.pageType === 'gallery') {
      Array.prototype.forEach.call(main.querySelectorAll('[data-lightbox-item]'), function (anchor) {
        anchor.setAttribute('data-no-pjax', '');
        anchor.setAttribute('role', 'button');
        if (!anchor.hasAttribute('tabindex')) anchor.setAttribute('tabindex', '0');
      });
      return true;
    }

    if (main.dataset.pageType === 'post') {
      Array.prototype.forEach.call(main.querySelectorAll('article .mdui-card-content img'), function (img) {
        if (!isEligibleArticleImage(img)) return;
        img.classList.add('site-lightbox-trigger');
        img.setAttribute('role', 'button');
        if (!img.hasAttribute('tabindex')) img.setAttribute('tabindex', '0');
      });
      return true;
    }

    return false;
  }

  function handleDocumentClick(event) {
    if (state.isOpen) return;
    if (event.defaultPrevented) return;

    var trigger = findTrigger(event.target);
    if (!trigger) return;

    var gallery = collectItemsForTrigger(trigger);
    if (!gallery || gallery.index < 0) return;

    event.preventDefault();
    event.stopPropagation();
    open(gallery.items, gallery.index);
  }

  function handleDocumentKeydown(event) {
    if (!state.isOpen) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      var trigger = findTrigger(document.activeElement);
      if (!trigger) return;
      var gallery = collectItemsForTrigger(trigger);
      if (!gallery || gallery.index < 0) return;
      event.preventDefault();
      open(gallery.items, gallery.index);
      return;
    }

    if (isOcrDialogTarget(event.target)) return;

    showControls();

    if (event.key === 'Tab') {
      trapFocus(event);
      return;
    }

    if (isEditableTarget(event.target)) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      showNext();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showPrev();
    } else if (event.key === '+' || event.key === '=') {
      event.preventDefault();
      zoomBy(ZOOM_STEP);
    } else if (event.key === '-' || event.key === '_') {
      event.preventDefault();
      zoomBy(1 / ZOOM_STEP);
    } else if (event.key === '0') {
      event.preventDefault();
      resetTransform();
    } else if (event.key === 'r' || event.key === 'R') {
      event.preventDefault();
      rotateImage();
    }
  }

  function handleOverlayClick(event) {
    if (!state.isOpen) return;
    if (event.target === dom.viewport) {
      if (controlsAreHidden()) {
        showControls();
        return;
      }
      close();
    }
  }

  function handleActionClick(event) {
    var button = event.target.closest && event.target.closest('[data-site-lightbox-action]');
    if (!button || button.disabled) return;

    var action = button.getAttribute('data-site-lightbox-action');
    event.preventDefault();
    event.stopPropagation();
    showControls();

    if (action === 'close') close();
    else if (action === 'prev') showPrev();
    else if (action === 'next') showNext();
    else if (action === 'zoom-in') zoomBy(ZOOM_STEP);
    else if (action === 'zoom-out') zoomBy(1 / ZOOM_STEP);
    else if (action === 'reset') resetTransform();
    else if (action === 'rotate') rotateImage();
    else if (action === 'copy') copyCurrentImage();
    else if (action === 'open') openCurrentImage();
    else if (action === 'download') downloadCurrentImage();
    else if (action === 'ocr') runOcr();
  }

  function handleResize() {
    if (!state.isOpen || !state.hasImage) return;
    layoutImage();
  }

  function handleWheel(event) {
    if (!state.isOpen || !state.hasImage) return;
    event.preventDefault();
    showControls();
    var factor = Math.exp(-event.deltaY * 0.001);
    zoomTo(state.transform.scale * factor, event.clientX, event.clientY);
  }

  function handleDoubleClick(event) {
    if (!state.isOpen || !state.hasImage) return;
    event.preventDefault();
    toggleZoom(event.clientX, event.clientY);
  }

  function handlePointerDown(event) {
    if (!state.isOpen || !state.hasImage) return;
    if (event.target !== dom.image) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    event.preventDefault();
    showControls();
    try {
      dom.viewport.setPointerCapture(event.pointerId);
    } catch (e) {}

    state.pointers.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
      startX: event.clientX,
      startY: event.clientY
    });

    if (state.pointers.size === 1) {
      startDragFromPointer(firstPointer());
    } else if (state.pointers.size === 2) {
      startPinch();
    }

    dom.image.classList.add('is-grabbing');
  }

  function handlePointerMove(event) {
    if (!state.pointers.has(event.pointerId)) return;
    event.preventDefault();
    showControls();

    var pointer = state.pointers.get(event.pointerId);
    pointer.x = event.clientX;
    pointer.y = event.clientY;

    if (state.pointers.size >= 2 && state.pinch) {
      var distance = pointerDistance();
      var center = pointerCenter();
      if (distance > 0 && state.pinch.startDistance > 0) {
        zoomTo(state.pinch.startScale * (distance / state.pinch.startDistance), center.x, center.y);
        state.transform.x += center.x - state.pinch.lastCenter.x;
        state.transform.y += center.y - state.pinch.lastCenter.y;
        state.pinch.lastCenter = center;
        applyTransform();
      }
      return;
    }

    if (!state.drag) return;
    state.transform.x = state.drag.startX + pointer.x - state.drag.pointerStartX;
    state.transform.y = state.drag.startY + pointer.y - state.drag.pointerStartY;
    applyTransform();
  }

  function handlePointerUp(event) {
    if (!state.pointers.has(event.pointerId)) return;

    var pointer = state.pointers.get(event.pointerId);
    var movement = Math.hypot(pointer.x - pointer.startX, pointer.y - pointer.startY);
    state.pointers.delete(event.pointerId);

    try {
      dom.viewport.releasePointerCapture(event.pointerId);
    } catch (e) {}

    if (state.pointers.size === 0) {
      var wasPinch = state.gestureWasPinch;
      state.drag = null;
      state.pinch = null;
      state.gestureWasPinch = false;
      dom.image.classList.remove('is-grabbing');

      if (event.pointerType === 'touch' && !wasPinch && movement < 8) {
        handleTouchTap(event.clientX, event.clientY);
      }
      return;
    }

    if (state.pointers.size === 1) {
      state.pinch = null;
      startDragFromPointer(firstPointer());
    }
  }

  function startDragFromPointer(pointer) {
    if (!pointer) return;
    state.drag = {
      startX: state.transform.x,
      startY: state.transform.y,
      pointerStartX: pointer.x,
      pointerStartY: pointer.y
    };
  }

  function startPinch() {
    var center = pointerCenter();
    state.pinch = {
      startDistance: pointerDistance(),
      startScale: state.transform.scale,
      lastCenter: center
    };
    state.gestureWasPinch = true;
  }

  function firstPointer() {
    var iterator = state.pointers.values().next();
    return iterator.done ? null : iterator.value;
  }

  function pointerPair() {
    return Array.from(state.pointers.values()).slice(0, 2);
  }

  function pointerDistance() {
    var pair = pointerPair();
    if (pair.length < 2) return 0;
    return Math.hypot(pair[0].x - pair[1].x, pair[0].y - pair[1].y);
  }

  function pointerCenter() {
    var pair = pointerPair();
    if (pair.length < 2) return { x: 0, y: 0 };
    return {
      x: (pair[0].x + pair[1].x) / 2,
      y: (pair[0].y + pair[1].y) / 2
    };
  }

  function handleTouchTap(x, y) {
    var now = Date.now();
    if (now - state.lastTap.time < DOUBLE_TAP_DELAY) {
      toggleZoom(x, y);
      state.lastTap.time = 0;
      return;
    }
    state.lastTap = { time: now, x: x, y: y };
  }

  function findTrigger(target) {
    if (!target || !target.closest) return null;

    var galleryItem = target.closest('#main[data-page-type="gallery"] [data-lightbox-item]');
    if (galleryItem) return galleryItem;

    var articleImage = target.closest('#main[data-page-type="post"] article .mdui-card-content img');
    if (isEligibleArticleImage(articleImage)) return articleImage;

    return null;
  }

  function collectItemsForTrigger(trigger) {
    var main = document.getElementById('main');
    if (!main) return null;

    if (main.dataset.pageType === 'gallery') {
      return collectGalleryItems(main, trigger);
    }

    if (main.dataset.pageType === 'post') {
      return collectArticleItems(trigger);
    }

    return null;
  }

  function collectGalleryItems(main, trigger) {
    var nodes = Array.prototype.slice.call(main.querySelectorAll('[data-lightbox-item]'));
    var result = [];
    var index = -1;

    nodes.forEach(function (node) {
      var item = createItemFromNode(node, true);
      if (!item) return;
      if (node === trigger) index = result.length;
      result.push(item);
    });

    return { items: result, index: index };
  }

  function collectArticleItems(trigger) {
    var content = trigger.closest('.mdui-card-content');
    if (!content) return null;

    var nodes = Array.prototype.slice.call(content.querySelectorAll('img'));
    var result = [];
    var index = -1;

    nodes.forEach(function (node) {
      if (!isEligibleArticleImage(node)) return;
      var item = createItemFromNode(node, false);
      if (!item) return;
      if (node === trigger) index = result.length;
      result.push(item);
    });

    return { items: result, index: index };
  }

  function createItemFromNode(node, isGallery) {
    var img = node.tagName === 'IMG' ? node : node.querySelector('img');
    var src = resolveSource(node, isGallery);
    if (!src) return null;

    return {
      src: src,
      title: (img && (img.getAttribute('alt') || img.getAttribute('title'))) || node.getAttribute('title') || '',
      element: node
    };
  }

  function resolveSource(node, isGallery) {
    var img = node.tagName === 'IMG' ? node : node.querySelector('img');
    var anchor = node.tagName === 'A' ? node : (img && img.closest('a'));
    var candidates = [];

    candidates.push(node.getAttribute && node.getAttribute('data-lightbox-src'));
    if (anchor && anchor.getAttribute('data-lightbox-src')) candidates.push(anchor.getAttribute('data-lightbox-src'));
    if (anchor && anchor.href && (isGallery || looksLikeImageUrl(anchor.href))) candidates.push(anchor.href);
    if (img) {
      candidates.push(img.getAttribute('data-lightbox-src'));
      candidates.push(img.getAttribute('data-original'));
      candidates.push(img.currentSrc);
      candidates.push(img.getAttribute('src'));
      candidates.push(img.src);
    }

    for (var i = 0; i < candidates.length; i++) {
      var url = normalizeUrl(candidates[i]);
      if (url && !isPlaceholderUrl(url)) return url;
    }

    return '';
  }

  function normalizeUrl(value) {
    value = String(value || '').trim();
    if (!value || value === '#') return '';
    if (/^(javascript|mailto):/i.test(value)) return '';

    try {
      return new URL(value, document.baseURI).href;
    } catch (e) {
      return value;
    }
  }

  function isPlaceholderUrl(value) {
    var path = '';
    try {
      path = new URL(value, document.baseURI).pathname.toLowerCase();
    } catch (e) {
      path = String(value || '').split(/[?#]/)[0].toLowerCase();
    }

    return PLACEHOLDERS.some(function (placeholder) {
      return path === placeholder || path.endsWith(placeholder);
    });
  }

  function looksLikeImageUrl(value) {
    if (/^data:image\//i.test(value)) return true;
    try {
      value = new URL(value, document.baseURI).pathname;
    } catch (e) {}
    return /\.(avif|bmp|gif|jpe?g|jfif|png|svg|webp)$/i.test(String(value || '').split(/[?#]/)[0]);
  }

  function isEligibleArticleImage(img) {
    if (!img || img.tagName !== 'IMG') return false;
    if (img.closest('.notbyai-wrapper')) return false;
    if (img.hasAttribute('no-lazy')) return false;
    if (img.classList.contains('mdui-icon')) return false;
    if (img.closest('.site-lightbox')) return false;
    return !!resolveSource(img, false);
  }

  function open(items, index) {
    if (!state.initialized) init();
    if (!Array.isArray(items) || !items.length) return;

    var normalized = items.map(function (item) {
      var src = normalizeUrl(item && item.src);
      if (!src || isPlaceholderUrl(src)) return null;
      return {
        src: src,
        title: String(item.title || ''),
        element: item.element || null
      };
    }).filter(Boolean);

    if (!normalized.length) return;

    state.items = normalized;
    state.index = clamp(Number(index) || 0, 0, normalized.length - 1);
    state.isOpen = true;
    state.lastFocus = document.activeElement;
    state.previousBodyOverflow = document.body.style.overflow;

    clearTimeout(state.closeTimer);
    dom.overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () {
      dom.overlay.classList.add('is-active');
    });
    showControls();

    resetTransform();
    loadCurrentImage();
    updateMeta();
    updateButtons();

    setTimeout(function () {
      if (dom.overlay) dom.overlay.focus();
    }, 0);
  }

  function close() {
    if (!state.isOpen && (!dom.overlay || dom.overlay.hidden)) return;

    state.isOpen = false;
    state.loadToken += 1;
    state.pointers.clear();
    state.drag = null;
    state.pinch = null;
    state.gestureWasPinch = false;
    document.body.style.overflow = state.previousBodyOverflow || '';

    if (dom.overlay) {
      dom.overlay.classList.remove('is-active');
      dom.overlay.classList.remove('controls-hidden');
      clearTimeout(state.closeTimer);
      clearTimeout(state.controlsTimer);
      state.closeTimer = setTimeout(function () {
        if (!state.isOpen && dom.overlay) dom.overlay.hidden = true;
      }, 180);
    }

    if (dom.image) {
      dom.image.removeAttribute('src');
      dom.image.classList.remove('is-loaded', 'is-grabbing');
    }

    state.hasImage = false;
    state.currentUrl = '';
    hideLoader();
    hideError();
    hideToast();

    if (state.lastFocus && typeof state.lastFocus.focus === 'function') {
      try {
        state.lastFocus.focus();
      } catch (e) {}
    }
  }

  function handleControlsActivity(event) {
    if (!state.isOpen) return;
    if (event && event.type === 'pointerdown' && event.target === dom.viewport && controlsAreHidden()) {
      return;
    }
    showControls();
  }

  function showControls() {
    if (!dom.overlay) return;
    dom.overlay.classList.remove('controls-hidden');
    scheduleControlsHide();
  }

  function scheduleControlsHide(delay) {
    clearTimeout(state.controlsTimer);
    if (!state.isOpen) return;

    state.controlsTimer = setTimeout(hideControls, delay || CONTROLS_HIDE_DELAY);
  }

  function hideControls() {
    if (!state.isOpen || !dom.overlay) return;

    if (state.pointers.size > 0 || controlsContainFocus() || state.ocrState === 'processing') {
      scheduleControlsHide();
      return;
    }

    dom.overlay.classList.add('controls-hidden');
  }

  function controlsAreHidden() {
    return !!(dom.overlay && dom.overlay.classList.contains('controls-hidden'));
  }

  function controlsContainFocus() {
    var active = document.activeElement;
    return !!(active && active.closest && active.closest('.site-lightbox__topbar, .site-lightbox__toolbar, .site-lightbox__nav'));
  }

  function showPrev() {
    if (state.index <= 0) return;
    state.index -= 1;
    resetTransform();
    loadCurrentImage();
    updateMeta();
    updateButtons();
  }

  function showNext() {
    if (state.index >= state.items.length - 1) return;
    state.index += 1;
    resetTransform();
    loadCurrentImage();
    updateMeta();
    updateButtons();
  }

  function loadCurrentImage() {
    var item = state.items[state.index];
    if (!item) return;

    var token = ++state.loadToken;
    state.hasImage = false;
    state.currentUrl = '';
    state.naturalWidth = 0;
    state.naturalHeight = 0;
    dom.image.classList.remove('is-loaded');
    dom.image.alt = item.title || '图片';
    dom.image.removeAttribute('src');
    showLoader();
    hideError();

    preloadImage(item.src)
      .then(function (imageInfo) {
        if (!isLoadCurrent(token)) return;
        setDisplayedImage(imageInfo, { keepTransform: false });
        tryUpgradeCompressedImage(item.src, token);
      })
      .catch(function () {
        loadFirstCompressedCandidate(item.src, token);
      });
  }

  function preloadImage(url) {
    return new Promise(function (resolve, reject) {
      var probe = new Image();
      probe.onload = function () {
        resolve({
          url: url,
          width: probe.naturalWidth || probe.width || 1,
          height: probe.naturalHeight || probe.height || 1
        });
      };
      probe.onerror = reject;
      probe.src = url;
    });
  }

  function isLoadCurrent(token) {
    return state.isOpen && token === state.loadToken;
  }

  function setDisplayedImage(imageInfo, options) {
    state.currentUrl = imageInfo.url;
    state.naturalWidth = imageInfo.width;
    state.naturalHeight = imageInfo.height;
    state.hasImage = true;

    dom.image.src = imageInfo.url;
    dom.image.classList.add('is-loaded');
    hideLoader();
    hideError();

    if (!options || !options.keepTransform) resetTransform();
    layoutImage();
    updateButtons();
  }

  async function loadFirstCompressedCandidate(src, token) {
    var candidates = compressedCandidates(src);

    for (var i = 0; i < candidates.length; i++) {
      try {
        var imageInfo = await preloadImage(candidates[i]);
        if (!isLoadCurrent(token)) return;
        setDisplayedImage(imageInfo, { keepTransform: false });
        return;
      } catch (e) {}
    }

    if (!isLoadCurrent(token)) return;
    state.hasImage = false;
    hideLoader();
    showError();
    updateButtons();
  }

  async function tryUpgradeCompressedImage(src, token) {
    var candidates = compressedCandidates(src);
    if (!candidates.length) return;

    for (var i = 0; i < candidates.length; i++) {
      try {
        var imageInfo = await preloadImage(candidates[i]);
        if (!isLoadCurrent(token)) return;
        setDisplayedImage(imageInfo, { keepTransform: true });
        return;
      } catch (e) {}
    }
  }

  function compressedCandidates(src) {
    var extensions = ['.jpg', '.jpeg', '.png', '.jfif', '.webp'];

    try {
      var url = new URL(src, document.baseURI);
      if (!/_compressed\.jpg$/i.test(url.pathname)) return [];
      var basePath = url.pathname.replace(/_compressed\.jpg$/i, '');
      return extensions.map(function (extension) {
        var candidate = new URL(url.href);
        candidate.pathname = basePath + extension;
        return candidate.href;
      }).filter(function (candidate) {
        return candidate !== url.href;
      });
    } catch (e) {
      if (!/_compressed\.jpg(?:[?#].*)?$/i.test(src)) return [];
      return extensions.map(function (extension) {
        return src.replace(/_compressed\.jpg(?=([?#].*)?$)/i, extension);
      }).filter(function (candidate) {
        return candidate !== src;
      });
    }
  }

  function layoutImage() {
    if (!state.hasImage || !state.naturalWidth || !state.naturalHeight) return;

    var rect = dom.viewport.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    var fitScale = Math.min(rect.width / state.naturalWidth, rect.height / state.naturalHeight, 1);
    if (!isFinite(fitScale) || fitScale <= 0) fitScale = 1;

    state.baseWidth = Math.max(1, state.naturalWidth * fitScale);
    state.baseHeight = Math.max(1, state.naturalHeight * fitScale);

    dom.image.style.width = state.baseWidth + 'px';
    dom.image.style.height = state.baseHeight + 'px';
    dom.image.style.left = ((rect.width - state.baseWidth) / 2) + 'px';
    dom.image.style.top = ((rect.height - state.baseHeight) / 2) + 'px';

    applyTransform();
  }

  function resetTransform() {
    state.transform.scale = 1;
    state.transform.x = 0;
    state.transform.y = 0;
    state.transform.rotation = 0;
    applyTransform();
  }

  function rotateImage() {
    if (!state.hasImage) return;
    state.transform.rotation = (state.transform.rotation + 90) % 360;
    applyTransform();
  }

  function zoomBy(factor) {
    if (!state.hasImage) return;
    var rect = dom.viewport.getBoundingClientRect();
    zoomTo(
      state.transform.scale * factor,
      rect.left + rect.width / 2,
      rect.top + rect.height / 2
    );
  }

  function zoomTo(nextScale, focalX, focalY) {
    if (!state.hasImage) return;

    var oldScale = state.transform.scale;
    nextScale = clamp(nextScale, MIN_SCALE, MAX_SCALE);
    if (Math.abs(nextScale - oldScale) < 0.001) return;

    var rect = dom.viewport.getBoundingClientRect();
    var viewportCenterX = rect.left + rect.width / 2;
    var viewportCenterY = rect.top + rect.height / 2;
    var offsetX = focalX - viewportCenterX - state.transform.x;
    var offsetY = focalY - viewportCenterY - state.transform.y;
    var ratio = nextScale / oldScale;

    state.transform.x += offsetX * (1 - ratio);
    state.transform.y += offsetY * (1 - ratio);
    state.transform.scale = nextScale;
    applyTransform();
  }

  function toggleZoom(x, y) {
    var target = state.transform.scale > 1.05 ? 1 : 2;
    zoomTo(target, x, y);
  }

  function applyTransform() {
    if (!dom.image) return;
    clampTransform();
    dom.image.style.transform = [
      'translate3d(' + state.transform.x + 'px, ' + state.transform.y + 'px, 0)',
      'rotate(' + state.transform.rotation + 'deg)',
      'scale(' + state.transform.scale + ')'
    ].join(' ');
    updateButtons();
  }

  function clampTransform() {
    if (!state.hasImage || !dom.viewport) {
      state.transform.x = 0;
      state.transform.y = 0;
      return;
    }

    var rect = dom.viewport.getBoundingClientRect();
    var visual = visualSize();
    var maxX = Math.max(0, (visual.width - rect.width) / 2);
    var maxY = Math.max(0, (visual.height - rect.height) / 2);

    state.transform.x = maxX ? clamp(state.transform.x, -maxX, maxX) : 0;
    state.transform.y = maxY ? clamp(state.transform.y, -maxY, maxY) : 0;
  }

  function visualSize() {
    var normalizedRotation = ((state.transform.rotation % 360) + 360) % 360;
    var swapped = normalizedRotation === 90 || normalizedRotation === 270;
    var width = swapped ? state.baseHeight : state.baseWidth;
    var height = swapped ? state.baseWidth : state.baseHeight;

    return {
      width: width * state.transform.scale,
      height: height * state.transform.scale
    };
  }

  function updateMeta() {
    var item = state.items[state.index] || {};
    dom.counter.textContent = state.items.length > 1 ? (state.index + 1) + ' / ' + state.items.length : '';
    dom.caption.textContent = item.title || '';
  }

  function updateButtons() {
    if (!dom.overlay) return;

    setDisabled('prev', state.index <= 0);
    setDisabled('next', state.index >= state.items.length - 1);
    setDisabled('zoom-out', !state.hasImage || state.transform.scale <= MIN_SCALE + 0.001);
    setDisabled('zoom-in', !state.hasImage || state.transform.scale >= MAX_SCALE - 0.001);
    ['reset', 'rotate', 'copy', 'open', 'download', 'ocr'].forEach(function (action) {
      setDisabled(action, !state.hasImage || (action === 'ocr' && state.ocrState === 'processing'));
    });
  }

  function setDisabled(action, disabled) {
    var button = actionButton(action);
    if (button) button.disabled = !!disabled;
  }

  function actionButton(action) {
    return dom.overlay && dom.overlay.querySelector('[data-site-lightbox-action="' + action + '"]');
  }

  function showLoader() {
    dom.loader.hidden = false;
  }

  function hideLoader() {
    if (dom.loader) dom.loader.hidden = true;
  }

  function showError() {
    dom.error.hidden = false;
  }

  function hideError() {
    if (dom.error) dom.error.hidden = true;
  }

  function showToast(message, type) {
    clearTimeout(state.toastTimer);
    dom.toast.textContent = message;
    dom.toast.classList.remove('is-error', 'is-success');
    if (type) dom.toast.classList.add('is-' + type);
    dom.toast.classList.add('is-visible');
    state.toastTimer = setTimeout(hideToast, 1800);
  }

  function hideToast() {
    clearTimeout(state.toastTimer);
    if (!dom.toast) return;
    dom.toast.classList.remove('is-visible', 'is-error', 'is-success');
    dom.toast.textContent = '';
  }

  function flashAction(action, success) {
    var button = actionButton(action);
    if (!button) return;
    button.classList.add(success ? 'is-success' : 'is-error');
    setTimeout(function () {
      button.classList.remove('is-success', 'is-error');
    }, 1000);
  }

  async function copyCurrentImage() {
    if (!state.currentUrl || !navigator.clipboard || !window.ClipboardItem) {
      flashAction('copy', false);
      showToast('当前浏览器不支持复制图片', 'error');
      return;
    }

    try {
      var image = await loadImageForCanvas(state.currentUrl);
      var canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth || image.width;
      canvas.height = image.naturalHeight || image.height;
      canvas.getContext('2d').drawImage(image, 0, 0);
      var blob = await canvasToBlob(canvas, 'image/png');
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      flashAction('copy', true);
      showToast('图片已复制', 'success');
    } catch (e) {
      flashAction('copy', false);
      showToast('图片复制失败', 'error');
    }
  }

  function loadImageForCanvas(url) {
    return new Promise(function (resolve, reject) {
      var image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = function () { resolve(image); };
      image.onerror = reject;
      image.src = url;
    });
  }

  function canvasToBlob(canvas, type) {
    return new Promise(function (resolve, reject) {
      try {
        canvas.toBlob(function (blob) {
          if (blob) resolve(blob);
          else reject(new Error('Canvas export failed'));
        }, type);
      } catch (e) {
        reject(e);
      }
    });
  }

  function openCurrentImage() {
    if (!state.currentUrl) return;
    window.open(state.currentUrl, '_blank', 'noopener');
  }

  async function downloadCurrentImage() {
    if (!state.currentUrl) return;

    try {
      var response = await fetch(state.currentUrl);
      if (!response.ok) throw new Error('Download failed');
      var blob = await response.blob();
      var blobUrl = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = blobUrl;
      link.download = filenameFromUrl(state.currentUrl);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
      flashAction('download', true);
      showToast('已开始下载', 'success');
    } catch (e) {
      flashAction('download', false);
      showToast('下载失败', 'error');
    }
  }

  function filenameFromUrl(url) {
    try {
      var pathname = new URL(url).pathname;
      return decodeURIComponent(pathname.split('/').pop() || 'image');
    } catch (e) {
      return 'image';
    }
  }

  async function runOcr() {
    if (!state.currentUrl || state.ocrState === 'processing') return;

    state.ocrState = 'processing';
    setOcrBusy(true);
    updateButtons();

    try {
      await ensureTesseract();
      if (!window.Tesseract || typeof window.Tesseract.createWorker !== 'function') {
        throw new Error('Tesseract is unavailable');
      }

      var worker = await window.Tesseract.createWorker('chi_sim+eng', 1, {
        logger: function () {},
        errorHandler: function () {}
      });

      try {
        var result = await worker.recognize(state.currentUrl);
        var text = result && result.data && result.data.text ? result.data.text.trim() : '';
        if (!text) throw new Error('No text recognized');
        flashAction('ocr', true);
        showOcrDialog(text);
      } finally {
        if (worker && typeof worker.terminate === 'function') {
          await worker.terminate();
        }
      }
    } catch (e) {
      flashAction('ocr', false);
      showToast('OCR 识别失败', 'error');
    } finally {
      state.ocrState = 'idle';
      setOcrBusy(false);
      updateButtons();
    }
  }

  function ensureTesseract() {
    if (window.Tesseract) return Promise.resolve();
    if (state.ocrScriptPromise) return state.ocrScriptPromise;

    state.ocrScriptPromise = new Promise(function (resolve, reject) {
      var existing = document.getElementById('site-lightbox-tesseract-js');
      if (existing) {
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', reject, { once: true });
        return;
      }

      var script = document.createElement('script');
      script.id = 'site-lightbox-tesseract-js';
      script.src = TESSERACT_SRC;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    }).catch(function (error) {
      state.ocrScriptPromise = null;
      throw error;
    });

    return state.ocrScriptPromise;
  }

  function setOcrBusy(isBusy) {
    var button = actionButton('ocr');
    if (!button) return;
    var iconEl = button.querySelector('.material-icons');
    button.disabled = !!isBusy;
    button.setAttribute('aria-busy', isBusy ? 'true' : 'false');
    button.title = isBusy ? '正在识别...' : 'OCR 文字识别';
    button.setAttribute('aria-label', button.title);
    if (iconEl) iconEl.textContent = isBusy ? 'hourglass_empty' : 'text_fields';
  }

  function showOcrDialog(text) {
    dom.ocrText.value = text;

    if (window.mdui && typeof window.mdui.Dialog === 'function') {
      state.ocrDialogInstance = state.ocrDialogInstance || new window.mdui.Dialog(dom.ocrDialog, { history: false });
      state.ocrDialogInstance.open();
      return;
    }

    dom.ocrDialog.classList.add('site-lightbox-ocr-dialog--fallback');
    dom.ocrDialog.style.display = 'block';
  }

  function copyOcrResult(event) {
    if (event) event.preventDefault();
    var text = dom.ocrText.value || '';
    if (!text) return;

    var copied = navigator.clipboard && navigator.clipboard.writeText
      ? navigator.clipboard.writeText(text)
      : Promise.reject(new Error('Clipboard unavailable'));

    copied.then(function () {
      showToast('识别结果已复制', 'success');
      if (window.mdui && window.mdui.snackbar) window.mdui.snackbar({ message: '已复制到剪贴板' });
    }).catch(function () {
      dom.ocrText.focus();
      dom.ocrText.select();
      try {
        document.execCommand('copy');
        showToast('识别结果已复制', 'success');
      } catch (e) {
        showToast('复制失败', 'error');
      }
    });
  }

  function trapFocus(event) {
    var focusable = Array.prototype.slice.call(dom.overlay.querySelectorAll('button:not([disabled]), [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'))
      .filter(function (el) {
        return !el.hidden && el.offsetParent !== null;
      });

    if (!focusable.length) {
      event.preventDefault();
      return;
    }

    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (!dom.overlay.contains(document.activeElement)) {
      event.preventDefault();
      first.focus();
      return;
    }

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function isEditableTarget(target) {
    if (!target) return false;
    var tagName = target.tagName;
    return target.isContentEditable || tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT';
  }

  function isOcrDialogTarget(target) {
    return !!(target && target.closest && target.closest('.site-lightbox-ocr-dialog'));
  }

  window.SiteLightbox = {
    init: init,
    refresh: refresh,
    open: open,
    close: close,
    destroy: destroy
  };

  ready(init);
})();
