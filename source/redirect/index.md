---
uuid: 53be5097-f0ea-938b-0794-3c6e865cb573
title: 即将跳转
comments: false
toc: false
count: false
layout: 
share_menu:
donate: false
license: false
qrcode: 
thislink: false
---

<style>
  .redirect-card {
    /* max-width: 840px; */
    /* margin: 24px auto 0; */
    /* padding: 28px 20px 24px; */
    text-align: center;
  }

  .redirect-hero {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 22px;
    margin-bottom: 18px;
    flex-wrap: nowrap;
  }

  .redirect-hero-icon {
    width: 46px;
    height: 46px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.05);
    color: rgba(0, 0, 0, 0.68);
    position: relative;
    flex: 0 0 auto;
  }

  .mdui-theme-layout-dark .redirect-hero-icon {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.78);
  }

  .redirect-hero-icon-linked::after {
    content: '';
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    width: 22px;
    border-top: 2px dashed rgba(0, 0, 0, 0.3);
  }

  .mdui-theme-layout-dark .redirect-hero-icon-linked::after {
    border-top-color: rgba(255, 255, 255, 0.36);
  }

  .redirect-hero-icon .mdui-icon,
  .redirect-hero-icon .redirect-mdi-icon,
  .redirect-hero-icon .redirect-icon-placeholder {
    width: 24px;
    height: 24px;
  }

  .redirect-hero-icon .mdui-icon {
    font-size: 24px;
    line-height: 24px;
  }

  .redirect-hero-icon .mdui-spinner {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .redirect-icon-placeholder {
    display: inline-block;
  }

  .redirect-mdi-icon {
    display: inline-block;
    background-color: currentColor;
    -webkit-mask-image: var(--mdi-url);
    mask-image: var(--mdi-url);
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-position: center;
    -webkit-mask-size: contain;
    mask-size: contain;
  }

  .redirect-link-shell {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }

  .redirect-link {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    max-width: 100%;
    padding: 10px 12px;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.03);
    color: inherit;
    text-decoration: none;
    cursor: copy;
    line-height: 1.9;
    transition: background-color 0.2s ease, transform 0.2s ease;
    overflow-wrap: anywhere;
  }

  .mdui-theme-layout-dark .redirect-link {
    background: rgba(255, 255, 255, 0.05);
  }

  .redirect-link:hover {
    background: rgba(0, 0, 0, 0.06);
  }

  .mdui-theme-layout-dark .redirect-link:hover {
    background: rgba(255, 255, 255, 0.09);
  }

  .redirect-link:active {
    transform: scale(0.995);
  }

  .redirect-scheme {
    font-weight: 500;
    letter-spacing: 0.01em;
  }

  .redirect-scheme.secure {
    color: #2e7d32;
  }

  .redirect-scheme.http {
    color: rgba(0, 0, 0, 0.54);
  }

  .mdui-theme-layout-dark .redirect-scheme.http {
    color: rgba(255, 255, 255, 0.54);
  }

  .redirect-scheme.error {
    color: #c62828;
    text-decoration: line-through;
    text-decoration-thickness: 1.5px;
  }

  .redirect-host {
    color: rgba(0, 0, 0, 0.78);
  }

  .mdui-theme-layout-dark .redirect-host {
    color: rgba(255, 255, 255, 0.84);
  }

  .redirect-host-subdomain {
    color: rgba(0, 0, 0, 0.38);
  }

  .mdui-theme-layout-dark .redirect-host-subdomain {
    color: rgba(255, 255, 255, 0.42);
  }

  .redirect-host-main {
    text-decoration: underline;
    text-underline-offset: 0.15em;
    text-decoration-thickness: 1px;
    font-weight: 500;
  }

  .redirect-host-port {
    color: rgba(0, 0, 0, 0.46);
  }

  .mdui-theme-layout-dark .redirect-host-port {
    color: rgba(255, 255, 255, 0.5);
  }

  .redirect-path {
    color: rgba(0, 0, 0, 0.72);
  }

  .mdui-theme-layout-dark .redirect-path {
    color: rgba(255, 255, 255, 0.75);
  }

  .redirect-hint {
    margin-top: 8px;
    color: rgba(0, 0, 0, 0.54);
  }

  .mdui-theme-layout-dark .redirect-hint {
    color: rgba(255, 255, 255, 0.58);
  }

  .redirect-warning {
    margin-top: 12px;
  }

  .redirect-actions {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 20px;
  }

  .redirect-actions .mdui-btn .mdui-icon {
    margin-right: 6px;
  }

  .redirect-status-hint {
    margin-top: 14px;
    font-size: 14px;
    font-weight: 500;
  }

  .redirect-status-hint.error {
    color: #c62828;
  }

  .mdui-theme-layout-dark .redirect-status-hint.error {
    color: #ef5350;
  }

  .redirect-status-hint.warning {
    color: #ef6c00;
  }

  .mdui-theme-layout-dark .redirect-status-hint.warning {
    color: #ffa726;
  }

  .redirect-status-hint.offline {
    color: rgba(0, 0, 0, 0.54);
  }

  .mdui-theme-layout-dark .redirect-status-hint.offline {
    color: rgba(255, 255, 255, 0.54);
  }

  .redirect-loading {
    padding: 34px 12px 10px;
  }

  .redirect-empty,
  .redirect-error {
    padding: 8px 12px 0;
  }

  .redirect-loading p,
  .redirect-empty p,
  .redirect-error p {
    margin-top: 6px;
  }

  @media (max-width: 480px) {
    .redirect-card {
      /* padding: 24px 16px 20px; */
    }

    .redirect-hero {
      gap: 14px;
    }

    .redirect-hero-icon {
      width: 42px;
      height: 42px;
    }

    .redirect-hero-icon-linked::after {
      width: 14px;
    }

    .redirect-link {
      padding: 8px 10px;
      line-height: 1.75;
    }
  }
