"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Volume2, VolumeX, Square } from "lucide-react";
import { useLexicon } from "@/context/LexiconContext";

interface PronunciationControlProps {
  text: string;
  locale: string;
  ipa?: string;
  romanization?: string;
  compact?: boolean;
}

export function PronunciationControl({
  text,
  locale,
  ipa,
  romanization,
  compact = false,
}: PronunciationControlProps) {
  const { t } = useLexicon();
  const [supported, setSupported] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [statusNote, setStatusNote] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
    }
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        setSupported(false);
        setStatusNote(t.wordDetail.ttsUnavailable);
        return;
      }

      try {
        if (isPlaying) {
          window.speechSynthesis.cancel();
          setIsPlaying(false);
          return;
        }

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = locale;
        utterance.rate = 0.92;

        const voices = window.speechSynthesis.getVoices();
        const langPrefix = locale.split("-")[0].toLowerCase();
        const matchingVoice =
          voices.find(
            (v) => v.lang.toLowerCase() === locale.toLowerCase()
          ) ||
          voices.find((v) =>
            v.lang.toLowerCase().startsWith(langPrefix)
          );

        if (matchingVoice) {
          utterance.voice = matchingVoice;
        } else if (voices.length > 0) {
          // Never silently use a voice for an unrelated language.
          setIsPlaying(false);
          setStatusNote(t.wordDetail.ttsUnavailable);
          return;
        }

        utterance.onstart = () => {
          setIsPlaying(true);
          setStatusNote(t.wordDetail.ttsDisclaimer);
        };
        utterance.onend = () => {
          setIsPlaying(false);
        };
        utterance.onerror = () => {
          setIsPlaying(false);
          setStatusNote(t.wordDetail.ttsUnavailable);
        };

        setIsPlaying(true);
        setStatusNote(t.wordDetail.ttsDisclaimer);
        window.speechSynthesis.speak(utterance);

        // Safety timeout in case headless browser does not fire onend
        setTimeout(() => {
          setIsPlaying(false);
        }, 2500);
      } catch {
        setIsPlaying(false);
        setStatusNote(t.wordDetail.ttsUnavailable);
      }
    },
    [isPlaying, locale, t.wordDetail.ttsDisclaimer, t.wordDetail.ttsUnavailable, text]
  );

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 flex-wrap">
        {romanization && (
          <span className="text-xs font-medium text-ink-600 dark:text-ink-300 italic">
            {romanization}
          </span>
        )}
        {ipa && (
          <span
            className="font-mono text-xs px-2 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-200 border border-ink-200 dark:border-ink-700"
            aria-label={`IPA pronunciation ${ipa}`}
          >
            {ipa}
          </span>
        )}
        <button
          type="button"
          onClick={handleSpeak}
          data-testid="pronunciation-button"
          aria-label={`${t.wordDetail.listenBrowserTts}: ${text}`}
          title={t.wordDetail.ttsDisclaimer}
          className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md bg-lexicon-50 dark:bg-lexicon-950/70 text-lexicon-800 dark:text-lexicon-200 border border-lexicon-200 dark:border-lexicon-800 hover:bg-lexicon-100 dark:hover:bg-lexicon-900 transition-colors focus:outline-none focus:ring-2 focus:ring-lexicon-500"
        >
          {isPlaying ? (
            <Square className="w-3.5 h-3.5 fill-current" />
          ) : supported ? (
            <Volume2 className="w-3.5 h-3.5" />
          ) : (
            <VolumeX className="w-3.5 h-3.5" />
          )}
          <span>{t.wordDetail.listenBrowserTts}</span>
        </button>
        {statusNote && <span role="status" className="text-xs text-ink-500 dark:text-ink-400">{statusNote}</span>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
        {romanization && (
          <span className="text-base font-medium text-ink-700 dark:text-ink-200 italic">
            {romanization}
          </span>
        )}
        {ipa && (
          <span
            data-testid="word-ipa"
            className="font-mono text-sm px-2.5 py-1 rounded-md bg-ink-100 dark:bg-ink-800 text-ink-800 dark:text-ink-100 border border-ink-200 dark:border-ink-700"
          >
            {ipa}
          </span>
        )}
        <button
          type="button"
          onClick={handleSpeak}
          data-testid="pronunciation-button"
          aria-label={
            isPlaying
              ? t.wordDetail.stopAudio
              : `${t.wordDetail.listenBrowserTts}: ${text}`
          }
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg bg-lexicon-600 hover:bg-lexicon-700 text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-lexicon-500 focus:ring-offset-1"
        >
          {isPlaying ? (
            <>
              <Square className="w-4 h-4 fill-current" />
              <span>{t.wordDetail.stopAudio}</span>
            </>
          ) : supported ? (
            <>
              <Volume2 className="w-4 h-4" />
              <span>
                {t.wordDetail.listenBrowserTts} ({locale})
              </span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4" />
              <span>{t.wordDetail.ttsUnavailable}</span>
            </>
          )}
        </button>
      </div>
      <p
        data-testid="tts-disclaimer"
        className="text-xs text-ink-500 dark:text-ink-400"
      >
        {statusNote ?? t.wordDetail.ttsDisclaimer}
      </p>
    </div>
  );
}
