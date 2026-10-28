import type { LexiconEntry } from "@/types/lexicon";
import { normalizeCompactKey, normalizeSearchKey } from "./text-normalize";

export function readingKeys(romanization?: string | null): { normalizedReading: string | null; compactReading: string | null } {
  if (!romanization) return { normalizedReading: null, compactReading: null };
  return { normalizedReading: normalizeSearchKey(romanization) || null, compactReading: normalizeCompactKey(romanization) || null };
}

/** Derive searchable aliases from the entry itself, never inferred definitions or roots. */
export function entrySearchKeys(entry: Pick<LexiconEntry, "id" | "wordForms" | "senses">): { entryId: string; key: string; kind: string }[] {
  const keys = new Map<string, { entryId: string; key: string; kind: string }>();
  const add = (text: string, kind: string, split: RegExp) => {
    const normalized = normalizeSearchKey(text);
    for (const key of [normalized, ...normalized.split(split)]) {
      if (key && key.length <= 120) keys.set(`${kind}\0${key}`, { entryId: entry.id, key, kind });
    }
  };
  for (const form of entry.wordForms ?? []) add(form.form, "form", /[\s/()]+/);
  for (const sense of entry.senses ?? []) {
    for (const tr of sense.translations ?? []) for (const term of tr.terms) add(term, "translation", /\s+/);
    for (const synonym of sense.synonyms ?? []) add(synonym, "synonym", /\s+/);
  }
  return [...keys.values()];
}
