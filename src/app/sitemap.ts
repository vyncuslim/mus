import type { MetadataRoute } from "next";
import { getIndexableEntries } from "@/lib/dictionary-service";
import { wordPath } from "@/lib/entry-index";
import { resolveSiteUrl } from "@/lib/site-url";

// Do not freeze the optional database's contents at build time.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = resolveSiteUrl();
  const { entries } = await getIndexableEntries();
  return [
    { url: origin },
    { url: `${origin}/entries` },
    { url: `${origin}/sources` },
    ...entries.map((entry) => ({ url: `${origin}${wordPath(entry.language, entry.headword)}` })),
  ];
}
