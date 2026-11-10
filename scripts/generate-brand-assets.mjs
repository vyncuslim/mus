import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// public/icon.svg is the approved master mark. The hotlink-ok directory lets
// social platforms and icon consumers fetch these public images even when
// Cloudflare Hotlink Protection is enabled. Keep prior v2 URLs working too.
const previousOutput = path.join("public", "brand", "v2");
const output = path.join(previousOutput, "hotlink-ok");
const source = await fs.readFile(path.join("public", "icon.svg"));
await fs.mkdir(output, { recursive: true });
async function writeAsset(name, data, legacyRoot = false) {
  const destinations = [path.join(output, name), path.join(previousOutput, name)];
  if (legacyRoot) destinations.push(path.join("public", name));
  await Promise.all(destinations.map((file) => fs.writeFile(file, data)));
}
await writeAsset("icon.svg", source);

const png = (size) => sharp(source, { density: 384 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

const [icon16, icon32, icon48, icon64, apple, icon192, icon512] = await Promise.all(
  [16, 32, 48, 64, 180, 192, 512].map(png),
);
await writeAsset("apple-touch-icon.png", apple, true);
await writeAsset("icon-192.png", icon192, true);
await writeAsset("icon-512.png", icon512, true);
await writeAsset("favicon-32.png", icon32);

// ICO supports multiple PNG images, allowing browsers to choose a useful size.
const iconSizes = [16, 32, 48, 64];
const iconImages = [icon16, icon32, icon48, icon64];
const header = Buffer.alloc(6 + iconImages.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(iconImages.length, 4);
let offset = header.length;
for (const [index, image] of iconImages.entries()) {
  const entry = 6 + index * 16;
  header[entry] = iconSizes[index];
  header[entry + 1] = iconSizes[index];
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(image.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += image.length;
}
await writeAsset("favicon.ico", Buffer.concat([header, ...iconImages]), true);

// The meaningful mark is inside Android's 80% maskable safe circle.
const insetMark = await png(312);
const maskable = await sharp({ create: { width: 512, height: 512, channels: 4, background: "#f4f1e7" } })
  .composite([{ input: insetMark, left: 100, top: 100 }])
  .png({ compressionLevel: 9 }).toBuffer();
await writeAsset("icon-maskable-512.png", maskable);

// Safari pinned tabs require a monochrome mark on a transparent background.
// Reuse the master's paths so the pinned mark cannot drift from the original.
const markPaths = [...source.toString().matchAll(/<path\b[^>]*\/>/g)]
  .map(([element]) => element.replace(/stroke="#[0-9a-f]+"/gi, 'stroke="#000"'));
if (markPaths.length === 0) throw new Error("The master SVG has no paths for the Safari pinned icon.");
const pinned = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">\n  ${markPaths.join("\n  ")}\n</svg>\n`;
await writeAsset("safari-pinned-tab.svg", pinned);

// A restrained, readable share image; the mark itself is composited from the
// same SVG used by the website and icons rather than redrawn for social cards.
const card = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#fbfbf8"/>
  <rect x="36" y="36" width="1128" height="558" rx="24" fill="none" stroke="#dfe7de" stroke-width="2"/>
  <path d="M124 133h34 M1042 133h34" stroke="#a8bfb0" stroke-width="2"/>
  <text x="178" y="140" fill="#6e8c7d" font-family="DejaVu Sans, sans-serif" font-size="17" font-weight="bold" letter-spacing="3">A DICTIONARY FOR THE WORLD</text>
  <text x="365" y="287" fill="#1a302b" font-family="DejaVu Serif, serif" font-size="86">Vynalth</text>
  <text x="370" y="334" fill="#71827b" font-family="DejaVu Sans, sans-serif" font-size="18" font-weight="bold" letter-spacing="6">DICTIONARY</text>
  <text x="370" y="392" fill="#537264" font-family="DejaVu Serif, serif" font-size="24">One word, a world of meaning.</text>
  <path d="M124 493h952" stroke="#dfe7de" stroke-width="2"/>
  <text x="124" y="539" fill="#8ba194" font-family="DejaVu Sans, sans-serif" font-size="15" letter-spacing="2">WORDS  ·  LANGUAGES  ·  MEANING</text>
</svg>`);
const cardMark = await png(192);
const social = await sharp(card).composite([{ input: cardMark, left: 124, top: 213 }]).png({ compressionLevel: 9 }).toBuffer();
await writeAsset("social-card.png", social);
console.log(`Generated Vynalth brand assets in ${output} and refreshed legacy icon paths.`);
