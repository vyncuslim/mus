import { NextResponse } from "next/server";
import { getDatasetCoverageSummary } from "@/data/starter-lexicon";
import { getAllIndexedEntries } from "@/lib/dictionary-service";
import { getAllLanguages, SUPPORTED_UI_LOCALES } from "@/lib/languages";

export async function GET() {
  const entries = await getAllIndexedEntries();
  const coverage = getDatasetCoverageSummary(entries);
  const languages = getAllLanguages().map((lang) => ({
    ...lang,
    verifiedHeadwordCount: coverage.countsByLanguage[lang.code] ?? 0,
    hasVerifiedEntries: (coverage.countsByLanguage[lang.code] ?? 0) > 0,
  }));

  return NextResponse.json(
    {
      languages,
      uiLocales: SUPPORTED_UI_LOCALES,
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
