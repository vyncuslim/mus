import path from "node:path";
import fs from "node:fs";
import { sql } from "drizzle-orm";
import { getDb, isDatabaseConfigured } from "../src/db";
import { importBatchesTable, lexiconEntriesTable, lexiconSearchKeysTable } from "../src/db/schema";
import { eq } from "drizzle-orm";
import { entrySearchKeys, readingKeys } from "../src/lib/entry-search-keys";
import {
  mapWiktextractLangCode,
  streamImportWiktextractJsonl,
} from "../src/lib/importer";
import type { LanguageCode } from "../src/types/lexicon";

async function main() {
  const args = process.argv.slice(2);
  let inputPath = path.resolve(
    process.cwd(),
    "data/samples/wiktextract-sample.jsonl"
  );
  let allowedLanguages: LanguageCode[] | undefined;
  let sourceVersion = "wiktextract-2026-09";
  let maxRecords = Infinity;
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--input" && args[i + 1]) {
      inputPath = path.resolve(process.cwd(), args[++i]);
    } else if (arg === "--lang" && args[i + 1]) {
      const codes = args[++i]
        .split(",")
        .map((c) => mapWiktextractLangCode(c))
        .filter((c): c is LanguageCode => Boolean(c));
      if (codes.length > 0) allowedLanguages = codes;
    } else if (arg === "--version" && args[i + 1]) {
      sourceVersion = args[++i];
    } else if (arg === "--limit" && args[i + 1]) {
      maxRecords = Number(args[++i]) || Infinity;
    } else if (arg === "--dry-run") {
      dryRun = true;
    }
  }

  if (!fs.existsSync(inputPath)) {
    console.error(`[Error] Input JSONL file not found: ${inputPath}`);
    process.exit(1);
  }

  console.log("=== Vynalth Lexicon — Wiktextract JSONL Streaming Importer ===");
  console.log(`Input file:       ${inputPath}`);
  console.log(
    `Language filter:  ${allowedLanguages ? allowedLanguages.join(", ") : "ALL SUPPORTED"}`
  );
  console.log(`Source version:   ${sourceVersion}`);
  console.log(`Mode:             ${dryRun ? "DRY RUN" : isDatabaseConfigured() ? "POSTGRESQL UPSERT" : "READ-ONLY VALIDATION"}`);

  const result = await streamImportWiktextractJsonl({
    filePath: inputPath,
    allowedLanguages,
    sourceVersion,
    maxRecords,
  });

  console.log("\n--- Import Pipeline Statistics ---");
  console.log(`Lines streamed:             ${result.stats.linesRead}`);
  console.log(`Records validated:          ${result.stats.recordsValidated}`);
  console.log(`Records skipped (language): ${result.stats.recordsSkippedLanguage}`);
  console.log(`Records invalid:            ${result.stats.recordsInvalid}`);
  console.log(`Unique entries produced:    ${result.stats.uniqueEntriesProduced}`);
  console.log(`Additional senses merged:   ${result.stats.sensesMerged}`);

  if (!dryRun && isDatabaseConfigured()) {
    const db = getDb();
    if (db) {
      console.log("\nUpserting validated records to PostgreSQL (idempotent)...");
      let inserted = 0;
      for (const entry of result.entries) {
        await db.transaction(async (tx) => {
        const [saved] = await tx
          .insert(lexiconEntriesTable)
          .values({
            id: entry.id,
            slug: entry.slug,
            headword: entry.headword,
            normalizedHeadword: entry.normalizedHeadword,
            language: entry.language,
            romanization: entry.romanization ?? null,
            ...readingKeys(entry.romanization),
            ipa: entry.ipa ?? null,
            audioLocale: entry.audioLocale,
            partsOfSpeech: entry.partsOfSpeech,
            etymology: entry.etymology ?? null,
            wordForms: entry.wordForms ?? null,
            grammarNote: entry.grammarNote ?? null,
            senses: entry.senses,
            malayMorphology: entry.malayMorphology ?? null,
            kataDasar: entry.malayMorphology?.kataDasar ?? null,
            relatedWords: entry.relatedWords ?? null,
            frequencyRank: entry.frequencyRank ?? null,
            featured: Boolean(entry.featured),
            provenance: entry.provenance,
          })
          .onConflictDoUpdate({
            target: [lexiconEntriesTable.language, lexiconEntriesTable.headword],
            set: {
              senses: sql`excluded.senses`,
              partsOfSpeech: sql`excluded.parts_of_speech`,
              slug: sql`excluded.slug`,
              normalizedHeadword: sql`excluded.normalized_headword`,
              romanization: sql`excluded.romanization`,
              normalizedReading: sql`excluded.normalized_reading`,
              compactReading: sql`excluded.compact_reading`,
              wordForms: sql`excluded.word_forms`,
              kataDasar: sql`excluded.kata_dasar`,
              malayMorphology: sql`excluded.malay_morphology`,
              provenance: sql`excluded.provenance`,
              updatedAt: new Date(),
            },
          }).returning({ id: lexiconEntriesTable.id });
        const searchKeys = entrySearchKeys({ ...entry, id: saved.id });
        await tx.delete(lexiconSearchKeysTable).where(eq(lexiconSearchKeysTable.entryId, saved.id));
        if (searchKeys.length) await tx.insert(lexiconSearchKeysTable).values(searchKeys).onConflictDoNothing();
        });
        inserted++;
      }

      await db.insert(importBatchesTable).values({
        id: `batch-${Date.now()}`,
        sourceName: "Kaikki.org / Wiktionary (Wiktextract)",
        sourceVersion: result.stats.sourceVersion,
        license: "CC BY-SA 4.0 / GFDL",
        languagesImported: Array.from(
          new Set(result.entries.map((e) => e.language))
        ),
        recordsProcessed: result.stats.linesRead,
        recordsInserted: inserted,
        recordsSkipped:
          result.stats.recordsSkippedLanguage + result.stats.recordsInvalid,
      });

      console.log(`Successfully upserted ${inserted} entries into PostgreSQL.`);
    }
  } else {
    console.log(
      "\nValidation complete. (Set DATABASE_URL and omit --dry-run to persist to PostgreSQL)."
    );
  }
}

main().catch((err) => {
  console.error("Importer failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
