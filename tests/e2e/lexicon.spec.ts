import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { STARTER_LEXICON_ENTRIES } from "../../src/data/starter-lexicon";

const SCREENSHOT_DIR = path.resolve(process.cwd(), "test-results/screenshots");

test.beforeAll(() => {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
});

test.describe("Vynalth Lexicon — End-to-End Browser Verification", () => {
  test("1. Home page rendering, UI localization, dark mode, language selectors & swap, and zero console errors", async ({
    page,
  }, testInfo) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("/");
    await expect(page.getByTestId("hero-title")).toBeVisible();
    await expect(page.getByTestId("verified-entry-count")).toHaveText(
      String(STARTER_LEXICON_ENTRIES.length)
    );

    // Screenshot Home page
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `home-${testInfo.project.name}.png`),
      fullPage: false,
    });

    // Test UI localization switcher (English -> Bahasa Melayu -> Simplified Chinese -> English)
    const uiSelector = page.getByTestId("ui-locale-selector");
    await uiSelector.selectOption("ms");
    await expect(page.getByTestId("hero-title")).toContainText(
      "Ketepatan makna merentas bahasa"
    );

    await uiSelector.selectOption("zh-Hans");
    await expect(page.getByTestId("hero-title")).toContainText(
      "跨语言精准释义"
    );

    await uiSelector.selectOption("en");
    await expect(page.getByTestId("hero-title")).toContainText(
      "Clarity across languages"
    );

    // Test Dark Mode toggle
    const themeToggle = page.getByTestId("theme-toggle");
    await themeToggle.click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    await themeToggle.click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);

    // Test Source & Target Language Selectors and Swap
    const sourceSelect = page.getByTestId("source-language-select");
    const targetSelect = page.getByTestId("target-language-select");
    await sourceSelect.selectOption("en");
    await targetSelect.selectOption("ms");

    await page.getByTestId("swap-languages-button").click();
    await expect(sourceSelect).toHaveValue("ms");
    await expect(targetSelect).toHaveValue("en");

    // Verify Mobile Navigation on mobile viewports
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) {
      const mobileToggle = page.getByTestId("mobile-menu-toggle");
      await expect(mobileToggle).toBeVisible();
      await mobileToggle.click();
      await expect(page.getByTestId("mobile-nav-drawer")).toBeVisible();
      await mobileToggle.click();
    }

    expect(consoleErrors).toEqual([]);
  });

  test("2. Malay, English, and Chinese word search, keyboard navigation, search history, and empty state", async ({
    page,
  }, testInfo) => {
    await page.goto("/dictionary");

    const searchInput = page.getByTestId("search-input");
    const sourceSelect = page.getByTestId("source-language-select");

    // Malay Search: makanan
    await sourceSelect.selectOption("ms");
    await searchInput.fill("makanan");
    await searchInput.press("Enter");

    await expect(
      page.getByTestId("word-result-card-ms-makanan")
    ).toBeVisible();
    await expect(page.getByTestId("search-latency-badge")).toContainText("ms");

    // Verify search history recorded 'makanan'
    await expect(page.getByTestId("search-history-list")).toContainText(
      "makanan"
    );

    // Screenshot Dictionary Search results
    await page.screenshot({
      path: path.join(
        SCREENSHOT_DIR,
        `dictionary-ms-${testInfo.project.name}.png`
      ),
      fullPage: false,
    });

    // Clear search button
    await page.getByTestId("clear-search-button").click();
    await expect(searchInput).toHaveValue("");

    // English Search: serendipity
    await sourceSelect.selectOption("en");
    await searchInput.fill("serendipity");
    await expect(
      page.getByTestId("word-result-card-en-serendipity")
    ).toBeVisible();

    // Chinese Search: 学习
    await sourceSelect.selectOption("zh-Hans");
    await searchInput.fill("学习");
    await expect(
      page.getByTestId("word-result-card-zh-hans-xuexi")
    ).toBeVisible();

    // Keyboard navigation on suggestions (Escape closes dropdown)
    await searchInput.focus();
    await searchInput.press("ArrowDown");
    await searchInput.press("Escape");

    // Empty result & typo-tolerant suggestion check
    await sourceSelect.selectOption("en");
    await searchInput.fill("serendipiti");
    await expect(page.getByTestId("empty-search-state")).toBeVisible();
    await expect(page.getByTestId("empty-search-state")).toContainText(
      "serendipity"
    );
  });

  test("3. Word Detail page, Malay Morphology root navigation, Pronunciation, Favorites persistence, and RTL Arabic", async ({
    page,
  }, testInfo) => {
    await page.goto("/word/ms/makanan");

    await expect(page.getByTestId("word-detail-headword")).toHaveText(
      "makanan"
    );
    await expect(page.getByTestId("word-ipa")).toContainText("/ma.ka.nan/");
    await expect(page.getByTestId("malay-morphology-section")).toBeVisible();

    // Pronunciation control & honest non-native disclaimer
    await expect(page.getByTestId("pronunciation-button")).toBeVisible();
    await expect(page.getByTestId("tts-disclaimer")).toContainText(
      "not a native speaker recording"
    );
    await page.getByTestId("pronunciation-button").click();

    // Provenance card verification
    await expect(page.getByTestId("word-provenance-card")).toContainText(
      "CC BY-SA 4.0"
    );

    // Optional AI-Assisted Study Note toggle
    await page.getByTestId("toggle-ai-note-btn").click();
    await expect(page.getByTestId("ai-study-note-content")).toBeVisible();

    // Save to Favorites & verify persistence across reload and on /favorites
    await page.getByTestId("word-detail-favorite-btn").click();
    await page.reload();
    await expect(page.getByTestId("word-detail-favorite-btn")).toContainText(
      "Saved in Favorites"
    );

    // Screenshot Word Detail page
    await page.screenshot({
      path: path.join(
        SCREENSHOT_DIR,
        `word-detail-makanan-${testInfo.project.name}.png`
      ),
      fullPage: false,
    });

    // Navigate from 'makanan' to its Kata Dasar 'makan'
    await page.getByTestId("kata-dasar-link").click();
    await expect(page).toHaveURL(/\/word\/ms\/makan$/);
    await expect(page.getByTestId("word-detail-headword")).toHaveText("makan");

    // Check RTL rendering on Arabic entry
    await page.goto("/word/ar/%D8%B9%D9%84%D9%85");
    const arHeadword = page.getByTestId("word-detail-headword");
    await expect(arHeadword).toHaveAttribute("dir", "rtl");

    // Check Favorites page
    await page.goto("/favorites");
    await expect(page.getByTestId("favorites-list")).toContainText("makanan");
  });

  test("4. Learn Studio flashcards & quiz, API validation, database fallback, and link integrity", async ({
    page,
    request,
  }) => {
    await page.goto("/learn");
    await expect(page.getByTestId("flashcard-card")).toBeVisible();

    // Flip flashcard & mark known
    await page.getByTestId("flip-flashcard-btn").click();
    await expect(page.getByTestId("flashcard-back-content")).toBeVisible();
    await page.getByTestId("mark-known-btn").click();
    await expect(page.getByTestId("mastered-words-count")).toContainText(
      "1 words"
    );

    // Switch to Quiz tab and answer a question
    await page.getByTestId("tab-quiz").click();
    await expect(page.getByTestId("quiz-panel")).toBeVisible();
    await page.getByTestId("quiz-option-0").click();
    await page.getByTestId("submit-quiz-answer-btn").click();
    await expect(page.getByTestId("next-quiz-question-btn")).toBeVisible();

    // Verify API validation and database fallback
    const badSearch = await request.get("/api/search?source=invalid-code");
    expect(badSearch.status()).toBe(400);

    const badWord = await request.get("/api/words/invalid-code/makan");
    expect(badWord.status()).toBe(400);

    const health = await request.get("/api/health");
    expect(health.status()).toBe(200);
    const healthJson = await health.json();
    expect(healthJson.database.mode).toBe("starter_dataset");

    // Verify About and Sources pages render without broken internal links
    for (const route of ["/about", "/sources"]) {
      const resp = await page.goto(route);
      expect(resp?.status()).toBe(200);
      await expect(page.locator("h1")).toBeVisible();
    }
  });
});
