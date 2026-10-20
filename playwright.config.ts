import { defineConfig } from "@playwright/test";
import fs from "node:fs";

const sparticuzExecPath = "/tmp/chromium";
const sparticuzLibsPath = "/tmp/chromium-libs/lib:/tmp/chromium-libs";
const useSparticuz =
  !process.env.PLAYWRIGHT_USE_SYSTEM_BROWSER &&
  fs.existsSync(sparticuzExecPath);

export default defineConfig({
  testDir: "./tests/e2e",
  globalSetup: "./tests/e2e/global-setup.ts",
  timeout: 45_000,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3000",
    trace: "off",
    launchOptions: useSparticuz
      ? {
          executablePath: sparticuzExecPath,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
          ],
          env: {
            ...(process.env as Record<string, string>),
            LD_LIBRARY_PATH: sparticuzLibsPath,
          },
        }
      : undefined,
  },
  projects: [
    {
      name: "desktop-1440x900",
      use: { viewport: { width: 1440, height: 900 } },
    },
    {
      name: "desktop-1920x1080",
      use: { viewport: { width: 1920, height: 1080 } },
    },
    {
      name: "mobile-390x844",
      use: { viewport: { width: 390, height: 844 }, isMobile: true },
    },
    {
      name: "mobile-375x667",
      use: { viewport: { width: 375, height: 667 }, isMobile: true },
    },
  ],
});