</style>

<script data-pjax>
  (function () {
    function onReady(callback) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback, { once: true });
        return;
      }

      callback();
    }

    function escapeHtml(value) {
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    const PROBE_TIMEOUT = 5000;
    const DNS_TIMEOUT = 3500;
    const METADATA_TIMEOUT = 3500;

    function isIpv4Address(hostname) {
      return /^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname);
    }

    function isIpv6Address(hostname) {
      return hostname.includes(':');
    }

    function buildProtocolUrl(urlObject, protocol) {
      const nextUrl = new URL(urlObject.href);
      nextUrl.protocol = `${protocol}:`;
      return nextUrl;
    }

    async function fetchWithTimeout(targetHref, method, timeoutMs) {
      const controller = new AbortController();
      const timeoutId = setTimeout(function () {
        controller.abort();
      }, timeoutMs);

      try {
        const response = await fetch(targetHref, {
          method: method,
          mode: 'no-cors',
          cache: 'no-store',
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        return {
          reachable: true,
          status: typeof response.status === 'number' ? response.status : 0
        };
      } catch (error) {
        clearTimeout(timeoutId);

        if (error && error.name === 'AbortError') {
          return { reachable: false, reason: 'timeout' };
        }

        return { reachable: false, reason: 'network' };
      }
    }

    async function probeProtocol(urlObject, protocol) {
      const targetUrl = buildProtocolUrl(urlObject, protocol);
      const headAttempt = await fetchWithTimeout(targetUrl.href, 'HEAD', PROBE_TIMEOUT);

      if (headAttempt.reachable) {
        return { reachable: true, url: targetUrl, via: 'head' };
      }

      if (headAttempt.reason === 'timeout') {
        return { reachable: false, url: targetUrl, reason: 'timeout' };
      }

      const getAttempt = await fetchWithTimeout(targetUrl.href, 'GET', PROBE_TIMEOUT);

      if (getAttempt.reachable) {
        return { reachable: true, url: targetUrl, via: 'get' };
      }

      return {
        reachable: false,
        url: targetUrl,
        reason: getAttempt.reason || headAttempt.reason || 'network'
      };
    }

    function probeImage(targetHref) {
      return new Promise(function (resolve) {
        const image = new Image();
        let settled = false;
        const timeoutId = setTimeout(function () {
          if (settled) {
            return;
          }

          settled = true;
          image.onload = null;
          image.onerror = null;
          resolve({ reachable: false, reason: 'timeout' });
        }, 2500);

        const finish = function (result) {
          if (settled) {
            return;
          }

          settled = true;
          clearTimeout(timeoutId);
          image.onload = null;
          image.onerror = null;
          resolve(result);
        };

        image.onload = function () {
          finish({ reachable: true, via: 'image' });
        };

        image.onerror = function () {
          finish({ reachable: false, reason: 'network' });
        };

        image.referrerPolicy = 'no-referrer';
        image.src = `${targetHref}${targetHref.includes('?') ? '&' : '?'}redirect_probe=${Date.now()}`;
      });
    }

    async function queryDnsRecord(hostname, recordType) {
      const endpoint = `https://dns.alidns.com/resolve?name=${encodeURIComponent(hostname)}&type=${recordType}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(function () {
        controller.abort();
      }, DNS_TIMEOUT);

      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          cache: 'no-store',
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          return { success: false, hasAnswer: false, status: null };
        }

        const data = await response.json();
        const answers = Array.isArray(data.Answer) ? data.Answer : [];
        const hasAnswer = answers.some(function (answer) {
          return answer && typeof answer.data === 'string' && answer.data.length > 0;
        });

        return {
          success: true,
          hasAnswer: hasAnswer,
          status: Number.isFinite(Number(data.Status)) ? Number(data.Status) : null
        };
      } catch (error) {
        clearTimeout(timeoutId);
        return { success: false, hasAnswer: false, status: null };
      }
    }

    async function probeDns(hostname) {
      if (!hostname || hostname === 'localhost' || isIpv4Address(hostname) || isIpv6Address(hostname)) {
        return { resolved: true, source: 'local' };
      }

      const aRecord = await queryDnsRecord(hostname, 'A');
      if (aRecord.success && aRecord.hasAnswer) {
        return { resolved: true, source: 'A' };
      }

      const aaaaRecord = await queryDnsRecord(hostname, 'AAAA');
      if (aaaaRecord.success && aaaaRecord.hasAnswer) {
        return { resolved: true, source: 'AAAA' };
      }

      const hasDnsResponse = aRecord.success || aaaaRecord.success;
      const isNxDomain = aRecord.status === 3 || aaaaRecord.status === 3;

      if (!hasDnsResponse) {
        return { resolved: null, source: 'unknown' };
      }

      if (isNxDomain) {
        return { resolved: false, source: 'nxdomain' };
      }

      return { resolved: false, source: 'empty' };
    }

    async function probeHttpsDowngrade(urlObject) {
      if (!urlObject || urlObject.protocol !== 'https:') {
        return { downgraded: false, finalUrl: null };
      }

      if (!urlObject.hostname || urlObject.hostname === 'localhost' || isIpv4Address(urlObject.hostname) || isIpv6Address(urlObject.hostname)) {
        return { downgraded: false, finalUrl: null };
      }

      const endpoint = `https://api.microlink.io/?url=${encodeURIComponent(urlObject.href)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(function () {
        controller.abort();
      }, METADATA_TIMEOUT);

      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          cache: 'no-store',
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          return { downgraded: false, finalUrl: null };
        }

        const data = await response.json();
        const resolvedUrl = data && data.status === 'success' && data.data && typeof data.data.url === 'string'
          ? data.data.url
          : '';

        if (!resolvedUrl) {
          return { downgraded: false, finalUrl: null };
        }

        const finalUrlObject = new URL(resolvedUrl);
        return {
          downgraded: finalUrlObject.protocol === 'http:',
          finalUrl: finalUrlObject
        };
      } catch (error) {
        clearTimeout(timeoutId);
        return { downgraded: false, finalUrl: null };
      }
    }

    function buildIconMarkup(icon) {
      if (!icon || icon.type === 'empty') {
        return '<span class="redirect-icon-placeholder" aria-hidden="true"></span>';
      }

      if (icon.type === 'mdi') {
        return `<span class="redirect-mdi-icon" aria-hidden="true" style="--mdi-url:url('./mdi/${escapeHtml(icon.name)}.svg')"></span>`;
      }

      const extraClass = icon.className ? ` ${icon.className}` : '';
      return `<i class="mdui-icon material-icons${extraClass}" translate="no">${escapeHtml(icon.name)}</i>`;
    }

    function buildHeroMarkup(state) {
      const stateMeta = {
        loading: {
          nodes: [
            { icon: { type: 'empty' } },
            { icon: { type: 'mdi', name: 'web-clock' } },
            { icon: { type: 'material', name: 'autorenew', className: 'mdui-spinner' } }
          ]
        },
        secure: {
          nodes: [
            { icon: { type: 'material', name: 'account_circle' } },
            { tone: 'mdui-text-color-green', icon: { type: 'mdi', name: 'lock-check-outline' } },
            { tone: 'mdui-text-color-blue', icon: { type: 'material', name: 'language' } }
          ]
        },
        certError: {
          nodes: [
            { icon: { type: 'material', name: 'account_circle' } },
            { tone: 'mdui-text-color-red', icon: { type: 'mdi', name: 'lock-alert' } },
            { tone: 'mdui-text-color-yellow-700', icon: { type: 'material', name: 'warning' } }
          ]
        },
        httpOnly: {
          nodes: [
            { icon: { type: 'material', name: 'account_circle' } },
            { tone: 'mdui-text-color-yellow-700', icon: { type: 'mdi', name: 'lock-open-alert-outline' } },
            { tone: 'mdui-text-color-blue', icon: { type: 'material', name: 'language' } }
          ]
        },
        unreachable: {
          nodes: [
            { icon: { type: 'material', name: 'account_circle' } },
            { tone: 'mdui-text-color-yellow-700', icon: { type: 'material', name: 'help_outline' } },
            { tone: 'mdui-text-color-yellow-700', icon: { type: 'mdi', name: 'web-remove' } }
          ]
        },
        invalid: {
          nodes: [
            { icon: { type: 'material', name: 'sentiment_neutral' } },
            { icon: { type: 'material', name: 'error_outline' } },
            { icon: { type: 'empty' } }
          ]
        }
      };

      const currentMeta = stateMeta[state] || stateMeta.loading;
      const nodeMarkup = currentMeta.nodes.map(function (node, index) {
        const linkedClass = index < currentMeta.nodes.length - 1 ? ' redirect-hero-icon-linked' : '';
        const toneClass = node.tone ? ` ${node.tone}` : '';
        return `<span class="redirect-hero-icon${linkedClass}${toneClass}">${buildIconMarkup(node.icon)}</span>`;
      }).join('');

      return `
        <div class="redirect-hero" aria-hidden="true">
          ${nodeMarkup}
        </div>
      `;
    }

    function buildSchemeMarkup(state) {
      if (state === 'secure') {
        return '<span class="redirect-scheme secure">https://</span>';
      }

      if (state === 'error') {
        return '<span class="redirect-scheme error">https://</span>';
      }

      return '<span class="redirect-scheme http">http://</span>';
    }

    function buildHostMarkup(urlObject) {
      const hostname = urlObject.hostname;
      const port = urlObject.port ? `<span class="redirect-host-port">:${escapeHtml(urlObject.port)}</span>` : '';
      const isIpv4 = isIpv4Address(hostname);
      const isIpv6 = isIpv6Address(hostname);
      const labels = hostname.split('.').filter(Boolean);

      if (labels.length <= 1 || hostname === 'localhost' || isIpv4 || isIpv6) {
        return `<span class="redirect-host">${escapeHtml(hostname)}${port}</span>`;
      }

      let registrableCount = 2;

      if (labels.length >= 3) {
        const lastLabel = labels[labels.length - 1];
        const secondLastLabel = labels[labels.length - 2];

        if (lastLabel.length === 2 && secondLastLabel.length <= 3) {
          registrableCount = 3;
        }
      }

      registrableCount = Math.min(registrableCount, labels.length);

      const subdomainLabels = labels.slice(0, -registrableCount);
      const registrableLabels = labels.slice(-registrableCount);
      const subdomainMarkup = subdomainLabels.length
        ? `<span class="redirect-host-subdomain">${escapeHtml(subdomainLabels.join('.'))}.</span>`
        : '';

      return `<span class="redirect-host">${subdomainMarkup}<span class="redirect-host-main">${escapeHtml(registrableLabels.join('.'))}</span>${port}</span>`;
    }

    function buildPathMarkup(urlObject) {
      const path = `${urlObject.pathname || '/'}${urlObject.search || ''}${urlObject.hash || ''}`;
      return `<span class="redirect-path">${escapeHtml(path)}</span>`;
    }

    function buildLinkMarkup(urlObject, schemeState) {
      return `
        <a href="#" id="redirect-copy-link" class="redirect-link" >
          ${buildSchemeMarkup(schemeState)}${buildHostMarkup(urlObject)}${buildPathMarkup(urlObject)}
        </a>
      `;
    }

    function renderLoading(targetInfo) {
      targetInfo.innerHTML = `
        ${buildHeroMarkup('loading')}
        <div class="redirect-loading">
          <p mdui-tooltip="{content: '若加载的时间过长，请刷新网页'}">正在加载链接详细信息...</p>
        </div>
      `;

      if (window.mdui && typeof mdui.mutation === 'function') {
        mdui.mutation();
      }
    }

    function renderInvalid(targetInfo, message, shouldAutoClose) {
      targetInfo.innerHTML = `
        ${buildHeroMarkup('invalid')}
        <div class="redirect-error">
          <p>${escapeHtml(message)}</p>
          <button id="redirect-back-only" type="button" class="mdui-btn mdui-btn-dense mdui-color-theme-accent mdui-ripple">返回上一页</button>
        </div>
      `;

      const backButton = document.getElementById('redirect-back-only');
      if (backButton) {
        backButton.addEventListener('click', function () {
          history.back();
          window.close();
        });
      }

      if (window.mdui && typeof mdui.mutation === 'function') {
        mdui.mutation();
      }

      if (shouldAutoClose) {
        setTimeout(function () {
          history.back();
          window.close();
        }, 3000);
      }
    }

    function copyToClipboard(text) {
      const copyWithFallback = function () {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', 'readonly');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      };

      const onSuccess = function () {
        if (window.mdui && typeof mdui.snackbar === 'function') {
          mdui.snackbar({ message: '已复制到剪贴板' });
        }
      };

      if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text)
          .then(onSuccess)
          .catch(function () {
            copyWithFallback();
            onSuccess();
          });
      }

      try {
        copyWithFallback();
        onSuccess();
      } catch (error) {
        if (window.mdui && typeof mdui.snackbar === 'function') {
          mdui.snackbar({ message: '复制失败，请手动复制' });
        }
      }

      return Promise.resolve();
    }

    async function probeHttpReachability(sourceUrl, dnsProbe) {
      const httpUrl = buildProtocolUrl(sourceUrl, 'http');

      if (window.location.protocol !== 'https:') {
        const directProbe = await probeProtocol(httpUrl, 'http');
        return {
          reachable: directProbe.reachable,
          url: httpUrl,
          reason: directProbe.reason || null
        };
      }

      const faviconProbe = await probeImage(`${httpUrl.origin}/favicon.ico`);
      if (faviconProbe.reachable) {
        return {
          reachable: true,
          url: httpUrl,
          reason: 'favicon'
        };
      }

      if (dnsProbe.resolved === true) {
        return {
          reachable: true,
          url: httpUrl,
          reason: 'dns-fallback'
        };
      }

      return {
        reachable: false,
        url: httpUrl,
        reason: faviconProbe.reason || 'network'
      };
    }

    async function resolveConnectionState(sourceUrl) {
      const dnsProbe = await probeDns(sourceUrl.hostname);
      const httpsProbe = await probeProtocol(sourceUrl, 'https');
      const httpDisplayUrl = buildProtocolUrl(sourceUrl, 'http');

      if (httpsProbe.reachable) {
        const downgradeProbe = await probeHttpsDowngrade(httpsProbe.url);

        if (downgradeProbe.downgraded) {
          return {
            heroState: 'httpOnly',
            schemeState: 'http',
            displayUrl: downgradeProbe.finalUrl || httpDisplayUrl
          };
        }

        return {
          heroState: 'secure',
          schemeState: 'secure',
          displayUrl: httpsProbe.url
        };
      }

      if (httpsProbe.reason === 'timeout') {
        return {
          heroState: 'unreachable',
          schemeState: 'http',
          displayUrl: httpDisplayUrl
        };
      }

      if (dnsProbe.resolved === false) {
        return {
          heroState: 'unreachable',
          schemeState: 'http',
          displayUrl: httpDisplayUrl
        };
      }

      if (sourceUrl.protocol === 'https:') {
        return {
          heroState: 'certError',
          schemeState: 'error',
          displayUrl: sourceUrl
        };
      }

      const httpProbe = await probeHttpReachability(sourceUrl, dnsProbe);
      if (httpProbe.reachable) {
        return {
          heroState: 'httpOnly',
          schemeState: 'http',
          displayUrl: httpProbe.url
        };
      }

      return {
        heroState: 'unreachable',
        schemeState: 'http',
        displayUrl: httpProbe.url
      };
    }

    function renderSuccess(targetInfo, displayUrl, schemeState, heroState) {
      let hintMarkup = '';
      if (heroState === 'certError') {
        hintMarkup = '<div class="redirect-status-hint error">此网站数字加密证书异常，有数据劫持或中间人攻击风险</div>';
      } else if (heroState === 'httpOnly') {
        hintMarkup = '<div class="redirect-status-hint warning">此网站不支持安全连接，正在使用未加密的链接传输</div>';
      } else if (heroState === 'unreachable') {
        hintMarkup = '<div class="redirect-status-hint warning">此网站暂时无法连通，可能已离线或当前网络受限</div>';
      }

      targetInfo.innerHTML = `
        ${buildHeroMarkup(heroState)}
        <p>您即将访问以下网站：</p>
        <p>
        <div class="redirect-link-shell">
          ${buildLinkMarkup(displayUrl, schemeState)}
        </div>
        ${hintMarkup}
        </p>
        <p class="redirect-warning">您将要访问的链接不属于老史尬侃或 stevezmt.top ，请注意您的账号和财产安全。</p>

        <div class="redirect-actions">
          <button id="redirect-continue" type="button" class="mdui-btn mdui-btn-dense mdui-color-theme-accent mdui-ripple"><i class="mdui-icon material-icons" translate="no">open_in_new</i>继续访问</button>
          <button id="redirect-back" type="button" class="mdui-btn mdui-btn-dense mdui-ripple"><i class="mdui-icon material-icons" translate="no">arrow_back</i>返回</button>
        </div>
      `;

      if (window.mdui && typeof mdui.mutation === 'function') {
        mdui.mutation();
      }

      const copyLink = document.getElementById('redirect-copy-link');
      if (copyLink) {
        copyLink.addEventListener('click', function (event) {
          event.preventDefault();
          copyToClipboard(displayUrl.href);
        });
      }

      const continueButton = document.getElementById('redirect-continue');
      if (continueButton) {
        continueButton.addEventListener('click', function () {
          window.location.href = displayUrl.href;
        });
      }

      const backButton = document.getElementById('redirect-back');
      if (backButton) {
        backButton.addEventListener('click', function () {
          history.back();
          window.close();
        });
      }
    }

    async function initPage() {
      const targetInfo = document.getElementById('target-info');
      if (!targetInfo) {
        return;
      }

      renderLoading(targetInfo);

      const params = new URLSearchParams(window.location.search);
      const goto = params.get('goto');

      if (!goto) {
        renderInvalid(targetInfo, '链接无效，没有传入有效的变量', true);
        return;
      }

      try {
        const sourceUrl = new URL(goto);

        if (sourceUrl.protocol !== 'http:' && sourceUrl.protocol !== 'https:') {
          renderInvalid(targetInfo, '链接无效，当前仅支持 http / https 链接。', true);
          return;
        }

        const connectionState = await resolveConnectionState(sourceUrl);
        renderSuccess(targetInfo, connectionState.displayUrl, connectionState.schemeState, connectionState.heroState);
      } catch (error) {
        renderInvalid(targetInfo, '链接无效，解析的链接不是有效的格式或无法被解析。', true);
      }
    }

    onReady(initPage);
  }());
</script>

<div id="target-info" class="redirect-card">
  <div class="redirect-loading">
    <div class="redirect-hero" aria-hidden="true">
      <span class="redirect-hero-icon redirect-hero-icon-linked"><span class="redirect-icon-placeholder" aria-hidden="true"></span></span>
      <span class="redirect-hero-icon redirect-hero-icon-linked"><span class="redirect-mdi-icon" aria-hidden="true" style="--mdi-url:url('./mdi/web-clock.svg')"></span></span>
      <span class="redirect-hero-icon"><i class="mdui-icon material-icons mdui-spinner" translate="no">autorenew</i></span>
    </div>
    <p mdui-tooltip="{content: '若加载的时间过长，请刷新网页'}">正在加载链接详细信息...</p>
  </div>
</div>