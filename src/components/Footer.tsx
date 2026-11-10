"use client";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { useLexicon } from "@/context/LexiconContext";

export function Footer() {
  const { uiLocale } = useLexicon();
  const label = uiLocale === "zh-Hans" ? "数据来源与许可" : uiLocale === "ms" ? "Sumber & lesen" : "Sources & licence";
  const indexLabel = uiLocale === "zh-Hans" ? "词条索引" : uiLocale === "ms" ? "Indeks entri" : "Dictionary entries";
  const attribution = uiLocale === "zh-Hans" ? "词汇内容来自维基词典贡献者 · CC BY-SA / GFDL" : uiLocale === "ms" ? "Kandungan oleh penyumbang Wiktionary · CC BY-SA / GFDL" : "Lexical content by Wiktionary contributors · CC BY-SA / GFDL";
  return (
    <footer className="border-t border-[#e8e9e2] bg-[#fbfbf8] dark:border-ink-800 dark:bg-ink-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 text-xs text-[#5d7568] dark:text-ink-400 sm:flex-row sm:items-end sm:justify-between sm:px-8 lg:px-12">
        <div className="flex flex-col items-start gap-3">
          <BrandLogo placement="footer" />
          <p>{attribution}</p>
        </div>
        <nav aria-label={uiLocale === "zh-Hans" ? "页脚导航" : uiLocale === "ms" ? "Navigasi pengaki" : "Footer navigation"} className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/entries" className="w-fit font-medium text-[#46695d] underline-offset-4 hover:underline dark:text-lexicon-400">{indexLabel}</Link>
          <Link href="/sources" className="w-fit font-medium text-[#46695d] underline-offset-4 hover:underline dark:text-lexicon-400">{label}</Link>
        </nav>
      </div>
    </footer>
  );
}
