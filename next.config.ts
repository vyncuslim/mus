import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
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
