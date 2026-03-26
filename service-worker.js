const CACHE_NAME = 'bullbox-cache-v1';
const OFFLINE_URL = 'offline.html';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/index.tsx',
  '/icon.svg',
  '/locales/en.json',
  '/locales/es.json',
  'https://cdn.tailwindcss.com',
  'https://aistudiocdn.com/@google/genai@^1.21.0',
  'https://aistudiocdn.com/react@^19.1.1',
  'https://aistudiocdn.com/recharts@^3.2.1',
  'https://aistudiocdn.com/react-dom@^19.1.1/'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching app shell');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: clearing old cache');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.open(CACHE_NAME).then(cache => {
          return cache.match(OFFLINE_URL);
        });
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});
