import type {
  LanguageCode,
  LexiconEntry,
  MalayMorphologyType,
  PartOfSpeech,
  SearchResponse,
  SearchResultItem,
  SearchSuggestion,
  SenseTranslation,
} from "@/types/lexicon";
import { STARTER_LEXICON_ENTRIES } from "@/data/starter-lexicon";
import {
  computeEditDistance,
  normalizeCompactKey,
  normalizeSearchKey,
  normalizeUnicode,
} from "./text-normalize";
import { analyzeMalayMorphology } from "./malay-morphology";

export interface SearchOptions {
  query: string;
  sourceLanguage?: LanguageCode | "all";
  targetLanguage?: LanguageCode | "all";
  partOfSpeech?: PartOfSpeech | "all";
  category?: MalayMorphologyType | "all";
  limit?: number;
  entries?: readonly LexiconEntry[];
  dataSourceMode?: "postgresql" | "starter_dataset";
}

function getTargetTranslationsForEntry(
  entry: LexiconEntry,
  targetLanguage: LanguageCode | "all"
): SenseTranslation[] {
  const seen = new Map<string, SenseTranslation>();
  for (const sense of entry.senses) {
    for (const tr of sense.translations) {
      if (targetLanguage !== "all" && tr.language !== targetLanguage) {
        continue;
      }
      const existing = seen.get(tr.language);
      if (!existing) {
        seen.set(tr.language, {
          language: tr.language,
          terms: [...tr.terms],
          romanization: tr.romanization,
          notes: tr.notes,
        });
      } else {
        for (const term of tr.terms) {
          if (!existing.terms.includes(term)) {
            existing.terms.push(term);
          }
        }
      }
    }
  }
  return Array.from(seen.values());
}

/**
 * Executes deterministic, ranked lexical search over the dictionary entries.
 * Prioritizes exact headword matches over normalized/reading matches, prefix matches,
 * morphological relatives, and translation matches.
 */
