import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET as getSearch } from "@/app/api/search/route";
import { GET as getWord } from "@/app/api/words/[language]/[word]/route";
import { GET as getLanguages } from "@/app/api/languages/route";
import { GET as getSuggestions } from "@/app/api/suggestions/route";
import { GET as getHealth } from "@/app/api/health/route";

describe("API Route Handlers", () => {
  it("GET /api/search returns 200 with verified matches and real latency", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/search?q=makanan&source=ms&target=en"
    );
    const res = await getSearch(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.exactMatches[0].entry.headword).toBe("makanan");
    expect(typeof body.latencyMs).toBe("number");
  });

  it("GET /api/search returns 400 on invalid language code or excessive query length", async () => {
    const invalidLangReq = new NextRequest(
      "http://localhost:3000/api/search?q=test&source=invalid-lang"
    );
    const res1 = await getSearch(invalidLangReq);
    expect(res1.status).toBe(400);

    const longQuery = "a".repeat(150);
    const longReq = new NextRequest(
      `http://localhost:3000/api/search?q=${longQuery}`
    );
    const res2 = await getSearch(longReq);
    expect(res2.status).toBe(400);
  });

  it("GET /api/words/[language]/[word] returns 200 for existing entry and 404 for unknown word", async () => {
    const okReq = new NextRequest(
      "http://localhost:3000/api/words/ms/makanan"
    );
    const okRes = await getWord(okReq, {
      params: Promise.resolve({ language: "ms", word: "makanan" }),
    });
    expect(okRes.status).toBe(200);
    const okBody = await okRes.json();
    expect(okBody.entry.headword).toBe("makanan");
    expect(okBody.morphologyFamily.length).toBeGreaterThan(0);

    const missingReq = new NextRequest(
      "http://localhost:3000/api/words/en/nonexistentwordxyz"
    );
    const missingRes = await getWord(missingReq, {
      params: Promise.resolve({ language: "en", word: "nonexistentwordxyz" }),
    });
    expect(missingRes.status).toBe(404);
  });

  it("GET /api/languages returns all 12 supported languages and truthful entry counts", async () => {
    const res = await getLanguages();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.languages).toHaveLength(12);
    expect(body.summary.totalVerifiedEntries).toBeGreaterThan(25);
  });

  it("GET /api/suggestions validates input and returns prefix/typo suggestions", async () => {
    const okReq = new NextRequest(
      "http://localhost:3000/api/suggestions?q=makan&lang=ms"
    );
    const okRes = await getSuggestions(okReq);
    expect(okRes.status).toBe(200);
    const okBody = await okRes.json();
    expect(okBody.suggestions.length).toBeGreaterThan(0);

    const badReq = new NextRequest("http://localhost:3000/api/suggestions?q=");
    const badRes = await getSuggestions(badReq);
    expect(badRes.status).toBe(400);
  });

  it("GET /api/health reports starter_dataset fallback when DATABASE_URL is absent", async () => {
    const res = await getHealth();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("ok");
    expect(body.database.mode).toBe("starter_dataset");
  });
});
