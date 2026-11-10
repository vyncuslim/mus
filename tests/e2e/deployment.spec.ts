import { expect, test } from "@playwright/test";
import { JSDOM } from "jsdom";
import { BRAND_ASSETS, BRAND_NAME } from "../../src/lib/brand";
import { resolveSiteUrl } from "../../src/lib/site-url";

function metadataDocument(html: string) {
  return new JSDOM(html).window.document;
}

test("deployment metadata uses the configured origin and dictionary APIs are available", async ({ request }) => {
  const origin = resolveSiteUrl();
  const home = await request.get("/");
  expect(home.status()).toBe(200);
  const document = metadataDocument(await home.text());
  expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(origin);
  expect(document.querySelector('link[rel="icon"][type="image/svg+xml"]')?.getAttribute("href")).toBe(BRAND_ASSETS.mark);
  expect(document.querySelector('link[rel="icon"][type="image/png"]')?.getAttribute("href")).toBe(BRAND_ASSETS.favicon32);
  expect(document.querySelector('link[rel="shortcut icon"]')?.getAttribute("href")).toBe(BRAND_ASSETS.favicon);
  expect(document.querySelector('link[rel="apple-touch-icon"]')?.getAttribute("href")).toBe(BRAND_ASSETS.apple);
  expect(document.querySelector('link[rel="mask-icon"]')?.getAttribute("href")).toBe(BRAND_ASSETS.safariPinned);

  const manifest = await request.get("/manifest.webmanifest");
  expect(manifest.status()).toBe(200);
  const manifestData = await manifest.json();
  expect(manifestData.name).toBe(BRAND_NAME);
  expect(manifestData.icons).toEqual(expect.arrayContaining([
    expect.objectContaining({ src: BRAND_ASSETS.mark, sizes: "any", purpose: "any" }),
    expect.objectContaining({ src: BRAND_ASSETS.icon192, sizes: "192x192", purpose: "any" }),
    expect.objectContaining({ src: BRAND_ASSETS.icon512, sizes: "512x512", purpose: "any" }),
    expect.objectContaining({ src: BRAND_ASSETS.maskable, sizes: "512x512", purpose: "maskable" }),
  ]));
  const currentAssets = Object.values(BRAND_ASSETS);
  for (const path of [...currentAssets, ...currentAssets.map((url) => url.replace("/hotlink-ok/", "/")), "/icon.svg", "/icon-192.png", "/icon-512.png", "/apple-touch-icon.png", "/favicon.ico"]) {
    expect((await request.get(path, { headers: { referer: "https://sharing.example/" } })).status(), `asset ${path}`).toBe(200);
  }

  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain(`Sitemap: ${origin}/sitemap.xml`);
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain(`<loc>${origin}</loc>`);

  const definition = await request.get("/api/definitions?q=%E6%B0%B4&limit=2");
  expect(definition.status()).toBe(200);
  expect((await definition.json()).groups.length).toBeGreaterThan(0);
  const world = await request.get("/api/world?q=water&limit=2");
  expect(world.status()).toBe(200);
  expect((await world.json()).matches.length).toBeGreaterThan(0);
  const health = await request.get("/api/health");
  expect((await health.json()).status).toBe("ok");
});

test("home, sources, word and missing-entry shares all use the same branded image", async ({ request }) => {
  const origin = resolveSiteUrl();
  for (const path of ["/", "/sources", "/word/ms/makanan", "/word/en/nonexistentwordxyz", "/word/unsupported/word"]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const document = metadataDocument(await response.text());
    const get = (selector: string) => document.querySelector(selector)?.getAttribute("content");
    expect(get('meta[property="og:site_name"]'), path).toBe(BRAND_NAME);
    expect(get('meta[property="og:image"]'), path).toBe(`${origin}${BRAND_ASSETS.social}`);
    expect(get('meta[property="og:image:width"]'), path).toBe("1200");
    expect(get('meta[property="og:image:height"]'), path).toBe("630");
    expect(get('meta[name="twitter:card"]'), path).toBe("summary_large_image");
    expect(get('meta[name="twitter:image"]'), path).toBe(`${origin}${BRAND_ASSETS.social}`);
    expect(get('meta[property="og:title"]'), path).not.toContain("Vynalth Lexicon");
  }
  const word = metadataDocument(await (await request.get("/word/ms/makanan")).text());
  expect(word.querySelector('meta[property="og:title"]')?.getAttribute("content")).toContain("makanan — Bahasa Melayu | Vynalth Dictionary");
  expect(word.querySelector('script[type="application/ld+json"]')?.textContent).toContain("Vynalth Dictionary (MS)");
  const social = await request.get(BRAND_ASSETS.social);
  expect(social.headers()["content-type"]).toContain("image/png");
  expect((await social.body()).subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
});
