import { describe, expect, it } from "vitest";
import catalog from "../../data/reviewed-definition-translations.json";
import { curatedSubject, dictionarySubject, findReviewedTranslation, reviewedTranslationCount, validateReviewCatalog } from "@/lib/reviewed-definitions";
import { MULTILINGUAL_STARTER_ENTRIES } from "@/data/multilingual-entries";

// Synthetic data is restricted to tests; it is not a real human review.
const fixture = {
  subject: { origin: "wiktionary-snapshot", sourceUrl: "https://example.org/entry/cat", sourceVersion: "snapshot-1", headword: "cat", language: "en", partOfSpeech: "noun", definition: "A small feline.", senseId: "" },
  target: "zh-CN", translation: "小型猫科动物。",
  source: { name: "Test source", url: "https://example.org/translation", license: "Test licence", licenseUrl: "https://example.org/licence", attribution: "Test attribution" },
  review: { reviewer: "Test reviewer", reviewedAt: "2026-10-01", evidenceUrl: "https://example.org/review" },
};

describe("human-reviewed definition translations", () => {
  it("only exposes a translation when every source-sense field and target match", () => {
    const { records, errors } = validateReviewCatalog([fixture], "2026-10-28");
    expect(errors).toEqual([]);
    const subject = records[0].subject;
    expect(findReviewedTranslation(subject, "zh-CN", records)?.translation).toBe(fixture.translation);
    expect(findReviewedTranslation(subject, "ms-MY", records)).toBeUndefined();
    for (const [field, value] of Object.entries({ origin: "wiktionary-live", sourceUrl: "https://example.org/other", sourceVersion: "snapshot-2", headword: "cats", language: "fr", partOfSpeech: "verb", definition: "A large feline.", senseId: "another" })) {
      expect(findReviewedTranslation({ ...subject, [field]: value }, "zh-CN", records)).toBeUndefined();
    }
  });
  it("fails closed on missing evidence, unsafe URLs, impossible dates and invalid languages", () => {
    const missing = { ...fixture, review: { reviewer: "", reviewedAt: "2026-10-01", evidenceUrl: "" } };
    const unsafe = { ...fixture, source: { ...fixture.source, url: "javascript:alert(1)" } };
    const badDate = { ...fixture, review: { ...fixture.review, reviewedAt: "2026-02-31" } };
    const futureDate = { ...fixture, review: { ...fixture.review, reviewedAt: "9999-01-01" } };
    const badTarget = { ...fixture, target: "en" };
    const unknownVersion = { ...fixture, subject: { ...fixture.subject, sourceVersion: "unknown" } };
    const invalidCurated = { ...fixture, subject: { ...fixture.subject, origin: "curated", senseId: "" } };
    const result = validateReviewCatalog([missing, unsafe, badDate, futureDate, badTarget, unknownVersion, invalidCurated], "2026-10-28");
    expect(result.records).toHaveLength(0);
    expect(result.errors).toHaveLength(7);
  });
  it("fails closed when the shared cutoff is missing, invalid, or before the review", () => {
    expect(validateReviewCatalog([fixture], undefined).records).toEqual([]);
    expect(validateReviewCatalog([fixture], "2026-02-31").records).toEqual([]);
    expect(validateReviewCatalog([fixture], "2026-09-30").records).toEqual([]);
    expect(validateReviewCatalog([fixture], "2026-10-01").records).toHaveLength(1);
  });
  it("does not publish either record when duplicate reviews conflict", () => {
    const result = validateReviewCatalog([fixture, { ...fixture, translation: "another value" }], "2026-10-28");
    expect(result.errors).toHaveLength(1);
    expect(result.records).toHaveLength(0);
  });
  it("constructs source-specific subjects and never treats existing localized text as reviewed", () => {
    const entry = MULTILINGUAL_STARTER_ENTRIES.find((item) => item.id === "en-serendipity")!;
    const subject = curatedSubject(entry, entry.senses[0]);
    expect(subject.senseId).toBe("en-serendipity/en-serendipity-s1");
    expect(findReviewedTranslation(subject, "zh-CN", [])).toBeUndefined();
    const group = { headword: "agua", languageCode: "es", languageName: "Spanish", partOfSpeech: "noun", senses: [], sourceVersion: "wiktionary-snapshot-2023-05-19" };
    expect(dictionarySubject(group, "ignored", "water", "wiktionary-snapshot")).toMatchObject({ headword: "agua", language: "es", sourceVersion: group.sourceVersion });
    expect(dictionarySubject({ ...group, languageCode: "other", languageName: "Ainu" }, "ignored", "water", "wiktionary-snapshot").language).toBe("other:Ainu");
  });
  it("validates the shipped catalogue and reports its actual reviewed count", () => {
    const result = validateReviewCatalog(catalog, new Date().toISOString().slice(0, 10));
    expect(result.errors).toEqual([]);
    expect(reviewedTranslationCount).toBe(result.records.length);
  });
});
