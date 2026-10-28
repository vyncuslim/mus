import { test, expect, type Page, type Route } from "@playwright/test";

const cors = { "access-control-allow-origin": "*" };
async function search(page: Page, query: string) {
  await page.getByTestId("search-input").fill(query);
  await page.getByTestId("search-input").press("Enter");
  await expect(page.getByTestId("result-query")).toHaveText(query);
}
async function translated(route: Route) {
  const params = new URL(route.request().url()).searchParams, source = params.get("q") ?? "", target = params.get("langpair")?.split("|")[1];
  const result = target === "ms-MY" ? "Ini terjemahan bahasa Melayu." : target === "es-ES" ? "Esta es una traducción al español." : "这是自动翻译的中文释义。";
  await route.fulfill({ headers: cors, json: { responseStatus: 200, responseData: { translatedText: result, match: 0.85 }, matches: [{ segment: source, translation: result, reference: "Machine Translation.", "created-by": "MT!" }] } });
}

test.describe("Multilingual definition translations", () => {
  test("explicitly translates backup definitions into Chinese, Malay and Spanish without replacing the original", async ({ page }) => {
    await page.route("https://en.wiktionary.org/**", (route) => route.abort("failed"));
    let calls = 0;
    await page.route("https://api.mymemory.translated.net/**", async (route) => { calls++; await translated(route); });
    await page.goto("/"); await search(page, "encyclopedia");
    const definitions = page.getByTestId("snapshot-definitions"), select = page.getByTestId("definition-language-select");
    await expect(definitions).toContainText("reference work", { timeout: 15_000 });
    await expect(select).toHaveValue("zh-CN");
    expect(await select.locator("option").count()).toBeGreaterThanOrEqual(80);
    expect(calls).toBe(0);
    await page.getByTestId("translate-definitions-button").click();
    await expect(definitions.getByTestId("translated-definition").first()).toContainText("这是自动翻译的中文释义。");
    await expect(definitions).toContainText("reference work");
    await expect(definitions.getByTestId("translated-definition").first()).toContainText("自动翻译 · MyMemory");
    await select.selectOption("ms-MY");
    await expect(definitions.getByTestId("translated-definition")).toHaveCount(0);
    await page.getByTestId("translate-definitions-button").click();
    await expect(definitions.getByTestId("translated-definition").first()).toContainText("Ini terjemahan bahasa Melayu.");
    await select.selectOption("es-ES");
    await page.getByTestId("translate-definitions-button").click();
    await expect(definitions.getByTestId("translated-definition").first()).toContainText("Esta es una traducción al español.");
    const cachedCalls = calls;
    await select.selectOption("zh-CN");
    await expect(definitions.getByTestId("translated-definition").first()).toContainText("这是自动翻译的中文释义。");
    await select.selectOption("es-ES");
    await expect(definitions.getByTestId("translated-definition").first()).toContainText("Esta es una traducción al español.");
    expect(calls).toBe(cachedCalls);
    await page.reload();
    await expect(page.getByTestId("definition-language-select")).toHaveValue("es-ES");
  });

  test("translates in bounded batches, including additional visible senses", async ({ page }) => {
    await page.route("https://en.wiktionary.org/w/api.php?**", (route) => route.fulfill({ headers: cors, json: ["x", [], [], []] }));
    await page.route("https://en.wiktionary.org/api/rest_v1/page/definition/**", (route) => route.fulfill({ headers: cors, json: { en: [{ language: "English", partOfSpeech: "Noun", definitions: Array.from({ length: 12 }, (_, i) => ({ definition: `Definition number ${i + 1} about a fictional object.` })) }] } }));
    let calls = 0;
    await page.route("https://api.mymemory.translated.net/**", async (route) => { calls++; await translated(route); });
    await page.goto("/"); await search(page, "batch-test-unusual-word");
    await expect(page.getByTestId("world-definitions")).toContainText("Definition number 12");
    await page.getByTestId("translate-definitions-button").click();
    await expect(page.getByTestId("translated-definition")).toHaveCount(8);
    await expect(page.getByTestId("translate-definitions-button")).toHaveText("翻译更多");
    await page.getByTestId("translate-definitions-button").click();
    await expect(page.getByTestId("translated-definition")).toHaveCount(12);
    expect(calls).toBe(12);
  });

  test("quota and network errors are shown as errors, never as dictionary translations", async ({ page }) => {
    await page.route("https://en.wiktionary.org/**", (route) => route.abort("failed"));
    let requests = 0;
    await page.route("https://api.mymemory.translated.net/**", async (route) => { requests++; await route.fulfill({ headers: cors, json: { responseStatus: 200, quotaFinished: true, responseData: { translatedText: "MYMEMORY WARNING: YOU USED ALL AVAILABLE FREE TRANSLATIONS", match: 1 } } }); });
    await page.goto("/"); await search(page, "encyclopedia");
    await expect(page.getByTestId("snapshot-definitions")).toContainText("reference work", { timeout: 15_000 });
    await page.getByTestId("translate-definitions-button").click();
    await expect(page.getByTestId("definition-translation-error").first()).toContainText("翻译额度");
    await expect(page.getByTestId("translated-definition")).toHaveCount(0);
    await expect(page.getByTestId("snapshot-definitions")).not.toContainText("MYMEMORY WARNING");
    expect(requests).toBe(1);
    await expect(page.getByTestId("translate-definitions-button")).toHaveText("重试翻译");
    await page.unroute("https://api.mymemory.translated.net/**");
    await page.route("https://api.mymemory.translated.net/**", (route) => route.abort("failed"));
    await page.getByTestId("translate-definitions-button").click();
    await expect(page.getByTestId("definition-translation-error").first()).toContainText("无法连接翻译服务");
    await expect(page.getByTestId("translated-definition")).toHaveCount(0);
  });

  test("quota errors retry the blocked sense before attempting untouched ones", async ({ page }) => {
    await page.route("https://en.wiktionary.org/w/api.php?**", (route) => route.fulfill({ headers: cors, json: ["x", [], [], []] }));
    await page.route("https://en.wiktionary.org/api/rest_v1/page/definition/**", (route) => route.fulfill({ headers: cors, json: { en: [{ language: "English", partOfSpeech: "Noun", definitions: Array.from({ length: 12 }, (_, i) => ({ definition: `Definition number ${i + 1}.` })) }] } }));
    const requested: string[] = [];
    await page.route("https://api.mymemory.translated.net/**", async (route) => { requested.push(new URL(route.request().url()).searchParams.get("q") ?? ""); await route.fulfill({ headers: cors, json: { responseStatus: 200, quotaFinished: true } }); });
    await page.goto("/"); await search(page, "quota-test-unusual-word");
    await expect(page.getByTestId("world-definitions")).toContainText("Definition number 12.");
    await page.getByTestId("translate-definitions-button").click();
    await expect(page.getByTestId("translate-definitions-button")).toHaveText("重试翻译");
    await page.getByTestId("translate-definitions-button").click();
    await expect.poll(() => requested.length).toBe(2);
    expect(requested).toEqual(["Definition number 1.", "Definition number 1."]);
  });

  test("the stop button cancels pending translations and permits a new attempt", async ({ page }) => {
    await page.route("https://en.wiktionary.org/**", (route) => route.abort("failed"));
    let calls = 0;
    await page.route("https://api.mymemory.translated.net/**", async (route) => { calls++; if (calls === 1) await new Promise((resolve) => setTimeout(resolve, 1000)); await translated(route).catch(() => {}); });
    await page.goto("/"); await search(page, "encyclopedia");
    await expect(page.getByTestId("snapshot-definitions")).toContainText("reference work", { timeout: 15_000 });
    await page.getByTestId("translate-definitions-button").click();
    await expect(page.getByTestId("definition-translation-progress")).toBeVisible();
    await expect.poll(() => calls).toBe(1);
    await page.getByTestId("stop-definition-translation").click();
    await expect(page.getByTestId("definition-translation-progress")).toHaveCount(0);
    await expect(page.getByTestId("translated-definition")).toHaveCount(0);
    await page.getByTestId("translate-definitions-button").click();
    await expect(page.getByTestId("translated-definition").first()).toBeVisible();
    expect(calls).toBeGreaterThanOrEqual(2);
  });

  test("changing searches aborts a pending translation and detail pages offer the same language choice", async ({ page }) => {
    await page.route("https://en.wiktionary.org/**", (route) => route.abort("failed"));
    await page.route("https://api.mymemory.translated.net/**", async (route) => { await new Promise((resolve) => setTimeout(resolve, 1000)); await translated(route).catch(() => {}); });
    await page.goto("/"); await search(page, "encyclopedia");
    await expect(page.getByTestId("snapshot-definitions")).toContainText("reference work", { timeout: 15_000 });
    await page.getByTestId("translate-definitions-button").click();
    await expect(page.getByTestId("definition-translation-progress")).toBeVisible();
    await search(page, "agua"); await expect(page.getByTestId("snapshot-definitions")).toContainText("water");
    await page.waitForTimeout(1200);
    await expect(page.getByTestId("translated-definition")).toHaveCount(0);
    await page.goto("/word/en/serendipity");
    await expect(page.getByTestId("word-detail-headword")).toHaveText("serendipity");
    await page.getByTestId("definition-language-select").selectOption("es-ES");
    const sense = page.getByTestId("word-sense-1");
    await expect(sense).toContainText("The occurrence and development of events by chance");
    await page.getByTestId("translate-definitions-button").click();
    await expect(sense.getByTestId("translated-definition")).toContainText("Esta es una traducción al español.", { timeout: 15_000 });
    await expect(sense).toContainText("The occurrence and development of events by chance");
    await page.getByTestId("definition-language-select").selectOption("zh-CN");
    await expect(sense).toContainText("词典原有释义 · 英文原文");
    await expect(sense.getByTestId("translated-definition")).toHaveCount(0);
    await expect(page.getByTestId("translate-definitions-button")).toHaveText("无需翻译");
  });
});
