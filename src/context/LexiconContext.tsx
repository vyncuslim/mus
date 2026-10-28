"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { LanguageCode, PartOfSpeech, UiLocale } from "@/types/lexicon";
import { getUiDictionary, type UiDictionary } from "@/lib/i18n";
import { isValidUiLocale } from "@/lib/languages";

export interface SavedFavorite {
  id: string;
  word: string;
  slug: string;
  language: LanguageCode;
  romanization?: string;
  ipa?: string;
  partOfSpeech: PartOfSpeech;
  definition: string;
  savedAt: string;
  personalNote?: string;
}

export interface SearchHistoryItem {
  query: string;
  sourceLanguage: LanguageCode | "all";
  targetLanguage: LanguageCode | "all";
  timestamp: string;
}

export type MasteryStatus = "mastered" | "learning";

interface LexiconContextValue {
  uiLocale: UiLocale;
  setUiLocale: (locale: UiLocale) => void;
  t: UiDictionary;
  theme: "light" | "dark";
  toggleTheme: () => void;
  favorites: SavedFavorite[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (item: Omit<SavedFavorite, "savedAt">) => void;
  removeFavorite: (id: string) => void;
  updateFavoriteNote: (id: string, note: string) => void;
  clearFavorites: () => void;
  searchHistory: SearchHistoryItem[];
  addSearchHistory: (
    query: string,
    sourceLanguage: LanguageCode | "all",
    targetLanguage: LanguageCode | "all"
  ) => void;
  clearSearchHistory: () => void;
  masteryMap: Record<string, MasteryStatus>;
  setWordMastery: (entryId: string, status: MasteryStatus) => void;
  isOffline: boolean;
}

const STORAGE_KEYS = {
  UI_LOCALE: "vynalth_ui_locale",
  THEME: "vynalth_theme",
  FAVORITES: "vynalth_favorites",
  HISTORY: "vynalth_search_history",
  MASTERY: "vynalth_learning_progress",
} as const;

const LexiconContext = createContext<LexiconContextValue | undefined>(
  undefined
);

export function LexiconProvider({ children }: { children: React.ReactNode }) {
  const [uiLocale, setUiLocaleState] = useState<UiLocale>("zh-Hans");
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const [favorites, setFavorites] = useState<SavedFavorite[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [masteryMap, setMasteryMap] = useState<Record<string, MasteryStatus>>(
    {}
  );
  const [isOffline, setIsOffline] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const storedLocale = window.localStorage.getItem(STORAGE_KEYS.UI_LOCALE);
      if (storedLocale && isValidUiLocale(storedLocale)) {
        setUiLocaleState(storedLocale);
        document.documentElement.lang = storedLocale;
      } else {
        document.documentElement.lang = "zh-Hans";
      }

      const storedTheme = window.localStorage.getItem(STORAGE_KEYS.THEME);
      if (storedTheme === "dark" || storedTheme === "light") {
        setThemeState(storedTheme);
        document.documentElement.classList.toggle(
          "dark",
          storedTheme === "dark"
        );
      }

      const storedFavs = window.localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (storedFavs) {
        const parsed = JSON.parse(storedFavs);
        if (Array.isArray(parsed)) setFavorites(parsed);
      }

      const storedHistory = window.localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (storedHistory) {
        const parsed = JSON.parse(storedHistory);
        if (Array.isArray(parsed)) setSearchHistory(parsed);
      }

      const storedMastery = window.localStorage.getItem(STORAGE_KEYS.MASTERY);
      if (storedMastery) {
        const parsed = JSON.parse(storedMastery);
        if (parsed && typeof parsed === "object") setMasteryMap(parsed);
      }
    } catch {
      // Ignore storage access errors in restricted modes
    }

    setIsOffline(!window.navigator.onLine);
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Non-fatal in development
      });
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const setUiLocale = useCallback((locale: UiLocale) => {
    setUiLocaleState(locale);
    try {
      window.localStorage.setItem(STORAGE_KEYS.UI_LOCALE, locale);
      document.documentElement.lang = locale;
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "light" ? "dark" : "light";
      try {
        window.localStorage.setItem(STORAGE_KEYS.THEME, next);
        document.documentElement.classList.toggle("dark", next === "dark");
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.some((f) => f.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (item: Omit<SavedFavorite, "savedAt">) => {
      setFavorites((prev) => {
        const exists = prev.some((f) => f.id === item.id);
        const next = exists
          ? prev.filter((f) => f.id !== item.id)
          : [{ ...item, savedAt: new Date().toISOString() }, ...prev];
        try {
          window.localStorage.setItem(
            STORAGE_KEYS.FAVORITES,
            JSON.stringify(next)
          );
        } catch {
          // ignore
        }
        return next;
      });
    },
    []
  );

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.filter((f) => f.id !== id);
      try {
        window.localStorage.setItem(
          STORAGE_KEYS.FAVORITES,
          JSON.stringify(next)
        );
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const updateFavoriteNote = useCallback((id: string, note: string) => {
    setFavorites((prev) => {
      const next = prev.map((f) =>
        f.id === id ? { ...f, personalNote: note } : f
      );
      try {
        window.localStorage.setItem(
          STORAGE_KEYS.FAVORITES,
          JSON.stringify(next)
        );
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    try {
      window.localStorage.removeItem(STORAGE_KEYS.FAVORITES);
    } catch {
      // ignore
    }
  }, []);

  const addSearchHistory = useCallback(
    (
      query: string,
      sourceLanguage: LanguageCode | "all",
      targetLanguage: LanguageCode | "all"
    ) => {
      const trimmed = query.trim();
      if (!trimmed) return;
      setSearchHistory((prev) => {
        const filtered = prev.filter(
          (item) => item.query.toLowerCase() !== trimmed.toLowerCase()
        );
        const next: SearchHistoryItem[] = [
          {
            query: trimmed,
            sourceLanguage,
            targetLanguage,
            timestamp: new Date().toISOString(),
          },
          ...filtered,
        ].slice(0, 12);
        try {
          window.localStorage.setItem(
            STORAGE_KEYS.HISTORY,
            JSON.stringify(next)
          );
        } catch {
          // ignore
        }
        return next;
      });
    },
    []
  );

  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
    try {
      window.localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch {
      // ignore
    }
  }, []);

  const setWordMastery = useCallback(
    (entryId: string, status: MasteryStatus) => {
      setMasteryMap((prev) => {
        const next = { ...prev, [entryId]: status };
        try {
          window.localStorage.setItem(
            STORAGE_KEYS.MASTERY,
            JSON.stringify(next)
          );
        } catch {
          // ignore
        }
        return next;
      });
    },
    []
  );

  const t = useMemo(() => getUiDictionary(uiLocale), [uiLocale]);

  const value = useMemo<LexiconContextValue>(
    () => ({
      uiLocale,
      setUiLocale,
      t,
      theme,
      toggleTheme,
      favorites,
      isFavorite,
      toggleFavorite,
      removeFavorite,
      updateFavoriteNote,
      clearFavorites,
      searchHistory,
      addSearchHistory,
      clearSearchHistory,
      masteryMap,
      setWordMastery,
      isOffline,
    }),
    [
      uiLocale,
      setUiLocale,
      t,
      theme,
      toggleTheme,
      favorites,
      isFavorite,
      toggleFavorite,
      removeFavorite,
      updateFavoriteNote,
      clearFavorites,
      searchHistory,
      addSearchHistory,
      clearSearchHistory,
      masteryMap,
      setWordMastery,
      isOffline,
    ]
  );

  return (
    <LexiconContext.Provider value={value}>{children}</LexiconContext.Provider>
  );
}

export function useLexicon() {
  const ctx = useContext(LexiconContext);
  if (!ctx) {
    throw new Error("useLexicon must be used within a LexiconProvider");
  }
  return ctx;
}
