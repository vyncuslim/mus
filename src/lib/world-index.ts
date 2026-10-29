import fs from "node:fs/promises";
import path from "node:path";
import { gunzipSync } from "node:zlib";
import { normalizeSearchKey } from "./text-normalize";
import type { WorldLanguage, WorldIndexSearchResult, WorldTranslationMatch } from "@/types/world";
type RecordRow = [string, number, number] | [string, number, number, string];
interface Packed { format: number; sourceVersion: string; languages: WorldLanguage[]; english: [string, string][]; records: RecordRow[] }
interface Searchable extends Packed { englishKeys: Map<string, number[]>; englishPrefixes: [string, number][]; recordsByEnglish: RecordRow[][] }
let cached: Promise<Searchable> | undefined;
async function load(): Promise<Searchable> {
  if (!cached) cached = fs.readFile(path.join(process.cwd(), "data/world-lexicon/wiktionary-translations.json.gz")).then((data) => {
    const p = JSON.parse(gunzipSync(data).toString("utf8")) as Packed;
    if (p.format !== 1 || !Array.isArray(p.records) || !Array.isArray(p.english) || !Array.isArray(p.languages)) throw new Error("Unsupported index");
    const englishKeys = new Map<string, number[]>(), englishPrefixes: [string, number][] = [];
    const recordsByEnglish = p.english.map(() => [] as RecordRow[]);
    p.english.forEach(([word], i) => { const key = normalizeSearchKey(word), ids = englishKeys.get(key) ?? []; ids.push(i); englishKeys.set(key, ids); englishPrefixes.push([key, i]); });
    englishPrefixes.sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] - b[1]);
    for (const row of p.records) recordsByEnglish[row[2]]?.push(row);
    return { ...p, englishKeys, englishPrefixes, recordsByEnglish };
  }).catch((error) => { cached = undefined; throw error; });
  return cached;
}
function lowerBound(rows: readonly (readonly [string, ...unknown[]])[], key: string): number {
  let low = 0, high = rows.length;
  while (low < high) { const mid = low + Math.floor((high - low) / 2); if (normalizeSearchKey(rows[mid][0]) < key) low = mid + 1; else high = mid; }
  return low;
}
/** Rows are source translation equivalents, not separately verified definitions. */
export async function searchWorldIndex(query: string, languageCode = "all", limit = 40): Promise<WorldIndexSearchResult> {
  const index = await load(), normalized = normalizeSearchKey(query);
  const matches: WorldTranslationMatch[] = [], suggestions: string[] = [];
  const seen = new Set<string>(), seenSuggestions = new Set<string>(); let totalMatches = 0;
  const add = ([word, languageIndex, englishIndex, romanization]: RecordRow) => {
    const language = index.languages[languageIndex], english = index.english[englishIndex]?.[0];
    if (!language || !english || (languageCode !== "all" && language.code !== languageCode)) return;
    const id = `${language.code}\0${word}\0${english}`; if (seen.has(id)) return; seen.add(id); totalMatches++;
    if (matches.length < Math.max(1, Math.min(limit, 200))) matches.push({ word, language, english, ...(romanization ? { romanization } : {}), sourceUrl: `https://en.wiktionary.org/wiki/${encodeURIComponent(english.replace(/ /g, "_"))}` });
  };
  const suggest = (word: string) => { if (suggestions.length < 8 && !seenSuggestions.has(word) && normalizeSearchKey(word) !== normalized) { seenSuggestions.add(word); suggestions.push(word); } };
  if (normalized) {
    if (languageCode === "all") {
      let pos = lowerBound(index.englishPrefixes, normalized);
      while (pos < index.englishPrefixes.length && suggestions.length < 4) { const [key, id] = index.englishPrefixes[pos++]; if (!key.startsWith(normalized)) break; suggest(index.english[id][0]); }
    }
    let pos = lowerBound(index.records, normalized);
    while (pos < index.records.length) {
      const row = index.records[pos++], key = normalizeSearchKey(row[0]); if (!key.startsWith(normalized)) break;
      const language = index.languages[row[1]]; if (!language || (languageCode !== "all" && language.code !== languageCode)) continue;
      if (key === normalized) add(row); else suggest(row[0]);
      if (key !== normalized && suggestions.length >= 8) break;
    }
    for (const id of index.englishKeys.get(normalized) ?? []) for (const row of index.recordsByEnglish[id]) add(row);
  }
  return { query, matches, totalMatches, suggestions, coverage: { languages: index.languages.length, translationPairs: index.records.length, sourceVersion: index.sourceVersion } };
}
