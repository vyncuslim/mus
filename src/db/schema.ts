import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import type {
  LanguageCode,
  MalayMorphologyInfo,
  PartOfSpeech,
  SenseExample,
  SenseTranslation,
  SourceProvenance,
  WordSense,
} from "@/types/lexicon";

export const lexiconEntriesTable = pgTable(
  "lexicon_entries",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    headword: text("headword").notNull(),
    normalizedHeadword: text("normalized_headword").notNull(),
    language: text("language").$type<LanguageCode>().notNull(),
    romanization: text("romanization"),
    ipa: text("ipa"),
    audioLocale: text("audio_locale").notNull(),
    partsOfSpeech: jsonb("parts_of_speech").$type<PartOfSpeech[]>().notNull(),
    etymology: text("etymology"),
    wordForms: jsonb("word_forms").$type<{ label: string; form: string }[]>(),
    grammarNote: text("grammar_note"),
    senses: jsonb("senses").$type<WordSense[]>().notNull(),
    malayMorphology: jsonb("malay_morphology").$type<MalayMorphologyInfo>(),
    kataDasar: text("kata_dasar"),
    relatedWords: jsonb("related_words").$type<
      { word: string; language: LanguageCode; relation: string }[]
    >(),
    frequencyRank: integer("frequency_rank"),
    featured: boolean("featured").default(false).notNull(),
    provenance: jsonb("provenance").$type<SourceProvenance>().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("idx_lexicon_lang_headword").on(table.language, table.headword),
    index("idx_lexicon_lang_normalized").on(
      table.language,
      table.normalizedHeadword
    ),
    index("idx_lexicon_normalized").on(table.normalizedHeadword),
    index("idx_lexicon_kata_dasar").on(table.kataDasar),
    index("idx_lexicon_featured").on(table.featured),
  ]
);

export const senseTranslationsTable = pgTable(
  "sense_translations",
  {
    id: text("id").primaryKey(),
    entryId: text("entry_id")
      .notNull()
      .references(() => lexiconEntriesTable.id, { onDelete: "cascade" }),
    senseId: text("sense_id").notNull(),
    sourceLanguage: text("source_language").$type<LanguageCode>().notNull(),
    targetLanguage: text("target_language").$type<LanguageCode>().notNull(),
    term: text("term").notNull(),
    normalizedTerm: text("normalized_term").notNull(),
    romanization: text("romanization"),
    notes: text("notes"),
  },
  (table) => [
    index("idx_translations_target_norm").on(
      table.targetLanguage,
      table.normalizedTerm
    ),
    index("idx_translations_entry").on(table.entryId),
  ]
);

export const importBatchesTable = pgTable("import_batches", {
  id: text("id").primaryKey(),
  sourceName: text("source_name").notNull(),
  sourceVersion: text("source_version").notNull(),
  license: text("license").notNull(),
  languagesImported: jsonb("languages_imported").$type<string[]>().notNull(),
  recordsProcessed: integer("records_processed").notNull(),
  recordsInserted: integer("records_inserted").notNull(),
  recordsSkipped: integer("records_skipped").notNull(),
  importedAt: timestamp("imported_at").defaultNow().notNull(),
});

export type DbLexiconEntry = typeof lexiconEntriesTable.$inferSelect;
export type NewDbLexiconEntry = typeof lexiconEntriesTable.$inferInsert;
export type SenseExampleRecord = SenseExample;
export type SenseTranslationRecord = SenseTranslation;
