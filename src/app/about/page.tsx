import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  Database,
  GitBranch,
  Globe2,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { getDatasetCoverageSummary } from "@/data/starter-lexicon";
import { getAllIndexedEntries } from "@/lib/dictionary-service";
import { getAllLanguages } from "@/lib/languages";
import { checkDatabaseHealth } from "@/db";

export const metadata: Metadata = {
  title: "About Vynalth Lexicon — Architecture, Languages & Privacy",
  description:
    "Learn about Vynalth Lexicon's multilingual dictionary architecture, Bahasa Melayu morphological analyzer, data coverage transparency, and local-first privacy.",
  alternates: {
    canonical: "/about",
  },
};

export default async function AboutPage() {
  const [entries, dbHealth] = await Promise.all([
    getAllIndexedEntries(),
    checkDatabaseHealth(),
  ]);
  const coverage = getDatasetCoverageSummary(entries);
  const languages = getAllLanguages();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero */}
      <section className="space-y-4 border-b border-ink-200 dark:border-ink-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lexicon-50 dark:bg-lexicon-950 text-lexicon-800 dark:text-lexicon-300 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Product Vision & Transparency</span>
        </div>
        <h1 className="font-serif font-bold text-3xl sm:text-5xl text-ink-950 dark:text-white">
          About Vynalth Lexicon
        </h1>
        <p className="text-base sm:text-lg text-ink-600 dark:text-ink-300 leading-relaxed max-w-3xl">
          Vynalth Lexicon is an original multilingual dictionary, sense-aligned
          translator, and language-learning platform engineered with special
          depth in <strong>Bahasa Melayu morphology</strong> (Kata Dasar, Kata
          Terbitan, Imbuhan, Peribahasa, Simpulan Bahasa, and Penjodoh
          Bilangan).
        </p>
      </section>

      {/* Core Architectural Principles */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-lexicon-50 dark:bg-lexicon-950 text-lexicon-700 dark:text-lexicon-300 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="font-serif font-bold text-xl text-ink-900 dark:text-white">
            Zero Fabricated Entries
          </h2>
          <p className="text-sm text-ink-600 dark:text-ink-400 leading-relaxed">
            Every headword, IPA transcription, sense definition, and translation
            in Vynalth Lexicon comes from verified open-source lexicographical
            data (Wiktionary / Wiktextract under CC BY-SA 4.0). If a word or
            translation is not in the dataset, we state so transparently.
          </p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-lexicon-50 dark:bg-lexicon-950 text-lexicon-700 dark:text-lexicon-300 flex items-center justify-center">
            <GitBranch className="w-5 h-5" />
          </div>
          <h2 className="font-serif font-bold text-xl text-ink-900 dark:text-white">
            Malay Root-Word Precision
          </h2>
          <p className="text-sm text-ink-600 dark:text-ink-400 leading-relaxed">
            Instead of naively stripping prefixes or suffixes, our Malay
            morphology analyzer validates candidate roots against a verified
            inventory of Kata Dasar and applies tested morphophonemic nasal
            substitution rules (/p/→/m/, /t/→/n/, /k/→/ng/, /s/→/ny/).
          </p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-lexicon-50 dark:bg-lexicon-950 text-lexicon-700 dark:text-lexicon-300 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="font-serif font-bold text-xl text-ink-900 dark:text-white">
            Local-First Privacy
          </h2>
          <p className="text-sm text-ink-600 dark:text-ink-400 leading-relaxed">
            No account registration is required. Your saved favorites, personal
            study notes, flashcard mastery, and recent search history remain
            exclusively in your browser&apos;s local storage.
          </p>
        </div>
      </section>

      {/* Supported Languages & Live Coverage Table */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Globe2 className="w-5 h-5 text-lexicon-600" />
          <h2 className="font-serif font-bold text-2xl text-ink-900 dark:text-white">
            Supported Languages & Data Coverage Transparency
          </h2>
        </div>
        <p className="text-sm text-ink-600 dark:text-ink-400">
          Below is the live, uninflated count of verified headword entries
          currently loaded in the active dataset ({coverage.totalEntries} total
          headwords, {coverage.totalSenses} senses,{" "}
          {coverage.totalTranslations} sense translations). Additional entries
          can be streamed into PostgreSQL at any time via{" "}
          <code className="font-mono text-xs bg-ink-100 dark:bg-ink-800 px-1.5 py-0.5 rounded">
            npm run import:wiktextract
          </code>
          .
        </p>

        <div className="overflow-x-auto rounded-2xl border border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-50 dark:bg-ink-950 border-b border-ink-200 dark:border-ink-800 text-xs uppercase tracking-wider text-ink-500">
              <tr>
                <th className="py-3.5 px-4">Language</th>
                <th className="py-3.5 px-4">Code / Locale</th>
                <th className="py-3.5 px-4">Script & Direction</th>
                <th className="py-3.5 px-4">UI Localization</th>
                <th className="py-3.5 px-4">Verified Headwords</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
              {languages.map((lang) => {
                const count = coverage.countsByLanguage[lang.code] ?? 0;
                return (
                  <tr key={lang.code}>
                    <td className="py-3 px-4 font-medium text-ink-900 dark:text-white">
                      <Link
                        href={`/dictionary?source=${lang.code}`}
                        className="hover:text-lexicon-700 dark:hover:text-lexicon-400 hover:underline"
                      >
                        {lang.englishName} ({lang.nativeName})
                      </Link>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-ink-600 dark:text-ink-400">
                      {lang.code} ({lang.bcp47})
                    </td>
                    <td className="py-3 px-4 text-xs text-ink-600 dark:text-ink-400">
                      {lang.script} ({lang.direction.toUpperCase()})
                    </td>
                    <td className="py-3 px-4 text-xs">
                      {lang.uiSupported ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold">
                          Full UI Support
                        </span>
                      ) : (
                        <span className="text-ink-400">
                          Dictionary Lookup
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-ink-900 dark:text-white">
                      {count}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Runtime Database & Fallback Status */}
      <section className="rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 p-6 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-500">
          <Database className="w-4 h-4 text-lexicon-600" />
          <span>Runtime Infrastructure Status</span>
        </div>
        <p className="text-sm text-ink-700 dark:text-ink-300">
          <strong>Active Mode:</strong>{" "}
          <span className="font-mono text-lexicon-700 dark:text-lexicon-400">
            {dbHealth.mode}
          </span>{" "}
          — {dbHealth.message}
        </p>
        <p className="text-xs text-ink-500">
          For full data provenance and license notices, visit{" "}
          <Link
            href="/sources"
            className="text-lexicon-700 dark:text-lexicon-400 underline"
          >
            /sources
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
