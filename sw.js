// Saves the app on the device so it works offline after the first visit.
const CACHE = "exam-predictor-v1";
const FILES = [
  "./", "index.html", "manifest.webmanifest",
  "icon-180.png", "icon-192.png", "icon-512.png",
  "fonts/CormorantGaramond-0.woff2", "fonts/Manrope-1.woff2"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Use the saved copy first; fall back to the network.
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(hit => hit || fetch(event.request))
  );
});
