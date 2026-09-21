/**
 * CardioOrigin - Service Worker (v4: リアルタイム優先 NetworkFirst 戦略)
 */

const CACHE_NAME = 'cardio-origin-cache-v4';
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
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
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

// NetworkFirst 戦略 (常に最新のJS/HTMLを読み込み、ネットワーク不能時のみキャッシュ使用)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request).then((networkResponse) => {
      if (networkResponse && networkResponse.status === 200) {
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
      }
      return networkResponse;
    }).catch(() => {
      return caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});
