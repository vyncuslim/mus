import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { searchWorldIndex } from "@/lib/world-index";
import { checkRateLimit } from "@/lib/rate-limit";
const schema = z.object({ q: z.string().max(120).default(""), lang: z.string().regex(/^(all|[a-zA-Z0-9-]{2,24})$/).default("all"), limit: z.coerce.number().int().min(1).max(200).default(40) });
export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
  if (!checkRateLimit(`world:${ip}`, 180, 60_000).allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  const p = request.nextUrl.searchParams, parsed = schema.safeParse({ q: p.get("q") ?? "", lang: p.get("lang") ?? "all", limit: p.get("limit") ?? "40" });
  if (!parsed.success) return NextResponse.json({ error: "Invalid query parameters" }, { status: 400 });
  try { return NextResponse.json(await searchWorldIndex(parsed.data.q, parsed.data.lang, parsed.data.limit), { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }); }
  catch { return NextResponse.json({ error: "Multilingual index is temporarily unavailable" }, { status: 503 }); }
}
