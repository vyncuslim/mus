import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { searchDefinitionIndex } from "@/lib/definition-index";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
const schema = z.object({ q: z.string().trim().min(1).max(120), limit: z.coerce.number().int().min(1).max(80).default(60) });

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
  if (!checkRateLimit(`definitions:${ip}`, 120, 60_000).allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  const parsed = schema.safeParse({ q: request.nextUrl.searchParams.get("q"), limit: request.nextUrl.searchParams.get("limit") ?? "60" });
  if (!parsed.success) return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  try {
    const result = await searchDefinitionIndex(parsed.data.q, parsed.data.limit);
    return NextResponse.json(result, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
  } catch {
    return NextResponse.json({ error: "Dictionary snapshot is temporarily unavailable" }, { status: 503 });
  }
}
