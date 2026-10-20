"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Clock,
  Database,
  GitBranch,
  SearchX,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { useLexicon } from "@/context/LexiconContext";
import { SearchBar } from "./SearchBar";
import { WordResultCard } from "./WordResultCard";
import { executeLexiconSearch } from "@/lib/search-engine";
import { isValidLanguageCode } from "@/lib/languages";
import type {
  LanguageCode,
  MalayMorphologyType,
  PartOfSpeech,
  SearchResponse,
} from "@/types/lexicon";

interface DictionaryClientProps {
  initialResponse: SearchResponse;
}

export function DictionaryClient({ initialResponse }: DictionaryClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { uiLocale, t } = useLexicon();

  const urlQuery = searchParams.get("q") ?? initialResponse.query;
  const rawSource = searchParams.get("source") ?? initialResponse.sourceLanguage;
  const urlSource: LanguageCode | "all" =
    rawSource === "all" || isValidLanguageCode(rawSource) ? rawSource : "all";

  const rawTarget = searchParams.get("target") ?? initialResponse.targetLanguage;
  const urlTarget: LanguageCode | "all" =
    rawTarget === "all" || isValidLanguageCode(rawTarget) ? rawTarget : "ms";

  const urlPos =
    (searchParams.get("pos") as PartOfSpeech | "all") ??
    initialResponse.partOfSpeechFilter ??
    "all";
  const urlCategory =
    (searchParams.get("category") as MalayMorphologyType | "all") ??
    initialResponse.categoryFilter ??
    "all";

  const [searchResult, setSearchResult] =
    useState<SearchResponse>(initialResponse);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Recompute immediately when URL params change
  useEffect(() => {
    try {
      setErrorMsg(null);
      const res = executeLexiconSearch({
        query: urlQuery,
        sourceLanguage: urlSource,
        targetLanguage: urlTarget,
        partOfSpeech: urlPos,
        category: urlCategory,
      });
      setSearchResult(res);
    } catch {
      setErrorMsg("Unable to execute dictionary query.");
    }
  }, [urlQuery, urlSource, urlTarget, urlPos, urlCategory]);

  const handleSearchChange = useCallback(
    (params: {
      query: string;
      source: LanguageCode | "all";
      target: LanguageCode | "all";
      pos: PartOfSpeech | "all";
      category: MalayMorphologyType | "all";
    }) => {
      try {
        setErrorMsg(null);
        const res = executeLexiconSearch({
          query: params.query,
          sourceLanguage: params.source,
          targetLanguage: params.target,
          partOfSpeech: params.pos,
          category: params.category,
        });
        setSearchResult(res);

        // Keep URL synchronized without full reload
        const nextParams = new URLSearchParams();
        if (params.query.trim()) nextParams.set("q", params.query.trim());
        if (params.source !== "all") nextParams.set("source", params.source);
        if (params.target !== "all") nextParams.set("target", params.target);
        if (params.pos !== "all") nextParams.set("pos", params.pos);
        if (params.category !== "all")
          nextParams.set("category", params.category);

        const qs = nextParams.toString();
        router.replace(`/dictionary${qs ? `?${qs}` : ""}`, { scroll: false });
      } catch {
        setErrorMsg("An error occurred while updating search results.");
      }
    },
    [router]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-ink-900 dark:text-white">
              {t.nav.dictionary}
            </h1>
            <p className="text-sm text-ink-600 dark:text-ink-400">
              {t.brand.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-ink-500 dark:text-ink-400">
            <span
              data-testid="data-source-badge"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-lexicon-50 dark:bg-lexicon-950 text-lexicon-800 dark:text-lexicon-300 border border-lexicon-200 dark:border-lexicon-800 font-medium"
            >
              <Database className="w-3.5 h-3.5" />
              <span>
                {searchResult.dataSourceMode === "postgresql"
                  ? "PostgreSQL Live Database"
                  : t.search.starterDatasetBadge}
              </span>
            </span>
          </div>
        </div>

        <SearchBar
          initialQuery={urlQuery}
          initialSource={urlSource}
          initialTarget={urlTarget}
          initialPos={urlPos}
          initialCategory={urlCategory}
          showExtendedFilters
          navigateOnSubmit={false}
          onSearchChange={handleSearchChange}
        />
      </div>

      {/* Status & Latency Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-ink-200 dark:border-ink-800 text-xs text-ink-600 dark:text-ink-400">
        <div data-testid="search-results-summary" className="font-medium">
          <span className="font-bold text-ink-900 dark:text-white">
            {searchResult.totalResults}
          </span>{" "}
          {t.search.resultsFound}
          {searchResult.query ? (
            <span>
              {" "}
              for{" "}
              <strong className="text-ink-900 dark:text-white">
                &ldquo;{searchResult.query}&rdquo;
              </strong>
            </span>
          ) : null}
        </div>

        <div
          data-testid="search-latency-badge"
          className="inline-flex items-center gap-1 font-mono text-ink-500"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>
            {t.search.latencyLabel}: {searchResult.latencyMs} ms
          </span>
        </div>
      </div>

      {/* Error State */}
      {errorMsg && (
        <div
          role="alert"
          className="rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 p-4 text-sm text-rose-800 dark:text-rose-200 flex items-center gap-2.5"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Malay Rule-Assisted Morphological Analysis Card */}
      {searchResult.ruleAnalysis && (
        <div
          data-testid="malay-morphology-rule-banner"
          className="rounded-2xl bg-lexicon-50/70 dark:bg-lexicon-950/40 border border-lexicon-200 dark:border-lexicon-800 p-5 space-y-2"
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-lexicon-800 dark:text-lexicon-300">
            <GitBranch className="w-4 h-4" />
            <span>Analisis Morfologi Bahasa Melayu (Verified Root Mapping)</span>
          </div>
          <p className="text-sm text-ink-800 dark:text-ink-100">
            {uiLocale === "ms"
              ? searchResult.ruleAnalysis.explanationMs
              : searchResult.ruleAnalysis.explanationEn}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-white dark:bg-ink-900 border border-lexicon-200 dark:border-lexicon-800 font-medium">
              Kata Dasar:{" "}
              <Link
                href={`/word/ms/${encodeURIComponent(searchResult.ruleAnalysis.possibleKataDasar)}`}
                className="font-bold text-lexicon-700 dark:text-lexicon-400 underline"
              >
                {searchResult.ruleAnalysis.possibleKataDasar}
              </Link>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white dark:bg-ink-900 border border-lexicon-200 dark:border-lexicon-800 font-mono">
              Imbuhan: {searchResult.ruleAnalysis.affixPattern}
            </span>
          </div>
        </div>
      )}

      {/* Empty Results State */}
      {searchResult.totalResults === 0 && (
        <div
          data-testid="empty-search-state"
          className="rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-ink-100 dark:bg-ink-800 text-ink-500 flex items-center justify-center mx-auto">
            <SearchX className="w-6 h-6" />
          </div>
          <h2 className="font-serif font-bold text-xl text-ink-900 dark:text-white">
            {t.search.noResultsTitle}
          </h2>
          <p className="text-sm text-ink-600 dark:text-ink-400 leading-relaxed">
            {t.search.noResultsDescription}
          </p>

          {/* Typo-tolerant suggestions when no direct matches exist */}
          {searchResult.suggestions.length > 0 && (
            <div className="pt-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.search.didYouMean}:</span>
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {searchResult.suggestions.map((sug) => (
                  <Link
                    key={`${sug.language}-${sug.word}`}
                    href={`/word/${sug.language}/${encodeURIComponent(sug.word)}`}
                    className="text-sm font-medium px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors"
                  >
                    {sug.word} ({sug.language})
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 1. Exact Matches Section */}
      {searchResult.exactMatches.length > 0 && (
        <section
          aria-labelledby="exact-matches-heading"
          className="space-y-4"
        >
          <h2
            id="exact-matches-heading"
            className="text-xs font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400"
          >
            {t.search.exactMatches} ({searchResult.exactMatches.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchResult.exactMatches.map((item) => (
              <WordResultCard
                key={item.entry.id}
                entry={item.entry}
                targetLanguage={searchResult.targetLanguage}
                targetTranslations={item.targetTranslations}
                matchBadge={
                  item.matchType === "normalized"
                    ? "Diacritic / Reading Match"
                    : "Exact Match"
                }
              />
            ))}
          </div>
        </section>
      )}

      {/* 2. Prefix & Morphological Matches Section */}
      {searchResult.prefixMatches.length > 0 && (
        <section
          aria-labelledby="prefix-matches-heading"
          className="space-y-4"
        >
          <h2
            id="prefix-matches-heading"
            className="text-xs font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400"
          >
            {t.search.prefixMatches} ({searchResult.prefixMatches.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchResult.prefixMatches.map((item) => (
              <WordResultCard
                key={item.entry.id}
                entry={item.entry}
                targetLanguage={searchResult.targetLanguage}
                targetTranslations={item.targetTranslations}
                matchBadge={
                  item.matchType === "morphology"
                    ? item.matchedTerm ?? "Morphological Family"
                    : item.matchType === "word_form"
                    ? `Inflected Form: ${item.matchedTerm}`
                    : "Prefix Match"
                }
              />
            ))}
          </div>
        </section>
      )}

      {/* 3. Sense Translation & Related Matches Section */}
      {searchResult.relatedMatches.length > 0 && (
        <section
          aria-labelledby="related-matches-heading"
          className="space-y-4"
        >
          <h2
            id="related-matches-heading"
            className="text-xs font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400"
          >
            {t.search.relatedMatches} ({searchResult.relatedMatches.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchResult.relatedMatches.map((item) => (
              <WordResultCard
                key={item.entry.id}
                entry={item.entry}
                targetLanguage={searchResult.targetLanguage}
                targetTranslations={item.targetTranslations}
                matchBadge={
                  item.matchType === "translation"
                    ? `Translation: ${item.matchedTerm}`
                    : "Related Sense"
                }
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
