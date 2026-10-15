const VERSION = "v27";
const APP_CACHE = `presto-shell-${VERSION}`;
const STATIC_CACHE = `presto-static-${VERSION}`;

const APP_SHELL = [
  "/",
  "/dashboard",
  "/login",
  "/register",
  "/presentacion",
  "/transferencias",
  "/creditos",
  "/inversiones",
  "/perfil",
];

// ¿Entorno local de desarrollo? localhost o rangos de red privada.
const DEV_HOST = self.location.hostname;
const IS_LOCALHOST =
  DEV_HOST === "localhost" ||
  DEV_HOST === "127.0.0.1" ||
  DEV_HOST === "::1" ||
  DEV_HOST.startsWith("192.168.") ||
  DEV_HOST.startsWith("10.") ||
  /^172\.(1[6-9]|2\d|3[01])\./.test(DEV_HOST);

// En desarrollo (localhost / 127.0.0.1) el Service Worker NO debe cachear: si lo
// hace, sirve chunks de /_next/static viejos y la app queda "cargando". En local
// se autodestruye (borra cachés, se desregistra y recarga la pestaña).
// En producción se comporta normalmente (PWA offline).
if (IS_LOCALHOST) {
  self.addEventListener("install", () => self.skipWaiting());

  self.addEventListener("activate", (event) => {
    event.waitUntil(
      (async () => {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
        await self.registration.unregister();
        const clients = await self.clients.matchAll({ type: "window" });
        for (const client of clients) client.navigate(client.url);
      })(),
    );
  });
} else {
  self.addEventListener("install", (event) => {
    event.waitUntil(
      caches
        .open(APP_CACHE)
        .then((cache) => cache.addAll(APP_SHELL))
        .then(() => self.skipWaiting()),
    );
  });

  self.addEventListener("activate", (event) => {
    event.waitUntil(
      caches
        .keys()
        .then((keys) =>
          Promise.all(
            keys
              .filter((key) => !key.includes(VERSION))
              .map((key) => caches.delete(key)),
          ),
        )
        .then(() => self.clients.claim()),
    );
  });

  self.addEventListener("fetch", (event) => {
    const { request } = event;
    if (request.method !== "GET") return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    if (request.mode === "navigate") {
      event.respondWith(
        fetch(request)
          .then((response) => {
            const copy = response.clone();
            caches.open(APP_CACHE).then((cache) => cache.put(request, copy));
            return response;
          })
          .catch(() =>
            caches.match(request).then((cached) => cached || caches.match("/dashboard")),
          ),
      );
      return;
    }

    if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/")) {
      event.respondWith(
        caches.open(STATIC_CACHE).then(async (cache) => {
          const cached = await cache.match(request);
          if (cached) return cached;
          const network = await fetch(request);
          cache.put(request, network.clone());
          return network;
        }),
      );
      return;
    }

    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(APP_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request)),
    );
  });
}
