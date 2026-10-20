"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  Download,
  GraduationCap,
  Trash2,
  ArrowUpRight,
  Search,
} from "lucide-react";
import { useLexicon } from "@/context/LexiconContext";
import { formatPartOfSpeech } from "@/lib/i18n";
import { getLanguageDisplayName, getLanguageMetadata } from "@/lib/languages";
import { PronunciationControl } from "./PronunciationControl";

export function FavoritesClient() {
  const {
    uiLocale,
    t,
    favorites,
    removeFavorite,
    updateFavoriteNote,
    clearFavorites,
  } = useLexicon();

  const [filterQuery, setFilterQuery] = useState("");

  const filteredFavorites = favorites.filter((fav) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return (
      fav.word.toLowerCase().includes(q) ||
      fav.definition.toLowerCase().includes(q) ||
      (fav.personalNote && fav.personalNote.toLowerCase().includes(q))
    );
  });

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(favorites, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vynalth-lexicon-favorites-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-ink-200 dark:border-ink-800 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-lexicon-700 dark:text-lexicon-400">
            <Bookmark className="w-4 h-4" />
            <span>Local-First Personal Vocabulary</span>
          </div>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-ink-900 dark:text-white">
            {t.favorites.title} ({favorites.length})
          </h1>
          <p className="text-sm sm:text-base text-ink-600 dark:text-ink-400 max-w-2xl">
            {t.favorites.subtitle}
          </p>
        </div>

        {favorites.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/learn"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-lexicon-700 hover:bg-lexicon-800 text-white text-xs sm:text-sm font-semibold transition-colors"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Review in Flashcards</span>
            </Link>

            <button
              type="button"
              onClick={handleExportJson}
              data-testid="export-favorites-btn"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 text-ink-700 dark:text-ink-200 text-xs sm:text-sm font-medium hover:bg-ink-50"
            >
              <Download className="w-4 h-4" />
              <span>{t.favorites.exportJson}</span>
            </button>

            <button
              type="button"
              onClick={clearFavorites}
              data-testid="clear-favorites-btn"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-800/80 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-medium hover:bg-rose-100"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t.favorites.clearAll}</span>
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {favorites.length === 0 ? (
        <div
          data-testid="favorites-empty-state"
          className="rounded-3xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 p-10 sm:p-14 text-center max-w-xl mx-auto space-y-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-ink-100 dark:bg-ink-800 text-ink-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h2 className="font-serif font-bold text-xl text-ink-900 dark:text-white">
            {t.favorites.emptyTitle}
          </h2>
          <p className="text-sm text-ink-600 dark:text-ink-400 leading-relaxed">
            {t.favorites.emptyDescription}
          </p>
          <div className="pt-2">
            <Link
              href="/dictionary"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-lexicon-700 hover:bg-lexicon-800 text-white text-sm font-semibold"
            >
              <span>Browse Dictionary</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter your saved words..."
              aria-label="Filter saved words"
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 text-ink-900 dark:text-white"
            />
          </div>

          {/* Saved Word Cards */}
          <div
            data-testid="favorites-list"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {filteredFavorites.map((fav) => {
              const langMeta = getLanguageMetadata(fav.language);
              return (
                <article
                  key={fav.id}
                  data-testid={`favorite-item-${fav.id}`}
                  className="rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 p-5 flex flex-col justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-800 dark:text-ink-200">
                          {getLanguageDisplayName(fav.language, uiLocale)}
                        </span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-lexicon-50 dark:bg-lexicon-950 text-lexicon-800 dark:text-lexicon-300">
                          {formatPartOfSpeech(fav.partOfSpeech, uiLocale)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFavorite(fav.id)}
                        data-testid={`remove-favorite-${fav.id}`}
                        aria-label={`${t.favorites.remove} ${fav.word}`}
                        className="inline-flex items-center gap-1 text-xs text-ink-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>{t.favorites.remove}</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <Link
                        href={`/word/${fav.language}/${encodeURIComponent(fav.word)}`}
                        dir={langMeta.direction}
                        className="font-serif font-bold text-2xl text-ink-900 dark:text-white hover:text-lexicon-700 dark:hover:text-lexicon-400 inline-flex items-center gap-1"
                      >
                        <span>{fav.word}</span>
                        <ArrowUpRight className="w-4 h-4 text-lexicon-600" />
                      </Link>

                      <PronunciationControl
                        text={fav.word}
                        locale={langMeta.speechLocale}
                        ipa={fav.ipa}
                        romanization={fav.romanization}
                        compact
                      />
                    </div>

                    <p className="text-sm text-ink-700 dark:text-ink-200 leading-relaxed">
                      {fav.definition}
                    </p>

                    {/* Personal Note Input */}
                    <div className="pt-1">
                      <label
                        htmlFor={`note-${fav.id}`}
                        className="sr-only"
                      >
                        Personal note for {fav.word}
                      </label>
                      <input
                        id={`note-${fav.id}`}
                        type="text"
                        value={fav.personalNote ?? ""}
                        onChange={(e) =>
                          updateFavoriteNote(fav.id, e.target.value)
                        }
                        placeholder="Add a personal study note or example..."
                        className="w-full text-xs px-3 py-2 rounded-lg border border-ink-200 dark:border-ink-800 bg-ink-50/70 dark:bg-ink-950 text-ink-700 dark:text-ink-300"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-ink-100 dark:border-ink-800 text-[11px] text-ink-400 flex items-center justify-between">
                    <span>
                      {t.favorites.savedAt} {fav.savedAt.slice(0, 10)}
                    </span>
                    <Link
                      href={`/word/${fav.language}/${encodeURIComponent(fav.word)}`}
                      className="font-semibold text-lexicon-700 dark:text-lexicon-400 hover:underline"
                    >
                      Open full entry →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
