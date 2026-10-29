import type { LanguageCode, LanguageMetadata, UiLocale } from "@/types/lexicon";

export const SUPPORTED_LANGUAGE_CODES: readonly LanguageCode[] = [
  "ms",
  "en",
  "zh-Hans",
  "zh-Hant",
  "id",
  "ja",
  "ko",
  "th",
  "ar",
  "es",
  "fr",
  "de",
] as const;

export const SUPPORTED_UI_LOCALES: readonly UiLocale[] = [
  "en",
  "ms",
  "zh-Hans",
] as const;

export const LANGUAGE_REGISTRY: Record<LanguageCode, LanguageMetadata> = {
  ms: {
    code: "ms",
    bcp47: "ms-MY",
    speechLocale: "ms-MY",
    englishName: "Bahasa Melayu",
    nativeName: "Bahasa Melayu",
    localizedNames: {
      en: "Bahasa Melayu (Malay)",
      ms: "Bahasa Melayu",
      "zh-Hans": "马来语 (Bahasa Melayu)",
    },
    script: "Latin (Rumi)",
    direction: "ltr",
    fontClass: "font-sans",
    flagCode: "MY",
    regionLabel: "Malaysia / Nusantara",
    uiSupported: true,
    coverageNote: {
      en: "Primary coverage with Kata Dasar, Kata Terbitan, Imbuhan, Peribahasa, Simpulan Bahasa, and Penjodoh Bilangan analysis.",
      ms: "Liputan utama lengkap dengan analisis Kata Dasar, Kata Terbitan, Imbuhan, Peribahasa, Simpulan Bahasa, dan Penjodoh Bilangan.",
      "zh-Hans": "核心词库支持，包含词根 (Kata Dasar)、派生词、词缀、谚语、习语及量词解析。",
    },
  },
  en: {
    code: "en",
    bcp47: "en-US",
    speechLocale: "en-US",
    englishName: "English",
    nativeName: "English",
    localizedNames: {
      en: "English",
      ms: "Bahasa Inggeris",
      "zh-Hans": "英语 (English)",
    },
    script: "Latin",
    direction: "ltr",
    fontClass: "font-sans",
    flagCode: "GB",
    regionLabel: "International",
    uiSupported: true,
    coverageNote: {
      en: "Primary coverage with IPA phonetics, multi-sense definitions, examples, and cross-lingual sense translations.",
      ms: "Liputan utama dengan fonetik IPA, takrifan pelbagai makna, ayat contoh, dan terjemahan rentas bahasa.",
      "zh-Hans": "核心词库支持，包含国际音标 (IPA)、多义项释义、例句与多语种对译。",
    },
  },
  "zh-Hans": {
    code: "zh-Hans",
    bcp47: "zh-CN",
    speechLocale: "zh-CN",
    englishName: "Simplified Chinese",
    nativeName: "简体中文",
    localizedNames: {
      en: "Simplified Chinese",
      ms: "Bahasa Cina Ringkas",
      "zh-Hans": "简体中文",
    },
    script: "Simplified Han (汉字)",
    direction: "ltr",
    fontClass: "font-sans",
    flagCode: "CN",
    regionLabel: "Mainland China / Singapore / Malaysia",
    uiSupported: true,
    coverageNote: {
      en: "Core starter entries with Hanyu Pinyin romanization, IPA, character breakdown, and Malay/English sense mappings.",
      ms: "Entri permulaan teras dengan perumian Hanyu Pinyin, IPA, dan pemetaan makna Bahasa Melayu/Inggeris.",
      "zh-Hans": "包含汉语拼音、国际音标、多义项释义及中英马双语对照。",
    },
  },
  "zh-Hant": {
    code: "zh-Hant",
    bcp47: "zh-TW",
    speechLocale: "zh-TW",
    englishName: "Traditional Chinese",
    nativeName: "繁體中文",
    localizedNames: {
      en: "Traditional Chinese",
      ms: "Bahasa Cina Tradisional",
      "zh-Hans": "繁体中文",
    },
    script: "Traditional Han (正體字)",
    direction: "ltr",
    fontClass: "font-sans",
    flagCode: "TW",
    regionLabel: "Taiwan / Hong Kong / Macau",
    uiSupported: false,
    coverageNote: {
      en: "Verified starter lexical coverage with Pinyin romanization and cross-reference to Simplified forms.",
      ms: "Liputan leksikal permulaan yang disahkan dengan perumian Pinyin dan rujukan silang aksara ringkas.",
      "zh-Hans": "已验证传统汉字词条，附带拼音与简体字对照。",
    },
  },
  id: {
    code: "id",
    bcp47: "id-ID",
    speechLocale: "id-ID",
    englishName: "Indonesian",
    nativeName: "Bahasa Indonesia",
    localizedNames: {
      en: "Indonesian",
      ms: "Bahasa Indonesia",
      "zh-Hans": "印度尼西亚语",
    },
    script: "Latin",
    direction: "ltr",
    fontClass: "font-sans",
    flagCode: "ID",
    regionLabel: "Indonesia",
    uiSupported: false,
    coverageNote: {
      en: "Verified starter entries highlighting cognate and semantic distinctions between Bahasa Indonesia and Bahasa Melayu.",
      ms: "Entri permulaan yang disahkan dengan perbandingan kognat dan nuansa makna antara Bahasa Indonesia dan Bahasa Melayu.",
      "zh-Hans": "已验证印尼语词条，重点标注与马来语的同源词及语义差异。",
    },
  },
  ja: {
    code: "ja",
    bcp47: "ja-JP",
    speechLocale: "ja-JP",
    englishName: "Japanese",
    nativeName: "日本語",
    localizedNames: {
      en: "Japanese",
      ms: "Bahasa Jepun",
      "zh-Hans": "日语 (日本語)",
    },
    script: "Kanji / Hiragana / Katakana",
    direction: "ltr",
    fontClass: "font-sans",
    flagCode: "JP",
    regionLabel: "Japan",
    uiSupported: false,
    coverageNote: {
      en: "Starter lexical coverage with Kana readings, Hepburn Romaji, IPA, and multilingual translations.",
      ms: "Liputan leksikal permulaan dengan bacaan Kana, Romaji Hepburn, IPA, dan terjemahan pelbagai bahasa.",
      "zh-Hans": "包含日文汉字、假名读音、罗马音及多语种释义。",
    },
  },
  ko: {
    code: "ko",
    bcp47: "ko-KR",
    speechLocale: "ko-KR",
    englishName: "Korean",
    nativeName: "한국어",
    localizedNames: {
      en: "Korean",
      ms: "Bahasa Korea",
      "zh-Hans": "韩语 (한국어)",
    },
    script: "Hangul (한글)",
    direction: "ltr",
    fontClass: "font-sans",
    flagCode: "KR",
    regionLabel: "Korea",
    uiSupported: false,
    coverageNote: {
      en: "Starter lexical coverage with Hangul headwords, Revised Romanization, IPA, and sense translations.",
      ms: "Liputan leksikal permulaan dengan kata kepala Hangul, Perumian Semakan, IPA, dan terjemahan makna.",
      "zh-Hans": "包含韩文谚文词头、修正罗马音、音标及释义。",
    },
  },
  th: {
    code: "th",
    bcp47: "th-TH",
    speechLocale: "th-TH",
    englishName: "Thai",
    nativeName: "ภาษาไทย",
    localizedNames: {
      en: "Thai",
      ms: "Bahasa Thai",
      "zh-Hans": "泰语 (ภาษาไทย)",
    },
    script: "Thai (อักษรไทย)",
    direction: "ltr",
    fontClass: "font-sans",
    flagCode: "TH",
    regionLabel: "Thailand",
    uiSupported: false,
    coverageNote: {
      en: "Starter lexical coverage with Thai script, Royal Thai General System of Transcription (RTGS), and IPA.",
      ms: "Liputan leksikal permulaan dengan aksara Thai, transkripsi RTGS, dan IPA.",
      "zh-Hans": "包含泰文词条、皇家泰语转写系统 (RTGS) 读音与释义。",
    },
  },
  ar: {
    code: "ar",
    bcp47: "ar-SA",
    speechLocale: "ar-SA",
    englishName: "Arabic",
    nativeName: "العربية",
    localizedNames: {
      en: "Arabic",
      ms: "Bahasa Arab",
      "zh-Hans": "阿拉伯语 (العربية)",
    },
    script: "Arabic (Right-to-Left)",
    direction: "rtl",
    fontClass: "font-sans",
    flagCode: "SA",
    regionLabel: "Middle East / North Africa",
    uiSupported: false,
    coverageNote: {
      en: "Starter lexical coverage with RTL script rendering, vocalized/unvocalized search, and Arabic loanword links to Malay.",
      ms: "Liputan leksikal permulaan dengan paparan RTL, carian tanpa baris, dan pautan kata pinjaman Bahasa Melayu.",
      "zh-Hans": "支持从右向左 (RTL) 排版、去音符检索及与马来语借词的词源关联。",
    },
  },
  es: {
    code: "es",
    bcp47: "es-ES",
    speechLocale: "es-ES",
    englishName: "Spanish",
    nativeName: "Español",
    localizedNames: {
      en: "Spanish",
      ms: "Bahasa Sepanyol",
      "zh-Hans": "西班牙语 (Español)",
    },
    script: "Latin",
    direction: "ltr",
    fontClass: "font-sans",
    flagCode: "ES",
    regionLabel: "Spain / Latin America",
    uiSupported: false,
    coverageNote: {
      en: "Starter lexical coverage with diacritic-aware search, grammatical gender metadata, and IPA.",
      ms: "Liputan leksikal permulaan dengan carian peka diakritik, metadata gender tatabahasa, dan IPA.",
      "zh-Hans": "支持忽略重音符号搜索、词性性别标注与国际音标。",
    },
  },
  fr: {
    code: "fr",
    bcp47: "fr-FR",
    speechLocale: "fr-FR",
    englishName: "French",
    nativeName: "Français",
    localizedNames: {
      en: "French",
      ms: "Bahasa Perancis",
      "zh-Hans": "法语 (Français)",
    },
    script: "Latin",
    direction: "ltr",
    fontClass: "font-sans",
    flagCode: "FR",
    regionLabel: "France / Francophonie",
    uiSupported: false,
    coverageNote: {
      en: "Starter lexical coverage with diacritic-tolerant lookup, IPA phonetics, and multilingual sense mappings.",
      ms: "Liputan leksikal permulaan dengan carian peka diakritik, fonetik IPA, dan pemetaan makna.",
      "zh-Hans": "支持法语变音符号检索、国际音标及多语种释义。",
    },
  },
  de: {
    code: "de",
    bcp47: "de-DE",
    speechLocale: "de-DE",
    englishName: "German",
    nativeName: "Deutsch",
    localizedNames: {
      en: "German",
      ms: "Bahasa Jerman",
      "zh-Hans": "德语 (Deutsch)",
    },
    script: "Latin",
    direction: "ltr",
    fontClass: "font-sans",
    flagCode: "DE",
    regionLabel: "Germany / DACH",
    uiSupported: false,
    coverageNote: {
      en: "Starter lexical coverage with noun capitalization/plural forms, umlaut normalization, and IPA.",
      ms: "Liputan leksikal permulaan dengan bentuk jamak kata nama, normalisasi umlaut, dan IPA.",
      "zh-Hans": "支持德语变音字母检索、名词格与复数形式及音标。",
    },
  },
};

export function isValidLanguageCode(code: string): code is LanguageCode {
  return SUPPORTED_LANGUAGE_CODES.includes(code as LanguageCode);
}

export function isValidUiLocale(locale: string): locale is UiLocale {
  return SUPPORTED_UI_LOCALES.includes(locale as UiLocale);
}

export function getLanguageMetadata(code: LanguageCode): LanguageMetadata {
  return LANGUAGE_REGISTRY[code];
}

export function getAllLanguages(): LanguageMetadata[] {
  return SUPPORTED_LANGUAGE_CODES.map((code) => LANGUAGE_REGISTRY[code]);
}

export function getLanguageDisplayName(
  code: LanguageCode | "all",
  uiLocale: UiLocale = "en"
): string {
  if (code === "all") {
    if (uiLocale === "ms") return "Semua Bahasa";
    if (uiLocale === "zh-Hans") return "所有语言";
    return "All Languages";
  }
  const meta = LANGUAGE_REGISTRY[code];
  return meta ? meta.localizedNames[uiLocale] || meta.englishName : code;
}
