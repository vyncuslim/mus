/**
 * Unicode and Diacritic Normalization Utilities for Multilingual Lexical Search
 */

const ARABIC_DIACRITICS_REGEX = /[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g;
const COMBINING_MARKS_REGEX = /[\u0300-\u036f]/g;

/**
 * Normalizes a string to canonical Unicode NFC form with trimmed whitespace.
 */
export function normalizeUnicode(input: string): string {
  if (!input) return "";
  return input.normalize("NFC").trim().replace(/\s+/g, " ");
}

/**
 * Produces a case-folded, diacritic-stripped search key suitable for
 * Latin, Pinyin, Arabic (tashkeel-insensitive), and CJK/Kana/Hangul/Thai lookup.
 */
export function normalizeSearchKey(input: string): string {
  if (!input) return "";

  const nfc = normalizeUnicode(input).toLowerCase();

  // Handle German ß and Scandinavian/special Latin ligatures before NFD decomposition
  const preMapped = nfc
    .replace(/ß/g, "ss")
    .replace(/æ/g, "ae")
    .replace(/œ/g, "oe")
    // Normalize Arabic Alef variants and Ta Marbuta for resilient lookup
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(ARABIC_DIACRITICS_REGEX, "");

  return preMapped
    .normalize("NFD")
    .replace(COMBINING_MARKS_REGEX, "")
    .normalize("NFC")
    .replace(/['’`]/g, "")
    .trim();
}

/**
 * Produces a compact alphanumeric/script key without spaces or hyphens
 * (e.g. "ni hao" -> "nihao", "kata dasar" -> "katadasar").
 */
export function normalizeCompactKey(input: string): string {
  return normalizeSearchKey(input).replace(/[\s\-_.,/\\()[\]]+/g, "");
}

/**
 * Computes Damerau-Levenshtein edit distance between two strings,
 * used for bounded typo-tolerant suggestions.
 */
export function computeEditDistance(a: string, b: string): number {
  const s1 = normalizeSearchKey(a);
  const s2 = normalizeSearchKey(b);

  if (s1 === s2) return 0;
  const len1 = s1.length;
  const len2 = s2.length;

  if (len1 === 0) return len2;
  if (len2 === 0) return len1;
  if (Math.abs(len1 - len2) > 4) return Math.abs(len1 - len2);

  const dp: number[][] = Array.from({ length: len1 + 1 }, () =>
    new Array<number>(len2 + 1).fill(0)
  );

  for (let i = 0; i <= len1; i++) dp[i][0] = i;
  for (let j = 0; j <= len2; j++) dp[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );

      if (
        i > 1 &&
        j > 1 &&
        s1[i - 1] === s2[j - 2] &&
        s1[i - 2] === s2[j - 1]
      ) {
        dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + cost); // transposition
      }
    }
  }

  return dp[len1][len2];
}
