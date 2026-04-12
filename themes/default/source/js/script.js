var $$ = mdui.$;

(function () {
  var idleCallback = window.requestIdleCallback || function (cb) {
    return setTimeout(function () {
      cb({
        didTimeout: false,
        timeRemaining: function () {
          return 0;
        }
      });
    }, 600);
  };
  var cancelIdleCallbackCompat = window.cancelIdleCallback || function (id) {
    clearTimeout(id);
  };

  var lifecycleState = {
    token: 0,
    timeouts: [],
    idleTimeout: null,
    idleHandle: null
  };

  var searchState = {
    bound: false,
    input: null,
    results: null,
    resource: '',
    entries: null,
    promise: null,
    debounceTimer: null
  };

  var analyticsState = {
    loadPromise: null,
    lastTrackedUrl: ''
  };

  var assetState = {
    scripts: {},
    styles: {},
    commentPromise: null,
    galleryPromise: null,
    busuanziLoadCount: 0
  };

  var gotopState = {
    bound: false,
    pending: false,
    circle: null,
    circumference: 0
  };

  function normalizeUrl(url) {
    if (!url) return '';
    if (url.indexOf('//') === 0) return window.location.protocol + url;
    return url;
  }

  function createDomSafeId(prefix, key) {
    return prefix + '-' + String(key || '').replace(/[^a-z0-9_-]+/ig, '-');
  }

  function getSiteAssets() {
    return window.__SITE_ASSET_CONFIG__ || {};
  }

  function getPageContext() {
    var main = document.getElementById('main');
    var dataset = main ? main.dataset : {};
    var pageType = dataset.pageType || 'generic';

    return {
      pageType: pageType,
      isHome: dataset.isHome === '1' || pageType === 'home',
      isPost: dataset.isPost === '1' || pageType === 'post',
      hasComments: dataset.hasComments === '1',
      hasToc: dataset.hasToc === '1',
      searchResource: dataset.searchResource || '',
      needsGallery: pageType === 'gallery' || !!document.querySelector('[data-fancybox]'),
      hasArticleImages: !!document.querySelector('#main article .mdui-card-content img')
    };
  }

  function clearLifecycleTimers() {
    while (lifecycleState.timeouts.length) {
      clearTimeout(lifecycleState.timeouts.pop());
    }
    if (lifecycleState.idleTimeout) {
      clearTimeout(lifecycleState.idleTimeout);
      lifecycleState.idleTimeout = null;
    }
    if (lifecycleState.idleHandle) {
      cancelIdleCallbackCompat(lifecycleState.idleHandle);
      lifecycleState.idleHandle = null;
    }
  }

  function scheduleTimeout(fn, delay) {
    var token = lifecycleState.token;
    var timer = setTimeout(function () {
      if (token !== lifecycleState.token) return;
      fn();
    }, delay);
    lifecycleState.timeouts.push(timer);
  }

  function dispatchPagePhase(stage, context, reason) {
    document.dispatchEvent(new CustomEvent('page:phase', {
      detail: {
        stage: stage,
        context: context,
        reason: reason,
        token: lifecycleState.token
      }
    }));
  }

  function runPageLifecycle(reason) {
    clearLifecycleTimers();
    lifecycleState.token += 1;

    var context = getPageContext();
    window.__pageContext__ = context;

    runCoreEnhancements(context, reason || 'initial');
    dispatchPagePhase('core-init', context, reason || 'initial');

    scheduleTimeout(function () {
      dispatchPagePhase('after-visible', context, reason || 'initial');
    }, 160);

    var idleDelay = context.isPost ? 4500 : (context.isHome ? 1200 : 2000);
    lifecycleState.idleTimeout = setTimeout(function () {
      var token = lifecycleState.token;
      lifecycleState.idleHandle = idleCallback(function () {
        if (token !== lifecycleState.token) return;
        dispatchPagePhase('idle-preload', context, reason || 'initial');
      });
    }, idleDelay);
  }

  function ensureStylesheet(url, key) {
    url = normalizeUrl(url);
    if (!url) return Promise.resolve(null);

    var domId = createDomSafeId('runtime-style', key || url);
    if (assetState.styles[domId]) return assetState.styles[domId];

    assetState.styles[domId] = new Promise(function (resolve, reject) {
      var existing = document.getElementById(domId);
      if (existing) {
        if (existing.dataset.loaded === '1') {
          resolve(existing);
          return;
        }
        existing.addEventListener('load', function () { resolve(existing); }, { once: true });
        existing.addEventListener('error', reject, { once: true });
        return;
      }

      var link = document.createElement('link');
      link.id = domId;
      link.rel = 'stylesheet';
      link.href = url;
      link.dataset.loaded = '0';
      link.onload = function () {
        link.dataset.loaded = '1';
        resolve(link);
      };
      link.onerror = reject;
      document.head.appendChild(link);
    });

    return assetState.styles[domId];
  }

  function ensureScript(url, key, attrs) {
    url = normalizeUrl(url);
    if (!url) return Promise.resolve(null);

    var domId = createDomSafeId('runtime-script', key || url);
    if (assetState.scripts[domId]) return assetState.scripts[domId];

    assetState.scripts[domId] = new Promise(function (resolve, reject) {
      var existing = document.getElementById(domId);
      if (existing) {
        if (existing.dataset.loaded === '1') {
          resolve(existing);
          return;
        }
        existing.addEventListener('load', function () { resolve(existing); }, { once: true });
        existing.addEventListener('error', reject, { once: true });
        return;
      }

      var script = document.createElement('script');
      script.id = domId;
      script.src = url;
      script.dataset.loaded = '0';
      script.async = !!(attrs && attrs.async);
      script.defer = attrs && Object.prototype.hasOwnProperty.call(attrs, 'defer') ? !!attrs.defer : true;
      script.onload = function () {
        script.dataset.loaded = '1';
        resolve(script);
      };
      script.onerror = reject;
      document.body.appendChild(script);
    });

    return assetState.scripts[domId];
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeRegex(value) {
    return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function clearSearchResults() {
    if (!searchState.results) return;
    searchState.results.innerHTML = '';
    searchState.results.removeAttribute('data-search-state');
  }

  function setSearchStatus(message, state) {
    if (!searchState.results) return;
    searchState.results.setAttribute('data-search-state', state || 'loading');
    searchState.results.innerHTML = '<div class="mdui-p-a-2 mdui-text-center mdui-text-color-theme-text-secondary">' + escapeHtml(message) + '</div>';
  }

  function parseSearchEntries(xmlText) {
    var doc = new DOMParser().parseFromString(xmlText, 'application/xml');
    if (doc.querySelector('parsererror')) {
      throw new Error('Invalid search index response');
    }

    return Array.prototype.map.call(doc.getElementsByTagName('entry'), function (entry) {
      return {
        title: (entry.getElementsByTagName('title')[0] || {}).textContent || 'Untitled',
        content: (entry.getElementsByTagName('content')[0] || {}).textContent || '',
        url: (entry.getElementsByTagName('url')[0] || {}).textContent || ''
      };
    });
  }

  function ensureSearchIndex(options) {
    var resource = searchState.resource;
    if (!resource) return Promise.resolve([]);
    if (searchState.entries) return Promise.resolve(searchState.entries);
    if (searchState.promise) return searchState.promise;

    searchState.promise = fetch(resource, { credentials: 'same-origin' })
      .then(function (response) {
        if (!response.ok) throw new Error('Search index request failed: ' + response.status);
        return response.text();
      })
      .then(function (xmlText) {
        searchState.entries = parseSearchEntries(xmlText);
        return searchState.entries;
      })
      .catch(function (error) {
        searchState.promise = null;
        if (!(options && options.silent)) {
          setSearchStatus('搜索索引加载失败，请稍后重试。', 'error');
        }
        throw error;
      });

    return searchState.promise;
  }

  function renderSearchResults(rawQuery) {
    var query = String(rawQuery || '').trim().toLowerCase();
    if (!query) {
      clearSearchResults();
      return;
    }

    if (!searchState.entries) {
      setSearchStatus('正在建立搜索索引…', 'loading');
      return;
    }

    var keywords = query.split(/[\s\-]+/).filter(Boolean);
    if (!keywords.length) {
      clearSearchResults();
      return;
    }

    var html = '';
    var matches = 0;

    searchState.entries.forEach(function (entry) {
      var title = (entry.title || 'Untitled').trim();
      var titleLower = title.toLowerCase();
      var content = (entry.content || '').replace(/<[^>]+>/g, '').trim();
      var contentLower = content.toLowerCase();
      var firstIndex = -1;
      var matched = true;

      keywords.forEach(function (keyword, idx) {
        var titleIndex = titleLower.indexOf(keyword);
        var contentIndex = contentLower.indexOf(keyword);
        if (titleIndex < 0 && contentIndex < 0) {
          matched = false;
          return;
        }
        if (idx === 0) {
          firstIndex = contentIndex >= 0 ? contentIndex : titleIndex;
        }
      });

      if (!matched) return;

      matches += 1;
      var snippet = '';
      if (content) {
        var start = Math.max((firstIndex >= 0 ? firstIndex : 0) - 20, 0);
        var end = Math.min(start + 120, content.length);
        snippet = escapeHtml(content.slice(start, end));
        keywords.forEach(function (keyword) {
          var matcher = new RegExp('(' + escapeRegex(escapeHtml(keyword)) + ')', 'gi');
          snippet = snippet.replace(matcher, '<em class="search-result-keyword">$1</em>');
        });
      }

      html += '<li><a href="' + escapeHtml(entry.url) + '" class="search-result-title" target="_blank">' + escapeHtml(title) + '</a>';
      if (snippet) {
        html += '<p class="search-result-content">' + snippet + '...</p>';
      }
      html += '</li>';
    });

    if (!matches) {
      setSearchStatus('没有找到匹配结果。', 'empty');
      return;
    }

    searchState.results.removeAttribute('data-search-state');
    searchState.results.innerHTML = '<ul class="search-result-list">' + html + '</ul>';
  }

  function bindSearchUI() {
    if (searchState.bound) return;

    searchState.input = document.querySelector('#search .search-form-input');
    searchState.results = document.querySelector('#search .search-result');
    if (!searchState.input || !searchState.results) return;

    searchState.bound = true;

    $$('#search').on('opened.mdui.dialog', function () {
      searchState.input.focus();
      if (searchState.input.value.trim()) {
        renderSearchResults(searchState.input.value);
      }
    });

    $$(document).on('click', function (e) {
      if ($$(e.target).closest('#search').length <= 0) {
        searchState.input.value = '';
        clearSearchResults();
      }
    });

    searchState.input.addEventListener('input', function () {
      var currentValue = searchState.input.value;
      if (!currentValue.trim()) {
        clearSearchResults();
        return;
      }

      clearTimeout(searchState.debounceTimer);
      searchState.debounceTimer = setTimeout(function () {
        if (!searchState.entries) {
          setSearchStatus('正在建立搜索索引…', 'loading');
          ensureSearchIndex({ silent: false })
            .then(function () {
              renderSearchResults(searchState.input.value);
            })
            .catch(function () {});
          return;
        }
        renderSearchResults(searchState.input.value);
      }, 120);
    });
  }

  function bindGotop() {
    if (gotopState.bound) return;

    gotopState.bound = true;
    gotopState.circle = document.querySelector('.progress-ring__circle');
    if (gotopState.circle) {
      var radius = gotopState.circle.r.baseVal.value || 26;
      gotopState.circumference = radius * 2 * Math.PI;
      gotopState.circle.style.strokeDasharray = gotopState.circumference + ' ' + gotopState.circumference;
      gotopState.circle.style.strokeDashoffset = gotopState.circumference;
    }

    var gotopButton = document.getElementById('gotop');
    if (gotopButton) {
      gotopButton.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    window.addEventListener('scroll', scheduleGotopUpdate, { passive: true });
  }

  function scheduleGotopUpdate() {
    if (gotopState.pending) return;
    gotopState.pending = true;
    requestAnimationFrame(function () {
      gotopState.pending = false;
      updateGotop();
    });
  }

  function updateGotop() {
    var container = document.getElementById('gotop-container');
    var ring = document.querySelector('.progress-ring');
    if (!container) return;

    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop > 20) {
      container.classList.remove('mdui-fab-hide');
    } else {
      container.classList.add('mdui-fab-hide');
    }

    var context = getPageContext();
    if (!context.isPost) {
      if (ring) ring.style.display = 'none';
      return;
    }

    if (ring) ring.style.display = '';
    if (!gotopState.circle) return;

    var article = document.querySelector('#main article .mdui-card-content');
    if (!article) return;

    var rect = article.getBoundingClientRect();
    var articleBottom = rect.bottom + scrollTop;
    var maxScroll = articleBottom - window.innerHeight;
    var percent = maxScroll <= 0 ? 100 : Math.min(Math.max((scrollTop / maxScroll) * 100, 0), 100);
    gotopState.circle.style.strokeDashoffset = gotopState.circumference - (percent / 100) * gotopState.circumference;
  }

  function bindThemeToggle() {
    var toggle = document.getElementById('theme-toggle');
    if (!toggle || toggle.dataset.boundThemeToggle === '1') return;

    toggle.dataset.boundThemeToggle = '1';
    toggle.addEventListener('click', function () {
      if ($$('body').hasClass('mdui-theme-layout-dark')) {
        $$('body').removeClass('mdui-theme-layout-dark');
        localStorage.removeItem('mdui-theme-layout-dark');
        localStorage.setItem('mdui-theme-layout-light', 'true');
      } else {
        $$('body').addClass('mdui-theme-layout-dark');
        localStorage.setItem('mdui-theme-layout-dark', 'true');
        localStorage.removeItem('mdui-theme-layout-light');
      }
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (localStorage.getItem('mdui-theme-layout-dark') || localStorage.getItem('mdui-theme-layout-light')) return;
      if (e.matches) {
        $$('body').addClass('mdui-theme-layout-dark');
      } else {
        $$('body').removeClass('mdui-theme-layout-dark');
      }
    });
  }

  function bindDrawerState() {
    var sidebar = document.getElementById('sidebar');
    if (!sidebar || sidebar.dataset.drawerStateBound === '1') return;

    sidebar.dataset.drawerStateBound = '1';
    $$('#sidebar').on('open.mdui.drawer', function () {
      localStorage.removeItem('mdui-drawer-close');
    });
    $$('#sidebar').on('close.mdui.drawer', function () {
      localStorage.setItem('mdui-drawer-close', true);
    });
  }

  function bindSidebarState() {
    if (document.body.dataset.sidebarStateBound === '1') return;
    document.body.dataset.sidebarStateBound = '1';

    Array.prototype.forEach.call(document.querySelectorAll('.mdui-collapse-item'), function (item, index) {
      $$(item).on('close.mdui.collapse', function () {
        localStorage.removeItem('mdui-collapse-item-' + index);
      });
      $$(item).on('open.mdui.collapse', function () {
        localStorage.setItem('mdui-collapse-item-' + index, true);
      });
    });
  }

  function bindFixedChrome() {
    bindGotop();
    bindThemeToggle();
    bindDrawerState();
    bindSidebarState();
    bindSearchUI();
  }

  function formatExternalLinks() {
    document.querySelectorAll('.mdui-card-content a').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href || !href.startsWith('http')) return;
      if (href.includes('blog.stevezmt.top') || href.includes('stevezmt.top') || href.includes('localhost')) return;
      if (href.includes('/redirect?goto=')) return;
      link.href = '/redirect?goto=' + encodeURIComponent(href);
      link.target = '_blank';
    });
  }

  function initDonateTabs() {
    var donate = document.getElementById('donate');
    if (!donate || donate.dataset.donateReady === '1') return;
    donate.dataset.donateReady = '1';

    var tab = new mdui.Tab('#donate .mdui-tab');
    $$('#donate').on('opened.mdui.dialog', function () {
      tab.handleUpdate();
    });
  }

  function setCommentPlaceholder(message, state) {
    var placeholder = document.getElementById('comment-placeholder');
    if (!placeholder) return;
    placeholder.dataset.state = state || 'idle';
    placeholder.innerHTML = message;
  }

  function resetCommentPlaceholder(context) {
    if (!context.hasComments) return;
    setCommentPlaceholder('评论区准备中…', 'idle');
  }

  function refreshBusuanzi() {
    var src = normalizeUrl(getSiteAssets().busuanziSrc);
    if (!src) return;
    if (!document.getElementById('busuanzi_container_site_pv') && !document.getElementById('busuanzi_container_page_pv')) return;

    assetState.busuanziLoadCount += 1;

    var existing = document.getElementById('runtime-busuanzi');
    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }

    var script = document.createElement('script');
    script.id = 'runtime-busuanzi';
    script.defer = true;
    script.src = src + (src.indexOf('?') === -1 ? '?' : '&') + '_=' + Date.now();
    document.body.appendChild(script);
  }

  function ensureAnalyticsLoaded() {
    var analyticsId = getSiteAssets().analyticsId;
    if (!analyticsId) return Promise.resolve(false);
    if (analyticsState.loadPromise) return analyticsState.loadPromise;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', analyticsId, { send_page_view: false });

    analyticsState.loadPromise = ensureScript(
      'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(analyticsId),
      'gtag',
      { async: true, defer: false }
    )
      .then(function () {
        return true;
      })
      .catch(function () {
        analyticsState.loadPromise = null;
        return false;
      });

    return analyticsState.loadPromise;
  }

  function trackAnalyticsPageView() {
    var analyticsId = getSiteAssets().analyticsId;
    if (!analyticsId) return;

    var currentUrl = window.location.href;
    if (analyticsState.lastTrackedUrl === currentUrl) return;

    ensureAnalyticsLoaded().then(function (ready) {
      if (!ready || typeof window.gtag !== 'function') return;
      analyticsState.lastTrackedUrl = currentUrl;
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: currentUrl,
        page_path: window.location.pathname + window.location.search
      });
    });
  }

  function __normalizeGitalkId(raw) {
    try {
      if (!raw) raw = location.pathname;
      if (/^https?:\/\//i.test(raw)) {
        var parsed = new URL(raw, window.location.origin);
        raw = parsed.pathname || '/';
      }
      try { raw = decodeURI(raw); } catch (e) {}

      raw = String(raw).trim();
      var uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRe.test(raw)) return raw;

      var looksLikePath = /\//.test(raw) || /\.html?$/i.test(raw);
      if (looksLikePath) {
        raw = raw.replace(/index\.html$/i, '');
        raw = '/' + raw.replace(/^\/+/, '').replace(/\/+$/, '');
        return raw || '/';
      }
      return String(raw);
    } catch (e) {
      return (window.location && window.location.pathname) || '/';
    }
  }
  window.__normalizeGitalkId = __normalizeGitalkId;

  function ensureGitalkAssets() {
    var assets = getSiteAssets();
    if (!assets.gitalkSrc) return Promise.resolve(false);
    if (assetState.commentPromise) return assetState.commentPromise;

    assetState.commentPromise = Promise.all([
      ensureStylesheet(assets.gitalkCss, 'gitalk-css'),
      ensureScript(assets.gitalkBridgeSrc, 'gitalk-bridge', { defer: true }),
      ensureScript(assets.gitalkSrc, 'gitalk-main', { defer: true })
    ])
      .then(function () {
        return true;
      })
      .catch(function () {
        assetState.commentPromise = null;
        return false;
      });

    return assetState.commentPromise;
  }

  function initGitalk() {
    if (!window.Gitalk) return;

    var el = document.getElementById('gitalk-container');
    if (!el) return;

    var config = Object.assign({}, window.GITALK_CONFIG || {});
    if (!config.repo || !config.owner) {
      el.innerHTML = '<div style="color:red">Gitalk 配置错误: repo/owner 未设置</div>';
      setCommentPlaceholder('评论区配置错误。', 'error');
      return;
    }

    config.id = __normalizeGitalkId(config.id || ((window.location && window.location.pathname) || '/'));

    if (el.dataset.renderedId === config.id && el.dataset.renderedState === 'ready') return;

    el.dataset.renderedId = config.id;
    el.dataset.renderedState = 'loading';
    el.innerHTML = '';

    try {
      var gitalk = new Gitalk(config);
      gitalk.render('gitalk-container');
      el.dataset.renderedState = 'ready';
    } catch (error) {
      el.dataset.renderedState = 'error';
      setCommentPlaceholder('评论区加载失败，请稍后重试。', 'error');
    }
  }
  window.initGitalk = initGitalk;

  function loadCommentsNow() {
    var context = getPageContext();
    if (!context.hasComments) return Promise.resolve(false);
    if (!document.getElementById('gitalk-container')) return Promise.resolve(false);

    setCommentPlaceholder('评论区加载中…', 'loading');
    return ensureGitalkAssets().then(function (ready) {
      if (!ready) {
        setCommentPlaceholder('评论区资源加载失败，请稍后重试。', 'error');
        return false;
      }
      initGitalk();
      return true;
    });
  }
  window.loadCommentsNow = loadCommentsNow;
  window.retryDeferredComments = loadCommentsNow;

  function ensureGalleryRuntime() {
    var context = getPageContext();
    if (!context.needsGallery) return Promise.resolve(false);
    if (assetState.galleryPromise) return assetState.galleryPromise;

    var assets = getSiteAssets();
    assetState.galleryPromise = ensureScript(assets.legacyJquerySrc, 'legacy-jquery', { defer: true })
      .then(function () {
        return Promise.all([
          ensureStylesheet(assets.fancyboxCss, 'fancybox-css'),
          ensureScript(assets.fancyboxJs, 'fancybox-js', { defer: true })
        ]);
      })
      .then(function () {
        if (window.jQuery && window.jQuery.fn && window.jQuery.fn.fancybox) {
          window.jQuery('[data-fancybox]').fancybox({
            buttons: ['close']
          });
        }
        return true;
      })
      .catch(function () {
        assetState.galleryPromise = null;
        return false;
      });

    return assetState.galleryPromise;
  }

  function fixMduiDialogs() {
    document.querySelectorAll('[mdui-dialog]').forEach(function (el) {
      try {
        if (el.dataset.dialogBound === '1') return;

        var dialogTarget = el.getAttribute('mdui-dialog') || '';
        var dialogId = '';

        try {
          var match = /target\s*:\s*['"]#?([^'"]+)['"]/i.exec(dialogTarget);
          if (match && match[1]) dialogId = match[1];
          else if (dialogTarget && dialogTarget.startsWith('#')) dialogId = dialogTarget.substring(1);
        } catch (e) {}

        if (!dialogId) return;

        var handler = function (event) {
          try {
            event.preventDefault();
            event.stopPropagation();
          } catch (_) {}

          var dialog = document.getElementById(dialogId);
          if (dialog && dialog.parentNode !== document.body) {
            try { document.body.appendChild(dialog); } catch (_) {}
          }
          if (dialog && window.mdui && mdui.Dialog) {
            try {
              var inst = new mdui.Dialog(dialog, { history: false });
              inst.open();
            } catch (_) {}
          }
          return false;
        };

        el.__mduiDialogHandler = handler;
        el.addEventListener('click', handler, false);
        el.dataset.dialogBound = '1';
      } catch (e) {}
    });
  }

  function fixFixedElements() {
    try {
      ['toc'].forEach(function (id) {
        var moved = document.querySelector('[data-fixed-wrapper-id="' + id + '"]');
        var current = document.querySelector('#main #' + id);

        if (moved && !current) {
          moved.setAttribute('data-fixed-hidden', 'true');
          moved.style.display = 'none';
        }

        if (moved && current) {
          var currentWrapper = current.closest('div');
          if (currentWrapper && moved !== currentWrapper) {
            moved.setAttribute('data-fixed-hidden', 'true');
            moved.style.display = 'none';
            moved = null;
          }
        }

        if (current) {
          var wrapper = current.closest('div');
          if (!wrapper) return;

          var position = '';
          try {
            position = getComputedStyle(wrapper).position || wrapper.style.position;
          } catch (e) {}

          if (position === 'fixed' && wrapper.parentNode !== document.body) {
            wrapper.setAttribute('data-fixed-wrapper-id', id);
            wrapper.removeAttribute('data-fixed-hidden');
            wrapper.style.display = '';
            document.body.appendChild(wrapper);
          } else if (position === 'fixed') {
            if (!wrapper.hasAttribute('data-fixed-wrapper-id')) wrapper.setAttribute('data-fixed-wrapper-id', id);
            wrapper.removeAttribute('data-fixed-hidden');
            wrapper.style.display = '';
          }
        }
      });
    } catch (e) {}
  }

  function runCoreEnhancements(context) {
    searchState.resource = context.searchResource || searchState.resource;
    formatExternalLinks();
    initDonateTabs();
    resetCommentPlaceholder(context);

    if (typeof window.initNoticeSystem === 'function') {
      try {
        window.initNoticeSystem();
      } catch (e) {}
    }

    try {
      fixMduiDialogs();
      fixFixedElements();
      if (window.mdui && typeof mdui.mutation === 'function') {
        mdui.mutation();
      }
    } catch (e) {}

    scheduleGotopUpdate();
  }

  function handlePagePhase(event) {
    var detail = event.detail || {};
    var context = detail.context || getPageContext();

    if (detail.stage === 'after-visible') {
      trackAnalyticsPageView();
      refreshBusuanzi();
      return;
    }

    if (detail.stage === 'idle-preload') {
      if (context.searchResource && (!context.isPost || document.visibilityState === 'visible')) {
        ensureSearchIndex({ silent: true }).catch(function () {});
      }

      if (context.needsGallery) {
        ensureGalleryRuntime();
      }

      if (context.hasComments) {
        loadCommentsNow();
      }
    }
  }

  document.addEventListener('page:phase', handlePagePhase);

  window.reinitPageComponents = function () {
    runPageLifecycle('reinit');
  };
  window.runPageLifecycle = runPageLifecycle;

  $$(function () {
    bindFixedChrome();
    runPageLifecycle('initial');
  });
})();
