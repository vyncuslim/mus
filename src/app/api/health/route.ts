import { NextResponse } from "next/server";
import { checkDatabaseHealth } from "@/db";
import { getIndexedCoverage } from "@/lib/dictionary-service";
import definitionManifest from "../../../../data/wiktionary-definitions/manifest.json";
import translationManifest from "../../../../data/world-lexicon/manifest.json";

export async function GET() {
  const dbHealth = await checkDatabaseHealth();
  const coverage = await getIndexedCoverage();
  const structuredMode = coverage.sourceName.startsWith("PostgreSQL entries") ? "postgresql" : "starter_dataset";

  return NextResponse.json(
    {
      status: "ok",
      service: "vynalth-lexicon",
      timestamp: new Date().toISOString(),
      database: {
        configured: dbHealth.configured,
        connected: dbHealth.connected,
        mode: structuredMode,
        message: dbHealth.connected && structuredMode === "starter_dataset" ? "PostgreSQL is connected but structured entries are unavailable or empty; serving starter data." : dbHealth.message,
      },
      definitionSnapshot: { languageCategories: definitionManifest.sourceLanguageCategories, entries: definitionManifest.indexedEntries, snapshotDate: definitionManifest.sourceSnapshotDate },
      translationIndex: { languages: translationManifest.languages, pairs: translationManifest.sourceTranslationPairs },
      lexicon: {
        totalVerifiedEntries: coverage.totalEntries,
        languagesWithHeadwords: coverage.languagesWithHeadwords,
        sourceVersion: coverage.sourceVersion,
        license: coverage.license,
      },
    },
    { status: 200 }
  );
}
