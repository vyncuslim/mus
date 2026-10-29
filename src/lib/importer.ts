import fs from "node:fs";
import readline from "node:readline";
import { z } from "zod";
import type {
  LanguageCode,
  LexiconEntry,
  PartOfSpeech,
  SenseExample,
  SenseTranslation,
  WordSense,
} from "@/types/lexicon";
import { LANGUAGE_REGISTRY, isValidLanguageCode } from "./languages";
import { normalizeSearchKey, normalizeUnicode } from "./text-normalize";

/**
 * Zod schema for validating raw Wiktextract / Kaikki.org JSONL lines.
 */
export const WiktextractRawSchema = z.object({
  word: z.string().min(1),
  lang_code: z.string().min(1),
  lang: z.string().optional(),
  pos: z.string().min(1),
  etymology_text: z.string().optional(),
  sounds: z
    .array(
      z.object({
        ipa: z.string().optional(),
        zh_pron: z.string().optional(),
        roman: z.string().optional(),
      })
    )
    .optional(),
  forms: z
    .array(
      z.object({
        form: z.string(),
        tags: z.array(z.string()).optional(),
      })
    )
    .optional(),
  senses: z
    .array(
      z.object({
        glosses: z.array(z.string()).min(1),
        raw_glosses: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
        topics: z.array(z.string()).optional(),
        examples: z
          .array(
            z.object({
              text: z.string(),
              english: z.string().optional(),
              translation: z.string().optional(),
              roman: z.string().optional(),
            })
          )
          .optional(),
        synonyms: z.array(z.object({ word: z.string() })).optional(),
        antonyms: z.array(z.object({ word: z.string() })).optional(),
        translations: z
          .array(
            z.object({
              code: z.string().optional(),
              lang_code: z.string().optional(),
              word: z.string(),
              roman: z.string().optional(),
              note: z.string().optional(),
            })
          )
          .optional(),
      })
    )
    .min(1),
  translations: z
    .array(
      z.object({
        code: z.string().optional(),
        lang_code: z.string().optional(),
        word: z.string(),
        sense: z.string().optional(),
        roman: z.string().optional(),
        note: z.string().optional(),
      })
    )
    .optional(),
});

export type WiktextractRawRecord = z.infer<typeof WiktextractRawSchema>;

const WIKTEXTRACT_LANG_MAP: Record<string, LanguageCode> = {
  ms: "ms",
  zlm: "ms",
  en: "en",
  zh: "zh-Hans",
  "zh-cn": "zh-Hans",
  "zh-hans": "zh-Hans",
  "zh-tw": "zh-Hant",
  "zh-hant": "zh-Hant",
  id: "id",
  ja: "ja",
  ko: "ko",
  th: "th",
  ar: "ar",
  es: "es",
  fr: "fr",
  de: "de",
};

const WIKTEXTRACT_POS_MAP: Record<string, PartOfSpeech> = {
  noun: "noun",
  name: "noun",
  verb: "verb",
  adj: "adjective",
  adjective: "adjective",
  adv: "adverb",
  adverb: "adverb",
  prep: "preposition",
  preposition: "preposition",
  postp: "preposition",
  pron: "pronoun",
  pronoun: "pronoun",
  conj: "conjunction",
  conjunction: "conjunction",
  intj: "interjection",
  interjection: "interjection",
  classifier: "classifier",
  counter: "classifier",
  proverb: "proverb",
  idiom: "idiom",
  phrase: "phrase",
};

export function mapWiktextractLangCode(rawCode: string): LanguageCode | null {
  const cleaned = rawCode.trim().toLowerCase();
  if (WIKTEXTRACT_LANG_MAP[cleaned]) {
    return WIKTEXTRACT_LANG_MAP[cleaned];
  }
  if (isValidLanguageCode(rawCode)) {
    return rawCode;
  }
  return null;
}

export function mapWiktextractPos(rawPos: string): PartOfSpeech {
  const cleaned = rawPos.trim().toLowerCase();
  return WIKTEXTRACT_POS_MAP[cleaned] ?? "noun";
}

export interface ImportStreamOptions {
  filePath: string;
  allowedLanguages?: LanguageCode[];
  sourceVersion?: string;
  importedAt?: string;
  maxRecords?: number;
}

export interface ImportPipelineResult {
  entries: LexiconEntry[];
  stats: {
    linesRead: number;
    recordsValidated: number;
    recordsSkippedLanguage: number;
    recordsInvalid: number;
    uniqueEntriesProduced: number;
    sensesMerged: number;
    sourceVersion: string;
    importedAt: string;
  };
}

