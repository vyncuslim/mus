import { eq } from "drizzle-orm";
import { getDb, isDatabaseConfigured } from "@/db";
import { lexiconEntriesTable } from "@/db/schema";
import { STARTER_LEXICON_ENTRIES } from "@/data/starter-lexicon";
import type {
  LanguageCode,
  LexiconEntry,
  SearchResponse,
  SearchSuggestion,
} from "@/types/lexicon";
import {
  computeSuggestions,
  executeLexiconSearch,
  type SearchOptions,
} from "./search-engine";
import { normalizeSearchKey, normalizeUnicode } from "./text-normalize";

async function loadEntriesWithFallback(): Promise<{
  entries: readonly LexiconEntry[];
  mode: "postgresql" | "starter_dataset";
}> {
  if (!isDatabaseConfigured()) {
    return {
      entries: STARTER_LEXICON_ENTRIES,
      mode: "starter_dataset",
    };
  }

  try {
    const db = getDb();
    if (!db) {
      return {
        entries: STARTER_LEXICON_ENTRIES,
        mode: "starter_dataset",
      };
    }

    const rows = await db.select().from(lexiconEntriesTable).limit(2000);
    if (!rows || rows.length === 0) {
      return {
        entries: STARTER_LEXICON_ENTRIES,
        mode: "starter_dataset",
      };
    }

    const dbEntries: LexiconEntry[] = rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      headword: row.headword,
      normalizedHeadword: row.normalizedHeadword,
      language: row.language,
      romanization: row.romanization ?? undefined,
      ipa: row.ipa ?? undefined,
      audioLocale: row.audioLocale,
      partsOfSpeech: row.partsOfSpeech,
      etymology: row.etymology ?? undefined,
      wordForms: row.wordForms ?? undefined,
      grammarNote: row.grammarNote ?? undefined,
      senses: row.senses,
      malayMorphology: row.malayMorphology ?? undefined,
      relatedWords: row.relatedWords ?? undefined,
      frequencyRank: row.frequencyRank ?? undefined,
      featured: row.featured,
      provenance: row.provenance,
    }));

    return {
      entries: dbEntries,
      mode: "postgresql",
    };
  } catch {
    return {
      entries: STARTER_LEXICON_ENTRIES,
      mode: "starter_dataset",
    };
  }
}

export async function searchDictionary(
  options: Omit<SearchOptions, "entries" | "dataSourceMode">
): Promise<SearchResponse> {
  const { entries, mode } = await loadEntriesWithFallback();
  return executeLexiconSearch({
    ...options,
    entries,
    dataSourceMode: mode,
  });
}

export async function getWordEntry(
  language: LanguageCode,
  rawWord: string
): Promise<{
  entry: LexiconEntry | null;
  morphologyFamily: LexiconEntry[];
  dataSourceMode: "postgresql" | "starter_dataset";
}> {
  const decodedWord = normalizeUnicode(decodeURIComponent(rawWord));
  const normWord = normalizeSearchKey(decodedWord);
  const { entries, mode } = await loadEntriesWithFallback();

  // 1. Exact headword or slug match in target language
  let found =
    entries.find(
      (e) =>
        e.language === language &&
        (e.headword === decodedWord ||
          e.slug === decodedWord ||
          e.headword.toLowerCase() === decodedWord.toLowerCase() ||
          e.slug.toLowerCase() === decodedWord.toLowerCase())
    ) ?? null;

  // 2. Normalized (diacritic-insensitive / unvocalized Arabic / Pinyin) match in target language
  if (!found) {
    found =
      entries.find(
        (e) =>
          e.language === language &&
          (e.normalizedHeadword === normWord ||
            normalizeSearchKey(e.slug) === normWord)
      ) ?? null;
  }

  let morphologyFamily: LexiconEntry[] = [];
  if (found && found.language === "ms" && found.malayMorphology?.kataDasar) {
    const rootKey = normalizeSearchKey(found.malayMorphology.kataDasar);
    morphologyFamily = entries.filter(
      (e) =>
        e.language === "ms" &&
        e.id !== found!.id &&
        (e.normalizedHeadword === rootKey ||
          (e.malayMorphology &&
            normalizeSearchKey(e.malayMorphology.kataDasar) === rootKey))
    );
  }

  return {
    entry: found,
    morphologyFamily,
    dataSourceMode: mode,
  };
}

export async function getFeaturedEntries(
  limit = 8
): Promise<LexiconEntry[]> {
  const { entries } = await loadEntriesWithFallback();
  return entries
    .filter((e) => e.featured)
    .sort((a, b) => (a.frequencyRank ?? 99) - (b.frequencyRank ?? 99))
    .slice(0, limit);
}

export async function getAllIndexedEntries(): Promise<readonly LexiconEntry[]> {
  const { entries } = await loadEntriesWithFallback();
  return entries;
}

export async function getAutocompleteSuggestions(
  query: string,
  language: LanguageCode | "all" = "all",
  limit = 6
): Promise<SearchSuggestion[]> {
  const { entries } = await loadEntriesWithFallback();
  return computeSuggestions(query, language, entries, new Set(), limit);
}

export { eq };
