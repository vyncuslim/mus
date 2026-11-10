import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LexiconProvider } from "@/context/LexiconContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BRAND_ASSETS, BRAND_NAME, BRAND_SOCIAL_IMAGE } from "@/lib/brand";
import { resolveSiteUrl } from "@/lib/site-url";

const SITE_URL = resolveSiteUrl();
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Vynalth Dictionary — A Dictionary for Every Language", template: "%s | Vynalth Dictionary" },
  description: "Search words across languages using open Wiktionary sources. Coverage varies by language.",
  applicationName: BRAND_NAME,
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: BRAND_ASSETS.mark, type: "image/svg+xml", sizes: "any" },
      { url: BRAND_ASSETS.favicon32, type: "image/png", sizes: "32x32" },
      { url: BRAND_ASSETS.favicon, type: "image/x-icon" },
    ],
    shortcut: BRAND_ASSETS.favicon,
    apple: [{ url: BRAND_ASSETS.apple, type: "image/png", sizes: "180x180" }],
    other: [{ rel: "mask-icon", url: BRAND_ASSETS.safariPinned, color: "#214b40" }],
  },
  openGraph: {
    type: "website", siteName: BRAND_NAME, title: BRAND_NAME,
    description: "A focused dictionary for words across languages.", url: SITE_URL,
    images: [BRAND_SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image", title: BRAND_NAME,
    description: "A focused dictionary for words across languages.", images: [BRAND_SOCIAL_IMAGE],
  },
};
export const viewport: Viewport = { themeColor: [{ media: "(prefers-color-scheme: light)", color: "#245e4e" }, { media: "(prefers-color-scheme: dark)", color: "#020617" }], width: "device-width", initialScale: 1 };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-Hans" suppressHydrationWarning><body className="min-h-screen flex flex-col bg-[#fbfbf8] dark:bg-ink-950 text-ink-900 dark:text-ink-50 font-sans antialiased"><LexiconProvider><Navbar /><main className="flex-1">{children}</main><Footer /></LexiconProvider></body></html>;
}
