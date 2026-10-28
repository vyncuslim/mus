import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LexiconProvider } from "@/context/LexiconContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vynalth-lexicon.vercel.app";
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Vynalth Dictionary — A Dictionary for Every Language", template: "%s | Vynalth Dictionary" },
  description: "Search words across languages using open Wiktionary sources. Coverage varies by language.",
  applicationName: "Vynalth Dictionary", alternates: { canonical: "/" }, manifest: "/manifest.webmanifest", icons: { icon: "/icon.svg", apple: "/icon.svg" },
  openGraph: { type: "website", siteName: "Vynalth Dictionary", title: "Vynalth Dictionary", description: "A focused dictionary for words across languages.", url: SITE_URL },
};
export const viewport: Viewport = { themeColor: [{ media: "(prefers-color-scheme: light)", color: "#245e4e" }, { media: "(prefers-color-scheme: dark)", color: "#020617" }], width: "device-width", initialScale: 1 };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-Hans" suppressHydrationWarning><body className="min-h-screen flex flex-col bg-[#fbfbf8] dark:bg-ink-950 text-ink-900 dark:text-ink-50 font-sans antialiased"><LexiconProvider><Navbar /><main className="flex-1">{children}</main><Footer /></LexiconProvider></body></html>;
}
