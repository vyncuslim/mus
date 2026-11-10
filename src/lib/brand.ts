/** Public, versioned URLs for the approved Vynalth mark and its derivatives. */
export const BRAND_NAME = "Vynalth Dictionary";
// These assets are intentionally public to share platforms, even when the
// site's other images are protected by Cloudflare Hotlink Protection.
const root = "/brand/v2/hotlink-ok";
export const BRAND_ASSETS = {
  mark: `${root}/icon.svg`,
  favicon: `${root}/favicon.ico`,
  favicon32: `${root}/favicon-32.png`,
  apple: `${root}/apple-touch-icon.png`,
  icon192: `${root}/icon-192.png`,
  icon512: `${root}/icon-512.png`,
  maskable: `${root}/icon-maskable-512.png`,
  safariPinned: `${root}/safari-pinned-tab.svg`,
  social: `${root}/social-card.png`,
} as const;

export const BRAND_SOCIAL_IMAGE = {
  url: BRAND_ASSETS.social,
  width: 1200,
  height: 630,
  alt: "Vynalth Dictionary logo: an open book and the letter V",
} as const;
