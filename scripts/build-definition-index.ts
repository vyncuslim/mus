import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import readline from "node:readline";
import { gzipSync, gunzipSync } from "node:zlib";
import { iso6393 } from "iso-639-3";
import { definitionShard } from "../src/lib/definition-shard";
import { normalizeSearchKey } from "../src/lib/text-normalize";
import { cleanDictionaryText } from "../src/lib/world-definitions";

// Source/license and reproducible input instructions are in data/wiktionary-definitions/README.md.
const REVISION = "be0cfb8d614470bc8b9d9006ddff8b921cd5c2e3";
const sourceDir = path.resolve(process.argv[2] ?? "data/dumps/wiktionary-definitions");
const outputDir = path.resolve(process.argv[3] ?? "data/wiktionary-definitions");
const MAX_EXTRA_FORMS = 2, ALIAS_SOURCE_MAX_BYTES = 1_000_000;
type Source = { revision: string; files: { file: string; name: string; size: number }[] };
type Block = [string, string[]];
type Entry = [string, Block[]];
type Key = [string, number, number] | [string, number, number, string];
function blocks(html: string): Block[] {
  const out: Block[] = [];
  for (const block of html.matchAll(/<i>([^<>]+)<\/i><br\s*\/?><ol>([\s\S]*?)<\/ol>/gi)) {
    const senses = [...block[2].matchAll(/<li>([\s\S]*?)<\/li>/gi)].map((m) => cleanDictionaryText(m[1], true)).filter(Boolean).slice(0, 100);
    if (senses.length) out.push([cleanDictionaryText(block[1], true), senses]);
  }
  return out;
}
async function main() {
  const source = JSON.parse(fs.readFileSync(path.join(sourceDir, "sources.json"), "utf8")) as Source;
  if (source.revision !== REVISION || !Array.isArray(source.files)) throw new Error("Unexpected source revision or manifest");
  const world = JSON.parse(gunzipSync(fs.readFileSync("data/world-lexicon/wiktionary-translations.json.gz")).toString("utf8")) as { languages: { name: string; code: string }[] };
  const worldNames = new Map(world.languages.map((x) => [x.name.toLowerCase(), x.code]));
  const isoNames = new Map(iso6393.map((x) => [x.name.toLowerCase(), x.iso6391 || x.iso6393]));
  const overrides: Record<string, string> = { malay: "ms", mandarin: "cmn", chinese: "zh", greek: "el", swahili: "sw", cantonese: "yue", punjabi: "pa", kyrgyz: "ky", uyghur: "ug", pashto: "ps", occitan: "oc", "haitian creole": "ht", slovene: "sl", "waray-waray": "war", "brunei malay": "kxd", "old english": "ang", "middle english": "enm", "ancient greek": "grc", "old french": "fro", "old irish": "sga" };
  const languages: { name: string; code: string; entries: number }[] = [];
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "wikt-shards-"));
  const files = Array.from({ length: 256 }, (_, i) => fs.openSync(path.join(temp, i.toString(16).padStart(2, "0") + ".jsonl"), "w"));
  const buffers: string[] = Array(256).fill("");
  let sourceRows = 0, indexedEntries = 0, indexedKeys = 0, skippedNoSenses = 0, omittedExtraForms = 0;
  fs.mkdirSync(path.join(outputDir, "languages"), { recursive: true }); fs.mkdirSync(path.join(outputDir, "keys"), { recursive: true });
  try {
    for (const [id, item] of source.files.entries()) {
      const input = path.join(sourceDir, `${String(id).padStart(3, "0")}.tsv`);
      if (fs.statSync(input).size !== item.size) throw new Error(`Incorrect source file size: ${item.name}`);
      const name = item.name.toLowerCase(), code = overrides[name] ?? worldNames.get(name) ?? isoNames.get(name) ?? "other";
      const entries: Entry[] = [], maxExtra = item.size <= ALIAS_SOURCE_MAX_BYTES || item.name === "Indonesian" ? MAX_EXTRA_FORMS : 0;
      for await (const line of readline.createInterface({ input: fs.createReadStream(input, { encoding: "utf8" }), crlfDelay: Infinity })) {
        sourceRows++; const tab = line.indexOf("\t"); if (tab < 0) { skippedNoSenses++; continue; }
        const forms = line.slice(0, tab).split("|").filter(Boolean), lemma = forms[0]?.trim(), meanings = blocks(line.slice(tab + 1));
        if (!lemma || !meanings.length) { skippedNoSenses++; continue; }
        const valid = forms.slice(0, maxExtra + 1).filter((form) => form.length <= 120 && normalizeSearchKey(form));
        if (!valid.length) { skippedNoSenses++; continue; }
        omittedExtraForms += Math.max(0, forms.length - maxExtra - 1);
        const entryId = entries.length; entries.push([lemma, meanings]); const seen = new Set<string>();
        for (const form of valid) {
          const key = normalizeSearchKey(form); if (seen.has(key)) continue; seen.add(key);
          const row: Key = form === lemma || form === key ? [key, id, entryId] : [key, id, entryId, form];
          const shard = parseInt(definitionShard(key), 16); buffers[shard] += JSON.stringify(row) + "\n"; indexedKeys++;
          if (buffers[shard].length >= 65536) { fs.writeSync(files[shard], buffers[shard]); buffers[shard] = ""; }
        }
      }
      fs.writeFileSync(path.join(outputDir, "languages", `${String(id).padStart(3, "0")}.json.gz`), gzipSync(JSON.stringify(entries), { level: 8 }));
      languages.push({ name: item.name, code, entries: entries.length }); indexedEntries += entries.length;
      if ((id + 1) % 50 === 0) console.log(`${id + 1}/${source.files.length}: ${indexedEntries} entries`);
    }
    files.forEach((fd, i) => { if (buffers[i]) fs.writeSync(fd, buffers[i]); fs.closeSync(fd); });
    for (let i = 0; i < 256; i++) {
      const shard = i.toString(16).padStart(2, "0");
      const rows = fs.readFileSync(path.join(temp, `${shard}.jsonl`), "utf8").split("\n").filter(Boolean).map((row) => JSON.parse(row) as Key);
      rows.sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] - b[1] || a[2] - b[2]);
      fs.writeFileSync(path.join(outputDir, "keys", `${shard}.json.gz`), gzipSync(JSON.stringify(rows), { level: 8 }));
    }
  } finally { for (const fd of files) { try { fs.closeSync(fd); } catch {} } fs.rmSync(temp, { recursive: true, force: true }); }
  const manifest = { format: 1, sourceRevision: REVISION, sourceSnapshotDate: "2023-05-19", sourceLanguageCategories: source.files.length, indexedEntries, indexedKeys, sourceRows, skippedNoSenses, omittedExtraForms, maxExtraFormsPerEntry: MAX_EXTRA_FORMS, aliasPolicy: "Up to two additional source forms for dictionaries no larger than 1 MB and Indonesian; headwords only for other dictionaries.", languages };
  fs.writeFileSync(path.join(outputDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  console.log(JSON.stringify({ ...manifest, languages: `${languages.length} language categories` }, null, 2));
}
main().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
