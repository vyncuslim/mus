import { Suspense } from "react";
import type { Metadata } from "next";
import { DictionaryExperience } from "@/components/DictionaryExperience";
import { BRAND_NAME } from "@/lib/brand";
import { HOME_DESCRIPTION, HOME_TITLE, jsonForHtml, socialMetadata } from "@/lib/seo";
import { resolveSiteUrl } from "@/lib/site-url";

type HomeParams = { searchParams: Promise<Record<string, string | string[] | undefined>> };

function hasSearch(params: Record<string, string | string[] | undefined>): boolean {
  const query = Array.isArray(params.q) ? params.q[0] : params.q;
  return typeof query === "string" && query.trim().length > 0;
}

export async function generateMetadata({ searchParams }: HomeParams): Promise<Metadata> {
  if (hasSearch(await searchParams)) {
    const title = "词典搜索结果 · Dictionary search";
    const description = "Search results in Vynalth Dictionary. Results and coverage vary by language.";
    return {
      title,
      description,
      robots: { index: false, follow: true },
      alternates: { canonical: null },
      ...socialMetadata(`${title} | ${BRAND_NAME}`, description),
    };
  }
  return { alternates: { canonical: "/" }, ...socialMetadata(HOME_TITLE, HOME_DESCRIPTION, "/") };
}

export default async function HomePage({ searchParams }: HomeParams) {
  const isSearch = hasSearch(await searchParams);
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${resolveSiteUrl()}/#website`,
    url: resolveSiteUrl(),
    name: BRAND_NAME,
    description: HOME_DESCRIPTION,
  };
  return <>
    {!isSearch && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonForHtml(website) }} />}
    <Suspense fallback={<div className="mx-auto max-w-3xl px-5 py-24 text-center text-sm text-ink-500">Loading dictionary…</div>}><DictionaryExperience /></Suspense>
  </>;
}
