import type { UiLocale } from "@/types/lexicon";

/**
 * Target choices use ISO/RFC-style language tags. Availability and translation
 * quality for any pair depend on the third-party provider.
 */
export const DEFINITION_LANGUAGES = [
  ["en", "English"], ["zh-CN", "简体中文"], ["zh-TW", "繁體中文"], ["ms-MY", "Bahasa Melayu"],
  ["id-ID", "Bahasa Indonesia"], ["ar-SA", "العربية"], ["ja-JP", "日本語"], ["ko-KR", "한국어"],
  ["es-ES", "Español"], ["fr-FR", "Français"], ["de-DE", "Deutsch"], ["pt-PT", "Português"],
  ["it-IT", "Italiano"], ["ru-RU", "Русский"], ["hi-IN", "हिन्दी"], ["ta-IN", "தமிழ்"],
  ["th-TH", "ไทย"], ["vi-VN", "Tiếng Việt"], ["tr-TR", "Türkçe"], ["bn-IN", "বাংলা"],
  ["ur-PK", "اردو"], ["fa-IR", "فارسی"], ["af-ZA", "Afrikaans"], ["sq-AL", "Shqip"],
  ["am-ET", "አማርኛ"], ["hy-AM", "Հայերեն"], ["az-AZ", "Azərbaycanca"], ["eu-ES", "Euskara"],
  ["be-BY", "Беларуская"], ["bs-BA", "Bosanski"], ["bg-BG", "Български"], ["my-MM", "မြန်မာဘာသာ"],
  ["ca-ES", "Català"], ["ceb-PH", "Cebuano"], ["hr-HR", "Hrvatski"], ["cs-CZ", "Čeština"],
  ["da-DK", "Dansk"], ["nl-NL", "Nederlands"], ["eo-EU", "Esperanto"], ["et-EE", "Eesti"],
  ["fi-FI", "Suomi"], ["gl-ES", "Galego"], ["ka-GE", "ქართული"], ["el-GR", "Ελληνικά"],
  ["gu-IN", "ગુજરાતી"], ["ht-HT", "Kreyòl ayisyen"], ["ha-NE", "Hausa"], ["haw-US", "ʻŌlelo Hawaiʻi"],
  ["he-IL", "עברית"], ["hu-HU", "Magyar"], ["is-IS", "Íslenska"], ["ga-IE", "Gaeilge"],
  ["jv-ID", "Basa Jawa"], ["kn-IN", "ಕನ್ನಡ"], ["kk-KZ", "Қазақша"], ["km-KH", "ខ្មែរ"],
  ["rw-RW", "Ikinyarwanda"], ["ku-TR", "Kurdî"], ["ky-KG", "Кыргызча"], ["lo-LA", "ລາວ"],
  ["la-VA", "Latina"], ["lv-LV", "Latviešu"], ["lt-LT", "Lietuvių"], ["lb-LU", "Lëtzebuergesch"],
  ["mk-MK", "Македонски"], ["mg-MG", "Malagasy"], ["ml-IN", "മലയാളം"], ["mt-MT", "Malti"],
  ["mi-NZ", "Te reo Māori"], ["mr-IN", "मराठी"], ["mn-MN", "Монгол"], ["ne-NP", "नेपाली"],
  ["no-NO", "Norsk"], ["ps-PK", "پښتو"], ["pl-PL", "Polski"], ["pa-IN", "ਪੰਜਾਬੀ"],
  ["ro-RO", "Română"], ["sr-RS", "Српски"], ["si-LK", "සිංහල"], ["sk-SK", "Slovenčina"],
  ["sl-SI", "Slovenščina"], ["so-SO", "Soomaali"], ["sw-KE", "Kiswahili"], ["sv-SE", "Svenska"],
  ["tl-PH", "Tagalog"], ["te-IN", "తెలుగు"], ["uk-UA", "Українська"], ["uz-UZ", "Oʻzbekcha"],
  ["cy-GB", "Cymraeg"], ["xh-ZA", "isiXhosa"], ["yo-NG", "Yorùbá"], ["zu-ZA", "isiZulu"],
] as const;

export type DefinitionLanguage = typeof DEFINITION_LANGUAGES[number][0];
export function isDefinitionLanguage(value: string): value is DefinitionLanguage {
  return DEFINITION_LANGUAGES.some(([code]) => code === value);
}
export function defaultDefinitionLanguage(locale: UiLocale): DefinitionLanguage {
  return locale === "zh-Hans" ? "zh-CN" : locale === "ms" ? "ms-MY" : "en";
}
export function definitionLanguageLabel(code: DefinitionLanguage, locale: UiLocale): string {
  const native = DEFINITION_LANGUAGES.find(([item]) => item === code)?.[1] ?? code;
  if (code === "en") return locale === "zh-Hans" ? "英语（原文）" : locale === "ms" ? "Bahasa Inggeris (asal)" : "English (original)";
  const lookup = code === "zh-CN" ? "zh-Hans" : code === "zh-TW" ? "zh-Hant" : code.split("-")[0];
  try {
    const name = new Intl.DisplayNames([locale], { type: "language" }).of(lookup);
    return name && name !== lookup && name.toLocaleLowerCase(locale) !== native.toLocaleLowerCase(locale) ? `${name} · ${native}` : native;
  } catch { return native; }
}
