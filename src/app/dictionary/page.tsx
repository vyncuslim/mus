import { redirect } from "next/navigation";
export default async function DictionaryPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams, query = typeof params.q === "string" ? params.q.trim().slice(0, 120) : "";
  redirect(query ? `/?q=${encodeURIComponent(query)}` : "/");
}
