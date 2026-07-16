// 캘린더봄 구형 scope에서 자기 legacy cache만 정리하고 새 독립 주소로 연결한다.
const BRIDGE_CACHE = "calendarbom-legacy-bridge-v1";
const LEGACY_CACHE_PREFIX = "calendarbom-v";
const DESTINATION = "https://robom-labs.github.io/calendarbom/";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(BRIDGE_CACHE).then((cache) => cache.add("./")));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith(LEGACY_CACHE_PREFIX)).map((key) => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || event.request.mode !== "navigate") return;
  event.respondWith(fetch(event.request).catch(() => caches.match("./")));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow(DESTINATION));
});
