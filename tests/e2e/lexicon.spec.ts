import { test, expect, type Page } from "@playwright/test";

async function blockWikimedia(page: Page) {
  await page.route("https://en.wiktionary.org/**", (route) => route.abort("failed"));
}
async function search(page: Page, query: string) {
  const input = page.getByTestId("search-input");
  await input.fill(query);
  await input.press("Enter");
  await expect(page.getByTestId("result-query")).toHaveText(query);
}

test.describe("Focused multilingual dictionary", () => {
  test("home is responsive, localized, and has no study or favorites navigation", async ({ page }, testInfo) => {
    await blockWikimedia(page);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await expect(page.getByTestId("hero-title")).toContainText("一个词");
    await expect(page.getByTestId("search-input")).toBeVisible();
    await expect(page.getByRole("link", { name: /favorites|收藏|learning|学习中心/i })).toHaveCount(0);
    await page.getByTestId("ui-locale-selector").selectOption("en");
    await expect(page.getByTestId("hero-title")).toContainText("One word");
    await page.getByTestId("ui-locale-selector").selectOption("ms");
    await expect(page.getByTestId("hero-title")).toContainText("Satu kata");
    await page.getByTestId("ui-locale-selector").selectOption("zh-Hans");
    await page.getByTestId("theme-toggle").click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    await page.getByTestId("theme-toggle").click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
    const sizes = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth: innerWidth }));
    expect(sizes.scrollWidth).toBeLessThanOrEqual(sizes.innerWidth + 1);
    if (testInfo.project.name === "desktop-1440x900" || testInfo.project.name === "mobile-390x844") await page.screenshot({ path: `test-results/home-${testInfo.project.name}.png` });
    expect(errors).toEqual([]);
  });

  test("curated Malay details keep morphology, provenance and clearly labeled speech", async ({ page }) => {
    await page.addInitScript(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: () => Promise.reject(new Error("denied")) } }));
    await blockWikimedia(page); await page.goto("/"); await search(page, "makanan");
    await expect(page.getByTestId("curated-matches")).toContainText("makanan");
    await page.getByTestId("curated-matches").getByRole("link", { name: "makanan", exact: true }).click();
    await expect(page.getByTestId("word-detail-headword")).toHaveText("makanan");
    await expect(page.getByTestId("malay-morphology-section")).toContainText("makan");
    await expect(page.getByTestId("word-provenance-card")).toContainText("CC BY-SA");
    await expect(page.getByTestId("tts-disclaimer")).toBeVisible();
    await page.getByTestId("copy-word-btn").click();
    await expect(page.getByRole("status")).toContainText("复制失败");
    await expect(page.getByTestId("word-detail-favorite-btn")).toHaveCount(0);
    await expect(page.getByTestId("toggle-ai-note-btn")).toHaveCount(0);
    await page.goto(`/word/ar/${encodeURIComponent("عِلْم")}`);
    await expect(page.getByTestId("word-detail-headword")).toHaveText("عِلْم");
    await page.goto(`/word/en/${encodeURIComponent("100%")}`);
    await expect(page.getByTestId("word-not-found-view")).toContainText("100%");
    const response = await page.request.get(`/api/words/en/${encodeURIComponent("100%")}`);
    expect(response.status()).toBe(404);
  });

  test("the local snapshot supplies real definitions across scripts without Wikimedia", async ({ page }) => {
    await blockWikimedia(page); await page.goto("/");
    await search(page, "encyclopedia");
    await expect(page.getByTestId("snapshot-definitions")).toContainText("reference work", { timeout: 15_000 });
    await search(page, "नमस्ते"); await expect(page.getByTestId("snapshot-definitions")).toContainText("greeting");
    await search(page, "こんにちは"); await expect(page.getByTestId("snapshot-definitions")).toContainText("hello");
    await search(page, "agua"); await expect(page.getByTestId("snapshot-definitions")).toContainText("water");
    await expect(page.getByText(/在线维基词典/).first()).toBeVisible();
  });

  test("translation equivalents are labeled separately and can be filtered by language", async ({ page }) => {
    await blockWikimedia(page); await page.goto("/"); await search(page, "苹果");
    const translations = page.getByTestId("world-translation-index");
    const sourceWords = page.getByTestId("source-word-equivalents");
    await expect(sourceWords).not.toHaveAttribute("open");
    await expect(sourceWords.locator("article").first()).toBeHidden();
    await sourceWords.locator("summary").click();
    await expect(sourceWords).toContainText("不代表已逐条人工核对");
    await expect(translations).toContainText("apple");
    await expect(translations).toContainText("并非完整释义");
    const filter = page.getByTestId("result-language-filter");
    await expect(filter).toBeVisible(); await filter.selectOption("zh-Hans");
    await expect(translations).toContainText("苹果");
    await search(page, "apple");
    await expect(page.getByTestId("world-translation-index")).toBeVisible();
    await expect(page.getByTestId("source-word-equivalents")).not.toHaveAttribute("open");
    await page.getByTestId("source-word-equivalents").locator("summary").click();
    await expect(page.getByTestId("world-translation-index").getByRole("link").first()).toHaveAttribute("href", /wiktionary\.org\/wiki\/apple/);
  });

  test("typos offer a verified suggestion rather than an invented definition", async ({ page }) => {
    await blockWikimedia(page); await page.goto("/"); await search(page, "mangikut");
    const empty = page.getByTestId("empty-search-state");
    await expect(empty).toBeVisible({ timeout: 15_000 });
    await empty.getByRole("button", { name: "mengikut" }).click();
    await expect(page.getByTestId("result-query")).toHaveText("mengikut");
    await expect(page.getByTestId("snapshot-definitions")).toContainText("active of ikut");
  });

  test("live Wiktionary content is rendered as text with source attribution", async ({ page }) => {
    await page.route("https://en.wiktionary.org/w/api.php?**", (route) => route.fulfill({ json: ["test", [], [], []] }));
    await page.route("https://en.wiktionary.org/api/rest_v1/page/definition/**", (route) => route.fulfill({ json: { en: [{ language: "English", partOfSpeech: "Noun", definitions: [{ definition: "A <b>fresh</b> meaning <script>bad()</script> &amp; example", parsedExamples: [{ example: "An <i>example</i>.", translation: "示例译文" }] }] }] } }));
    await page.goto("/"); await search(page, "exampleliveword");
    const definitions = page.getByTestId("world-definitions");
    await expect(definitions).toContainText("A fresh meaning & example");
    await expect(definitions).toContainText("An example.");
    await expect(definitions.getByText("示例译文")).toBeHidden();
    await definitions.getByText("词典例句译文（未经逐条核对）").click();
    await expect(definitions.getByText("示例译文")).toBeVisible();
    await expect(definitions).not.toContainText("bad()");
    await expect(definitions.getByRole("link").first()).toHaveAttribute("href", /en\.wiktionary\.org\/wiki\/exampleliveword/);
  });

  test("fast consecutive searches never replace the latest query or results", async ({ page }) => {
    await blockWikimedia(page);
    await page.route("**/api/definitions?**", async (route) => { const q = new URL(route.request().url()).searchParams.get("q"); if (q === "makanan") await new Promise((resolve) => setTimeout(resolve, 700)); await route.continue().catch(() => {}); });
    await page.goto("/"); const input = page.getByTestId("search-input");
    await input.fill("makanan"); await input.press("Enter"); await input.fill("kucing"); await input.press("Enter");
    await expect(page.getByTestId("result-query")).toHaveText("kucing");
    await expect(input).toHaveValue("kucing");
    await expect(page.getByTestId("snapshot-definitions")).toContainText("cat", { timeout: 15_000 });
    await page.waitForTimeout(1000);
    await expect(page.getByTestId("result-query")).toHaveText("kucing"); await expect(input).toHaveValue("kucing");
    await expect(page.getByTestId("snapshot-definitions")).not.toContainText("any solid substance");
  });

  test("sources, redirects, and browser history retain a dictionary-only experience", async ({ page }) => {
    await blockWikimedia(page); await page.goto("/sources");
    await expect(page.getByRole("heading", { name: "来源与许可" })).toBeVisible();
    await expect(page.getByText(/2,533,552/)).toBeVisible();
    await expect(page.getByRole("heading", { name: "人工审核的释义译文" })).toBeVisible();
    await expect(page.getByText(/目前共有 0 条/)).toBeVisible();
    await page.goto("/learn"); await expect(page).toHaveURL(/\/$/);
    await page.goto("/favorites"); await expect(page).toHaveURL(/\/$/);
    await search(page, "makanan"); await search(page, "kucing");
    await page.goBack(); await expect(page.getByTestId("result-query")).toHaveText("makanan");
    await expect(page.getByTestId("search-input")).toHaveValue("makanan");
    await page.goto("/word/en/nonexistentwordxyz");
    await expect(page.getByTestId("word-not-found-view")).toContainText("does not mean the word does not exist");
  });

  test("previously visited lookups work offline in a production build", async ({ page, context }) => {
    test.skip(process.env.TEST_OFFLINE !== "1", "Offline service-worker check runs against a production server");
    await blockWikimedia(page); await page.goto("/");
    await page.evaluate(async () => { await navigator.serviceWorker.ready; });
    await page.reload();
    await search(page, "encyclopedia");
    await expect(page.getByTestId("snapshot-definitions")).toContainText("reference work", { timeout: 15_000 });
    await page.reload();
    await expect(page.getByTestId("snapshot-definitions")).toContainText("reference work", { timeout: 15_000 });
    await context.setOffline(true);
    await page.reload();
    await expect(page.getByTestId("offline-banner")).toBeVisible();
    await expect(page.getByTestId("snapshot-definitions")).toContainText("reference work", { timeout: 15_000 });
    await context.setOffline(false);
  });
});
