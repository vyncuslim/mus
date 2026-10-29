import { NextRequest, NextResponse } from "next/server";
import { getWordEntry } from "@/lib/dictionary-service";
import { isValidLanguageCode } from "@/lib/languages";
import { analyzeMalayMorphology } from "@/lib/malay-morphology";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ language: string; word: string }> }
) {
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "anonymous";
  const rate = checkRateLimit(`word:${clientIp}`, 120, 60_000);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded.",
        code: "RATE_LIMITED",
      },
      { status: 429 }
    );
  }

  const { language, word } = await context.params;
  if (!isValidLanguageCode(language)) {
    return NextResponse.json(
      {
        error: `Unsupported language code '${language}'.`,
        code: "INVALID_LANGUAGE",
      },
      { status: 400 }
    );
  }

  // Framework params are already decoded.
  const cleanedWord = (word || "").trim();
  if (!cleanedWord || cleanedWord.length > 120) {
    return NextResponse.json(
      {
        error: "Invalid or excessively long word parameter.",
        code: "INVALID_WORD",
      },
      { status: 400 }
    );
  }

  try {
    const { entry, morphologyFamily, dataSourceMode } = await getWordEntry(
      language,
      cleanedWord
    );

    if (!entry) {
      const ruleAnalysis =
        language === "ms" ? analyzeMalayMorphology(cleanedWord) : null;
      return NextResponse.json(
        {
          error: `No structured dictionary entry found for '${cleanedWord}' in '${language}'.`,
          code: "WORD_NOT_FOUND",
          ruleAnalysis,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        entry,
        morphologyFamily,
        dataSourceMode,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
        },
      }
    );
  } catch {
    return NextResponse.json(
      {
        error: "Failed to retrieve word entry.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
