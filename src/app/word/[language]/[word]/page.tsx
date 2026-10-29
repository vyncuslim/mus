import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getWordEntry } from "@/lib/dictionary-service";
import { getLanguageMetadata, isValidLanguageCode } from "@/lib/languages";
import { analyzeMalayMorphology } from "@/lib/malay-morphology";
import { WordDetailClient } from "@/components/WordDetailClient";
import { ArrowLeft, GitBranch, SearchX } from "lucide-react";
import { resolveSiteUrl } from "@/lib/site-url";

const SITE_URL = resolveSiteUrl();

// Next page route params can still be percent-encoded in production. Decode
// once here, while keeping literal percent signs and malformed input safe.
function decodePageWord(word: string): string {
  try { return decodeURIComponent(word); } catch { return word; }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ language: string; word: string }>;
}): Promise<Metadata> {
  const { language, word } = await params;
  const decodedWord = decodePageWord(word || "");

  if (!isValidLanguageCode(language)) {
    return {
      title: "Unsupported Language",
      robots: { index: false, follow: false },
    };
  }

  const { entry } = await getWordEntry(language, decodedWord);
  if (!entry) {
    return {
      title: `${decodedWord} — Entry Not Found`,
      robots: { index: false, follow: false },
    };
  }

  const langMeta = getLanguageMetadata(entry.language);
  const firstDef = entry.senses[0]?.definition ?? "";
  const canonicalPath = `/word/${entry.language}/${encodeURIComponent(entry.headword)}`;

  return {
    title: `${entry.headword} (${langMeta.englishName}) — Definition, Translations & Pronunciation`,
    description: `${entry.headword}${entry.ipa ? ` ${entry.ipa}` : ""} in ${
      langMeta.englishName
    }: ${firstDef} Sense-aligned translations, examples, and Wiktionary CC BY-SA 4.0 provenance.`,
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: canonicalPath,
        ms: `${canonicalPath}?ui=ms`,
        "zh-Hans": `${canonicalPath}?ui=zh-Hans`,
      },
    },
    openGraph: {
      title: `${entry.headword} — ${langMeta.englishName} | Vynalth Lexicon`,
      description: firstDef,
      url: `${SITE_URL}${canonicalPath}`,
      type: "article",
    },
  };
}

export default async function WordDetailPage({
  params,
}: {
  params: Promise<{ language: string; word: string }>;
}) {
  const { language, word } = await params;
  const decodedWord = decodePageWord(word || "").trim();

  if (!isValidLanguageCode(language)) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-serif font-bold text-2xl text-ink-900 dark:text-white">
          Unsupported Language Code: &ldquo;{language}&rdquo;
        </h1>
        <p className="text-sm text-ink-600 dark:text-ink-400">
          Please choose one of the 12 supported languages in the language
          registry.
        </p>
        <Link
          href="/dictionary"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-lexicon-700 text-white text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dictionary</span>
        </Link>
      </div>
    );
  }

  const { entry, morphologyFamily, dataSourceMode } = await getWordEntry(
    language,
    decodedWord
  );

  if (!entry) {
    const ruleAnalysis =
      language === "ms" ? analyzeMalayMorphology(decodedWord) : null;

    return (
      <div
        data-testid="word-not-found-view"
        className="max-w-3xl mx-auto px-4 py-16 space-y-6"
      >
        <div className="rounded-3xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-ink-100 dark:bg-ink-800 text-ink-500 flex items-center justify-center mx-auto">
            <SearchX className="w-6 h-6" />
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-ink-900 dark:text-white">
            No structured entry for &ldquo;{decodedWord}&rdquo; ({language})
          </h1>
          <p className="text-sm text-ink-600 dark:text-ink-400 max-w-lg mx-auto">
            This headword was not found in the active {language.toUpperCase()}{" "}
            structured dataset. That does not mean the word does not exist; try
            searching the broader dictionary.
          </p>

          {ruleAnalysis && (
            <div className="rounded-2xl bg-lexicon-50 dark:bg-lexicon-950/60 border border-lexicon-200 dark:border-lexicon-800 p-5 text-left space-y-2 mt-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lexicon-800 dark:text-lexicon-300">
                <GitBranch className="w-4 h-4" />
                <span>Possible Malay root (rule-based)</span>
              </div>
              <p className="text-xs text-ink-600 dark:text-ink-400">This is a possible analysis, not confirmation that the word or its derivation exists.</p>
              <p className="text-sm text-ink-800 dark:text-ink-200">
                {ruleAnalysis.explanationEn}
              </p>
              <p className="text-xs text-ink-600 dark:text-ink-400 italic">
                {ruleAnalysis.explanationMs}
              </p>
              <div className="pt-2">
                <Link
                  href={`/word/ms/${encodeURIComponent(ruleAnalysis.possibleKataDasar)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-lexicon-700 text-white hover:bg-lexicon-800"
                >
                  <span>
                    Inspect Kata Dasar: {ruleAnalysis.possibleKataDasar} →
                  </span>
                </Link>
              </div>
            </div>
          )}

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/dictionary?q=${encodeURIComponent(decodedWord)}`}
              className="px-4 py-2.5 rounded-xl bg-lexicon-700 hover:bg-lexicon-800 text-white text-sm font-semibold"
            >
              Search &ldquo;{decodedWord}&rdquo; across all languages
            </Link>
            <Link
              href="/dictionary"
              className="px-4 py-2.5 rounded-xl border border-ink-200 dark:border-ink-700 text-ink-700 dark:text-ink-200 text-sm font-medium"
            >
              Browse Dictionary
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Schema.org DefinedTerm JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: entry.headword,
    description: entry.senses[0]?.definition,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: `Vynalth Lexicon (${entry.language.toUpperCase()})`,
      url: `${SITE_URL}/dictionary?source=${entry.language}`,
    },
    termCode: entry.id,
    url: `${SITE_URL}/word/${entry.language}/${encodeURIComponent(entry.headword)}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <WordDetailClient
        entry={entry}
        morphologyFamily={morphologyFamily}
        dataSourceMode={dataSourceMode}
      />
    </>
  );
}
