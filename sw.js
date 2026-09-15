const CACHE_NAME = 'v2'; // <--- Cambia la versión en cada actualización

self.addEventListener('install', (event) => {
    // Forza al nuevo Service Worker a activarse sin esperar a que se cierren las ventanas
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache); // Elimina archivos de la versión anterior
                    }
                })
            );
        }).then(() => self.clients.claim()) // Toma el control de la app inmediatamente
    );
});

self.addEventListener('fetch', (event) => {
    // Filtro para ignorar IPs externas/routers
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => response || fetch(event.request))
    );
});