import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAutocompleteSuggestions } from "@/lib/dictionary-service";
import { SUPPORTED_LANGUAGE_CODES } from "@/lib/languages";
import { checkRateLimit } from "@/lib/rate-limit";
import type { LanguageCode } from "@/types/lexicon";

const SuggestionsSchema = z.object({
  q: z.string().min(1).max(80),
  lang: z
    .string()
    .default("all")
    .refine(
      (val) =>
        val === "all" ||
        SUPPORTED_LANGUAGE_CODES.includes(val as LanguageCode),
      { message: "Invalid language filter." }
    ),
  limit: z.coerce.number().int().min(1).max(20).default(6),
});

export async function GET(request: NextRequest) {
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "anonymous";
  const rate = checkRateLimit(`suggestions:${clientIp}`, 180, 60_000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded.", code: "RATE_LIMITED" },
      { status: 429 }
    );
  }

  const sp = request.nextUrl.searchParams;
  const parsed = SuggestionsSchema.safeParse({
    q: sp.get("q") ?? "",
    lang: sp.get("lang") ?? "all",
    limit: sp.get("limit") ?? "6",
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid suggestion query parameters.",
        code: "INVALID_INPUT",
        issues: parsed.error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 }
    );
  }

  const suggestions = await getAutocompleteSuggestions(
    parsed.data.q,
    parsed.data.lang as LanguageCode | "all",
    parsed.data.limit
  );

  return NextResponse.json(
    {
      query: parsed.data.q,
      language: parsed.data.lang,
      suggestions,
    },
    { status: 200 }
  );
}
