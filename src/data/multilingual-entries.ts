import type { LanguageCode, LexiconEntry } from "@/types/lexicon";
import { normalizeSearchKey } from "@/lib/text-normalize";

const makeProvenance = (lang: LanguageCode, word: string) => ({
  sourceName: `Kaikki.org / Wiktionary (${lang.toUpperCase()} Wiktextract)`,
  sourceUrl: `https://en.wiktionary.org/wiki/${encodeURIComponent(word)}`,
  license: "CC BY-SA 4.0 / GFDL",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  sourceVersion: "wiktextract-2026-09",
  importedAt: "2026-10-01T00:00:00.000Z",
});

const rawMultilingualEntries: Omit<
  LexiconEntry,
  "normalizedHeadword" | "provenance"
>[] = [
  // =========================================================================
  // ENGLISH (en)
  // =========================================================================
  {
    id: "en-eat",
    slug: "eat",
    headword: "eat",
    language: "en",
    ipa: "/iːt/",
    audioLocale: "en-US",
    partsOfSpeech: ["verb"],
    etymology:
      "From Middle English eten, from Old English etan, from Proto-Germanic *etaną, from Proto-Indo-European *h₁édti.",
    wordForms: [
      { label: "Base Form", form: "eat" },
      { label: "Past Tense", form: "ate" },
      { label: "Past Participle", form: "eaten" },
      { label: "Present Participle", form: "eating" },
      { label: "Third-Person Singular", form: "eats" },
    ],
    senses: [
      {
        id: "en-eat-s1",
        senseNumber: 1,
        partOfSpeech: "verb",
        domain: "general",
        definition: "To ingest food; to chew and swallow nourishment.",
        localizedDefinitions: {
          en: "To ingest food; to chew and swallow nourishment.",
          ms: "Menyuap, mengunyah, dan menelan makanan.",
          "zh-Hans": "吃，进食；把食物放入口中咀嚼并咽下。",
        },
        translations: [
          { language: "ms", terms: ["makan", "santap"] },
          { language: "zh-Hans", terms: ["吃", "进食"], romanization: "chī, jìnshí" },
          { language: "zh-Hant", terms: ["吃", "進食"], romanization: "chī, jìnshí" },
          { language: "id", terms: ["makan"] },
          { language: "ja", terms: ["食べる"], romanization: "taberu" },
          { language: "ko", terms: ["먹다"], romanization: "meokda" },
          { language: "th", terms: ["กิน"], romanization: "kin" },
          { language: "ar", terms: ["أَكَلَ"], romanization: "ʾakala" },
          { language: "es", terms: ["comer"] },
          { language: "fr", terms: ["manger"] },
          { language: "de", terms: ["essen"] },
        ],
        examples: [
          {
            text: "We usually eat fresh fruit and oats for breakfast.",
            translations: {
              ms: "Kami lazimnya makan buah-buahan segar dan oat untuk sarapan.",
              "zh-Hans": "我们早餐通常吃新鲜水果和燕麦。",
            },
          },
        ],
        synonyms: ["consume", "dine", "partake"],
        antonyms: ["fast"],
      },
      {
        id: "en-eat-s2",
        senseNumber: 2,
        partOfSpeech: "verb",
        register: "figurative",
        definition: "To corrode, erode, or gradually use up resources or expenses.",
        localizedDefinitions: {
          en: "To corrode, erode, or gradually use up resources or expenses.",
          ms: "Menghakis atau menghabiskan sumber dan perbelanjaan secara beransur-ansur.",
          "zh-Hans": "侵蚀；耗费，吞噬（资金、储蓄等）。",
        },
        translations: [
          { language: "ms", terms: ["memakan", "menghabiskan", "menghakis"] },
          { language: "zh-Hans", terms: ["耗费", "侵蚀"], romanization: "hàofèi, qīnshí" },
        ],
        examples: [
          {
            text: "Unexpected repair costs began to eat into their savings.",
            translations: {
              ms: "Kos pembaikan luar jangka mula memakan simpanan mereka.",
              "zh-Hans": "意外的维修费用开始吞噬他们的积蓄。",
            },
          },
        ],
        synonyms: ["erode", "deplete"],
        antonyms: ["conserve"],
      },
    ],
    relatedWords: [{ word: "makan", language: "ms", relation: "Malay Equivalent" }],
    frequencyRank: 11,
    featured: true,
  },
  {
    id: "en-food",
    slug: "food",
    headword: "food",
    language: "en",
    ipa: "/fuːd/",
    audioLocale: "en-US",
    partsOfSpeech: ["noun"],
    etymology: "From Middle English foode, from Old English fōda ('food, nourishment').",
    wordForms: [
      { label: "Singular", form: "food" },
      { label: "Plural", form: "foods" },
    ],
    senses: [
      {
        id: "en-food-s1",
        senseNumber: 1,
        partOfSpeech: "noun",
        domain: "culinary",
        definition: "Any nutritious substance that people or animals eat or drink in order to maintain life and growth.",
        localizedDefinitions: {
          en: "Any nutritious substance that people or animals eat or drink in order to maintain life and growth.",
          ms: "Bahan berkhasiat yang dimakan oleh manusia atau haiwan untuk kelangsungan hidup dan tumbesaran; makanan.",
          "zh-Hans": "食物，食品，粮食。",
        },
        translations: [
          { language: "ms", terms: ["makanan", "juadah", "santapan"] },
          { language: "zh-Hans", terms: ["食物", "食品"], romanization: "shíwù, shípǐn" },
          { language: "zh-Hant", terms: ["食物", "食品"], romanization: "shíwù, shípǐn" },
          { language: "id", terms: ["makanan", "pangan"] },
          { language: "ja", terms: ["食べ物", "食料"], romanization: "tabemono, shokuryō" },
          { language: "ko", terms: ["음식"], romanization: "eumsik" },
          { language: "th", terms: ["อาหาร"], romanization: "ahan" },
          { language: "ar", terms: ["طَعَام"], romanization: "ṭaʿām" },
          { language: "es", terms: ["comida", "alimento"] },
          { language: "fr", terms: ["nourriture", "aliment"] },
          { language: "de", terms: ["Essen", "Nahrung"] },
        ],
        examples: [
          {
            text: "Local street food in Penang and Kuala Lumpur draws visitors from around the world.",
            translations: {
              ms: "Makanan jalanan tempatan di Pulau Pinang dan Kuala Lumpur menarik pengunjung dari seluruh dunia.",
              "zh-Hans": "槟城和吉隆坡的当地街头美食吸引了来自世界各地的游客。",
            },
          },
        ],
        synonyms: ["nourishment", "sustenance", "provisions", "fare"],
        antonyms: [],
      },
    ],
    relatedWords: [{ word: "makanan", language: "ms", relation: "Malay Equivalent" }],
    frequencyRank: 16,
  },
  {
    id: "en-water",
    slug: "water",
    headword: "water",
    language: "en",
    ipa: "/ˈwɔː.tər/",
    audioLocale: "en-US",
    partsOfSpeech: ["noun", "verb"],
    etymology: "From Old English wæter, from Proto-Germanic *watōr, from Proto-Indo-European *wódr̥.",
    wordForms: [
      { label: "Noun", form: "water" },
      { label: "Verb (3rd sg.)", form: "waters" },
      { label: "Participle", form: "watering" },
    ],
    senses: [
      {
        id: "en-water-s1",
        senseNumber: 1,
        partOfSpeech: "noun",
        domain: "general",
        definition: "A transparent, odorless, tasteless liquid (H₂O) that forms the world's streams, lakes, oceans, and rain.",
        localizedDefinitions: {
          en: "A transparent, odorless, tasteless liquid (H₂O) that forms the world's streams, lakes, oceans, and rain.",
          ms: "Cecair jernih tanpa bau dan rasa (H₂O) yang membentuk sungai, tasik, lautan, serta hujan; air.",
          "zh-Hans": "水；构成江河湖海和雨水的透明无味液体。",
        },
        translations: [
          { language: "ms", terms: ["air"] },
          { language: "zh-Hans", terms: ["水"], romanization: "shuǐ" },
          { language: "zh-Hant", terms: ["水"], romanization: "shuǐ" },
          { language: "id", terms: ["air"] },
          { language: "ja", terms: ["水"], romanization: "mizu" },
          { language: "ko", terms: ["물"], romanization: "mul" },
          { language: "th", terms: ["น้ำ"], romanization: "nam" },
          { language: "ar", terms: ["مَاء"], romanization: "māʾ" },
          { language: "es", terms: ["agua"] },
          { language: "fr", terms: ["eau"] },
          { language: "de", terms: ["Wasser"] },
        ],
        examples: [
          {
            text: "Please drink plenty of water during hot tropical afternoons.",
            translations: {
              ms: "Sila minum air secukupnya pada waktu petang tropika yang panas.",
              "zh-Hans": "在炎热的午后请多喝水。",
            },
          },
        ],
        synonyms: ["aqua", "H2O"],
        antonyms: [],
      },
      {
        id: "en-water-s2",
        senseNumber: 2,
        partOfSpeech: "verb",
        domain: "botany",
        definition: "To pour or sprinkle water over a plant or area of ground.",
        localizedDefinitions: {
          en: "To pour or sprinkle water over a plant or area of ground.",
          ms: "Menyiram atau mencurahkan air pada tumbuh-tumbuhan atau tanaman.",
          "zh-Hans": "浇水，灌溉（植物或土地）。",
        },
        translations: [
          { language: "ms", terms: ["menyiram", "mengairi"] },
          { language: "zh-Hans", terms: ["浇水", "灌溉"], romanization: "jiāoshuǐ, guàngài" },
          { language: "id", terms: ["menyiram"] },
        ],
        examples: [
          {
            text: "She waters the orchid garden every morning before sunrise.",
            translations: {
              ms: "Dia menyiram taman orkid itu setiap pagi sebelum matahari terbit.",
              "zh-Hans": "她每天早上日出前给兰花园浇水。",
            },
          },
        ],
        synonyms: ["irrigate", "sprinkle"],
        antonyms: ["parch"],
      },
    ],
    frequencyRank: 7,
    featured: true,
  },
  {
    id: "en-serendipity",
    slug: "serendipity",
    headword: "serendipity",
    language: "en",
    ipa: "/ˌsɛɹ.ənˈdɪp.ɪ.ti/",
    audioLocale: "en-US",
    partsOfSpeech: ["noun"],
    etymology:
      "Coined by Horace Walpole in 1754 from the Persian fairy tale 'The Three Princes of Serendip' (an old name for Sri Lanka), whose heroes were always making discoveries by accidents and sagacity.",
    senses: [
      {
        id: "en-serendipity-s1",
        senseNumber: 1,
        partOfSpeech: "noun",
        register: "literary",
        definition: "The occurrence and development of events by chance in a happy, fortunate, or beneficial way.",
        localizedDefinitions: {
          en: "The occurrence and development of events by chance in a happy, fortunate, or beneficial way.",
          ms: "Penemuan atau kejadian beruntung yang berlaku secara kebetulan dan membawa kebaikan yang tidak disangka-sangka.",
          "zh-Hans": "意外发现珍奇事物的机缘；不期而遇的美好巧合。",
        },
        translations: [
          { language: "ms", terms: ["kebetulan yang membawa tuah", "penemuan tidak terduga"] },
          { language: "zh-Hans", terms: ["机缘巧合", "意外之喜"], romanization: "jīyuán qiǎohhé" },
          { language: "zh-Hant", terms: ["機緣巧合", "意外之喜"], romanization: "jīyuán qiǎohé" },
          { language: "id", terms: ["serendipitas", "kebetulan yang menguntungkan"] },
          { language: "ja", terms: ["セレンディピティ", "思わぬ幸運な発見"], romanization: "serendipiti" },
          { language: "fr", terms: ["sérendipité"] },
          { language: "es", terms: ["serendipia"] },
          { language: "de", terms: ["Serendipität"] },
        ],
        examples: [
          {
            text: "Many breakthroughs in science and lexicography happen through careful observation and serendipity.",
            translations: {
              ms: "Banyak penemuan besar dalam sains dan leksikografi berlaku melalui pemerhatian rapi serta kebetulan yang membawa tuah.",
              "zh-Hans": "科学和词典学中的许多突破都源于细致的观察与机缘巧合。",
            },
          },
        ],
        synonyms: ["happy chance", "good fortune", "fluke"],
        antonyms: ["misfortune", "calamity"],
      },
    ],
    frequencyRank: 95,
    featured: true,
  },
  {
    id: "en-learn",
    slug: "learn",
    headword: "learn",
    language: "en",
    ipa: "/lɜːn/",
    audioLocale: "en-US",
    partsOfSpeech: ["verb"],
    etymology: "From Old English leornian ('to study, read, think about'), from Proto-Germanic *liznōną.",
    wordForms: [
      { label: "Base", form: "learn" },
      { label: "Past", form: "learned / learnt" },
      { label: "Participle", form: "learning" },
    ],
    senses: [
      {
        id: "en-learn-s1",
        senseNumber: 1,
        partOfSpeech: "verb",
        domain: "education",
        definition: "To acquire knowledge of or skill in something by study, instruction, or experience.",
        localizedDefinitions: {
          en: "To acquire knowledge of or skill in something by study, instruction, or experience.",
          ms: "Memperoleh ilmu pengetahuan atau kemahiran melalui pembelajaran, tunjuk ajar, atau pengalaman; belajar.",
          "zh-Hans": "学习，学会，掌握知识或技能。",
        },
        translations: [
          { language: "ms", terms: ["belajar", "mempelajari"] },
          { language: "zh-Hans", terms: ["学习", "学会"], romanization: "xuéxí, xuéhuì" },
          { language: "zh-Hant", terms: ["學習", "學會"], romanization: "xuéxí, xuéhuì" },
          { language: "id", terms: ["belajar", "mempelajari"] },
          { language: "ja", terms: ["学ぶ", "習う"], romanization: "manabu, narau" },
          { language: "ko", terms: ["배우다", "공부하다"], romanization: "baeuda, gongbuhada" },
          { language: "th", terms: ["เรียนรู้"], romanization: "rian-ru" },
          { language: "ar", terms: ["تَعَلَّمَ"], romanization: "taʿallama" },
          { language: "es", terms: ["aprender"] },
          { language: "fr", terms: ["apprendre"] },
          { language: "de", terms: ["lernen"] },
        ],
        examples: [
          {
            text: "Understanding root words helps you learn Malay vocabulary much faster.",
            translations: {
              ms: "Memahami kata dasar membantu anda mempelajari kosa kata Bahasa Melayu dengan jauh lebih pantas.",
              "zh-Hans": "理解词根能帮助你更快地学习马来语词汇。",
            },
          },
        ],
        synonyms: ["study", "master", "acquire"],
        antonyms: ["forget", "unlearn"],
      },
    ],
    frequencyRank: 19,
  },
  {
    id: "en-dictionary",
    slug: "dictionary",
    headword: "dictionary",
    language: "en",
    ipa: "/ˈdɪk.ʃə.nɛɹ.i/",
    audioLocale: "en-US",
    partsOfSpeech: ["noun"],
    etymology: "From Medieval Latin dictionarium ('collection of words and phrases'), from Latin dictio ('speaking, word').",
    wordForms: [
      { label: "Singular", form: "dictionary" },
      { label: "Plural", form: "dictionaries" },
    ],
    senses: [
      {
        id: "en-dictionary-s1",
        senseNumber: 1,
        partOfSpeech: "noun",
        domain: "linguistics",
        definition: "A reference work or digital resource that lists words of one or more languages with their meanings, pronunciations, etymologies, and translations.",
        localizedDefinitions: {
          en: "A reference work or digital resource that lists words of one or more languages with their meanings, pronunciations, etymologies, and translations.",
          ms: "Buku atau sumber rujukan yang memuatkan senarai perkataan berserta takrifan, sebutan, etimologi, dan terjemahannya; kamus.",
          "zh-Hans": "词典，字典；收录词语并提供释义、注音、词源或翻译的工具书。",
        },
        translations: [
          { language: "ms", terms: ["kamus", "kitab loghat"] },
          { language: "zh-Hans", terms: ["词典", "字典"], romanization: "cídiǎn, zìdiǎn" },
          { language: "zh-Hant", terms: ["詞典", "字典"], romanization: "cídiǎn, zìdiǎn" },
          { language: "id", terms: ["kamus"] },
          { language: "ja", terms: ["辞書", "辞典"], romanization: "jisho, jiten" },
          { language: "ko", terms: ["사전"], romanization: "sajeon" },
          { language: "th", terms: ["พจนานุกรม"], romanization: "photchananukrom" },
          { language: "ar", terms: ["قَامُوس", "مُعْجَم"], romanization: "qāmūs, muʿjam" },
          { language: "es", terms: ["diccionario"] },
          { language: "fr", terms: ["dictionnaire"] },
          { language: "de", terms: ["Wörterbuch"] },
        ],
        examples: [
          {
            text: "A trustworthy dictionary distinguishes clearly between multiple senses of a headword.",
            translations: {
              ms: "Sebuah kamus yang boleh dipercayai membezakan dengan jelas pelbagai makna bagi sesuatu kata kepala.",
              "zh-Hans": "一部可靠的词典会清晰地区分词头的各个义项。",
            },
          },
        ],
        synonyms: ["lexicon", "glossary", "wordbook"],
        antonyms: [],
      },
    ],
    frequencyRank: 35,
    featured: true,
  },
  {
    id: "en-book",
    slug: "book",
    headword: "book",
    language: "en",
    ipa: "/bʊk/",
    audioLocale: "en-US",
    partsOfSpeech: ["noun", "verb"],
    etymology: "From Old English bōc, from Proto-Germanic *bōks ('beech, writing tablet').",
    senses: [
      {
        id: "en-book-s1",
        senseNumber: 1,
        partOfSpeech: "noun",
        definition: "A written or printed work consisting of pages glued or sewn together along one side and bound in covers.",
        localizedDefinitions: {
          en: "A written or printed work consisting of pages glued or sewn together along one side and bound in covers.",
          ms: "Helaian kertas bertulis atau bercetak yang dijilid menjadi satu; buku, kitab.",
          "zh-Hans": "书，书籍，著作。",
        },
        translations: [
          { language: "ms", terms: ["buku", "kitab"] },
          { language: "zh-Hans", terms: ["书", "书籍"], romanization: "shū, shūjí" },
          { language: "zh-Hant", terms: ["書", "書籍"], romanization: "shū, shūjí" },
          { language: "id", terms: ["buku", "pustaka"] },
          { language: "ja", terms: ["本", "書物"], romanization: "hon, shomotsu" },
          { language: "ko", terms: ["책"], romanization: "chaek" },
          { language: "th", terms: ["หนังสือ"], romanization: "nangsue" },
          { language: "ar", terms: ["كِتَاب"], romanization: "kitāb" },
          { language: "es", terms: ["libro"] },
          { language: "fr", terms: ["livre"] },
          { language: "de", terms: ["Buch"] },
        ],
        examples: [
          {
            text: "She borrowed a book on Southeast Asian linguistics from the library.",
            translations: {
              ms: "Dia meminjam sebuah buku tentang linguistik Asia Tenggara dari perpustakaan.",
              "zh-Hans": "她从图书馆借了一本关于东南亚语言学的书。",
            },
          },
        ],
        synonyms: ["volume", "tome", "publication"],
        antonyms: [],
      },
    ],
    frequencyRank: 13,
  },
  {
    id: "en-peace",
    slug: "peace",
    headword: "peace",
    language: "en",
    ipa: "/piːs/",
    audioLocale: "en-US",
    partsOfSpeech: ["noun"],
    etymology: "From Anglo-Norman pes, Old French pais, from Latin pāx ('peace').",
    senses: [
      {
        id: "en-peace-s1",
        senseNumber: 1,
        partOfSpeech: "noun",
        definition: "Freedom from disturbance; tranquility; a state of harmony and absence of conflict.",
        localizedDefinitions: {
          en: "Freedom from disturbance; tranquility; a state of harmony and absence of conflict.",
          ms: "Keadaan aman, tenteram, damai, dan bebas daripada persengketaan.",
          "zh-Hans": "和平，安宁，平静，和睦。",
        },
        translations: [
          { language: "ms", terms: ["keamanan", "kedamaian", "ketenteraman"] },
          { language: "zh-Hans", terms: ["和平", "安宁"], romanization: "hépíng, ānníng" },
          { language: "id", terms: ["perdamaian", "ketenteraman"] },
          { language: "ja", terms: ["平和", "平安"], romanization: "heiwa, heian" },
          { language: "ko", terms: ["평화"], romanization: "pyeonghwa" },
          { language: "ar", terms: ["سَلَام"], romanization: "salām" },
          { language: "es", terms: ["paz"] },
          { language: "fr", terms: ["paix"] },
          { language: "de", terms: ["Frieden"] },
        ],
        examples: [
          {
            text: "Mutual respect across cultures fosters lasting peace.",
            translations: {
              ms: "Sikap saling menghormati merentas budaya memupuk keamanan yang berkekalan.",
              "zh-Hans": "跨文化的相互尊重能够促进持久的和平。",
            },
          },
        ],
        synonyms: ["harmony", "tranquility", "serenity", "concord"],
        antonyms: ["conflict", "war", "turmoil"],
      },
    ],
    frequencyRank: 38,
  },

  // =========================================================================
  // SIMPLIFIED CHINESE (zh-Hans)
  // =========================================================================
  {
    id: "zh-hans-chi",
    slug: "吃",
    headword: "吃",
    language: "zh-Hans",
    romanization: "chī",
    ipa: "/ʈ͡ʂʰʐ̩˥/",
    audioLocale: "zh-CN",
    partsOfSpeech: ["verb"],
    etymology: "Ideogrammic compound (会意/形声): 口 ('mouth') + 乞 (phonetic).",
    wordForms: [
      { label: "Simplified", form: "吃" },
      { label: "Traditional", form: "吃 / 喫" },
      { label: "Pinyin", form: "chī" },
    ],
    senses: [
      {
        id: "zh-hans-chi-s1",
        senseNumber: 1,
        partOfSpeech: "verb",
        definition: "To eat; to take in food or medicine through the mouth.",
        localizedDefinitions: {
          en: "To eat; to take in food or medicine through the mouth.",
          ms: "Makan; memasukkan makanan atau ubat ke dalam mulut untuk dikunyah dan ditelan.",
          "zh-Hans": "把食物等放到嘴里经过咀嚼咽下去（包括吸、喝）。",
        },
        translations: [
          { language: "ms", terms: ["makan", "santap"] },
          { language: "en", terms: ["eat", "consume", "take"] },
          { language: "zh-Hant", terms: ["吃"], romanization: "chī" },
          { language: "id", terms: ["makan"] },
          { language: "ja", terms: ["食べる"], romanization: "taberu" },
          { language: "ko", terms: ["먹다"], romanization: "meokda" },
        ],
        examples: [
          {
            text: "你今天早上吃早饭了吗？",
            romanization: "Nǐ jīntiān zǎoshang chī zǎofàn le ma?",
            translations: {
              en: "Did you eat breakfast this morning?",
              ms: "Adakah awak sudah makan sarapan pagi ini?",
            },
          },
        ],
        synonyms: ["进食", "用膳"],
        antonyms: [],
      },
    ],
    frequencyRank: 17,
    featured: true,
  },
  {
    id: "zh-hans-xuexi",
    slug: "学习",
    headword: "学习",
    language: "zh-Hans",
    romanization: "xuéxí",
    ipa: "/ɕɥɛ³⁵ ɕi³⁵/",
    audioLocale: "zh-CN",
    partsOfSpeech: ["verb", "noun"],
    etymology: "From Classical Chinese 学 ('to learn') + 习 ('to practice repeatedly', as in Analects: 学而时习之).",
    wordForms: [
      { label: "Simplified", form: "学习" },
      { label: "Traditional", form: "學習" },
      { label: "Pinyin", form: "xuéxí" },
    ],
    senses: [
      {
        id: "zh-hans-xuexi-s1",
        senseNumber: 1,
        partOfSpeech: "verb",
        domain: "education",
        definition: "To study; to learn; to acquire knowledge or skills by reading, practicing, or observing.",
        localizedDefinitions: {
          en: "To study; to learn; to acquire knowledge or skills by reading, practicing, or observing.",
          ms: "Belajar; mempelajari ilmu pengetahuan atau kemahiran melalui pembacaan dan latihan.",
          "zh-Hans": "从阅读、听讲、研究、实践中获得知识或技能。",
        },
        translations: [
          { language: "ms", terms: ["belajar", "mempelajari"] },
          { language: "en", terms: ["study", "learn"] },
          { language: "zh-Hant", terms: ["學習"], romanization: "xuéxí" },
          { language: "id", terms: ["belajar"] },
          { language: "ja", terms: ["学習する", "学ぶ"], romanization: "gakushū suru, manabu" },
          { language: "ko", terms: ["학습하다", "공부하다"], romanization: "hakseuphada, gongbuhada" },
        ],
        examples: [
          {
            text: "学习一门新语言可以拓宽我们的国际视野。",
            romanization: "Xuéxí yī mén xīn yǔyán kěyǐ tuòkuān wǒmen de guójì shìyě.",
            translations: {
              en: "Learning a new language can broaden our international horizon.",
              ms: "Mempelajari bahasa baharu dapat meluaskan pandangan antarabangsa kita.",
            },
          },
        ],
        synonyms: ["求学", "研习", "进修"],
        antonyms: ["荒废"],
      },
    ],
    relatedWords: [{ word: "學習", language: "zh-Hant", relation: "Traditional Script" }],
    frequencyRank: 19,
    featured: true,
  },
  {
    id: "zh-hans-shui",
    slug: "水",
    headword: "水",
    language: "zh-Hans",
    romanization: "shuǐ",
    ipa: "/ʂweɪ̯²¹⁴/",
    audioLocale: "zh-CN",
    partsOfSpeech: ["noun"],
    etymology: "Pictogram (象形) depicting a flowing stream or river.",
    senses: [
      {
        id: "zh-hans-shui-s1",
        senseNumber: 1,
        partOfSpeech: "noun",
        definition: "Water; liquid; river, lake, or sea.",
        localizedDefinitions: {
          en: "Water; liquid; river, lake, or sea.",
          ms: "Air; cecair jernih yang menjadi sumber kehidupan; sungai atau laut.",
          "zh-Hans": "由氢和氧两种元素组成的无机物，无色无味透明液体；亦泛指江、河、湖、海。",
        },
        translations: [
          { language: "ms", terms: ["air"] },
          { language: "en", terms: ["water", "liquid"] },
          { language: "id", terms: ["air"] },
          { language: "ja", terms: ["水"], romanization: "mizu" },
          { language: "ko", terms: ["물"], romanization: "mul" },
          { language: "th", terms: ["น้ำ"], romanization: "nam" },
          { language: "ar", terms: ["مَاء"], romanization: "māʾ" },
        ],
        examples: [
          {
            text: "饮水思源，我们应当铭记前人的付出。",
            romanization: "Yǐn shuǐ sī yuán, wǒmen yīngdāng míngjì qiánrén de fùchū.",
            translations: {
              en: "When drinking water, think of its source; we should remember the contributions of predecessors.",
              ms: "Ketika minum air, ingatlah puncanya; kita wajar mengenang jasa generasi terdahulu.",
            },
          },
        ],
        synonyms: [],
        antonyms: ["火"],
      },
    ],
    frequencyRank: 9,
  },
  {
    id: "zh-hans-cidian",
    slug: "词典",
    headword: "词典",
    language: "zh-Hans",
    romanization: "cídiǎn",
    ipa: "/t͡sʰz̩³⁵ tjɛn²¹⁴/",
    audioLocale: "zh-CN",
    partsOfSpeech: ["noun"],
    wordForms: [
      { label: "Simplified", form: "词典" },
      { label: "Traditional", form: "詞典" },
      { label: "Pinyin", form: "cídiǎn" },
    ],
    senses: [
      {
        id: "zh-hans-cidian-s1",
        senseNumber: 1,
        partOfSpeech: "noun",
        domain: "linguistics",
        definition: "Dictionary; lexicon; a reference work collecting words and phrases with explanations.",
        localizedDefinitions: {
          en: "Dictionary; lexicon; a reference work collecting words and phrases with explanations.",
          ms: "Kamus; buku rujukan yang menghimpunkan perkataan berserta maknanya.",
          "zh-Hans": "收集词汇并加以解释、注音或翻译供人查阅的工具书。",
        },
        translations: [
          { language: "ms", terms: ["kamus"] },
          { language: "en", terms: ["dictionary", "lexicon"] },
          { language: "zh-Hant", terms: ["詞典"], romanization: "cídiǎn" },
          { language: "ja", terms: ["辞典", "辞書"], romanization: "jiten, jisho" },
        ],
        examples: [
          {
            text: "这部多语种词典提供了详尽的马来语词根分析。",
            romanization: "Zhè bù duōyǔzhǒng cídiǎn tígōng le xiángjìn de Mǎláiyǔ cígēn fēnxī.",
            translations: {
              en: "This multilingual dictionary provides detailed Malay root-word analysis.",
              ms: "Kamus pelbagai bahasa ini menyediakan analisis kata dasar Bahasa Melayu yang terperinci.",
            },
          },
        ],
        synonyms: ["辞书", "字典"],
        antonyms: [],
      },
    ],
    frequencyRank: 36,
  },

  // =========================================================================
  // TRADITIONAL CHINESE (zh-Hant)
  // =========================================================================
  {
    id: "zh-hant-xuexi",
    slug: "學習",
    headword: "學習",
    language: "zh-Hant",
    romanization: "xuéxí",
    ipa: "/ɕɥɛ³⁵ ɕi³⁵/",
    audioLocale: "zh-TW",
    partsOfSpeech: ["verb", "noun"],
    wordForms: [
      { label: "Traditional", form: "學習" },
      { label: "Simplified", form: "学习" },
      { label: "Pinyin", form: "xuéxí" },
    ],
    senses: [
      {
        id: "zh-hant-xuexi-s1",
        senseNumber: 1,
        partOfSpeech: "verb",
        domain: "education",
        definition: "To study; to learn; to acquire knowledge and skills.",
        localizedDefinitions: {
          en: "To study; to learn; to acquire knowledge and skills.",
          ms: "Belajar; menuntut ilmu pengetahuan dan kemahiran.",
          "zh-Hans": "学习，研习知识与技能（繁体字词头）。",
        },
        translations: [
          { language: "ms", terms: ["belajar", "mempelajari"] },
          { language: "en", terms: ["learn", "study"] },
          { language: "zh-Hans", terms: ["学习"], romanization: "xuéxí" },
          { language: "ja", terms: ["学習する"], romanization: "gakushū suru" },
        ],
        examples: [
          {
            text: "持續學習是掌握多門語言的關鍵。",
            romanization: "Chíxù xuéxí shì zhǎngwò duō mén yǔyán de guānjiàn.",
            translations: {
              en: "Continuous learning is the key to mastering multiple languages.",
              ms: "Pembelajaran berterusan adalah kunci untuk menguasai pelbagai bahasa.",
            },
          },
        ],
        synonyms: ["研習", "進修"],
        antonyms: [],
      },
    ],
    relatedWords: [{ word: "学习", language: "zh-Hans", relation: "Simplified Script" }],
    frequencyRank: 45,
  },

  // =========================================================================
  // INDONESIAN (id)
  // =========================================================================
  {
    id: "id-perpustakaan",
    slug: "perpustakaan",
    headword: "perpustakaan",
    language: "id",
    ipa: "/pər.pus.ta.ka.an/",
    audioLocale: "id-ID",
    partsOfSpeech: ["noun"],
    etymology: "From circumfix 'per-...-an' + root 'pustaka' (from Sanskrit पुस्तक pustaka, 'book, manuscript').",
    senses: [
      {
        id: "id-perpustakaan-s1",
        senseNumber: 1,
        partOfSpeech: "noun",
        domain: "education",
        definition: "Library; institution or room housing a collection of books, manuscripts, and reference materials.",
        localizedDefinitions: {
          en: "Library; institution or room housing a collection of books, manuscripts, and reference materials.",
          ms: "Perpustakaan; kutubkhanah; pusat atau bangunan yang menyimpan koleksi buku dan bahan bacaan.",
          "zh-Hans": "图书馆，藏书楼。",
        },
        translations: [
          { language: "ms", terms: ["perpustakaan", "kutubkhanah"] },
          { language: "en", terms: ["library"] },
          { language: "zh-Hans", terms: ["图书馆"], romanization: "túshūguǎn" },
          { language: "ja", terms: ["図書館"], romanization: "toshokan" },
          { language: "ar", terms: ["مَكْتَبَة"], romanization: "maktaba" },
        ],
        examples: [
          {
            text: "Perpustakaan Nasional menyimpan ribuan naskah kuno Nusantara.",
            translations: {
              en: "The National Library preserves thousands of ancient Nusantara manuscripts.",
              ms: "Perpustakaan Nasional menyimpan ribuan manuskrip kuno Nusantara.",
            },
          },
        ],
        synonyms: ["taman bacaan", "pustaka"],
        antonyms: [],
      },
    ],
    frequencyRank: 50,
  },
  {
    id: "id-kebijakan",
    slug: "kebijakan",
    headword: "kebijakan",
    language: "id",
    ipa: "/kə.bi.dʒa.kan/",
    audioLocale: "id-ID",
    partsOfSpeech: ["noun"],
    grammarNote:
      "Perbezaan semantik Nusantara: Dalam Bahasa Indonesia, 'kebijakan' lazimnya bermaksud 'dasar awam' (policy), manakala dalam Bahasa Melayu Malaysia, 'kebijaksanaan' merujuk kepada kearifan (wisdom) dan 'dasar' digunakan untuk 'policy'.",
    senses: [
      {
        id: "id-kebijakan-s1",
        senseNumber: 1,
        partOfSpeech: "noun",
        domain: "governance",
        definition: "Policy; a course or principle of action adopted or proposed by an organization or government.",
        localizedDefinitions: {
          en: "Policy; a course or principle of action adopted or proposed by an organization or government.",
          ms: "Dasar atau polisi pentadbiran (dalam penggunaan Bahasa Indonesia); kepandaian dan kemahiran bertindak.",
          "zh-Hans": "政策，方针（印尼语常用义）；明智。",
        },
        translations: [
          { language: "ms", terms: ["dasar", "polisi", "kebijaksanaan"] },
          { language: "en", terms: ["policy", "wisdom", "discretion"] },
          { language: "zh-Hans", terms: ["政策", "方针"], romanization: "zhèngcè" },
        ],
        examples: [
          {
            text: "Kebijakan pelestarian bahasa daerah didukung oleh para akademisi.",
            translations: {
              en: "The regional language preservation policy is supported by academics.",
              ms: "Dasar pemeliharaan bahasa daerah disokong oleh para ahli akademik.",
            },
          },
        ],
        synonyms: ["kebijaksanaan", "regulasi"],
        antonyms: [],
      },
    ],
    frequencyRank: 58,
  },

  // =========================================================================
  // JAPANESE (ja)
  // =========================================================================
  {
    id: "ja-taberu",
    slug: "食べる",
    headword: "食べる",
    language: "ja",
    romanization: "taberu",
    ipa: "/ta.be.ɾɯ/",
    audioLocale: "ja-JP",
    partsOfSpeech: ["verb"],
    wordForms: [
      { label: "Dictionary Form (終止形)", form: "食べる (taberu)" },
      { label: "Polite Form (ます形)", form: "食べます (tabemasu)" },
      { label: "Te-Form (て形)", form: "食べて (tabete)" },
      { label: "Past Form (た形)", form: "食べた (tabeta)" },
    ],
    senses: [
      {
        id: "ja-taberu-s1",
        senseNumber: 1,
        partOfSpeech: "verb",
        definition: "To eat; to consume food; (figuratively) to make a living.",
        localizedDefinitions: {
          en: "To eat; to consume food; (figuratively) to make a living.",
          ms: "Makan; menjamah makanan; (kiasan) menyara hidup.",
          "zh-Hans": "吃，进食；（比喻）谋生，靠……生活。",
        },
        translations: [
          { language: "ms", terms: ["makan"] },
          { language: "en", terms: ["eat", "consume"] },
          { language: "zh-Hans", terms: ["吃"], romanization: "chī" },
          { language: "ko", terms: ["먹다"], romanization: "meokda" },
        ],
        examples: [
          {
            text: "毎朝、新鮮な果物を食べるようにしています。",
            romanization: "Maiasa, shinsen na kudamono o taberu yō ni shite imasu.",
            translations: {
              en: "Every morning, I make a point of eating fresh fruit.",
              ms: "Setiap pagi, saya berusaha untuk makan buah-buahan segar.",
            },
          },
        ],
        synonyms: ["食う", "召し上がる"],
        antonyms: [],
      },
    ],
    frequencyRank: 24,
  },
  {
    id: "ja-kotoba",
    slug: "言葉",
    headword: "言葉",
    language: "ja",
    romanization: "kotoba",
    ipa: "/ko.to.ba/",
    audioLocale: "ja-JP",
    partsOfSpeech: ["noun"],
    etymology: "Compound of 言 (koto, 'word, speech') + 葉 (ha/ba, 'leaf').",
    senses: [
      {
        id: "ja-kotoba-s1",
        senseNumber: 1,
        partOfSpeech: "noun",
        domain: "linguistics",
        definition: "Word; language; speech; expression or manner of speaking.",
        localizedDefinitions: {
          en: "Word; language; speech; expression or manner of speaking.",
          ms: "Perkataan; bahasa; pertuturan atau ungkapan.",
          "zh-Hans": "词语，话语，语言，措辞。",
        },
        translations: [
          { language: "ms", terms: ["perkataan", "bahasa", "ungkapan"] },
          { language: "en", terms: ["word", "language", "speech"] },
          { language: "zh-Hans", terms: ["词语", "语言", "话语"], romanization: "cíyǔ, yǔyán" },
        ],
        examples: [
          {
            text: "優しい言葉は人の心を温かくする。",
            romanization: "Yasashii kotoba wa hito no kokoro o atatakaku suru.",
            translations: {
              en: "Kind words warm a person's heart.",
              ms: "Kata-kata yang lembut menghangatkan hati manusia.",
            },
          },
        ],
        synonyms: ["単語", "言語"],
        antonyms: [],
      },
    ],
    frequencyRank: 44,
  },

  // =========================================================================
  // KOREAN (ko)
  // =========================================================================
  {
    id: "ko-mul",
    slug: "물",
    headword: "물",
    language: "ko",
    romanization: "mul",
    ipa: "/mul/",
    audioLocale: "ko-KR",
    partsOfSpeech: ["noun"],
    etymology: "From Middle Korean 물 (mwul).",
    senses: [
      {
        id: "ko-mul-s1",
        senseNumber: 1,
        partOfSpeech: "noun",
        definition: "Water; liquid.",
        localizedDefinitions: {
          en: "Water; liquid.",
          ms: "Air; cecair minuman.",
          "zh-Hans": "水，液体。",
        },
        translations: [
          { language: "ms", terms: ["air"] },
          { language: "en", terms: ["water"] },
          { language: "zh-Hans", terms: ["水"], romanization: "shuǐ" },
          { language: "ja", terms: ["水"], romanization: "mizu" },
        ],
        examples: [
          {
            text: "운동을 한 후에 시원한 물을 마셨어요.",
            romanization: "Undong-eul han hu-e siwonhan mul-eul masyeosseoyo.",
            translations: {
              en: "I drank cool water after exercising.",
              ms: "Saya minum air sejuk selepas bersenam.",
            },
          },
        ],
        synonyms: ["수분"],
        antonyms: ["불"],
      },
    ],
    frequencyRank: 31,
  },

  // =========================================================================
  // THAI (th)
  // =========================================================================
  {
    id: "th-ahan",
    slug: "อาหาร",
    headword: "อาหาร",
    language: "th",
    romanization: "aa-hǎan (ahan)",
    ipa: "/ʔaː˧.haːn˩˩˦/",
    audioLocale: "th-TH",
    partsOfSpeech: ["noun"],
    etymology: "Borrowed from Pali and Sanskrit आहार (āhāra, 'food, nourishment').",
    senses: [
      {
        id: "th-ahan-s1",
        senseNumber: 1,
        partOfSpeech: "noun",
        domain: "culinary",
        definition: "Food; meal; nourishment.",
        localizedDefinitions: {
          en: "Food; meal; nourishment.",
          ms: "Makanan; hidangan; santapan.",
          "zh-Hans": "食物，饭菜，膳食。",
        },
        translations: [
          { language: "ms", terms: ["makanan", "hidangan"] },
          { language: "en", terms: ["food", "meal", "cuisine"] },
          { language: "zh-Hans", terms: ["食物", "菜肴"], romanization: "shíwù" },
        ],
        examples: [
          {
            text: "อาหารไทยมีรสชาติกลมกล่อมและมีกลิ่นหอมของสมุนไพร",
            romanization: "Aa-hǎan thai mii rót-châat klom-klɔ̀m lɛ́ mii klìn hɔ̌ɔm khɔ̌ɔng sà-mǔn-phrai.",
            translations: {
              en: "Thai food has a balanced flavor and the fragrant aroma of herbs.",
              ms: "Makanan Thai mempunyai rasa yang seimbang dan aroma herba yang harum.",
            },
          },
        ],
        synonyms: ["ของกิน", "โภชนา"],
        antonyms: [],
      },
    ],
    frequencyRank: 52,
  },

  // =========================================================================
  // ARABIC (ar) — Right-to-Left (RTL)
  // =========================================================================
  {
    id: "ar-ilm",
    slug: "علم",
    headword: "عِلْم",
    language: "ar",
    romanization: "ʿilm",
    ipa: "/ʕilm/",
    audioLocale: "ar-SA",
    partsOfSpeech: ["noun"],
    etymology: "From the triliteral root ع ل م (ʿ-l-m, 'to know'). Etymological source of Malay/Indonesian 'ilmu'.",
    wordForms: [
      { label: "Singular (مفرد)", form: "عِلْم (ʿilm)" },
      { label: "Plural (جمع)", form: "عُلُوم (ʿulūm)" },
      { label: "Unvocalized", form: "علم" },
    ],
    senses: [
      {
        id: "ar-ilm-s1",
        senseNumber: 1,
        partOfSpeech: "noun",
        domain: "education",
        definition: "Knowledge; science; learning; scholarship.",
        localizedDefinitions: {
          en: "Knowledge; science; learning; scholarship.",
          ms: "Ilmu pengetahuan; sains; makrifat.",
          "zh-Hans": "知识，科学，学问。",
        },
        translations: [
          { language: "ms", terms: ["ilmu", "pengetahuan", "sains"] },
          { language: "en", terms: ["knowledge", "science", "learning"] },
          { language: "zh-Hans", terms: ["知识", "科学"], romanization: "zhīshi, kēxué" },
          { language: "id", terms: ["ilmu", "sains"] },
        ],
        examples: [
          {
            text: "طَلَبُ الْعِلْمِ يَبْنِي الْمُجْتَمَعَاتِ وَيُعَزِّزُ التَّفَاهُمَ.",
            romanization: "Ṭalabu l-ʿilmi yabnī l-mujtamaʿāti wa-yuʿazzizu t-tafāhuma.",
            translations: {
              en: "The pursuit of knowledge builds societies and strengthens mutual understanding.",
              ms: "Menuntut ilmu membina masyarakat dan memperkukuh persefahaman.",
            },
          },
        ],
        synonyms: ["مَعْرِفَة", "دِرَايَة"],
        antonyms: ["جَهْل"],
      },
    ],
    relatedWords: [{ word: "ilmu", language: "ms", relation: "Malay Loanword Descendant" }],
    frequencyRank: 33,
    featured: true,
  },
  {
    id: "ar-kitab",
    slug: "كتاب",
    headword: "كِتَاب",
    language: "ar",
    romanization: "kitāb",
    ipa: "/ki.taːb/",
    audioLocale: "ar-SA",
    partsOfSpeech: ["noun"],
    etymology: "From the triliteral root ك ت ب (k-t-b, 'to write'). Source of Malay 'kitab'.",
    wordForms: [
      { label: "Singular (مفرد)", form: "كِتَاب (kitāb)" },
      { label: "Plural (جمع)", form: "كُتُب (kutub)" },
      { label: "Unvocalized", form: "كتاب" },
    ],
    senses: [
      {
        id: "ar-kitab-s1",
        senseNumber: 1,
        partOfSpeech: "noun",
        definition: "Book; written work; treatise.",
        localizedDefinitions: {
          en: "Book; written work; treatise.",
          ms: "Buku; kitab; karya bertulis.",
          "zh-Hans": "书，书籍，经典。",
        },
        translations: [
          { language: "ms", terms: ["buku", "kitab"] },
          { language: "en", terms: ["book", "volume"] },
          { language: "zh-Hans", terms: ["书", "书籍"], romanization: "shū" },
        ],
        examples: [
          {
            text: "هٰذَا الْكِتَابُ يَشْرَحُ قَوَاعِدَ اللُّغَةِ بِوُضُوحٍ.",
            romanization: "Hāḏā l-kitābu yašraḥu qawāʿida l-luġati bi-wuḍūḥin.",
            translations: {
              en: "This book explains the rules of the language clearly.",
              ms: "Kitab/buku ini menerangkan kaedah tatabahasa dengan jelas.",
            },
          },
        ],
        synonyms: ["مُؤَلَّف", "سِفْر"],
        antonyms: [],
      },
    ],
    frequencyRank: 39,
  },

  // =========================================================================
  // SPANISH (es)
  // =========================================================================
  {
    id: "es-espanol",
    slug: "español",
    headword: "español",
    language: "es",
    ipa: "/es.paˈɲol/",
    audioLocale: "es-ES",
    partsOfSpeech: ["noun", "adjective"],
    etymology: "From Old Occitan espanhol, from Late Latin Hispaniolus ('of Hispania').",
    senses: [
      {
        id: "es-espanol-s1",
        senseNumber: 1,
        partOfSpeech: "noun",
        domain: "linguistics",
        definition: "Spanish; the Romance language originating in Castile, Spain.",
        localizedDefinitions: {
          en: "Spanish; the Romance language originating in Castile, Spain.",
          ms: "Bahasa Sepanyol; bahasa Romawi yang berasal dari Sepanyol.",
          "zh-Hans": "西班牙语。",
        },
        translations: [
          { language: "ms", terms: ["bahasa Sepanyol"] },
          { language: "en", terms: ["Spanish", "Castilian"] },
          { language: "zh-Hans", terms: ["西班牙语"], romanization: "Xībānyáyǔ" },
        ],
        examples: [
          {
            text: "El español se habla en más de veinte países del mundo.",
            translations: {
              en: "Spanish is spoken in more than twenty countries around the world.",
              ms: "Bahasa Sepanyol dituturkan di lebih daripada dua puluh buah negara di dunia.",
            },
          },
        ],
        synonyms: ["castellano"],
        antonyms: [],
      },
    ],
    frequencyRank: 46,
  },

  // =========================================================================
  // FRENCH (fr)
  // =========================================================================
  {
    id: "fr-cafe",
    slug: "café",
    headword: "café",
    language: "fr",
    ipa: "/ka.fe/",
    audioLocale: "fr-FR",
    partsOfSpeech: ["noun"],
    etymology: "Borrowed via Italian caffè from Ottoman Turkish قهوه (kahve), from Arabic قَهْوَة (qahwa). Cognate with Malay 'kopi' and 'kahwa'.",
    senses: [
      {
        id: "fr-cafe-s1",
        senseNumber: 1,
        partOfSpeech: "noun",
        domain: "culinary",
        definition: "Coffee (beverage or roasted beans); café or coffeehouse.",
        localizedDefinitions: {
          en: "Coffee (beverage or roasted beans); café or coffeehouse.",
          ms: "Kopi (minuman atau biji kopi); kedai kopi atau kafe.",
          "zh-Hans": "咖啡；咖啡馆。",
        },
        translations: [
          { language: "ms", terms: ["kopi", "kafe"] },
          { language: "en", terms: ["coffee", "café"] },
          { language: "zh-Hans", terms: ["咖啡", "咖啡馆"], romanization: "kāfēi, kāfēiguǎn" },
        ],
        examples: [
          {
            text: "Nous avons discuté de littérature autour d'une tasse de café chaud.",
            translations: {
              en: "We discussed literature over a cup of hot coffee.",
              ms: "Kami berbincang tentang kesusasteraan sambil menikmati secawan kopi panas.",
            },
          },
        ],
        synonyms: ["bistrot"],
        antonyms: [],
      },
    ],
    frequencyRank: 49,
  },

  // =========================================================================
  // GERMAN (de)
  // =========================================================================
  {
    id: "de-worterbuch",
    slug: "Wörterbuch",
    headword: "Wörterbuch",
    language: "de",
    ipa: "/ˈvœʁ.tɐˌbuːx/",
    audioLocale: "de-DE",
    partsOfSpeech: ["noun"],
    etymology: "Compound of Wörter (plural of Wort, 'word') + Buch ('book'), calque of Dutch woordenboek / Latin dictionarium.",
    wordForms: [
      { label: "Nominative Singular", form: "das Wörterbuch" },
      { label: "Genitive Singular", form: "des Wörterbuches / Wörterbuchs" },
      { label: "Nominative Plural", form: "die Wörterbücher" },
    ],
    senses: [
      {
        id: "de-worterbuch-s1",
        senseNumber: 1,
        partOfSpeech: "noun",
        domain: "linguistics",
        definition: "Dictionary; lexicon.",
        localizedDefinitions: {
          en: "Dictionary; lexicon.",
          ms: "Kamus; buku rujukan kosa kata.",
          "zh-Hans": "词典，字典。",
        },
        translations: [
          { language: "ms", terms: ["kamus"] },
          { language: "en", terms: ["dictionary", "lexicon"] },
          { language: "zh-Hans", terms: ["词典", "字典"], romanization: "cídiǎn" },
        ],
        examples: [
          {
            text: "Ein gutes Wörterbuch erklärt auch die Herkunft und Grammatik der Wörter.",
            translations: {
              en: "A good dictionary also explains the origin and grammar of words.",
              ms: "Sebuah kamus yang baik turut menerangkan asal-usul dan tatabahasa perkataan.",
            },
          },
        ],
        synonyms: ["Lexikon", "Vokabular"],
        antonyms: [],
      },
    ],
    frequencyRank: 54,
  },
];

export const MULTILINGUAL_STARTER_ENTRIES: LexiconEntry[] =
  rawMultilingualEntries.map((entry) => ({
    ...entry,
    normalizedHeadword: normalizeSearchKey(entry.headword),
    provenance: makeProvenance(entry.language, entry.headword),
  }));
