const CACHE_NAME = 'depot-demo-cache-v1';
const OFFLINE_FALLBACK = './index.html';

const ASSETS = [
  OFFLINE_FALLBACK,
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  './icons/icon-192.svg',
  './icons/icon-512.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys
      .filter((key) => key !== CACHE_NAME)
      .map((key) => caches.delete(key))
    ).then(() => self.clients.claim())
  ));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const req = event.request;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          return response;
        })
        .catch(() => {
          if (req.mode === 'navigate') {
            return caches.match(OFFLINE_FALLBACK);
          }
          return new Response('', {
            status: 503,
            statusText: 'Offline. Resource unavailable.'
          });
        });
    })
  );
});
