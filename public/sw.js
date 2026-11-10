/* Cache the app shell and a small number of visited queries, not the full dictionary. */
const CACHE_NAME = "vynalth-dictionary-v5";
const MAX_RUNTIME_ENTRIES = 100;
const APP_ASSETS = [
  // Legacy URLs remain usable by existing installations.
  "/icon.svg", "/icon-192.png", "/icon-512.png", "/apple-touch-icon.png", "/favicon.ico",
  "/brand/v2/icon.svg", "/brand/v2/favicon.ico", "/brand/v2/favicon-32.png",
  "/brand/v2/apple-touch-icon.png", "/brand/v2/icon-192.png", "/brand/v2/icon-512.png",
  "/brand/v2/icon-maskable-512.png", "/brand/v2/safari-pinned-tab.svg", "/brand/v2/social-card.png",
  "/manifest.webmanifest",
];
const APP_SHELL = ["/", "/sources", ...APP_ASSETS];
const isDictionaryApi = (url) => ["/api/search", "/api/world", "/api/definitions", "/api/words/"].some((prefix) => url.pathname.startsWith(prefix));

self.addEventListener("install", (event) => event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())));

async function saveResponse(request, response) {
  const cache = await caches.open(CACHE_NAME); await cache.put(request, response);
  const keys = await cache.keys(), runtime = keys.filter((key) => { const url = new URL(key.url); return !APP_SHELL.includes(url.pathname + url.search); });
  if (runtime.length > MAX_RUNTIME_ENTRIES) await cache.delete(runtime[0]);
}

async function migrateAndRemoveOldCaches() {
  const oldNames = (await caches.keys()).filter((key) => key.startsWith("vynalth-") && key !== CACHE_NAME);
  const current = await caches.open(CACHE_NAME);
  for (const name of oldNames) {
    try {
      const previous = await caches.open(name);
      // Keep recent dictionary responses, but never copy stale pages or logos.
      const lookups = (await previous.keys()).filter((request) => {
        const url = new URL(request.url);
        return request.method === "GET" && url.origin === self.location.origin && isDictionaryApi(url);
      }).slice(-MAX_RUNTIME_ENTRIES);
      for (const request of lookups) {
        const response = await previous.match(request);
        if (response && !(await current.match(request))) await saveResponse(request, response);
      }
      await caches.delete(name);
    } catch (error) {
      // On quota/storage failure retain the old cache instead of discarding lookups.
      console.warn("Could not migrate an older dictionary cache", error);
    }
  }
}
self.addEventListener("activate", (event) => event.waitUntil(migrateAndRemoveOldCaches().then(() => self.clients.claim())));

self.addEventListener("fetch", (event) => {
  const request = event.request; if (request.method !== "GET") return;
  const url = new URL(request.url); if (url.origin !== self.location.origin) return;
  const isApi = isDictionaryApi(url);
  if (!(request.mode === "navigate" || isApi || url.pathname.startsWith("/_next/static/") || APP_ASSETS.includes(url.pathname))) return;
  event.respondWith((async () => {
    try { const response = await fetch(request); if (response.ok && response.type === "basic") await saveResponse(request, response.clone()); return response; }
    catch {
      const current = await caches.open(CACHE_NAME);
      // Prefer current assets; older caches are only a fallback for lookup data.
      const cached = await current.match(request) || (isApi ? await caches.match(request) : undefined);
      if (cached) return cached;
      if (request.mode === "navigate") return (await current.match("/")) || Response.error();
      if (isApi) return new Response(JSON.stringify({ error: "Not available offline", code: "OFFLINE" }), { status: 503, headers: { "Content-Type": "application/json" } });
      return Response.error();
    }
  })());
});
