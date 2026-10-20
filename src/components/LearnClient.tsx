"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  HelpCircle,
  Layers,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";
import { useLexicon } from "@/context/LexiconContext";
import {
  CURATED_LEARNING_COLLECTIONS,
  STARTER_LEXICON_ENTRIES,
} from "@/data/starter-lexicon";
import { formatPartOfSpeech } from "@/lib/i18n";
import { getLanguageDisplayName, getLanguageMetadata } from "@/lib/languages";
import { PronunciationControl } from "./PronunciationControl";
import type { LexiconEntry } from "@/types/lexicon";

export function LearnClient() {
  const { uiLocale, t, favorites, masteryMap, setWordMastery } = useLexicon();

  const [activeTab, setActiveTab] = useState<
    "flashcards" | "quiz" | "collections"
  >("flashcards");
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>(
    CURATED_LEARNING_COLLECTIONS[0].id
  );
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Build active deck from either "favorites" or selected curated collection
  const activeDeck: LexiconEntry[] = useMemo(() => {
    if (selectedCollectionId === "saved-favorites" && favorites.length > 0) {
      const favIds = new Set(favorites.map((f) => f.id));
      const matched = STARTER_LEXICON_ENTRIES.filter((e) => favIds.has(e.id));
      if (matched.length > 0) return matched;
    }

    const col =
      CURATED_LEARNING_COLLECTIONS.find((c) => c.id === selectedCollectionId) ??
      CURATED_LEARNING_COLLECTIONS[0];
    const idSet = new Set(col.entryIds);
    return STARTER_LEXICON_ENTRIES.filter((e) => idSet.has(e.id));
  }, [selectedCollectionId, favorites]);

  const currentCard = activeDeck[cardIndex] ?? activeDeck[0];

  // Quiz state
  const quizQuestions = useMemo(() => {
    const pool = STARTER_LEXICON_ENTRIES.slice(0, 12);
    return pool.slice(0, 6).map((entry, idx) => {
      const correctDef =
        entry.senses[0]?.localizedDefinitions[uiLocale] ||
        entry.senses[0]?.definition ||
        "";
      const distractors = pool
        .filter((other) => other.id !== entry.id)
        .slice(idx % 3, (idx % 3) + 3)
        .map(
          (other) =>
            other.senses[0]?.localizedDefinitions[uiLocale] ||
            other.senses[0]?.definition ||
            ""
        );

      // Deterministic option order based on index
      const options = [...distractors];
      options.splice(idx % 4, 0, correctDef);

      return {
        entry,
        prompt: entry.headword,
        correctAnswer: correctDef,
        options: options.slice(0, 4),
      };
    });
  }, [uiLocale]);

  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submittedAnswer, setSubmittedAnswer] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = quizQuestions[quizIndex];
  const masteredTotal = Object.values(masteryMap).filter(
    (s) => s === "mastered"
  ).length;

  const handleSubmitQuizOption = () => {
    if (!selectedOption || submittedAnswer) return;
    setSubmittedAnswer(true);
    if (selectedOption === currentQuestion.correctAnswer) {
      setQuizScore((prev) => prev + 1);
      setWordMastery(currentQuestion.entry.id, "mastered");
    }
  };

  const handleNextQuestion = () => {
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
      setSubmittedAnswer(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleResetQuiz = () => {
    setQuizIndex(0);
    setSelectedOption(null);
    setSubmittedAnswer(false);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Progress Summary */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-ink-200 dark:border-ink-800 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-lexicon-700 dark:text-lexicon-400">
            <GraduationCap className="w-4 h-4" />
            <span>Interactive Vocabulary & Morphology Studio</span>
          </div>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-ink-900 dark:text-white">
            {t.learn.title}
          </h1>
          <p className="text-sm sm:text-base text-ink-600 dark:text-ink-400 max-w-2xl">
            {t.learn.subtitle}
          </p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 px-4 py-3 flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-ink-500 block">
              {t.learn.masteredCount}
            </span>
            <span
              data-testid="mastered-words-count"
              className="font-serif font-bold text-lg text-ink-900 dark:text-white"
            >
              {masteredTotal} words
            </span>
          </div>
        </div>
      </div>

      {/* Mode Tabs */}
      <div
        role="tablist"
        aria-label="Learning Modes"
        className="flex flex-wrap gap-2"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "flashcards"}
          data-testid="tab-flashcards"
          onClick={() => setActiveTab("flashcards")}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            activeTab === "flashcards"
              ? "bg-lexicon-700 text-white shadow-sm"
              : "bg-white dark:bg-ink-900 text-ink-700 dark:text-ink-200 border border-ink-200 dark:border-ink-800 hover:bg-ink-50"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{t.learn.flashcardsTab}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "quiz"}
          data-testid="tab-quiz"
          onClick={() => setActiveTab("quiz")}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            activeTab === "quiz"
              ? "bg-lexicon-700 text-white shadow-sm"
              : "bg-white dark:bg-ink-900 text-ink-700 dark:text-ink-200 border border-ink-200 dark:border-ink-800 hover:bg-ink-50"
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>{t.learn.quizTab}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "collections"}
          data-testid="tab-collections"
          onClick={() => setActiveTab("collections")}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            activeTab === "collections"
              ? "bg-lexicon-700 text-white shadow-sm"
              : "bg-white dark:bg-ink-900 text-ink-700 dark:text-ink-200 border border-ink-200 dark:border-ink-800 hover:bg-ink-50"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{t.learn.collectionsTab}</span>
        </button>
      </div>

      {/* TAB 1: FLASHCARDS */}
      {activeTab === "flashcards" && currentCard && (
        <div className="space-y-6">
          {/* Deck Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <label
                htmlFor="deck-select"
                className="text-xs font-semibold uppercase tracking-wider text-ink-500"
              >
                Active Study Deck:
              </label>
              <select
                id="deck-select"
                data-testid="flashcard-deck-select"
                value={selectedCollectionId}
                onChange={(e) => {
                  setSelectedCollectionId(e.target.value);
                  setCardIndex(0);
                  setIsFlipped(false);
                }}
                className="text-sm font-medium rounded-xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 text-ink-900 dark:text-white px-3 py-2"
              >
                {CURATED_LEARNING_COLLECTIONS.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.title[uiLocale]}
                  </option>
                ))}
                {favorites.length > 0 && (
                  <option value="saved-favorites">
                    Saved Favorites ({favorites.length})
                  </option>
                )}
              </select>
            </div>

            <span className="text-xs font-mono text-ink-500">
              Card {cardIndex + 1} of {activeDeck.length}
            </span>
          </div>

          {/* Flashcard Surface */}
          <div
            data-testid="flashcard-card"
            onClick={() => setIsFlipped((prev) => !prev)}
            className="cursor-pointer rounded-3xl bg-white dark:bg-ink-900 border-2 border-ink-200 dark:border-ink-800 hover:border-lexicon-500 shadow-lg p-8 sm:p-12 min-h-[320px] flex flex-col justify-between transition-all"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-200">
                  {getLanguageDisplayName(currentCard.language, uiLocale)}
                </span>
                <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-lexicon-50 dark:bg-lexicon-950 text-lexicon-800 dark:text-lexicon-300">
                  {formatPartOfSpeech(
                    currentCard.partsOfSpeech[0] ?? "noun",
                    uiLocale
                  )}
                </span>
                {masteryMap[currentCard.id] && (
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                      masteryMap[currentCard.id] === "mastered"
                        ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                        : "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                    }`}
                  >
                    {masteryMap[currentCard.id] === "mastered"
                      ? t.learn.markKnown
                      : t.learn.markLearning}
                  </span>
                )}
              </div>

              <button
                type="button"
                data-testid="flip-flashcard-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped((prev) => !prev);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-lexicon-700 dark:text-lexicon-400 px-3 py-1.5 rounded-lg bg-lexicon-50 dark:bg-lexicon-950"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.learn.flipCard}</span>
              </button>
            </div>

            {!isFlipped ? (
              <div className="py-8 text-center space-y-4">
                <h2
                  dir={getLanguageMetadata(currentCard.language).direction}
                  className="font-serif font-bold text-4xl sm:text-5xl text-ink-950 dark:text-white"
                >
                  {currentCard.headword}
                </h2>
                <div className="flex justify-center">
                  <PronunciationControl
                    text={currentCard.headword}
                    locale={currentCard.audioLocale}
                    ipa={currentCard.ipa}
                    romanization={currentCard.romanization}
                    compact
                  />
                </div>
                <p className="text-xs text-ink-400 pt-2">
                  Click card or &ldquo;{t.learn.flipCard}&rdquo; to reveal
                  sense definitions & morphology
                </p>
              </div>
            ) : (
              <div
                data-testid="flashcard-back-content"
                className="py-6 space-y-4 border-t border-b border-ink-100 dark:border-ink-800 my-4"
              >
                <p className="text-lg sm:text-xl font-medium text-ink-900 dark:text-white">
                  {currentCard.senses[0]?.localizedDefinitions[uiLocale] ||
                    currentCard.senses[0]?.definition}
                </p>

                {currentCard.malayMorphology && (
                  <div className="rounded-xl bg-lexicon-50/80 dark:bg-lexicon-950/60 p-3.5 text-xs sm:text-sm text-ink-800 dark:text-ink-200 space-y-1">
                    <p>
                      <strong>Kata Dasar:</strong>{" "}
                      {currentCard.malayMorphology.kataDasar}{" "}
                      {currentCard.malayMorphology.affixPattern
                        ? `· Imbuhan: ${currentCard.malayMorphology.affixPattern}`
                        : ""}
                    </p>
                    <p className="text-xs text-ink-600 dark:text-ink-400">
                      {currentCard.malayMorphology.explanationMs}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {currentCard.senses[0]?.translations
                    .slice(0, 5)
                    .map((tr) => (
                      <span
                        key={tr.language}
                        className="text-xs px-2.5 py-1 rounded-md bg-ink-100 dark:bg-ink-800 text-ink-800 dark:text-ink-200"
                      >
                        <strong>{tr.language}:</strong> {tr.terms.join(", ")}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Card Footer Actions */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex flex-wrap items-center justify-between gap-3 pt-2"
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="mark-known-btn"
                  onClick={() => setWordMastery(currentCard.id, "mastered")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.learn.markKnown}</span>
                </button>
                <button
                  type="button"
                  data-testid="mark-learning-btn"
                  onClick={() => setWordMastery(currentCard.id, "learning")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800"
                >
                  <span>{t.learn.markLearning}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="prev-flashcard-btn"
                  onClick={() => {
                    setIsFlipped(false);
                    setCardIndex((prev) =>
                      prev > 0 ? prev - 1 : activeDeck.length - 1
                    );
                  }}
                  aria-label={t.learn.prevCard}
                  className="p-2 rounded-xl border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-950 text-ink-700 dark:text-ink-200 hover:bg-ink-100"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  data-testid="next-flashcard-btn"
                  onClick={() => {
                    setIsFlipped(false);
                    setCardIndex((prev) =>
                      prev < activeDeck.length - 1 ? prev + 1 : 0
                    );
                  }}
                  aria-label={t.learn.nextCard}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-950 text-xs font-semibold text-ink-800 dark:text-ink-100 hover:bg-ink-100"
                >
                  <span>{t.learn.nextCard}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VOCABULARY QUIZ */}
      {activeTab === "quiz" && (
        <div
          data-testid="quiz-panel"
          className="rounded-3xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 p-6 sm:p-8 space-y-6 shadow-sm"
        >
          {quizCompleted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-lexicon-50 dark:bg-lexicon-950 text-lexicon-700 dark:text-lexicon-300 flex items-center justify-center mx-auto">
                <Trophy className="w-7 h-7" />
              </div>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-ink-900 dark:text-white">
                Quiz Complete!
              </h2>
              <p className="text-base text-ink-600 dark:text-ink-300">
                {t.learn.quizScore}:{" "}
                <strong className="text-lexicon-700 dark:text-lexicon-400">
                  {quizScore} / {quizQuestions.length}
                </strong>
              </p>
              <button
                type="button"
                onClick={handleResetQuiz}
                className="px-5 py-2.5 rounded-xl bg-lexicon-700 hover:bg-lexicon-800 text-white text-sm font-semibold"
              >
                {t.learn.startQuiz}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-mono text-ink-500">
                <span>
                  Question {quizIndex + 1} of {quizQuestions.length}
                </span>
                <span>
                  {t.learn.quizScore}: {quizScore}
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-lexicon-700 dark:text-lexicon-400">
                  Select the verified definition for:
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-serif font-bold text-3xl text-ink-900 dark:text-white">
                    {currentQuestion.prompt}
                  </h2>
                  <span className="text-xs px-2 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300">
                    {currentQuestion.entry.language}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  const isCorrect = opt === currentQuestion.correctAnswer;

                  let styleClass =
                    "border-ink-200 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-950/60 text-ink-800 dark:text-ink-200 hover:border-lexicon-500";
                  if (submittedAnswer) {
                    if (isCorrect) {
                      styleClass =
                        "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200";
                    } else if (isSelected) {
                      styleClass =
                        "border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200";
                    }
                  } else if (isSelected) {
                    styleClass =
                      "border-lexicon-600 bg-lexicon-50 dark:bg-lexicon-950 text-lexicon-900 dark:text-lexicon-100";
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={submittedAnswer}
                      data-testid={`quiz-option-${idx}`}
                      onClick={() => setSelectedOption(opt)}
                      className={`w-full text-left p-4 rounded-2xl border-2 text-sm sm:text-base font-medium transition-all flex items-center justify-between gap-3 ${styleClass}`}
                    >
                      <span>{opt}</span>
                      {submittedAnswer && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {submittedAnswer && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                {!submittedAnswer ? (
                  <button
                    type="button"
                    data-testid="submit-quiz-answer-btn"
                    disabled={!selectedOption}
                    onClick={handleSubmitQuizOption}
                    className="px-5 py-2.5 rounded-xl bg-lexicon-700 hover:bg-lexicon-800 disabled:opacity-40 text-white text-sm font-semibold transition-colors"
                  >
                    {t.learn.submitAnswer}
                  </button>
                ) : (
                  <button
                    type="button"
                    data-testid="next-quiz-question-btn"
                    onClick={handleNextQuestion}
                    className="px-5 py-2.5 rounded-xl bg-lexicon-700 hover:bg-lexicon-800 text-white text-sm font-semibold transition-colors"
                  >
                    {t.learn.nextQuestion} →
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CURATED COLLECTIONS */}
      {activeTab === "collections" && (
        <div
          data-testid="collections-panel"
          className="grid grid-cols-1 gap-6"
        >
          {CURATED_LEARNING_COLLECTIONS.map((col) => {
            const colEntries = STARTER_LEXICON_ENTRIES.filter((e) =>
              col.entryIds.includes(e.id)
            );
            return (
              <section
                key={col.id}
                className="rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 p-6 space-y-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-0.5 rounded-full bg-lexicon-50 dark:bg-lexicon-950 text-lexicon-800 dark:text-lexicon-300">
                      <Sparkles className="w-3 h-3" />
                      {col.badge[uiLocale]}
                    </span>
                    <h2 className="font-serif font-bold text-xl sm:text-2xl text-ink-900 dark:text-white mt-2">
                      {col.title[uiLocale]}
                    </h2>
                    <p className="text-sm text-ink-600 dark:text-ink-400 mt-1">
                      {col.description[uiLocale]}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCollectionId(col.id);
                      setCardIndex(0);
                      setIsFlipped(false);
                      setActiveTab("flashcards");
                    }}
                    className="px-4 py-2 rounded-xl bg-lexicon-700 hover:bg-lexicon-800 text-white text-xs sm:text-sm font-semibold"
                  >
                    Study Flashcards →
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {colEntries.map((entry) => (
                    <Link
                      key={entry.id}
                      href={`/word/${entry.language}/${encodeURIComponent(entry.headword)}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 hover:border-lexicon-500 text-xs sm:text-sm font-medium text-ink-800 dark:text-ink-200"
                    >
                      <span>{entry.headword}</span>
                      <span className="text-[10px] font-mono text-ink-400 uppercase">
                        ({entry.language})
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
