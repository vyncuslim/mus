export interface WorldLanguage { code: string; name: string; native: string; rtl?: boolean }
export interface WorldTranslationMatch { word: string; language: WorldLanguage; english: string; romanization?: string; sourceUrl: string }
export interface WorldIndexSearchResult { query: string; matches: WorldTranslationMatch[]; totalMatches: number; suggestions: string[]; coverage: { languages: number; translationPairs: number; sourceVersion: string } }
