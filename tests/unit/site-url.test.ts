import { describe, expect, it } from "vitest";
import { resolveSiteUrl } from "@/lib/site-url";

describe("deployment metadata origin", () => {
  it("uses an explicitly configured origin before Vercel's domains", () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: " https://dictionary.example/ ", VERCEL_PROJECT_PRODUCTION_URL: "auto.vercel.app", VERCEL_URL: "preview.vercel.app" })).toBe("https://dictionary.example");
  });

  it("uses the Vercel production URL, then the deployment URL, without assuming a project name", () => {
    expect(resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "words.example", VERCEL_URL: "preview.vercel.app" })).toBe("https://words.example");
    expect(resolveSiteUrl({ VERCEL_URL: "preview.vercel.app" })).toBe("https://preview.vercel.app");
    expect(resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "https://invalid.example/path", VERCEL_URL: "preview.vercel.app" })).toBe("https://preview.vercel.app");
  });

  it("falls back to local metadata only when no deployment URL is available", () => {
    expect(resolveSiteUrl({})).toBe("http://localhost:3000");
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "" })).toBe("http://localhost:3000");
  });

  it("rejects unsafe or malformed explicitly configured URLs", () => {
    for (const url of ["dictionary.example", "javascript:alert(1)", "https://user:secret@example.com", "https://example.com/path", "https://example.com/?q=cat", "https://example.com/#fragment"]) {
      expect(() => resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: url })).toThrow(/NEXT_PUBLIC_SITE_URL/);
    }
  });
});
