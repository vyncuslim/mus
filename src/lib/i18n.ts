import type {
  MalayAffixType,
  MalayGolonganKata,
  MalayMorphologyType,
  PartOfSpeech,
  UiLocale,
} from "@/types/lexicon";

export interface UiDictionary {
  brand: {
    name: string;
    tagline: string;
    subtitle: string;
  };
  nav: {
    home: string;
    dictionary: string;
    learn: string;
    favorites: string;
    about: string;
    sources: string;
    uiLanguage: string;
    darkMode: string;
    lightMode: string;
  };
  search: {
    placeholder: string;
    sourceLanguage: string;
    targetLanguage: string;
    swapLanguages: string;
    searchButton: string;
    clearSearch: string;
    recentSearches: string;
    clearHistory: string;
    allLanguages: string;
    allPartsOfSpeech: string;
    allCategories: string;
    exactMatches: string;
    prefixMatches: string;
    relatedMatches: string;
    didYouMean: string;
    noResultsTitle: string;
    noResultsDescription: string;
    latencyLabel: string;
    resultsFound: string;
    starterDatasetBadge: string;
  };
  home: {
    heroBadge: string;
    heroTitle: string;
    heroDescription: string;
    featuredWordsTitle: string;
    featuredWordsSubtitle: string;
    malayExcellenceTitle: string;
    malayExcellenceSubtitle: string;
    quickSectionsTitle: string;
    coverageTransparencyTitle: string;
    verifiedEntriesLabel: string;
    supportedLanguagesLabel: string;
    licenseLabel: string;
  };
  wordDetail: {
    pronunciation: string;
    listenBrowserTts: string;
    stopAudio: string;
    ttsDisclaimer: string;
    ttsUnavailable: string;
    saveFavorite: string;
    savedFavorite: string;
    copyWord: string;
    copied: string;
    shareUrl: string;
    sensePrefix: string;
    translationsHeading: string;
    noVerifiedTranslation: string;
    examplesHeading: string;
    synonymsHeading: string;
    antonymsHeading: string;
    wordFormsHeading: string;
    etymologyHeading: string;
    grammarNoteHeading: string;
    malayMorphologyHeading: string;
    kataDasarLabel: string;
    golonganKataLabel: string;
    affixTypeLabel: string;
    formulaLabel: string;
    morphophonemicRuleLabel: string;
    derivedWordsLabel: string;
    classifierUsageLabel: string;
    literalMeaningLabel: string;
    provenanceHeading: string;
    sourceDatasetLabel: string;
    licenseNoticeLabel: string;
    importedVersionLabel: string;
    aiExplanationTitle: string;
    aiExplanationButton: string;
    aiExplanationDisclaimer: string;
  };
  learn: {
    title: string;
    subtitle: string;
    flashcardsTab: string;
    quizTab: string;
    collectionsTab: string;
    flipCard: string;
    markKnown: string;
    markLearning: string;
    nextCard: string;
    prevCard: string;
    startQuiz: string;
    submitAnswer: string;
    nextQuestion: string;
    quizScore: string;
    masteredCount: string;
  };
  favorites: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyDescription: string;
    remove: string;
    clearAll: string;
    exportJson: string;
    savedAt: string;
  };
}

