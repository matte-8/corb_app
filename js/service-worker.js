// service-worker.js

const CACHE_NAME = "corbiolo-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/css/style.css",
  "/manifest.json",
  "/img/logo.png",
  "/img/logo2.png",
  "/js/home.js",
  "/js/news.js",
  "/js/partite.js",
  "/js/squadra.js",
  "/js/sponsor.js",
  "/js/calendario.js"
  // Aggiungi qui altre risorse se necessario
];

// Installa e pre-cachizza
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Attivazione e pulizia cache vecchie
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
});

// Intercetta le richieste
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    )
  );
});
