"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowLeftRight,
  X,
  Clock,
  Trash2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useLexicon } from "@/context/LexiconContext";
import { getAllLanguages, getLanguageDisplayName } from "@/lib/languages";
import { computeSuggestions } from "@/lib/search-engine";
import { formatPartOfSpeech, formatMalayMorphologyType } from "@/lib/i18n";
import type {
  LanguageCode,
  MalayMorphologyType,
  PartOfSpeech,
  SearchSuggestion,
} from "@/types/lexicon";

interface SearchBarProps {
  initialQuery?: string;
  initialSource?: LanguageCode | "all";
  initialTarget?: LanguageCode | "all";
  initialPos?: PartOfSpeech | "all";
  initialCategory?: MalayMorphologyType | "all";
  showExtendedFilters?: boolean;
  onSearchChange?: (params: {
    query: string;
    source: LanguageCode | "all";
    target: LanguageCode | "all";
    pos: PartOfSpeech | "all";
    category: MalayMorphologyType | "all";
  }) => void;
  navigateOnSubmit?: boolean;
}

const POS_OPTIONS: PartOfSpeech[] = [
  "noun",
  "verb",
  "adjective",
  "preposition",
  "classifier",
  "idiom",
  "proverb",
];

const MALAY_CATEGORY_OPTIONS: MalayMorphologyType[] = [
  "kata_dasar",
  "kata_terbitan",
  "penjodoh_bilangan",
  "simpulan_bahasa",
  "peribahasa",
];