export const UI_TRANSLATIONS: Record<UiLocale, UiDictionary> = {
  en: {
    brand: {
      name: "Vynalth Lexicon",
      tagline: "Precision Multilingual Dictionary & Malay Morphological Reference",
      subtitle:
        "Sense-aligned translations, verified Wiktionary/Wiktextract lexical records, IPA phonetics, and deep Bahasa Melayu root-word analysis.",
    },
    nav: {
      home: "Home",
      dictionary: "Dictionary",
      learn: "Learn",
      favorites: "Favorites",
      about: "About",
      sources: "Sources",
      uiLanguage: "Interface Language",
      darkMode: "Dark theme",
      lightMode: "Light theme",
    },
    search: {
      placeholder:
        "Search a word, kata dasar, Pinyin, Romaji, or phrase (e.g. makanan, makan, serendipity, 学习, 水)...",
      sourceLanguage: "Source language",
      targetLanguage: "Target language",
      swapLanguages: "Swap source and target languages",
      searchButton: "Search",
      clearSearch: "Clear search query",
      recentSearches: "Recent searches",
      clearHistory: "Clear history",
      allLanguages: "All Languages",
      allPartsOfSpeech: "All Parts of Speech",
      allCategories: "All Categories",
      exactMatches: "Exact Lexical Matches",
      prefixMatches: "Prefix & Morphological Matches",
      relatedMatches: "Sense Translation & Related Matches",
      didYouMean: "Typo-tolerant suggestions",
      noResultsTitle: "No verified dictionary entry found",
      noResultsDescription:
        "Vynalth Lexicon never fabricates entries. Try selecting 'All Languages', checking your spelling, or searching by root word (kata dasar).",
      latencyLabel: "Query time",
      resultsFound: "verified entries matched",
      starterDatasetBadge: "Verified Starter Lexicon (Read-Only Mode)",
    },
    home: {
      heroBadge: "Open-Source Verified Lexical Platform · CC BY-SA 4.0",
      heroTitle: "Clarity across languages, down to the root word.",
      heroDescription:
        "Look up verified definitions, sense-by-sense translations, IPA pronunciations, and authentic Bahasa Melayu morphology (Kata Dasar, Imbuhan, Peribahasa & Penjodoh Bilangan).",
      featuredWordsTitle: "Featured & High-Utility Entries",
      featuredWordsSubtitle:
        "Explore real dictionary records with multi-sense translations and morphological breakdowns.",
      malayExcellenceTitle: "Bahasa Melayu Linguistic Excellence",
      malayExcellenceSubtitle:
        "Structured grammatical analysis for Kata Dasar, Kata Terbitan, Awalan, Akhiran, Apitan, Sisipan, Peribahasa, Simpulan Bahasa, and Penjodoh Bilangan.",
      quickSectionsTitle: "Explore by Lexical Category",
      coverageTransparencyTitle: "Live Dataset Coverage & Provenance",
      verifiedEntriesLabel: "Verified Headwords",
      supportedLanguagesLabel: "Indexed Languages",
      licenseLabel: "Data License",
    },
    wordDetail: {
      pronunciation: "Pronunciation",
      listenBrowserTts: "Listen (Browser Speech)",
      stopAudio: "Stop playback",
      ttsDisclaimer:
        "Synthesized via Web Speech API using your browser's locale voice — not a native speaker recording.",
      ttsUnavailable: "Speech synthesis is unavailable for this locale on your device.",
      saveFavorite: "Save to Favorites",
      savedFavorite: "Saved in Favorites",
      copyWord: "Copy headword",
      copied: "Copied",
      shareUrl: "Share link",
      sensePrefix: "Sense",
      translationsHeading: "Sense-Aligned Translations",
      noVerifiedTranslation:
        "No verified translation recorded for the selected target language in this sense.",
      examplesHeading: "Authentic Example Sentences",
      synonymsHeading: "Synonyms",
      antonymsHeading: "Antonyms",
      wordFormsHeading: "Inflections & Word Forms",
      etymologyHeading: "Etymology & Historical Origin",
      grammarNoteHeading: "Grammar & Usage Notes",
      malayMorphologyHeading: "Malay Morphological & Root Analysis (Tatabahasa Melayu)",
      kataDasarLabel: "Kata Dasar (Root Word)",
      golonganKataLabel: "Golongan Kata (Word Class)",
      affixTypeLabel: "Jenis Imbuhan (Affixation)",
      formulaLabel: "Morphological Formula",
      morphophonemicRuleLabel: "Morphophonemic Rule (Hukum Morfofonemik)",
      derivedWordsLabel: "Verified Derived & Related Forms (Kata Terbitan)",
      classifierUsageLabel: "Penjodoh Bilangan (Classifier Pairing)",
      literalMeaningLabel: "Literal Meaning",
      provenanceHeading: "Source Attribution & License",
      sourceDatasetLabel: "Primary Source",
      licenseNoticeLabel: "License",
      importedVersionLabel: "Snapshot Version",
      aiExplanationTitle: "Optional AI-Assisted Linguistic Study Note",
      aiExplanationButton: "Show AI Study Note",
      aiExplanationDisclaimer:
        "AI-Assisted Note — Generated for study context only. This section is NOT a verified dictionary record.",
    },
    learn: {
      title: "Language Learning Studio",
      subtitle:
        "Review saved vocabulary, practice Malay root-to-derivative morphology, and test yourself with sense-accurate flashcards and quizzes.",
      flashcardsTab: "Interactive Flashcards",
      quizTab: "Vocabulary & Morphology Quiz",
      collectionsTab: "Curated Collections",
      flipCard: "Flip card",
      markKnown: "Mastered",
      markLearning: "Still learning",
      nextCard: "Next card",
      prevCard: "Previous card",
      startQuiz: "Start New Quiz",
      submitAnswer: "Check Answer",
      nextQuestion: "Next Question",
      quizScore: "Current Score",
      masteredCount: "Words Mastered Locally",
    },
    favorites: {
      title: "Saved Favorites",
      subtitle:
        "Your personal lexicon stored privately in your browser's local storage — no account required.",
      emptyTitle: "No saved words yet",
      emptyDescription:
        "Bookmark any dictionary entry while browsing to build your personal study list and review deck.",
      remove: "Remove",
      clearAll: "Clear all favorites",
      exportJson: "Export JSON",
      savedAt: "Saved on",
    },
  },
  ms: {
    brand: {
      name: "Vynalth Lexicon",
      tagline: "Kamus Pelbagai Bahasa & Rujukan Morfologi Bahasa Melayu",
      subtitle:
        "Terjemahan mengikut deria makna, rekod leksikal Wiktionary/Wiktextract yang disahkan, fonetik IPA, serta analisis mendalam Kata Dasar Bahasa Melayu.",
    },
    nav: {
      home: "Utama",
      dictionary: "Kamus",
      learn: "Belajar",
      favorites: "Kegemaran",
      about: "Perihal",
      sources: "Sumber Data",
      uiLanguage: "Bahasa Antara Muka",
      darkMode: "Mod gelap",
      lightMode: "Mod cerah",
    },
    search: {
      placeholder:
        "Cari perkataan, kata dasar, Pinyin, Romaji, atau peribahasa (cth. makanan, makan, serendipity, 学习, 水)...",
      sourceLanguage: "Bahasa sumber",
      targetLanguage: "Bahasa sasaran",
      swapLanguages: "Tukar bahasa sumber dan sasaran",
      searchButton: "Cari",
      clearSearch: "Padam carian",
      recentSearches: "Carian terkini",
      clearHistory: "Padam sejarah",
      allLanguages: "Semua Bahasa",
      allPartsOfSpeech: "Semua Golongan Kata",
      allCategories: "Semua Kategori",
      exactMatches: "Padanan Leksikal Tepat",
      prefixMatches: "Padanan Awalan & Morfologi",
      relatedMatches: "Padanan Terjemahan & Berkaitan",
      didYouMean: "Cadangan ejaan terdekat",
      noResultsTitle: "Tiada entri kamus yang disahkan ditemui",
      noResultsDescription:
        "Vynalth Lexicon tidak mereka-reka entri palsu. Cuba pilih 'Semua Bahasa', semak ejaan, atau cari mengikut kata dasar.",
      latencyLabel: "Masa carian",
      resultsFound: "entri disahkan ditemui",
      starterDatasetBadge: "Set Data Permulaan Disahkan (Mod Baca Sahaja)",
    },
    home: {
      heroBadge: "Platform Leksikal Sumber Terbuka Disahkan · CC BY-SA 4.0",
      heroTitle: "Ketepatan makna merentas bahasa, sehingga ke akar kata.",
      heroDescription:
        "Rujuk takrifan yang disahkan, terjemahan mengikut makna, sebutan IPA, dan analisis morfologi Bahasa Melayu (Kata Dasar, Imbuhan, Peribahasa & Penjodoh Bilangan).",
      featuredWordsTitle: "Entri Pilihan & Berimpak Tinggi",
      featuredWordsSubtitle:
        "Terokai rekod kamus sebenar dengan terjemahan pelbagai makna dan huraian imbuhan.",
      malayExcellenceTitle: "Keunggulan Linguistik Bahasa Melayu",
      malayExcellenceSubtitle:
        "Analisis tatabahasa berstruktur untuk Kata Dasar, Kata Terbitan, Awalan, Akhiran, Apitan, Sisipan, Peribahasa, Simpulan Bahasa, dan Penjodoh Bilangan.",
      quickSectionsTitle: "Terokai Mengikut Kategori Leksikal",
      coverageTransparencyTitle: "Ketelusan Liputan Data & Provenans",
      verifiedEntriesLabel: "Kata Kepala Disahkan",
      supportedLanguagesLabel: "Bahasa Diindeks",
      licenseLabel: "Lesen Data",
    },
    wordDetail: {
      pronunciation: "Sebutan",
      listenBrowserTts: "Dengar (Sintesis Pelayar)",
      stopAudio: "Henti audio",
      ttsDisclaimer:
        "Dijana melalui Web Speech API pelayar anda — bukan rakaman penutur jati.",
      ttsUnavailable: "Sintesis pertuturan tidak tersedia untuk bahasa ini pada peranti anda.",
      saveFavorite: "Simpan ke Kegemaran",
      savedFavorite: "Disimpan dalam Kegemaran",
      copyWord: "Salin kata",
      copied: "Disalin",
      shareUrl: "Kongsi pautan",
      sensePrefix: "Makna",
      translationsHeading: "Terjemahan Mengikut Makna",
      noVerifiedTranslation:
        "Tiada terjemahan yang disahkan direkodkan untuk bahasa sasaran pilihan bagi makna ini.",
      examplesHeading: "Ayat Contoh Autentik",
      synonymsHeading: "Sinonim (Kata Seerti)",
      antonymsHeading: "Antonim (Kata Berlawanan)",
      wordFormsHeading: "Bentuk Kata & Infleksi",
      etymologyHeading: "Etimologi & Asal-usul Kata",
      grammarNoteHeading: "Nota Tatabahasa & Penggunaan",
      malayMorphologyHeading: "Analisis Morfologi & Akar Kata Bahasa Melayu",
      kataDasarLabel: "Kata Dasar",
      golonganKataLabel: "Golongan Kata",
      affixTypeLabel: "Jenis Imbuhan",
      formulaLabel: "Formula Pembentukan Kata",
      morphophonemicRuleLabel: "Hukum Morfofonemik",
      derivedWordsLabel: "Kata Terbitan & Bentuk Berkaitan yang Disahkan",
      classifierUsageLabel: "Padanan Penjodoh Bilangan",
      literalMeaningLabel: "Maksud Harfiah",
      provenanceHeading: "Atribusi Sumber & Lesen",
      sourceDatasetLabel: "Sumber Utama",
      licenseNoticeLabel: "Lesen",
      importedVersionLabel: "Versi Snapshot",
      aiExplanationTitle: "Nota Pembelajaran Berbantukan AI (Pilihan)",
      aiExplanationButton: "Papar Nota AI",
      aiExplanationDisclaimer:
        "Nota Berbantukan AI — Dijana untuk konteks pembelajaran sahaja. Bahagian ini BUKAN entri kamus yang disahkan.",
    },
    learn: {
      title: "Studio Pembelajaran Bahasa",
      subtitle:
        "Ulang kaji kosa kata tersimpan, latih morfologi Kata Dasar Bahasa Melayu, dan uji diri anda dengan kad imbas serta kuiz interaktif.",
      flashcardsTab: "Kad Imbas Interaktif",
      quizTab: "Kuiz Kosa Kata & Morfologi",
      collectionsTab: "Koleksi Terpilih",
      flipCard: "Balikkan kad",
      markKnown: "Dikuasai",
      markLearning: "Masih belajar",
      nextCard: "Kad seterusnya",
      prevCard: "Kad sebelumnya",
      startQuiz: "Mula Kuiz Baharu",
      submitAnswer: "Semak Jawapan",
      nextQuestion: "Soalan Seterusnya",
      quizScore: "Skor Semasa",
      masteredCount: "Perkataan Dikuasai",
    },
    favorites: {
      title: "Kosa Kata Kegemaran",
      subtitle:
        "Senarai peribadi anda disimpan secara setempat dalam pelayar — tiada pendaftaran diperlukan.",
      emptyTitle: "Tiada perkataan disimpan lagi",
      emptyDescription:
        "Tandakan mana-mana entri kamus semasa membuat carian untuk membina senarai ulang kaji anda.",
      remove: "Buang",
      clearAll: "Padam semua kegemaran",
      exportJson: "Eksport JSON",
      savedAt: "Disimpan pada",
    },
  },
  "zh-Hans": {
    brand: {
      name: "Vynalth Lexicon",
      tagline: "高精多语种词典与马来语词法分析平台",
      subtitle:
        "按义项精准对译、经验证的 Wiktionary/Wiktextract 词条数据、国际音标 (IPA) 及深度马来语词根 (Kata Dasar) 解析。",
    },
    nav: {
      home: "首页",
      dictionary: "词典检索",
      learn: "词汇学习",
      favorites: "收藏夹",
      about: "关于我们",
      sources: "数据来源",
      uiLanguage: "界面语言",
      darkMode: "深色模式",
      lightMode: "浅色模式",
    },
    search: {
      placeholder:
        "搜索单词、马来语词根、汉语拼音、罗马音或成语 (如 makanan, makan, serendipity, 学习, 水)...",
      sourceLanguage: "源语言",
      targetLanguage: "目标语言",
      swapLanguages: "交换源语言和目标语言",
      searchButton: "搜索",
      clearSearch: "清空搜索框",
      recentSearches: "最近搜索",
      clearHistory: "清除历史",
      allLanguages: "所有语言",
      allPartsOfSpeech: "所有词性",
      allCategories: "所有分类",
      exactMatches: "精确词条匹配",
      prefixMatches: "前缀与词法派生匹配",
      relatedMatches: "义项释义与相关匹配",
      didYouMean: "拼写容错建议",
      noResultsTitle: "未找到已验证的词典词条",
      noResultsDescription:
        "Vynalth Lexicon 绝不伪造词条。请尝试切换为“所有语言”、检查拼写，或按马来语词根 (Kata Dasar) 搜索。",
      latencyLabel: "检索耗时",
      resultsFound: "条已验证词条",
      starterDatasetBadge: "已验证初始词库 (只读模式)",
    },
    home: {
      heroBadge: "开源已验证多语词典平台 · CC BY-SA 4.0",
      heroTitle: "跨语言精准释义，直达词根脉络。",
      heroDescription:
        "查询经验证的多义项释义、跨语种精准对译、国际音标发音，以及系统的马来语词法剖析（词根、词缀、谚语、习语与量词）。",
      featuredWordsTitle: "精选高频词条",
      featuredWordsSubtitle:
        "浏览包含多义项跨语对译与词法结构的真实词条记录。",
      malayExcellenceTitle: "马来语 (Bahasa Melayu) 深度词法优势",
      malayExcellenceSubtitle:
        "结构化展示词根 (Kata Dasar)、派生词 (Kata Terbitan)、前缀、后缀、环缀、中缀、谚语、习语及量词搭配。",
      quickSectionsTitle: "按语言学分类探索",
      coverageTransparencyTitle: "实时词库覆盖率与溯源",
      verifiedEntriesLabel: "已验证词头数",
      supportedLanguagesLabel: "已索引语言",
      licenseLabel: "数据许可协议",
    },
    wordDetail: {
      pronunciation: "发音与音标",
      listenBrowserTts: "播放发音 (浏览器语音合成)",
      stopAudio: "停止播放",
      ttsDisclaimer:
        "通过浏览器 Web Speech API 合成，并非母语者真人录音。",
      ttsUnavailable: "当前设备不支持该语种的浏览器语音合成。",
      saveFavorite: "加入收藏",
      savedFavorite: "已收藏",
      copyWord: "复制词头",
      copied: "已复制",
      shareUrl: "分享链接",
      sensePrefix: "义项",
      translationsHeading: "义项对应翻译",
      noVerifiedTranslation: "该义项暂未收录所选目标语言的已验证译文。",
      examplesHeading: "真实语料例句",
      synonymsHeading: "近义词",
      antonymsHeading: "反义词",
      wordFormsHeading: "词形变化与屈折形式",
      etymologyHeading: "词源与历史演变",
      grammarNoteHeading: "语法与用法说明",
      malayMorphologyHeading: "马来语词法与词根分析 (Tatabahasa Melayu)",
      kataDasarLabel: "词根 (Kata Dasar)",
      golonganKataLabel: "词类 (Golongan Kata)",
      affixTypeLabel: "词缀类型 (Jenis Imbuhan)",
      formulaLabel: "构词公式",
      morphophonemicRuleLabel: "形态音位规则",
      derivedWordsLabel: "已验证同根派生词 (Kata Terbitan)",
      classifierUsageLabel: "量词搭配 (Penjodoh Bilangan)",
      literalMeaningLabel: "字面意义",
      provenanceHeading: "数据来源与开源许可署名",
      sourceDatasetLabel: "原始数据集",
      licenseNoticeLabel: "许可协议",
      importedVersionLabel: "数据快照版本",
      aiExplanationTitle: "AI 辅助学习解析（可选补充）",
      aiExplanationButton: "展开 AI 辅助解析",
      aiExplanationDisclaimer:
        "AI 辅助学习说明 — 仅供语境参考，绝不替代上方经验证的词典词条。",
    },
    learn: {
      title: "词汇学习中心",
      subtitle:
        "复习已收藏单词、强化马来语词根与词缀派生规律，并通过双语闪卡与随堂测验巩固记忆。",
      flashcardsTab: "互动闪卡",
      quizTab: "词汇与词法测验",
      collectionsTab: "精选词单",
      flipCard: "翻转卡片",
      markKnown: "已掌握",
      markLearning: "学习中",
      nextCard: "下一张",
      prevCard: "上一张",
      startQuiz: "开始新测验",
      submitAnswer: "提交答案",
      nextQuestion: "下一题",
      quizScore: "当前得分",
      masteredCount: "本地已掌握词汇",
    },
    favorites: {
      title: "我的词汇收藏夹",
      subtitle: "所有收藏记录安全保存在您的浏览器本地存储中，无需注册账号。",
      emptyTitle: "暂无收藏词汇",
      emptyDescription: "在查阅词典时点击“加入收藏”，即可在此建立您的专属词汇本。",
      remove: "移除",
      clearAll: "清空全部收藏",
      exportJson: "导出 JSON",
      savedAt: "收藏时间",
    },
  },
};

