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
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .redirect-mdi-icon svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
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

    const PROBE_TIMEOUT = 4000;
    const DNS_TIMEOUT = 3000;
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

    async function queryDnsRecordFast(hostname) {
      const endpoint = `http://119.29.29.29/d?dn=${encodeURIComponent(hostname)}.`;
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

        const text = await response.text();
        const ipList = text.trim().split(',').filter(function (ip) {
          return ip && ip.length > 0;
        });

        return {
          success: true,
          hasAnswer: ipList.length > 0,
          status: ipList.length > 0 ? 0 : 3
        };
      } catch (error) {
        clearTimeout(timeoutId);
        return { success: false, hasAnswer: false, status: null };
      }
    }

    async function queryDnsRecordFallback(hostname, recordType) {
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

    async function queryDnsRecord(hostname, recordType) {
      const fastResult = await queryDnsRecordFast(hostname);
      if (fastResult.success) {
        return fastResult;
      }

      return queryDnsRecordFallback(hostname, recordType);
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

    const mdiIcons = {
      'web-clock': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M15 12.5V16.5L18 18.5L18.75 17.25L16.5 15.75V12.5H15M22 12.39C22 12.26 22 12.13 22 12C22 6.5 17.5 2 12 2C6.47 2 2 6.5 2 12C2 17.5 6.5 22 12 22C12.13 22 12.24 22 12.37 21.97C13.43 22.62 14.67 23 16 23C19.86 23 23 19.86 23 16C23 14.68 22.62 13.44 22 12.39M19.76 10.11C19.7 10.07 19.65 10.04 19.59 10H19.74C19.75 10.03 19.75 10.07 19.76 10.11M18.92 8H15.97C15.65 6.75 15.19 5.55 14.59 4.44C16.43 5.07 17.96 6.34 18.92 8M12 4.03C12.83 5.23 13.5 6.57 13.91 8H10.09C10.5 6.57 11.17 5.23 12 4.03M9.66 10H12.41C11.16 10.75 10.15 11.88 9.57 13.24C9.53 12.83 9.5 12.42 9.5 12C9.5 11.32 9.56 10.65 9.66 10M9.4 4.44C8.8 5.55 8.35 6.75 8 8H5.08C6.03 6.34 7.57 5.06 9.4 4.44M4.26 14C4.1 13.36 4 12.69 4 12S4.1 10.64 4.26 10H7.64C7.56 10.66 7.5 11.32 7.5 12S7.56 13.34 7.64 14H4.26M5.08 16H8C8.35 17.25 8.8 18.45 9.4 19.56C7.57 18.93 6.03 17.65 5.08 16M16 21C13.24 21 11 18.76 11 16S13.24 11 16 11 21 13.24 21 16 18.76 21 16 21Z"/></svg>',
      'lock-check-outline': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M14 15C14 16.11 13.11 17 12 17C10.89 17 10 16.1 10 15C10 13.89 10.89 13 12 13C13.11 13 14 13.9 14 15M13.09 20C13.21 20.72 13.46 21.39 13.81 22H6C4.89 22 4 21.1 4 20V10C4 8.89 4.89 8 6 8H7V6C7 3.24 9.24 1 12 1S17 3.24 17 6V8H18C19.11 8 20 8.9 20 10V13.09C19.67 13.04 19.34 13 19 13C18.66 13 18.33 13.04 18 13.09V10H6V20H13.09M9 8H15V6C15 4.34 13.66 3 12 3S9 4.34 9 6V8M21.34 15.84L17.75 19.43L16.16 17.84L15 19L17.75 22L22.5 17.25L21.34 15.84Z"/></svg>',
      'lock-alert': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M10 17C11.1 17 12 16.1 12 15C12 13.9 11.1 13 10 13C8.9 13 8 13.9 8 15S8.9 17 10 17M16 8C17.1 8 18 8.9 18 10V20C18 21.1 17.1 22 16 22H4C2.9 22 2 21.1 2 20V10C2 8.9 2.9 8 4 8H5V6C5 3.2 7.2 1 10 1S15 3.2 15 6V8H16M10 3C8.3 3 7 4.3 7 6V8H13V6C13 4.3 11.7 3 10 3M22 13H20V7H22V13M22 17H20V15H22V17Z"/></svg>',
      'lock-open-alert-outline': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M16 20V10H4V20H16M16 8C17.1 8 18 8.9 18 10V20C18 21.1 17.1 22 16 22H4C2.9 22 2 21.1 2 20V10C2 8.9 2.9 8 4 8H13V6C13 4.3 11.7 3 10 3S7 4.3 7 6H5C5 3.2 7.2 1 10 1S15 3.2 15 6V8H16M10 17C8.9 17 8 16.1 8 15S8.9 13 10 13 12 13.9 12 15 11.1 17 10 17M22 7H20V13H22V7M22 15H20V17H22V15Z"/></svg>',
      'web-remove': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M16.5 12C16.5 11.32 16.44 10.66 16.36 10H19.74C19.9 10.64 20 11.31 20 12C20 12.37 19.97 12.73 19.92 13.08C20.61 13.18 21.25 13.4 21.84 13.72C21.94 13.16 22 12.59 22 12C22 6.5 17.5 2 12 2C6.47 2 2 6.5 2 12C2 17.5 6.5 22 12 22C12.59 22 13.16 21.94 13.72 21.84C13.26 21 13 20.03 13 19C13 18.71 13.03 18.43 13.07 18.15C12.75 18.78 12.4 19.39 12 19.96C11.17 18.76 10.5 17.43 10.09 16H13.81C14.41 14.96 15.31 14.12 16.4 13.6C16.46 13.07 16.5 12.54 16.5 12M12 4.03C12.83 5.23 13.5 6.57 13.91 8H10.09C10.5 6.57 11.17 5.23 12 4.03M4.26 14C4.1 13.36 4 12.69 4 12S4.1 10.64 4.26 10H7.64C7.56 10.66 7.5 11.32 7.5 12S7.56 13.34 7.64 14H4.26M5.08 16H8C8.35 17.25 8.8 18.45 9.4 19.56C7.57 18.93 6.03 17.65 5.08 16M8 8H5.08C6.03 6.34 7.57 5.06 9.4 4.44C8.8 5.55 8.35 6.75 8 8M14.34 14H9.66C9.56 13.34 9.5 12.68 9.5 12S9.56 10.65 9.66 10H14.34C14.43 10.65 14.5 11.32 14.5 12S14.43 13.34 14.34 14M14.59 4.44C16.43 5.07 17.96 6.34 18.92 8H15.97C15.65 6.75 15.19 5.55 14.59 4.44M20.41 19L22.54 21.12L21.12 22.54L19 20.41L16.88 22.54L15.47 21.12L17.59 19L15.47 16.88L16.88 15.47L19 17.59L21.12 15.47L22.54 16.88L20.41 19Z"/></svg>'
    };

    function buildIconMarkup(icon) {
      if (!icon || icon.type === 'empty') {
        return '<span class="redirect-icon-placeholder" aria-hidden="true"></span>';
      }

      if (icon.type === 'mdi') {
        const svgContent = mdiIcons[icon.name] || '';
        return `<span class="redirect-mdi-icon" aria-hidden="true">${svgContent}</span>`;
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
        <button href="#" id="redirect-copy-link" class="mdui-card mdui-ripple redirect-link" style="text-decoration: none;">
          ${buildSchemeMarkup(schemeState)}${buildHostMarkup(urlObject)}${buildPathMarkup(urlObject)}
        </button>
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
          <button id="redirect-continue" type="button" class="mdui-btn mdui-btn-dense mdui-color-theme-accent mdui-ripple mdui-btn-block"><i class="mdui-icon material-icons" translate="no">open_in_new</i>继续访问</button>
          <button id="redirect-back" type="button" class="mdui-btn mdui-btn-dense mdui-ripple mdui-btn-block"><i class="mdui-icon material-icons" translate="no">arrow_back</i>返回</button>
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
      <span class="redirect-hero-icon"><i class="mdui-icon material-icons mdui-spinner mdui-spinner-colorful" translate="no">autorenew</i></span>
    </div>
    <p mdui-tooltip="{content: '若加载的时间过长，请刷新网页'}">正在加载链接详细信息...</p>
  </div>
</div>