const CACHE_NAME = "mpesa-calculator-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/converter.html",
  "/fees.json",
  "/manifest.json",
  "/Assets/css/style.css",
  "/Assets/scripts/script.js",
  "/Assets/scripts/converter.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request)),
  );
});
