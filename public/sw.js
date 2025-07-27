const CACHE_NAME = 'quicksidetool-v1.0.0';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icon192.png',
  '/icon512.png'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Cache opened successfully
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        // Handle cache installation errors silently in production
        if (process.env.NODE_ENV === 'development') {
          console.warn('Service Worker: Cache installation failed', error);
        }
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // Return offline page or fallback
        return caches.match('/');
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            // Delete old cache
            if (process.env.NODE_ENV === 'development') {
              console.info('Service Worker: Cleaning up old cache', cacheName);
            }
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline uploads
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Handle background sync for offline file processing
  return new Promise((resolve) => {
    // Implementation for background processing
    resolve();
  });
} 