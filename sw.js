const CACHE_NAME = "burguer-house-v2";

// Archivos base de la app
const urlsToCache = [
  "./",
  "./index.html",
  "./logo.jpeg",
  "./manifest.json"
];

// ================= INSTALL =================
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );

  // activa rápido el SW nuevo
  self.skipWaiting();
});

// ================= ACTIVATE =================
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );

  self.clients.claim();
});

// ================= FETCH (CACHE FIRST + NETWORK FALLBACK) =================
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).then((response) => {
          // guardar nuevas peticiones en cache
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
      );
    })
  );
});