export function executeLexiconSearch(options: SearchOptions): SearchResponse {
  const startTime = performance.now();
  const entries = options.entries ?? STARTER_LEXICON_ENTRIES;
  const rawQuery = normalizeUnicode(options.query ?? "");
  const normQuery = normalizeSearchKey(rawQuery);
  const compactQuery = normalizeCompactKey(rawQuery);

  const sourceLanguage = options.sourceLanguage ?? "all";
  const targetLanguage = options.targetLanguage ?? "all";
  const partOfSpeechFilter = options.partOfSpeech ?? "all";
  const categoryFilter = options.category ?? "all";
  const limit = Math.min(Math.max(options.limit ?? 30, 1), 100);
  const dataSourceMode = options.dataSourceMode ?? "starter_dataset";

  // Build verified Malay root set from entries
  const malayRootsFromDataset = new Set<string>();
  for (const entry of entries) {
    if (entry.language === "ms") {
      malayRootsFromDataset.add(entry.normalizedHeadword);
      if (entry.malayMorphology?.kataDasar) {
        malayRootsFromDataset.add(
          normalizeSearchKey(entry.malayMorphology.kataDasar)
        );
      }
    }
  }

  const ruleAnalysis =
    normQuery && (sourceLanguage === "ms" || sourceLanguage === "all")
      ? analyzeMalayMorphology(normQuery, malayRootsFromDataset)
      : null;

  // If no query is provided, return featured or filtered entries
  if (!normQuery) {
    const filtered = entries
      .filter((entry) => {
        if (sourceLanguage !== "all" && entry.language !== sourceLanguage) {
          return false;
        }
        if (
          partOfSpeechFilter !== "all" &&
          !entry.partsOfSpeech.includes(partOfSpeechFilter)
        ) {
          return false;
        }
        if (
          categoryFilter !== "all" &&
          entry.malayMorphology?.morphologyType !== categoryFilter
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => (a.frequencyRank ?? 999) - (b.frequencyRank ?? 999))
      .slice(0, limit);

    const items: SearchResultItem[] = filtered.map((entry) => ({
      entry,
      matchType: "exact",
      score: 1000 - (entry.frequencyRank ?? 500),
      targetTranslations: getTargetTranslationsForEntry(entry, targetLanguage),
    }));

    const latencyMs = Number((performance.now() - startTime).toFixed(2));
    return {
      query: rawQuery,
      normalizedQuery: normQuery,
      sourceLanguage,
      targetLanguage,
      partOfSpeechFilter,
      categoryFilter,
      totalResults: items.length,
      exactMatches: items,
      prefixMatches: [],
      relatedMatches: [],
      suggestions: [],
      ruleAnalysis: null,
      latencyMs,
      dataSourceMode,
    };
  }

  const exactMatches: SearchResultItem[] = [];
  const prefixMatches: SearchResultItem[] = [];
  const relatedMatches: SearchResultItem[] = [];

  for (const entry of entries) {
    // Apply POS and Category filters
    if (
      partOfSpeechFilter !== "all" &&
      !entry.partsOfSpeech.includes(partOfSpeechFilter)
    ) {
      continue;
    }
    if (
      categoryFilter !== "all" &&
      entry.malayMorphology?.morphologyType !== categoryFilter
    ) {
      continue;
    }

    const matchesSourceFilter =
      sourceLanguage === "all" || entry.language === sourceLanguage;

    const headwordLower = entry.headword.toLowerCase();
    const normHeadword = entry.normalizedHeadword;
    const compactHeadword = normalizeCompactKey(entry.headword);
    const normRomanization = entry.romanization
      ? normalizeSearchKey(entry.romanization)
      : "";
    const compactRomanization = entry.romanization
      ? normalizeCompactKey(entry.romanization)
      : "";

    let matchType: SearchResultItem["matchType"] | null = null;
    let score = 0;
    let matchedTerm: string | undefined;

    if (matchesSourceFilter) {
      // 1. Exact Unicode / Case-insensitive match on headword
      if (entry.headword === rawQuery) {
        matchType = "exact";
        score = 1000;
        matchedTerm = entry.headword;
      } else if (headwordLower === rawQuery.toLowerCase()) {
        matchType = "exact";
        score = 980;
        matchedTerm = entry.headword;
      }
      // 2. Diacritic-normalized or compact exact match on headword (e.g. cafe -> café, علم -> عِلْم)
      else if (
        normHeadword === normQuery ||
        (compactQuery.length >= 2 && compactHeadword === compactQuery)
      ) {
        matchType = "normalized";
        score = 940;
        matchedTerm = entry.headword;
      }
      // 3. Exact match on Romanization / Pinyin / Romaji (e.g. xuexi -> 学习, taberu -> 食べる)
      else if (
        normRomanization &&
        (normRomanization === normQuery ||
          (compactQuery.length >= 2 && compactRomanization === compactQuery))
      ) {
        matchType = "normalized";
        score = 910;
        matchedTerm = entry.romanization;
      }
      // 4. Exact match on inflected word form (e.g. eaten -> eat, kutub -> كتاب)
      else if (
        entry.wordForms?.some((wf) => {
          const nForm = normalizeSearchKey(wf.form);
          return (
            nForm === normQuery ||
            nForm.split(/[\s/()]+/).includes(normQuery)
          );
        })
      ) {
        matchType = "word_form";
        score = 860;
        matchedTerm = entry.wordForms?.find((wf) =>
          normalizeSearchKey(wf.form).includes(normQuery)
        )?.form;
      }
      // 5. Prefix match on headword or romanization
      else if (
        normHeadword.startsWith(normQuery) ||
        (normQuery.length >= 2 && normRomanization.startsWith(normQuery)) ||
        (compactQuery.length >= 2 &&
          compactRomanization.startsWith(compactQuery))
      ) {
        matchType = "prefix";
        score =
          780 - Math.min(Math.abs(normHeadword.length - normQuery.length) * 5, 80);
        matchedTerm = entry.headword;
      }
      // 6. Malay Morphology match: Kata Dasar or Derived Word link
      else if (
        entry.language === "ms" &&
        entry.malayMorphology &&
        (normalizeSearchKey(entry.malayMorphology.kataDasar) === normQuery ||
          (ruleAnalysis &&
            normalizeSearchKey(entry.malayMorphology.kataDasar) ===
              normalizeSearchKey(ruleAnalysis.possibleKataDasar)) ||
          entry.malayMorphology.derivedWords?.some(
            (dw) => normalizeSearchKey(dw) === normQuery
          ))
      ) {
        matchType = "morphology";
        score = 820;
        matchedTerm = `Kata dasar: ${entry.malayMorphology.kataDasar}`;
      }
      // 7. Substring inside multi-word idiom/proverb headword (e.g. "aur" or "tebing" in "bagai aur dengan tebing")
      else if (normHeadword.includes(normQuery) && normQuery.length >= 2) {
        matchType = "prefix";
        score = 710;
        matchedTerm = entry.headword;
      }
    }

    // 8. Reverse / Cross-language sense translation match
    if (!matchType) {
      for (const sense of entry.senses) {
        for (const tr of sense.translations) {
          // Allow matching if entry is in sourceLanguage OR if tr is in sourceLanguage/targetLanguage
          const validDirection =
            matchesSourceFilter ||
            (tr.language === sourceLanguage &&
              (targetLanguage === "all" || entry.language === targetLanguage));

          if (!validDirection) continue;

          for (const term of tr.terms) {
            const normTerm = normalizeSearchKey(term);
            if (normTerm === normQuery) {
              matchType = "translation";
              score = matchesSourceFilter ? 750 : 730;
              matchedTerm = `${term} (${tr.language})`;
              break;
            } else if (
              normQuery.length >= 3 &&
              (normTerm.startsWith(normQuery) ||
                normTerm.split(/\s+/).includes(normQuery))
            ) {
              matchType = "translation";
              score = 640;
              matchedTerm = `${term} (${tr.language})`;
            }
          }
          if (matchType && score >= 730) break;
        }
        if (matchType && score >= 730) break;
      }
    }

    // 9. Definition / Synonym keyword match within source language filter
    if (!matchType && matchesSourceFilter && normQuery.length >= 3) {
      for (const sense of entry.senses) {
        const synMatch = sense.synonyms.find(
          (syn) => normalizeSearchKey(syn) === normQuery
        );
        if (synMatch) {
          matchType = "definition";
          score = 620;
          matchedTerm = `Synonym: ${synMatch}`;
          break;
        }
        const defText = [
          sense.definition,
          ...Object.values(sense.localizedDefinitions),
        ]
          .join(" ")
          .toLowerCase();
        const wordBoundaryRegex = new RegExp(
          `\\b${normQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
          "i"
        );
        if (wordBoundaryRegex.test(defText)) {
          matchType = "definition";
          score = 520;
          matchedTerm = sense.definition;
          break;
        }
      }
    }

    if (matchType) {
      // Tie-break by frequency rank
      const rankBonus = Math.max(0, 50 - (entry.frequencyRank ?? 50)) * 0.2;
      const item: SearchResultItem = {
        entry,
        matchType,
        score: Number((score + rankBonus).toFixed(2)),
        matchedTerm,
        targetTranslations: getTargetTranslationsForEntry(
          entry,
          targetLanguage
        ),
      };

      if (matchType === "exact" || matchType === "normalized") {
        exactMatches.push(item);
      } else if (
        matchType === "prefix" ||
        matchType === "morphology" ||
        matchType === "word_form"
      ) {
        prefixMatches.push(item);
      } else {
        relatedMatches.push(item);
      }
    }
  }

  exactMatches.sort((a, b) => b.score - a.score);
  prefixMatches.sort((a, b) => b.score - a.score);
  relatedMatches.sort((a, b) => b.score - a.score);

  // Compute typo-tolerant suggestions when query is >= 3 chars
  const suggestions = computeSuggestions(
    rawQuery,
    sourceLanguage,
    entries,
    new Set(
      [...exactMatches, ...prefixMatches].map((item) => item.entry.id)
    )
  );

  const totalResults =
    exactMatches.length + prefixMatches.length + relatedMatches.length;
  const latencyMs = Number((performance.now() - startTime).toFixed(2));

  return {
    query: rawQuery,
    normalizedQuery: normQuery,
    sourceLanguage,
    targetLanguage,
    partOfSpeechFilter,
    categoryFilter,
    totalResults,
    exactMatches: exactMatches.slice(0, limit),
    prefixMatches: prefixMatches.slice(0, limit),
    relatedMatches: relatedMatches.slice(0, limit),
    suggestions,
    ruleAnalysis,
    latencyMs,
    dataSourceMode,
  };
}

/**
 * Generates fast autocomplete and typo-tolerant suggestions.
 */
export function computeSuggestions(
  query: string,
  language: LanguageCode | "all" = "all",
  entries: readonly LexiconEntry[] = STARTER_LEXICON_ENTRIES,
  excludeIds: Set<string> = new Set(),
  limit = 6
): SearchSuggestion[] {
  const normQuery = normalizeSearchKey(query);
  if (!normQuery) return [];

  const candidates: SearchSuggestion[] = [];

  for (const entry of entries) {
    if (excludeIds.has(entry.id)) continue;
    if (language !== "all" && entry.language !== language) continue;

    const normHead = entry.normalizedHeadword;
    const normRom = entry.romanization
      ? normalizeSearchKey(entry.romanization)
      : "";

    const primarySense = entry.senses[0];
    const shortDef = primarySense?.definition ?? "";
    const pos = entry.partsOfSpeech[0] ?? "noun";

    // Prefix suggestion
    if (
      normHead.startsWith(normQuery) ||
      (normRom && normRom.startsWith(normQuery))
    ) {
      candidates.push({
        word: entry.headword,
        language: entry.language,
        romanization: entry.romanization,
        partOfSpeech: pos,
        shortDefinition: shortDef,
        distance: 0,
        reason: "prefix",
      });
      continue;
    }

    // Bounded typo-tolerant edit distance
    if (normQuery.length >= 3) {
      const maxAllowedDistance = normQuery.length >= 6 ? 2 : 1;
      const distHead = computeEditDistance(normQuery, normHead);
      const distRom = normRom
        ? computeEditDistance(normQuery, normRom)
        : 99;
      const bestDist = Math.min(distHead, distRom);

      if (bestDist > 0 && bestDist <= maxAllowedDistance) {
        candidates.push({
          word: entry.headword,
          language: entry.language,
          romanization: entry.romanization,
          partOfSpeech: pos,
          shortDefinition: shortDef,
          distance: bestDist,
          reason: "typo_tolerant",
        });
      }
    }
  }

  candidates.sort((a, b) => a.distance - b.distance);
  return candidates.slice(0, limit);
}
