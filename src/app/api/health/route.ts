import { NextResponse } from "next/server";
import { checkDatabaseHealth } from "@/db";
import { getDatasetCoverageSummary } from "@/data/starter-lexicon";
import { getAllIndexedEntries } from "@/lib/dictionary-service";

export async function GET() {
  const dbHealth = await checkDatabaseHealth();
  const entries = await getAllIndexedEntries();
  const coverage = getDatasetCoverageSummary(entries);

  return NextResponse.json(
    {
      status: "ok",
      service: "vynalth-lexicon",
      timestamp: new Date().toISOString(),
      database: {
        configured: dbHealth.configured,
        connected: dbHealth.connected,
        mode: dbHealth.mode,
        message: dbHealth.message,
      },
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
