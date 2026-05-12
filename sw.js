const CACHE = 'portfolio-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/js/modules/data.js',
  '/js/modules/theme.js',
  '/js/modules/cursor.js',
  '/js/modules/loader.js',
  '/js/modules/nav.js',
  '/js/modules/hover-preview.js',
  '/js/modules/showcase.js',
  '/js/modules/scroll-reveal.js',
  '/js/modules/counter.js',
  '/js/modules/poetry.js',
  '/js/modules/work-detail.js',
  '/js/modules/hash-router.js',
  '/js/modules/motion-carousel.js',
  '/js/modules/stars.js',
  '/js/modules/hanging-circles.js',
  '/js/modules/back-to-top.js',
  '/js/modules/nav-waveform.js',
  '/Font/static/JosefinSans-Thin.ttf',
  '/Font0/magnat-poster-bold.otf',
];

// Install: cache all core assets immediately
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) {
        return caches.delete(k);
      }));
    })
  );
  self.clients.claim();
});

// Fetch: cache-first for core assets, network-first for everything else
self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;

  // Cache-first for known assets
  const url = new URL(e.request.url);
  if (ASSETS.indexOf(url.pathname) !== -1) {
    e.respondWith(
      caches.match(e.request).then(function(cached) {
        return cached || fetch(e.request).then(function(resp) {
          const clone = resp.clone();
          caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
          return resp;
        });
      })
    );
    return;
  }

  // Stale-while-revalidate for images, videos, 3D assets
  if (/\.(jpg|png|gif|webp|svg|mp4|webm|glb|gltf|exr|hdr|bin)$/.test(url.pathname)) {
    e.respondWith(
      caches.match(e.request).then(function(cached) {
        const fetched = fetch(e.request).then(function(resp) {
          const clone = resp.clone();
          caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
          return resp;
        });
        return cached || fetched;
      })
    );
    return;
  }
});
