"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Languages, LoaderCircle } from "lucide-react";
import { DefinitionTranslationError, translateDefinition, type TranslationErrorCode } from "@/lib/definition-translation";
import { findReviewedTranslation, reviewKey, type ReviewSubject } from "@/lib/reviewed-definitions";
import { DEFINITION_LANGUAGES, defaultDefinitionLanguage, definitionLanguageLabel, isDefinitionLanguage, type DefinitionLanguage } from "@/lib/translation-languages";
import type { UiLocale } from "@/types/lexicon";

const STORAGE_KEY = "vynalth-definition-language";
const MAX_BATCH_SENSES = 8, MAX_BATCH_CHARACTERS = 2000;
type Mode = "reviewed" | "automatic";
type TranslationRecord = { status: "pending" } | { status: "ready"; text: string } | { status: "error"; code: TranslationErrorCode };
type Progress = { completed: number; total: number };
const TEXT = {
  "zh-Hans": {
    title: "释义语言", mode: "译文模式", reviewed: "人工核对", automatic: "自动翻译（未核对）", translate: "翻译释义", more: "翻译更多", retry: "重试翻译", done: "已翻译", none: "无需自动翻译", original: "显示英文原文", stop: "停止", loading: "正在翻译",
    reviewedNote: (done: number, total: number) => `可见释义中 ${done}/${total} 条有人工审核记录；其余保留英文原文。原文和人工审核结果都可能有误。`,
    autoNote: "点击翻译后，英文释义及 IP 会发送给 MyMemory，可能被保存并与其服务合作方共享。结果未经核对，可能有误；每批最多 8 条，免费服务有用量限制。",
    reviewedLabel: "有人工审核记录", autoLabel: "自动翻译 · 未经核对 · MyMemory", evidence: "审核记录", translationSource: "译文来源", sourceDefinition: "原文来源", licensed: "许可与署名",
    sourceWords: "词典原有词汇对照（未经逐条核对）", sourceDefinitions: "词典原有译文（未经逐条核对）", sourceExamples: "词典例句译文（未经逐条核对）", sourceNotes: "词典原有解释译文（未经逐条核对）", sourceNote: "这些是来源数据，不代表已逐条人工核对，可能有误。",

    network: "无法连接翻译服务，请稍后重试。", quota: "翻译额度已用完或请求过多，请稍后重试。", unsupported: "翻译服务暂不支持此语言。", no_result: "没有找到可用翻译，保留英文原文。", too_long: "释义过长，未发送；请查看英文原文。",
  },
  en: {
    title: "Definition language", mode: "Translation mode", reviewed: "Human-reviewed", automatic: "Automatic (unreviewed)", translate: "Translate definitions", more: "Translate more", retry: "Retry translations", done: "Translated", none: "No automatic translation needed", original: "Showing English original", stop: "Stop", loading: "Translating",
    reviewedNote: (done: number, total: number) => `${done}/${total} visible definitions have a human-review record; the others remain in English. Both source text and reviewed translations may contain errors.`,
    autoNote: "When you translate, English definitions and your IP are sent to MyMemory, which may retain them and share them with service partners. Results are unreviewed and may be inaccurate; up to 8 senses per batch. Free usage is limited.",
    reviewedLabel: "Human-review record", autoLabel: "Automatic translation · unreviewed · MyMemory", evidence: "Review record", translationSource: "Translation source", sourceDefinition: "Original source", licensed: "Licence & attribution",
    sourceWords: "Dictionary word equivalents (not individually reviewed)", sourceDefinitions: "Dictionary translations (not individually reviewed)", sourceExamples: "Dictionary example translations (not individually reviewed)", sourceNotes: "Dictionary explanation translations (not individually reviewed)", sourceNote: "These are source data, not individually verified translations, and may contain errors.",
    network: "Cannot reach the translation service. Please try again.", quota: "The translation quota or request limit has been reached. Try again later.", unsupported: "The translation service does not support this language right now.", no_result: "No translation was returned; the English original remains.", too_long: "This definition is too long to send; please read the English original.",
  },
  ms: {
    title: "Bahasa definisi", mode: "Mod terjemahan", reviewed: "Disemak manusia", automatic: "Automatik (belum disemak)", translate: "Terjemah definisi", more: "Terjemah lagi", retry: "Cuba semula", done: "Sudah diterjemah", none: "Tiada terjemahan automatik diperlukan", original: "Teks asal bahasa Inggeris", stop: "Henti", loading: "Menterjemah",
    reviewedNote: (done: number, total: number) => `${done}/${total} definisi yang kelihatan mempunyai rekod semakan manusia; yang lain kekal dalam bahasa Inggeris. Teks asal dan terjemahan yang disemak juga mungkin mengandungi kesilapan.`,
    autoNote: "Terjemahan menghantar definisi Inggeris dan IP anda ke MyMemory, yang mungkin menyimpan dan berkongsinya dengan rakan perkhidmatan. Hasil belum disemak dan mungkin kurang tepat; maksimum 8 makna setiap kali. Penggunaan percuma terhad.",
    reviewedLabel: "Mempunyai rekod semakan manusia", autoLabel: "Terjemahan automatik · belum disemak · MyMemory", evidence: "Rekod semakan", translationSource: "Sumber terjemahan", sourceDefinition: "Sumber asal", licensed: "Lesen & atribusi",
    sourceWords: "Padanan kata kamus (tidak disemak satu per satu)", sourceDefinitions: "Terjemahan kamus (tidak disemak satu per satu)", sourceExamples: "Terjemahan contoh kamus (tidak disemak satu per satu)", sourceNotes: "Terjemahan penjelasan kamus (tidak disemak satu per satu)", sourceNote: "Ini ialah data sumber, bukan terjemahan yang disemak satu per satu, dan mungkin mengandungi ralat.",
    network: "Perkhidmatan terjemahan tidak dapat dihubungi. Sila cuba lagi.", quota: "Had terjemahan atau permintaan telah dicapai. Cuba lagi kemudian.", unsupported: "Bahasa ini belum disokong oleh perkhidmatan terjemahan.", no_result: "Tiada terjemahan ditemui; teks asal dikekalkan.", too_long: "Definisi terlalu panjang untuk dihantar; sila baca teks asal.",
  },
} as const;

