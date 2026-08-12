/* ===========================================
   ContractKeeper Service Worker
   Version: 0.1.0
   Build: 1
=========================================== */

const CACHE_NAME = "contractkeeper-0.1.0-build3";

const STATIC_FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json",
    "./version.json",

    "./assets/logo.png",
    "./assets/icon-192.png",
    "./assets/icon-512.png"
];

/* ===========================================
   Install
=========================================== */

self.addEventListener("install", event => {

    console.log("📦 Service Worker installeren...");

    self.skipWaiting();

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => {

                console.log("📦 Bestanden cachen");

                return cache.addAll(STATIC_FILES);

            })

    );

});

/* ===========================================
   Activate
=========================================== */

self.addEventListener("activate", event => {

    console.log("✅ Service Worker actief");

    event.waitUntil(

        caches.keys().then(cacheNames => {

            return Promise.all(

                cacheNames.map(cache => {

                    if (cache !== CACHE_NAME) {

                        console.log("🗑 Oude cache verwijderd:", cache);

                        return caches.delete(cache);

                    }

                })

            );

        })

    );

    self.clients.claim();

});

/* ===========================================
   Fetch
=========================================== */

self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") return;

    event.respondWith(

        fetch(event.request)

            .then(networkResponse => {

                const responseClone = networkResponse.clone();

                caches.open(CACHE_NAME)
                    .then(cache => {

                        cache.put(event.request, responseClone);

                    });

                return networkResponse;

            })

            .catch(() => {

                return caches.match(event.request);

            })

    );

});

/* ===========================================
   Messages
=========================================== */

self.addEventListener("message", event => {

    if (event.data === "SKIP_WAITING") {

        self.skipWaiting();

    }

});
