import type { DictionaryDefinitionGroup } from "@/lib/world-definitions";

// Directly verified against the linked English Wiktionary REST entry on 2026-10-28.
// Kept separate from the older 2023 snapshot; never infer new Malay roots.
export const RECENT_WIKTIONARY_SEEDS: DictionaryDefinitionGroup[] = [{
  headword: "mengikut",
  sourceVersion: "wiktionary-check-2026-10-28",
  languageCode: "ms",
  languageName: "Malay",
  partOfSpeech: "Verb",
  senses: [{ definition: "active of ikut", examples: [] }],
}];
