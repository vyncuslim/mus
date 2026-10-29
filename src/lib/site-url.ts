type SiteUrlEnvironment = {
  NEXT_PUBLIC_SITE_URL?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
  VERCEL_URL?: string;
};

function origin(value: string, hostOnly: boolean): string | undefined {
  try {
    const url = new URL(hostOnly ? `https://${value}` : value);
    if ((url.protocol !== "https:" && url.protocol !== "http:") || url.username || url.password || url.pathname !== "/" || url.search || url.hash) return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}

/** Canonical origin for metadata. Vercel system URLs contain no scheme. */
export function resolveSiteUrl(env: SiteUrlEnvironment = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  VERCEL_URL: process.env.VERCEL_URL,
}): string {
  const configured = env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    const result = origin(configured, false);
    if (!result) throw new Error("NEXT_PUBLIC_SITE_URL must be an HTTP(S) origin without credentials, path, query, or fragment.");
    return result;
  }
  for (const value of [env.VERCEL_PROJECT_PRODUCTION_URL, env.VERCEL_URL]) {
    const result = value?.trim() ? origin(value.trim(), true) : undefined;
    if (result) return result;
  }
  // Local metadata only; dictionary API requests use relative URLs.
  return "http://localhost:3000";
}
