import type { MalayAffixType } from "@/types/lexicon";
import { normalizeSearchKey } from "./text-normalize";

export interface MalayRuleAnalysisResult {
  input: string;
  possibleKataDasar: string;
  affixType: MalayAffixType;
  affixPattern: string;
  morphophonemicNote?: string;
  explanationEn: string;
  explanationMs: string;
  verifiedEntryExists: boolean;
}

/**
 * Verified Malay root words (Kata Dasar) used to validate morphological decomposition.
 * We NEVER guess a root word by blindly stripping prefixes unless the candidate root
 * is in this verified set of real Bahasa Melayu roots.
 */
export const VERIFIED_MALAY_ROOTS = new Set<string>([
  "makan",
  "minum",
  "ajar",
  "didik",
  "tulis",
  "baca",
  "kerja",
  "jalan",
  "kasih",
  "sayang",
  "guna",
  "buat",
  "بينا",
  "bina",
  "satu",
  "padu",
  "masyarakat",
  "negara",
  "bahasa",
  "budaya",
  "ilmu",
  "buku",
  "rumah",
  "sekolah",
  "guru",
  "murid",
  "hati",
  "tangan",
  "kaki",
  "mata",
  "buah",
  "bunga",
  "pokok",
  "air",
  "api",
  "tanah",
  "angin",
  "besar",
  "kecil",
  "tinggi",
  "rendah",
  "cepat",
  "lambat",
  "indah",
  "cantik",
  "baik",
  "adil",
  "aman",
  "damai",
  "merdeka",
  "daulat",
  "warga",
  "usaha",
  "jaya",
  "cipta",
  "kaji",
  "selidik",
  "urus",
  "tadbir",
  "pimpin",
  "bantu",
  "tolong",
  "sapu",
  "kupas",
  "potong",
  "masak",
  "jual",
  "beli",
  "bayar",
  "simpan",
  "hantar",
  "terima",
  "dengar",
  "lihat",
  "pandang",
  "fikir",
  "ingat",
  "faham",
  "kenal",
  "tahu",
  "tapak",
  "guruh",
  "gigi",
  "sambung",
  "kemilau",
  "gilap",
  "tunjuk",
]);

/**
 * Explicit irregular or infix (sisipan) verified decompositions.
 */
const EXPLICIT_SISIPAN_MAP: Record<
  string,
  {
    root: string;
    affixType: MalayAffixType;
    pattern: string;
    noteMs: string;
    noteEn: string;
  }
> = {
  telapak: {
    root: "tapak",
    affixType: "sisipan",
    pattern: "-el-",
    noteMs: "Sisipan -el- disisipkan selepas konsonan pertama kata dasar 'tapak' → 'telapak'.",
    noteEn: "Infix -el- inserted after the initial consonant of root 'tapak' → 'telapak'.",
  },
  telunjuk: {
    root: "tunjuk",
    affixType: "sisipan",
    pattern: "-el-",
    noteMs: "Sisipan -el- dalam kata dasar 'tunjuk' → 'telunjuk' (jari telunjuk).",
    noteEn: "Infix -el- inserted into root 'tunjuk' (point) → 'telunjuk' (index finger).",
  },
  gemuruh: {
    root: "guruh",
    affixType: "sisipan",
    pattern: "-em-",
    noteMs: "Sisipan -em- dalam kata dasar 'guruh' → 'gemuruh'.",
    noteEn: "Infix -em- inserted into root 'guruh' (thunder) → 'gemuruh' (thunderous/reverberating).",
  },
  gerigi: {
    root: "gigi",
    affixType: "sisipan",
    pattern: "-er-",
    noteMs: "Sisipan -er- dalam kata dasar 'gigi' → 'gerigi' (berbentuk banyak gigi/serrated).",
    noteEn: "Infix -er- inserted into root 'gigi' (tooth) → 'gerigi' (serration/cog teeth).",
  },
  sinambung: {
    root: "sambung",
    affixType: "sisipan",
    pattern: "-in-",
    noteMs: "Sisipan -in- dalam kata dasar 'sambung' → 'sinambung' (berterusan/kesinambungan).",
    noteEn: "Infix -in- inserted into root 'sambung' (connect) → 'sinambung' (continuous).",
  },
  belajar: {
    root: "ajar",
    affixType: "awalan",
    pattern: "bel- (alomorph beR-)",
    noteMs: "Alomorf khas 'bel-' digunakan apabila awalan 'beR-' bertemu kata dasar 'ajar' → 'belajar'.",
    noteEn: "Special allomorph 'bel-' occurs when prefix 'beR-' attaches to root 'ajar' → 'belajar'.",
  },
  pelajar: {
    root: "ajar",
    affixType: "awalan",
    pattern: "pel- (alomorph peN-)",
    noteMs: "Alomorf khas 'pel-' digunakan pada kata dasar 'ajar' untuk membentuk 'pelajar' (orang yang belajar), berbeza daripada 'pengajar' (orang yang mengajar).",
    noteEn: "Allomorph 'pel-' attaches to 'ajar' to form 'pelajar' (one who studies/student), contrasting with 'pengajar' (one who teaches).",
  },
  pelajaran: {
    root: "ajar",
    affixType: "apitan",
    pattern: "pel-...-an",
    noteMs: "Apitan 'pel-...-an' pada kata dasar 'ajar' membentuk 'pelajaran' (sesuatu yang dipelajari).",
    noteEn: "Circumfix 'pel-...-an' on root 'ajar' forms 'pelajaran' (lesson/subject learned).",
  },
  pekerja: {
    root: "kerja",
    affixType: "awalan",
    pattern: "pe- (alomorph peN-)",
    noteMs: "Awalan 'pe-' pada kata dasar 'kerja' membentuk 'pekerja'.",
    noteEn: "Prefix 'pe-' on root 'kerja' forms 'pekerja' (worker/employee).",
  },
  pekerjaan: {
    root: "kerja",
    affixType: "apitan",
    pattern: "pe-...-an",
    noteMs: "Apitan 'pe-...-an' pada kata dasar 'kerja' membentuk 'pekerjaan'.",
    noteEn: "Circumfix 'pe-...-an' on root 'kerja' forms 'pekerjaan' (occupation/employment).",
  },
};

