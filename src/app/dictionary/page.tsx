import React, { Suspense } from "react";
import type { Metadata } from "next";
import { searchDictionary } from "@/lib/dictionary-service";
import { isValidLanguageCode } from "@/lib/languages";
import { DictionaryClient } from "@/components/DictionaryClient";
import type {
  LanguageCode,
  MalayMorphologyType,
  PartOfSpeech,
} from "@/types/lexicon";

export const metadata: Metadata = {
  title: "Multilingual Dictionary Search",
  description:
    "Search verified Wiktionary/Wiktextract headwords, sense-aligned translations, IPA pronunciations, and Bahasa Melayu morphological root structures.",
  alternates: {
    canonical: "/dictionary",
  },
};

export default async function DictionaryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const rawSource = typeof sp.source === "string" ? sp.source : "all";
  const rawTarget = typeof sp.target === "string" ? sp.target : "ms";
  const rawPos = typeof sp.pos === "string" ? sp.pos : "all";
  const rawCategory = typeof sp.category === "string" ? sp.category : "all";

  const sourceLanguage: LanguageCode | "all" =
    rawSource === "all" || isValidLanguageCode(rawSource) ? rawSource : "all";
  const targetLanguage: LanguageCode | "all" =
    rawTarget === "all" || isValidLanguageCode(rawTarget) ? rawTarget : "ms";

  const initialResponse = await searchDictionary({
    query: q,
    sourceLanguage,
    targetLanguage,
    partOfSpeech: rawPos as PartOfSpeech | "all",
    category: rawCategory as MalayMorphologyType | "all",
  });

  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-12 text-sm text-ink-500">
          Loading dictionary search...
        </div>
      }
    >
      <DictionaryClient initialResponse={initialResponse} />
    </Suspense>
  );
}
