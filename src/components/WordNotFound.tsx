"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, GitBranch, SearchX } from "lucide-react";
import { isValidLanguageCode } from "@/lib/languages";
import { analyzeMalayMorphology } from "@/lib/malay-morphology";

export function WordNotFound() {
  const params = useParams<{ language: string; word: string }>();
  // The app router can supply an encoded segment here, as on the page route.
  // Decode once only so a literal "%C3%A9" is not mistaken for "é".
  let word = params?.word ?? "";
  try { word = decodeURIComponent(word); } catch { /* Keep malformed percent sequences intact. */ }
  word = word.trim().slice(0, 120);
  const language = params?.language ?? "";
  if (!isValidLanguageCode(language)) {
    return <div data-testid="word-not-found-view" className="mx-auto max-w-3xl space-y-4 px-4 py-16 text-center">
      <h1 className="font-serif text-2xl font-bold text-ink-900 dark:text-white">Unsupported Language Code: &ldquo;{language}&rdquo;</h1>
      <p className="text-sm text-ink-600 dark:text-ink-400">Please choose one of the 12 supported structured-entry languages.</p>
      <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-lexicon-700 px-4 py-2 text-sm font-semibold text-white"><ArrowLeft aria-hidden="true" className="h-4 w-4" />Return to Dictionary</Link>
    </div>;
  }

  const ruleAnalysis = language === "ms" ? analyzeMalayMorphology(word) : null;
  return <div data-testid="word-not-found-view" className="mx-auto max-w-3xl space-y-6 px-4 py-16">
    <div className="space-y-4 rounded-3xl border border-ink-200 bg-white p-8 text-center dark:border-ink-800 dark:bg-ink-900">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-100 text-ink-500 dark:bg-ink-800"><SearchX aria-hidden="true" className="h-6 w-6" /></div>
      <h1 className="font-serif text-2xl font-bold text-ink-900 dark:text-white sm:text-3xl">No structured entry for &ldquo;{word}&rdquo; ({language})</h1>
      <p className="mx-auto max-w-lg text-sm text-ink-600 dark:text-ink-400">This headword was not found in the active {language.toUpperCase()} structured dataset. That does not mean the word does not exist; try searching the broader dictionary.</p>
      {ruleAnalysis && <div className="mt-4 space-y-2 rounded-2xl border border-lexicon-200 bg-lexicon-50 p-5 text-left dark:border-lexicon-800 dark:bg-lexicon-950/60">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lexicon-800 dark:text-lexicon-300"><GitBranch aria-hidden="true" className="h-4 w-4" /><span>Possible Malay root (rule-based)</span></div>
        <p className="text-xs text-ink-600 dark:text-ink-400">This is a possible analysis, not confirmation that the word or its derivation exists.</p>
        <p className="text-sm text-ink-800 dark:text-ink-200">{ruleAnalysis.explanationEn}</p>
        <p className="text-xs italic text-ink-600 dark:text-ink-400">{ruleAnalysis.explanationMs}</p>
        <div className="pt-2"><Link href={`/word/ms/${encodeURIComponent(ruleAnalysis.possibleKataDasar)}`} className="inline-flex items-center gap-1.5 rounded-lg bg-lexicon-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-lexicon-800">Inspect Kata Dasar: {ruleAnalysis.possibleKataDasar} →</Link></div>
      </div>}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <Link href={`/?q=${encodeURIComponent(word)}`} className="rounded-xl bg-lexicon-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-lexicon-800">Search &ldquo;{word}&rdquo; across all languages</Link>
        <Link href="/" className="rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-medium text-ink-700 dark:border-ink-700 dark:text-ink-200">Browse Dictionary</Link>
      </div>
    </div>
  </div>;
}
