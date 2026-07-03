// ================= VERSION =================
const VERSION = "1.0.2"; // Cambia este número en cada actualización
const CACHE_NAME = "burguer-house-" + VERSION;

const urlsToCache = [
    "./",
    "./index.html",
    "./logo.jpeg",
    "./manifest.json"
];

// ================= INSTALAR =================
self.addEventListener("install", event => {
    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// ================= ACTIVAR =================
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            )
        )
    );

    self.clients.claim();
});

// ================= FETCH =================
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener("message",event=>{
    if(event.data.action==="skipWaiting"){
        self.skipWaiting();
    }
});