const CACHE_NAME = "sena-formacion-v1.0.0"
const urlsToCache = [
  "/",
  "/static/js/bundle.js",
  "/static/css/main.css",
  "/assets/sena-logo-192.png",
  "/assets/sena-logo-512.png",
  "/manifest.json",
]

// Instalación del Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache abierto")
      return cache.addAll(urlsToCache)
    }),
  )
})

// Activación del Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Eliminando cache antiguo:", cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})

// Interceptar peticiones de red
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Devolver desde cache si existe
      if (response) {
        return response
      }

      // Clonar la petición
      const fetchRequest = event.request.clone()

      return fetch(fetchRequest)
        .then((response) => {
          // Verificar si es una respuesta válida
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // Clonar la respuesta
          const responseToCache = response.clone()

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
        .catch(() => {
          // Fallback para páginas offline
          if (event.request.destination === "document") {
            return caches.match("/")
          }
        })
    }),
  )
})

// Manejo de notificaciones push
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "Nueva notificación del SENA",
    icon: "/assets/sena-logo-192.png",
    badge: "/assets/sena-logo-192.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "Ver detalles",
        icon: "/assets/sena-logo-192.png",
      },
      {
        action: "close",
        title: "Cerrar",
        icon: "/assets/sena-logo-192.png",
      },
    ],
  }

  event.waitUntil(self.registration.showNotification("SENA - Formación Complementaria", options))
})

// Manejo de clicks en notificaciones
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"))
  }
})
