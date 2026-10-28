import type { MetadataRoute } from "next";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vynalth-lexicon.vercel.app";
// Imported dictionaries can exceed sitemap URL limits; detail pages remain discoverable through search.
export default function sitemap(): MetadataRoute.Sitemap { return [{ url: SITE_URL, changeFrequency: "weekly", priority: 1 }, { url: `${SITE_URL}/sources`, changeFrequency: "monthly", priority: 0.5 }]; }
