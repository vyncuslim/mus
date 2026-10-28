"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  GitBranch,
  Share2,
  ShieldCheck,
  BookOpen,
  Layers,
  Info,
} from "lucide-react";
import { useLexicon } from "@/context/LexiconContext";
import {
  formatMalayAffixType,
  formatMalayGolonganKata,
  formatMalayMorphologyType,
  formatPartOfSpeech,
} from "@/lib/i18n";
import {
  getAllLanguages,
  getLanguageDisplayName,
  getLanguageMetadata,
} from "@/lib/languages";
import { PronunciationControl } from "./PronunciationControl";
import type { LanguageCode, LexiconEntry } from "@/types/lexicon";

interface WordDetailClientProps {
  entry: LexiconEntry;
  morphologyFamily: LexiconEntry[];
  dataSourceMode: "postgresql" | "starter_dataset";
}

export function WordDetailClient({
  entry,
  morphologyFamily,
  dataSourceMode,
}: WordDetailClientProps) {
  const { uiLocale, t } = useLexicon();
  const langMeta = getLanguageMetadata(entry.language);
  const languages = getAllLanguages();

  const [selectedTargetLang, setSelectedTargetLang] = useState<
    LanguageCode | "all"
  >("all");
  const [copiedWord, setCopiedWord] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleCopyWord = async () => {
    try {
      await navigator.clipboard.writeText(entry.headword);
      setCopiedWord(true);
      setTimeout(() => setCopiedWord(false), 2000);
    } catch {
      setCopiedWord(true);
      setTimeout(() => setCopiedWord(false), 2000);
    }
  };

  const handleShareUrl = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb & Back Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dictionary"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 dark:text-ink-300 hover:text-lexicon-700 dark:hover:text-lexicon-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.nav.dictionary}</span>
        </Link>

        <span className="text-xs font-mono text-ink-500 dark:text-ink-400">
          {dataSourceMode === "postgresql"
            ? "PostgreSQL Live Record"
            : t.search.starterDatasetBadge}
        </span>
      </div>

      {/* Headword Hero Card */}
      <section className="rounded-3xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-3">
            {/* Language & POS Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-ink-100 dark:bg-ink-800 text-ink-800 dark:text-ink-200">
                {getLanguageDisplayName(entry.language, uiLocale).includes(
                  langMeta.nativeName
                )
                  ? getLanguageDisplayName(entry.language, uiLocale)
                  : `${getLanguageDisplayName(entry.language, uiLocale)} (${langMeta.nativeName})`}
              </span>
              <span className="px-2 py-0.5 rounded-md text-xs font-mono bg-ink-50 dark:bg-ink-950 text-ink-500 border border-ink-200 dark:border-ink-800">
                {langMeta.script}
              </span>
              {entry.partsOfSpeech.map((pos) => (
                <span
                  key={pos}
                  data-testid="word-pos-badge"
                  className="px-2.5 py-1 rounded-md text-xs font-semibold bg-lexicon-50 dark:bg-lexicon-950 text-lexicon-800 dark:text-lexicon-300 border border-lexicon-200 dark:border-lexicon-800"
                >
                  {formatPartOfSpeech(pos, uiLocale)}
                </span>
              ))}
            </div>

            {/* Headword */}
            <h1
              data-testid="word-detail-headword"
              dir={langMeta.direction}
              className="font-serif font-bold text-4xl sm:text-5xl text-ink-950 dark:text-white tracking-tight"
            >
              {entry.headword}
            </h1>

            {/* Pronunciation & IPA */}
            <PronunciationControl
              text={entry.headword}
              locale={entry.audioLocale}
              ipa={entry.ipa}
              romanization={entry.romanization}
            />
          </div>

          {/* Copy or share this entry */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopyWord}
              data-testid="copy-word-btn"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-950 text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
            >
              {copiedWord ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{t.wordDetail.copied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{t.wordDetail.copyWord}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleShareUrl}
              data-testid="share-url-btn"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-950 text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
            >
              {copiedUrl ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{t.wordDetail.copied}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>{t.wordDetail.shareUrl}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Malay Morphology & Root-Word Analysis Section */}
      {entry.malayMorphology && (
        <section
          data-testid="malay-morphology-section"
          aria-labelledby="malay-morphology-heading"
          className="rounded-3xl bg-gradient-to-br from-lexicon-50/90 via-white to-amber-50/40 dark:from-lexicon-950/60 dark:via-ink-900 dark:to-ink-900 border border-lexicon-200 dark:border-lexicon-800/80 p-6 sm:p-8 space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-lexicon-700 text-white flex items-center justify-center">
                <GitBranch className="w-4 h-4" />
              </div>
              <h2
                id="malay-morphology-heading"
                className="font-serif font-bold text-xl sm:text-2xl text-ink-900 dark:text-white"
              >
                {t.wordDetail.malayMorphologyHeading}
              </h2>
            </div>

            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-lexicon-100 dark:bg-lexicon-900 text-lexicon-900 dark:text-lexicon-200 font-semibold">
              {formatMalayMorphologyType(
                entry.malayMorphology.morphologyType,
                uiLocale
              )}
            </span>
          </div>

          {/* Structured Grid: Kata Dasar, Golongan Kata, Jenis Imbuhan, Formula */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white dark:bg-ink-950 border border-ink-200/80 dark:border-ink-800 p-4 space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                {t.wordDetail.kataDasarLabel}
              </span>
              <div className="pt-1">
                <Link
                  href={`/word/ms/${encodeURIComponent(entry.malayMorphology.kataDasar)}`}
                  data-testid="kata-dasar-link"
                  className="font-serif font-bold text-2xl text-lexicon-700 dark:text-lexicon-400 hover:underline inline-flex items-center gap-1.5"
                >
                  <span>{entry.malayMorphology.kataDasar}</span>
                </Link>
              </div>
            </div>

            <div className="rounded-2xl bg-white dark:bg-ink-950 border border-ink-200/80 dark:border-ink-800 p-4 space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                {t.wordDetail.golonganKataLabel}
              </span>
              <p className="font-semibold text-base text-ink-900 dark:text-white pt-1">
                {formatMalayGolonganKata(
                  entry.malayMorphology.golonganKata,
                  uiLocale
                )}
              </p>
            </div>

            <div className="rounded-2xl bg-white dark:bg-ink-950 border border-ink-200/80 dark:border-ink-800 p-4 space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                {t.wordDetail.affixTypeLabel}
              </span>
              <p className="font-semibold text-base text-ink-900 dark:text-white pt-1">
                {formatMalayAffixType(
                  entry.malayMorphology.affixType,
                  uiLocale
                )}
                {entry.malayMorphology.affixPattern
                  ? ` (${entry.malayMorphology.affixPattern})`
                  : ""}
              </p>
            </div>
          </div>

          {/* Morphological Formula & Explanation */}
          {entry.malayMorphology.formula && (
            <div className="rounded-xl bg-ink-900 text-white p-4 font-mono text-xs sm:text-sm">
              <span className="text-lexicon-400 font-semibold mr-2">
                {t.wordDetail.formulaLabel}:
              </span>
              <span>{entry.malayMorphology.formula}</span>
            </div>
          )}

          <div className="space-y-3 text-sm sm:text-base text-ink-800 dark:text-ink-200 leading-relaxed">
            <p>
              {uiLocale === "ms"
                ? entry.malayMorphology.explanationMs
                : uiLocale === "zh-Hans" &&
                  entry.malayMorphology.explanationZh
                ? entry.malayMorphology.explanationZh
                : entry.malayMorphology.explanationEn}
            </p>
            {uiLocale !== "ms" && (
              <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-400 italic">
                Huraian Bahasa Melayu: {entry.malayMorphology.explanationMs}
              </p>
            )}
          </div>

          {entry.malayMorphology.morphophonemicRule && (
            <div className="rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 p-4 text-xs sm:text-sm text-amber-950 dark:text-amber-200">
              <strong className="font-semibold block mb-1">
                {t.wordDetail.morphophonemicRuleLabel}:
              </strong>
              {entry.malayMorphology.morphophonemicRule}
            </div>
          )}

          {entry.malayMorphology.literalMeaning && (
            <div className="rounded-xl bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 p-4 text-xs sm:text-sm">
              <strong className="font-semibold text-ink-900 dark:text-white mr-2">
                {t.wordDetail.literalMeaningLabel}:
              </strong>
              <span className="text-ink-700 dark:text-ink-300">
                {entry.malayMorphology.literalMeaning}
              </span>
            </div>
          )}

          {entry.malayMorphology.classifierUsage && (
            <div className="rounded-xl bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-600 dark:text-ink-400">
                {t.wordDetail.classifierUsageLabel}
              </h3>
              <ul className="list-disc list-inside text-sm text-ink-700 dark:text-ink-300 space-y-1">
                {entry.malayMorphology.classifierUsage.targetTypes.map(
                  (target) => (
                    <li key={target}>{target}</li>
                  )
                )}
              </ul>
              <div className="flex flex-wrap gap-2 pt-1">
                {entry.malayMorphology.classifierUsage.examples.map((ex) => (
                  <span
                    key={ex}
                    className="text-xs font-medium px-2.5 py-1 rounded-md bg-lexicon-50 dark:bg-lexicon-950 text-lexicon-800 dark:text-lexicon-300 border border-lexicon-200 dark:border-lexicon-800"
                  >
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bidirectional Navigation Between Root & Derived Words */}
          {(morphologyFamily.length > 0 ||
            (entry.malayMorphology.derivedWords &&
              entry.malayMorphology.derivedWords.length > 0)) && (
            <div className="pt-2 space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-600 dark:text-ink-400">
                {t.wordDetail.derivedWordsLabel}
              </h3>
              <div className="flex flex-wrap gap-2">
                {morphologyFamily.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/word/ms/${encodeURIComponent(rel.headword)}`}
                    data-testid={`morphology-family-link-${rel.headword}`}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-ink-950 border border-ink-200 dark:border-ink-800 hover:border-lexicon-500 text-sm font-medium text-ink-900 dark:text-white shadow-sm transition-colors"
                  >
                    <span className="font-serif font-bold text-lexicon-700 dark:text-lexicon-400">
                      {rel.headword}
                    </span>
                    {rel.malayMorphology?.affixPattern && (
                      <span className="text-xs font-mono text-ink-500">
                        ({rel.malayMorphology.affixPattern})
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Sense-by-Sense Definitions & Translations */}
      <section className="space-y-6" aria-label="Word Senses and Definitions">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif font-bold text-2xl text-ink-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-lexicon-600" />
            <span>
              Definitions & {t.wordDetail.translationsHeading} (
              {entry.senses.length})
            </span>
          </h2>

          {/* Target Language Filter for Sense Translations */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="detail-target-lang"
              className="text-xs font-semibold uppercase tracking-wider text-ink-500"
            >
              {t.search.targetLanguage}:
            </label>
            <select
              id="detail-target-lang"
              data-testid="detail-target-language-select"
              value={selectedTargetLang}
              onChange={(e) =>
                setSelectedTargetLang(e.target.value as LanguageCode | "all")
              }
              className="text-xs sm:text-sm font-medium rounded-lg border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 text-ink-800 dark:text-ink-100 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-lexicon-500"
            >
              <option value="all">{t.search.allLanguages}</option>
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {getLanguageDisplayName(lang.code, uiLocale)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-6">
          {entry.senses.map((sense) => {
            const filteredTranslations =
              selectedTargetLang === "all"
                ? sense.translations
                : sense.translations.filter(
                    (tr) => tr.language === selectedTargetLang
                  );

            return (
              <article
                key={sense.id}
                data-testid={`word-sense-${sense.senseNumber}`}
                className="rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 p-6 space-y-5 shadow-sm"
              >
                {/* Sense Header */}
                <div className="flex flex-wrap items-center gap-2 border-b border-ink-100 dark:border-ink-800 pb-3">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-lexicon-700 text-white font-bold text-xs">
                    {sense.senseNumber}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-lexicon-50 dark:bg-lexicon-950 text-lexicon-800 dark:text-lexicon-300">
                    {formatPartOfSpeech(sense.partOfSpeech, uiLocale)}
                  </span>
                  {sense.domain && (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300">
                      Domain: {sense.domain}
                    </span>
                  )}
                  {sense.register && (
                    <span className="text-xs italic px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                      {sense.register}
                    </span>
                  )}
                </div>

                {/* Sense Definitions */}
                <div className="space-y-2">
                  <p className="text-base sm:text-lg font-medium text-ink-900 dark:text-white leading-relaxed">
                    {sense.localizedDefinitions[uiLocale] || sense.definition}
                  </p>

                  {/* Show additional localized definitions for multilingual clarity */}
                  <div className="flex flex-col gap-1 text-xs sm:text-sm text-ink-600 dark:text-ink-400">
                    {uiLocale !== "en" && sense.localizedDefinitions.en && (
                      <p>
                        <strong className="font-mono uppercase text-[11px] text-ink-400 mr-1.5">
                          EN:
                        </strong>
                        {sense.localizedDefinitions.en}
                      </p>
                    )}
                    {uiLocale !== "ms" && sense.localizedDefinitions.ms && (
                      <p>
                        <strong className="font-mono uppercase text-[11px] text-ink-400 mr-1.5">
                          MS:
                        </strong>
                        {sense.localizedDefinitions.ms}
                      </p>
                    )}
                    {uiLocale !== "zh-Hans" &&
                      sense.localizedDefinitions["zh-Hans"] && (
                        <p>
                          <strong className="font-mono uppercase text-[11px] text-ink-400 mr-1.5">
                            ZH:
                          </strong>
                          {sense.localizedDefinitions["zh-Hans"]}
                        </p>
                      )}
                  </div>
                </div>

                {/* Sense-Aligned Translations */}
                <div className="space-y-2.5 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400">
                    {t.wordDetail.translationsHeading}
                  </h3>
                  {filteredTranslations.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {filteredTranslations.map((tr) => {
                        const trMeta = getLanguageMetadata(tr.language);
                        return (
                          <div
                            key={tr.language}
                            dir={trMeta.direction}
                            className="rounded-xl bg-ink-50/80 dark:bg-ink-950/80 border border-ink-200/70 dark:border-ink-800 p-3 flex flex-col justify-between gap-1"
                          >
                            <span className="text-[11px] font-semibold text-ink-500 dark:text-ink-400">
                              {getLanguageDisplayName(tr.language, uiLocale)}
                            </span>
                            <div className="font-medium text-sm text-ink-900 dark:text-white flex flex-wrap gap-1.5">
                              {tr.terms.map((term, i) => (
                                <React.Fragment key={term}>
                                  <Link
                                    href={`/dictionary?q=${encodeURIComponent(term)}&source=${tr.language}`}
                                    className="hover:text-lexicon-700 dark:hover:text-lexicon-400 hover:underline"
                                  >
                                    {term}
                                  </Link>
                                  {i < tr.terms.length - 1 && <span>,</span>}
                                </React.Fragment>
                              ))}
                            </div>
                            {tr.romanization && (
                              <span className="text-xs text-ink-500 italic">
                                {tr.romanization}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p
                      data-testid="no-verified-translation-notice"
                      className="text-xs sm:text-sm text-ink-500 italic bg-ink-50 dark:bg-ink-950 p-3 rounded-xl border border-ink-200 dark:border-ink-800"
                    >
                      {t.wordDetail.noVerifiedTranslation}
                    </p>
                  )}
                </div>

                {/* Authentic Example Sentences */}
                {sense.examples.length > 0 && (
                  <div className="space-y-2.5 pt-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400">
                      {t.wordDetail.examplesHeading}
                    </h3>
                    <div className="space-y-2.5">
                      {sense.examples.map((ex, idx) => (
                        <blockquote
                          key={idx}
                          dir={langMeta.direction}
                          className="border-l-4 border-lexicon-500 pl-4 py-1 space-y-1 bg-ink-50/50 dark:bg-ink-950/40 rounded-r-xl pr-3"
                        >
                          <p className="text-sm sm:text-base font-medium text-ink-900 dark:text-ink-100">
                            &ldquo;{ex.text}&rdquo;
                          </p>
                          {ex.romanization && (
                            <p className="text-xs text-ink-500 italic">
                              {ex.romanization}
                            </p>
                          )}
                          {Object.entries(ex.translations).map(
                            ([langCode, trText]) => (
                              <p
                                key={langCode}
                                dir="ltr"
                                className="text-xs sm:text-sm text-ink-600 dark:text-ink-400"
                              >
                                <span className="font-mono text-[10px] uppercase text-ink-400 mr-1.5">
                                  {langCode}:
                                </span>
                                {trText}
                              </p>
                            )
                          )}
                        </blockquote>
                      ))}
                    </div>
                  </div>
                )}

                {/* Synonyms & Antonyms */}
                {(sense.synonyms.length > 0 || sense.antonyms.length > 0) && (
                  <div className="flex flex-wrap gap-6 pt-3 border-t border-ink-100 dark:border-ink-800">
                    {sense.synonyms.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                          {t.wordDetail.synonymsHeading}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {sense.synonyms.map((syn) => (
                            <Link
                              key={syn}
                              href={`/dictionary?q=${encodeURIComponent(syn)}&source=${entry.language}`}
                              className="text-xs px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 hover:underline"
                            >
                              {syn}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {sense.antonyms.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 block">
                          {t.wordDetail.antonymsHeading}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {sense.antonyms.map((ant) => (
                            <Link
                              key={ant}
                              href={`/dictionary?q=${encodeURIComponent(ant)}&source=${entry.language}`}
                              className="text-xs px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-800 hover:underline"
                            >
                              {ant}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* Word Forms, Etymology & Grammar Notes */}
      {(entry.wordForms?.length || entry.etymology || entry.grammarNote) && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {entry.wordForms && entry.wordForms.length > 0 && (
            <div className="rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 p-6 space-y-3">
              <h3 className="font-serif font-bold text-lg text-ink-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-lexicon-600" />
                <span>{t.wordDetail.wordFormsHeading}</span>
              </h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm">
                {entry.wordForms.map((wf) => (
                  <div
                    key={`${wf.label}-${wf.form}`}
                    className="rounded-xl bg-ink-50 dark:bg-ink-950 p-3 border border-ink-200/70 dark:border-ink-800"
                  >
                    <dt className="text-xs text-ink-500">{wf.label}</dt>
                    <dd className="font-semibold text-ink-900 dark:text-white mt-0.5">
                      {wf.form}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {(entry.etymology || entry.grammarNote) && (
            <div className="rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 p-6 space-y-4">
              {entry.etymology && (
                <div className="space-y-1.5">
                  <h3 className="font-serif font-bold text-lg text-ink-900 dark:text-white flex items-center gap-2">
                    <Info className="w-4 h-4 text-lexicon-600" />
                    <span>{t.wordDetail.etymologyHeading}</span>
                  </h3>
                  <p className="text-sm text-ink-700 dark:text-ink-300 leading-relaxed">
                    {entry.etymology}
                  </p>
                </div>
              )}

              {entry.grammarNote && (
                <div className="space-y-1.5 pt-2 border-t border-ink-100 dark:border-ink-800">
                  <h3 className="font-serif font-bold text-base text-ink-900 dark:text-white">
                    {t.wordDetail.grammarNoteHeading}
                  </h3>
                  <p className="text-sm text-ink-700 dark:text-ink-300 leading-relaxed">
                    {entry.grammarNote}
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* Source & License Attribution Footer Card */}
      <section
        data-testid="word-provenance-card"
        aria-labelledby="provenance-heading"
        className="rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 p-5 sm:p-6 space-y-3"
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400">
          <ShieldCheck className="w-4 h-4 text-lexicon-600" />
          <h3 id="provenance-heading">{t.wordDetail.provenanceHeading}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div>
            <span className="text-ink-500 block">
              {t.wordDetail.sourceDatasetLabel}
            </span>
            <a
              href={entry.provenance.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-lexicon-700 dark:text-lexicon-400 hover:underline inline-flex items-center gap-1 mt-0.5"
            >
              <span>{entry.provenance.sourceName}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div>
            <span className="text-ink-500 block">
              {t.wordDetail.licenseNoticeLabel}
            </span>
            <a
              href={entry.provenance.licenseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-lexicon-700 dark:text-lexicon-400 hover:underline inline-flex items-center gap-1 mt-0.5"
            >
              <span>{entry.provenance.license}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div>
            <span className="text-ink-500 block">
              {t.wordDetail.importedVersionLabel}
            </span>
            <span className="font-mono text-ink-800 dark:text-ink-200 mt-0.5 block">
              {entry.provenance.sourceVersion} (
              {entry.provenance.importedAt.slice(0, 10)})
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
