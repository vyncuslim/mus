import type { MetadataRoute } from "next";
import { resolveSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    // Search pages must remain crawlable so crawlers can see their noindex tag.
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: `${resolveSiteUrl()}/sitemap.xml`,
  };
}
