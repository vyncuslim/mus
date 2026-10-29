import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
    globals: true,
    // Match the server/browser build cutoff while testing the shipped catalogue.
    env: { NEXT_PUBLIC_REVIEW_CATALOG_AS_OF: new Date().toISOString().slice(0, 10) },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
