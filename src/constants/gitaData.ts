import type { GitaChapter, Shloka, PromptCategory } from '../types';

export const GITA_CHAPTERS: GitaChapter[] = [
  {
    number: 1,
    sanskritName: "Arjuna Vishada Yoga",
    englishName: "The Despair of Arjuna",
    versesCount: 47,
    description: "Arjuna's crisis of conscience and sorrow upon witnessing beloved friends and family arrayed on the battlefield of Kurukshetra.",
    summary: "Reflects the universal human condition: moral dilemma, paralysis in duty, and turning to higher wisdom when our intellect falters.",
    sampleQuestion: "Why was Arjuna hesitant to fight, and what does it teach us about emotional overwhelm?"
  },
  {
    number: 2,
    sanskritName: "Sankhya Yoga",
    englishName: "The Yoga of Knowledge & Self-Realization",
    versesCount: 72,
    description: "Krishna reveals the eternal nature of the soul (Atman), the illusion of death, and the qualities of a stable mind (Sthitaprajna).",
    summary: "The foundational core of Gita's philosophy: knowing that you are eternal consciousness beyond the physical body and transient sensations.",
    sampleQuestion: "What are the qualities of a person of steady intellect (Sthitaprajna) according to Chapter 2?"
  },
  {
    number: 3,
    sanskritName: "Karma Yoga",
    englishName: "The Yoga of Selfless Action",
    versesCount: 43,
    description: "Krishna explains why action cannot be avoided and reveals how to act with dedication without attachment to outcomes.",
    summary: "The secret of active life: selfless duty (Nishkama Karma) prevents bondage and purifies the human spirit.",
    sampleQuestion: "How can I work with 100% devotion without being anxious about the result?"
  },
  {
    number: 4,
    sanskritName: "Jnana Karma Sanyasa Yoga",
    englishName: "The Yoga of Knowledge and the Renunciation of Action",
    versesCount: 42,
    description: "Krishna reveals the divine lineage of wisdom, the purpose of divine descent (Avatara), and how knowledge burns all past karmas.",
    summary: "Knowledge (Jnana) acts as a sacred fire that purifies our motives and transforms everyday work into worship.",
    sampleQuestion: "What is meant by 'knowledge is the great purifier' in Chapter 4?"
  },
  {
    number: 5,
    sanskritName: "Karma Sanyasa Yoga",
    englishName: "The Yoga of Renunciation",
    versesCount: 29,
    description: "Clarifies the harmony between outer duty and inner detachment, living like a lotus leaf in water.",
    summary: "True renunciation is not abandoning society, but relinquishing egotism, jealousy, and greed from within.",
    sampleQuestion: "How can one live like a lotus leaf in muddy water amidst daily stress?"
  },
  {
    number: 6,
    sanskritName: "Dhyana Yoga",
    englishName: "The Yoga of Meditation",
    versesCount: 47,
    description: "Comprehensive guide to meditation, posture, breathing, taming the restless mind, and becoming one's own friend.",
    summary: "The mind can be your greatest friend or your worst enemy; practice (Abhyasa) and non-attachment (Vairagya) tame it.",
    sampleQuestion: "What techniques does Lord Krishna suggest in Chapter 6 to calm a wandering mind?"
  },
  {
    number: 7,
    sanskritName: "Jnana Vijnana Yoga",
    englishName: "The Yoga of Knowledge and Discernment",
    versesCount: 30,
    description: "Krishna explains the material and spiritual energies, and the four kinds of seekers who seek the Divine.",
    summary: "Recognizing divinity manifesting through nature: the fragrance in earth, taste in water, and radiance in the sun.",
    sampleQuestion: "Who are the four types of people who seek God according to Chapter 7?"
  },
  {
    number: 8,
    sanskritName: "Akshara Brahma Yoga",
    englishName: "The Yoga of the Imperishable Absolute",
    versesCount: 28,
    description: "Teachings on the moment of death, remembrance of the Divine, the cycles of cosmic creation, and liberation.",
    summary: "What we meditate upon throughout life shapes our final consciousness and future destiny.",
    sampleQuestion: "How does our daily practice determine our thoughts during testing times?"
  },
  {
    number: 9,
    sanskritName: "Raja Vidya Raja Guhya Yoga",
    englishName: "The Yoga of Sovereign Knowledge and Sovereign Secret",
    versesCount: 34,
    description: "The royal secret of universal omnipresence, effortless surrender, and unconditional divine love.",
    summary: "Even a humble leaf, flower, fruit, or water offered with love is accepted by the Divine Lord.",
    sampleQuestion: "What is the royal secret explained by Lord Krishna in Chapter 9?"
  },
  {
    number: 10,
    sanskritName: "Vibhuti Yoga",
    englishName: "The Yoga of Divine Splendors",
    versesCount: 42,
    description: "Krishna describes His infinite divine manifestations throughout the universe, cosmos, and human excellence.",
    summary: "Whatever is radiant, noble, and mighty in creation is a spark of supreme divine splendor.",
    sampleQuestion: "Where can we see the presence of the Divine in everyday existence?"
  },
  {
    number: 11,
    sanskritName: "Vishwaroopa Darshana Yoga",
    englishName: "The Vision of the Universal Cosmic Form",
    versesCount: 55,
    description: "Arjuna is granted divine eyes (Divya Chakshu) to witness the stupendous, all-encompassing cosmic form of Krishna.",
    summary: "A mystical revelation of Time (Kala) as the ultimate transformer and the sublime unity of all existence.",
    sampleQuestion: "What was Arjuna's reaction upon witnessing the Cosmic Form (Vishwaroopa)?"
  },
  {
    number: 12,
    sanskritName: "Bhakti Yoga",
    englishName: "The Yoga of Devotion",
    versesCount: 20,
    description: "The path of heartfelt love, compassion, equanimity, and devotion towards the Supreme.",
    summary: "The dearest devotees are those free from hatred, gentle to all living beings, and steady in joy and sorrow.",
    sampleQuestion: "What are the qualities of a true devotee as described in Chapter 12?"
  },
  {
    number: 13,
    sanskritName: "Kshetra Kshetrajna Vibhaga Yoga",
    englishName: "The Yoga of the Field and Knower of the Field",
    versesCount: 35,
    description: "Discrimination between the physical body/nature (Kshetra) and the witnessing consciousness (Kshetrajna).",
    summary: "Understanding that the observing soul remains unaffected by the changes of the mortal body and emotions.",
    sampleQuestion: "What is the difference between the 'Field' and the 'Knower of the Field'?"
  },
  {
    number: 14,
    sanskritName: "Gunatraya Vibhaga Yoga",
    englishName: "The Yoga of the Three Modes of Material Nature",
    versesCount: 27,
    description: "An analysis of the three Gunas: Sattva (harmony, clarity), Rajas (passion, agitation), and Tamas (inertia, darkness).",
    summary: "Mastering human psychology by shifting from darkness to passion, then to purity, and ultimately transcending all three.",
    sampleQuestion: "How do Sattva, Rajas, and Tamas influence our moods and decisions?"
  },
  {
    number: 15,
    sanskritName: "Purushottama Yoga",
    englishName: "The Yoga of the Supreme Divine Personality",
    versesCount: 20,
    description: "The metaphor of the cosmic Ashvattha tree with roots above, and the eternal spirit transcending transient matter.",
    summary: "Cutting down attachment with the strong axe of detachment and realizing the Supreme Soul residing within each heart.",
    sampleQuestion: "What is the symbolism of the inverted Ashvattha tree in Chapter 15?"
  },
  {
    number: 16,
    sanskritName: "Daivasura Sampad Vibhaga Yoga",
    englishName: "The Yoga of the Divine and Demonic Natures",
    versesCount: 24,
    description: "The contrast between liberating divine virtues (fearlessness, compassion, humility) and degrading vices (lust, anger, greed).",
    summary: "Lust, anger, and greed are the three gates to self-destruction; cultivate fearlessness and truthfulness.",
    sampleQuestion: "What are the three gates to darkness that Krishna warns against in Chapter 16?"
  },
  {
    number: 17,
    sanskritName: "Shraddhatraya Vibhaga Yoga",
    englishName: "The Yoga of the Threefold Faith",
    versesCount: 28,
    description: "How food, charity, austerity, and faith reflect the three modes of nature, and the power of 'Om Tat Sat'.",
    summary: "Our faith determines our character; serene food, pure intentions, and sincere speech purify our consciousness.",
    sampleQuestion: "What does the Gita teach about pure (Sattvic) food, speech, and charity?"
  },
  {
    number: 18,
    sanskritName: "Moksha Sanyasa Yoga",
    englishName: "The Yoga of Liberation through Renunciation",
    versesCount: 78,
    description: "The culmination of all Gita teachings: types of duty, intellect, courage, happiness, and ultimate surrender (Sharanagati).",
    summary: "Give up all anxieties and surrender your heart to the Supreme. You shall be freed from all sorrow. Do not fear.",
    sampleQuestion: "What is the core message of the final verse of Lord Krishna: 'Sarva dharman parityajya'?"
  }
];

