"use client";

import React from "react";
import Link from "next/link";
import { useLexicon } from "@/context/LexiconContext";
import { getDatasetCoverageSummary } from "@/data/starter-lexicon";

export function Footer() {
  const { t } = useLexicon();
  const coverage = getDatasetCoverageSummary();

  return (
    <footer className="border-t border-ink-200 dark:border-ink-800 bg-ink-50/70 dark:bg-ink-950 text-ink-600 dark:text-ink-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-lexicon-700 text-white flex items-center justify-center font-serif font-bold text-sm">
                V
              </div>
              <span className="font-serif font-bold text-lg text-ink-900 dark:text-white">
                {t.brand.name}
              </span>
            </div>
            <p className="text-sm text-ink-600 dark:text-ink-400 max-w-md leading-relaxed">
              {t.brand.subtitle}
            </p>
            <p className="text-xs text-ink-500 dark:text-ink-500">
              Verified Starter Corpus: {coverage.totalEntries} headwords across{" "}
              {coverage.languagesWithHeadwords} languages ({coverage.totalSenses}{" "}
              senses, {coverage.totalTranslations} translations).
            </p>
          </div>

          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-900 dark:text-ink-200">
              Platform
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/dictionary"
                  className="hover:text-lexicon-700 dark:hover:text-lexicon-400 transition-colors"
                >
                  {t.nav.dictionary}
                </Link>
              </li>
              <li>
                <Link
                  href="/dictionary?source=ms&category=kata_dasar"
                  className="hover:text-lexicon-700 dark:hover:text-lexicon-400 transition-colors"
                >
                  Kata Dasar & Imbuhan Melayu
                </Link>
              </li>
              <li>
                <Link
                  href="/learn"
                  className="hover:text-lexicon-700 dark:hover:text-lexicon-400 transition-colors"
                >
                  {t.nav.learn}
                </Link>
              </li>
              <li>
                <Link
                  href="/favorites"
                  className="hover:text-lexicon-700 dark:hover:text-lexicon-400 transition-colors"
                >
                  {t.nav.favorites}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-900 dark:text-ink-200">
              Transparency & Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-lexicon-700 dark:hover:text-lexicon-400 transition-colors"
                >
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link
                  href="/sources"
                  className="hover:text-lexicon-700 dark:hover:text-lexicon-400 transition-colors"
                >
                  {t.nav.sources} & Provenance
                </Link>
              </li>
              <li>
                <a
                  href="https://creativecommons.org/licenses/by-sa/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-lexicon-700 dark:hover:text-lexicon-400 transition-colors"
                >
                  CC BY-SA 4.0 License
                </a>
              </li>
              <li>
                <a
                  href="https://kaikki.org/dictionary/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-lexicon-700 dark:hover:text-lexicon-400 transition-colors"
                >
                  Kaikki.org / Wiktionary Data
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-ink-200 dark:border-ink-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-500">
          <p>
            © {new Date().getFullYear()} Vynalth Lexicon. Lexical content
            derived from Wiktionary / Wiktextract under CC BY-SA 4.0 & GFDL.
          </p>
          <p>
            Original architecture & UI — independent of proprietary dictionary
            databases.
          </p>
        </div>
      </div>
    </footer>
  );
}
