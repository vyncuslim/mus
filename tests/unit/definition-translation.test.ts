import { afterEach, describe, expect, it, vi } from "vitest";
import { DefinitionTranslationError, extractMyMemoryTranslation, splitDefinition, translateDefinition } from "@/lib/definition-translation";
import { DEFINITION_LANGUAGES, defaultDefinitionLanguage, isDefinitionLanguage } from "@/lib/translation-languages";

const exactResult = (segment: string, translation: string) => ({ responseStatus: 200, quotaFinished: false, responseData: { match: 0.85, translatedText: translation }, matches: [{ segment, translation, reference: "Machine Translation.", "created-by": "MT!" }] });
afterEach(() => vi.unstubAllGlobals());

describe("on-demand definition translation", () => {
  it("offers many language choices, including simplified/traditional Chinese and Malay", () => {
    expect(DEFINITION_LANGUAGES.length).toBeGreaterThanOrEqual(80);
    expect(new Set(DEFINITION_LANGUAGES.map(([code]) => code)).size).toBe(DEFINITION_LANGUAGES.length);
    expect(["zh-CN", "zh-TW", "ms-MY", "ta-IN", "ar-SA", "ja-JP", "km-KH"].every(isDefinitionLanguage)).toBe(true);
    expect(defaultDefinitionLanguage("zh-Hans")).toBe("zh-CN");
    expect(defaultDefinitionLanguage("ms")).toBe("ms-MY");
  });
  it("splits long Unicode strings without exceeding the provider's UTF-8 limit", () => {
    const source = `${"多语言词典🐈 ".repeat(90)}${"a".repeat(600)}`;
    const chunks = splitDefinition(source);
    expect(chunks.length).toBeGreaterThan(2);
    expect(chunks.every((chunk) => new TextEncoder().encode(chunk).length <= 450)).toBe(true);
    expect(chunks.join("").replace(/\s+/g, "")).toBe(source.replace(/\s+/g, ""));
    expect(chunks.every((chunk) => !chunk.includes("�"))).toBe(true);
    expect(splitDefinition("First paragraph.\n\nSecond paragraph.")).toEqual(["First paragraph.", "Second paragraph."]);
    expect(() => splitDefinition(source, 1)).toThrow(RangeError);
  });
  it("prefers a translation of the actual sentence over a misleading fuzzy memory match", () => {
    const source = "The cat sleeps on the mat.";
    const payload = { responseStatus: 200, responseData: { translatedText: "El gato duerme sobre la cama.", match: 0.86 }, matches: [{ segment: "The cat sleeps on the bed.", translation: "El gato duerme sobre la cama.", match: 0.86 }, { segment: source, translation: "El gato duerme sobre la colchoneta.", reference: "Machine Translation.", "created-by": "MT!" }] };
    expect(extractMyMemoryTranslation(payload, source)).toBe("El gato duerme sobre la colchoneta.");
    expect(() => extractMyMemoryTranslation({ ...payload, matches: [payload.matches[0]] }, source)).toThrowError(expect.objectContaining({ code: "no_result" }));
    expect(() => extractMyMemoryTranslation({ responseStatus: 200, responseData: { translatedText: "Turkey", match: 1 }, matches: [{ segment: "Turkey", translation: "Turkey" }] }, "turkey")).toThrowError(expect.objectContaining({ code: "no_result" }));
    expect(() => extractMyMemoryTranslation({ responseStatus: 200, matches: [{ segment: source, target: "es-ES", translation: "El gato" }] }, source, 200, "zh-CN")).toThrowError(expect.objectContaining({ code: "no_result" }));
    expect(extractMyMemoryTranslation({ responseStatus: 200, matches: [{ segment: source, target: "km-KM", translation: "ខ្មែរ" }] }, source, 200, "km-KH")).toBe("ខ្មែរ");
  });
  it("rejects quota warnings, unsupported languages, blank output, and provider errors", () => {
    const check = (payload: unknown, code: string) => expect(() => extractMyMemoryTranslation(payload, "Hello")).toThrowError(expect.objectContaining({ code }));
    check({ responseStatus: 200, quotaFinished: true, responseData: { translatedText: "quota", match: 1 } }, "quota");
    check({ responseStatus: 200, responseData: { translatedText: "MYMEMORY WARNING: YOU USED ALL AVAILABLE FREE TRANSLATIONS", match: 1 } }, "quota");
    check({ responseStatus: "403", responseDetails: "INVALID TARGET LANGUAGE" }, "unsupported");
    check({ responseStatus: 200, responseData: { translatedText: "", match: 1 }, matches: [] }, "no_result");
    check({ responseStatus: 503 }, "network");
  });
  it("requests bounded chunks from the chosen language and joins actual returned translations", async () => {
    const sent: string[] = [];
    vi.stubGlobal("fetch", vi.fn(async (input: string) => {
      const url = new URL(input), q = url.searchParams.get("q")!;
      expect(url.searchParams.get("langpair")).toBe("en|zh-CN");
      expect(new TextEncoder().encode(q).length).toBeLessThanOrEqual(450);
      sent.push(q);
      return new Response(JSON.stringify(exactResult(q, `译文${sent.length}`)), { status: 200 });
    }));
    const result = await translateDefinition("A long definition ".repeat(45), "zh-CN", new AbortController().signal);
    expect(sent.length).toBeGreaterThan(1);
    expect(result).toBe(sent.map((_, index) => `译文${index + 1}`).join(" "));
  });
  it("does not send oversized inputs or cancelled requests", async () => {
    const fetch = vi.fn(); vi.stubGlobal("fetch", fetch);
    await expect(translateDefinition("a".repeat(3601), "ms-MY", new AbortController().signal)).rejects.toBeInstanceOf(DefinitionTranslationError);
    const controller = new AbortController(); controller.abort();
    await expect(translateDefinition("hello", "ms-MY", controller.signal)).rejects.toMatchObject({ name: "AbortError" });
    expect(fetch).not.toHaveBeenCalled();
  });
});