export const DAILY_SHLOKAS: Shloka[] = [
  {
    verse: "2.47",
    chapter: 2,
    verseNumber: 47,
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
    transliteration: "Karmanye vadhikaraste ma phaleshu kadachana,\nMa karma-phala-hetur bhur ma te sango 'stv akarmani.",
    translation: "You have a right to perform your prescribed duties, but never to the fruits of actions. Never let the fruits be your motive, nor let your mind be drawn to inaction.",
    meaning: "Focus wholeheartedly on the quality of your effort in the present moment, releasing the anxiety of future outcomes."
  },
  {
    verse: "6.5",
    chapter: 6,
    verseNumber: 5,
    sanskrit: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥",
    transliteration: "Uddhared atmanatmanam natmanam avasadayet,\nAtmaiva hy atmano bandhur atmaiva ripur atmanah.",
    translation: "Elevate yourself through the power of your mind, and do not degrade yourself. For the mind can be your greatest friend, and also your worst enemy.",
    meaning: "Self-mastery begins within. Befriend your mind through discipline, mindfulness, and gentle understanding."
  },
  {
    verse: "2.71",
    chapter: 2,
    verseNumber: 71,
    sanskrit: "विहाय कामान्यः सर्वान्पुमांश्चरति निःस्पृहः।\nनिर्ममो निरहङ्कारः स शान्तिमधिगच्छति॥",
    transliteration: "Vihaya kaman yah sarvan pumams charati nihsprihah,\nNirmamo nirahankarah sa santim adhigacchati.",
    translation: "That person attains peace who, relinquishing all desires, moves about free from longing, devoid of possessiveness, and free from egoism.",
    meaning: "True peace (Shanti) blooms when the heavy baggage of 'I' and 'Mine' dissolves into gratitude and surrender."
  },
  {
    verse: "18.66",
    chapter: 18,
    verseNumber: 66,
    sanskrit: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥",
    transliteration: "Sarva-dharman parityajya mam ekam saranam vraja,\nAham tvam sarva-papebhyo moksayisyami ma sucah.",
    translation: "Abandon all varieties of anxieties and mental constructs; simply surrender to Me alone. I shall liberate you from all fears and sorrows. Do not grieve.",
    meaning: "The ultimate refuge: trust in the Divine benevolence and let go of despair."
  }
];

