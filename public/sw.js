/**
 * @file public/sw.js
 * @description Minimal app-shell service worker for Eliot.
 *
 * Deliberately simple: this is NOT a full offline-first asset pipeline
 * (no Workbox, no build-time precache manifest). It caches the app shell
 * on install and serves same-origin GET requests cache-first with a
 * network fallback, so the app still opens (even if stale) with no
 * connection — consistent with Eliot's local-first principle (ADR-001).
 * Cross-origin requests (fonts, any future API calls) are left untouched
 * and always go to the network.
 *
 * Revisit this if/when Eliot grows real offline data sync needs — a
 * hand-rolled cache-first worker is the smallest thing that solves
 * "reopen without a connection," not a general offline architecture.
 */

const CACHE_VERSION = 'eliot-shell-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon.svg',
  '/icons/icon-maskable.svg',
  '/icons/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_VERSION)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle same-origin GET requests — everything else (cross-origin
  // fonts, non-GET) passes straight through to the network untouched.
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => cached);

      // Cache-first for instant loads; network runs in the background to
      // keep the cache fresh for next time.
      return cached || networkFetch;
    })
  );
});
