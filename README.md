# Vynalth Lexicon (`mus`)

**Vynalth Lexicon** is a production-ready multilingual dictionary, sense-aligned translator, Bahasa Melayu morphological reference, and interactive language-learning web platform built with **Next.js App Router**, **React 19**, **TypeScript (strict mode)**, **Tailwind CSS**, and **PostgreSQL / Drizzle ORM**.

---

## 1. Product Capabilities

- **Multilingual Dictionary & Sense-Aligned Translation:**
  - Look up verified headwords across 12 languages with definitions separated by numbered sense, sense-specific translations, IPA transcriptions, romanizations (Pinyin, Hepburn Romaji, Revised Romanization, RTGS, ALA-LC Arabic), synonyms, antonyms, word forms, and authentic example sentences.
- **Bahasa Melayu Linguistic Excellence:**
  - Structured grammatical and morphological breakdowns for:
    - **Kata Dasar** (Root words: e.g., `makan`, `ajar`, `tulis`, `tapak`, `air`, `bahasa`, `ilmu`)
    - **Kata Terbitan** (Derived words: e.g., `makanan`, `memakan`, `termakan`, `belajar`, `pelajar`, `mengajar`, `pengajaran`, `menulis`, `penulis`, `tulisan`, `telapak`)
    - **Imbuhan:** *Awalan* (`meN-`, `beR-`, `teR-`, `peN-`), *Akhiran* (`-an`, `-kan`, `-i`), *Apitan* (`peN-...-an`, `ke-...-an`, `meN-...-kan`), and *Sisipan* (`-el-`, `-em-`, `-er-`, `-in-`)
    - **Hukum Morfofonemik:** Explicit explanations of nasal substitution (*peluluhan konsonan sengau*: `/p/ → /m/`, `/t/ → /n/`, `/k/ → /ng/`, `/s/ → /ny/`) and special allomorphs (`bel-`, `pel-`)
    - **Golongan Kata:** *Kata Nama*, *Kata Kerja*, *Kata Adjektif*, *Kata Sendi Nama* (`daripada`)
    - **Peribahasa & Simpulan Bahasa:** Cultural proverbs (`bagai aur dengan tebing`) and idioms (`buah tangan`, `ulat buku`)
    - **Penjodoh Bilangan:** Numeral classifiers (`sebuah`, `sehelai`) with compatible noun classes and examples
- **Core Search Engine:**
  - Exact matching, case-insensitive matching, Unicode NFC normalization, diacritic-insensitive matching (`cafe` → `café`, `espanol` → `español`, `worterbuch` → `Wörterbuch`), Arabic *tashkeel* stripping (`علم` → `عِلْم`), Pinyin/Romaji lookup (`xuexi` → `学习`, `taberu` → `食べる`), prefix matching, Malay root-word resolution, and bounded Damerau-Levenshtein typo-tolerant suggestions.
  - Real measured query latency (`performance.now()`).
- **Pronunciation:**
  - IPA phonetic display + Web Speech API synthesis with automatic locale voice matching and transparent disclosure (*"Synthesized via Web Speech API — not a native speaker recording"*).
- **Language Learning Studio (`/learn`) & Favorites (`/favorites`):**
  - Interactive flashcards, multiple-choice vocabulary & morphology quizzes, curated study collections, and persistent `localStorage` favorites with personal study notes and JSON export.
- **Database-Optional Deployment Resilience:**
  - Connects to PostgreSQL via Drizzle ORM when `DATABASE_URL` is configured, and automatically falls back to the bundled 49-entry verified Wiktionary/Wiktextract starter dataset in read-only mode when `DATABASE_URL` is omitted or unreachable.

---

## 2. Supported Languages & Coverage

### Interface Localization (`src/lib/i18n.ts`)
- **English (`en`)**
- **Bahasa Melayu (`ms`)**
- **Simplified Chinese (`zh-Hans`)**

### Dictionary Language Registry (`src/lib/languages.ts`)
| Language | Code | Script / Direction | Verified Starter Entries |
| :--- | :--- | :--- | ---: |
| Bahasa Melayu | `ms` | Latin (Rumi) · LTR | 25 |
| English | `en` | Latin · LTR | 8 |
| Simplified Chinese | `zh-Hans` | Simplified Han (汉字) · LTR | 4 |
| Traditional Chinese | `zh-Hant` | Traditional Han (正體字) · LTR | 1 |
| Indonesian | `id` | Latin · LTR | 2 |
| Japanese | `ja` | Kanji / Kana · LTR | 2 |
| Korean | `ko` | Hangul (한글) · LTR | 1 |
| Thai | `th` | Thai (อักษรไทย) · LTR | 1 |
| Arabic | `ar` | Arabic · **RTL** | 2 |
| Spanish | `es` | Latin · LTR | 1 |
| French | `fr` | Latin · LTR | 1 |
| German | `de` | Latin · LTR | 1 |
| **Total Starter Corpus** | **12 Languages** | **54 Senses · 512 Sense Translations** | **49** |

---

## 3. Reproducible Wiktionary / Wiktextract Import Pipeline

Lexical entries are sourced from [Kaikki.org](https://kaikki.org/dictionary/) and [Wiktionary](https://en.wiktionary.org/) under **CC BY-SA 4.0 / GFDL**.

```bash
# 1. Dry-run stream validation on the sample JSONL fixture
npm run import:wiktextract -- --dry-run

# 2. Selective import by language from a local Wiktextract JSONL file
npm run import:wiktextract -- --input /path/to/kaikki.jsonl --lang ms,en,zh-Hans --version wiktextract-2026-10

# 3. Push PostgreSQL schema & indexes via Drizzle Kit
npm run db:push
```

---

## 4. API Endpoints

- `GET /api/search?q=<query>&source=<lang|all>&target=<lang|all>&pos=<pos|all>&category=<cat|all>&limit=<1..100>`
- `GET /api/words/[language]/[word]`
- `GET /api/languages`
- `GET /api/suggestions?q=<query>&lang=<lang|all>&limit=<1..20>`
- `GET /api/health`

---

## 5. Development, Testing & Deployment

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run strict TypeScript check
npm run typecheck

# Run Vitest unit & API tests
npm test

# Build production bundle
npm run build

# Run Playwright E2E browser tests across Desktop (1440x900, 1920x1080) & Mobile (390x844, 375x667)
npm run test:e2e
```

### Vercel Deployment
1. Connect the GitHub repository (`vyncuslim/mus`) to **Vercel** (Framework Preset: **Next.js**).
2. *(Optional)* Configure `DATABASE_URL` in Vercel Project Settings → Environment Variables to connect a PostgreSQL database, or leave it unset to deploy immediately in Read-Only Verified Starter Lexicon mode.
3. Set `NEXT_PUBLIC_SITE_URL` to your production domain.
