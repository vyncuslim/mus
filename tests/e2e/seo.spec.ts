import { expect, test } from "@playwright/test";
import { JSDOM } from "jsdom";
import { BRAND_ASSETS, BRAND_NAME } from "../../src/lib/brand";
import { ENTRY_INDEX_LIMIT } from "../../src/lib/entry-index";
import { resolveSiteUrl } from "../../src/lib/site-url";

const origin = resolveSiteUrl();
const parse = (html: string) => new JSDOM(html).window.document;
const content = (document: Document, selector: string) => document.querySelector(selector)?.getAttribute("content");
const canonical = (document: Document) => document.querySelector('link[rel="canonical"]')?.getAttribute("href");
const jsonLd = (document: Document) => [...document.querySelectorAll('script[type="application/ld+json"]')].map((item) => JSON.parse(item.textContent || "null"));
const crawler = { "user-agent": "Googlebot" };

test("raw HTML exposes the homepage, correct share metadata and crawlable noindex searches", async ({ request }) => {
  const homeResponse = await request.get("/", { headers: crawler });
  expect(homeResponse.status()).toBe(200);
  const home = parse(await homeResponse.text());
  expect(home.querySelector("main h1")?.textContent).toContain("一个词");
  expect(home.querySelector('a[href="/entries"]')).not.toBeNull();
  expect(canonical(home)).toBe(origin);
  expect(content(home, 'meta[name="description"]')).toContain("马来语");
  expect(content(home, 'meta[property="og:url"]')).toBe(origin);
  expect(content(home, 'meta[property="og:image"]')).toBe(`${origin}${BRAND_ASSETS.social}`);
  expect(jsonLd(home)).toContainEqual(expect.objectContaining({ "@type": "WebSite", name: BRAND_NAME, url: origin }));
  expect(home.documentElement.getAttribute("lang")).toBe("zh-Hans");

  const tracking = parse(await (await request.get("/?utm_source=example", { headers: crawler })).text());
  expect(canonical(tracking)).toBe(origin);
  const search = parse(await (await request.get("/?q=makanan", { headers: crawler })).text());
  expect(content(search, 'meta[name="robots"]')).toContain("noindex");
  expect(content(search, 'meta[name="robots"]')).toContain("follow");
  expect(canonical(search)).toBeUndefined();
  expect(jsonLd(search)).toHaveLength(0);
  expect(search.querySelector('[data-testid="result-query"]')?.textContent).toBe("makanan");
  const emptySearch = parse(await (await request.get("/?q=%20", { headers: crawler })).text());
  expect(canonical(emptySearch)).toBe(origin);
  expect(content(emptySearch, 'meta[name="robots"]') ?? "").not.toContain("noindex");

  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Allow: /");
  expect(robots).not.toMatch(/Disallow:\s*\/\?q=/i);
  expect(robots).toContain(`Sitemap: ${origin}/sitemap.xml`);
});

test("every sitemap URL is a unique, indexable canonical page without redirects", async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440x900", "HTTP crawl is independent of viewport");
  const response = await request.get("/sitemap.xml", { headers: crawler });
  expect(response.status()).toBe(200);
  const xml = new JSDOM(await response.text(), { contentType: "text/xml" }).window.document;
  const urls = [...xml.querySelectorAll("loc")].map((node) => node.textContent!);
  expect(urls.length).toBeGreaterThan(3);
  expect(urls.length).toBeLessThanOrEqual(ENTRY_INDEX_LIMIT + 3);
  expect(new Set(urls).size).toBe(urls.length);
  expect(urls).toContain(origin);
  expect(urls).toContain(`${origin}/entries`);
  expect(urls).toContain(`${origin}/sources`);

  for (const url of urls) {
    const parsed = new URL(url);
    expect(parsed.origin, url).toBe(origin);
    expect(parsed.search, url).toBe("");
    const page = await request.get(parsed.pathname, { headers: crawler, maxRedirects: 0 });
    expect(page.status(), url).toBe(200);
    const document = parse(await page.text());
    expect(document.querySelector("main h1"), url).not.toBeNull();
    expect(canonical(document), url).toBe(url);
    expect(content(document, 'meta[name="robots"]') ?? "", url).not.toContain("noindex");
    expect(document.querySelectorAll('link[rel="alternate"][hreflang]').length, url).toBe(0);
    if (parsed.pathname.startsWith("/word/")) {
      const graph = jsonLd(document).flatMap((item) => item["@graph"] ?? []);
      const term = graph.find((item: { "@type": string }) => item["@type"] === "DefinedTerm");
      const crumbs = graph.find((item: { "@type": string }) => item["@type"] === "BreadcrumbList");
      expect(term?.url, url).toBe(url);
      expect(term?.description, url).toBeTruthy();
      expect(term?.inDefinedTermSet.url, url).toBe(`${origin}/entries`);
      expect(crumbs?.itemListElement.map((item: { item: string }) => item.item), url).toEqual([origin, `${origin}/entries`, url]);
    }
  }
});

