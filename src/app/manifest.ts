import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vynalth Lexicon — Multilingual Dictionary & Malay Morphology",
    short_name: "Vynalth Lexicon",
    description:
      "Precision multilingual dictionary, sense-aligned translator, and Bahasa Melayu Kata Dasar & Imbuhan reference.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#0f766e",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
