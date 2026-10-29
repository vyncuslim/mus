import fs from "node:fs";
import path from "node:path";

// Next's trace is only a preflight estimate: Vercel can add runtime layers.
// Leave headroom below Vercel's standard function-size limit.
const MAX_TRACE_BYTES = 200 * 1024 * 1024;
const root = process.cwd();
const dataRoot = path.join(root, "data/wiktionary-definitions");
const definitionManifest = JSON.parse(fs.readFileSync(path.join(dataRoot, "manifest.json"), "utf8"));
if (!Array.isArray(definitionManifest.languages) || definitionManifest.languages.length === 0) {
  throw new Error("The definition manifest must list the indexed language files.");
}

const keyShards = Array.from({ length: 256 }, (_, index) =>
  path.join(dataRoot, "keys", `${index.toString(16).padStart(2, "0")}.json.gz`)
);
const languageShards = definitionManifest.languages.map((_, index) =>
  path.join(dataRoot, "languages", `${String(index).padStart(3, "0")}.json.gz`)
);
const worldIndex = path.join(root, "data/world-lexicon/wiktionary-translations.json.gz");

function verifyTrace(route, requiredFiles) {
  const tracePath = path.join(root, `.next/server/app/api/${route}/route.js.nft.json`);
  if (!fs.existsSync(tracePath)) throw new Error(`Missing build trace for /api/${route}. Run a production Next.js build first.`);
  const trace = JSON.parse(fs.readFileSync(tracePath, "utf8"));
  if (!Array.isArray(trace.files)) throw new Error(`Invalid build trace for /api/${route}.`);
  const tracedFiles = new Set(trace.files.map((file) => path.resolve(path.dirname(tracePath), file)));
  const missing = requiredFiles.filter((file) => !fs.existsSync(file) || !tracedFiles.has(file));
  if (missing.length) {
    throw new Error(`/api/${route} is missing ${missing.length} required dictionary files in its build trace, including ${path.relative(root, missing[0])}.`);
  }

  let bytes = 0;
  for (const file of tracedFiles) {
    if (!fs.existsSync(file)) throw new Error(`A traced file is missing: ${path.relative(root, file)}.`);
    bytes += fs.statSync(file).size;
  }
  const size = (bytes / 1024 / 1024).toFixed(2);
  if (bytes > MAX_TRACE_BYTES) throw new Error(`/api/${route} traces ${size} MiB, above the 200 MiB preflight budget.`);
  console.log(`/api/${route}: ${requiredFiles.length} required data files traced, ${size} MiB of traced files.`);
  return tracedFiles;
}

verifyTrace("definitions", [...keyShards, ...languageShards]);
verifyTrace("world", [worldIndex]);

// Vercel may group several App Router APIs into one function. Check the union
// of all API traces as well as each large data route, with the same headroom.
function allApiTraces(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return allApiTraces(file);
    return entry.name === "route.js.nft.json" ? [file] : [];
  });
}
const apiTraces = allApiTraces(path.join(root, ".next/server/app/api"));
const union = new Set();
for (const tracePath of apiTraces) {
  const trace = JSON.parse(fs.readFileSync(tracePath, "utf8"));
  if (!Array.isArray(trace.files)) throw new Error(`Invalid build trace: ${path.relative(root, tracePath)}.`);
  for (const file of trace.files) union.add(path.resolve(path.dirname(tracePath), file));
}
let combinedBytes = 0;
for (const file of union) {
  if (!fs.existsSync(file)) throw new Error(`A traced file is missing: ${path.relative(root, file)}.`);
  combinedBytes += fs.statSync(file).size;
}
const combinedSize = (combinedBytes / 1024 / 1024).toFixed(2);
if (combinedBytes > MAX_TRACE_BYTES) throw new Error(`Combined API traces total ${combinedSize} MiB, above the 200 MiB preflight budget.`);
console.log(`Combined API traces: ${apiTraces.length} routes, ${combinedSize} MiB.`);
console.log("Trace preflight passed; verify the final Vercel function sizes and endpoints after deployment.");
