const CACHE_NAME = 'dogancay-erp-v1';
const ASSETS = [
    './index.html',
    './logo.png',
    './manifest.json',
    './css/styles.css',
    './js/firebase-config.js',
    './js/cad-canvas.js',
    './js/optimizer.js',
    './js/reviews.js',
    './js/main.js',
    'https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap'
];

// Install Event - Pre-cache assets
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Pre-caching static assets');
            return cache.addAll(ASSETS);
        }).then(() => self.skipWaiting())
    );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('[Service Worker] Removing old cache:', key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event - Cache first, fallback to network
self.addEventListener('fetch', (e) => {
    // Avoid caching Firestore DB direct requests
    if (e.request.url.includes('firestore.googleapis.com')) {
        return;
    }

    e.respondWith(
        caches.match(e.request).then((cachedResponse) => {
            if (cachedResponse) {
                // Return cached version
                return cachedResponse;
            }

            // Fetch from network, cache it, and return
            return fetch(e.request).then((networkResponse) => {
                // Ensure valid response
                if (!networkResponse || networkResponse.status !== 200) {
                    return networkResponse;
                }

                // Cache new response clone
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    // Only cache internal GET requests
                    if (e.request.method === 'GET' && e.request.url.startsWith(self.location.origin)) {
                        cache.put(e.request, responseToCache);
                    }
                });

                return networkResponse;
            }).catch(() => {
                // Offline fallback
                if (e.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});