function keyFor(target: DefinitionLanguage, text: string) { return `${target}\0${text.trim()}`; }
export function useDefinitionTranslation(scope: string, locale: UiLocale) {
  const [target, setTargetState] = useState<DefinitionLanguage>("zh-CN");
  const [modeState, setModeState] = useState<{ scope: string; mode: Mode }>({ scope, mode: "reviewed" });
  // A new lookup immediately shows reviewed mode, even before effect cleanup.
  const mode = modeState.scope === scope ? modeState.mode : "reviewed";
  const [records, setRecords] = useState<Record<string, TranslationRecord>>({});
  const [progress, setProgress] = useState<Progress | null>(null);
  const preferred = useRef(false), active = useRef<AbortController | null>(null), cache = useRef(new Map<string, string>());

  useEffect(() => {
    try { const stored = localStorage.getItem(STORAGE_KEY); if (stored && isDefinitionLanguage(stored)) { preferred.current = true; setTargetState(stored); } } catch { /* private mode */ }
  }, []);
  useEffect(() => { if (!preferred.current) setTargetState(defaultDefinitionLanguage(locale)); }, [locale]);
  useEffect(() => {
    active.current?.abort(); active.current = null; setRecords({}); setProgress(null); setModeState({ scope, mode: "reviewed" });
    return () => { active.current?.abort(); active.current = null; };
  }, [scope]);
  useEffect(() => {
    active.current?.abort(); active.current = null; setRecords({}); setProgress(null);
    return () => { active.current?.abort(); active.current = null; };
  }, [target]);

  const setMode = useCallback((value: Mode) => {
    if (value === "reviewed") {
      active.current?.abort(); active.current = null; setProgress(null);
      setRecords((previous) => Object.fromEntries(Object.entries(previous).filter(([, record]) => record.status !== "pending")));
    }
    setModeState({ scope, mode: value });
  }, [scope]);
  const setTarget = useCallback((value: string) => {
    if (!isDefinitionLanguage(value)) return;
    preferred.current = true;
    try { localStorage.setItem(STORAGE_KEY, value); } catch { /* private mode */ }
    active.current?.abort(); active.current = null; setProgress(null); setTargetState(value);
  }, []);
  const get = useCallback((text: string): TranslationRecord | undefined => {
    const key = keyFor(target, text), cached = cache.current.get(key);
    return records[key] ?? (cached !== undefined ? { status: "ready", text: cached } : undefined);
  }, [records, target]);
  const stop = useCallback(() => {
    active.current?.abort(); active.current = null; setProgress(null);
    setRecords((previous) => Object.fromEntries(Object.entries(previous).filter(([, value]) => value.status !== "pending")));
  }, []);
  const start = useCallback(async (texts: readonly string[]) => {
    if (mode !== "automatic" || target === "en" || active.current) return;
    const unique = [...new Set(texts.map((text) => text.trim()).filter(Boolean))];
    const untouched = unique.filter((text) => !get(text)), retry = unique.filter((text) => get(text)?.status === "error");
    const blocked = retry.filter((text) => { const record = get(text); return record?.status === "error" && (record.code === "quota" || record.code === "network"); });
    const candidates = blocked.length ? blocked : untouched.length ? untouched : retry, batch: string[] = [];
    let characters = 0;
    for (const text of candidates) {
      if (batch.length >= MAX_BATCH_SENSES || (batch.length > 0 && characters + text.length > MAX_BATCH_CHARACTERS)) break;
      batch.push(text); characters += text.length;
    }
    if (!batch.length) return;
    const controller = new AbortController(); active.current = controller;
    setRecords((previous) => { const next = { ...previous }; for (const text of batch) next[keyFor(target, text)] = { status: "pending" }; return next; });
    setProgress({ completed: 0, total: batch.length });
    for (let i = 0; i < batch.length; i++) {
      if (controller.signal.aborted || active.current !== controller) break;
      const text = batch[i], key = keyFor(target, text);
      try {
        const translation = await translateDefinition(text, target, controller.signal);
        if (controller.signal.aborted || active.current !== controller) break;
        cache.current.set(key, translation);
        if (cache.current.size > 200) cache.current.delete(cache.current.keys().next().value as string);
        setRecords((previous) => ({ ...previous, [key]: { status: "ready", text: translation } }));
      } catch (error) {
        if (controller.signal.aborted || active.current !== controller) break;
        const code = error instanceof DefinitionTranslationError ? error.code : "network";
        const remaining = code === "network" || code === "quota" ? batch.slice(i) : [text];
        setRecords((previous) => { const next = { ...previous }; for (const value of remaining) next[keyFor(target, value)] = { status: "error", code }; return next; });
        if (code === "network" || code === "quota") { setProgress({ completed: batch.length, total: batch.length }); break; }
      }
      setProgress({ completed: i + 1, total: batch.length });
    }
    if (active.current === controller) { active.current = null; setProgress(null); }
  }, [get, mode, target]);
  return { target, setTarget, mode, setMode, get, start, stop, progress };
}
export type DefinitionTranslationController = ReturnType<typeof useDefinitionTranslation>;

