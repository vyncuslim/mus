import { and, asc, count, desc, eq, getTableColumns, inArray, like, or, sql } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { getDb } from "@/db";
import * as schema from "@/db/schema";
import { lexiconEntriesTable as entriesTable, lexiconSearchKeysTable as keysTable } from "@/db/schema";
import { STARTER_LEXICON_ENTRIES, getDatasetCoverageSummary, type DatasetCoverageSummary } from "@/data/starter-lexicon";
import type { LanguageCode, LexiconEntry, SearchResponse, SearchSuggestion } from "@/types/lexicon";
import { computeSuggestions, executeLexiconSearch, type SearchOptions } from "./search-engine";
import { normalizeCompactKey, normalizeSearchKey, normalizeUnicode } from "./text-normalize";

type Database = PostgresJsDatabase<typeof schema>;
// Do not SELECT the new optional reading columns from old, unmigrated databases.
const { normalizedReading: _normalizedReading, compactReading: _compactReading, ...entryColumns } = getTableColumns(entriesTable);
type EntryRow = Omit<typeof entriesTable.$inferSelect, "normalizedReading" | "compactReading">;
function asEntry(row: EntryRow): LexiconEntry {
  return { id: row.id, slug: row.slug, headword: row.headword, normalizedHeadword: row.normalizedHeadword, language: row.language, romanization: row.romanization ?? undefined, ipa: row.ipa ?? undefined, audioLocale: row.audioLocale, partsOfSpeech: row.partsOfSpeech, etymology: row.etymology ?? undefined, wordForms: row.wordForms ?? undefined, grammarNote: row.grammarNote ?? undefined, senses: row.senses, malayMorphology: row.malayMorphology ?? undefined, relatedWords: row.relatedWords ?? undefined, frequencyRank: row.frequencyRank ?? undefined, featured: row.featured, provenance: row.provenance };
}
function pattern(key: string): string { return `${key.replace(/[\\%_]/g, "\\$&")}%`; }
async function hasRows(db: Database): Promise<boolean> { return (await db.select({ id: entriesTable.id }).from(entriesTable).limit(1)).length > 0; }

/**
 * Search indexed candidates anywhere in PostgreSQL, not just the first 2,000 rows.
 * Exact candidates are fetched separately so a common prefix cannot crowd them out.
 * New reading/alias indexes are optional until an existing DB has been migrated.
 */
export async function databaseCandidates(db: Database, query: string): Promise<LexiconEntry[]> {
  const norm = normalizeSearchKey(query), compact = normalizeCompactKey(query);
  if (!norm) return (await db.select(entryColumns).from(entriesTable).orderBy(desc(entriesTable.featured), asc(entriesTable.frequencyRank), asc(entriesTable.id)).limit(250)).map(asEntry);
  const result = new Map<string, LexiconEntry>();
  const add = (rows: EntryRow[]) => { for (const row of rows) if (!result.has(row.id)) result.set(row.id, asEntry(row)); };
  add(await db.select(entryColumns).from(entriesTable).where(or(eq(entriesTable.normalizedHeadword, norm), eq(entriesTable.kataDasar, norm), eq(entriesTable.slug, query))).orderBy(asc(entriesTable.id)).limit(500));
  add(await db.select(entryColumns).from(entriesTable).where(like(entriesTable.normalizedHeadword, pattern(norm))).orderBy(asc(entriesTable.normalizedHeadword), asc(entriesTable.id)).limit(500));
  try {
    add(await db.select(entryColumns).from(entriesTable).where(or(eq(entriesTable.normalizedReading, norm), compact.length >= 2 ? eq(entriesTable.compactReading, compact) : undefined)).orderBy(asc(entriesTable.id)).limit(500));
    if (norm.length >= 2) add(await db.select(entryColumns).from(entriesTable).where(or(like(entriesTable.normalizedReading, pattern(norm)), compact.length >= 2 ? like(entriesTable.compactReading, pattern(compact)) : undefined)).orderBy(asc(entriesTable.id)).limit(500));
  } catch {
    // Backwards compatible until db:push and db:backfill-index have been run.
    add(await db.select(entryColumns).from(entriesTable).where(like(sql`lower(${entriesTable.romanization})`, pattern(norm))).orderBy(asc(entriesTable.id)).limit(500));
  }
  try {
    const matchingKeys = db.select({ entryId: keysTable.entryId }).from(keysTable).where(like(keysTable.key, pattern(norm))).limit(500);
    add(await db.select(entryColumns).from(entriesTable).where(inArray(entriesTable.id, matchingKeys)).orderBy(asc(entriesTable.id)).limit(500));
  } catch {
    // Old schemas do not have the optional alias index. Core headword lookup still works.
  }
  return [...result.values()];
}
export async function searchDictionary(options: Omit<SearchOptions, "entries" | "dataSourceMode">): Promise<SearchResponse> {
  const db = getDb();
  if (db) {
    try {
      const entries = await databaseCandidates(db, options.query);
      if (entries.length || await hasRows(db)) return executeLexiconSearch({ ...options, entries, dataSourceMode: "postgresql" });
    } catch { /* database unavailable: use starter data */ }
  }
  return executeLexiconSearch({ ...options, entries: STARTER_LEXICON_ENTRIES, dataSourceMode: "starter_dataset" });
}