export function getUiDictionary(locale: UiLocale = "en"): UiDictionary {
  return UI_TRANSLATIONS[locale] || UI_TRANSLATIONS.en;
}

export function formatPartOfSpeech(
  pos: PartOfSpeech,
  locale: UiLocale = "en"
): string {
  const labels: Record<PartOfSpeech, Record<UiLocale, string>> = {
    noun: {
      en: "Noun (Kata Nama)",
      ms: "Kata Nama",
      "zh-Hans": "名词 (Kata Nama)",
    },
    verb: {
      en: "Verb (Kata Kerja)",
      ms: "Kata Kerja",
      "zh-Hans": "动词 (Kata Kerja)",
    },
    adjective: {
      en: "Adjective (Kata Adjektif)",
      ms: "Kata Adjektif",
      "zh-Hans": "形容词 (Kata Adjektif)",
    },
    adverb: {
      en: "Adverb (Kata Adverba)",
      ms: "Kata Adverba",
      "zh-Hans": "副词",
    },
    preposition: {
      en: "Preposition (Kata Sendi Nama)",
      ms: "Kata Sendi Nama",
      "zh-Hans": "介词 (Kata Sendi Nama)",
    },
    pronoun: {
      en: "Pronoun (Kata Ganti Nama)",
      ms: "Kata Ganti Nama",
      "zh-Hans": "代词",
    },
    conjunction: {
      en: "Conjunction (Kata Hubung)",
      ms: "Kata Hubung",
      "zh-Hans": "连词",
    },
    interjection: {
      en: "Interjection (Kata Seru)",
      ms: "Kata Seru",
      "zh-Hans": "感叹词",
    },
    classifier: {
      en: "Numeral Classifier (Penjodoh Bilangan)",
      ms: "Penjodoh Bilangan",
      "zh-Hans": "量词 (Penjodoh Bilangan)",
    },
    idiom: {
      en: "Idiom (Simpulan Bahasa)",
      ms: "Simpulan Bahasa",
      "zh-Hans": "习语 (Simpulan Bahasa)",
    },
    proverb: {
      en: "Proverb (Peribahasa)",
      ms: "Peribahasa",
      "zh-Hans": "谚语 (Peribahasa)",
    },
    phrase: {
      en: "Phrase (Frasa)",
      ms: "Frasa",
      "zh-Hans": "短语",
    },
  };
  return labels[pos]?.[locale] || pos;
}

