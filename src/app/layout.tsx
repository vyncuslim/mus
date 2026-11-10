import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LexiconProvider } from "@/context/LexiconContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BRAND_ASSETS, BRAND_NAME } from "@/lib/brand";
import { HOME_DESCRIPTION, HOME_TITLE, socialMetadata } from "@/lib/seo";
import { resolveSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  metadataBase: new URL(resolveSiteUrl()),
  title: { default: HOME_TITLE, template: "%s | Vynalth Dictionary" },
  description: HOME_DESCRIPTION,
  applicationName: BRAND_NAME,
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
  ...socialMetadata(BRAND_NAME, HOME_DESCRIPTION),
};
export const viewport: Viewport = { themeColor: [{ media: "(prefers-color-scheme: light)", color: "#245e4e" }, { media: "(prefers-color-scheme: dark)", color: "#020617" }], width: "device-width", initialScale: 1 };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-Hans" suppressHydrationWarning><body className="min-h-screen flex flex-col bg-[#fbfbf8] dark:bg-ink-950 text-ink-900 dark:text-ink-50 font-sans antialiased"><LexiconProvider><Navbar /><main className="flex-1">{children}</main><Footer /></LexiconProvider></body></html>;
}
