import { z } from "zod";
import catalog from "../../data/reviewed-definition-translations.json";
import { isDefinitionLanguage, type DefinitionLanguage } from "./translation-languages";
import type { LexiconEntry, WordSense } from "@/types/lexicon";
import type { DictionaryDefinitionGroup } from "./world-definitions";

const nonempty = z.string().min(1).max(10_000).refine((value) => Boolean(value.trim()));
const httpsUrl = z.string().max(2048).refine((value) => {
  try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password; } catch { return false; }
}, "Expected an HTTPS URL without credentials");
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}, "Expected a real calendar date");

/** Identifies the exact source sense a translation was reviewed against. */
export const ReviewSubjectSchema = z.object({
  origin: z.enum(["curated", "wiktionary-live", "wiktionary-snapshot"]),
  sourceUrl: httpsUrl,
  sourceVersion: nonempty.refine((value) => value.trim().toLowerCase() !== "unknown", "Source version is required"),
  headword: nonempty,
  language: nonempty,
  partOfSpeech: nonempty,
  definition: nonempty,
  // Structured dictionary entries need a stable sense identifier. Other
  // sources are matched on their full word/language/POS/text context instead.
  senseId: z.string().max(1000).default(""),
}).strict().refine((value) => value.origin !== "curated" || Boolean(value.senseId.trim()), "Curated senses require a sense ID");

/**
 * Metadata is required but cannot itself prove a real human did the review.
 * Maintainers must check the cited evidence, licence, and reviewer identity.
 */
export const ReviewedTranslationSchema = z.object({
  subject: ReviewSubjectSchema,
  target: z.string().refine((value): value is DefinitionLanguage => isDefinitionLanguage(value) && value !== "en", "Unsupported target language"),
  translation: nonempty,
  source: z.object({ name: nonempty, url: httpsUrl, license: nonempty, licenseUrl: httpsUrl, attribution: nonempty }).strict(),
  review: z.object({ reviewer: nonempty, reviewedAt: date, evidenceUrl: httpsUrl }).strict(),
}).strict();

export type ReviewSubject = z.infer<typeof ReviewSubjectSchema>;
export type ReviewedTranslation = z.infer<typeof ReviewedTranslationSchema>;

function normalized(value: string): string { return value.normalize("NFC").trim(); }
export function reviewKey(subject: ReviewSubject, target: string): string {
  return JSON.stringify([subject.origin, normalized(subject.sourceUrl), normalized(subject.sourceVersion), normalized(subject.headword), normalized(subject.language), normalized(subject.partOfSpeech).toLowerCase(), normalized(subject.definition), normalized(subject.senseId), target]);
}

/** Invalid or duplicate records are never shown as reviewed translations. */
export function validateReviewCatalog(input: unknown, asOf: string | undefined): { records: ReviewedTranslation[]; errors: string[] } {
  if (!Array.isArray(input)) return { records: [], errors: ["Review catalogue must be an array"] };
  // Without a shared, valid cutoff we cannot safely assess review dates.
  if (!asOf || !date.safeParse(asOf).success) return { records: [], errors: ["A valid UTC review-date cutoff is required"] };
  const records: ReviewedTranslation[] = [], errors: string[] = [];
  const keys = new Map<string, number>();
  input.forEach((row, index) => {
    const parsed = ReviewedTranslationSchema.safeParse(row);
    if (!parsed.success) { errors.push(`Record ${index + 1}: ${parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ")}`); return; }
    if (parsed.data.review.reviewedAt > asOf) { errors.push(`Record ${index + 1}: review date is in the future`); return; }
    const key = reviewKey(parsed.data.subject, parsed.data.target);
    if (keys.has(key)) errors.push(`Record ${index + 1}: duplicate review for the same sense and language`);
    keys.set(key, (keys.get(key) ?? 0) + 1);
    records.push(parsed.data);
  });
  return { records: records.filter((record) => keys.get(reviewKey(record.subject, record.target)) === 1), errors };
}

// The build supplies a single UTC cutoff to server and browser. Never rely on
// the reader's device clock, which could disagree with server rendering.
const reviewed = validateReviewCatalog(catalog, process.env.NEXT_PUBLIC_REVIEW_CATALOG_AS_OF);
const reviewedIndex = new Map(reviewed.records.map((record) => [reviewKey(record.subject, record.target), record]));
export const reviewedTranslationCount = reviewed.records.length;
export function findReviewedTranslation(subject: ReviewSubject, target: DefinitionLanguage, records?: readonly ReviewedTranslation[]): ReviewedTranslation | undefined {
  if (target === "en") return undefined;
  const key = reviewKey(subject, target);
  if (!records) return reviewedIndex.get(key);
  const matches = records.filter((record) => reviewKey(record.subject, record.target) === key);
  return matches.length === 1 ? matches[0] : undefined;
}

export function curatedSubject(entry: LexiconEntry, sense: WordSense): ReviewSubject {
  return { origin: "curated", sourceUrl: entry.provenance.sourceUrl, sourceVersion: entry.provenance.sourceVersion, headword: entry.headword, language: entry.language, partOfSpeech: sense.partOfSpeech, definition: sense.definition, senseId: `${entry.id}/${sense.id}` };
}
export function wiktionarySourceUrl(word: string): string { return `https://en.wiktionary.org/wiki/${encodeURIComponent(word.replace(/\s+/g, "_"))}`; }
export function dictionarySubject(group: DictionaryDefinitionGroup, fallbackWord: string, definition: string, origin: "wiktionary-live" | "wiktionary-snapshot"): ReviewSubject {
  const headword = group.headword ?? fallbackWord;
  return { origin, sourceUrl: wiktionarySourceUrl(headword), sourceVersion: origin === "wiktionary-live" ? "live-exact-text" : group.sourceVersion ?? "unknown", headword, language: group.languageCode === "other" ? `other:${group.languageName}` : group.languageCode, partOfSpeech: group.partOfSpeech, definition, senseId: "" };
}
