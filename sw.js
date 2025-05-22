const CACHE_NAME = 'kannur-bus-' + Date.now(); // Unique cache per deployment
const PRECACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/bus-data.js',
  '/offline.html',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Dynamic content that should be updated frequently
const DYNAMIC_CACHE = 'dynamic-' + CACHE_NAME;
const MAX_DYNAMIC_ITEMS = 50; // Prevent cache growing too large

// Install - Precaches essential resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()) // Activate immediately
  );
});

// Activate - Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME && !key.includes(DYNAMIC_CACHE)) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // Control all open pages
  );
});

// Fetch - Smart caching strategy
self.addEventListener('fetch', event => {
  // Skip non-GET requests and chrome-extension
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  // Network first for HTML (with fallback)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          // Update cache with fresh response
          const clonedResponse = networkResponse.clone();
          caches.open(DYNAMIC_CACHE)
            .then(cache => cache.put(event.request, clonedResponse));
          return networkResponse;
        })
        .catch(() => caches.match('/offline.html'))
    );
    return;
  }

  // Cache first for static assets
  if (PRECACHE.some(url => event.request.url.includes(url.split('/').pop()))) {
    event.respondWith(
      caches.match(event.request)
        .then(cached => cached || fetch(event.request))
    );
    return;
  }

  // Dynamic content: stale-while-revalidate
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        // Update cache in background
        caches.open(DYNAMIC_CACHE).then(cache => {
          cache.put(event.request, networkResponse.clone());
          // Clean up if cache gets too big
          cache.keys().then(keys => {
            if (keys.length > MAX_DYNAMIC_ITEMS) {
              cache.delete(keys[0]);
            }
          });
        });
        return networkResponse;
      }).catch(() => {}); // Silent fail if network fails

      return cachedResponse || fetchPromise;
    })
  );
});

// Background sync for critical updates
self.addEventListener('sync', event => {
  if (event.tag === 'update-content') {
    event.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
        return Promise.all(
          PRECACHE.map(url => fetch(url)
            .then(response => cache.put(url, response))
            .catch(() => {}))
        );
      })
    );
  }
});

// Push notifications for updates
self.addEventListener('push', event => {
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192x192.png'
    })
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({type: 'window'}).then(clientList => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('/');
    })
  );
});
