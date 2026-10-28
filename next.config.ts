import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Freeze the review-date cutoff at build/startup time for consistent SSR and hydration.
  env: { NEXT_PUBLIC_REVIEW_CATALOG_AS_OF: new Date().toISOString().slice(0, 10) },
  allowedDevOrigins: ["*.e2b.app", "localhost", "127.0.0.1"],
  outputFileTracingIncludes: {
    "/api/world": ["./data/world-lexicon/wiktionary-translations.json.gz"],
    "/api/definitions": ["./data/wiktionary-definitions/**/*.json.gz"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
