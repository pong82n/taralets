/**
 * TaraLets Service Worker for Mobile & Tablet PWA Support
 */

const CACHE_NAME = 'taralets-cache-v7';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/bundle.js',
  '/manifest.json',
  '/assets/logo/icon-192.png',
  '/assets/logo/icon-512.png',
  '/assets/logo/icon-maskable-512.png',
  '/assets/logo/taralets-icon.svg',
  '/assets/logo/taralets-full-logo.svg',
  '/assets/logo/favicon.svg',
  '/assets/qr/qr-driver-app.svg',
  '/assets/qr/qr-driver-app.png',
  '/assets/qr/qr-passenger-app.svg',
  '/assets/qr/qr-passenger-app.png'
];

// Instantly skip waiting when a message is received
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force the waiting service worker to become active
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('TaraLets PWA cache warm-up notice:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Network first with cache fallback strategy
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && event.request.url.startsWith(self.location.origin)) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
