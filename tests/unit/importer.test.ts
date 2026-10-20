import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  mergeLexiconEntries,
  normalizeWiktextractRecord,
  streamImportWiktextractJsonl,
} from "@/lib/importer";

describe("Wiktextract JSONL Streaming Importer", () => {
  const samplePath = path.resolve(
    process.cwd(),
    "data/samples/wiktextract-sample.jsonl"
  );

  it("streams and validates the sample JSONL fixture, merging distinct senses cleanly", async () => {
    const res = await streamImportWiktextractJsonl({
      filePath: samplePath,
      sourceVersion: "wiktextract-test-2026",
    });

    expect(res.stats.linesRead).toBe(6);
    expect(res.stats.recordsValidated).toBe(6);
    expect(res.stats.uniqueEntriesProduced).toBe(5);
    expect(res.stats.sensesMerged).toBe(1);

    const makanEntry = res.entries.find(
      (e) => e.language === "ms" && e.headword === "makan"
    );
    expect(makanEntry).toBeDefined();
    expect(makanEntry?.senses).toHaveLength(2);
    expect(makanEntry?.provenance.license).toContain("CC BY-SA 4.0");
  });

  it("supports selective language imports via allowedLanguages", async () => {
    const res = await streamImportWiktextractJsonl({
      filePath: samplePath,
      allowedLanguages: ["ms"],
    });

    expect(res.entries.every((e) => e.language === "ms")).toBe(true);
    expect(res.stats.recordsSkippedLanguage).toBeGreaterThan(0);
  });

  it("is idempotent when merging duplicate sense records", () => {
    const raw = {
      word: "buku",
      lang_code: "ms",
      pos: "noun",
      senses: [{ glosses: ["book; bound pages"] }],
    };
    const e1 = normalizeWiktextractRecord(raw)!;
    const e2 = normalizeWiktextractRecord(raw)!;
    const { merged, addedSenses } = mergeLexiconEntries(e1, e2);

    expect(addedSenses).toBe(0);
    expect(merged.senses).toHaveLength(1);
  });
});
