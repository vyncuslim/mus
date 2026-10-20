import type { MetadataRoute } from "next";
import { getAllIndexedEntries } from "@/lib/dictionary-service";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://vynalth-lexicon.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getAllIndexedEntries();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/dictionary`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/learn`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/favorites`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/sources`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Only index real, verified dictionary entries
  const wordRoutes: MetadataRoute.Sitemap = entries.map((entry) => ({
    url: `${SITE_URL}/word/${entry.language}/${encodeURIComponent(entry.headword)}`,
    lastModified: new Date(entry.provenance.importedAt),
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...wordRoutes];
}