/**
 * Normalizes a single validated Wiktextract record into a LexiconEntry.
 */
export function normalizeWiktextractRecord(
  raw: WiktextractRawRecord,
  options?: { sourceVersion?: string; importedAt?: string }
): LexiconEntry | null {
  const lang = mapWiktextractLangCode(raw.lang_code);
  if (!lang) return null;

  const headword = normalizeUnicode(raw.word);
  const normalizedHeadword = normalizeSearchKey(headword);
  if (!headword) return null;

  const pos = mapWiktextractPos(raw.pos);
  const meta = LANGUAGE_REGISTRY[lang];
  const sourceVersion = options?.sourceVersion ?? "wiktextract-2026-09";
  const importedAt = options?.importedAt ?? new Date().toISOString();

  const ipaSound = raw.sounds?.find((s) => s.ipa)?.ipa;
  const romanSound =
    raw.sounds?.find((s) => s.roman)?.roman ??
    raw.sounds?.find((s) => s.zh_pron)?.zh_pron;

  // Map top-level translations if sense-level translations are absent
  const topTranslationsMap = new Map<LanguageCode, SenseTranslation>();
  if (raw.translations) {
    for (const tr of raw.translations) {
      const targetLang = mapWiktextractLangCode(
        tr.lang_code ?? tr.code ?? ""
      );
      if (!targetLang || !tr.word.trim()) continue;
      const existing = topTranslationsMap.get(targetLang);
      if (!existing) {
        topTranslationsMap.set(targetLang, {
          language: targetLang,
          terms: [normalizeUnicode(tr.word)],
          romanization: tr.roman,
          notes: tr.note,
        });
      } else if (!existing.terms.includes(normalizeUnicode(tr.word))) {
        existing.terms.push(normalizeUnicode(tr.word));
      }
    }
  }

  const senses: WordSense[] = raw.senses.map((s, idx) => {
    const gloss = normalizeUnicode(s.glosses[0]);
    const senseTranslationsMap = new Map<LanguageCode, SenseTranslation>();

    if (s.translations && s.translations.length > 0) {
      for (const tr of s.translations) {
        const targetLang = mapWiktextractLangCode(
          tr.lang_code ?? tr.code ?? ""
        );
        if (!targetLang || !tr.word.trim()) continue;
        const existing = senseTranslationsMap.get(targetLang);
        if (!existing) {
          senseTranslationsMap.set(targetLang, {
            language: targetLang,
            terms: [normalizeUnicode(tr.word)],
            romanization: tr.roman,
            notes: tr.note,
          });
        } else if (!existing.terms.includes(normalizeUnicode(tr.word))) {
          existing.terms.push(normalizeUnicode(tr.word));
        }
      }
    } else if (idx === 0 && topTranslationsMap.size > 0) {
      for (const [k, v] of topTranslationsMap.entries()) {
        senseTranslationsMap.set(k, v);
      }
    }

    const examples: SenseExample[] = (s.examples ?? [])
      .filter((ex) => Boolean(ex.text?.trim()))
      .map((ex) => ({
        text: normalizeUnicode(ex.text),
        romanization: ex.roman,
        translations:
          ex.english || ex.translation
            ? { en: normalizeUnicode(ex.english ?? ex.translation ?? "") }
            : {},
      }));

    return {
      id: `${lang}-${normalizedHeadword || headword}-s${idx + 1}`,
      senseNumber: idx + 1,
      partOfSpeech: pos,
      domain: s.topics?.[0],
      register: s.tags?.[0],
      definition: gloss,
      localizedDefinitions: {
        en: gloss,
      },
      translations: Array.from(senseTranslationsMap.values()),
      examples,
      synonyms: (s.synonyms ?? []).map((syn) => normalizeUnicode(syn.word)),
      antonyms: (s.antonyms ?? []).map((ant) => normalizeUnicode(ant.word)),
    };
  });

  const slug = headword.replace(/\s+/g, "-");
  return {
    id: `${lang}-${slug}`,
    slug,
    headword,
    normalizedHeadword,
    language: lang,
    romanization: romanSound,
    ipa: ipaSound,
    audioLocale: meta.speechLocale,
    partsOfSpeech: [pos],
    etymology: raw.etymology_text
      ? normalizeUnicode(raw.etymology_text)
      : undefined,
    wordForms: raw.forms?.slice(0, 6).map((f) => ({
      label: f.tags?.join(", ") || "Form",
      form: normalizeUnicode(f.form),
    })),
    senses,
    provenance: {
      sourceName: "Kaikki.org / Wiktionary (Wiktextract JSONL Pipeline)",
      sourceUrl: `https://en.wiktionary.org/wiki/${encodeURIComponent(headword)}`,
      license: "CC BY-SA 4.0 / GFDL",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      sourceVersion,
      importedAt,
    },
  };
}

