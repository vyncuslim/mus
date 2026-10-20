import { describe, expect, it } from "vitest";
import { executeLexiconSearch } from "@/lib/search-engine";

describe("executeLexiconSearch — Core Multilingual Search Engine", () => {
  it("ranks exact Malay headword match highest and links morphological family", () => {
    const res = executeLexiconSearch({
      query: "makanan",
      sourceLanguage: "ms",
      targetLanguage: "en",
    });

    expect(res.exactMatches.length).toBeGreaterThanOrEqual(1);
    expect(res.exactMatches[0].entry.headword).toBe("makanan");
    expect(res.exactMatches[0].entry.malayMorphology?.kataDasar).toBe("makan");
    expect(res.prefixMatches.some((m) => m.entry.headword === "makan")).toBe(
      true
    );
    expect(res.latencyMs).toBeGreaterThanOrEqual(0);
  });

  it("supports English exact search and sense-aligned Malay translations", () => {
    const res = executeLexiconSearch({
      query: "serendipity",
      sourceLanguage: "en",
      targetLanguage: "ms",
    });

    expect(res.exactMatches).toHaveLength(1);
    expect(res.exactMatches[0].entry.headword).toBe("serendipity");
    expect(
      res.exactMatches[0].targetTranslations.some(
        (tr) => tr.language === "ms" && tr.terms.length > 0
      )
    ).toBe(true);
  });

  it("supports Simplified Chinese Hanzi and Pinyin search", () => {
    const byHanzi = executeLexiconSearch({
      query: "学习",
      sourceLanguage: "zh-Hans",
    });
    expect(byHanzi.exactMatches).toHaveLength(1);
    expect(byHanzi.exactMatches[0].entry.headword).toBe("学习");

    const byPinyin = executeLexiconSearch({
      query: "xuexi",
      sourceLanguage: "zh-Hans",
    });
    expect(byPinyin.exactMatches).toHaveLength(1);
    expect(byPinyin.exactMatches[0].entry.headword).toBe("学习");
  });

  it("supports diacritic-insensitive search for French, Spanish, German, and Arabic", () => {
    const french = executeLexiconSearch({ query: "cafe", sourceLanguage: "fr" });
    expect(french.exactMatches[0]?.entry.headword).toBe("café");

    const spanish = executeLexiconSearch({
      query: "espanol",
      sourceLanguage: "es",
    });
    expect(spanish.exactMatches[0]?.entry.headword).toBe("español");

    const german = executeLexiconSearch({
      query: "worterbuch",
      sourceLanguage: "de",
    });
    expect(german.exactMatches[0]?.entry.headword).toBe("Wörterbuch");

    const arabic = executeLexiconSearch({ query: "علم", sourceLanguage: "ar" });
    expect(arabic.exactMatches[0]?.entry.headword).toBe("عِلْم");
  });

  it("provides typo-tolerant suggestions without manufacturing fake dictionary entries", () => {
    const typo = executeLexiconSearch({
      query: "serendipiti",
      sourceLanguage: "en",
    });

    expect(typo.exactMatches).toHaveLength(0);
    expect(typo.suggestions.some((s) => s.word === "serendipity")).toBe(true);

    const nonexistent = executeLexiconSearch({
      query: "zzzznonexistentword12345",
      sourceLanguage: "all",
    });
    expect(nonexistent.totalResults).toBe(0);
    expect(nonexistent.suggestions).toHaveLength(0);
  });
});
