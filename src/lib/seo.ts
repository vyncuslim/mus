import { BRAND_NAME, BRAND_SOCIAL_IMAGE } from "@/lib/brand";
import { resolveSiteUrl } from "@/lib/site-url";

export const HOME_TITLE = "Vynalth Dictionary — 多语言词典 | Malay, English & 中文";
export const HOME_DESCRIPTION = "Search meanings across languages using open Wiktionary sources. 查询马来语、英语、中文等词汇；收录范围因语言而异。";

/** Serialize structured data safely inside an HTML script element. */
export function jsonForHtml(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function socialMetadata(title: string, description: string, path?: string) {
  return {
    openGraph: {
      type: "website" as const,
      siteName: BRAND_NAME,
      title,
      description,
      ...(path ? { url: `${resolveSiteUrl()}${path === "/" ? "" : path}` } : {}),
      images: [BRAND_SOCIAL_IMAGE],
    },
    twitter: { card: "summary_large_image" as const, title, description, images: [BRAND_SOCIAL_IMAGE] },
  };
}

/** Limit excerpts without splitting Unicode code points. */
export function excerpt(text: string, max = 150): string {
  const characters = Array.from(text.replace(/\s+/gu, " ").trim());
  return characters.length > max ? `${characters.slice(0, max - 1).join("").trimEnd()}…` : characters.join("");
}
