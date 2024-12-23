// offline config passed to workbox-build.
module.exports = {
    globPatterns: ['**/*.{css,eot,gif,html,ijmap,jpeg,jpg,js,png,svg,ttf,webp,woff,woff2,xml}'],
    //                    ^ok ^ok ^ok ^ok  ^ok   ^ok  ^ok ^ok^ok ^ok ^ok ^ok  ^ok  ^ok   ^ok

    // 使用 `find . -type f -name '*.*' | sed 's|.*\.||' | sort | uniq | paste -sd '|'` 捕获
    
    // 静态文件合集，如果你的站点使用了例如 webp 格式的文件，请将文件类型添加进去。
    globDirectory: 'public',
    swDest: 'public/service-worker.js',
    maximumFileSizeToCacheInBytes: 10485760, // 缓存的最大文件大小，以字节为单位。
    skipWaiting: true,
    clientsClaim: true,
    runtimeCaching: [ // 如果你需要加载 CDN 资源，请配置该选项，如果没有，可以不配置。
      // CDNs - should be CacheFirst, since they should be used specific versions so should not change
      
      // {
      //   urlPattern: /^https:\/\/mirror\.blog\.stevezmt\.top\/.*/, // 可替换成你的 URL
      //   handler: 'StaleWhileRevalidate'
      // }

      {
        urlPattern: /.*\.html$/,
        /**
         * 按需修改使用策略
         * StaleWhileRevalidate: 使用缓存的内容尽快响应请求（如果可用），如果未缓存，则回退到网络请求。然后，网络请求用于更新缓存。
         * CacheFirst: 缓存优先策略，优先获取缓存中的资源，如果缓存中没有相关资源，那么就发起网络请求。
         * NetworkFirst: 尝试从网络获取最新请求，如果请求成功，将响应放入缓存中。如果网络无法返回响应，则将使用缓存响应。
         * NetworkOnly: 只使用网络请求获取的资源
         * CacheOnly: 只使用缓存中的资源
         */
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'html-cache',
          cacheableResponse: { statuses: [0, 200] },
          expiration: { maxAgeSeconds: 86400 * 7 } // 按需修改
        }
      },
      {
        urlPattern: /.*\.(css|js)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'css-js-cache',
          cacheableResponse: { statuses: [0, 200] },
          expiration: { maxAgeSeconds: 86400 * 7 } // 按需修改
        }
      },
      {
        urlPattern: /.*\.(xml|)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'xml-cache',
          cacheableResponse: { statuses: [0, 200] },
          expiration: { maxAgeSeconds: 86400 * 7 } // 按需修改
        }
      },
      {
        urlPattern: /.*\.(png|gif|jpg|jpeg|webp|ico|svg|cur|mp4|woff|ijmap|ttf|eot|woff2?)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'media-cache',
          cacheableResponse: { statuses: [0, 200] }
        }
      },
      {
        urlPattern: /^https:\/\/(cdn\.staticfile\.org|unpkg\.com|mirror\.blog\.stevezmt\.top)\/.*/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'cdn-cache',
          cacheableResponse: { statuses: [0, 200] }
        }
      }
    ]
  }
