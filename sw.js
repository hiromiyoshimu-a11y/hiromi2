/**
 * CardioOrigin - Service Worker (オフライン完全動作 & キャッシュ管理)
 */

const CACHE_NAME = 'cardio-origin-cache-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './diagnosis.html',
  './quiz.html',
  './css/style.css',
  './css/heart-map.css',
  './css/ios-mobile.css',
  './css/quiz.css',
  './js/app.js',
  './js/quiz.js',
  './js/algorithm.js',
  './js/heart-map.js',
  './js/presets.js',
  './js/literature.js',
  './js/ecg-draw.js',
  './js/image-analyzer.js',
  './js/metric-explainer.js',
  './js/disclaimer-modal.js',
  './assets/heart_3d_anterior.jpg',
  './assets/flowchart_naito2005.jpg',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // バックグラウンドで更新をフェッチ
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => {/* オフライン時は無視 */});

        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // オフライン時のフォールバック
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});
