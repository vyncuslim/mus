import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const script = path.resolve("scripts/verify-deployment-traces.mjs");
let root: string;
let definitionTrace: string;
let worldTrace: string;
let keys: string[];
let language: string;
let world: string;

function write(file: string, content = "") {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}
function trace(file: string, files: string[]) {
  write(file, JSON.stringify({ files: files.map((item) => path.relative(path.dirname(file), item)) }));
}
function run() {
  return spawnSync(process.execPath, [script], { cwd: root, encoding: "utf8" });
}

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), "mus-trace-test-"));
  keys = Array.from({ length: 256 }, (_, i) => path.join(root, "data/wiktionary-definitions/keys", `${i.toString(16).padStart(2, "0")}.json.gz`));
  language = path.join(root, "data/wiktionary-definitions/languages/000.json.gz");
  world = path.join(root, "data/world-lexicon/wiktionary-translations.json.gz");
  write(path.join(root, "data/wiktionary-definitions/manifest.json"), JSON.stringify({ languages: [{ name: "fixture" }] }));
  for (const file of [...keys, language, world]) write(file);
  definitionTrace = path.join(root, ".next/server/app/api/definitions/route.js.nft.json");
  worldTrace = path.join(root, ".next/server/app/api/world/route.js.nft.json");
  trace(definitionTrace, [...keys, language]);
  trace(worldTrace, [world]);
});
afterEach(() => fs.rmSync(root, { recursive: true, force: true }));

describe("deployment trace preflight", () => {
  it("accepts complete, bounded API traces", () => {
    const result = run();
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Trace preflight passed");
  });

  it("fails if a required dictionary shard is not traced", () => {
    trace(definitionTrace, [...keys.slice(1), language]);
    const result = run();
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("missing 1 required dictionary files");
  });

  it("fails if the world translation index is not traced", () => {
    trace(worldTrace, []);
    const result = run();
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("/api/world is missing 1 required dictionary files");
  });

  it("fails when a traced file does not exist on disk", () => {
    const extra = path.join(root, "gone.txt");
    write(extra);
    trace(definitionTrace, [...keys, language, extra]);
    fs.unlinkSync(extra);
    const result = run();
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("A traced file is missing");
  });

  it("fails when multiple individually small API traces exceed the combined budget", () => {
    const first = path.join(root, "large-a.bin"), second = path.join(root, "large-b.bin");
    write(first); write(second);
    fs.truncateSync(first, 110 * 1024 * 1024);
    fs.truncateSync(second, 110 * 1024 * 1024);
    trace(definitionTrace, [...keys, language, first]);
    trace(worldTrace, [world, second]);
    const result = run();
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Combined API traces total");
  });

  it("fails when a required build trace is absent", () => {
    fs.unlinkSync(worldTrace);
    const result = run();
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Missing build trace for /api/world");
  });
});
