"use client";
import Link from "next/link";
import { Moon, Sun, WifiOff } from "lucide-react";
import { useLexicon } from "@/context/LexiconContext";
import type { UiLocale } from "@/types/lexicon";
const options: { code: UiLocale; label: string }[] = [{ code: "zh-Hans", label: "简体中文" }, { code: "en", label: "English" }, { code: "ms", label: "Bahasa Melayu" }];
export function Navbar() {
  const { uiLocale, setUiLocale, t, theme, toggleTheme, isOffline } = useLexicon();
  const offline = uiLocale === "zh-Hans" ? "当前离线：仅可访问之前缓存的页面和查询。" : uiLocale === "ms" ? "Luar talian: hanya halaman dan carian yang telah disimpan boleh diakses." : "Offline: only previously cached pages and searches are available.";
  return <header className="border-b border-[#e8e9e2] bg-[#fbfbf8] dark:border-ink-800 dark:bg-ink-950">
    {isOffline && <div role="status" data-testid="offline-banner" className="flex items-center justify-center gap-2 bg-amber-50 px-4 py-2 text-xs text-amber-900 dark:bg-amber-950 dark:text-amber-200"><WifiOff className="h-3.5 w-3.5 shrink-0" />{offline}</div>}
    <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-3 px-5 sm:px-8 lg:px-12">
      <Link href="/" aria-label="Vynalth Dictionary" className="group flex items-center gap-3 rounded-md focus:outline-none focus:ring-2 focus:ring-lexicon-600"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#194f45] font-serif text-xl font-bold text-white group-hover:bg-[#246b5e]">V</span><span className="flex flex-col leading-none"><span className="font-serif text-[19px] font-bold tracking-[-0.025em] text-[#1a302b] dark:text-white">Vynalth</span><span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#71827b] dark:text-ink-400">Dictionary</span></span></Link>
      <div className="flex items-center gap-1.5 sm:gap-3"><label htmlFor="ui-locale-select" className="sr-only">{t.nav.uiLanguage}</label><select id="ui-locale-select" data-testid="ui-locale-selector" value={uiLocale} onChange={(event) => setUiLocale(event.target.value as UiLocale)} aria-label={t.nav.uiLanguage} className="max-w-[138px] cursor-pointer rounded-lg border border-transparent bg-transparent py-2 pl-2 pr-7 text-xs font-medium text-[#52645c] hover:bg-[#f0f3ed] focus:outline-none focus:ring-2 focus:ring-lexicon-600 dark:text-ink-300 dark:hover:bg-ink-900 sm:text-sm">{options.map((option) => <option key={option.code} value={option.code}>{option.label}</option>)}</select><span aria-hidden="true" className="h-5 w-px bg-[#dedfd8] dark:bg-ink-700" /><button type="button" onClick={toggleTheme} data-testid="theme-toggle" aria-label={theme === "dark" ? t.nav.lightMode : t.nav.darkMode} title={theme === "dark" ? t.nav.lightMode : t.nav.darkMode} className="rounded-lg p-2 text-[#52645c] hover:bg-[#f0f3ed] focus:outline-none focus:ring-2 focus:ring-lexicon-600 dark:text-ink-300 dark:hover:bg-ink-900">{theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}</button></div>
    </div>
  </header>;
}
