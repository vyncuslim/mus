import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./gradient-rollout.css";
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
  return <html lang="zh-Hans" suppressHydrationWarning><head><script id="vynalth-gradient-rollout" dangerouslySetInnerHTML={{ __html: "(function(){var key='vynalth-gradient-v1';var variant=null;var cookies=document.cookie.split(';');for(var i=0;i<cookies.length;i++){var pair=cookies[i].trim();if(pair.indexOf(key+'=')===0){var value=pair.slice(key.length+1);if(value==='new'||value==='old')variant=value;break;}}if(!variant){try{var stored=localStorage.getItem(key);if(stored==='new'||stored==='old')variant=stored;}catch(_){}}if(!variant)variant=Math.random()<0.4?'new':'old';document.documentElement.dataset.vynGradient=variant;try{var host=location.hostname.toLowerCase();var domain=(host==='vynalthai.com'||host.endsWith('.vynalthai.com'))?'; Domain=.vynalthai.com':'';document.cookie=key+'='+variant+'; Path=/; Max-Age=15552000; SameSite=Lax'+(location.protocol==='https:'?'; Secure':'')+domain;localStorage.setItem(key,variant);}catch(_){}})();" }} /></head><body className="min-h-screen flex flex-col bg-[#fbfbf8] dark:bg-ink-950 text-ink-900 dark:text-ink-50 font-sans antialiased"><LexiconProvider><Navbar /><main className="flex-1">{children}</main><Footer /></LexiconProvider></body></html>;
}
