import fs from "node:fs/promises";
import path from "node:path";
import { gunzipSync } from "node:zlib";
import manifest from "../../data/wiktionary-definitions/manifest.json";
import { definitionShard } from "./definition-shard";
import { computeEditDistance, normalizeSearchKey } from "./text-normalize";
import { RECENT_WIKTIONARY_SEEDS } from "@/data/dictionary-seeds";
import type { DictionaryDefinitionGroup } from "./world-definitions";
type Key = [string, number, number] | [string, number, number, string];
type Entry = [string, [string, string[]][]];
const root = path.join(process.cwd(), "data/wiktionary-definitions");
const keyCache = new Map<string, Promise<Key[]>>(), languageCache = new Map<number, Promise<Entry[]>>();
function cache<K, V>(store: Map<K, Promise<V>>, key: K, max: number, loader: () => Promise<V>): Promise<V> {
  const existing = store.get(key); if (existing) { store.delete(key); store.set(key, existing); return existing; }
  const value = loader().catch((error) => { if (store.get(key) === value) store.delete(key); throw error; });
  store.set(key, value); if (store.size > max) store.delete(store.keys().next().value as K); return value;
}
function read<T>(file: string): Promise<T> { return fs.readFile(file).then((data) => JSON.parse(gunzipSync(data).toString("utf8")) as T); }
function lowerBound(rows: Key[], key: string): number {
  let low = 0, high = rows.length;
  while (low < high) { const mid = low + Math.floor((high - low) / 2); if (rows[mid][0] < key) low = mid + 1; else high = mid; }
  return low;
}
/** Exact matches from an attributed 2023 Wiktionary snapshot. */
export async function searchDefinitionIndex(query: string, limit = 60): Promise<{ groups: DictionaryDefinitionGroup[]; totalMatches: number; suggestions: string[]; coverage: { languageCategories: number; entries: number; snapshotDate: string } }> {
  const key = normalizeSearchKey(query), coverage = { languageCategories: manifest.sourceLanguageCategories, entries: manifest.indexedEntries, snapshotDate: manifest.sourceSnapshotDate };
  if (!key) return { groups: [], totalMatches: 0, suggestions: [], coverage };
  const exactSeeds = RECENT_WIKTIONARY_SEEDS.filter((entry) => normalizeSearchKey(entry.headword ?? "") === key);
  const suggestions = RECENT_WIKTIONARY_SEEDS.map((entry) => entry.headword ?? "").filter((word) => word && normalizeSearchKey(word) !== key && key.length >= 3 && computeEditDistance(key, word) <= 1);
  const shard = definitionShard(key), rows = await cache(keyCache, shard, 12, () => read<Key[]>(path.join(root, "keys", `${shard}.json.gz`)));
  const records: Key[] = []; let position = lowerBound(rows, key), totalMatches = 0;
  while (position < rows.length && rows[position][0] === key) { const row = rows[position++]; totalMatches++; if (records.length < Math.max(1, Math.min(limit, 80))) records.push(row); }
  const files = await Promise.all([...new Set(records.map((row) => row[1]))].map(async (id) => {
    if (!manifest.languages[id]) throw new Error("Invalid language index");
    const entries = await cache(languageCache, id, 6, () => read<Entry[]>(path.join(root, "languages", `${String(id).padStart(3, "0")}.json.gz`)));
    return [id, entries] as const;
  }));
  const byLanguage = new Map(files), groups: DictionaryDefinitionGroup[] = [...exactSeeds];
  for (const [, languageId, entryId, form] of records) {
    const info = manifest.languages[languageId], entry = byLanguage.get(languageId)?.[entryId]; if (!entry || !info) continue;
    const [headword, blocks] = entry, matchedForm = normalizeSearchKey(headword) !== key ? form || query : undefined;
    for (const [partOfSpeech, senses] of blocks) groups.push({ sourceVersion: `wiktionary-snapshot-${manifest.sourceSnapshotDate}`, languageCode: info.code, languageName: info.name, partOfSpeech, headword, ...(matchedForm ? { matchedForm } : {}), senses: senses.map((definition) => ({ definition, examples: [] })) });
  }
  return { groups, totalMatches: totalMatches + exactSeeds.length, suggestions, coverage };
}