/**
 * Deduplicates and merges two LexiconEntry records for the same (language, headword)
 * without collapsing distinct senses or parts of speech.
 */
export function mergeLexiconEntries(
  existing: LexiconEntry,
  incoming: LexiconEntry
): { merged: LexiconEntry; addedSenses: number } {
  const partsOfSpeech = Array.from(
    new Set([...existing.partsOfSpeech, ...incoming.partsOfSpeech])
  );

  const existingSenseFingerprints = new Set(
    existing.senses.map(
      (s) => `${s.partOfSpeech}::${normalizeSearchKey(s.definition)}`
    )
  );

  const mergedSenses: WordSense[] = [...existing.senses];
  let addedSenses = 0;

  for (const incomingSense of incoming.senses) {
    const fingerprint = `${incomingSense.partOfSpeech}::${normalizeSearchKey(
      incomingSense.definition
    )}`;
    if (!existingSenseFingerprints.has(fingerprint)) {
      existingSenseFingerprints.add(fingerprint);
      addedSenses++;
      mergedSenses.push({
        ...incomingSense,
        senseNumber: mergedSenses.length + 1,
        id: `${existing.id}-s${mergedSenses.length + 1}`,
      });
    }
  }

  return {
    merged: {
      ...existing,
      partsOfSpeech,
      ipa: existing.ipa ?? incoming.ipa,
      romanization: existing.romanization ?? incoming.romanization,
      etymology: existing.etymology ?? incoming.etymology,
      senses: mergedSenses,
      provenance: incoming.provenance,
    },
    addedSenses,
  };
}

/**
 * Streams a Wiktextract JSONL file line-by-line without loading the entire file into memory.
 * Supports selective language filtering, validation, careful sense-preserving deduplication,
 * and idempotent output.
 */
export async function streamImportWiktextractJsonl(
  options: ImportStreamOptions
): Promise<ImportPipelineResult> {
  const {
    filePath,
    allowedLanguages,
    sourceVersion = "wiktextract-2026-09",
    importedAt = new Date().toISOString(),
    maxRecords = Infinity,
  } = options;

  const allowedSet =
    allowedLanguages && allowedLanguages.length > 0
      ? new Set<LanguageCode>(allowedLanguages)
      : null;

  const entryMap = new Map<string, LexiconEntry>();
  let linesRead = 0;
  let recordsValidated = 0;
  let recordsSkippedLanguage = 0;
  let recordsInvalid = 0;
  let sensesMerged = 0;

  const fileStream = fs.createReadStream(filePath, { encoding: "utf-8" });
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    linesRead++;

    if (recordsValidated >= maxRecords) {
      break;
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(trimmed);
    } catch {
      recordsInvalid++;
      continue;
    }

    const validation = WiktextractRawSchema.safeParse(parsedJson);
    if (!validation.success) {
      recordsInvalid++;
      continue;
    }

    const rawRecord = validation.data;
    const mappedLang = mapWiktextractLangCode(rawRecord.lang_code);
    if (!mappedLang || (allowedSet && !allowedSet.has(mappedLang))) {
      recordsSkippedLanguage++;
      continue;
    }

    const normalized = normalizeWiktextractRecord(rawRecord, {
      sourceVersion,
      importedAt,
    });
    if (!normalized) {
      recordsInvalid++;
      continue;
    }

    recordsValidated++;
    const key = `${normalized.language}::${normalized.headword}`;
    const existing = entryMap.get(key);

    if (!existing) {
      entryMap.set(key, normalized);
    } else {
      const { merged, addedSenses } = mergeLexiconEntries(
        existing,
        normalized
      );
      sensesMerged += addedSenses;
      entryMap.set(key, merged);
    }
  }

  return {
    entries: Array.from(entryMap.values()),
    stats: {
      linesRead,
      recordsValidated,
      recordsSkippedLanguage,
      recordsInvalid,
      uniqueEntriesProduced: entryMap.size,
      sensesMerged,
      sourceVersion,
      importedAt,
    },
  };
}
