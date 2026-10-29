import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { searchDictionary } from "@/lib/dictionary-service";
import { SUPPORTED_LANGUAGE_CODES } from "@/lib/languages";
import { checkRateLimit } from "@/lib/rate-limit";
import type {
  LanguageCode,
  MalayMorphologyType,
  PartOfSpeech,
} from "@/types/lexicon";

const VALID_POS: readonly PartOfSpeech[] = [
  "noun",
  "verb",
  "adjective",
  "adverb",
  "preposition",
  "pronoun",
  "conjunction",
  "interjection",
  "classifier",
  "idiom",
  "proverb",
  "phrase",
] as const;

const VALID_CATEGORIES: readonly MalayMorphologyType[] = [
  "kata_dasar",
  "kata_terbitan",
  "kata_majmuk",
  "kata_ganda",
  "peribahasa",
  "simpulan_bahasa",
  "penjodoh_bilangan",
] as const;

const SearchQuerySchema = z.object({
  q: z
    .string()
    .max(120, "Search query must not exceed 120 characters.")
    .default(""),
  source: z
    .string()
    .default("all")
    .refine(
      (val) =>
        val === "all" ||
        SUPPORTED_LANGUAGE_CODES.includes(val as LanguageCode),
      { message: "Unsupported source language code." }
    ),
  target: z
    .string()
    .default("all")
    .refine(
      (val) =>
        val === "all" ||
        SUPPORTED_LANGUAGE_CODES.includes(val as LanguageCode),
      { message: "Unsupported target language code." }
    ),
  pos: z
    .string()
    .default("all")
    .refine(
      (val) => val === "all" || VALID_POS.includes(val as PartOfSpeech),
      { message: "Unsupported part of speech filter." }
    ),
  category: z
    .string()
    .default("all")
    .refine(
      (val) =>
        val === "all" ||
        VALID_CATEGORIES.includes(val as MalayMorphologyType),
      { message: "Unsupported Malay morphology category filter." }
    ),
  limit: z.coerce
    .number()
    .int()
    .min(1, "Limit must be at least 1.")
    .max(100, "Limit must not exceed 100.")
    .default(30),
});

export async function GET(request: NextRequest) {
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "anonymous";
  const rate = checkRateLimit(`search:${clientIp}`, 120, 60_000);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        error: "Too many search requests. Please wait a moment and try again.",
        code: "RATE_LIMITED",
      },
      { status: 429 }
    );
  }

  const sp = request.nextUrl.searchParams;
  const rawParams = {
    q: sp.get("q") ?? "",
    source: sp.get("source") ?? "all",
    target: sp.get("target") ?? "all",
    pos: sp.get("pos") ?? "all",
    category: sp.get("category") ?? "all",
    limit: sp.get("limit") ?? "30",
  };

  const parsed = SearchQuerySchema.safeParse(rawParams);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid search query parameters.",
        code: "INVALID_INPUT",
        issues: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 }
    );
  }

  try {
    const result = await searchDictionary({
      query: parsed.data.q,
      sourceLanguage: parsed.data.source as LanguageCode | "all",
      targetLanguage: parsed.data.target as LanguageCode | "all",
      partOfSpeech: parsed.data.pos as PartOfSpeech | "all",
      category: parsed.data.category as MalayMorphologyType | "all",
      limit: parsed.data.limit,
    });

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        "X-RateLimit-Remaining": String(rate.remaining),
      },
    });
  } catch {
    return NextResponse.json(
      {
        error: "An unexpected error occurred while executing search.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
