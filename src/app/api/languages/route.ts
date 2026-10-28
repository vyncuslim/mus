import { NextResponse } from "next/server";
import { getIndexedCoverage } from "@/lib/dictionary-service";
import definitionManifest from "../../../../data/wiktionary-definitions/manifest.json";
import translationManifest from "../../../../data/world-lexicon/manifest.json";
import { getAllLanguages, SUPPORTED_UI_LOCALES } from "@/lib/languages";

export async function GET() {
  const coverage = await getIndexedCoverage();
  const languages = getAllLanguages().map((lang) => ({
    ...lang,
    verifiedHeadwordCount: coverage.countsByLanguage[lang.code] ?? 0,
    hasVerifiedEntries: (coverage.countsByLanguage[lang.code] ?? 0) > 0,
  }));

  return NextResponse.json(
    {
      languages,
      uiLocales: SUPPORTED_UI_LOCALES,
      definitionSnapshot: { languageCategories: definitionManifest.sourceLanguageCategories, entries: definitionManifest.indexedEntries, snapshotDate: definitionManifest.sourceSnapshotDate },
      translationIndex: { languages: translationManifest.languages, pairs: translationManifest.sourceTranslationPairs },
      summary: {
        totalVerifiedEntries: coverage.totalEntries,
        totalSenses: coverage.totalSenses,
        totalTranslations: coverage.totalTranslations,
        totalExamples: coverage.totalExamples,
        languagesWithHeadwords: coverage.languagesWithHeadwords,
        sourceName: coverage.sourceName,
        sourceVersion: coverage.sourceVersion,
        license: coverage.license,
      },
    },
    { status: 200 }
  );
}
