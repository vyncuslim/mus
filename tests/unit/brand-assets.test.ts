import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import manifest from "@/app/manifest";
import { BRAND_ASSETS, BRAND_NAME, BRAND_SOCIAL_IMAGE } from "@/lib/brand";

const asset = (url: string) => path.join(process.cwd(), "public", url.replace(/^\//, ""));

describe("approved brand assets", () => {
  it("uses the master logo and keeps existing icon URLs in sync", async () => {
    const pairs = [
      ["/icon.svg", BRAND_ASSETS.mark],
      ["/apple-touch-icon.png", BRAND_ASSETS.apple],
      ["/icon-192.png", BRAND_ASSETS.icon192],
      ["/icon-512.png", BRAND_ASSETS.icon512],
      ["/favicon.ico", BRAND_ASSETS.favicon],
    ];
    for (const [legacy, versioned] of pairs) {
      expect(await readFile(asset(legacy))).toEqual(await readFile(asset(versioned)));
    }
    for (const versioned of Object.values(BRAND_ASSETS)) {
      expect(versioned).toContain("/hotlink-ok/");
      const previous = versioned.replace("/hotlink-ok/", "/");
      expect(await readFile(asset(previous))).toEqual(await readFile(asset(versioned)));
    }
    const master = (await readFile(asset(BRAND_ASSETS.mark))).toString();
    const pinned = (await readFile(asset(BRAND_ASSETS.safariPinned))).toString();
    const paths = [...master.matchAll(/<path\b[^>]*\bd="([^"]+)"/g)].map((match) => match[1]);
    expect(paths.length).toBeGreaterThan(0);
    for (const d of paths) expect(pinned).toContain(`d="${d}"`);
  });

  it("has correct PNG dimensions and a multi-resolution ICO fallback", async () => {
    const dimensions: Array<[string, number, number]> = [
      [BRAND_ASSETS.favicon32, 32, 32], [BRAND_ASSETS.apple, 180, 180],
      [BRAND_ASSETS.icon192, 192, 192], [BRAND_ASSETS.icon512, 512, 512],
      [BRAND_ASSETS.maskable, 512, 512], [BRAND_ASSETS.social, 1200, 630],
    ];
    for (const [url, width, height] of dimensions) {
      expect(await sharp(asset(url)).metadata()).toMatchObject({ format: "png", width, height });
    }
    const ico = await readFile(asset(BRAND_ASSETS.favicon));
    expect(ico.readUInt16LE(0)).toBe(0);
    expect(ico.readUInt16LE(2)).toBe(1);
    expect(ico.readUInt16LE(4)).toBe(4);
    for (const [index, size] of [16, 32, 48, 64].entries()) {
      const entry = 6 + index * 16;
      expect(ico[entry]).toBe(size);
      expect(ico[entry + 1]).toBe(size);
      const start = ico.readUInt32LE(entry + 12);
      expect(ico.subarray(start, start + 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    }
  });

  it("keeps the complete maskable mark inside Android's safe circle", async () => {
    const { data, info } = await sharp(asset(BRAND_ASSETS.maskable)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    let inkPixels = 0;
    let furthestContent = 0;
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        const p = (y * info.width + x) * info.channels;
        if (data[p] < 90 && data[p + 1] < 120 && data[p + 2] < 110) inkPixels++;
        const difference = Math.max(Math.abs(data[p] - 244), Math.abs(data[p + 1] - 241), Math.abs(data[p + 2] - 231));
        if (difference >= 5) furthestContent = Math.max(furthestContent, Math.hypot(x - 256, y - 256));
      }
    }
    expect(inkPixels).toBeGreaterThan(100);
    expect(furthestContent).toBeLessThanOrEqual(204.8);
    // The whole canvas is opaque, so different masks cannot reveal transparent corners.
    for (const [x, y] of [[0, 0], [511, 0], [0, 511], [511, 511]]) {
      expect(data[(y * info.width + x) * info.channels + 3]).toBe(255);
    }
  });

  it("places the approved mark on the social card", async () => {
    const icon = await sharp(asset(BRAND_ASSETS.icon192)).ensureAlpha().raw().toBuffer();
    const cardMark = await sharp(asset(BRAND_ASSETS.social)).extract({ left: 124, top: 213, width: 192, height: 192 }).ensureAlpha().raw().toBuffer();
    let compared = 0;
    let maxDifference = 0;
    for (let pixel = 0; pixel < icon.length; pixel += 4) {
      if (icon[pixel + 3] !== 255) continue;
      compared++;
      for (let channel = 0; channel < 3; channel++) maxDifference = Math.max(maxDifference, Math.abs(icon[pixel + channel] - cardMark[pixel + channel]));
    }
    expect(compared).toBeGreaterThan(30_000);
    expect(maxDifference).toBe(0);
  });

  it("uses the versioned mark in the manifest and caches every branded asset", async () => {
    const webManifest = manifest();
    expect(webManifest.name).toBe(BRAND_NAME);
    expect(webManifest.icons).toEqual(expect.arrayContaining([
      expect.objectContaining({ src: BRAND_ASSETS.mark, purpose: "any" }),
      expect.objectContaining({ src: BRAND_ASSETS.icon192, sizes: "192x192", purpose: "any" }),
      expect.objectContaining({ src: BRAND_ASSETS.icon512, sizes: "512x512", purpose: "any" }),
      expect.objectContaining({ src: BRAND_ASSETS.maskable, sizes: "512x512", purpose: "maskable" }),
    ]));
    expect(BRAND_SOCIAL_IMAGE).toMatchObject({ url: BRAND_ASSETS.social, width: 1200, height: 630 });
    const serviceWorker = (await readFile(asset("/sw.js"))).toString();
    for (const url of Object.values(BRAND_ASSETS)) expect(serviceWorker).toContain(`"${url}"`);
    expect(serviceWorker).toContain('"/favicon.ico"');
  });
});