export const PROMPT_CATEGORIES: PromptCategory[] = [
  {
    category: "Inner Peace & Anxiety",
    icon: "🧘",
    prompts: [
      "How to deal with loneliness and find peace within?",
      "How do I calm an anxious and overthinking mind?",
      "What does the Gita teach about handling grief and loss?",
      "How can I stop comparing myself to others?"
    ]
  },
  {
    category: "Duty, Career & Focus",
    icon: "🎯",
    prompts: [
      "How to work with dedication without stressing about the outcome?",
      "How to overcome laziness, procrastination, and lack of focus?",
      "What is my Swadharma (true duty) and how do I find it?",
      "How to make difficult career decisions when torn between choices?"
    ]
  },
  {
    category: "Relationships & Compassion",
    icon: "🤝",
    prompts: [
      "How to handle anger and disrespect from people I care about?",
      "How to practice unconditional compassion without getting hurt?",
      "What does the Gita teach about true selfless love and devotion?",
      "How to let go of toxic expectations in relationships?"
    ]
  },
  {
    category: "Meditation & Mind Mastery",
    icon: "🕊️",
    prompts: [
      "What are Krishna's practical steps for daily meditation?",
      "How can I make my mind my best friend instead of my enemy?",
      "How to maintain calm and balance in both success and failure?",
      "What are the three Gunas (Sattva, Rajas, Tamas) and how do they affect us?"
    ]
  }
];
