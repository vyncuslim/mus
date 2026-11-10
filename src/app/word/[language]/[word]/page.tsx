import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWordEntry } from "@/lib/dictionary-service";
import { getLanguageMetadata, isValidLanguageCode } from "@/lib/languages";
import { toIndexableEntry, wordPath } from "@/lib/entry-index";
import { WordDetailClient } from "@/components/WordDetailClient";
import { BRAND_NAME } from "@/lib/brand";
import { excerpt, jsonForHtml, socialMetadata } from "@/lib/seo";
import { resolveSiteUrl } from "@/lib/site-url";

type WordParams = { params: Promise<{ language: string; word: string }> };
const getCachedWordEntry = cache(getWordEntry);

// Page route params may still be percent-encoded in production; decode once.
function decodePageWord(word: string): string {
  try { return decodeURIComponent(word); } catch { return word; }
}

function missingMetadata(word: string): Metadata {
  const title = word ? `${excerpt(word, 80)} — Entry Not Found` : "Entry Not Found";
  const description = "No structured entry was found. Search the dictionary for more words and definitions.";
  return { title, description, robots: { index: false, follow: true }, alternates: { canonical: null }, ...socialMetadata(`${title} | ${BRAND_NAME}`, description) };
}

export async function generateMetadata({ params }: WordParams): Promise<Metadata> {
  const { language, word } = await params;
  const decodedWord = decodePageWord(word || "").trim();
  if (!isValidLanguageCode(language) || !decodedWord || decodedWord.length > 120) return missingMetadata(decodedWord);

  const { entry } = await getCachedWordEntry(language, decodedWord);
  if (!entry) return missingMetadata(decodedWord);
  const indexable = toIndexableEntry({ language: entry.language, headword: entry.headword, definition: entry.senses[0]?.definition });
  if (!indexable) {
    const title = `${excerpt(entry.headword, 80)} — Dictionary entry`;
    const description = "This structured entry is not available for indexing.";
    return { title, description, robots: { index: false, follow: true }, alternates: { canonical: null }, ...socialMetadata(`${title} | ${BRAND_NAME}`, description) };
  }

  const languageName = entry.language === "ms" ? "Malay (Bahasa Melayu)" : getLanguageMetadata(entry.language).englishName;
  const title = `${entry.headword} — ${languageName} meaning & definition`;
  const description = excerpt(`${entry.headword} (${languageName}): ${indexable.definition}`, 155);
  const canonicalPath = wordPath(entry.language, entry.headword);
  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    ...socialMetadata(`${title} | ${BRAND_NAME}`, description, canonicalPath),
  };
}

export default async function WordDetailPage({ params }: WordParams) {
  const { language, word } = await params;
  const decodedWord = decodePageWord(word || "").trim();
  if (!isValidLanguageCode(language) || !decodedWord || decodedWord.length > 120) notFound();

  const { entry, morphologyFamily, dataSourceMode } = await getCachedWordEntry(language, decodedWord);
  if (!entry) notFound();

  const indexable = toIndexableEntry({ language: entry.language, headword: entry.headword, definition: entry.senses[0]?.definition });
  const origin = resolveSiteUrl();
  const canonicalUrl = indexable ? `${origin}${wordPath(entry.language, entry.headword)}` : "";
  const jsonLd = indexable ? {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTerm",
        name: entry.headword,
        description: indexable.definition,
        inDefinedTermSet: { "@type": "DefinedTermSet", name: BRAND_NAME, url: `${origin}/entries` },
        termCode: entry.id,
        url: canonicalUrl,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "词典检索", item: origin },
          { "@type": "ListItem", position: 2, name: "词条索引", item: `${origin}/entries` },
          { "@type": "ListItem", position: 3, name: entry.headword, item: canonicalUrl },
        ],
      },
    ],
  } : null;

  return <>
    {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonForHtml(jsonLd) }} />}
    <WordDetailClient entry={entry} morphologyFamily={morphologyFamily} dataSourceMode={dataSourceMode} />
  </>;
}
