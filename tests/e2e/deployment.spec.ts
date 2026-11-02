import { expect, test } from "@playwright/test";
import { resolveSiteUrl } from "../../src/lib/site-url";

test("deployment metadata uses the configured origin and dictionary APIs are available", async ({ request }) => {
  const origin = resolveSiteUrl();
  const home = await request.get("/");
  expect(home.status()).toBe(200);
  const html = await home.text();
  expect(html).toContain(`<link rel="canonical" href="${origin}"`);
  expect(html).toContain('rel="apple-touch-icon" href="/apple-touch-icon.png"');

  const manifest = await request.get("/manifest.webmanifest");
  expect(manifest.status()).toBe(200);
  expect((await manifest.json()).icons).toEqual(expect.arrayContaining([
    expect.objectContaining({ src: "/icon-192.png", sizes: "192x192" }),
    expect.objectContaining({ src: "/icon-512.png", sizes: "512x512" }),
  ]));
  for (const path of ["/icon.svg", "/icon-192.png", "/icon-512.png", "/apple-touch-icon.png"]) {
    expect((await request.get(path)).status()).toBe(200);
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
