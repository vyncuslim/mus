import { Suspense } from "react";
import { DictionaryExperience } from "@/components/DictionaryExperience";
export default function HomePage() {
  return <Suspense fallback={<div className="mx-auto max-w-3xl px-5 py-24 text-center text-sm text-ink-500">Loading dictionary…</div>}><DictionaryExperience /></Suspense>;
}
