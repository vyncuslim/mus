import Link from "next/link";

export default function NotFound() {
  return <div className="mx-auto max-w-3xl space-y-4 px-5 py-20 text-center"><h1 className="font-serif text-3xl font-semibold text-ink-900 dark:text-white">页面未找到 · Page not found</h1><p className="text-sm text-ink-600 dark:text-ink-400">请返回词典搜索。 Try searching the dictionary instead.</p><Link href="/" className="inline-block text-sm font-semibold text-lexicon-700 underline dark:text-lexicon-400">返回词典 · Back to dictionary</Link></div>;
}
