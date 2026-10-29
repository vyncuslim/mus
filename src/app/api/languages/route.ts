import { NextResponse } from "next/server";
import { getIndexedCoverage } from "@/lib/dictionary-service";
import definitionManifest from "../../../../data/wiktionary-definitions/manifest.json";
import translationManifest from "../../../../data/world-lexicon/manifest.json";
import { getAllLanguages, SUPPORTED_UI_LOCALES } from "@/lib/languages";
import { reviewedTranslationCount } from "@/lib/reviewed-definitions";

export async function GET() {
  const coverage = await getIndexedCoverage();
  const languages = getAllLanguages().map((lang) => ({
    ...lang,
    headwordCount: coverage.countsByLanguage[lang.code] ?? 0,
    hasEntries: (coverage.countsByLanguage[lang.code] ?? 0) > 0,
    // Legacy fields are retained as unknown, not mislabeled entry counts.
    verifiedHeadwordCount: null,
    hasVerifiedEntries: null,
  }));

  return NextResponse.json(
    {
      languages,
      uiLocales: SUPPORTED_UI_LOCALES,
      definitionSnapshot: { languageCategories: definitionManifest.sourceLanguageCategories, entries: definitionManifest.indexedEntries, snapshotDate: definitionManifest.sourceSnapshotDate },
      translationIndex: { languages: translationManifest.languages, pairs: translationManifest.sourceTranslationPairs },
      summary: {
        totalEntries: coverage.totalEntries,
        totalVerifiedEntries: null,
        documentedDefinitionTranslationRecords: reviewedTranslationCount,
        verificationNote: "Entry counts are not proof of individual review. Legacy verified-entry fields are null because that count is not measured.",
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
