"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useLexicon } from "@/context/LexiconContext";
import { getAllLanguages, getLanguageDisplayName } from "@/lib/languages";
import { wordPath, type EntryIndexItem } from "@/lib/entry-index";

const COPY = {
  "zh-Hans": {
    back: "返回词典", eyebrow: "浏览词汇", title: "词条索引",
    intro: "这里展示当前词库中部分有独立详情页的结构化词条。更多词语和释义可以在首页搜索；收录范围因语言而异。",
    shown: (count: number) => `当前显示 ${count} 条`, empty: "目前没有可展示的结构化词条，请尝试搜索。",
    search: "搜索更多词语", definition: "英文释义",
  },
  en: {
    back: "Back to dictionary", eyebrow: "EXPLORE WORDS", title: "Dictionary entries",
    intro: "Browse a selection of structured entries with their own detail pages. Search the dictionary for more words and definitions; coverage varies by language.",
    shown: (count: number) => `${count} entries shown`, empty: "No structured entries are available to browse right now. Try searching instead.",
    search: "Search for more words", definition: "English definition",
  },
  ms: {
    back: "Kembali ke kamus", eyebrow: "TEROKA KATA", title: "Indeks entri kamus",
    intro: "Lihat sebahagian entri berstruktur yang mempunyai halaman tersendiri. Cari lebih banyak kata dan definisi di kamus; liputan berbeza mengikut bahasa.",
    shown: (count: number) => `${count} entri dipaparkan`, empty: "Tiada entri berstruktur untuk dilayari sekarang. Cuba gunakan carian.",
    search: "Cari lebih banyak kata", definition: "Definisi bahasa Inggeris",
  },
} as const;

export function EntryIndexClient({ entries }: { entries: EntryIndexItem[] }) {
  const { uiLocale } = useLexicon();
  const copy = COPY[uiLocale];
  const groups = getAllLanguages().map((language) => ({
    language,
    entries: entries.filter((entry) => entry.language === language.code),
  })).filter((group) => group.entries.length > 0);

  return <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16" data-testid="entry-index">
    <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-[#5d7568] hover:text-[#245e4e] dark:text-lexicon-400"><ArrowLeft aria-hidden="true" className="h-4 w-4" />{copy.back}</Link>
    <header className="border-b border-[#e6ebe4] pb-8 pt-10 dark:border-ink-800">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5d7568] dark:text-ink-400">{copy.eyebrow}</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-[#243e34] dark:text-white">{copy.title}</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-[#5d7568] dark:text-ink-400">{copy.intro}</p>
      <p className="mt-4 text-xs text-[#5d7568] dark:text-ink-400">{copy.shown(entries.length)} · <Link className="font-semibold text-[#36715f] underline underline-offset-4 dark:text-lexicon-400" href="/">{copy.search}</Link></p>
    </header>
    {groups.length === 0 && <p className="py-10 text-sm text-ink-500">{copy.empty}</p>}
    <div className="space-y-10 py-8">
      {groups.map(({ language, entries: words }) => <section key={language.code} aria-labelledby={`entries-${language.code}`}>
        <div className="mb-4 flex items-baseline gap-3"><h2 id={`entries-${language.code}`} className="font-serif text-2xl font-semibold text-[#355345] dark:text-white">{getLanguageDisplayName(language.code, uiLocale)}</h2><span className="text-xs text-[#5d7568] dark:text-ink-400">{words.length}</span></div>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {words.map((entry) => <li key={`${entry.language}\0${entry.headword}`} className="min-w-0">
            <Link href={wordPath(entry.language, entry.headword)} className="group flex h-full min-h-[96px] flex-col rounded-2xl border border-[#e5ebe3] bg-white p-4 transition-colors hover:border-[#9dbdab] focus:outline-none focus:ring-2 focus:ring-lexicon-500 dark:border-ink-800 dark:bg-ink-900">
              <span className="flex min-w-0 items-start justify-between gap-3"><span lang={entry.language} dir="auto" className="break-words font-serif text-lg font-semibold text-[#294c3c] group-hover:text-[#397861] dark:text-ink-50">{entry.headword}</span><ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-[#9bafa1]" /></span>
              <span className="mt-2 line-clamp-2 text-xs leading-5 text-[#5d7568] dark:text-ink-400"><span className="sr-only">{copy.definition}: </span><span lang="en" dir="auto">{entry.definition}</span></span>
            </Link>
          </li>)}
        </ul>
      </section>)}
    </div>
  </div>;
}