export function DefinitionTranslationControls({ controller, locale, subjects }: { controller: DefinitionTranslationController; locale: UiLocale; subjects: readonly ReviewSubject[] }) {
  const copy = TEXT[locale];
  const options = useMemo(() => {
    const priority = new Set(["en", "zh-CN", "zh-TW", "ms-MY", "id-ID", "ar-SA", "ja-JP", "ko-KR"]);
    const rest = DEFINITION_LANGUAGES.filter(([code]) => !priority.has(code)).map(([code]) => [code, definitionLanguageLabel(code, locale)] as const).sort((a, b) => a[1].localeCompare(b[1], locale));
    return [...DEFINITION_LANGUAGES.filter(([code]) => priority.has(code)).map(([code]) => [code, definitionLanguageLabel(code, locale)] as const), ...rest];
  }, [locale]);
  const distinct = [...new Map(subjects.map((subject) => [reviewKey(subject, controller.target), subject])).values()];
  const reviewed = distinct.filter((subject) => findReviewedTranslation(subject, controller.target));
  const texts = [...new Set(distinct.filter((subject) => !findReviewedTranslation(subject, controller.target)).map((subject) => subject.definition.trim()).filter(Boolean))];
  const untouched = texts.filter((text) => !controller.get(text)).length, errors = texts.filter((text) => controller.get(text)?.status === "error").length, complete = texts.filter((text) => controller.get(text)?.status === "ready").length;
  const blocked = texts.some((text) => { const record = controller.get(text); return record?.status === "error" && (record.code === "quota" || record.code === "network"); });
  const label = controller.target === "en" ? copy.original : !texts.length ? copy.none : blocked ? copy.retry : untouched ? (complete ? copy.more : copy.translate) : errors ? copy.retry : copy.done;
  return <div data-testid="definition-translation-controls" className="mb-8 rounded-2xl border border-[#dbe8dc] bg-[#f5f9f4] px-4 py-4 dark:border-ink-700 dark:bg-ink-900 sm:px-5">
    <div className="flex flex-wrap items-end gap-3">
      <div className="min-w-[180px] flex-1"><label htmlFor="definition-language" className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#476b59] dark:text-lexicon-400"><Languages className="h-4 w-4" />{copy.title}</label><select id="definition-language" data-testid="definition-language-select" value={controller.target} onChange={(event) => controller.setTarget(event.target.value)} className="w-full rounded-lg border border-[#d6e4d8] bg-white px-3 py-2.5 text-sm text-[#345446] focus:outline-none focus:ring-2 focus:ring-lexicon-500 dark:border-ink-700 dark:bg-ink-950 dark:text-ink-200">{options.map(([code, label]) => <option value={code} key={code}>{label}</option>)}</select></div>
      {controller.mode === "automatic" && (controller.progress ? <button type="button" onClick={controller.stop} data-testid="stop-definition-translation" className="rounded-lg border border-[#9ebcac] px-4 py-2.5 text-sm font-semibold text-[#3e715a] hover:bg-white dark:text-lexicon-300">{copy.stop}</button> : <button type="button" data-testid="translate-definitions-button" onClick={() => void controller.start(texts)} disabled={controller.target === "en" || (!untouched && !errors)} className="rounded-lg bg-[#245e4e] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#194c3e] disabled:cursor-not-allowed disabled:bg-[#b9c9be] dark:disabled:bg-ink-700">{label}</button>)}
    </div>
    <div role="group" aria-label={copy.mode} className="mt-4 flex flex-wrap gap-2">
      {(["reviewed", "automatic"] as const).map((mode) => <button type="button" key={mode} data-testid={`${mode}-mode-button`} aria-pressed={controller.mode === mode} onClick={() => controller.setMode(mode)} className={`rounded-lg border px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-lexicon-500 ${controller.mode === mode ? "border-[#245e4e] bg-[#245e4e] text-white" : "border-[#c7d9ca] bg-white text-[#496b59] hover:border-[#7fa68c] dark:border-ink-700 dark:bg-ink-950 dark:text-ink-200"}`}>{copy[mode]}</button>)}
    </div>
    <p data-testid="reviewed-coverage" className="mt-3 text-xs leading-5 text-[#617b69] dark:text-ink-400">{controller.target === "en" ? copy.original : copy.reviewedNote(reviewed.length, distinct.length)}</p>
    {controller.mode === "automatic" && <p className="mt-2 text-xs leading-5 text-[#71897b] dark:text-ink-400">{copy.autoNote}</p>}
    {controller.progress && controller.mode === "automatic" && <p role="status" data-testid="definition-translation-progress" className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#4a7962] dark:text-lexicon-400"><LoaderCircle className="h-3.5 w-3.5 animate-spin" />{copy.loading} {controller.progress.completed}/{controller.progress.total}</p>}
  </div>;
}

export function TranslatedDefinition({ controller, locale, subject }: { controller: DefinitionTranslationController; locale: UiLocale; subject: ReviewSubject }) {
  if (controller.target === "en") return null;
  const copy = TEXT[locale], reviewed = findReviewedTranslation(subject, controller.target);
  if (reviewed) return <div data-testid="reviewed-definition" className="mt-2 rounded-lg border-l-2 border-[#518c69] bg-[#eef7ee] px-3 py-2 dark:border-lexicon-600 dark:bg-ink-800">
    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#557d62] dark:text-lexicon-400">{copy.reviewedLabel} · {reviewed.review.reviewer} · {reviewed.review.reviewedAt}</p>
    <p lang={controller.target} dir="auto" className="mt-1 text-sm leading-6 text-[#315843] dark:text-ink-100">{reviewed.translation}</p>
    <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#577b64] dark:text-ink-300"><a href={reviewed.subject.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">{copy.sourceDefinition}</a><a href={reviewed.source.url} target="_blank" rel="noopener noreferrer" className="underline">{copy.translationSource}: {reviewed.source.name}</a><a href={reviewed.review.evidenceUrl} target="_blank" rel="noopener noreferrer" className="underline">{copy.evidence}</a><a href={reviewed.source.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline">{copy.licensed}: {reviewed.source.license}</a></p>
    <p className="mt-1 text-xs text-[#71897b] dark:text-ink-400">{reviewed.source.attribution}</p>
  </div>;
  if (controller.mode !== "automatic") return null;
  const record = controller.get(subject.definition);
  if (!record) return null;
  if (record.status === "pending") return <p className="mt-1 text-xs text-[#8ca094]">{copy.loading}…</p>;
  if (record.status === "error") return <p data-testid="definition-translation-error" className="mt-1 text-xs leading-5 text-amber-700 dark:text-amber-400">{copy[record.code]}</p>;
  return <div data-testid="translated-definition" className="mt-2 rounded-lg border-l-2 border-[#8eb5a0] bg-[#f2f7f1] px-3 py-2 dark:border-lexicon-600 dark:bg-ink-800"><p className="text-[10px] font-semibold uppercase tracking-wide text-[#6e927e] dark:text-lexicon-400">{copy.autoLabel}</p><p lang={controller.target} dir="auto" className="mt-1 text-sm leading-6 text-[#315843] dark:text-ink-100">{record.text}</p></div>;
}

/** Existing source translations lack item-level review evidence; open only on request. */
export function UnreviewedSourceDetails({ locale, kind, children, testId }: { locale: UiLocale; kind: "words" | "definitions" | "examples" | "notes"; children: ReactNode; testId?: string }) {
  const copy = TEXT[locale], title = kind === "words" ? copy.sourceWords : kind === "definitions" ? copy.sourceDefinitions : kind === "examples" ? copy.sourceExamples : copy.sourceNotes;
  return <details data-testid={testId} className="mt-3 text-sm"><summary className="w-fit cursor-pointer text-xs font-semibold text-[#668679] hover:underline dark:text-lexicon-400">{title}</summary><p className="mt-2 text-xs leading-5 text-[#88998e] dark:text-ink-400">{copy.sourceNote}</p><div className="mt-2">{children}</div></details>;
}
