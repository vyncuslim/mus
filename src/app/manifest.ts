import type { MetadataRoute } from "next";
import { BRAND_ASSETS, BRAND_NAME } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND_NAME,
    short_name: "Vynalth",
    description: "A focused multilingual dictionary using open Wiktionary sources.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fbfbf8",
    theme_color: "#245e4e",
    lang: "zh-Hans",
    icons: [
      { src: BRAND_ASSETS.mark, sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: BRAND_ASSETS.icon192, sizes: "192x192", type: "image/png", purpose: "any" },
      { src: BRAND_ASSETS.icon512, sizes: "512x512", type: "image/png", purpose: "any" },
      { src: BRAND_ASSETS.maskable, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
