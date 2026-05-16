const CACHE_NAME = 'hoop-v3';
const OFFLINE_URLS = [
  '/',
  '/index.html',
];

// Install — cache shell app
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_URLS);
    })
  );
  self.skipWaiting();
});

// Activate — hapus cache lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — cache-first untuk assets, network-first untuk API
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // API calls (Cloudflare Worker) — network only, jangan cache
  if (url.hostname.includes('workers.dev') || url.hostname.includes('script.google.com')) {
    event.respondWith(fetch(event.request).catch(() =>
      new Response(JSON.stringify({ status: 'offline' }), {
        headers: { 'Content-Type': 'application/json' }
      })
    ));
    return;
  }

  // App assets — cache first, fallback ke network
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        // Cache JS, CSS, fonts
        if (response.ok && (
          event.request.url.includes('/assets/') ||
          event.request.url.includes('.js') ||
          event.request.url.includes('.css') ||
          event.request.url.includes('fonts.googleapis') ||
          event.request.url.includes('fonts.gstatic')
        )) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback ke index.html
        return caches.match('/index.html');
      });
    })
  );
});
