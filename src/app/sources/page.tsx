import React from "react";
import type { Metadata } from "next";
import {
  Database,
  ExternalLink,
  FileCode2,
  Scale,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { getDatasetCoverageSummary } from "@/data/starter-lexicon";
import { getAllIndexedEntries } from "@/lib/dictionary-service";

export const metadata: Metadata = {
  title: "Data Sources, Provenance & Open Licenses",
  description:
    "Full provenance, CC BY-SA 4.0 / GFDL license attribution, and Wiktextract streaming import documentation for Vynalth Lexicon.",
  alternates: {
    canonical: "/sources",
  },
};

export default async function SourcesPage() {
  const entries = await getAllIndexedEntries();
  const coverage = getDatasetCoverageSummary(entries);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <section className="space-y-4 border-b border-ink-200 dark:border-ink-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lexicon-50 dark:bg-lexicon-950 text-lexicon-800 dark:text-lexicon-300 text-xs font-semibold">
          <Database className="w-3.5 h-3.5" />
          <span>Data Provenance & Open Licensing</span>
        </div>
        <h1 className="font-serif font-bold text-3xl sm:text-5xl text-ink-950 dark:text-white">
          Dictionary Sources & License Notices
        </h1>
        <p className="text-base sm:text-lg text-ink-600 dark:text-ink-300 leading-relaxed max-w-3xl">
          Vynalth Lexicon is built strictly upon legally reusable, open-source
          lexicographical datasets. We never scrape proprietary commercial
          dictionaries (such as eKamus, Oxford, or Cambridge) and never use AI
          models to fabricate unverified dictionary records.
        </p>
      </section>

      {/* Primary Data Sources */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-lexicon-700 dark:text-lexicon-400">
              Primary Machine-Readable Corpus
            </span>
            <ShieldCheck className="w-5 h-5 text-lexicon-600" />
          </div>
          <h2 className="font-serif font-bold text-xl text-ink-900 dark:text-white">
            Kaikki.org / Wiktextract JSONL
          </h2>
          <p className="text-sm text-ink-600 dark:text-ink-400 leading-relaxed">
            Machine-readable dictionary extractions parsed from Wiktionary dumps
            by Tatu Ylonen&apos;s Wiktextract project, providing structured
            parts of speech, IPA phonetics, senses, examples, and sense-level
            translations.
          </p>
          <a
            href="https://kaikki.org/dictionary/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-lexicon-700 dark:text-lexicon-400 hover:underline"
          >
            <span>https://kaikki.org/dictionary/</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-lexicon-700 dark:text-lexicon-400">
              Upstream Lexical Authority
            </span>
            <Scale className="w-5 h-5 text-lexicon-600" />
          </div>
          <h2 className="font-serif font-bold text-xl text-ink-900 dark:text-white">
            English & Malay Wiktionary
          </h2>
          <p className="text-sm text-ink-600 dark:text-ink-400 leading-relaxed">
            Collaborative open-content dictionaries maintained by the Wikimedia
            community. Every word detail page in Vynalth Lexicon links directly
            to its upstream Wiktionary entry and preserves share-alike
            attribution.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://en.wiktionary.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-lexicon-700 dark:text-lexicon-400 hover:underline"
            >
              <span>https://en.wiktionary.org/</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://ms.wiktionary.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-lexicon-700 dark:text-lexicon-400 hover:underline"
            >
              <span>https://ms.wiktionary.org/</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* License Compliance Box */}
      <section className="rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 p-6 sm:p-8 space-y-4">
        <h2 className="font-serif font-bold text-2xl text-ink-900 dark:text-white">
          License Obligations & Share-Alike Notice
        </h2>
        <p className="text-sm text-ink-700 dark:text-ink-300 leading-relaxed">
          All Wiktionary-derived lexical definitions, examples, etymologies,
          and translations are dual-licensed under the{" "}
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-lexicon-700 dark:text-lexicon-400 underline"
          >
            Creative Commons Attribution-ShareAlike 4.0 International License
            (CC BY-SA 4.0)
          </a>{" "}
          and the{" "}
          <a
            href="https://www.gnu.org/copyleft/fdl.html"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-lexicon-700 dark:text-lexicon-400 underline"
          >
            GNU Free Documentation License (GFDL)
          </a>
          .
        </p>
        <ul className="list-disc list-inside text-xs sm:text-sm text-ink-600 dark:text-ink-400 space-y-1.5">
          <li>
            <strong>Snapshot Version:</strong> {coverage.sourceVersion} (Last
            verified import: {coverage.lastUpdated})
          </li>
          <li>
            <strong>Starter Dataset Size:</strong> {coverage.totalEntries}{" "}
            verified headwords, {coverage.totalSenses} distinct senses,{" "}
            {coverage.totalTranslations} sense translations,{" "}
            {coverage.totalExamples} example sentences.
          </li>
          <li>
            <strong>Audio & Speech Notice:</strong> Pronunciation audio in the
            web interface uses your browser&apos;s built-in Web Speech API
            synthesizer and is explicitly labeled as non-native synthesized
            speech.
          </li>
        </ul>
      </section>

      {/* Reproducible Streaming Import Pipeline Documentation */}
      <section className="rounded-2xl bg-ink-900 text-ink-100 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-lexicon-400">
          <Terminal className="w-4 h-4" />
          <span>Reproducible Wiktionary/Wiktextract Import Pipeline</span>
        </div>
        <h2 className="font-serif font-bold text-2xl text-white">
          Streaming JSONL Importer Commands
        </h2>
        <p className="text-sm text-ink-300 leading-relaxed">
          Our import pipeline (
          <code className="text-lexicon-300">src/lib/importer.ts</code> &{" "}
          <code className="text-lexicon-300">
            scripts/import-wiktextract.ts
          </code>
          ) uses Node.js readable streams (<code className="text-lexicon-300">readline</code>)
          to process multi-gigabyte Wiktextract JSONL dumps line-by-line in
          constant memory, validating records with Zod, normalizing Unicode NFC
          and diacritics, preserving distinct word senses, and performing
          idempotent PostgreSQL upserts.
        </p>

        <div className="rounded-xl bg-ink-950 border border-ink-800 p-4 font-mono text-xs sm:text-sm space-y-2 overflow-x-auto">
          <div className="text-ink-400">
            # 1. Dry-run validation on the bundled sample JSONL fixture:
          </div>
          <div className="text-emerald-400">
            npm run import:wiktextract -- --dry-run
          </div>
          <div className="text-ink-400 pt-2">
            # 2. Selective import by language (e.g., Malay, English, Simplified Chinese):
          </div>
          <div className="text-emerald-400">
            npm run import:wiktextract -- --input /path/to/kaikki-dictionary.jsonl --lang ms,en,zh-Hans --version wiktextract-2026-10
          </div>
          <div className="text-ink-400 pt-2">
            # 3. Push Drizzle PostgreSQL schema & indexes:
          </div>
          <div className="text-emerald-400">npm run db:push</div>
        </div>

        <div className="flex items-center gap-2 text-xs text-ink-400 pt-1">
          <FileCode2 className="w-4 h-4 text-lexicon-400 shrink-0" />
          <span>
            Massive raw JSONL dumps are excluded via{" "}
            <code>.gitignore</code> (<code>/data/dumps/</code>,{" "}
            <code>*.jsonl.gz</code>) to keep the repository lightweight and
            Vercel-ready.
          </span>
        </div>
      </section>
    </div>
  );
}
