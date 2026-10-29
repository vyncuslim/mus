export type LanguageCode =
  | "ms"
  | "en"
  | "zh-Hans"
  | "zh-Hant"
  | "id"
  | "ja"
  | "ko"
  | "th"
  | "ar"
  | "es"
  | "fr"
  | "de";

export type UiLocale = "en" | "ms" | "zh-Hans";

export type PartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "preposition"
  | "pronoun"
  | "conjunction"
  | "interjection"
  | "classifier"
  | "idiom"
  | "proverb"
  | "phrase";

export type MalayMorphologyType =
  | "kata_dasar"
  | "kata_terbitan"
  | "kata_majmuk"
  | "kata_ganda"
  | "peribahasa"
  | "simpulan_bahasa"
  | "penjodoh_bilangan";

export type MalayAffixType =
  | "none"
  | "awalan"
  | "akhiran"
  | "apitan"
  | "sisipan";

export type MalayGolonganKata =
  | "kata_nama"
  | "kata_kerja"
  | "kata_adjektif"
  | "kata_sendi_nama"
  | "kata_tugas"
  | "penjodoh_bilangan"
  | "peribahasa"
  | "simpulan_bahasa";

export interface MalayMorphologyInfo {
  morphologyType: MalayMorphologyType;
  golonganKata: MalayGolonganKata;
  kataDasar: string;
  affixType: MalayAffixType;
  affixPattern?: string;
  formula?: string;
  morphophonemicRule?: string;
  explanationMs: string;
  explanationEn: string;
  explanationZh?: string;
  derivedWords?: string[];
  classifierUsage?: {
    targetTypes: string[];
    examples: string[];
  };
  literalMeaning?: string;
  verificationMethod: "verified_lexical_entry" | "verified_rule_mapping";
}

export interface SenseTranslation {
  language: LanguageCode;
  terms: string[];
  romanization?: string;
  notes?: string;
}

export interface SenseExample {
  text: string;
  romanization?: string;
  translations: Partial<Record<LanguageCode, string>>;
  source?: string;
}

export interface WordSense {
  id: string;
  senseNumber: number;
  partOfSpeech: PartOfSpeech;
  register?: string;
  domain?: string;
  definition: string;
  localizedDefinitions: Partial<Record<LanguageCode, string>>;
  translations: SenseTranslation[];
  examples: SenseExample[];
  synonyms: string[];
  antonyms: string[];
}

export interface SourceProvenance {
  sourceName: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
  sourceVersion: string;
  importedAt: string;
}

export interface LexiconEntry {
  id: string;
  slug: string;
  headword: string;
  normalizedHeadword: string;
  language: LanguageCode;
  romanization?: string;
  ipa?: string;
  audioLocale: string;
  partsOfSpeech: PartOfSpeech[];
  etymology?: string;
  wordForms?: { label: string; form: string }[];
  grammarNote?: string;
  senses: WordSense[];
  malayMorphology?: MalayMorphologyInfo;
  relatedWords?: { word: string; language: LanguageCode; relation: string }[];
  frequencyRank?: number;
  featured?: boolean;
  provenance: SourceProvenance;
}

export type MatchType =
  | "exact"
  | "normalized"
  | "morphology"
  | "translation"
  | "prefix"
  | "word_form"
  | "definition";

export interface SearchResultItem {
  entry: LexiconEntry;
  matchType: MatchType;
  score: number;
  matchedTerm?: string;
  targetTranslations: SenseTranslation[];
}

export interface SearchSuggestion {
  word: string;
  language: LanguageCode;
  romanization?: string;
  partOfSpeech: PartOfSpeech;
  shortDefinition: string;
  distance: number;
  reason: "prefix" | "typo_tolerant" | "morphology" | "translation";
}

export interface SearchResponse {
  query: string;
  normalizedQuery: string;
  sourceLanguage: LanguageCode | "all";
  targetLanguage: LanguageCode | "all";
  partOfSpeechFilter?: PartOfSpeech | "all";
  categoryFilter?: MalayMorphologyType | "all";
  totalResults: number;
  exactMatches: SearchResultItem[];
  prefixMatches: SearchResultItem[];
  relatedMatches: SearchResultItem[];
  suggestions: SearchSuggestion[];
  ruleAnalysis?: {
    input: string;
    possibleKataDasar: string;
    affixType: MalayAffixType;
    affixPattern: string;
    explanationEn: string;
    explanationMs: string;
    verifiedEntryExists: boolean;
  } | null;
  latencyMs: number;
  dataSourceMode: "postgresql" | "starter_dataset";
}

export interface LanguageMetadata {
  code: LanguageCode;
  bcp47: string;
  speechLocale: string;
  englishName: string;
  nativeName: string;
  localizedNames: Record<UiLocale, string>;
  script: string;
  direction: "ltr" | "rtl";
  fontClass: string;
  flagCode: string;
  regionLabel: string;
  uiSupported: boolean;
  coverageNote: Record<UiLocale, string>;
}
