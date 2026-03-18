// sw.js - Service Worker для AquaCalc
const CACHE_NAME = 'aquacalc-v2-1';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './img/logo.png',
  './img/favicon.png',
  './img/icon-192.png',
  './img/icon-512.png'
];

// Установка Service Worker
self.addEventListener('install', event => {
  console.log('[SW] Установка Service Worker');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Кэширование файлов');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('[SW] Ошибка кэширования:', err))
  );
  self.skipWaiting();
});

// Активация и очистка старого кэша
self.addEventListener('activate', event => {
  console.log('[SW] Активация Service Worker');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Удаление старого кэша:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Перехват запросов
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(error => {
          console.error('[SW] Ошибка сети:', error);
          return new Response('Offline', { status: 503 });
        });
      })
  );
});

// Обработка push-уведомлений (опционально)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Новое уведомление',
    icon: 'img/icon-192.png',
    badge: 'img/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('AquaCalc', options)
  );
});