/**
 * Analyzes a Malay word using verified roots and tested morphophonemic rules.
 * Never strips affixes unless the resulting root is verified in VERIFIED_MALAY_ROOTS
 * or available in the caller's verified lexicon set.
 */
export function analyzeMalayMorphology(
  rawWord: string,
  additionalVerifiedRoots?: Set<string>
): MalayRuleAnalysisResult | null {
  const word = normalizeSearchKey(rawWord);
  if (!word || word.length < 3) return null;

  const isRootVerified = (candidate: string): boolean => {
    return (
      VERIFIED_MALAY_ROOTS.has(candidate) ||
      Boolean(additionalVerifiedRoots?.has(candidate))
    );
  };

  // 1. Check explicit sisipan / special allomorph table
  if (EXPLICIT_SISIPAN_MAP[word]) {
    const spec = EXPLICIT_SISIPAN_MAP[word];
    return {
      input: word,
      possibleKataDasar: spec.root,
      affixType: spec.affixType,
      affixPattern: spec.pattern,
      morphophonemicNote: spec.noteMs,
      explanationMs: spec.noteMs,
      explanationEn: spec.noteEn,
      verifiedEntryExists: isRootVerified(spec.root),
    };
  }

  // 2. If the word itself is already a verified Kata Dasar
  if (isRootVerified(word)) {
    return {
      input: word,
      possibleKataDasar: word,
      affixType: "none",
      affixPattern: "Kata Dasar",
      explanationMs: `'${word}' ialah kata dasar tulen tanpa imbuhan.`,
      explanationEn: `'${word}' is an un-affixed root word (kata dasar).`,
      verifiedEntryExists: true,
    };
  }

  // Helper to check prefix + morphophonemic nasal substitution (peluluhan konsonan p, t, k, s)
  const matchPrefixCandidates = (
    surface: string
  ): {
    root: string;
    prefixPattern: string;
    noteMs?: string;
    noteEn?: string;
  } | null => {
    // Direct prefixes without nasal dropping
    const directPrefixes: { surfacePrefix: string; pattern: string }[] = [
      { surfacePrefix: "meng", pattern: "meN-" },
      { surfacePrefix: "mem", pattern: "meN-" },
      { surfacePrefix: "men", pattern: "meN-" },
      { surfacePrefix: "me", pattern: "meN-" },
      { surfacePrefix: "peng", pattern: "peN-" },
      { surfacePrefix: "pem", pattern: "peN-" },
      { surfacePrefix: "pen", pattern: "peN-" },
      { surfacePrefix: "pe", pattern: "peN-" },
      { surfacePrefix: "ber", pattern: "beR-" },
      { surfacePrefix: "be", pattern: "beR-" },
      { surfacePrefix: "ter", pattern: "teR-" },
      { surfacePrefix: "di", pattern: "di-" },
      { surfacePrefix: "ke", pattern: "ke-" },
      { surfacePrefix: "se", pattern: "se-" },
    ];

    for (const { surfacePrefix, pattern } of directPrefixes) {
      if (surface.startsWith(surfacePrefix)) {
        const rest = surface.slice(surfacePrefix.length);
        if (isRootVerified(rest)) {
          return { root: rest, prefixPattern: pattern };
        }
      }
    }

    // Nasal substitution rules (Peluluhan Konsonan Sengau: p -> m, t -> n, k -> ng, s -> ny)
    const nasalRules: {
      surfaceStart: string;
      restoredConsonant: string;
      pattern: string;
      phonemeLabel: string;
    }[] = [
      { surfaceStart: "meny", restoredConsonant: "s", pattern: "meN-", phonemeLabel: "/s/ → /ny/" },
      { surfaceStart: "peny", restoredConsonant: "s", pattern: "peN-", phonemeLabel: "/s/ → /ny/" },
      { surfaceStart: "meng", restoredConsonant: "k", pattern: "meN-", phonemeLabel: "/k/ → /ng/" },
      { surfaceStart: "peng", restoredConsonant: "k", pattern: "peN-", phonemeLabel: "/k/ → /ng/" },
      { surfaceStart: "mem", restoredConsonant: "p", pattern: "meN-", phonemeLabel: "/p/ → /m/" },
      { surfaceStart: "pem", restoredConsonant: "p", pattern: "peN-", phonemeLabel: "/p/ → /m/" },
      { surfaceStart: "men", restoredConsonant: "t", pattern: "meN-", phonemeLabel: "/t/ → /n/" },
      { surfaceStart: "pen", restoredConsonant: "t", pattern: "peN-", phonemeLabel: "/t/ → /n/" },
    ];

    for (const rule of nasalRules) {
      if (surface.startsWith(rule.surfaceStart)) {
        const candidateRoot =
          rule.restoredConsonant + surface.slice(rule.surfaceStart.length);
        if (isRootVerified(candidateRoot)) {
          return {
            root: candidateRoot,
            prefixPattern: rule.pattern,
            noteMs: `Peluluhan konsonan awal ${rule.phonemeLabel} apabila menerima imbuhan ${rule.pattern} pada kata dasar '${candidateRoot}'.`,
            noteEn: `Nasal substitution ${rule.phonemeLabel} when affix ${rule.pattern} attaches to root '${candidateRoot}'.`,
          };
        }
      }
    }

    return null;
  };

  // 3. Check Apitan (Circumfixes: prefix + suffix -kan / -an / -i)
  const suffixes = ["kan", "an", "i"] as const;
  for (const suf of suffixes) {
    if (word.endsWith(suf) && word.length > suf.length + 3) {
      const withoutSuffix = word.slice(0, -suf.length);
      const prefMatch = matchPrefixCandidates(withoutSuffix);
      if (prefMatch) {
        const apitanPattern = `${prefMatch.prefixPattern}...-${suf}`;
        return {
          input: word,
          possibleKataDasar: prefMatch.root,
          affixType: "apitan",
          affixPattern: apitanPattern,
          morphophonemicNote: prefMatch.noteMs,
          explanationMs: `'${word}' ialah kata terbitan berapitan (${apitanPattern}) daripada kata dasar '${prefMatch.root}'.${
            prefMatch.noteMs ? " " + prefMatch.noteMs : ""
          }`,
          explanationEn: `'${word}' is a derived form with circumfix (${apitanPattern}) from the root word '${prefMatch.root}'.${
            prefMatch.noteEn ? " " + prefMatch.noteEn : ""
          }`,
          verifiedEntryExists: true,
        };
      }
    }
  }

  // 4. Check Akhiran (Suffixes: -kan, -an, -i) on a verified root
  for (const suf of suffixes) {
    if (word.endsWith(suf) && word.length > suf.length + 2) {
      const candidateRoot = word.slice(0, -suf.length);
      if (isRootVerified(candidateRoot)) {
        return {
          input: word,
          possibleKataDasar: candidateRoot,
          affixType: "akhiran",
          affixPattern: `-${suf}`,
          explanationMs: `'${word}' ialah kata terbitan berakhiran (-${suf}) daripada kata dasar '${candidateRoot}'.`,
          explanationEn: `'${word}' is a derived word formed by adding suffix (-${suf}) to the root word '${candidateRoot}'.`,
          verifiedEntryExists: true,
        };
      }
    }
  }

  // 5. Check Awalan (Prefixes) on a verified root
  const onlyPrefix = matchPrefixCandidates(word);
  if (onlyPrefix) {
    return {
      input: word,
      possibleKataDasar: onlyPrefix.root,
      affixType: "awalan",
      affixPattern: onlyPrefix.prefixPattern,
      morphophonemicNote: onlyPrefix.noteMs,
      explanationMs: `'${word}' ialah kata terbitan berawalan (${onlyPrefix.prefixPattern}) daripada kata dasar '${onlyPrefix.root}'.${
        onlyPrefix.noteMs ? " " + onlyPrefix.noteMs : ""
      }`,
      explanationEn: `'${word}' is a derived word formed with prefix (${onlyPrefix.prefixPattern}) from root '${onlyPrefix.root}'.${
        onlyPrefix.noteEn ? " " + onlyPrefix.noteEn : ""
      }`,
      verifiedEntryExists: true,
    };
  }

  return null;
}
