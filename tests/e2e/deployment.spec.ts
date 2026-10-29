import { expect, test } from "@playwright/test";
import { resolveSiteUrl } from "../../src/lib/site-url";

test("deployment metadata uses the configured origin and dictionary APIs are available", async ({ request }) => {
  const origin = resolveSiteUrl();
  const home = await request.get("/");
  expect(home.status()).toBe(200);
  expect(await home.text()).toContain(`<link rel="canonical" href="${origin}"`);

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
