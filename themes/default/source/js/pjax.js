class Pjax {
  constructor(options = {}) {
    this.options = Object.assign({
      container: '#main',
      fragment: '#main',
      duration: 300,
      timeout: 10000,
      history: true,
      scrollTo: 0,
      debug: false
    }, options);

    this.container = document.querySelector(this.options.container);
    this.abortController = null;
    this.navigationId = 0;
    this.progressTimer = null;
    this.overlayTimer = null;
    this.loadingTextTimer = null;
    this.init();
  }

  log(...args) {
    if (this.options.debug) console.log('[Pjax]', ...args);
  }

  init() {
    window.addEventListener('popstate', e => this.onPopState(e));
    document.addEventListener('click', e => this.onLinkClick(e));
    
    // Initial state
    if (this.options.history) {
      history.replaceState({
        url: window.location.href,
        title: document.title,
        scroll: window.scrollY
      }, document.title, window.location.href);
    }
  }

  onLinkClick(e) {
    let el = e.target;
    while (el && el.tagName !== 'A') el = el.parentNode;
    if (!el || el.tagName !== 'A') return;

    // Ignore if:
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || // Modifier keys
        e.defaultPrevented || // Already prevented
        el.target === '_blank' || // New tab
        el.href.startsWith('javascript:') || // JS link
        el.href.startsWith('mailto:') || // Mail link
        el.getAttribute('data-no-pjax') !== null || // Explicit opt-out
        !el.href.startsWith(window.location.origin) // External link
    ) return;

    // Check for hash links on same page
    const url = new URL(el.href);
    if (url.pathname === window.location.pathname && url.search === window.location.search) {
      // It's a hash change or same page reload
      if (url.hash) {
        // Let browser handle hash
        return;
      }
      // Same page reload, maybe allow PJAX to refresh?
      // For now, let's prevent default and reload via PJAX
    }

    // Close sidebar on mobile
    if (window.innerWidth < 1024 && typeof mdui !== 'undefined') {
      const sidebar = document.getElementById('sidebar');
      if (sidebar && el.closest('#sidebar')) {
        const overlay = document.querySelector('.mdui-overlay.mdui-overlay-show');
        if (overlay) {
          overlay.click();
        } else {
          const drawer = new mdui.Drawer('#sidebar');
          drawer.close();
        }
      }
    }

    e.preventDefault();
    this.load(el.href);
  }

  onPopState(e) {
    if (e.state && e.state.url) {
      this.load(e.state.url, { history: false, scroll: e.state.scroll });
    }
  }

  async load(url, options = {}) {
    const opts = Object.assign({}, this.options, options);
    
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();
    const navigationId = ++this.navigationId;

    // Show loading
    this.trigger('pjax:send', { url });
    this.showLoading();

    try {
      const response = await fetch(url, {
        headers: {
          'X-PJAX': 'true',
          'X-PJAX-Container': this.options.container
        },
        signal: this.abortController.signal
      });

      if (navigationId !== this.navigationId) return;

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      
      // Update title
      document.title = doc.title;

      // Update container
      const newContent = doc.querySelector(this.options.fragment);
      if (!newContent) throw new Error(`Container ${this.options.fragment} not found in response`);

      // Animation out
      this.container.classList.add('pjax-out');
      
      await new Promise(r => setTimeout(r, opts.duration)); // Wait for animation

      // Replace content
      this.syncContainerAttributes(newContent);
      this.container.innerHTML = newContent.innerHTML;
      
      // Execute scripts
      this.executeScripts(this.container);

      // Update history
      if (opts.history) {
        history.pushState({
          url: url,
          title: document.title,
          scroll: 0
        }, document.title, url);
      }

      // Scroll
      if (typeof opts.scroll === 'number') {
        window.scrollTo(0, opts.scroll);
      } else if (opts.scrollTo !== false) {
        window.scrollTo(0, opts.scrollTo);
      }

      // Animation in
      this.container.classList.remove('pjax-out');
      this.container.classList.add('pjax-in');
      
      setTimeout(() => {
        this.container.classList.remove('pjax-in');
      }, opts.duration);

      // Re-init plugins
      this.reinitPlugins();

      this.hideLoading();
      this.trigger('pjax:complete', { url });
      this.trigger('pjax:success', { url });

    } catch (err) {
      if (err && err.name === 'AbortError') return;
      console.error('[Pjax] Load error:', err);
      this.hideLoading();
      this.trigger('pjax:error', { url, error: err });
      // Fallback
      window.location.href = url;
    }
  }

  executeScripts(container) {
    const scripts = container.querySelectorAll('script');
    scripts.forEach(script => {
      if (script.type && script.type !== 'text/javascript' && script.type !== 'application/javascript') return;
      
      const newScript = document.createElement('script');
      Array.from(script.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
      newScript.appendChild(document.createTextNode(script.innerHTML));
      script.parentNode.replaceChild(newScript, script);
    });
  }

  syncContainerAttributes(newContent) {
    Array.from(this.container.attributes).forEach(attr => {
      if (attr.name === 'id' || attr.name === 'class') return;
      this.container.removeAttribute(attr.name);
    });

    Array.from(newContent.attributes).forEach(attr => {
      if (attr.name === 'id') return;
      if (attr.name === 'class') {
        this.container.className = attr.value;
        return;
      }
      this.container.setAttribute(attr.name, attr.value);
    });
  }

  showLoading() {
    // MDUI progress bar or similar
    let bar = document.querySelector('.pjax-progress');
    const header = document.getElementById('header');

    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'pjax-progress mdui-progress mdui-color-theme';
      bar.innerHTML = '<div class="mdui-progress-indeterminate mdui-color-grey-50"></div>';
    }

    // Move bar to header if possible, otherwise body
    if (header) {
      if (bar.parentNode !== header) {
        header.appendChild(bar);
      }
    } else {
      if (bar.parentNode !== document.body) {
        document.body.appendChild(bar);
      }
    }

    // Overlay
    let overlay = document.querySelector('.pjax-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'pjax-overlay';
      document.body.appendChild(overlay);
    }

    // Ensure loading content exists
    if (!overlay.querySelector('.pjax-loading-content')) {
      overlay.innerHTML = `
        <div class="pjax-loading-content">
          <div class="mdui-spinner"></div>
          <div class="pjax-loading-text">仍在加载...</div>
        </div>
      `;
      mdui.mutation();
    }

    if (this.progressTimer) clearTimeout(this.progressTimer);
    if (this.overlayTimer) clearTimeout(this.overlayTimer);
    if (this.loadingTextTimer) clearTimeout(this.loadingTextTimer);

    bar.style.display = 'none';
    overlay.classList.remove('show');
    const content = overlay.querySelector('.pjax-loading-content');
    if (content) content.classList.remove('show');

    this.progressTimer = setTimeout(() => {
      bar.style.display = 'block';
      if (typeof window.showMaterialRefresh === 'function') {
        window.showMaterialRefresh();
      }
      mdui.mutation();
    }, 120);

    this.overlayTimer = setTimeout(() => {
      requestAnimationFrame(() => overlay.classList.add('show'));
    }, 900);

    this.loadingTextTimer = setTimeout(() => {
      const content = overlay.querySelector('.pjax-loading-content');
      if (content) content.classList.add('show');
    }, 2200);
  }

  hideLoading() {
    if (this.progressTimer) clearTimeout(this.progressTimer);
    if (this.overlayTimer) clearTimeout(this.overlayTimer);
    if (this.loadingTextTimer) clearTimeout(this.loadingTextTimer);
    this.progressTimer = null;
    this.overlayTimer = null;
    this.loadingTextTimer = null;

    const bar = document.querySelector('.pjax-progress');
    if (bar) bar.style.display = 'none';
    if (typeof window.hideMaterialRefresh === 'function') {
      window.hideMaterialRefresh();
    }
    
    const overlay = document.querySelector('.pjax-overlay');
    if (overlay) {
      overlay.classList.remove('show');
      const content = overlay.querySelector('.pjax-loading-content');
      if (content) content.classList.remove('show');
    }
  }

  trigger(eventName, detail) {
    const event = new CustomEvent(eventName, { detail });
    document.dispatchEvent(event);
  }

  reinitPlugins() {
    if (typeof window.reinitPageComponents === 'function') window.reinitPageComponents();
    if (window.mdui) mdui.mutation();
    document.dispatchEvent(new Event('page:updated'));
    window.dispatchEvent(new Event('resize'));
    window.dispatchEvent(new Event('scroll'));
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  window.pjax = new Pjax({
    container: '#main',
    fragment: '#main',
    duration: 300
  });
});
