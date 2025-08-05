// offline config passed to workbox-build.
module.exports = {
    // 禁用预缓存，改为按需加载
    // 建议预缓存首页、主要入口页面、核心 CSS/JS、站点 logo/favicon、manifest、PWA 相关文件等
    globPatterns: [
      'index.html',
      '404.html',
      '**/index.html',
      '**/manifest*.json',
      '**/favicon.*',
      '**/logo*.*',
      '**/*.{css,js,png,svg,ttf,webp,woff,woff2}',
    ],

    // 使用 `find . -type f -name '*.*' | sed 's|.*\.||' | sort | uniq | paste -sd '|'` 捕获
    
    // 注释掉静态文件预缓存，改为运行时按需缓存
    globDirectory: 'public',
    swDest: 'public/service-worker.js',
    maximumFileSizeToCacheInBytes: 52428800, // 缓存的最大文件大小，以字节为单位。50MB
    skipWaiting: true,
    clientsClaim: true,
    // 按需加载配置：只在用户访问时才缓存资源，而不是预先缓存整个网站
    runtimeCaching: [ // 运行时缓存策略，资源会在首次访问时被缓存
      // CDNs - should be CacheFirst, since they should be used specific versions so should not change
      
      // {
      //   urlPattern: /^https:\/\/mirror\.blog\.stevezmt\.top\/.*/, // 可替换成你的 URL
      //   handler: 'StaleWhileRevalidate'
      // }

      {
        urlPattern: /.*\.html$/,
        /**
         * 按需缓存策略说明：
         * NetworkFirst: 优先从网络获取最新内容，网络失败时使用缓存，适合页面内容
         * StaleWhileRevalidate: 快速返回缓存内容，同时在后台更新，用户体验好
         * CacheFirst: 优先使用缓存，适合不经常变化的静态资源
         */
        handler: 'NetworkFirst', // 改为NetworkFirst，确保页面内容是最新的
        options: {
          cacheName: 'html-cache',
          cacheableResponse: { statuses: [0, 200] },
          expiration: { maxAgeSeconds: 86400 * 1 }, // 1d
          networkTimeoutSeconds: 3 // 网络超时3秒后使用缓存
        }
      },
      {
        urlPattern: /\/$/, // 匹配所有以 / 结尾的 URL
        handler: 'NetworkFirst', // 首页和目录页使用 NetworkFirst 策略
        options: {
          cacheName: 'slash-cache', // 缓存名称
          cacheableResponse: { statuses: [0, 200] }, // 可缓存的响应状态码
          expiration: { maxAgeSeconds: 86400 * 1 }, // 缓存有效期为1天
          networkTimeoutSeconds: 3 // 网络超时后使用缓存
        }
      },
      {
        urlPattern: /.*\.(css|js)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'css-js-cache',
          cacheableResponse: { statuses: [0, 200] },
          expiration: { maxAgeSeconds: 86400 * 7 } // 7d
        }
            },
            {
        urlPattern: /^(?!.*(sitemap|atom)\.xml$).*\.xml$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'xml-cache',
          cacheableResponse: { statuses: [0, 200] },
          expiration: { maxAgeSeconds: 86400 * 7 }, // 7d
        }
      },
      {
        urlPattern: /.*\.(png|gif|webp|ico|svg|cur|woff|ijmap|ttf|eot|woff2?)$/,
        handler: 'CacheFirst', // 静态资源优先使用缓存
        options: {
          cacheName: 'media-cache',
          cacheableResponse: { statuses: [0, 200] },
          expiration: { 
            maxAgeSeconds: 86400 * 7, // 7天
            maxEntries: 100 // 限制缓存条目数量，避免缓存过多
          }
        }
      },
      {
        urlPattern: /.*\/(avatar|banner|favicon|grey|loading|material-\d+)\.(png|gif)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'media-preset-cache',
          cacheableResponse: { statuses: [0, 200] }
        }
      },
      {
        urlPattern: /^https:\/\/(cdn\.staticfile\.org|unpkg\.com|cdn\.bootcdn\.net|cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|busuanzi\.ibruce\.info|ajax\.aspnetcdn\.com|gcore\.jsdelivr\.net|cdn-city\.livere\.com)\/.*/,
        handler: 'CacheFirst', // CDN资源优先使用缓存
        options: {
          cacheName: 'cdn-cache',
          cacheableResponse: { statuses: [0, 200] },
          expiration: { 
            maxAgeSeconds: 86400 * 7, // 7天
            maxEntries: 50 // 限制CDN缓存条目数量
          }
        }
      }
    ]
  }
