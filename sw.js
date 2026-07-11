/* =========================
   CONFIGURACIÓN
========================= */

const CACHE_NAME = "ventas-cache-v2";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./manifest.json",
    "./logoo.jpeg"
];


/* =========================
   INSTALACIÓN
========================= */

self.addEventListener("install", (event) => {

    console.log("📦 Instalando Service Worker...");

    self.skipWaiting();

    event.waitUntil(

        caches.open(CACHE_NAME)

        .then((cache) => {

            return cache.addAll(FILES_TO_CACHE);

        })

    );

});


/* =========================
   ACTIVACIÓN
========================= */

self.addEventListener("activate", (event) => {

    console.log("✅ Service Worker activado");

    event.waitUntil(

        caches.keys()

        .then((keys) => {

            return Promise.all(

                keys.map((key) => {

                    if (key !== CACHE_NAME) {

                        console.log("🗑 Eliminando:", key);

                        return caches.delete(key);

                    }

                })

            );

        })

        .then(() => self.clients.claim())

    );

});


/* =========================
   FETCH
========================= */

self.addEventListener("fetch", (event) => {

    if (event.request.method !== "GET") return;

    event.respondWith(

        caches.match(event.request)

        .then((cachedResponse) => {

            if (cachedResponse) {

                return cachedResponse;

            }

            return fetch(event.request)

            .then((networkResponse) => {

                if (
                    !networkResponse ||
                    networkResponse.status !== 200 ||
                    networkResponse.type !== "basic"
                ) {

                    return networkResponse;

                }

                const responseClone = networkResponse.clone();

                caches.open(CACHE_NAME)

                .then((cache) => {

                    cache.put(event.request, responseClone);

                });

                return networkResponse;

            })

            .catch(() => {

                return caches.match("./index.html");

            });

        })

    );

});