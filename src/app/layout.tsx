import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LexiconProvider } from "@/context/LexiconContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://vynalth-lexicon.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Vynalth Lexicon — Multilingual Dictionary & Malay Morphological Reference",
    template: "%s | Vynalth Lexicon",
  },
  description:
    "Precision multilingual dictionary and language-learning platform featuring sense-aligned translations, IPA pronunciation, Wiktionary CC BY-SA 4.0 lexical records, and Bahasa Melayu Kata Dasar & Imbuhan analysis.",
  applicationName: "Vynalth Lexicon",
  keywords: [
    "multilingual dictionary",
    "kamus bahasa melayu",
    "kata dasar",
    "kata terbitan",
    "peribahasa",
    "simpulan bahasa",
    "penjodoh bilangan",
    "Malay English Chinese dictionary",
    "Wiktionary",
    "Vynalth Lexicon",
  ],
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      ms: "/?ui=ms",
      "zh-Hans": "/?ui=zh-Hans",
    },
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    type: "website",
    siteName: "Vynalth Lexicon",
    title:
      "Vynalth Lexicon — Multilingual Dictionary & Malay Morphological Reference",
    description:
      "Sense-aligned multilingual dictionary with Bahasa Melayu root-word analysis, IPA pronunciation, and open-source Wiktionary provenance.",
    url: SITE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0f766e" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-ink-50/50 dark:bg-ink-950 text-ink-900 dark:text-ink-50 font-sans antialiased">
        <LexiconProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LexiconProvider>
      </body>
    </html>
  );
}
