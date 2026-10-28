"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Languages, LoaderCircle } from "lucide-react";
import { DefinitionTranslationError, translateDefinition, type TranslationErrorCode } from "@/lib/definition-translation";
import { DEFINITION_LANGUAGES, defaultDefinitionLanguage, definitionLanguageLabel, isDefinitionLanguage, type DefinitionLanguage } from "@/lib/translation-languages";
import type { LanguageCode, UiLocale, WordSense } from "@/types/lexicon";

const STORAGE_KEY = "vynalth-definition-language";
const MAX_BATCH_SENSES = 8, MAX_BATCH_CHARACTERS = 2000;
type TranslationRecord = { status: "pending" } | { status: "ready"; text: string } | { status: "error"; code: TranslationErrorCode };
type Progress = { completed: number; total: number };
const TEXT = {
  "zh-Hans": { title: "释义语言", translate: "翻译释义", more: "翻译更多", retry: "重试翻译", done: "已翻译", none: "无需翻译", original: "显示原文", stop: "停止", loading: "正在翻译", note: "点击翻译后，英文释义及 IP 会发送给 MyMemory，可能被保存并与其服务合作方共享。自动翻译可能有误，每次最多翻译 8 条；免费服务有用量限制。", label: "自动翻译 · MyMemory", provided: "词典原有释义", originalLabel: "英文原文", network: "无法连接翻译服务，请稍后重试。", quota: "翻译额度已用完或请求过多，请稍后重试。", unsupported: "翻译服务暂不支持此语言。", no_result: "没有找到可靠翻译，保留英文原文。", too_long: "释义过长，未发送；请查看英文原文。" },
  en: { title: "Definition language", translate: "Translate definitions", more: "Translate more", retry: "Retry translations", done: "Translated", none: "No translation needed", original: "Showing original", stop: "Stop", loading: "Translating", note: "Translation sends English definitions and your IP to MyMemory, which may retain them and share them with service partners. Results may be inaccurate; up to 8 senses per batch. Free usage is limited.", label: "Automatic translation · MyMemory", provided: "Provided dictionary definition", originalLabel: "English original", network: "Cannot reach the translation service. Please try again.", quota: "The translation quota or request limit has been reached. Try again later.", unsupported: "The translation service does not support this language right now.", no_result: "No reliable translation was returned; the English original remains.", too_long: "This definition is too long to send; please read the English original." },
  ms: { title: "Bahasa definisi", translate: "Terjemah definisi", more: "Terjemah lagi", retry: "Cuba semula", done: "Sudah diterjemah", none: "Tiada terjemahan diperlukan", original: "Teks asal", stop: "Henti", loading: "Menterjemah", note: "Terjemahan menghantar definisi Inggeris dan IP anda ke MyMemory, yang mungkin menyimpan dan berkongsinya dengan rakan perkhidmatan. Hasil mungkin kurang tepat; maksimum 8 makna setiap kali. Penggunaan percuma terhad.", label: "Terjemahan automatik · MyMemory", provided: "Definisi asal kamus", originalLabel: "Teks asal bahasa Inggeris", network: "Perkhidmatan terjemahan tidak dapat dihubungi. Sila cuba lagi.", quota: "Had terjemahan atau permintaan telah dicapai. Cuba lagi kemudian.", unsupported: "Bahasa ini belum disokong oleh perkhidmatan terjemahan.", no_result: "Tiada terjemahan yang boleh dipercayai; teks asal dikekalkan.", too_long: "Definisi terlalu panjang untuk dihantar; sila baca teks asal." },
} as const;

/** Existing localized definitions are source data, not machine output. */
const SOURCE_LANGUAGES: Partial<Record<DefinitionLanguage, LanguageCode>> = {
  "zh-CN": "zh-Hans", "zh-TW": "zh-Hant", "ms-MY": "ms", "id-ID": "id", "ja-JP": "ja", "ko-KR": "ko", "th-TH": "th", "ar-SA": "ar", "es-ES": "es", "fr-FR": "fr", "de-DE": "de",
};
export function providedDefinition(sense: WordSense | undefined, target: DefinitionLanguage): string | undefined {
  const language = SOURCE_LANGUAGES[target];
  return language && sense?.localizedDefinitions[language] || undefined;
}
function keyFor(target: DefinitionLanguage, text: string) { return `${target}\0${text.trim()}`; }
export function useDefinitionTranslation(scope: string, locale: UiLocale) {
  const [target, setTargetState] = useState<DefinitionLanguage>("zh-CN");
  const [records, setRecords] = useState<Record<string, TranslationRecord>>({});
  const [progress, setProgress] = useState<Progress | null>(null);
  const preferred = useRef(false);
  const active = useRef<AbortController | null>(null);
  const cache = useRef(new Map<string, string>());

  useEffect(() => {
    try { const stored = localStorage.getItem(STORAGE_KEY); if (stored && isDefinitionLanguage(stored)) { preferred.current = true; setTargetState(stored); } } catch { /* private mode */ }
  }, []);
  useEffect(() => { if (!preferred.current) setTargetState(defaultDefinitionLanguage(locale)); }, [locale]);
  useEffect(() => {
    active.current?.abort(); active.current = null; setRecords({}); setProgress(null);
    return () => { active.current?.abort(); active.current = null; };
  }, [scope, target]);

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
    if (target === "en" || active.current) return;
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
        // A network/quota failure applies to the remaining batch; avoid extra requests.
        const remaining = code === "network" || code === "quota" ? batch.slice(i) : [text];
        setRecords((previous) => { const next = { ...previous }; for (const value of remaining) next[keyFor(target, value)] = { status: "error", code }; return next; });
        if (remaining.length > 1 || code === "network" || code === "quota") { setProgress({ completed: batch.length, total: batch.length }); break; }
      }
      setProgress({ completed: i + 1, total: batch.length });
    }
    if (active.current === controller) { active.current = null; setProgress(null); }
  }, [get, target]);
  return { target, setTarget, get, start, stop, progress };
}
export type DefinitionTranslationController = ReturnType<typeof useDefinitionTranslation>;