export function SearchBar({
  initialQuery = "",
  initialSource = "all",
  initialTarget = "ms",
  initialPos = "all",
  initialCategory = "all",
  showExtendedFilters = false,
  onSearchChange,
  navigateOnSubmit = true,
}: SearchBarProps) {
  const router = useRouter();
  const {
    uiLocale,
    t,
    searchHistory,
    addSearchHistory,
    clearSearchHistory,
  } = useLexicon();

  const [query, setQuery] = useState(initialQuery);
  const [sourceLang, setSourceLang] = useState<LanguageCode | "all">(
    initialSource
  );
  const [targetLang, setTargetLang] = useState<LanguageCode | "all">(
    initialTarget
  );
  const [posFilter, setPosFilter] = useState<PartOfSpeech | "all">(initialPos);
  const [categoryFilter, setCategoryFilter] = useState<
    MalayMorphologyType | "all"
  >(initialCategory);

  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const languages = getAllLanguages();

  // Sync external prop changes
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setSourceLang(initialSource);
  }, [initialSource]);

  useEffect(() => {
    setTargetLang(initialTarget);
  }, [initialTarget]);

  useEffect(() => {
    setPosFilter(initialPos);
  }, [initialPos]);

  useEffect(() => {
    setCategoryFilter(initialCategory);
  }, [initialCategory]);

  // Debounced live suggestions & parent callback
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 1) {
        const computed = computeSuggestions(
          query,
          sourceLang,
          undefined,
          new Set(),
          6
        );
        setSuggestions(computed);
      } else {
        setSuggestions([]);
      }

      if (onSearchChange) {
        onSearchChange({
          query,
          source: sourceLang,
          target: targetLang,
          pos: posFilter,
          category: categoryFilter,
        });
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [query, sourceLang, targetLang, posFilter, categoryFilter, onSearchChange]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const buildDictionaryUrl = (
    qVal: string,
    srcVal: LanguageCode | "all",
    tgtVal: LanguageCode | "all",
    posVal: PartOfSpeech | "all",
    catVal: MalayMorphologyType | "all"
  ) => {
    const params = new URLSearchParams();
    if (qVal.trim()) params.set("q", qVal.trim());
    if (srcVal !== "all") params.set("source", srcVal);
    if (tgtVal !== "all") params.set("target", tgtVal);
    if (posVal !== "all") params.set("pos", posVal);
    if (catVal !== "all") params.set("category", catVal);
    const qs = params.toString();
    return `/dictionary${qs ? `?${qs}` : ""}`;
  };

  const triggerSearch = (
    qOverride?: string,
    srcOverride?: LanguageCode | "all",
    tgtOverride?: LanguageCode | "all"
  ) => {
    const finalQ = qOverride !== undefined ? qOverride : query;
    const finalSrc = srcOverride !== undefined ? srcOverride : sourceLang;
    const finalTgt = tgtOverride !== undefined ? tgtOverride : targetLang;

    if (finalQ.trim()) {
      addSearchHistory(finalQ.trim(), finalSrc, finalTgt);
    }
    setShowDropdown(false);
    setActiveIndex(-1);

    if (onSearchChange) {
      onSearchChange({
        query: finalQ,
        source: finalSrc,
        target: finalTgt,
        pos: posFilter,
        category: categoryFilter,
      });
    }

    if (navigateOnSubmit) {
      router.push(
        buildDictionaryUrl(
          finalQ,
          finalSrc,
          finalTgt,
          posFilter,
          categoryFilter
        )
      );
    }
  };

  const handleSwapLanguages = () => {
    const nextSource = targetLang;
    const nextTarget = sourceLang;
    setSourceLang(nextSource);
    setTargetLang(nextTarget);
    if (onSearchChange) {
      onSearchChange({
        query,
        source: nextSource,
        target: nextTarget,
        pos: posFilter,
        category: categoryFilter,
      });
    }
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setActiveIndex(-1);
    inputRef.current?.focus();
    if (onSearchChange) {
      onSearchChange({
        query: "",
        source: sourceLang,
        target: targetLang,
        pos: posFilter,
        category: categoryFilter,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      if (suggestions.length > 0) {
        e.preventDefault();
        setShowDropdown(true);
        setActiveIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
      }
    } else if (e.key === "ArrowUp") {
      if (suggestions.length > 0) {
        e.preventDefault();
        setShowDropdown(true);
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setActiveIndex(-1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (showDropdown && activeIndex >= 0 && suggestions[activeIndex]) {
        const picked = suggestions[activeIndex];
        setQuery(picked.word);
        addSearchHistory(picked.word, picked.language, targetLang);
        setShowDropdown(false);
        router.push(
          `/word/${picked.language}/${encodeURIComponent(picked.word)}`
        );
      } else {
        triggerSearch();
      }
    }
  };

  return (
    <div ref={containerRef} className="w-full space-y-3">
      <div className="rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 shadow-lg shadow-ink-900/5 p-3 sm:p-4">
        {/* Language Pair Selector Row */}
        <div className="flex flex-wrap items-center gap-2 pb-3 mb-3 border-b border-ink-100 dark:border-ink-800">
          <div className="flex-1 min-w-[140px]">
            <label
              htmlFor="source-language-select"
              className="block text-[11px] font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-1"
            >
              {t.search.sourceLanguage}
            </label>
            <select
              id="source-language-select"
              data-testid="source-language-select"
              value={sourceLang}
              onChange={(e) => {
                const next = e.target.value as LanguageCode | "all";
                setSourceLang(next);
              }}
              className="w-full text-sm font-medium rounded-lg border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-950 text-ink-900 dark:text-ink-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lexicon-500"
            >
              <option value="all">{t.search.allLanguages}</option>
              {languages.map((lang) => {
                const disp = getLanguageDisplayName(lang.code, uiLocale);
                return (
                  <option key={lang.code} value={lang.code}>
                    {disp.includes(lang.nativeName)
                      ? disp
                      : `${disp} (${lang.nativeName})`}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="pt-4">
            <button
              type="button"
              onClick={handleSwapLanguages}
              data-testid="swap-languages-button"
              aria-label={t.search.swapLanguages}
              title={t.search.swapLanguages}
              className="p-2.5 rounded-lg border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-950 text-ink-700 dark:text-ink-200 hover:bg-lexicon-50 dark:hover:bg-lexicon-950 hover:text-lexicon-700 dark:hover:text-lexicon-300 transition-colors focus:outline-none focus:ring-2 focus:ring-lexicon-500"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 min-w-[140px]">
            <label
              htmlFor="target-language-select"
              className="block text-[11px] font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-1"
            >
              {t.search.targetLanguage}
            </label>
            <select
              id="target-language-select"
              data-testid="target-language-select"
              value={targetLang}
              onChange={(e) => {
                const next = e.target.value as LanguageCode | "all";
                setTargetLang(next);
              }}
              className="w-full text-sm font-medium rounded-lg border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-950 text-ink-900 dark:text-ink-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lexicon-500"
            >
              <option value="all">{t.search.allLanguages}</option>
              {languages.map((lang) => {
                const disp = getLanguageDisplayName(lang.code, uiLocale);
                return (
                  <option key={lang.code} value={lang.code}>
                    {disp.includes(lang.nativeName)
                      ? disp
                      : `${disp} (${lang.nativeName})`}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Main Search Input Row */}
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            triggerSearch();
          }}
          className="relative flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search
              aria-hidden="true"
              className="w-5 h-5 text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onFocus={() => setShowDropdown(true)}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true);
                setActiveIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              data-testid="search-input"
              aria-label={t.search.placeholder}
              aria-autocomplete="list"
              aria-expanded={showDropdown && suggestions.length > 0}
              aria-controls="lexicon-suggestions-listbox"
              placeholder={t.search.placeholder}
              className="w-full pl-11 pr-10 py-3 text-base rounded-xl border border-ink-200 dark:border-ink-700 bg-ink-50/60 dark:bg-ink-950 text-ink-900 dark:text-white placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-lexicon-500 focus:bg-white dark:focus:bg-ink-900 transition-all"
            />
            {query.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                data-testid="clear-search-button"
                aria-label={t.search.clearSearch}
                className="p-1.5 rounded-md text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 absolute right-2.5 top-1/2 -translate-y-1/2 focus:outline-none focus:ring-2 focus:ring-lexicon-500"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            data-testid="search-submit-button"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-lexicon-700 hover:bg-lexicon-800 dark:bg-lexicon-600 dark:hover:bg-lexicon-500 text-white font-semibold text-sm sm:text-base shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-lexicon-500 focus:ring-offset-2"
          >
            <span>{t.search.searchButton}</span>
            <ArrowRight className="w-4 h-4 hidden sm:inline" />
          </button>

          {/* Autocomplete & Typo-Tolerant Dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <ul
              id="lexicon-suggestions-listbox"
              role="listbox"
              data-testid="search-suggestions-dropdown"
              className="absolute left-0 right-0 top-full mt-2 z-50 rounded-xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 shadow-xl py-1.5 max-h-80 overflow-y-auto"
            >
              {suggestions.map((sug, idx) => {
                const isSelected = idx === activeIndex;
                return (
                  <li
                    key={`${sug.language}-${sug.word}-${idx}`}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setQuery(sug.word);
                      addSearchHistory(sug.word, sug.language, targetLang);
                      setShowDropdown(false);
                      router.push(
                        `/word/${sug.language}/${encodeURIComponent(sug.word)}`
                      );
                    }}
                    className={`px-4 py-2.5 cursor-pointer flex items-center justify-between gap-3 text-sm transition-colors ${
                      isSelected
                        ? "bg-lexicon-50 dark:bg-lexicon-950 text-lexicon-900 dark:text-lexicon-100"
                        : "text-ink-800 dark:text-ink-200 hover:bg-ink-50 dark:hover:bg-ink-800/60"
                    }`}
                  >
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-ink-900 dark:text-white truncate">
                          {sug.word}
                        </span>
                        {sug.romanization && (
                          <span className="text-xs text-ink-500 italic">
                            ({sug.romanization})
                          </span>
                        )}
                        <span className="text-[11px] font-mono uppercase px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300">
                          {sug.language}
                        </span>
                        {sug.reason === "typo_tolerant" && (
                          <span className="inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                            <Sparkles className="w-2.5 h-2.5" />
                            {t.search.didYouMean}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-ink-500 dark:text-ink-400 truncate mt-0.5">
                        {sug.shortDefinition}
                      </span>
                    </div>
                    <span className="text-xs text-ink-400 shrink-0">
                      {formatPartOfSpeech(sug.partOfSpeech, uiLocale)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </form>

        {/* Extended Dictionary Filters (POS & Malay Morphology) */}
        {showExtendedFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 mt-3 border-t border-ink-100 dark:border-ink-800">
            <div>
              <label
                htmlFor="pos-filter-select"
                className="block text-[11px] font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-1"
              >
                {t.search.allPartsOfSpeech}
              </label>
              <select
                id="pos-filter-select"
                data-testid="pos-filter-select"
                value={posFilter}
                onChange={(e) =>
                  setPosFilter(e.target.value as PartOfSpeech | "all")
                }
                className="w-full text-xs sm:text-sm rounded-lg border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-950 text-ink-800 dark:text-ink-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lexicon-500"
              >
                <option value="all">{t.search.allPartsOfSpeech}</option>
                {POS_OPTIONS.map((pos) => (
                  <option key={pos} value={pos}>
                    {formatPartOfSpeech(pos, uiLocale)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="category-filter-select"
                className="block text-[11px] font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-1"
              >
                {t.search.allCategories} (Bahasa Melayu)
              </label>
              <select
                id="category-filter-select"
                data-testid="category-filter-select"
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(
                    e.target.value as MalayMorphologyType | "all"
                  )
                }
                className="w-full text-xs sm:text-sm rounded-lg border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-950 text-ink-800 dark:text-ink-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lexicon-500"
              >
                <option value="all">{t.search.allCategories}</option>
                {MALAY_CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {formatMalayMorphologyType(cat, uiLocale)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Recent Search History Pills */}
      {searchHistory.length > 0 && (
        <div
          data-testid="search-history-list"
          className="flex flex-wrap items-center gap-2 px-1"
        >
          <span className="inline-flex items-center gap-1 text-xs font-medium text-ink-500 dark:text-ink-400">
            <Clock className="w-3.5 h-3.5" />
            {t.search.recentSearches}:
          </span>
          {searchHistory.slice(0, 6).map((item) => (
            <button
              key={`${item.query}-${item.timestamp}`}
              type="button"
              onClick={() => {
                setQuery(item.query);
                triggerSearch(
                  item.query,
                  item.sourceLanguage,
                  item.targetLanguage
                );
              }}
              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 text-ink-700 dark:text-ink-200 hover:border-lexicon-500 hover:text-lexicon-700 dark:hover:text-lexicon-300 transition-colors"
            >
              <span>{item.query}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={clearSearchHistory}
            data-testid="clear-history-button"
            className="inline-flex items-center gap-1 text-xs text-ink-400 hover:text-rose-600 dark:hover:text-rose-400 ml-1 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            <span>{t.search.clearHistory}</span>
          </button>
        </div>
      )}
    </div>
  );
}
