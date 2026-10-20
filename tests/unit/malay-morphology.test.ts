import { describe, expect, it } from "vitest";
import { analyzeMalayMorphology } from "@/lib/malay-morphology";

describe("Malay morphology & root-word analyzer", () => {
  it("identifies verified Kata Dasar accurately", () => {
    const res = analyzeMalayMorphology("makan");
    expect(res).not.toBeNull();
    expect(res?.possibleKataDasar).toBe("makan");
    expect(res?.affixType).toBe("none");
    expect(res?.verifiedEntryExists).toBe(true);
  });

  it("analyzes suffix (-an) derivation on 'makanan' -> 'makan'", () => {
    const res = analyzeMalayMorphology("makanan");
    expect(res).not.toBeNull();
    expect(res?.possibleKataDasar).toBe("makan");
    expect(res?.affixType).toBe("akhiran");
    expect(res?.affixPattern).toBe("-an");
  });

  it("handles nasal substitution (/t/ -> /n/) on 'menulis' and 'penulis' -> 'tulis'", () => {
    const menulis = analyzeMalayMorphology("menulis");
    expect(menulis?.possibleKataDasar).toBe("tulis");
    expect(menulis?.affixType).toBe("awalan");
    expect(menulis?.affixPattern).toBe("meN-");

    const penulis = analyzeMalayMorphology("penulis");
    expect(penulis?.possibleKataDasar).toBe("tulis");
    expect(penulis?.affixType).toBe("awalan");
    expect(penulis?.affixPattern).toBe("peN-");
  });

  it("handles circumfixes (apitan) with nasal substitution on 'menyatukan' -> 'satu'", () => {
    const res = analyzeMalayMorphology("menyatukan");
    expect(res).not.toBeNull();
    expect(res?.possibleKataDasar).toBe("satu");
    expect(res?.affixType).toBe("apitan");
    expect(res?.affixPattern).toBe("meN-...-kan");
  });

  it("identifies Malay infixes (sisipan -el-, -em-, -er-, -in-)", () => {
    const telapak = analyzeMalayMorphology("telapak");
    expect(telapak?.possibleKataDasar).toBe("tapak");
    expect(telapak?.affixType).toBe("sisipan");
    expect(telapak?.affixPattern).toBe("-el-");

    const gemuruh = analyzeMalayMorphology("gemuruh");
    expect(gemuruh?.possibleKataDasar).toBe("guruh");
    expect(gemuruh?.affixType).toBe("sisipan");
    expect(gemuruh?.affixPattern).toBe("-em-");
  });

  it("never blindly strips prefixes/suffixes when the remaining stem is not a verified root", () => {
    const unverified = analyzeMalayMorphology("menteri");
    expect(unverified).toBeNull();

    const gibberish = analyzeMalayMorphology("mengxyzkan");
    expect(gibberish).toBeNull();
  });
});