test("homepage, entry index and word details work as HTML without JavaScript", async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440x900", "No-JavaScript crawl is independent of viewport");
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /一个词/ })).toBeVisible();
    await page.getByRole("link", { name: "词条索引" }).click();
    await expect(page.getByRole("heading", { name: "词条索引" })).toBeVisible();
    await page.getByRole("link", { name: /makanan/ }).first().click();
    await expect(page.getByTestId("word-detail-headword")).toHaveText("makanan");
    await expect(page.getByTestId("word-provenance-card")).toBeVisible();
  } finally {
    await context.close();
  }
});

test("word, sources and missing pages have accurate individual metadata", async ({ request }) => {
  const word = parse(await (await request.get("/word/ms/Makanan", { headers: crawler })).text());
  expect(canonical(word)).toBe(`${origin}/word/ms/makanan`);
  expect(content(word, 'meta[name="description"]')).toContain("makanan");
  expect(content(word, 'meta[name="description"]')).not.toContain("CC BY-SA 4.0");
  expect(content(word, 'meta[property="og:url"]')).toBe(`${origin}/word/ms/makanan`);
  expect(word.querySelector('h1[lang="ms"]')?.textContent).toBe("makanan");
  const sources = parse(await (await request.get("/sources", { headers: crawler })).text());
  expect(canonical(sources)).toBe(`${origin}/sources`);
  expect(content(sources, 'meta[property="og:url"]')).toBe(`${origin}/sources`);
  expect(content(sources, 'meta[property="og:title"]')).toContain("Sources & Licence");
  for (const path of ["/word/en/nonexistentwordxyz", "/word/unsupported/word"]) {
    const response = await request.get(path, { headers: crawler });
    expect(response.status(), path).toBe(404);
    const document = parse(await response.text());
    expect(content(document, 'meta[name="robots"]'), path).toContain("noindex");
    expect(canonical(document), path).toBeUndefined();
    expect(jsonLd(document), path).toHaveLength(0);
  }
});

test("the entry index is responsive, navigable and switches interface language", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "词条索引" }).click();
  await expect(page).toHaveURL(/\/entries$/);
  await expect(page.getByRole("heading", { name: "词条索引" })).toBeVisible();
  await expect(page.getByTestId("entry-index").getByText(/部分有独立详情页/)).toBeVisible();
  const dimensions = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: innerWidth }));
  expect(dimensions.width).toBeLessThanOrEqual(dimensions.viewport + 1);
  await page.getByTestId("ui-locale-selector").selectOption("en");
  await expect(page.getByRole("heading", { name: "Dictionary entries" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.getByRole("link", { name: /makanan/ }).first().click();
  await expect(page.getByTestId("word-detail-headword")).toHaveText("makanan");
  await expect(page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: "Dictionary entries" })).toBeVisible();
});

test("a missing Malay entry still offers explicitly tentative rule analysis", async ({ page }) => {
  const response = await page.goto("/word/ms/menyatukan");
  expect(response?.status()).toBe(404);
  await expect(page.getByTestId("word-not-found-view")).toContainText("Possible Malay root (rule-based)");
  await expect(page.getByTestId("word-not-found-view")).toContainText("not confirmation");
  await expect(page.getByTestId("word-not-found-view")).toContainText("satu");
  await page.getByRole("link", { name: /Inspect Kata Dasar: satu/ }).click();
  await expect(page).toHaveURL(/\/word\/ms\/satu$/);
  await expect(page.getByTestId("word-not-found-view")).toContainText("No structured entry for “satu”");
  await page.goto("/word/en/%25C3%25A9");
  await expect(page.getByTestId("word-not-found-view")).toContainText("%C3%A9");
});
