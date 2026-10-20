import { describe, expect, it } from "vitest";
import {
  computeEditDistance,
  normalizeCompactKey,
  normalizeSearchKey,
  normalizeUnicode,
} from "@/lib/text-normalize";

describe("text-normalize utilities", () => {
  it("normalizes Unicode strings to canonical NFC form and trims whitespace", () => {
    const decomposed = "cafe\u0301";
    expect(normalizeUnicode(decomposed)).toBe("café");
    expect(normalizeUnicode("  makan   nasi  ")).toBe("makan nasi");
  });

  it("strips Latin diacritics, umlauts, and tone marks for diacritic-aware search", () => {
    expect(normalizeSearchKey("café")).toBe("cafe");
    expect(normalizeSearchKey("Español")).toBe("espanol");
    expect(normalizeSearchKey("Wörterbuch")).toBe("worterbuch");
    expect(normalizeSearchKey("xuéxí")).toBe("xuexi");
  });

  it("strips Arabic tashkeel (harakat) so unvocalized queries match vocalized headwords", () => {
    expect(normalizeSearchKey("عِلْم")).toBe("علم");
    expect(normalizeSearchKey("كِتَاب")).toBe("كتاب");
  });

  it("generates compact keys without spaces or punctuation", () => {
    expect(normalizeCompactKey("buah tangan")).toBe("buahtangan");
    expect(normalizeCompactKey("xué xí")).toBe("xuexi");
  });

  it("calculates Damerau-Levenshtein edit distance accurately including transpositions", () => {
    expect(computeEditDistance("makanan", "makanan")).toBe(0);
    expect(computeEditDistance("makanan", "makanna")).toBe(1); // transposition
    expect(computeEditDistance("serendipity", "serendipiti")).toBe(1); // substitution
  });
});