function chooseEntry(entries: readonly LexiconEntry[], language: LanguageCode, word: string): LexiconEntry | null {
  const normalized = normalizeSearchKey(word), lower = word.toLowerCase();
  return entries.find((e) => e.language === language && (e.headword === word || e.slug === word || e.headword.toLowerCase() === lower || e.slug.toLowerCase() === lower)) ?? entries.find((e) => e.language === language && (e.normalizedHeadword === normalized || normalizeSearchKey(e.slug) === normalized)) ?? null;
}
function starterWord(language: LanguageCode, word: string) {
  const entry = chooseEntry(STARTER_LEXICON_ENTRIES, language, word), root = entry?.malayMorphology?.kataDasar;
  const morphologyFamily = root ? STARTER_LEXICON_ENTRIES.filter((e) => e.language === "ms" && e.id !== entry?.id && (e.normalizedHeadword === normalizeSearchKey(root) || normalizeSearchKey(e.malayMorphology?.kataDasar ?? "") === normalizeSearchKey(root))) : [];
  return { entry, morphologyFamily, dataSourceMode: "starter_dataset" as const };
}
export async function databaseWord(db: Database, language: LanguageCode, word: string): Promise<{ entry: LexiconEntry | null; morphologyFamily: LexiconEntry[] }> {
  const norm = normalizeSearchKey(word);
  const rows = await db.select(entryColumns).from(entriesTable).where(and(eq(entriesTable.language, language), or(eq(entriesTable.normalizedHeadword, norm), eq(entriesTable.headword, word), eq(entriesTable.slug, word)))).orderBy(asc(entriesTable.id)).limit(100);
  const entry = chooseEntry(rows.map(asEntry), language, word);
  let morphologyFamily: LexiconEntry[] = [];
  if (entry?.language === "ms" && entry.malayMorphology?.kataDasar) {
    const root = entry.malayMorphology.kataDasar;
    const family = await db.select(entryColumns).from(entriesTable).where(and(eq(entriesTable.language, "ms"), or(eq(entriesTable.kataDasar, root), eq(entriesTable.normalizedHeadword, normalizeSearchKey(root))))).orderBy(asc(entriesTable.id)).limit(200);
    morphologyFamily = family.map(asEntry).filter((e) => e.id !== entry.id);
  }
  return { entry, morphologyFamily };
}
export async function getWordEntry(language: LanguageCode, rawWord: string): Promise<{ entry: LexiconEntry | null; morphologyFamily: LexiconEntry[]; dataSourceMode: "postgresql" | "starter_dataset" }> {
  // Callers pass decoded words. Decoding again corrupts literal '%' words.
  const word = normalizeUnicode(rawWord), db = getDb();
  if (db) {
    try { const result = await databaseWord(db, language, word); if (result.entry || await hasRows(db)) return { ...result, dataSourceMode: "postgresql" }; } catch { /* fallback */ }
  }
  return starterWord(language, word);
}
export async function getFeaturedEntries(limit = 8): Promise<LexiconEntry[]> {
  const db = getDb();
  if (db) {
    try { const rows = await db.select(entryColumns).from(entriesTable).where(eq(entriesTable.featured, true)).orderBy(asc(entriesTable.frequencyRank)).limit(Math.min(Math.max(limit, 1), 100)); if (rows.length || await hasRows(db)) return rows.map(asEntry); } catch { /* fallback */ }
  }
  return STARTER_LEXICON_ENTRIES.filter((e) => e.featured).sort((a, b) => (a.frequencyRank ?? 99) - (b.frequencyRank ?? 99)).slice(0, limit);
}
export async function getAutocompleteSuggestions(query: string, language: LanguageCode | "all" = "all", limit = 6): Promise<SearchSuggestion[]> {
  const db = getDb();
  if (db) {
    try { const entries = await databaseCandidates(db, query); if (entries.length || await hasRows(db)) return computeSuggestions(query, language, entries, new Set(), limit); } catch { /* fallback */ }
  }
  return computeSuggestions(query, language, STARTER_LEXICON_ENTRIES, new Set(), limit);
}

/** Aggregate exact DB coverage instead of reporting a 2,000-row sample. */
export async function databaseCoverage(db: Database): Promise<DatasetCoverageSummary | null> {
  const rows = await db.select({ language: entriesTable.language, total: count(), senses: sql<number>`coalesce(sum(jsonb_array_length(${entriesTable.senses})), 0)::integer`, translations: sql<number>`coalesce(sum((select coalesce(sum((select coalesce(sum(jsonb_array_length(coalesce(t->'terms', '[]'::jsonb))), 0) from jsonb_array_elements(coalesce(s->'translations', '[]'::jsonb)) t)), 0) from jsonb_array_elements(${entriesTable.senses}) s)), 0)::integer`, examples: sql<number>`coalesce(sum((select coalesce(sum(jsonb_array_length(coalesce(s->'examples', '[]'::jsonb))), 0) from jsonb_array_elements(${entriesTable.senses}) s)), 0)::integer` }).from(entriesTable).groupBy(entriesTable.language);
  if (!rows.length) return null;
  const starter = getDatasetCoverageSummary([]), countsByLanguage = { ...starter.countsByLanguage };
  for (const row of rows) countsByLanguage[row.language] = Number(row.total);
  return { ...starter, countsByLanguage, totalEntries: rows.reduce((sum, r) => sum + Number(r.total), 0), totalSenses: rows.reduce((sum, r) => sum + Number(r.senses), 0), totalTranslations: rows.reduce((sum, r) => sum + Number(r.translations), 0), totalExamples: rows.reduce((sum, r) => sum + Number(r.examples), 0), languagesWithHeadwords: rows.length, sourceName: "PostgreSQL entries (see per-entry provenance)", sourceVersion: "mixed", license: "See per-entry provenance" };
}
export async function getIndexedCoverage(): Promise<DatasetCoverageSummary> {
  const db = getDb();
  if (db) {
    try { const coverage = await databaseCoverage(db); if (coverage) return coverage; } catch { /* fallback */ }
  }
  return getDatasetCoverageSummary();
}