export function DefinitionTranslationControls({ controller, locale, texts }: { controller: DefinitionTranslationController; locale: UiLocale; texts: readonly string[] }) {
  const copy = TEXT[locale];
  const options = useMemo(() => {
    const priority = new Set(["en", "zh-CN", "zh-TW", "ms-MY", "id-ID", "ar-SA", "ja-JP", "ko-KR"]);
    const rest = DEFINITION_LANGUAGES.filter(([code]) => !priority.has(code)).map(([code]) => [code, definitionLanguageLabel(code, locale)] as const).sort((a, b) => a[1].localeCompare(b[1], locale));
    return [...DEFINITION_LANGUAGES.filter(([code]) => priority.has(code)).map(([code]) => [code, definitionLanguageLabel(code, locale)] as const), ...rest];
  }, [locale]);
  const unique = [...new Set(texts.map((text) => text.trim()).filter(Boolean))], untouched = unique.filter((text) => !controller.get(text)).length, errors = unique.filter((text) => controller.get(text)?.status === "error").length, complete = unique.filter((text) => controller.get(text)?.status === "ready").length;
  const blocked = unique.some((text) => { const record = controller.get(text); return record?.status === "error" && (record.code === "quota" || record.code === "network"); });
  const label = controller.target === "en" ? copy.original : !unique.length ? copy.none : blocked ? copy.retry : untouched ? (complete ? copy.more : copy.translate) : errors ? copy.retry : copy.done;
  return <div data-testid="definition-translation-controls" className="mb-8 rounded-2xl border border-[#dbe8dc] bg-[#f5f9f4] px-4 py-4 dark:border-ink-700 dark:bg-ink-900 sm:px-5">
    <div className="flex flex-wrap items-end gap-3"><div className="min-w-[180px] flex-1"><label htmlFor="definition-language" className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#476b59] dark:text-lexicon-400"><Languages className="h-4 w-4" />{copy.title}</label><select id="definition-language" data-testid="definition-language-select" value={controller.target} onChange={(event) => controller.setTarget(event.target.value)} className="w-full rounded-lg border border-[#d6e4d8] bg-white px-3 py-2.5 text-sm text-[#345446] focus:outline-none focus:ring-2 focus:ring-lexicon-500 dark:border-ink-700 dark:bg-ink-950 dark:text-ink-200">{options.map(([code, label]) => <option value={code} key={code}>{label}</option>)}</select></div>
      {controller.progress ? <button type="button" onClick={controller.stop} data-testid="stop-definition-translation" className="rounded-lg border border-[#9ebcac] px-4 py-2.5 text-sm font-semibold text-[#3e715a] hover:bg-white dark:text-lexicon-300">{copy.stop}</button> : <button type="button" data-testid="translate-definitions-button" onClick={() => void controller.start(texts)} disabled={controller.target === "en" || (!untouched && !errors)} className="rounded-lg bg-[#245e4e] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#194c3e] disabled:cursor-not-allowed disabled:bg-[#b9c9be] dark:disabled:bg-ink-700">{label}</button>}
    </div>
    <p className="mt-3 text-xs leading-5 text-[#71897b] dark:text-ink-400">{copy.note}</p>{controller.progress && <p role="status" data-testid="definition-translation-progress" className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#4a7962] dark:text-lexicon-400"><LoaderCircle className="h-3.5 w-3.5 animate-spin" />{copy.loading} {controller.progress.completed}/{controller.progress.total}</p>}
  </div>;
}
export function TranslatedDefinition({ controller, locale, text }: { controller: DefinitionTranslationController; locale: UiLocale; text: string }) {
  if (controller.target === "en") return null;
  const record = controller.get(text), copy = TEXT[locale];
  if (!record) return null;
  if (record.status === "pending") return <p className="mt-1 text-xs text-[#8ca094]">{copy.loading}…</p>;
  if (record.status === "error") return <p data-testid="definition-translation-error" className="mt-1 text-xs leading-5 text-amber-700 dark:text-amber-400">{copy[record.code]}</p>;
  return <div data-testid="translated-definition" className="mt-2 rounded-lg border-l-2 border-[#8eb5a0] bg-[#f2f7f1] px-3 py-2 dark:border-lexicon-600 dark:bg-ink-800"><p className="text-[10px] font-semibold uppercase tracking-wide text-[#6e927e] dark:text-lexicon-400">{copy.label}</p><p lang={controller.target} dir="auto" className="mt-1 text-sm leading-6 text-[#315843] dark:text-ink-100">{record.text}</p></div>;
}
export function DefinitionLabels(locale: UiLocale) { return { provided: TEXT[locale].provided, original: TEXT[locale].originalLabel }; }
