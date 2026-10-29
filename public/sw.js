/* Cache the app shell and a small number of visited queries, not the full dictionary. */
const CACHE_NAME = "vynalth-dictionary-v3";
const MAX_RUNTIME_ENTRIES = 100;
const APP_SHELL = ["/", "/sources", "/icon.svg", "/manifest.webmanifest"];
self.addEventListener("install", (event) => event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())));
self.addEventListener("activate", (event) => event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith("vynalth-") && key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim())));
async function saveResponse(request, response) {
  const cache = await caches.open(CACHE_NAME); await cache.put(request, response);
  const keys = await cache.keys(), runtime = keys.filter((key) => { const url = new URL(key.url); return !APP_SHELL.includes(url.pathname + url.search); });
  if (runtime.length > MAX_RUNTIME_ENTRIES) await cache.delete(runtime[0]);
}
self.addEventListener("fetch", (event) => {
  const request = event.request; if (request.method !== "GET") return;
  const url = new URL(request.url); if (url.origin !== self.location.origin) return;
  const isApi = ["/api/search", "/api/world", "/api/definitions", "/api/words/"].some((prefix) => url.pathname.startsWith(prefix));
  if (!(request.mode === "navigate" || isApi || url.pathname.startsWith("/_next/static/") || url.pathname === "/icon.svg" || url.pathname === "/manifest.webmanifest")) return;
  event.respondWith((async () => {
    try { const response = await fetch(request); if (response.ok && response.type === "basic") await saveResponse(request, response.clone()); return response; }
    catch { const cached = await caches.match(request); if (cached) return cached; if (request.mode === "navigate") return (await caches.match("/")) || Response.error(); if (isApi) return new Response(JSON.stringify({ error: "Not available offline", code: "OFFLINE" }), { status: 503, headers: { "Content-Type": "application/json" } }); return Response.error(); }
  })());
});
