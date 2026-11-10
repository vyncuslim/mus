import { isValidLanguageCode } from "@/lib/languages";
import { normalizeUnicode } from "@/lib/text-normalize";
import { cleanDictionaryText } from "@/lib/world-definitions";
import type { LanguageCode } from "@/types/lexicon";

/** The browse page and sitemap intentionally expose only a bounded selection. */
export const ENTRY_INDEX_LIMIT = 500;

export interface EntryIndexItem {
  language: LanguageCode;
  headword: string;
  definition: string;
}

export function wordPath(language: LanguageCode, headword: string): string {
  return `/word/${language}/${encodeURIComponent(headword)}`;
}

/** Only advertise a canonical URL when its detail route has real content. */
export function toIndexableEntry(candidate: {
  language: string;
  headword: string;
  definition: unknown;
}): EntryIndexItem | null {
  const { language, headword } = candidate;
  if (
    !isValidLanguageCode(language) ||
    !headword || headword.length > 120 ||
    headword !== normalizeUnicode(headword) ||
    headword === "." || headword === ".." ||
    headword.includes("/") || headword.includes("\\") ||
    Array.from(headword).some((character) => { const code = character.codePointAt(0)!; return code < 32 || (code >= 127 && code <= 159); }) ||
    typeof candidate.definition !== "string"
  ) return null;

  // Bad UTF-16 cannot be encoded into a URL. Postgres text cannot normally
  // contain it, but this also protects starter data or other callers.
  try { encodeURIComponent(headword); } catch { return null; }
  const definition = cleanDictionaryText(candidate.definition);
  return definition ? { language, headword, definition } : null;
}
