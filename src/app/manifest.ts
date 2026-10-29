import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return { name: "Vynalth Dictionary", short_name: "Vynalth", description: "A focused multilingual dictionary using open Wiktionary sources.", start_url: "/", scope: "/", display: "standalone", background_color: "#fbfbf8", theme_color: "#245e4e", lang: "zh-Hans", icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }] };
}
