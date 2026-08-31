const CACHE_NAME = 'saude-para-todos-v2';
const RECURSOS_CACHE = [
  './',
  './index.html',
  './privacidade.html',
  './style.min.css',
  './script.min.js',
  './manifest.json'
];

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(RECURSOS_CACHE))
  );
});

self.addEventListener('fetch', (evento) => {
  evento.respondWith(
    caches.match(evento.request).then((resposta) => resposta || fetch(evento.request))
  );
});