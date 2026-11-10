import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "@/db/schema";
import { getDb } from "@/db";
import { databaseIndexEntries, getIndexableEntries, getWordEntry } from "@/lib/dictionary-service";
import { ENTRY_INDEX_LIMIT, toIndexableEntry, wordPath } from "@/lib/entry-index";
import { excerpt, jsonForHtml, socialMetadata } from "@/lib/seo";
import nextConfig from "../../next.config";

vi.mock("@/db", () => ({ getDb: vi.fn() }));

const client = new PGlite();
const db = drizzle(client, { schema }) as unknown as PostgresJsDatabase<typeof schema>;

beforeAll(async () => {
  // The old schema has all detail columns, but not the optional reading indexes.
  await client.exec(`CREATE TABLE lexicon_entries (
    id text PRIMARY KEY, language text NOT NULL, headword text NOT NULL, senses jsonb NOT NULL,
    slug text, normalized_headword text, romanization text, ipa text, audio_locale text,
    parts_of_speech jsonb, etymology text, word_forms jsonb, grammar_note text,
    malay_morphology jsonb, kata_dasar text, related_words jsonb, frequency_rank integer,
    featured boolean, provenance jsonb, created_at timestamp, updated_at timestamp
  );`);
});
beforeEach(() => vi.mocked(getDb).mockReset());
afterAll(async () => { await client.close(); });

describe("indexable entry selection", () => {
  it("rejects unusable, unsupported, contentless or unsafe canonical paths", () => {
    for (const candidate of [
      { language: "xx", headword: "word", definition: "A meaning" },
      { language: "en", headword: ".", definition: "A meaning" },
      { language: "en", headword: "..", definition: "A meaning" },
      { language: "en", headword: " a ", definition: "A meaning" },
      { language: "en", headword: "a/b", definition: "A meaning" },
      { language: "en", headword: "a\\b", definition: "A meaning" },
      { language: "en", headword: "a\nword", definition: "A meaning" },
      { language: "en", headword: "x".repeat(121), definition: "A meaning" },
      { language: "en", headword: "\ud800", definition: "A meaning" },
      { language: "en", headword: "word", definition: "<script>bad()</script>" },
    ]) expect(toIndexableEntry(candidate)).toBeNull();
    const entry = toIndexableEntry({ language: "ar", headword: "عِلْم", definition: "<b>knowledge</b> &amp; learning" });
    expect(entry).toEqual({ language: "ar", headword: "عِلْم", definition: "knowledge & learning" });
    expect(wordPath(entry!.language, entry!.headword)).toBe(`/word/ar/${encodeURIComponent("عِلْم")}`);
  });

  it("uses the real starter details when there is no database", async () => {
    vi.mocked(getDb).mockReturnValue(null);
    const index = await getIndexableEntries();
    expect(index.dataSourceMode).toBe("starter_dataset");
    expect(index.entries.length).toBeGreaterThan(0);
    for (const item of index.entries) {
      const { entry } = await getWordEntry(item.language, item.headword);
      expect(entry?.headword).toBe(item.headword);
      expect(toIndexableEntry({ language: entry!.language, headword: entry!.headword, definition: entry!.senses[0]?.definition })).not.toBeNull();
    }
  });

  it("falls back for an empty or unreachable database, but not a populated one without indexable records", async () => {
    vi.mocked(getDb).mockReturnValue(db);
    expect((await getIndexableEntries()).dataSourceMode).toBe("starter_dataset");
    await client.exec(`INSERT INTO lexicon_entries(id, language, headword, senses) VALUES ('empty', 'en', 'empty', '[]'::jsonb), ('unsupported', 'xx', 'unsupported', '[{"definition":"real text"}]'::jsonb);`);
    expect(await getIndexableEntries()).toEqual({ entries: [], dataSourceMode: "postgresql" });
    vi.mocked(getDb).mockReturnValue({ select: () => { throw new Error("offline"); } } as unknown as PostgresJsDatabase<typeof schema>);
    expect((await getIndexableEntries()).dataSourceMode).toBe("starter_dataset");
  });

  it("filters empty records before applying the database limit", async () => {
    await client.exec(`
      INSERT INTO lexicon_entries(id, language, headword, senses)
      SELECT 'empty-' || n, 'en', '0empty-' || n, '[]'::jsonb FROM generate_series(1, 700) n;
      INSERT INTO lexicon_entries(id, language, headword, senses)
      SELECT 'real-' || n, 'en', 'word-' || lpad(n::text, 4, '0'), '[{"definition":"A real test definition"}]'::jsonb FROM generate_series(1, 650) n;
      INSERT INTO lexicon_entries(id, language, headword, senses)
      VALUES ('duplicate', 'en', 'word-0001', '[{"definition":"A real test definition"}]'::jsonb);
    `);
    const entries = await databaseIndexEntries(db);
    expect(entries).toHaveLength(ENTRY_INDEX_LIMIT);
    expect(entries[0]).toEqual({ language: "en", headword: "word-0001", definition: "A real test definition" });
    expect(entries.every((entry) => entry.headword.startsWith("word-"))).toBe(true);
    expect(new Set(entries.map((entry) => `${entry.language}/${entry.headword}`)).size).toBe(entries.length);
    vi.mocked(getDb).mockReturnValue(db);
    expect((await getIndexableEntries()).dataSourceMode).toBe("postgresql");
  });

  it("does not advertise DB words when a required detail column is missing", async () => {
    await client.exec("ALTER TABLE lexicon_entries DROP COLUMN provenance");
    vi.mocked(getDb).mockReturnValue(db);
    const index = await getIndexableEntries();
    expect(index.dataSourceMode).toBe("starter_dataset");
    expect(index.entries.some((entry) => entry.headword === "makanan")).toBe(true);
    expect(index.entries.some((entry) => entry.headword === "word-0001")).toBe(false);
  });
});

describe("metadata helpers", () => {
  it("escapes JSON-LD for HTML without changing its parsed values", () => {
    const payload = { name: '</script><script>alert("unsafe")</script>', description: "A < B & C" };
    const serialized = jsonForHtml(payload);
    expect(serialized).not.toContain("<");
    expect(JSON.parse(serialized)).toEqual(payload);
  });
  it("produces page-specific share URLs and Unicode-safe excerpts", () => {
    expect(socialMetadata("Title", "Description", "/sources").openGraph.url).toContain("/sources");
    expect(socialMetadata("Missing", "Description").openGraph.url).toBeUndefined();
    expect(excerpt("🍎🍊🍋🍐", 3)).toBe("🍎🍊…");
  });
  it("marks only Vercel preview deployments as noindex at the HTTP layer", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    let rules = await nextConfig.headers!();
    expect(rules[0].headers).toContainEqual({ key: "X-Robots-Tag", value: "noindex, nofollow" });
    vi.stubEnv("VERCEL_ENV", "production");
    rules = await nextConfig.headers!();
    expect(rules[0].headers.some((header) => header.key === "X-Robots-Tag")).toBe(false);
    vi.unstubAllEnvs();
  });
});
