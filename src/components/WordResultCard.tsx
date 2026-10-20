"use client";

import React from "react";
import Link from "next/link";
import { Bookmark, ArrowUpRight, GitBranch } from "lucide-react";
import { useLexicon } from "@/context/LexiconContext";
import {
  formatMalayMorphologyType,
  formatPartOfSpeech,
} from "@/lib/i18n";
import { getLanguageDisplayName, getLanguageMetadata } from "@/lib/languages";
import { PronunciationControl } from "./PronunciationControl";
import type { LanguageCode, LexiconEntry, SenseTranslation } from "@/types/lexicon";

interface WordResultCardProps {
  entry: LexiconEntry;
  targetLanguage?: LanguageCode | "all";
  matchBadge?: string;
  targetTranslations?: SenseTranslation[];
}

export function WordResultCard({
  entry,
  targetLanguage = "all",
  matchBadge,
  targetTranslations,
}: WordResultCardProps) {
  const { uiLocale, t, isFavorite, toggleFavorite } = useLexicon();
  const langMeta = getLanguageMetadata(entry.language);
  const saved = isFavorite(entry.id);
  const primarySense = entry.senses[0];

  const displayDefinition =
    primarySense?.localizedDefinitions[uiLocale] ||
    primarySense?.definition ||
    "";

  const translationsToShow =
    targetTranslations && targetTranslations.length > 0
      ? targetTranslations
      : primarySense?.translations.filter((tr) =>
          targetLanguage === "all" ? true : tr.language === targetLanguage
        ) ?? [];

  return (
    <article
      data-testid={`word-result-card-${entry.id}`}
      className="group rounded-2xl bg-white dark:bg-ink-900 border border-ink-200/90 dark:border-ink-800 hover:border-lexicon-500/70 dark:hover:border-lexicon-500/70 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between gap-4"
    >
      <div className="space-y-3">
        {/* Top Metadata & Favorite Button */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-ink-100 dark:bg-ink-800 text-ink-800 dark:text-ink-200">
              {getLanguageDisplayName(entry.language, uiLocale)}
            </span>

            {entry.partsOfSpeech.map((pos) => (
              <span
                key={pos}
                className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-lexicon-50 dark:bg-lexicon-950 text-lexicon-800 dark:text-lexicon-300 border border-lexicon-200/60 dark:border-lexicon-800/60"
              >
                {formatPartOfSpeech(pos, uiLocale)}
              </span>
            ))}

            {entry.malayMorphology && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
                {formatMalayMorphologyType(
                  entry.malayMorphology.morphologyType,
                  uiLocale
                )}
              </span>
            )}

            {matchBadge && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono text-ink-500 dark:text-ink-400 bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800">
                {matchBadge}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              toggleFavorite({
                id: entry.id,
                word: entry.headword,
                slug: entry.slug,
                language: entry.language,
                romanization: entry.romanization,
                ipa: entry.ipa,
                partOfSpeech: entry.partsOfSpeech[0] ?? "noun",
                definition: displayDefinition,
              })
            }
            data-testid={`favorite-btn-${entry.id}`}
            aria-label={
              saved ? t.wordDetail.savedFavorite : t.wordDetail.saveFavorite
            }
            title={
              saved ? t.wordDetail.savedFavorite : t.wordDetail.saveFavorite
            }
            className={`p-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-lexicon-500 ${
              saved
                ? "bg-lexicon-50 dark:bg-lexicon-950 border-lexicon-300 dark:border-lexicon-700 text-lexicon-700 dark:text-lexicon-300"
                : "bg-transparent border-ink-200 dark:border-ink-800 text-ink-400 hover:text-ink-700 dark:hover:text-ink-200"
            }`}
          >
            <Bookmark
              className={`w-4 h-4 ${saved ? "fill-current" : ""}`}
            />
          </button>
        </div>

        {/* Headword + Pronunciation */}
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <Link
            href={`/word/${entry.language}/${encodeURIComponent(entry.headword)}`}
            dir={langMeta.direction}
            className="font-serif font-bold text-2xl text-ink-900 dark:text-white group-hover:text-lexicon-700 dark:group-hover:text-lexicon-400 transition-colors inline-flex items-center gap-1.5"
          >
            <span>{entry.headword}</span>
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-lexicon-600" />
          </Link>

          <PronunciationControl
            text={entry.headword}
            locale={entry.audioLocale}
            ipa={entry.ipa}
            romanization={entry.romanization}
            compact
          />
        </div>

        {/* Primary Definition */}
        <p className="text-sm sm:text-base text-ink-700 dark:text-ink-200 leading-relaxed">
          {displayDefinition}
        </p>

        {/* Malay Root Word Link if Applicable */}
        {entry.malayMorphology && (
          <div className="flex flex-wrap items-center gap-2 text-xs text-ink-600 dark:text-ink-300 bg-ink-50/80 dark:bg-ink-950/70 px-3 py-2 rounded-lg border border-ink-200/70 dark:border-ink-800">
            <GitBranch className="w-3.5 h-3.5 text-lexicon-600 shrink-0" />
            <span>
              <strong>{t.wordDetail.kataDasarLabel}:</strong>{" "}
              <Link
                href={`/word/ms/${encodeURIComponent(entry.malayMorphology.kataDasar)}`}
                className="font-semibold text-lexicon-700 dark:text-lexicon-400 underline decoration-lexicon-400/50 hover:decoration-lexicon-600"
              >
                {entry.malayMorphology.kataDasar}
              </Link>
            </span>
            {entry.malayMorphology.affixPattern &&
              entry.malayMorphology.affixType !== "none" && (
                <span className="text-ink-500">
                  · Imbuhan:{" "}
                  <code className="font-mono text-ink-800 dark:text-ink-200">
                    {entry.malayMorphology.affixPattern}
                  </code>
                </span>
              )}
          </div>
        )}
      </div>

      {/* Sense Translations Preview */}
      <div className="pt-3 border-t border-ink-100 dark:border-ink-800/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {translationsToShow.length > 0 ? (
            translationsToShow.slice(0, 4).map((tr) => {
              const trMeta = getLanguageMetadata(tr.language);
              return (
                <span
                  key={tr.language}
                  dir={trMeta.direction}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-ink-100/80 dark:bg-ink-800/80 text-ink-800 dark:text-ink-200"
                >
                  <span className="font-mono text-[10px] uppercase text-ink-500 dark:text-ink-400">
                    {tr.language}:
                  </span>
                  <span className="font-medium">
                    {tr.terms.slice(0, 2).join(", ")}
                  </span>
                </span>
              );
            })
          ) : (
            <span className="text-xs text-ink-400 italic">
              {t.wordDetail.noVerifiedTranslation}
            </span>
          )}
        </div>

        <Link
          href={`/word/${entry.language}/${encodeURIComponent(entry.headword)}`}
          data-testid={`view-entry-link-${entry.id}`}
          className="text-xs font-semibold text-lexicon-700 dark:text-lexicon-400 hover:underline shrink-0"
        >
          {entry.senses.length}{" "}
          {entry.senses.length === 1 ? "sense" : "senses"} →
        </Link>
      </div>
    </article>
  );
}
