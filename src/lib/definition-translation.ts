import { cleanDictionaryText } from "./world-definitions";
import type { DefinitionLanguage } from "./translation-languages";

export type TranslationErrorCode = "network" | "quota" | "unsupported" | "no_result" | "too_long";
export class DefinitionTranslationError extends Error {
  constructor(public code: TranslationErrorCode) { super(code); this.name = "DefinitionTranslationError"; }
}
const MAX_CHUNK_BYTES = 450; // MyMemory permits at most 500 UTF-8 bytes per request.
const MAX_CHUNKS = 8;
const encoder = new TextEncoder();
const bytes = (text: string) => encoder.encode(text).length;

/** Split without truncation, respecting UTF-8 boundaries and preferring word boundaries. */
export function splitDefinition(text: string, maxBytes = MAX_CHUNK_BYTES): string[] {
  if (maxBytes < 4) throw new RangeError("Chunk size must be at least 4 bytes");
  // MyMemory permits one paragraph per request. Preserve paragraph boundaries
  // before normalizing whitespace or splitting large paragraphs further.
  const paragraphs = text.trim().split(/\r?\n\s*\r?\n+/u).map((part) => part.replace(/\s+/gu, " ").trim()).filter(Boolean);
  const chunks: string[] = [];
  for (const source of paragraphs) {
    let current = "", currentBytes = 0;
    for (const character of source) {
      const size = bytes(character);
      if (currentBytes + size > maxBytes) {
        const boundary = current.lastIndexOf(" ");
        if (boundary > current.length / 2) {
          chunks.push(current.slice(0, boundary));
          current = current.slice(boundary + 1);
        } else {
          chunks.push(current.trim());
          current = "";
        }
        currentBytes = bytes(current);
      }
      current += character; currentBytes += size;
    }
    if (current.trim()) chunks.push(current.trim());
  }
  return chunks;
}
function equalSegment(a: string, b: string): boolean {
  return cleanDictionaryText(a).normalize("NFC").replace(/\s+/gu, " ").trim() === b.normalize("NFC").replace(/\s+/gu, " ").trim();
}
function matchingLanguage(actual: unknown, expected?: DefinitionLanguage): boolean {
  if (!expected || typeof actual !== "string" || !actual) return true;
  // Some providers use obsolete ISO aliases, or normalize the country subtag.
  const aliases: Record<string, string> = { iw: "he", in: "id" };
  const language = (tag: string) => { const primary = tag.toLowerCase().split("-")[0]; return aliases[primary] ?? primary; };
  return language(actual) === language(expected);
}
function plainResult(value: unknown): string {
  if (typeof value !== "string") return "";
  const text = cleanDictionaryText(value);
  return /^(mymemory warning|invalid (source|target) language|please select|query length limit)/i.test(text) ? "" : text;
}
/** Do not treat a fuzzy translation-memory match as a translation of our sentence. */
export function extractMyMemoryTranslation(payload: unknown, source: string, httpStatus = 200, target?: DefinitionLanguage): string {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new DefinitionTranslationError("network");
  const data = payload as { responseStatus?: unknown; responseDetails?: unknown; quotaFinished?: unknown; responseData?: { translatedText?: unknown; match?: unknown }; matches?: unknown };
  const status = Number(data.responseStatus ?? httpStatus), detail = typeof data.responseDetails === "string" ? data.responseDetails : "";
  if (data.quotaFinished === true || data.quotaFinished === "true" || status === 429 || httpStatus === 429 || /quota|daily.{0,12}limit|too many requests|usage limit/i.test(detail) || (typeof data.responseData?.translatedText === "string" && /^mymemory warning/i.test(data.responseData.translatedText))) throw new DefinitionTranslationError("quota");
  if (/invalid (source|target) language|language pair.{0,15}(not supported|invalid)/i.test(detail)) throw new DefinitionTranslationError("unsupported");
  if (httpStatus < 200 || httpStatus >= 300 || status !== 200) throw new DefinitionTranslationError("network");
  if (Array.isArray(data.matches)) {
    const matches = data.matches.filter((match): match is Record<string, unknown> => Boolean(match) && typeof match === "object" && !Array.isArray(match) && typeof match.segment === "string" && equalSegment(match.segment, source) && matchingLanguage(match.target, target) && Boolean(plainResult(match.translation)));
    const machine = matches.find((match) => /machine translation/i.test(String(match.reference ?? "")) || match["created-by"] === "MT!" || typeof match.model === "string");
    const chosen = machine ?? matches[0];
    if (chosen) return plainResult(chosen.translation);
    // A nonempty match list that contradicts the source or language is not
    // made reliable by a top-level score. Never substitute its fuzzy result.
    if (data.matches.length) throw new DefinitionTranslationError("no_result");
  }
  // A full exact-match response can be used when no match list is supplied.
  const exact = Number(data.responseData?.match) === 1 ? plainResult(data.responseData?.translatedText) : "";
  if (exact) return exact;
  throw new DefinitionTranslationError("no_result");
}
function cancelled(): Error { const error = new Error("Translation cancelled"); error.name = "AbortError"; return error; }

/**
 * Explicit opt-in browser request: source is the English dictionary definition.
 * Translations are unverified and must not be presented as source dictionary text.
 */
export async function translateDefinition(text: string, target: DefinitionLanguage, signal: AbortSignal): Promise<string> {
  if (target === "en") return text;
  const chunks = splitDefinition(text);
  if (!chunks.length) throw new DefinitionTranslationError("no_result");
  if (chunks.length > MAX_CHUNKS) throw new DefinitionTranslationError("too_long");
  const output: string[] = [];
  for (const chunk of chunks) {
    if (signal.aborted) throw cancelled();
    const request = new AbortController();
    const onAbort = () => request.abort();
    signal.addEventListener("abort", onAbort, { once: true });
    const timer = setTimeout(() => request.abort(), 12_000);
    try {
      const params = new URLSearchParams({ q: chunk, langpair: `en|${target}` });
      const response = await fetch(`https://api.mymemory.translated.net/get?${params}`, { signal: request.signal, credentials: "omit", referrerPolicy: "no-referrer", cache: "no-store" });
      const payload: unknown = await response.json();
      output.push(extractMyMemoryTranslation(payload, chunk, response.status, target));
    } catch (error) {
      if (signal.aborted) throw cancelled();
      if (error instanceof DefinitionTranslationError) throw error;
      throw new DefinitionTranslationError("network");
    } finally {
      clearTimeout(timer); signal.removeEventListener("abort", onAbort);
    }
  }
  return output.join(" ");
}
