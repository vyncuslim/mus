import type { LanguageCode, LexiconEntry, UiLocale } from "@/types/lexicon";
import { SUPPORTED_LANGUAGE_CODES } from "@/lib/languages";
import { MALAY_STARTER_ENTRIES } from "./malay-entries";
import { MULTILINGUAL_STARTER_ENTRIES } from "./multilingual-entries";

export const STARTER_LEXICON_ENTRIES: readonly LexiconEntry[] = [
  ...MALAY_STARTER_ENTRIES,
  ...MULTILINGUAL_STARTER_ENTRIES,
];

export interface LearningCollection {
  id: string;
  title: Record<UiLocale, string>;
  description: Record<UiLocale, string>;
  badge: Record<UiLocale, string>;
  entryIds: string[];
}

export const CURATED_LEARNING_COLLECTIONS: readonly LearningCollection[] = [
  {
    id: "malay-morphology-mastery",
    title: {
      en: "Malay Kata Dasar & Kata Terbitan Mastery",
      ms: "Penguasaan Kata Dasar & Kata Terbitan Melayu",
      "zh-Hans": "马来语词根 (Kata Dasar) 与派生词精要",
    },
    description: {
      en: "Understand how Malay root words transform with Awalan, Akhiran, Apitan, and Sisipan affixes.",
      ms: "Fahami bagaimana kata dasar Bahasa Melayu berkembang melalui imbuhan Awalan, Akhiran, Apitan, dan Sisipan.",
      "zh-Hans": "深入掌握马来语词根如何通过前缀、后缀、环缀与中缀派生新词。",
    },
    badge: {
      en: "Morphology · 11 Entries",
      ms: "Morfologi · 11 Entri",
      "zh-Hans": "词法解析 · 11 词条",
    },
    entryIds: [
      "ms-makan",
      "ms-makanan",
      "ms-memakan",
      "ms-termakan",
      "ms-ajar",
      "ms-belajar",
      "ms-pelajar",
      "ms-mengajar",
      "ms-pengajaran",
      "ms-tulis",
      "ms-telapak",
    ],
  },
  {
    id: "malay-peribahasa-penjodoh",
    title: {
      en: "Peribahasa, Simpulan Bahasa & Penjodoh Bilangan",
      ms: "Peribahasa, Simpulan Bahasa & Penjodoh Bilangan",
      "zh-Hans": "马来谚语、习语与量词精选",
    },
    description: {
      en: "Master idiomatic Malay expressions, cultural proverbs, and essential numeral classifiers.",
      ms: "Kuasai ungkapan idiomatik Melayu, peribahasa warisan, dan penjodoh bilangan penting.",
      "zh-Hans": "学习地道的马来语习语、传统谚语以及核心量词搭配。",
    },
    badge: {
      en: "Cultural & Grammar · 5 Entries",
      ms: "Budaya & Tatabahasa · 5 Entri",
      "zh-Hans": "文化与语法 · 5 词条",
    },
    entryIds: [
      "ms-sebuah",
      "ms-sehelai",
      "ms-buah-tangan",
      "ms-ulat-buku",
      "ms-bagai-aur-dengan-tebing",
    ],
  },
  {
    id: "multilingual-core-bridges",
    title: {
      en: "Multilingual Core Concepts (Malay · English · Chinese · Japanese · Arabic)",
      ms: "Konsep Teras Pelbagai Bahasa (Melayu · Inggeris · Cina · Jepun · Arab)",
      "zh-Hans": "多语种核心词汇桥梁（马·英·中·日·阿）",
    },
    description: {
      en: "Compare essential concepts across Latin, Hanzi, Kanji, Hangul, Thai, and Right-to-Left Arabic scripts.",
      ms: "Bandingkan konsep asas merentas tulisan Rumi, Hanzi, Kanji, Hangul, Thai, dan Arab (RTL).",
      "zh-Hans": "跨拉丁字母、汉字、假名、谚文、泰文与阿拉伯文对比核心概念。",
    },
    badge: {
      en: "Cross-Lingual · 12 Entries",
      ms: "Rentas Bahasa · 12 Entri",
      "zh-Hans": "跨语种对照 · 12 词条",
    },
    entryIds: [
      "ms-bahasa",
      "ms-ilmu",
      "en-serendipity",
      "en-dictionary",
      "zh-hans-xuexi",
      "zh-hans-chi",
      "zh-hant-xuexi",
      "ja-taberu",
      "ko-mul",
      "th-ahan",
      "ar-ilm",
      "fr-cafe",
    ],
  },
];

export interface DatasetCoverageSummary {
  totalEntries: number;
  totalSenses: number;
  totalTranslations: number;
  totalExamples: number;
  languagesWithHeadwords: number;
  countsByLanguage: Record<LanguageCode, number>;
  sourceName: string;
  sourceVersion: string;
  license: string;
  licenseUrl: string;
  lastUpdated: string;
}

/**
 * Dynamically calculates exact, truthful statistics from the actual loaded entries.
 * Never fabricates or hardcodes entry counts.
 */
export function getDatasetCoverageSummary(
  entries: readonly LexiconEntry[] = STARTER_LEXICON_ENTRIES
): DatasetCoverageSummary {
  const countsByLanguage = Object.fromEntries(
    SUPPORTED_LANGUAGE_CODES.map((code) => [code, 0])
  ) as Record<LanguageCode, number>;

  let totalSenses = 0;
  let totalTranslations = 0;
  let totalExamples = 0;

  for (const entry of entries) {
    countsByLanguage[entry.language] =
      (countsByLanguage[entry.language] || 0) + 1;
    totalSenses += entry.senses.length;
    for (const sense of entry.senses) {
      for (const tr of sense.translations) {
        totalTranslations += tr.terms.length;
      }
      totalExamples += sense.examples.length;
    }
  }

  const languagesWithHeadwords = Object.values(countsByLanguage).filter(
    (count) => count > 0
  ).length;

  return {
    totalEntries: entries.length,
    totalSenses,
    totalTranslations,
    totalExamples,
    languagesWithHeadwords,
    countsByLanguage,
    sourceName: "Kaikki.org / Wiktionary (Wiktextract Normalized Starter Corpus)",
    sourceVersion: "wiktextract-2026-09",
    license: "Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) & GFDL",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    lastUpdated: "2026-10-01",
  };
}