export function formatMalayMorphologyType(
  type: MalayMorphologyType,
  locale: UiLocale = "en"
): string {
  const labels: Record<MalayMorphologyType, Record<UiLocale, string>> = {
    kata_dasar: {
      en: "Kata Dasar (Root Word)",
      ms: "Kata Dasar",
      "zh-Hans": "词根 (Kata Dasar)",
    },
    kata_terbitan: {
      en: "Kata Terbitan (Derived Word)",
      ms: "Kata Terbitan",
      "zh-Hans": "派生词 (Kata Terbitan)",
    },
    kata_majmuk: {
      en: "Kata Majmuk (Compound Word)",
      ms: "Kata Majmuk",
      "zh-Hans": "复合词 (Kata Majmuk)",
    },
    kata_ganda: {
      en: "Kata Ganda (Reduplication)",
      ms: "Kata Ganda",
      "zh-Hans": "重叠词 (Kata Ganda)",
    },
    peribahasa: {
      en: "Peribahasa (Proverb)",
      ms: "Peribahasa",
      "zh-Hans": "马来谚语 (Peribahasa)",
    },
    simpulan_bahasa: {
      en: "Simpulan Bahasa (Idiom)",
      ms: "Simpulan Bahasa",
      "zh-Hans": "马来习语 (Simpulan Bahasa)",
    },
    penjodoh_bilangan: {
      en: "Penjodoh Bilangan (Numeral Classifier)",
      ms: "Penjodoh Bilangan",
      "zh-Hans": "马来量词 (Penjodoh Bilangan)",
    },
  };
  return labels[type]?.[locale] || type;
}

