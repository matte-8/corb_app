const CACHE_NAME = "corbiolo-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/css/style.css",
  "/manifest.json",
  "/img/logo.png",
  "/img/logo2.png",
  "/img/sponsor1.png",
  "/img/sponsor2.png",
  "/img/sponsor3.png",
  "/js/home.js",
  "/js/news.js",
  "/js/partite.js",
  "/js/squadra.js",
  "/js/sponsor.js",
  "/js/calendario.js",
  "/js/service-worker.js",
  "/admin.html",
  "/js/install.js",
  "/js/admin.js"
  // Aggiungi eventualmente anche icone, fonts, o altre immagini
];

// INSTALLAZIONE – cache iniziale
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting(); // attiva subito
});

// ATTIVAZIONE – pulizia cache vecchie
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim(); // controlla subito tutte le pagine
});

// FETCH – risposte offline
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request).catch(() => {
        // Eventualmente puoi mostrare un fallback per immagini o html
        if (event.request.destination === "image") {
          return caches.match("/img/logo.png");
        }
        return new Response("Offline", { status: 503, statusText: "Offline" });
      });
    })
  );
});
