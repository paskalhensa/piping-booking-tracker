const CACHE = 'booking-tracker-v1';
const ALWAYS_FETCH = [
  'https://www.gstatic.com/firebasejs/'
];

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Always go network-first for Firebase (it handles its own offline cache)
  if (ALWAYS_FETCH.some(u => e.request.url.startsWith(u))) {
    return;
  }

  e.respondWith(
    caches.open(CACHE).then(cache =>
      fetch(e.request)
        .then(res => {
          if (res.ok) cache.put(e.request, res.clone());
          return res;
        })
        .catch(() => caches.match(e.request))
    )
  );
});