export function formatMalayAffixType(
  affix: MalayAffixType,
  locale: UiLocale = "en"
): string {
  const labels: Record<MalayAffixType, Record<UiLocale, string>> = {
    none: {
      en: "Tiada Imbuhan (Un-affixed Root)",
      ms: "Tiada Imbuhan (Kata Dasar Tulen)",
      "zh-Hans": "无词缀 (纯词根)",
    },
    awalan: {
      en: "Awalan (Prefix)",
      ms: "Imbuhan Awalan",
      "zh-Hans": "前缀 (Awalan)",
    },
    akhiran: {
      en: "Akhiran (Suffix)",
      ms: "Imbuhan Akhiran",
      "zh-Hans": "后缀 (Akhiran)",
    },
    apitan: {
      en: "Apitan (Circumfix)",
      ms: "Imbuhan Apitan",
      "zh-Hans": "环缀 (Apitan)",
    },
    sisipan: {
      en: "Sisipan (Infix)",
      ms: "Imbuhan Sisipan",
      "zh-Hans": "中缀 (Sisipan)",
    },
  };
  return labels[affix]?.[locale] || affix;
}

export function formatMalayGolonganKata(
  golongan: MalayGolonganKata,
  locale: UiLocale = "en"
): string {
  const labels: Record<MalayGolonganKata, Record<UiLocale, string>> = {
    kata_nama: {
      en: "Kata Nama (Noun)",
      ms: "Kata Nama",
      "zh-Hans": "名词 (Kata Nama)",
    },
    kata_kerja: {
      en: "Kata Kerja (Verb)",
      ms: "Kata Kerja",
      "zh-Hans": "动词 (Kata Kerja)",
    },
    kata_adjektif: {
      en: "Kata Adjektif (Adjective)",
      ms: "Kata Adjektif",
      "zh-Hans": "形容词 (Kata Adjektif)",
    },
    kata_sendi_nama: {
      en: "Kata Sendi Nama (Preposition)",
      ms: "Kata Sendi Nama",
      "zh-Hans": "介词 (Kata Sendi Nama)",
    },
    kata_tugas: {
      en: "Kata Tugas (Function Word)",
      ms: "Kata Tugas",
      "zh-Hans": "虚词 (Kata Tugas)",
    },
    penjodoh_bilangan: {
      en: "Penjodoh Bilangan (Numeral Classifier)",
      ms: "Penjodoh Bilangan",
      "zh-Hans": "量词 (Penjodoh Bilangan)",
    },
    peribahasa: {
      en: "Peribahasa (Proverb)",
      ms: "Peribahasa",
      "zh-Hans": "谚语 (Peribahasa)",
    },
    simpulan_bahasa: {
      en: "Simpulan Bahasa (Idiom)",
      ms: "Simpulan Bahasa",
      "zh-Hans": "习语 (Simpulan Bahasa)",
    },
  };
  return labels[golongan]?.[locale] || golongan;
}
