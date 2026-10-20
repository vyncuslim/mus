import fs from "node:fs";
import zlib from "node:zlib";
import path from "node:path";
import { execSync } from "node:child_process";

export async function prepareSparticuzChromium(): Promise<{
  executablePath?: string;
  args?: string[];
  env?: Record<string, string>;
}> {
  try {
    const binDir = path.resolve(
      process.cwd(),
      "node_modules/@sparticuz/chromium/bin"
    );
    if (!fs.existsSync(binDir)) {
      return {};
    }

    const libsDir = "/tmp/chromium-libs";
    if (!fs.existsSync(path.join(libsDir, "lib/libnspr4.so"))) {
      fs.mkdirSync(libsDir, { recursive: true });
      for (const archive of [
        "al2023.tar.br",
        "swiftshader.tar.br",
        "fonts.tar.br",
      ]) {
        const archivePath = path.join(binDir, archive);
        if (fs.existsSync(archivePath)) {
          const decompressed = zlib.brotliDecompressSync(
            fs.readFileSync(archivePath)
          );
          const tarOut = path.join("/tmp", archive.replace(/\.br$/, ""));
          fs.writeFileSync(tarOut, decompressed);
          execSync(`tar -xf ${tarOut} -C ${libsDir}`);
        }
      }
    }

    const chromiumMod = await import("@sparticuz/chromium");
    const chromium = chromiumMod.default || chromiumMod;
    const executablePath = await chromium.executablePath();

    return {
      executablePath,
      args: chromium.args,
      env: {
        ...(process.env as Record<string, string>),
        LD_LIBRARY_PATH: `${libsDir}/lib:${libsDir}`,
      },
    };
  } catch {
    return {};
  }
}

export default async function globalSetup() {
  await prepareSparticuzChromium();
}
