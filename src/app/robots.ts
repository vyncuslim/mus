import type { MetadataRoute } from "next";
import { resolveSiteUrl } from "@/lib/site-url";

const SITE_URL = resolveSiteUrl();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/dictionary", "/word/", "/learn", "/about", "/sources"],
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
