import fs from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";
import { normalizeSearchKey } from "../src/lib/text-normalize";

// Pinned Multilingualism/Wiktionary translation tables; exclude machine rows.
const sourceDir = path.resolve(process.argv[2] ?? "data/dumps/multilingualism");
const outputPath = path.resolve(process.argv[3] ?? "data/world-lexicon/wiktionary-translations.json.gz");
const SOURCE_REVISION = "fe427837f392a90f8d68a3e69c7c9f3c1f716bb9";
type Lang = { code: string; name: string; native: string; rtl?: boolean };
type SourceIndex = { rows: [string, string, string, ...unknown[]][] };
type SourceRows = { code: string; columns: string[]; rows: [string, string, string, number][] };
type RecordRow = [string, number, number] | [string, number, number, string];
const read = <T,>(file: string): T => JSON.parse(fs.readFileSync(file, "utf8")) as T;
const meta = read<{ version: string; languages: Lang[] }>(path.join(sourceDir, "meta.json"));
const index = read<SourceIndex>(path.join(sourceDir, "index.json"));
if (!Array.isArray(meta.languages) || !Array.isArray(index.rows)) throw new Error("Unexpected source format");
const english: [string, string][] = [];
const bySlug = new Map<string, number>();
for (const [slug, word, part] of index.rows) {
  if (!slug || !word || bySlug.has(slug)) continue;
  bySlug.set(slug, english.length); english.push([word, part]);
}
const languages = meta.languages.map(({ code, name, native, rtl }) => ({ code, name, native, ...(rtl ? { rtl: true } : {}) }));
const records: { key: string; row: RecordRow }[] = [];
let excludedMachineRows = 0;
for (const [langIndex, lang] of languages.entries()) {
  if (!/^[A-Za-z0-9-]+$/.test(lang.code)) throw new Error("Invalid language code");
  const doc = read<SourceRows>(path.join(sourceDir, "langs", `${lang.code}.json`));
  if (doc.code !== lang.code || doc.columns.join(",") !== "slug,translation,romanization,machine") throw new Error(`Unexpected schema: ${lang.code}`);
  for (const [slug, word, romanization, machine] of doc.rows) {
    if (machine === 1) { excludedMachineRows++; continue; }
    if (machine !== 0) throw new Error(`Unknown flag: ${lang.code}`);
    const e = bySlug.get(slug), key = normalizeSearchKey(word);
    if (e === undefined || !key) throw new Error(`Invalid row: ${lang.code}`);
    records.push({ key, row: romanization ? [word, langIndex, e, romanization] : [word, langIndex, e] });
  }
}
records.sort((a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : a.row[1] - b.row[1] || a.row[2] - b.row[2]);
const output = { format: 1, sourceRevision: SOURCE_REVISION, sourceVersion: meta.version, languages, english, records: records.map((x) => x.row) };
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, gzipSync(JSON.stringify(output), { level: 9 }));
const summary = { sourceRevision: SOURCE_REVISION, sourceVersion: meta.version, languages: languages.length, englishHeadwords: english.length, sourceTranslationPairs: output.records.length, excludedMachineRows, bytes: fs.statSync(outputPath).size };
fs.writeFileSync(path.join(path.dirname(outputPath), "manifest.json"), JSON.stringify(summary, null, 2) + "\n");
console.log(JSON.stringify(summary, null, 2));
