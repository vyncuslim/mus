import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { searchDefinitionIndex } from "@/lib/definition-index";
import { searchWorldIndex } from "@/lib/world-index";
import { cleanDictionaryText, parseWiktionaryDefinitions } from "@/lib/world-definitions";
import { GET as definitions } from "@/app/api/definitions/route";
import { GET as world } from "@/app/api/world/route";

describe("bundled Wiktionary sources", () => {
  it("looks up real multilingual definitions outside the starter set and reports snapshot coverage", async () => {
    const [spanish, japanese, hindi, english] = await Promise.all([searchDefinitionIndex("agua"), searchDefinitionIndex("こんにちは"), searchDefinitionIndex("नमस्ते"), searchDefinitionIndex("encyclopedia")]);
    expect(spanish.groups.some((g) => g.languageCode === "es" && g.senses.some((s) => /water/i.test(s.definition)))).toBe(true);
    expect(japanese.groups.some((g) => g.languageCode === "ja" && g.senses.length > 0)).toBe(true);
    expect(hindi.groups.some((g) => g.languageCode === "hi" && g.senses.length > 0)).toBe(true);
    expect(english.groups.some((g) => g.languageCode === "en" && g.senses.length > 0)).toBe(true);
    expect(spanish.coverage).toEqual({ languageCategories: 342, entries: 2533552, snapshotDate: "2023-05-19" });
  }, 20_000);
  it("finds the separately verified Malay seed and suggests it for a typo without fabricating a root", async () => {
    const found = await searchDefinitionIndex("mengikut"), typo = await searchDefinitionIndex("mangikut");
    expect(found.groups.some((g) => g.languageCode === "ms" && g.headword === "mengikut" && g.senses[0].definition === "active of ikut")).toBe(true);
    expect(typo.groups).toHaveLength(0);
    expect(typo.suggestions).toContain("mengikut");
  });
  it("provides translations as pairs with real attribution and counts", async () => {
    const chinese = await searchWorldIndex("苹果"), english = await searchWorldIndex("apple", "all", 200);
    expect(chinese.matches).toContainEqual(expect.objectContaining({ word: "苹果", english: "apple", language: expect.objectContaining({ code: "zh-Hans" }), sourceUrl: "https://en.wiktionary.org/wiki/apple" }));
    expect(english.matches.length).toBeGreaterThan(50);
    expect(english.coverage).toMatchObject({ languages: 108, translationPairs: 519230 });
  }, 20_000);
  it("treats Wikimedia markup as inert text and tolerates malformed payloads", () => {
    expect(cleanDictionaryText('<script>alert(1)</script><a href="x">fish &amp; chips</a>')).toBe("fish & chips");
    expect(cleanDictionaryText('&#x1F431; &lt;strong&gt;cat&lt;/strong&gt;')).toBe("🐱 <strong>cat</strong>");
    const parsed = parseWiktionaryDefinitions({ en: [{ language: "English", partOfSpeech: "Noun", definitions: [{ definition: "a <b>cat</b>", parsedExamples: [{ example: "a <i>cat</i>", translation: "猫" }] }] }] });
    expect(parsed[0].senses[0]).toEqual({ definition: "a cat", examples: ["a cat — 猫"] });
    expect(parseWiktionaryDefinitions({ en: "broken", fr: [null] })).toEqual([]);
  });
  it("validates the public index API limits and query parameters", async () => {
    expect((await definitions(new NextRequest("http://localhost/api/definitions?q="))).status).toBe(400);
    expect((await definitions(new NextRequest("http://localhost/api/definitions?q=test&limit=81"))).status).toBe(400);
    expect((await world(new NextRequest("http://localhost/api/world?q=test&lang=%3Cscript%3E"))).status).toBe(400);
    expect((await world(new NextRequest(`http://localhost/api/world?q=${"a".repeat(121)}`))).status).toBe(400);
  });
});
