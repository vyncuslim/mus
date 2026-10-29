"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  GitBranch,
  Globe2,
  GraduationCap,
  Layers,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Compass,
  Bookmark,
} from "lucide-react";
import { useLexicon } from "@/context/LexiconContext";
import { SearchBar } from "./SearchBar";
import { WordResultCard } from "./WordResultCard";
import { getAllLanguages, getLanguageDisplayName } from "@/lib/languages";
import type { DatasetCoverageSummary } from "@/data/starter-lexicon";
import type { LexiconEntry } from "@/types/lexicon";

interface HomeClientProps {
  featuredEntries: LexiconEntry[];
  coverage: DatasetCoverageSummary;
}

export function HomeClient({ featuredEntries, coverage }: HomeClientProps) {
  const { uiLocale, t } = useLexicon();
  const languages = getAllLanguages();

  const malayHighlights = [
    {
      title: "Kata Dasar & Kata Terbitan",
      subtitle: "Root-to-derivative bidirectional analysis",
      badge: "makan → makanan, memakan, termakan",
      href: "/word/ms/makanan",
      description:
        "Trace derived words back to their verified root word (kata dasar) with explicit morphological formulas.",
    },
    {
      title: "Awalan, Akhiran, Apitan & Sisipan",
      subtitle: "Prefix, suffix, circumfix & infix rules",
      badge: "tulis → menulis (/t/ → /n/), tapak → telapak (-el-)",
      href: "/word/ms/menulis",
      description:
        "Inspect nasal substitution (peluluhan konsonan sengau) and authentic Malay infixation patterns.",
    },
    {
      title: "Penjodoh Bilangan",
      subtitle: "Malay numeral classifiers & noun pairings",
      badge: "sebuah, sehelai",
      href: "/dictionary?source=ms&category=penjodoh_bilangan",
      description:
        "Learn which numeral classifier pairs with 3D objects, books, thin flat sheets, or garments.",
    },
    {
      title: "Peribahasa & Simpulan Bahasa",
      subtitle: "Traditional proverbs & cultural idioms",
      badge: "bagai aur dengan tebing · buah tangan · ulat buku",
      href: "/word/ms/bagai%20aur%20dengan%20tebing",
      description:
        "Explore literal and figurative meanings with cross-lingual equivalents in English and Chinese.",
    },
  ];

  const quickLookupPills = [
    { word: "makanan", lang: "ms", label: "makanan (ms)" },
    { word: "makan", lang: "ms", label: "makan (ms)" },
    { word: "belajar", lang: "ms", label: "belajar (ms)" },
    { word: "telapak", lang: "ms", label: "telapak (ms · sisipan)" },
    { word: "sebuah", lang: "ms", label: "sebuah (ms · penjodoh)" },
    { word: "serendipity", lang: "en", label: "serendipity (en)" },
    { word: "学习", lang: "zh-Hans", label: "学习 xuéxí (zh-Hans)" },
    { word: "食べる", lang: "ja", label: "食べる taberu (ja)" },
    { word: "عِلْم", lang: "ar", label: "عِلْم ʿilm (ar · RTL)" },
  ];

  return (
    <div className="space-y-16 pb-8">
      {/* Editorial Hero Section */}
      <section className="relative overflow-hidden border-b border-ink-200/80 dark:border-ink-800 bg-gradient-to-b from-white via-ink-50/50 to-ink-100/40 dark:from-ink-950 dark:via-ink-900/50 dark:to-ink-950 pt-10 pb-14 sm:pt-14 sm:pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lexicon-50 dark:bg-lexicon-950/90 border border-lexicon-200 dark:border-lexicon-800 text-lexicon-800 dark:text-lexicon-300 text-xs font-semibold tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.home.heroBadge}</span>
            </div>

            <h1
              data-testid="hero-title"
              className="font-serif font-bold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-ink-950 dark:text-white leading-[1.12]"
            >
              {t.home.heroTitle}
            </h1>

            <p className="text-base sm:text-lg text-ink-600 dark:text-ink-300 leading-relaxed max-w-2xl mx-auto">
              {t.home.heroDescription}
            </p>
          </div>

          {/* Central Dictionary Search Bar */}
          <div className="max-w-4xl mx-auto">
            <SearchBar initialSource="all" initialTarget="ms" />
          </div>

          {/* Quick Verified Word Pills */}
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-500 mr-1">
              Try verified entries:
            </span>
            {quickLookupPills.map((pill) => (
              <Link
                key={`${pill.lang}-${pill.word}`}
                href={`/word/${pill.lang}/${encodeURIComponent(pill.word)}`}
                className="text-xs font-medium px-2.5 py-1 rounded-full bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 text-ink-700 dark:text-ink-300 hover:border-lexicon-500 hover:text-lexicon-700 dark:hover:text-lexicon-300 transition-colors"
              >
                {pill.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Live Dataset Transparency & Provenance Metrics */}
      <section
        aria-label={t.home.coverageTransparencyTitle}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8"
      >
        <div className="rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 shadow-sm p-5 sm:p-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
              {t.home.verifiedEntriesLabel}
            </span>
            <p
              data-testid="verified-entry-count"
              className="font-serif font-bold text-2xl sm:text-3xl text-ink-900 dark:text-white"
            >
              {coverage.totalEntries}
            </p>
            <p className="text-xs text-ink-500">
              {coverage.totalSenses} distinct senses ·{" "}
              {coverage.totalTranslations} sense translations
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
              {t.home.supportedLanguagesLabel}
            </span>
            <p className="font-serif font-bold text-2xl sm:text-3xl text-ink-900 dark:text-white">
              {coverage.languagesWithHeadwords} / {languages.length}
            </p>
            <p className="text-xs text-ink-500">
              Latin, Hanzi, Kana, Hangul, Thai & RTL Arabic
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
              Bahasa Melayu Morphology
            </span>
            <p className="font-serif font-bold text-2xl sm:text-3xl text-lexicon-700 dark:text-lexicon-400">
              {coverage.countsByLanguage.ms}
            </p>
            <p className="text-xs text-ink-500">
              Kata Dasar, Terbitan, Peribahasa & Penjodoh
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
              {t.home.licenseLabel}
            </span>
            <p className="font-serif font-bold text-lg sm:text-xl text-ink-900 dark:text-white">
              CC BY-SA 4.0
            </p>
            <p className="text-xs text-ink-500">
              <Link
                href="/sources"
                className="text-lexicon-700 dark:text-lexicon-400 hover:underline"
              >
                Wiktionary / Wiktextract ({coverage.sourceVersion}) →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Featured & Trending Words from Real Dataset */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-ink-900 dark:text-white">
              {t.home.featuredWordsTitle}
            </h2>
            <p className="text-sm text-ink-600 dark:text-ink-400 mt-1">
              {t.home.featuredWordsSubtitle}
            </p>
          </div>
          <Link
            href="/dictionary"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-lexicon-700 dark:text-lexicon-400 hover:underline"
          >
            <span>Browse full dictionary</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredEntries.map((entry) => (
            <WordResultCard
              key={entry.id}
              entry={entry}
              targetLanguage={entry.language === "ms" ? "en" : "ms"}
            />
          ))}
        </div>
      </section>

      {/* Bahasa Melayu Linguistic Excellence Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-lexicon-950 via-ink-900 to-ink-950 text-white p-6 sm:p-10 space-y-8 border border-lexicon-800/50 shadow-xl">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lexicon-900/90 border border-lexicon-700 text-lexicon-300 text-xs font-semibold">
              <GitBranch className="w-3.5 h-3.5" />
              <span>Tatabahasa & Morfologi Bahasa Melayu</span>
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-4xl text-white">
              {t.home.malayExcellenceTitle}
            </h2>
            <p className="text-sm sm:text-base text-ink-300 leading-relaxed">
              {t.home.malayExcellenceSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {malayHighlights.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-lexicon-400/60 p-5 transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono text-lexicon-300 bg-lexicon-950/80 px-2.5 py-1 rounded-md border border-lexicon-800">
                      {item.badge}
                    </span>
                    <ArrowRight className="w-4 h-4 text-ink-400 group-hover:text-lexicon-300 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <h3 className="font-serif font-bold text-xl text-white group-hover:text-lexicon-300 transition-colors pt-1">
                    {item.title}
                  </h3>
                  <p className="text-xs font-medium text-lexicon-200/80">
                    {item.subtitle}
                  </p>
                  <p className="text-sm text-ink-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Golongan Kata Quick Filter Bar */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-400 mr-2">
              Golongan Kata:
            </span>
            <Link
              href="/dictionary?source=ms&pos=noun"
              className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              Kata Nama (Nouns)
            </Link>
            <Link
              href="/dictionary?source=ms&pos=verb"
              className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              Kata Kerja (Verbs)
            </Link>
            <Link
              href="/dictionary?source=ms&pos=adjective"
              className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              Kata Adjektif (Adjectives)
            </Link>
            <Link
              href="/dictionary?source=ms&pos=preposition"
              className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              Kata Sendi Nama (Prepositions)
            </Link>
            <Link
              href="/dictionary?source=ms&category=penjodoh_bilangan"
              className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              Penjodoh Bilangan (Classifiers)
            </Link>
            <Link
              href="/dictionary?source=ms&category=peribahasa"
              className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              Peribahasa (Proverbs)
            </Link>
            <Link
              href="/dictionary?source=ms&category=simpulan_bahasa"
              className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              Simpulan Bahasa (Idioms)
            </Link>
          </div>
        </div>
      </section>

      {/* Supported Languages & Honest Coverage Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-ink-900 dark:text-white">
            {t.home.quickSectionsTitle} & Language Registry
          </h2>
          <p className="text-sm text-ink-600 dark:text-ink-400 mt-1">
            Select any language below to browse its verified starter headwords
            and sense translations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {languages.map((lang) => {
            const count = coverage.countsByLanguage[lang.code] ?? 0;
            return (
              <Link
                key={lang.code}
                href={`/dictionary?source=${lang.code}`}
                className="rounded-xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 hover:border-lexicon-500 p-4 transition-all flex flex-col justify-between gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-sm text-ink-900 dark:text-white">
                      {getLanguageDisplayName(lang.code, uiLocale)}
                    </h3>
                    <p
                      dir={lang.direction}
                      className="text-xs text-ink-500 dark:text-ink-400 mt-0.5"
                    >
                      {lang.nativeName} · {lang.script}
                    </p>
                  </div>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-lexicon-50 dark:bg-lexicon-950 text-lexicon-800 dark:text-lexicon-300 border border-lexicon-200 dark:border-lexicon-800">
                    {count} {count === 1 ? "entry" : "entries"}
                  </span>
                </div>
                <p className="text-[11px] text-ink-500 dark:text-ink-400 line-clamp-2">
                  {lang.coverageNote[uiLocale]}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Platform Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <Link
            href="/learn"
            className="rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 hover:border-lexicon-500 p-6 space-y-2 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-lexicon-50 dark:bg-lexicon-950 text-lexicon-700 dark:text-lexicon-300 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-ink-900 dark:text-white">
              {t.nav.learn} Studio
            </h3>
            <p className="text-sm text-ink-600 dark:text-ink-400">
              Practice flashcards, test your Malay root-word analysis in interactive quizzes, and review curated collections.
            </p>
          </Link>

          <Link
            href="/favorites"
            className="rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 hover:border-lexicon-500 p-6 space-y-2 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-lexicon-50 dark:bg-lexicon-950 text-lexicon-700 dark:text-lexicon-300 flex items-center justify-center">
              <Bookmark className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-ink-900 dark:text-white">
              {t.nav.favorites} & Personal Notes
            </h3>
            <p className="text-sm text-ink-600 dark:text-ink-400">
              Save entries locally in your browser without registration, annotate study notes, and export your personal lexicon.
            </p>
          </Link>

          <Link
            href="/sources"
            className="rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 hover:border-lexicon-500 p-6 space-y-2 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-lexicon-50 dark:bg-lexicon-950 text-lexicon-700 dark:text-lexicon-300 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-ink-900 dark:text-white">
              {t.nav.sources} & Wiktextract Importer
            </h3>
            <p className="text-sm text-ink-600 dark:text-ink-400">
              Inspect full data provenance, CC BY-SA 4.0 license compliance, and our streaming JSONL import pipeline.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
export { BookOpen, Globe2, Layers, Sparkles };
