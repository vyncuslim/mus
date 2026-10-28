import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "@/db/schema";
import { STARTER_LEXICON_ENTRIES } from "@/data/starter-lexicon";
import { databaseCandidates, databaseCoverage, databaseWord } from "@/lib/dictionary-service";
import { entrySearchKeys, readingKeys } from "@/lib/entry-search-keys";
import { executeLexiconSearch } from "@/lib/search-engine";

const client = new PGlite();
const pglite = drizzle(client, { schema });
// The query builder used here is shared by the postgres-js and PGlite drivers.
const db = pglite as unknown as PostgresJsDatabase<typeof schema>;
const targetChinese = STARTER_LEXICON_ENTRIES.find((e) => e.id === "zh-hans-xuexi")!;
const targetEnglish = STARTER_LEXICON_ENTRIES.find((e) => e.id === "en-eat")!;
const targetMalay = STARTER_LEXICON_ENTRIES.find((e) => e.id === "ms-makanan")!;

beforeAll(async () => {
  await client.exec(`
    CREATE TABLE lexicon_entries (
      id text PRIMARY KEY, slug text NOT NULL, headword text NOT NULL,
      normalized_headword text NOT NULL, language text NOT NULL, romanization text,
      normalized_reading text, compact_reading text, ipa text, audio_locale text NOT NULL,
      parts_of_speech jsonb NOT NULL, etymology text, word_forms jsonb, grammar_note text,
      senses jsonb NOT NULL, malay_morphology jsonb, kata_dasar text, related_words jsonb,
      frequency_rank integer, featured boolean NOT NULL DEFAULT false, provenance jsonb NOT NULL,
      created_at timestamp DEFAULT now() NOT NULL, updated_at timestamp DEFAULT now() NOT NULL
    );
    CREATE TABLE lexicon_search_keys (entry_id text NOT NULL REFERENCES lexicon_entries(id), key text NOT NULL, kind text NOT NULL, PRIMARY KEY(entry_id,key,kind));
    CREATE INDEX test_headword_idx ON lexicon_entries(normalized_headword text_pattern_ops);
    CREATE INDEX test_reading_idx ON lexicon_entries(normalized_reading text_pattern_ops);
    CREATE INDEX test_compact_idx ON lexicon_entries(compact_reading text_pattern_ops);
    CREATE INDEX test_key_idx ON lexicon_search_keys(key text_pattern_ops);
    INSERT INTO lexicon_entries(id,slug,headword,normalized_headword,language,audio_locale,parts_of_speech,senses,provenance)
    SELECT 'a-' || lpad(n::text, 5, '0'), 'filler-' || n, 'filler-' || n, 'filler-' || n, 'en', 'en-US', '["noun"]'::jsonb, '[]'::jsonb, '{}'::jsonb FROM generate_series(1,2505) n;
  `);
  for (const entry of [targetChinese, targetEnglish, targetMalay]) {
    const id = `z-${entry.id}`;
    await pglite.insert(schema.lexiconEntriesTable).values({ id, slug: entry.slug, headword: entry.headword, normalizedHeadword: entry.normalizedHeadword, language: entry.language, romanization: entry.romanization ?? null, ...readingKeys(entry.romanization), audioLocale: entry.audioLocale, partsOfSpeech: entry.partsOfSpeech, ipa: entry.ipa ?? null, wordForms: entry.wordForms ?? null, senses: entry.senses, malayMorphology: entry.malayMorphology ?? null, kataDasar: entry.malayMorphology?.kataDasar ?? null, provenance: entry.provenance });
    const keys = entrySearchKeys({ ...entry, id });
    if (keys.length) await pglite.insert(schema.lexiconSearchKeysTable).values(keys);
  }
}, 30_000);
afterAll(async () => { await client.close(); });

describe("PostgreSQL search without the first-2,000-rows cap", () => {
  it("finds a headword and detail after 2,505 earlier rows", async () => {
    const candidates = await databaseCandidates(db, "makanan");
    expect(candidates.some((entry) => entry.id === "z-ms-makanan")).toBe(true);
    expect((await databaseWord(db, "ms", "makanan")).entry?.headword).toBe("makanan");
    expect((await databaseCoverage(db))?.totalEntries).toBe(2508);
  });
  it("matches normalized and compact readings after the cap", async () => {
    const candidates = await databaseCandidates(db, "xuexi");
    expect(candidates.some((entry) => entry.id === "z-zh-hans-xuexi")).toBe(true);
    const result = executeLexiconSearch({ query: "xuexi", entries: candidates, sourceLanguage: "zh-Hans", dataSourceMode: "postgresql" });
    expect(result.exactMatches[0].entry.headword).toBe("学习");
  });
  it("indexes actual word forms and translations rather than inventing them", async () => {
    const form = await databaseCandidates(db, "ate");
    expect(executeLexiconSearch({ query: "ate", entries: form }).prefixMatches.some((match) => match.entry.headword === "eat" && match.matchType === "word_form")).toBe(true);
    const translation = await databaseCandidates(db, "santap");
    expect(translation.some((entry) => entry.headword === "eat")).toBe(true);
  });
  it("continues core headword lookup on an old, unmigrated schema", async () => {
    await client.exec("DROP TABLE lexicon_search_keys; ALTER TABLE lexicon_entries DROP COLUMN normalized_reading; ALTER TABLE lexicon_entries DROP COLUMN compact_reading;");
    expect((await databaseCandidates(db, "makanan")).some((entry) => entry.headword === "makanan")).toBe(true);
    expect((await databaseWord(db, "ms", "makanan")).entry?.headword).toBe("makanan");
  });
});
