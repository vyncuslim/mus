import type { LexiconEntry } from "@/types/lexicon";
import { normalizeSearchKey } from "@/lib/text-normalize";

const WIKTIONARY_PROVENANCE = (word: string) => ({
  sourceName: "Kaikki.org / Malay & English Wiktionary (Wiktextract)",
  sourceUrl: `https://ms.wiktionary.org/wiki/${encodeURIComponent(word)}`,
  license: "CC BY-SA 4.0 / GFDL",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  sourceVersion: "wiktextract-2026-09",
  importedAt: "2026-10-01T00:00:00.000Z",
});

const rawMalayEntries: Omit<LexiconEntry, "normalizedHeadword" | "provenance">[] = [
  {
    id: "ms-makan",
    slug: "makan",
    headword: "makan",
    language: "ms",
    ipa: "/ma.kan/",
    audioLocale: "ms-MY",
    partsOfSpeech: ["verb"],
    etymology: "Inherited from Proto-Malayic *makan, from Proto-Malayo-Polynesian *makan (root *kan 'to eat').",
    wordForms: [
      { label: "Kata Dasar", form: "makan" },
      { label: "Kata Nama Terbitan (-an)", form: "makanan" },
      { label: "Kata Kerja Aktif (meN-)", form: "memakan" },
      { label: "Kata Kerja Pasif (di-)", form: "dimakan" },
      { label: "Kata Kerja Tak Sengaja (teR-)", form: "termakan" },
      { label: "Kata Nama Pelaku (peN-)", form: "pemakan" },
    ],
    grammarNote:
      "Dalam Bahasa Melayu baku, 'makan' lazim digunakan sebagai kata kerja transitif tanpa awalan 'meN-' bagi maksud menyuap rezeki/hidangan harian (cth. 'makan nasi'), manakala 'memakan' sering membawa maksud menghabiskan masa, kos, atau memusnahkan (cth. 'memakan masa dua jam').",
    malayMorphology: {
      morphologyType: "kata_dasar",
      golonganKata: "kata_kerja",
      kataDasar: "makan",
      affixType: "none",
      affixPattern: "Kata Dasar Tulen",
      formula: "makan (kata dasar / kata kerja)",
      explanationMs:
        "'makan' ialah kata dasar kerja yang menjadi induk kepada keluarga kata terbitan seperti 'makanan' (akhiran -an), 'memakan' (awalan meN-), 'termakan' (awalan teR-), dan 'pemakan' (awalan peN-).",
      explanationEn:
        "'makan' is a fundamental Malay verbal root word (kata dasar) from which nouns and verbs such as 'makanan' (food), 'memakan' (to consume), 'termakan' (accidentally eaten), and 'pemakan' (eater) are derived.",
      explanationZh:
        "“makan”是马来语核心动词词根 (Kata Dasar)，通过添加后缀或前缀可派生出 makanan（食物）、memakan（吞噬/耗费）、termakan（误食）等派生词。",
      derivedWords: ["makanan", "memakan", "termakan"],
      verificationMethod: "verified_lexical_entry",
    },
    senses: [
      {
        id: "ms-makan-s1",
        senseNumber: 1,
        partOfSpeech: "verb",
        domain: "general",
        definition: "To eat; to chew and swallow food as nourishment.",
        localizedDefinitions: {
          en: "To eat; to chew and swallow food as nourishment.",
          ms: "Mengunyah serta menelan makanan (seperti nasi, roti, atau lauk-pauk).",
          "zh-Hans": "吃，进食；咀嚼并吞咽食物。",
        },
        translations: [
          { language: "en", terms: ["eat", "dine", "consume"] },
          { language: "zh-Hans", terms: ["吃", "进食"], romanization: "chī, jìnshí" },
          { language: "zh-Hant", terms: ["吃", "進食"], romanization: "chī, jìnshí" },
          { language: "id", terms: ["makan", "santap"] },
          { language: "ja", terms: ["食べる"], romanization: "taberu" },
          { language: "ko", terms: ["먹다"], romanization: "meokda" },
          { language: "th", terms: ["กิน", "รับประทาน"], romanization: "kin, rap-pra-than" },
          { language: "ar", terms: ["أَكَلَ"], romanization: "ʾakala" },
          { language: "es", terms: ["comer"] },
          { language: "fr", terms: ["manger"] },
          { language: "de", terms: ["essen"] },
        ],
        examples: [
          {
            text: "Kami sekeluarga makan malam bersama-sama pada pukul lapan.",
            translations: {
              en: "Our whole family eats dinner together at eight o'clock.",
              "zh-Hans": "我们全家人八点钟一起吃晚饭。",
            },
          },
        ],
        synonyms: ["santap", "jamah"],
        antonyms: ["puasa"],
      },
      {
        id: "ms-makan-s2",
        senseNumber: 2,
        partOfSpeech: "verb",
        register: "figurative",
        domain: "idiomatic",
        definition: "To consume, require, or use up (time, cost, energy, or space).",
        localizedDefinitions: {
          en: "To consume, require, or use up (time, cost, energy, or space).",
          ms: "Memerlukan atau menghabiskan sesuatu seperti masa, belanja, atau tenaga.",
          "zh-Hans": "耗费，消耗（时间、金钱或精力）。",
        },
        translations: [
          { language: "en", terms: ["consume", "take up", "require"] },
          { language: "zh-Hans", terms: ["耗费", "消耗"], romanization: "hàofèi, xiāohào" },
          { language: "id", terms: ["memakan", "menghabiskan"] },
        ],
        examples: [
          {
            text: "Kerja pemulihan bangunan bersejarah itu makan masa hampir tiga tahun.",
            translations: {
              en: "The restoration work on the historic building took almost three years.",
              "zh-Hans": "这座历史建筑的修复工作耗时近三年。",
            },
          },
        ],
        synonyms: ["menghabiskan", "memerlukan"],
        antonyms: ["menjimatkan"],
      },
    ],
    relatedWords: [
      { word: "makanan", language: "ms", relation: "Kata Terbitan (-an)" },
      { word: "memakan", language: "ms", relation: "Kata Terbitan (meN-)" },
      { word: "termakan", language: "ms", relation: "Kata Terbitan (teR-)" },
    ],
    frequencyRank: 12,
    featured: true,
  },
  {
    id: "ms-makanan",
    slug: "makanan",
    headword: "makanan",
    language: "ms",
    ipa: "/ma.ka.nan/",
    audioLocale: "ms-MY",
    partsOfSpeech: ["noun"],
    etymology: "Derived from Malay root 'makan' (to eat) + nominalizing suffix '-an'.",
    wordForms: [
      { label: "Kata Dasar", form: "makan" },
      { label: "Kata Terbitan", form: "makanan" },
      { label: "Kata Ganda", form: "makanan-makanan" },
    ],
    grammarNote:
      "Imbuhan akhiran '-an' pada kata kerja 'makan' menukarkan golongan katanya menjadi kata nama konkrit yang membawa maksud 'hasil atau objek yang dimakan'.",
    malayMorphology: {
      morphologyType: "kata_terbitan",
      golonganKata: "kata_nama",
      kataDasar: "makan",
      affixType: "akhiran",
      affixPattern: "-an",
      formula: "makan (kata dasar kerja) + -an (akhiran pembentuk kata nama) → makanan",
      explanationMs:
        "'makanan' ialah kata nama terbitan yang terbentuk melalui cantuman kata dasar 'makan' dengan imbuhan akhiran '-an', membawa maksud sesuatu yang dimakan (objek perbuatan).",
      explanationEn:
        "'makanan' is a derived noun (kata nama terbitan) formed by attaching the nominalizing suffix '-an' to the verbal root 'makan' (to eat), denoting that which is eaten (food/provisions).",
      explanationZh:
        "“makanan”是由动词词根“makan”（吃）加上名词化后缀“-an”构成的派生名词，表示“被吃的东西”（即食物、食品）。",
      derivedWords: ["makan", "memakan", "termakan"],
      verificationMethod: "verified_lexical_entry",
    },
    senses: [
      {
        id: "ms-makanan-s1",
        senseNumber: 1,
        partOfSpeech: "noun",
        domain: "culinary",
        definition: "Food; nourishment; any nutritious substance that people or animals eat.",
        localizedDefinitions: {
          en: "Food; nourishment; any nutritious substance that people or animals eat.",
          ms: "Apa-apa sahaja yang boleh dimakan (seperti nasi, sayur, buah-buahan, dan kuih-muih) untuk memberi khasiat kepada tubuh.",
          "zh-Hans": "食物，食品，粮食；供人或动物食用的营养物质。",
        },
        translations: [
          { language: "en", terms: ["food", "nourishment", "fare", "provisions"] },
          { language: "zh-Hans", terms: ["食物", "食品"], romanization: "shíwù, shípǐn" },
          { language: "zh-Hant", terms: ["食物", "食品"], romanization: "shíwù, shípǐn" },
          { language: "id", terms: ["makanan", "pangan", "santapan"] },
          { language: "ja", terms: ["食べ物", "食事"], romanization: "tabemono, shokuji" },
          { language: "ko", terms: ["음식", "식품"], romanization: "eumsik, sikpum" },
          { language: "th", terms: ["อาหาร"], romanization: "ahan" },
          { language: "ar", terms: ["طَعَام", "غِذَاء"], romanization: "ṭaʿām, ġiḏāʾ" },
          { language: "es", terms: ["comida", "alimento"] },
          { language: "fr", terms: ["nourriture", "aliment"] },
          { language: "de", terms: ["Essen", "Lebensmittel", "Nahrung"] },
        ],
        examples: [
          {
            text: "Makanan tradisional Melayu kaya dengan rempah-ratus dan herba segar.",
            translations: {
              en: "Traditional Malay food is rich in spices and fresh herbs.",
              "zh-Hans": "传统马来食物富含香料和新鲜香草。",
            },
          },
        ],
        synonyms: ["santapan", "juadah", "rezeki", "hidangan"],
        antonyms: ["minuman"],
      },
    ],
    relatedWords: [
      { word: "makan", language: "ms", relation: "Kata Dasar (Root)" },
      { word: "memakan", language: "ms", relation: "Kata Terbitan Sebaya" },
      { word: "termakan", language: "ms", relation: "Kata Terbitan Sebaya" },
    ],
    frequencyRank: 15,
    featured: true,
  },
  {
    id: "ms-memakan",
    slug: "memakan",
    headword: "memakan",
    language: "ms",
    ipa: "/mə.ma.kan/",
    audioLocale: "ms-MY",
    partsOfSpeech: ["verb"],
    etymology: "From prefix 'meN-' + root 'makan'.",
    malayMorphology: {
      morphologyType: "kata_terbitan",
      golonganKata: "kata_kerja",
      kataDasar: "makan",
      affixType: "awalan",
      affixPattern: "meN-",
      formula: "meN- (awalan kata kerja aktif) + makan (kata dasar) → memakan",
      morphophonemicRule:
        "Awalan 'meN-' menjadi alomorf 'me-' apabila bertemu kata dasar yang bermula dengan konsonan sengau /m/, /n/, /ny/, /ng/ atau likuida /l/, /r/.",
      explanationMs:
        "'memakan' terbentuk daripada awalan 'meN-' (alomorf 'me-') dan kata dasar 'makan'. Digunakan untuk maksud membinasakan, memerlukan kos/masa, atau memakan sesuatu secara aktif.",
      explanationEn:
        "'memakan' is formed with active verbal prefix 'meN-' (allomorph 'me-' before nasal /m/) + root 'makan'. Often used for consuming resources, time, or prey.",
      derivedWords: ["makan", "makanan", "termakan"],
      verificationMethod: "verified_lexical_entry",
    },
    senses: [
      {
        id: "ms-memakan-s1",
        senseNumber: 1,
        partOfSpeech: "verb",
        definition: "To consume, devour, or take up (time, cost, or lives).",
        localizedDefinitions: {
          en: "To consume, devour, or take up (time, cost, or lives).",
          ms: "Menelan, menghancurkan, atau memerlukan penggunaan masa dan perbelanjaan yang banyak.",
          "zh-Hans": "吞食；消耗，耗费（时间、费用等）。",
        },
        translations: [
          { language: "en", terms: ["consume", "devour", "take up"] },
          { language: "zh-Hans", terms: ["耗费", "吞食"], romanization: "hàofèi, tūnshí" },
          { language: "id", terms: ["memakan"] },
        ],
        examples: [
          {
            text: "Projek pembinaan jambatan baharu itu memakan belanja berjuta-juta ringgit.",
            translations: {
              en: "The new bridge construction project consumed millions of ringgit.",
              "zh-Hans": "那座新桥的建设项目耗资数百万令吉。",
            },
          },
        ],
        synonyms: ["menelan", "menghabiskan"],
        antonyms: [],
      },
    ],
    relatedWords: [
      { word: "makan", language: "ms", relation: "Kata Dasar (Root)" },
      { word: "makanan", language: "ms", relation: "Kata Terbitan (-an)" },
    ],
    frequencyRank: 80,
  },
  {
    id: "ms-termakan",
    slug: "termakan",
    headword: "termakan",
    language: "ms",
    ipa: "/tər.ma.kan/",
    audioLocale: "ms-MY",
    partsOfSpeech: ["verb"],
    etymology: "From prefix 'teR-' (non-volitional/accidental) + root 'makan'.",
    malayMorphology: {
      morphologyType: "kata_terbitan",
      golonganKata: "kata_kerja",
      kataDasar: "makan",
      affixType: "awalan",
      affixPattern: "teR-",
      formula: "teR- (awalan tak sengaja / keupayaan) + makan (kata dasar) → termakan",
      explanationMs:
        "'termakan' menggunakan awalan 'teR-' pada kata dasar 'makan' untuk menunjukkan perbuatan makan secara tidak sengaja atau terpedaya (cth. termakan pujuk rayu).",
      explanationEn:
        "'termakan' attaches the non-volitional prefix 'teR-' to 'makan', indicating accidental ingestion or figuratively falling for persuasion.",
      derivedWords: ["makan", "makanan", "memakan"],
      verificationMethod: "verified_lexical_entry",
    },
    senses: [
      {
        id: "ms-termakan-s1",
        senseNumber: 1,
        partOfSpeech: "verb",
        definition: "To eat accidentally; figuratively, to be swayed or deceived by words/flattery.",
        localizedDefinitions: {
          en: "To eat accidentally; figuratively, to be swayed or deceived by words or flattery.",
          ms: "Makan secara tidak sengaja; (kiasan) terpengaruh atau terpedaya oleh kata-kata atau pujukan.",
          "zh-Hans": "误食；（比喻）轻信、受骗于甜言蜜语。",
        },
        translations: [
          { language: "en", terms: ["eat accidentally", "fall for (flattery)"] },
          { language: "zh-Hans", terms: ["误食", "轻信"], romanization: "wùshí, qīngxìn" },
        ],
        examples: [
          {
            text: "Jangan mudah termakan janji manis yang belum tentu benar.",
            translations: {
              en: "Do not easily fall for sweet promises that are not necessarily true.",
              "zh-Hans": "不要轻易轻信未必真实的甜言蜜语。",
            },
          },
        ],
        synonyms: ["terpedaya", "terpengaruh"],
        antonyms: [],
      },
    ],
    relatedWords: [
      { word: "makan", language: "ms", relation: "Kata Dasar (Root)" },
      { word: "makanan", language: "ms", relation: "Kata Terbitan (-an)" },
    ],
    frequencyRank: 120,
  },
  {
    id: "ms-ajar",
    slug: "ajar",
    headword: "ajar",
    language: "ms",
    ipa: "/a.dʒar/",
    audioLocale: "ms-MY",
    partsOfSpeech: ["verb", "noun"],
    etymology: "From Sanskrit आचार्य (ācārya, 'teacher, spiritual guide') via Old Malay.",
    wordForms: [
      { label: "Kata Dasar", form: "ajar" },
      { label: "Kata Kerja Intransitif (bel-)", form: "belajar" },
      { label: "Kata Kerja Transitif (meN-)", form: "mengajar" },
      { label: "Kata Nama Pelaku (pel-)", form: "pelajar" },
      { label: "Kata Nama Pelaku (peN-)", form: "pengajar" },
      { label: "Kata Nama Terbitan (pel-...-an)", form: "pelajaran" },
      { label: "Kata Nama Terbitan (peN-...-an)", form: "pengajaran" },
    ],
    malayMorphology: {
      morphologyType: "kata_dasar",
      golonganKata: "kata_kerja",
      kataDasar: "ajar",
      affixType: "none",
      affixPattern: "Kata Dasar Tulen",
      formula: "ajar (kata dasar)",
      explanationMs:
        "'ajar' ialah kata dasar penting dalam morfologi Melayu kerana memperlihatkan perbezaan alomorf 'bel-/pel-' (belajar, pelajar, pelajaran) berbanding 'meng-/peng-' (mengajar, pengajar, pengajaran).",
      explanationEn:
        "'ajar' is a classic Malay root showcasing the productive contrast between the 'bel-/pel-' paradigm (belajar 'to study', pelajar 'student', pelajaran 'lesson') and the 'meng-/peng-' paradigm (mengajar 'to teach', pengajar 'instructor', pengajaran 'teaching/moral').",
      explanationZh:
        "“ajar”是马来语教学类核心词根，展现了 bel-/pel-（学习、学生、课程）与 meng-/peng-（教授、教师、教训）两组对称词缀派生体系。",
      derivedWords: ["belajar", "pelajar", "mengajar", "pengajaran"],
      verificationMethod: "verified_lexical_entry",
    },
    senses: [
      {
        id: "ms-ajar-s1",
        senseNumber: 1,
        partOfSpeech: "verb",
        domain: "education",
        definition: "Root form pertaining to instruction, imparting knowledge, or guiding conduct.",
        localizedDefinitions: {
          en: "Root form pertaining to instruction, imparting knowledge, or guiding conduct.",
          ms: "Kata dasar yang berkaitan dengan perbuatan memberi petunjuk, ilmu pengetahuan, atau didikan.",
          "zh-Hans": "教导，训导，传授知识（词根形式）。",
        },
        translations: [
          { language: "en", terms: ["teach", "instruct", "educate"] },
          { language: "zh-Hans", terms: ["教", "指导"], romanization: "jiāo, zhǐdǎo" },
          { language: "id", terms: ["ajar"] },
        ],
        examples: [
          {
            text: "Ibu bapa memberikan tunjuk ajar yang berguna kepada anak-anak sejak kecil.",
            translations: {
              en: "Parents give useful guidance and instruction to their children from a young age.",
              "zh-Hans": "父母从小给予孩子们有益的指导与教诲。",
            },
          },
        ],
        synonyms: ["didik", "bimbing"],
        antonyms: [],
      },
    ],
    relatedWords: [
      { word: "belajar", language: "ms", relation: "Kata Terbitan (bel-)" },
      { word: "pelajar", language: "ms", relation: "Kata Terbitan (pel-)" },
      { word: "mengajar", language: "ms", relation: "Kata Terbitan (meN-)" },
      { word: "pengajaran", language: "ms", relation: "Kata Terbitan (peN-...-an)" },
    ],
    frequencyRank: 25,
    featured: true,
  },
  {
    id: "ms-belajar",
    slug: "belajar",
    headword: "belajar",
    language: "ms",
    ipa: "/bə.la.dʒar/",
    audioLocale: "ms-MY",
    partsOfSpeech: ["verb"],
    etymology: "From prefix 'beR-' (special allomorph 'bel-') + root 'ajar'.",
    malayMorphology: {
      morphologyType: "kata_terbitan",
      golonganKata: "kata_kerja",
      kataDasar: "ajar",
      affixType: "awalan",
      affixPattern: "bel- (alomorf beR-)",
      formula: "beR- (alomorf bel-) + ajar (kata dasar) → belajar",
      morphophonemicRule:
        "Awalan 'beR-' berubah menjadi alomorf 'bel-' khusus apabila bertemu dengan kata dasar 'ajar'.",
      explanationMs:
        "'belajar' terbentuk daripada awalan 'beR-' (dalam bentuk alomorf 'bel-') + kata dasar 'ajar', membawa maksud berusaha memperoleh ilmu atau kemahiran.",
      explanationEn:
        "'belajar' is formed from prefix 'beR-' (realized as allomorph 'bel-') + root 'ajar', meaning to study or acquire knowledge.",
      derivedWords: ["ajar", "pelajar", "mengajar", "pengajaran"],
      verificationMethod: "verified_lexical_entry",
    },
    senses: [
      {
        id: "ms-belajar-s1",
        senseNumber: 1,
        partOfSpeech: "verb",
        domain: "education",
        definition: "To study; to learn; to acquire knowledge or skill through study or experience.",
        localizedDefinitions: {
          en: "To study; to learn; to acquire knowledge or skill through study or experience.",
          ms: "Berusaha untuk memperoleh ilmu pengetahuan, kemahiran, atau latihan.",
          "zh-Hans": "学习，读书，求学。",
        },
        translations: [
          { language: "en", terms: ["learn", "study"] },
          { language: "zh-Hans", terms: ["学习", "求学"], romanization: "xuéxí, qiúxué" },
          { language: "zh-Hant", terms: ["學習"], romanization: "xuéxí" },
          { language: "id", terms: ["belajar"] },
          { language: "ja", terms: ["学ぶ", "勉強する"], romanization: "manabu, benkyō suru" },
          { language: "ko", terms: ["공부하다", "배우다"], romanization: "gongbuhada, baeuda" },
          { language: "th", terms: ["เรียนรู้", "ศึกษา"], romanization: "rian-ru, sueksa" },
          { language: "ar", terms: ["تَعَلَّمَ", "دَرَسَ"], romanization: "taʿallama, darasa" },
          { language: "es", terms: ["aprender", "estudiar"] },
          { language: "fr", terms: ["apprendre", "étudier"] },
          { language: "de", terms: ["lernen", "studieren"] },
        ],
        examples: [
          {
            text: "Mereka sedang belajar bahasa Melayu dan bahasa Jepun di universiti.",
            translations: {
              en: "They are studying Malay and Japanese at the university.",
              "zh-Hans": "他们正在大学里学习马来语和日语。",
            },
          },
        ],
        synonyms: ["menuntut ilmu", "menelaah"],
        antonyms: ["mengajar"],
      },
    ],
    relatedWords: [
      { word: "ajar", language: "ms", relation: "Kata Dasar (Root)" },
      { word: "pelajar", language: "ms", relation: "Kata Terbitan (pel-)" },
      { word: "mengajar", language: "ms", relation: "Kata Kerja Berlawanan" },
    ],
    frequencyRank: 18,
    featured: true,
  },
  {
    id: "ms-pelajar",
    slug: "pelajar",
    headword: "pelajar",
    language: "ms",
    ipa: "/pə.la.dʒar/",
    audioLocale: "ms-MY",
    partsOfSpeech: ["noun"],
    etymology: "From prefix 'peN-' (allomorph 'pel-') + root 'ajar'.",
    malayMorphology: {
      morphologyType: "kata_terbitan",
      golonganKata: "kata_nama",
      kataDasar: "ajar",
      affixType: "awalan",
      affixPattern: "pel- (alomorf peN-)",
      formula: "peN- (alomorf pel-) + ajar (kata dasar) → pelajar",
      morphophonemicRule:
        "Bentuk 'pelajar' (orang yang belajar) dibezakan secara morfofonemik daripada 'pengajar' (orang yang mengajar).",
      explanationMs:
        "'pelajar' ialah kata nama terbitan daripada kata dasar 'ajar' yang merujuk kepada orang yang sedang belajar atau menuntut ilmu.",
      explanationEn:
        "'pelajar' is a derived noun from root 'ajar' referring to a student or learner.",
      derivedWords: ["ajar", "belajar", "mengajar", "pengajaran"],
      verificationMethod: "verified_lexical_entry",
    },
    senses: [
      {
        id: "ms-pelajar-s1",
        senseNumber: 1,
        partOfSpeech: "noun",
        domain: "education",
        definition: "Student; pupil; learner at a school, college, or university.",
        localizedDefinitions: {
          en: "Student; pupil; learner at a school, college, or university.",
          ms: "Orang yang sedang belajar atau menuntut ilmu di sekolah, maktab, atau universiti.",
          "zh-Hans": "学生，学员，求学者。",
        },
        translations: [
          { language: "en", terms: ["student", "pupil", "learner"] },
          { language: "zh-Hans", terms: ["学生", "学员"], romanization: "xuésheng, xuéyuán" },
          { language: "id", terms: ["pelajar", "mahasiswa", "siswa"] },
          { language: "ja", terms: ["学生", "生徒"], romanization: "gakusei, seito" },
          { language: "ko", terms: ["학생"], romanization: "haksaeng" },
          { language: "ar", terms: ["طَالِب"], romanization: "ṭālib" },
        ],
        examples: [
          {
            text: "Setiap pelajar digalakkan menggunakan kamus dwibahasa untuk memperkaya kosa kata.",
            translations: {
              en: "Every student is encouraged to use a bilingual dictionary to enrich their vocabulary.",
              "zh-Hans": "鼓励每位学生使用双语词典来丰富词汇量。",
            },
          },
        ],
        synonyms: ["murid", "penuntut", " siswa"],
        antonyms: ["pengajar", "guru"],
      },
    ],
    relatedWords: [
      { word: "ajar", language: "ms", relation: "Kata Dasar (Root)" },
      { word: "belajar", language: "ms", relation: "Kata Kerja Berkaitan" },
    ],
    frequencyRank: 30,
  },
  {
    id: "ms-mengajar",
    slug: "mengajar",
    headword: "mengajar",
    language: "ms",
    ipa: "/mə.ŋa.dʒar/",
    audioLocale: "ms-MY",
    partsOfSpeech: ["verb"],
    etymology: "From prefix 'meN-' (allomorph 'meng-') + root 'ajar'.",
    malayMorphology: {
      morphologyType: "kata_terbitan",
      golonganKata: "kata_kerja",
      kataDasar: "ajar",
      affixType: "awalan",
      affixPattern: "meN- (meng-)",
      formula: "meN- (meng-) + ajar (kata dasar) → mengajar",
      morphophonemicRule:
        "Awalan 'meN-' menjadi alomorf 'meng-' apabila bertemu kata dasar yang bermula dengan huruf vokal (a, e, i, o, u).",
      explanationMs:
        "'mengajar' ialah kata kerja transitif terbitan daripada 'ajar' yang bermaksud menyampaikan ilmu atau kemahiran kepada orang lain.",
      explanationEn:
        "'mengajar' is a transitive derived verb from root 'ajar', meaning to teach or instruct someone.",
      derivedWords: ["ajar", "belajar", "pelajar", "pengajaran"],
      verificationMethod: "verified_lexical_entry",
    },
    senses: [
      {
        id: "ms-mengajar-s1",
        senseNumber: 1,
        partOfSpeech: "verb",
        domain: "education",
        definition: "To teach; to impart knowledge or instruct pupils.",
        localizedDefinitions: {
          en: "To teach; to impart knowledge or instruct pupils.",
          ms: "Memberikan ilmu pengetahuan atau melatih kemahiran kepada pelajar.",
          "zh-Hans": "教，讲授，教学，授课。",
        },
        translations: [
          { language: "en", terms: ["teach", "instruct"] },
          { language: "zh-Hans", terms: ["教", "授课", "教学"], romanization: "jiāo, shòukè" },
          { language: "id", terms: ["mengajar"] },
          { language: "ja", terms: ["教える"], romanization: "oshieru" },
        ],
        examples: [
          {
            text: "Beliau telah mengajar tatabahasa Melayu selama lebih dua puluh tahun.",
            translations: {
              en: "She has taught Malay grammar for over twenty years.",
              "zh-Hans": "她教授马来语语法已有二十多年。",
            },
          },
        ],
        synonyms: ["mendidik", "membimbing", "melatih"],
        antonyms: ["belajar"],
      },
    ],
    relatedWords: [
      { word: "ajar", language: "ms", relation: "Kata Dasar (Root)" },
      { word: "pengajaran", language: "ms", relation: "Kata Terbitan (peN-...-an)" },
    ],
    frequencyRank: 42,
  },
  {
    id: "ms-pengajaran",
    slug: "pengajaran",
    headword: "pengajaran",
    language: "ms",
    ipa: "/pə.ŋa.dʒa.ran/",
    audioLocale: "ms-MY",
    partsOfSpeech: ["noun"],
    etymology: "From circumfix 'peN-...-an' (allomorph 'peng-...-an') + root 'ajar'.",
    malayMorphology: {
      morphologyType: "kata_terbitan",
      golonganKata: "kata_nama",
      kataDasar: "ajar",
      affixType: "apitan",
      affixPattern: "peN-...-an",
      formula: "peN- + ajar (kata dasar) + -an → pengajaran",
      explanationMs:
        "'pengajaran' menggunakan imbuhan apitan 'peN-...-an' pada kata dasar 'ajar' untuk merujuk kepada proses mengajar atau pedoman/iktibar daripada sesuatu peristiwa.",
      explanationEn:
        "'pengajaran' uses the circumfix 'peN-...-an' on root 'ajar' to denote the act/process of teaching or a moral lesson drawn from experience.",
      derivedWords: ["ajar", "belajar", "pelajar", "mengajar"],
      verificationMethod: "verified_lexical_entry",
    },
    senses: [
      {
        id: "ms-pengajaran-s1",
        senseNumber: 1,
        partOfSpeech: "noun",
        domain: "education",
        definition: "Instruction; pedagogy; the process or profession of teaching.",
        localizedDefinitions: {
          en: "Instruction; pedagogy; the process or profession of teaching.",
          ms: "Perihal atau proses mengajar; kaedah menyampaikan ilmu.",
          "zh-Hans": "教学，讲授，教育过程。",
        },
        translations: [
          { language: "en", terms: ["teaching", "instruction", "pedagogy"] },
          { language: "zh-Hans", terms: ["教学", "讲授"], romanization: "jiàoxué" },
          { language: "id", terms: ["pengajaran"] },
        ],
        examples: [
          {
            text: "Kaedah pengajaran bahasa yang interaktif meningkatkan kefahaman pelajar.",
            translations: {
              en: "Interactive language teaching methods improve student comprehension.",
              "zh-Hans": "互动式的语言教学方法提高了学生的理解力。",
            },
          },
        ],
        synonyms: ["pendidikan", "pembimbingan"],
        antonyms: ["pembelajaran"],
      },
      {
        id: "ms-pengajaran-s2",
        senseNumber: 2,
        partOfSpeech: "noun",
        domain: "general",
        definition: "Moral lesson; warning or takeaway learned from an experience.",
        localizedDefinitions: {
          en: "Moral lesson; warning or takeaway learned from an experience.",
          ms: "Iktibar, pedoman, atau peringatan yang diperoleh daripada sesuatu kejadian.",
          "zh-Hans": "教训，启示，借鉴。",
        },
        translations: [
          { language: "en", terms: ["lesson", "moral", "takeaway"] },
          { language: "zh-Hans", terms: ["教训", "启示"], romanization: "jiàoxun, qǐshì" },
        ],
        examples: [
          {
            text: "Peristiwa tersebut menjadi pengajaran berharga kepada seluruh masyarakat.",
            translations: {
              en: "That event became a valuable lesson for the entire community.",
              "zh-Hans": "那次事件成为了全社会宝贵的教训。",
            },
          },
        ],
        synonyms: ["iktibar", "teladan", "pedoman"],
        antonyms: [],
      },
    ],
    relatedWords: [
      { word: "ajar", language: "ms", relation: "Kata Dasar (Root)" },
      { word: "mengajar", language: "ms", relation: "Kata Kerja Berkaitan" },
    ],
    frequencyRank: 65,
  },
  {
    id: "ms-tulis",
    slug: "tulis",
    headword: "tulis",
    language: "ms",
    ipa: "/tu.lis/",
    audioLocale: "ms-MY",
    partsOfSpeech: ["verb"],
    etymology: "Inherited from Proto-Malayo-Polynesian *tulis ('to scratch, incise, write').",
    wordForms: [
      { label: "Kata Dasar", form: "tulis" },
      { label: "Kata Kerja Aktif (meN-)", form: "menulis" },
      { label: "Kata Nama Pelaku (peN-)", form: "penulis" },
      { label: "Kata Nama Hasil (-an)", form: "tulisan" },
      { label: "Kata Kerja Pasif (di-)", form: "ditulis" },
    ],
    malayMorphology: {
      morphologyType: "kata_dasar",
      golonganKata: "kata_kerja",
      kataDasar: "tulis",
      affixType: "none",
      affixPattern: "Kata Dasar Tulen",
      formula: "tulis (kata dasar)",
      morphophonemicRule:
        "Konsonan awal /t/ mengalami peluluhan kepada bunyi sengau /n/ apabila menerima awalan 'meN-' (menulis) atau 'peN-' (penulis).",
      explanationMs:
        "'tulis' ialah kata dasar kerja. Apabila menerima awalan 'meN-' atau 'peN-', huruf 't' luluh menjadi 'n' mengikut hukum morfofonemik Bahasa Melayu (tulis → menulis, penulis).",
      explanationEn:
        "'tulis' is a root verb meaning 'to write'. Under Malay morphophonemic rules, initial voiceless alveolar stop /t/ undergoes nasal substitution to /n/ when prefixed with 'meN-' (menulis) or 'peN-' (penulis).",
      derivedWords: ["menulis", "penulis", "tulisan"],
      verificationMethod: "verified_lexical_entry",
    },
    senses: [
      {
        id: "ms-tulis-s1",
        senseNumber: 1,
        partOfSpeech: "verb",
        definition: "To write; to inscribe letters, characters, or words on a surface.",
        localizedDefinitions: {
          en: "To write; to inscribe letters, characters, or words on a surface.",
          ms: "Mencatat huruf, angka, atau perkataan pada kertas atau permukaan lain.",
          "zh-Hans": "写，书写，记录文字。",
        },
        translations: [
          { language: "en", terms: ["write", "inscribe"] },
          { language: "zh-Hans", terms: ["写", "书写"], romanization: "xiě, shūxiě" },
          { language: "id", terms: ["tulis", "menulis"] },
          { language: "ja", terms: ["書く"], romanization: "kaku" },
          { language: "ko", terms: ["쓰다"], romanization: "sseuda" },
          { language: "ar", terms: ["كَتَبَ"], romanization: "kataba" },
          { language: "es", terms: ["escribir"] },
          { language: "fr", terms: ["écrire"] },
          { language: "de", terms: ["schreiben"] },
        ],
        examples: [
          {
            text: "Sila tulis nama penuh dan alamat anda pada borang pendaftaran ini.",
            translations: {
              en: "Please write your full name and address on this registration form.",
              "zh-Hans": "请在这张登记表上写下您的全名和地址。",
            },
          },
        ],
        synonyms: ["catat", "karang"],
        antonyms: ["baca"],
      },
    ],
    relatedWords: [
      { word: "menulis", language: "ms", relation: "Kata Terbitan (meN-)" },
      { word: "penulis", language: "ms", relation: "Kata Terbitan (peN-)" },
      { word: "tulisan", language: "ms", relation: "Kata Terbitan (-an)" },
    ],
    frequencyRank: 28,
    featured: true,
  },
  {
    id: "ms-menulis",
    slug: "menulis",
    headword: "menulis",
    language: "ms",
    ipa: "/mə.nu.lis/",
    audioLocale: "ms-MY",
    partsOfSpeech: ["verb"],
    etymology: "From prefix 'meN-' + root 'tulis' with nasal substitution /t/ → /n/.",
    malayMorphology: {
      morphologyType: "kata_terbitan",
      golonganKata: "kata_kerja",
      kataDasar: "tulis",
      affixType: "awalan",
      affixPattern: "meN-",
      formula: "meN- + tulis (kata dasar) → menulis (peluluhan /t/ → /n/)",
      morphophonemicRule:
        "Hukum Peluluhan Konsonan Sengau: Konsonan tidak bersuara /t/ pada awal kata dasar jati Melayu luluh dan digantikan dengan bunyi sengau homorganik /n/ apabila menerima awalan 'meN-'.",
      explanationMs:
        "'menulis' ialah kata kerja aktif transitif yang diterbitkan daripada kata dasar 'tulis' melalui awalan 'meN-' dengan peluluhan huruf 't' kepada 'n'.",
      explanationEn:
        "'menulis' is the active transitive verb derived from root 'tulis' via prefix 'meN-', exhibiting homorganic nasal substitution (/t/ → /n/).",
      derivedWords: ["tulis", "penulis", "tulisan"],
      verificationMethod: "verified_lexical_entry",
    },
    senses: [
      {
        id: "ms-menulis-s1",
        senseNumber: 1,
        partOfSpeech: "verb",
        definition: "To write; to author or compose text, articles, or books.",
        localizedDefinitions: {
          en: "To write; to author or compose text, articles, or books.",
          ms: "Melakukan perbuatan menulis; mengarang rencana, surat, atau buku.",
          "zh-Hans": "写作，书写，撰写。",
        },
        translations: [
          { language: "en", terms: ["write", "compose", "author"] },
          { language: "zh-Hans", terms: ["写作", "书写"], romanization: "xiězuò, shūxiě" },
          { language: "id", terms: ["menulis"] },
        ],
        examples: [
          {
            text: "Sasterawan itu sedang menulis sebuah novel sejarah tentang pelayaran Nusantara.",
            translations: {
              en: "The writer is writing a historical novel about Nusantara maritime voyages.",
              "zh-Hans": "那位文学家正在撰写一部关于努山塔拉航海史的历史小说。",
            },
          },
        ],
        synonyms: ["mengarang", "mencatat"],
        antonyms: ["membaca"],
      },
    ],
    relatedWords: [
      { word: "tulis", language: "ms", relation: "Kata Dasar (Root)" },
      { word: "penulis", language: "ms", relation: "Kata Terbitan (peN-)" },
      { word: "tulisan", language: "ms", relation: "Kata Terbitan (-an)" },
    ],
    frequencyRank: 32,
  },
  {
    id: "ms-penulis",
    slug: "penulis",
    headword: "penulis",
    language: "ms",
    ipa: "/pə.nu.lis/",
    audioLocale: "ms-MY",
    partsOfSpeech: ["noun"],
    etymology: "From agentive prefix 'peN-' + root 'tulis' (/t/ → /n/).",
    malayMorphology: {
      morphologyType: "kata_terbitan",
      golonganKata: "kata_nama",
      kataDasar: "tulis",
      affixType: "awalan",
      affixPattern: "peN-",
      formula: "peN- + tulis (kata dasar) → penulis (peluluhan /t/ → /n/)",
      morphophonemicRule:
        "Konsonan /t/ pada kata dasar 'tulis' luluh menjadi /n/ apabila menerima awalan pembentuk kata nama pelaku 'peN-'.",
      explanationMs:
        "'penulis' ialah kata nama pelaku yang diterbitkan daripada kata dasar 'tulis' melalui awalan 'peN-'.",
      explanationEn:
        "'penulis' is an agent noun ('writer/author') derived from root 'tulis' via prefix 'peN-' with nasal substitution.",
      derivedWords: ["tulis", "menulis", "tulisan"],
      verificationMethod: "verified_lexical_entry",
    },
    senses: [
      {
        id: "ms-penulis-s1",
        senseNumber: 1,
        partOfSpeech: "noun",
        definition: "Writer; author; person who writes books, articles, or literary works.",
        localizedDefinitions: {
          en: "Writer; author; person who writes books, articles, or literary works.",
          ms: "Orang yang menulis atau mengarang buku, cerita, rencana, dan sebagainya; pengarang.",
          "zh-Hans": "作者，作家，撰稿人。",
        },
        translations: [
          { language: "en", terms: ["writer", "author"] },
          { language: "zh-Hans", terms: ["作者", "作家"], romanization: "zuòzhě, zuòjiā" },
          { language: "id", terms: ["penulis", "pengarang"] },
          { language: "ja", terms: ["作家", "著者"], romanization: "sakka, chosha" },
        ],
        examples: [
          {
            text: "Penulis muda itu memenangi anugerah sastera kebangsaan tahun ini.",
            translations: {
              en: "The young author won the national literary award this year.",
              "zh-Hans": "这位年轻作家今年赢得了国家文学奖。",
            },
          },
        ],
        synonyms: ["pengarang", "sasterawan"],
        antonyms: ["pembaca"],
      },
    ],
    relatedWords: [
      { word: "tulis", language: "ms", relation: "Kata Dasar (Root)" },
      { word: "menulis", language: "ms", relation: "Kata Kerja Berkaitan" },
      { word: "tulisan", language: "ms", relation: "Kata Terbitan (-an)" },
    ],
    frequencyRank: 48,
  },
  {
    id: "ms-tulisan",
    slug: "tulisan",
    headword: "tulisan",
    language: "ms",
    ipa: "/tu.li.san/",
    audioLocale: "ms-MY",
    partsOfSpeech: ["noun"],
    etymology: "From root 'tulis' + suffix '-an'.",
    malayMorphology: {
      morphologyType: "kata_terbitan",
      golonganKata: "kata_nama",
      kataDasar: "tulis",
      affixType: "akhiran",
      affixPattern: "-an",
      formula: "tulis (kata dasar) + -an (akhiran) → tulisan",
      explanationMs:
        "'tulisan' ialah kata nama terbitan berakhiran '-an' daripada kata dasar 'tulis', merujuk kepada hasil menulis, sistem aksara, atau gaya tulisan tangan.",
      explanationEn:
        "'tulisan' is a derived noun formed from 'tulis' + '-an', referring to handwriting, script system, or a piece of writing.",
      derivedWords: ["tulis", "menulis", "penulis"],
      verificationMethod: "verified_lexical_entry",
    },
    senses: [
      {
        id: "ms-tulisan-s1",
        senseNumber: 1,
        partOfSpeech: "noun",
        definition: "Writing; script; handwriting; written work.",
        localizedDefinitions: {
          en: "Writing; script; handwriting; written work.",
          ms: "Hasil daripada perbuatan menulis; sistem aksara (seperti tulisan Rumi dan tulisan Jawi) atau karya bertulis.",
          "zh-Hans": "文字，字体，笔迹；文章，著作。",
        },
        translations: [
          { language: "en", terms: ["writing", "script", "handwriting"] },
          { language: "zh-Hans", terms: ["文字", "笔迹", "著作"], romanization: "wénzì, bǐjì" },
          { language: "id", terms: ["tulisan", "aksara"] },
        ],
        examples: [
          {
            text: "Manuskrip lama itu ditulis dalam tulisan Jawi yang amat kemas.",
            translations: {
              en: "The old manuscript was written in very neat Jawi script.",
              "zh-Hans": "那份古手稿是用非常工整的爪夷文书写的。",
            },
          },
        ],
        synonyms: ["aksara", "karangan", "coretan"],
        antonyms: ["lisan"],
      },
    ],
    relatedWords: [
      { word: "tulis", language: "ms", relation: "Kata Dasar (Root)" },
      { word: "menulis", language: "ms", relation: "Kata Kerja Berkaitan" },
    ],
    frequencyRank: 55,
  },
  {
    id: "ms-telapak",
    slug: "telapak",
    headword: "telapak",
    language: "ms",
    ipa: "/tə.la.pak/",
    audioLocale: "ms-MY",
    partsOfSpeech: ["noun"],
    etymology: "From root 'tapak' + infix (sisipan) '-el-'.",
    malayMorphology: {
      morphologyType: "kata_terbitan",
      golonganKata: "kata_nama",
      kataDasar: "tapak",
      affixType: "sisipan",
      affixPattern: "-el-",
      formula: "t + -el- (sisipan) + apak (daripada tapak) → telapak",
      explanationMs:
        "'telapak' ialah contoh klasik imbuhan sisipan '-el-' dalam Bahasa Melayu, di mana '-el-' disisipkan selepas konsonan pertama kata dasar 'tapak' (tapak → telapak).",
      explanationEn:
        "'telapak' is a canonical example of the Malay infix (sisipan) '-el-' inserted after the initial consonant of the root word 'tapak' (sole/palm).",
      derivedWords: ["tapak"],
      verificationMethod: "verified_lexical_entry",
    },
    senses: [
      {
        id: "ms-telapak-s1",
        senseNumber: 1,
        partOfSpeech: "noun",
        definition: "Palm of the hand or sole of the foot.",
        localizedDefinitions: {
          en: "Palm of the hand or sole of the foot.",
          ms: "Bahagian sebelah bawah kaki atau bahagian sebelah dalam tangan; tapak tangan atau tapak kaki.",
          "zh-Hans": "手掌，脚掌，脚底。",
        },
        translations: [
          { language: "en", terms: ["palm", "sole"] },
          { language: "zh-Hans", terms: ["手掌", "脚掌"], romanization: "shǒuzhǎng, jiǎozhǎng" },
          { language: "id", terms: ["telapak"] },
        ],
        examples: [
          {
            text: "Garisan pada telapak tangan setiap insan adalah unik.",
            translations: {
              en: "The lines on the palm of every human hand are unique.",
              "zh-Hans": "每个人手掌上的掌纹都是独一无二的。",
            },
          },
        ],
        synonyms: ["tapak"],
        antonyms: [],
      },
    ],
    relatedWords: [{ word: "tapak", language: "ms", relation: "Kata Dasar (Root)" }],
    frequencyRank: 110,
  },
  {
    id: "ms-tapak",
    slug: "tapak",
    headword: "tapak",
    language: "ms",
    ipa: "/ta.pak/",
    audioLocale: "ms-MY",
    partsOfSpeech: ["noun"],
    etymology: "Inherited from Proto-Malayo-Polynesian *tapak ('palm of hand, sole of foot').",
    malayMorphology: {
      morphologyType: "kata_dasar",
      golonganKata: "kata_nama",
      kataDasar: "tapak",
      affixType: "none",
      affixPattern: "Kata Dasar Tulen",
      formula: "tapak (kata dasar)",
      explanationMs:
        "'tapak' ialah kata dasar nama yang boleh menerima imbuhan sisipan '-el-' menjadi 'telapak', atau awalan 'beR-' menjadi 'bertapak'.",
      explanationEn:
        "'tapak' is a root noun meaning palm, sole, or foundation site, which takes the infix '-el-' to form 'telapak'.",
      derivedWords: ["telapak"],
      verificationMethod: "verified_lexical_entry",
    },
    senses: [
      {
        id: "ms-tapak-s1",
        senseNumber: 1,
        partOfSpeech: "noun",
        definition: "Palm of the hand, sole of the foot, footprint, or site/foundation.",
        localizedDefinitions: {
          en: "Palm of the hand, sole of the foot, footprint, or building site/foundation.",
          ms: "Bahagian bawah kaki atau dalam tangan; bekas pijakan; atau kawasan tanah tempat mendirikan bangunan.",
          "zh-Hans": "手心，脚底；足迹；地基，遗址。",
        },
        translations: [
          { language: "en", terms: ["palm", "sole", "site", "footprint"] },
          { language: "zh-Hans", terms: ["脚底", "地基", "遗址"], romanization: "jiǎodǐ, dìjī" },
          { language: "id", terms: ["tapak", "telapak"] },
        ],
        examples: [
          {
            text: "Lembah Bujang merupakan tapak arkeologi tamadun awal yang penting di Malaysia.",
            translations: {
              en: "Bujang Valley is an important early civilization archaeological site in Malaysia.",
              "zh-Hans": "布秧谷是马来西亚重要的早期文明考古遗址。",
            },
          },
        ],
        synonyms: ["telapak", "asas", "dasar"],
        antonyms: [],
      },
    ],
    relatedWords: [{ word: "telapak", language: "ms", relation: "Kata Terbitan Sisipan (-el-)" }],
    frequencyRank: 75,
  },
  {
    id: "ms-indah",
    slug: "indah",
    headword: "indah",
    language: "ms",
    ipa: "/in.dah/",
    audioLocale: "ms-MY",
    partsOfSpeech: ["adjective"],
    etymology: "From Proto-Malayic *indah ('beautiful, precious, attentive').",
    malayMorphology: {
      morphologyType: "kata_dasar",
      golonganKata: "kata_adjektif",
      kataDasar: "indah",
      affixType: "none",
      affixPattern: "Kata Dasar Adjektif",
      formula: "indah (kata adjektif / kata dasar)",
      explanationMs:
        "'indah' ialah kata adjektif sifatan yang menerangkan kecantikan pemandangan, bahasa, atau seni. Menerima apitan 'ke-...-an' menjadi 'keindahan' dan 'meN-...-kan' menjadi 'mengindahkan'.",
      explanationEn:
        "'indah' is a Malay root adjective describing aesthetic beauty or splendor. It forms the abstract noun 'keindahan' (beauty) via circumfix 'ke-...-an'.",
      derivedWords: [],
      verificationMethod: "verified_lexical_entry",
    },
    senses: [
      {
        id: "ms-indah-s1",
        senseNumber: 1,
        partOfSpeech: "adjective",
        definition: "Beautiful; splendid; aesthetically pleasing or scenic.",
        localizedDefinitions: {
          en: "Beautiful; splendid; aesthetically pleasing or scenic.",
          ms: "Cantik, elok, molek, dan sedap mata memandang (tentang pemandangan, bahasa, lukisan, dan seni).",
          "zh-Hans": "美丽的，优美的，秀丽的。",
        },
        translations: [
          { language: "en", terms: ["beautiful", "splendid", "scenic", "lovely"] },
          { language: "zh-Hans", terms: ["美丽", "优美", "秀丽"], romanization: "měilì, yōuměi" },
          { language: "id", terms: ["indah", "elok", "permai"] },
          { language: "ja", terms: ["美しい"], romanization: "utsukushii" },
          { language: "ko", terms: ["아름답다"], romanization: "areumdapda" },
          { language: "ar", terms: ["جَمِيل"], romanization: "jamīl" },
          { language: "es", terms: ["hermoso", "bello"] },
          { language: "fr", terms: ["beau", "magnifique"] },
          { language: "de", terms: ["schön", "herrlich"] },
        ],
        examples: [
          {
            text: "Pemandangan matahari terbenam di tepi pantai itu sungguh indah.",
            translations: {
              en: "The sunset view by the beach is truly beautiful.",
              "zh-Hans": "海滩边的日落景色真是美不胜收。",
            },
          },
        ],
        synonyms: ["cantik", "permai", "elok", "molek"],
        antonyms: ["buruk", "hodoh"],
      },
    ],
    frequencyRank: 40,
  },
  {
    id: "ms-daripada",
    slug: "daripada",
    headword: "daripada",
    language: "ms",
    ipa: "/da.ri.pa.da/",
    audioLocale: "ms-MY",
    partsOfSpeech: ["preposition"],
    etymology: "Compound preposition from 'dari' + 'pada'.",
    grammarNote:
      "Dalam tatabahasa Melayu baku, kata sendi nama 'daripada' digunakan di hadapan kata nama yang menyatakan punca bagi manusia/institusi, asal kejadian sesuatu benda, unsur perbandingan, atau bahagian daripada keseluruhan — berbeza dengan 'dari' yang digunakan khusus untuk arah, tempat, dan masa.",
    malayMorphology: {
      morphologyType: "kata_dasar",
      golonganKata: "kata_sendi_nama",
      kataDasar: "daripada",
      affixType: "none",
      affixPattern: "Kata Sendi Nama",
      formula: "daripada (kata sendi nama)",
      explanationMs:
        "'daripada' tergolong dalam golongan Kata Sendi Nama (Preposition). Ia digunakan untuk menyatakan punca manusia, sumber bahan asal, perbezaan/perbandingan, dan pecahan.",
      explanationEn:
        "'daripada' belongs to 'Kata Sendi Nama' (Prepositions). Unlike 'dari' (which marks physical place, direction, and time), 'daripada' marks human sources, material composition, and comparisons ('than').",
      verificationMethod: "verified_lexical_entry",
    },
    senses: [
      {
        id: "ms-daripada-s1",
        senseNumber: 1,
        partOfSpeech: "preposition",
        domain: "grammar",
        definition: "From (indicating a person, institution, abstract source, or material origin); than (in comparisons).",
        localizedDefinitions: {
          en: "From (indicating a person, institution, abstract source, or material origin); than (in comparisons).",
          ms: "Kata sendi nama yang menyatakan punca orang, asal bahan sesuatu benda, atau perbandingan.",
          "zh-Hans": "从，来自（用于人、机构或材料来源）；比（用于比较句）。",
        },
        translations: [
          { language: "en", terms: ["from", "out of", "than"] },
          { language: "zh-Hans", terms: ["来自", "由…制成", "比"], romanization: "láizì, bǐ" },
          { language: "id", terms: ["daripada", "dari"] },
        ],
        examples: [
          {
            text: "Meja ukiran tradisional itu diperbuat daripada kayu jati bermutu tinggi.",
            translations: {
              en: "That traditional carved table is made from high-quality teak wood.",
              "zh-Hans": "那张传统雕花桌子是由优质柚木制成的。",
            },
          },
          {
            text: "Mencegah penyakit adalah lebih baik daripada mengubatinya.",
            translations: {
              en: "Preventing illness is better than curing it.",
              "zh-Hans": "预防疾病胜于治疗。",
            },
          },
        ],
        synonyms: [],
        antonyms: ["kepada"],
      },
    ],
    frequencyRank: 14,
  },
  {
    id: "ms-sebuah",
    slug: "sebuah",
    headword: "sebuah",
    language: "ms",
    ipa: "/sə.bu.ah/",
    audioLocale: "ms-MY",
    partsOfSpeech: ["classifier"],
    etymology: "From numeral prefix 'se-' ('one') + numeral classifier 'buah'.",
    malayMorphology: {
      morphologyType: "penjodoh_bilangan",
      golonganKata: "penjodoh_bilangan",
      kataDasar: "buah",
      affixType: "awalan",
      affixPattern: "se- + penjodoh bilangan",
      formula: "se- (satu) + buah (penjodoh bilangan) → sebuah",
      classifierUsage: {
        targetTypes: [
          "Benda besar atau padu yang tidak tentu bentuknya (rumah, kereta, kapal)",
          "Hasil karya atau penerbitan (buku, kamus, novel, lagu)",
          "Kawasan, institusi, atau negeri (negara, sekolah, bandar, pulau)",
        ],
        examples: [
          "sebuah buku kamus",
          "sebuah rumah tradisional",
          "sebuah negara berdaulat",
          "sebuah kereta elektrik",
        ],
      },
      explanationMs:
        "'sebuah' ialah gabungan awalan bilangan 'se-' (satu) dengan penjodoh bilangan 'buah', digunakan untuk membilang benda besar, bangunan, kenderaan, buku, atau konsep abstrak seperti negara.",
      explanationEn:
        "'sebuah' combines the numeral prefix 'se-' ('one') with the classifier (penjodoh bilangan) 'buah', used for counting three-dimensional objects, buildings, vehicles, books, and geographical/political entities.",
      verificationMethod: "verified_lexical_entry",
    },
    senses: [
      {
        id: "ms-sebuah-s1",
        senseNumber: 1,
        partOfSpeech: "classifier",
        domain: "grammar",
        definition: "One (numeral classifier for buildings, vehicles, books, countries, islands, and large objects of indefinite shape).",
        localizedDefinitions: {
          en: "One (numeral classifier for buildings, vehicles, books, countries, islands, and large objects of indefinite shape).",
          ms: "Penjodoh bilangan bagi satu benda besar, bangunan, kenderaan, buku, pulau, atau negara.",
          "zh-Hans": "一个、一本、一座、一辆（马来语量词，用于书籍、房屋、车辆、国家、岛屿等）。",
        },
        translations: [
          { language: "en", terms: ["a / one (classifier for books, houses, vehicles, countries)"] },
          { language: "zh-Hans", terms: ["一本", "一座", "一辆", "一个"], romanization: "yī běn, yī zuò" },
          { language: "id", terms: ["sebuah"] },
        ],
        examples: [
          {
            text: "Beliau menghadiahkan sebuah kamus pelbagai bahasa kepada perpustakaan sekolah.",
            translations: {
              en: "He presented a multilingual dictionary to the school library.",
              "zh-Hans": "他向学校图书馆赠送了一本多语种词典。",
            },
          },
        ],
        synonyms: ["suatu"],
        antonyms: [],
      },
    ],
    frequencyRank: 20,
    featured: true,
  },
  {
    id: "ms-sehelai",
    slug: "sehelai",
    headword: "sehelai",
    language: "ms",
    ipa: "/sə.hə.lai/",
    audioLocale: "ms-MY",
    partsOfSpeech: ["classifier"],
    etymology: "From numeral prefix 'se-' ('one') + classifier 'helai'.",
    malayMorphology: {
      morphologyType: "penjodoh_bilangan",
      golonganKata: "penjodoh_bilangan",
      kataDasar: "helai",
      affixType: "awalan",
      affixPattern: "se- + penjodoh bilangan",
      formula: "se- (satu) + helai (penjodoh bilangan) → sehelai",
      classifierUsage: {
        targetTypes: [
          "Benda yang nipis, lembut, dan lebar (kertas, pakaian, kain, daun, tuala, rambut)",
        ],
        examples: [
          "sehelai kertas putih",
          "sehelai baju kurung",
          "sehelai daun kering",
          "sehelai kain songket",
        ],
      },
      explanationMs:
        "'sehelai' ialah penjodoh bilangan bagi benda-benda yang nipis, lembut, dan lebar seperti kertas, kain, baju, atau daun.",
      explanationEn:
        "'sehelai' is the Malay numeral classifier (penjodoh bilangan) for thin, flat, or flexible items such as paper, clothing, cloth, leaves, or strands of hair.",
      verificationMethod: "verified_lexical_entry",
    },
    senses: [
      {
        id: "ms-sehelai-s1",
        senseNumber: 1,
        partOfSpeech: "classifier",
        domain: "grammar",
        definition: "One sheet, piece, orgarment (numeral classifier for thin, flat, or flexible objects like paper, cloth, leaves, and shirts).",
        localizedDefinitions: {
          en: "One sheet, piece, or garment (numeral classifier for thin, flat, or flexible objects like paper, cloth, leaves, and shirts).",
          ms: "Penjodoh bilangan bagi benda yang nipis, lembut, dan lebar seperti kertas, pakaian, daun, atau tuala.",
          "zh-Hans": "一张、一件、一片（马来语量词，用于纸张、衣物、树叶、布料等薄平柔物）。",
        },
        translations: [
          { language: "en", terms: ["a sheet of", "a piece of (clothing/cloth/leaf)"] },
          { language: "zh-Hans", terms: ["一张", "一件", "一片"], romanization: "yī zhāng, yī jiàn" },
          { language: "id", terms: ["sehelai", "selembar"] },
        ],
        examples: [
          {
            text: "Puisi indah itu tercatat pada sehelai kertas lama.",
            translations: {
              en: "That beautiful poem was written on an old sheet of paper.",
              "zh-Hans": "那首优美的诗记录在一张旧纸上。",
            },
          },
        ],
        synonyms: ["selembar"],
        antonyms: [],
      },
    ],
    frequencyRank: 85,
  },
  {
    id: "ms-buah-tangan",
    slug: "buah-tangan",
    headword: "buah tangan",
    language: "ms",
    ipa: "/bu.ah ta.ŋan/",
    audioLocale: "ms-MY",
    partsOfSpeech: ["idiom", "noun"],
    etymology: "Idiom (Simpulan Bahasa) composed of 'buah' (fruit/yield) + 'tangan' (hand).",
    malayMorphology: {
      morphologyType: "simpulan_bahasa",
      golonganKata: "simpulan_bahasa",
      kataDasar: "buah",
      affixType: "none",
      affixPattern: "Simpulan Bahasa (Dua Kata Dasar)",
      formula: "buah + tangan → buah tangan (simpulan bahasa)",
      literalMeaning: "Fruit of the hand (Maksud harfiah: buah pada tangan)",
      explanationMs:
        "'buah tangan' ialah simpulan bahasa Melayu yang membawa maksud pemberian atau cenderamata yang dibawa ketika menziarahi seseorang, atau hasil kerja tangan/karya seseorang.",
      explanationEn:
        "'buah tangan' (literally 'fruit of the hand') is a traditional Malay idiom (simpulan bahasa) meaning a souvenir or gift brought when visiting someone, or a creative work produced by someone.",
      verificationMethod: "verified_lexical_entry",
    },
    senses: [
      {
        id: "ms-buah-tangan-s1",
        senseNumber: 1,
        partOfSpeech: "idiom",
        domain: "cultural",
        definition: "Gift or souvenir brought when visiting someone, or returning from a journey.",
        localizedDefinitions: {
          en: "Gift or souvenir brought when visiting someone, or returning from a journey.",
          ms: "Barang yang dibawa sebagai hadiah atau pemberian ketika mengunjungi seseorang atau pulang daripada perjalanan.",
          "zh-Hans": "伴手礼，手信，纪念品（拜访他人或旅行归来时赠送的礼物）。",
        },
        translations: [
          { language: "en", terms: ["souvenir", "gift", "present"] },
          { language: "zh-Hans", terms: ["伴手礼", "手信", "纪念品"], romanization: "bànshǒulǐ, shǒuxìn" },
          { language: "id", terms: ["buah tangan", "oleh-oleh"] },
          { language: "ja", terms: ["お土産", "手土産"], romanization: "omiyage, temiyage" },
        ],
        examples: [
          {
            text: "Kakak membawa pulang kuih tradisional sebagai buah tangan untuk jiran-jiran.",
            translations: {
              en: "My sister brought home traditional cakes as a gift for the neighbors.",
              "zh-Hans": "姐姐带回传统糕点作为送给邻居们的伴手礼。",
            },
          },
        ],
        synonyms: ["cenderamata", "oleh-oleh", "bingkisan"],
        antonyms: [],
      },
    ],
    frequencyRank: 60,
    featured: true,
  },
  {
    id: "ms-ulat-buku",
    slug: "ulat-buku",
    headword: "ulat buku",
    language: "ms",
    ipa: "/u.lat bu.ku/",
    audioLocale: "ms-MY",
    partsOfSpeech: ["idiom", "noun"],
    etymology: "Simpulan bahasa from 'ulat' (caterpillar/worm) + 'buku' (book).",
    malayMorphology: {
      morphologyType: "simpulan_bahasa",
      golonganKata: "simpulan_bahasa",
      kataDasar: "buku",
      affixType: "none",
      affixPattern: "Simpulan Bahasa",
      formula: "ulat + buku → ulat buku (simpulan bahasa)",
      literalMeaning: "Bookworm (Maksud harfiah: ulat pada buku)",
      explanationMs:
        "'ulat buku' ialah simpulan bahasa yang merujuk kepada orang yang sangat rajin dan gemar membaca buku.",
      explanationEn:
        "'ulat buku' is a Malay idiom (simpulan bahasa) referring to an avid reader or bookworm.",
      verificationMethod: "verified_lexical_entry",
    },
    senses: [
      {
        id: "ms-ulat-buku-s1",
        senseNumber: 1,
        partOfSpeech: "idiom",
        definition: "Bookworm; a person who loves reading books avidly.",
        localizedDefinitions: {
          en: "Bookworm; a person who loves reading books avidly.",
          ms: "Orang yang sangat gemar atau tekun membaca buku.",
          "zh-Hans": "书虫，热爱读书的人，博览群书者。",
        },
        translations: [
          { language: "en", terms: ["bookworm", "avid reader"] },
          { language: "zh-Hans", terms: ["书虫", "爱书人"], romanization: "shūchóng" },
          { language: "id", terms: ["kutu buku"] },
        ],
        examples: [
          {
            text: "Sejak kecil lagi, Aminah terkenal sebagai ulat buku yang menghabiskan masa di perpustakaan.",
            translations: {
              en: "Since childhood, Aminah has been known as a bookworm who spends her time in the library.",
              "zh-Hans": "从小时候起，阿米娜就是出了名的书虫，经常泡在图书馆里。",
            },
          },
        ],
        synonyms: ["pencinta buku"],
        antonyms: [],
      },
    ],
    frequencyRank: 78,
  },
  {
    id: "ms-bagai-aur-dengan-tebing",
    slug: "bagai-aur-dengan-tebing",
    headword: "bagai aur dengan tebing",
    language: "ms",
    ipa: "/ba.ɡai aur də.ŋan tə.biŋ/",
    audioLocale: "ms-MY",
    partsOfSpeech: ["proverb"],
    etymology: "Traditional Malay proverb (peribahasa perumpamaan): 'aur' (river bamboo) + 'tebing' (riverbank).",
    malayMorphology: {
      morphologyType: "peribahasa",
      golonganKata: "peribahasa",
      kataDasar: "aur",
      affixType: "none",
      affixPattern: "Peribahasa (Perumpamaan)",
      formula: "bagai aur (buluh sungai) dengan tebing (pinggir sungai)",
      literalMeaning:
        "Like bamboo and the riverbank (bamboo roots hold the riverbank soil, while the riverbank supports the bamboo).",
      explanationMs:
        "Peribahasa ini menggambarkan hubungan akrab yang saling membantu dan memerlukan antara satu sama lain, seperti buluh (aur) yang menahan tebing sungai daripada runtuh dan tebing yang menjadi tempat aur tumbuh.",
      explanationEn:
        "This classic Malay proverb uses the ecological symbiosis of river bamboo ('aur') and the riverbank ('tebing') to symbolize mutual cooperation and close interdependence within a community.",
      verificationMethod: "verified_lexical_entry",
    },
    senses: [
      {
        id: "ms-bagai-aur-s1",
        senseNumber: 1,
        partOfSpeech: "proverb",
        domain: "cultural",
        definition: "Helping and supporting one another in close harmony; mutually interdependent.",
        localizedDefinitions: {
          en: "Helping and supporting one another in close harmony; mutually interdependent.",
          ms: "Tolong-menolong dan bantu-membantu antara satu sama lain dengan akrab.",
          "zh-Hans": "相辅相成，唇齿相依，互帮互助（字面：如同河竹与河岸般互相扶持）。",
        },
        translations: [
          { language: "en", terms: ["mutually supportive", "working hand in glove", "interdependent"] },
          { language: "zh-Hans", terms: ["相辅相成", "唇齿相依", "守望相助"], romanization: "xiāngfǔ-xiāngchéng" },
          { language: "id", terms: ["bagai aur dengan tebing"] },
        ],
        examples: [
          {
            text: "Penduduk kampung itu hidup bermuafakat bagai aur dengan tebing dalam menjayakan gotong-royong.",
            translations: {
              en: "The villagers live in harmony, mutually supporting one another like bamboo and the riverbank.",
              "zh-Hans": "村民们和睦相处、守望相助，共同完成了互助大扫除。",
            },
          },
        ],
        synonyms: ["berat sama dipikul, ringan sama dijinjing"],
        antonyms: ["seperti enau dalam belukar, melepaskan pucuk masing-masing"],
      },
    ],
    frequencyRank: 68,
    featured: true,
  },
  {
    id: "ms-air",
    slug: "air",
    headword: "air",
    language: "ms",
    ipa: "/a.ir/",
    audioLocale: "ms-MY",
    partsOfSpeech: ["noun"],
    etymology: "Inherited from Proto-Malayic *air, from Proto-Malayo-Polynesian *wahiR ('fresh water, stream').",
    malayMorphology: {
      morphologyType: "kata_dasar",
      golonganKata: "kata_nama",
      kataDasar: "air",
      affixType: "none",
      affixPattern: "Kata Dasar Tulen",
      formula: "air (kata dasar nama)",
      explanationMs:
        "'air' ialah kata dasar nama. Ia membentuk kata terbitan seperti 'berair' (awalan beR-), 'mengairi' (apitan meN-...-i), dan 'pengairan' (apitan peN-...-an).",
      explanationEn:
        "'air' is an Austronesian root noun meaning 'water'. It yields derived forms such as 'mengairi' (to irrigate) and 'pengairan' (irrigation).",
      derivedWords: [],
      verificationMethod: "verified_lexical_entry",
    },
    senses: [
      {
        id: "ms-air-s1",
        senseNumber: 1,
        partOfSpeech: "noun",
        domain: "general",
        definition: "Water; the clear liquid that forms rain, rivers, lakes, and seas.",
        localizedDefinitions: {
          en: "Water; the clear liquid that forms rain, rivers, lakes, and seas.",
          ms: "Cecair jernih yang tidak berwarna, tidak berbau, dan tidak mempunyai rasa yang membentuk hujan, sungai, dan laut.",
          "zh-Hans": "水，液体。",
        },
        translations: [
          { language: "en", terms: ["water"] },
          { language: "zh-Hans", terms: ["水"], romanization: "shuǐ" },
          { language: "zh-Hant", terms: ["水"], romanization: "shuǐ" },
          { language: "id", terms: ["air", "tirta"] },
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
            text: "Air sungai yang bersih sangat penting untuk ekosistem dan bekalan minuman.",
            translations: {
              en: "Clean river water is vital for the ecosystem and drinking supply.",
              "zh-Hans": "干净的河水对生态系统和饮用水供应至关重要。",
            },
          },
        ],
        synonyms: ["tirta", "banyu"],
        antonyms: ["api"],
      },
    ],
    frequencyRank: 8,
  },
  {
    id: "ms-bahasa",
    slug: "bahasa",
    headword: "bahasa",
    language: "ms",
    ipa: "/ba.ha.sa/",
    audioLocale: "ms-MY",
    partsOfSpeech: ["noun"],
    etymology: "Borrowed from Sanskrit भाषा (bhāṣā, 'speech, language').",
    malayMorphology: {
      morphologyType: "kata_dasar",
      golonganKata: "kata_nama",
      kataDasar: "bahasa",
      affixType: "none",
      affixPattern: "Kata Dasar Nama",
      formula: "bahasa (kata dasar)",
      explanationMs:
        "'bahasa' merujuk kepada sistem lambang bunyi suara yang digunakan sebagai alat perhubungan, serta membawa maksud budi pekerti yang sopan (budi bahasa).",
      explanationEn:
        "'bahasa' means both 'language' (system of human communication) and 'courtesy/good manners' (as in 'budi bahasa').",
      verificationMethod: "verified_lexical_entry",
    },
    senses: [
      {
        id: "ms-bahasa-s1",
        senseNumber: 1,
        partOfSpeech: "noun",
        domain: "linguistics",
        definition: "Language; system of spoken, written, or signed communication used by a community.",
        localizedDefinitions: {
          en: "Language; system of spoken, written, or signed communication used by a community.",
          ms: "Sistem lambang bunyi suara yang dipakai sebagai alat perhubungan dalam lingkungan satu kelompok manusia.",
          "zh-Hans": "语言，语文，言语。",
        },
        translations: [
          { language: "en", terms: ["language", "speech", "tongue"] },
          { language: "zh-Hans", terms: ["语言", "语文"], romanization: "yǔyán, yǔwén" },
          { language: "zh-Hant", terms: ["語言"], romanization: "yǔyán" },
          { language: "id", terms: ["bahasa"] },
          { language: "ja", terms: ["言語", "言葉"], romanization: "gengo, kotoba" },
          { language: "ko", terms: ["언어"], romanization: "eoneo" },
          { language: "th", terms: ["ภาษา"], romanization: "phasa" },
          { language: "ar", terms: ["لُغَة"], romanization: "luġa" },
          { language: "es", terms: ["idioma", "lengua"] },
          { language: "fr", terms: ["langue", "langage"] },
          { language: "de", terms: ["Sprache"] },
        ],
        examples: [
          {
            text: "Bahasa Jiwa Bangsa merupakan cogan kata yang menekankan kepentingan bahasa kebangsaan.",
            translations: {
              en: "'Language is the Soul of the Nation' is a motto emphasizing the importance of the national language.",
              "zh-Hans": "“语言是民族的灵魂”是一句强调国语重要性的格言。",
            },
          },
        ],
        synonyms: ["lisan", "pertuturan"],
        antonyms: [],
      },
      {
        id: "ms-bahasa-s2",
        senseNumber: 2,
        partOfSpeech: "noun",
        domain: "cultural",
        definition: "Politeness; courtesy; refined manners and etiquette.",
        localizedDefinitions: {
          en: "Politeness; courtesy; refined manners and etiquette.",
          ms: "Tingkah laku yang sopan santun; adab dan budi pekerti yang halus.",
          "zh-Hans": "礼貌，礼仪，教养（常用于 budi bahasa）。",
        },
        translations: [
          { language: "en", terms: ["manners", "courtesy", "etiquette"] },
          { language: "zh-Hans", terms: ["礼貌", "教养"], romanization: "lǐmào, jiàoyǎng" },
        ],
        examples: [
          {
            text: "Budi bahasa yang mulia mencerminkan ketinggian peribadi seseorang.",
            translations: {
              en: "Noble courtesy reflects the refinement of a person's character.",
              "zh-Hans": "高尚的礼貌修养反映了一个人崇高的品格。",
            },
          },
        ],
        synonyms: ["adab", "sopan santun", "pekerti"],
        antonyms: ["biadab"],
      },
    ],
    frequencyRank: 10,
    featured: true,
  },
  {
    id: "ms-ilmu",
    slug: "ilmu",
    headword: "ilmu",
    language: "ms",
    ipa: "/il.mu/",
    audioLocale: "ms-MY",
    partsOfSpeech: ["noun"],
    etymology: "Borrowed from Arabic عِلْم (ʿilm, 'knowledge, science, learning').",
    malayMorphology: {
      morphologyType: "kata_dasar",
      golonganKata: "kata_nama",
      kataDasar: "ilmu",
      affixType: "none",
      affixPattern: "Kata Dasar Pinjaman Arab",
      formula: "ilmu (kata dasar)",
      explanationMs:
        "'ilmu' ialah kata dasar nama pinjaman Bahasa Arab (عِلْم) yang telah sebati dalam Bahasa Melayu, menghasilkan terbitan seperti 'berilmu' dan 'keilmuan'.",
      explanationEn:
        "'ilmu' is a Malay root noun borrowed from Arabic 'ʿilm' (عِلْم), meaning knowledge or science. It forms derivatives like 'berilmu' (knowledgeable) and 'keilmuan' (scholarship).",
      verificationMethod: "verified_lexical_entry",
    },
    senses: [
      {
        id: "ms-ilmu-s1",
        senseNumber: 1,
        partOfSpeech: "noun",
        domain: "education",
        definition: "Knowledge; science; scholarship; systematic understanding acquired through study.",
        localizedDefinitions: {
          en: "Knowledge; science; scholarship; systematic understanding acquired through study.",
          ms: "Pengetahuan dalam perkara dunia, akhirat, lahir, batin, dan sains yang diperoleh melalui pembelajaran atau penyelidikan.",
          "zh-Hans": "知识，学问，科学。",
        },
        translations: [
          { language: "en", terms: ["knowledge", "science", "learning", "scholarship"] },
          { language: "zh-Hans", terms: ["知识", "学问", "科学"], romanization: "zhīshi, xuéwèn" },
          { language: "id", terms: ["ilmu", "pengetahuan"] },
          { language: "ar", terms: ["عِلْم", "مَعْرِفَة"], romanization: "ʿilm, maʿrifa" },
          { language: "ja", terms: ["知識", "学問"], romanization: "chishiki, gakumon" },
        ],
        examples: [
          {
            text: "Menuntut ilmu adalah jambatan menuju kemajuan diri dan masyarakat.",
            translations: {
              en: "Pursuing knowledge is a bridge toward personal and societal progress.",
              "zh-Hans": "追求知识是通往个人与社会进步的桥梁。",
            },
          },
        ],
        synonyms: ["pengetahuan", "kepandaian", "makrifat"],
        antonyms: ["kejahilan"],
      },
    ],
    relatedWords: [{ word: "علم", language: "ar", relation: "Etymological Source (Arabic)" }],
    frequencyRank: 22,
  },
];

export const MALAY_STARTER_ENTRIES: LexiconEntry[] = rawMalayEntries.map(
  (entry) => ({
    ...entry,
    normalizedHeadword: normalizeSearchKey(entry.headword),
    provenance: WIKTIONARY_PROVENANCE(entry.headword),
  })
);
