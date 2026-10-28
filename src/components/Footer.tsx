"use client";
import Link from "next/link";
import { useLexicon } from "@/context/LexiconContext";
export function Footer() {
  const { uiLocale } = useLexicon();
  const label = uiLocale === "zh-Hans" ? "数据来源与许可" : uiLocale === "ms" ? "Sumber & lesen" : "Sources & licence";
  const attribution = uiLocale === "zh-Hans" ? "词汇内容来自维基词典贡献者 · CC BY-SA / GFDL" : uiLocale === "ms" ? "Kandungan oleh penyumbang Wiktionary · CC BY-SA / GFDL" : "Lexical content by Wiktionary contributors · CC BY-SA / GFDL";
  return <footer className="border-t border-[#e8e9e2] bg-[#fbfbf8] dark:border-ink-800 dark:bg-ink-950"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-[#7b8981] dark:text-ink-400 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12"><p>{attribution}</p><Link href="/sources" className="w-fit font-medium text-[#46695d] underline-offset-4 hover:underline dark:text-lexicon-400">{label}</Link></div></footer>;
}
