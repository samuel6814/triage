/** Light EN/TW copy for TriageTestPage only (not full-app i18n). */

export const UI_COPY = {
  en: {
    title: 'Test BioBERT Triage',
    subtitle:
      'Medical gate and OpenMed enrichment are on by default. Switch language for Twi intake, enter optional vitals to fuse, then explore charts and pipeline math.',
    language: 'Language',
    english: 'English',
    twi: 'Twi (Akan)',
    complaint: 'Chief complaint',
    placeholder:
      "Describe symptoms in the patient's own words — include what happened, where they came from, and key clinical terms if known",
    vitals: 'Optional vitals (TEWS fusion)',
    predict: 'Predict acuity',
    fuse: 'Fuse triage',
    translate: 'Translate to English',
    translating: 'Translating…',
    englishUsed: 'English used for the model',
    originalTwi: 'Original (Twi)',
    medicalGate: 'Medical gate',
    openMed: 'OpenMed enrichment',
    voice: 'Voice input',
    analyze: 'Analyze entities',
    deidentify: 'De-identify',
    demoFeatures: 'Demo features',
    tabResult: 'Result',
    tabPipeline: 'Pipeline',
    tabMath: 'Math',
    charts: 'Probability charts',
    vizTour: 'Open full visualization tour',
  },
  tw: {
    title: 'Sɔhwɛ BioBERT Triage',
    subtitle:
      'Medical gate ne OpenMed gu so. Sesaw kasa ma Twi, fa vitals ka ho sɛ wohwɛ fusion, na hwɛ graphs ne pipeline math.',
    language: 'Kasa',
    english: 'Borɔfo',
    twi: 'Twi (Akan)',
    complaint: 'Yareɛ ho asɛm',
    placeholder:
      'Ka nsɛnkyerɛnne a ɛfa wo ho — dɛn na ɛbaeɛ, ɛfiri he, ne nsɛmfua a ɛho hia',
    vitals: 'Vitals (TEWS fusion) — ɛnyɛ ɔhyɛ',
    predict: 'Hyɛ acuity',
    fuse: 'Fuse triage',
    translate: 'Kyerɛ aseɛ kɔ Borɔfo',
    translating: 'Reyɛ translation…',
    englishUsed: 'Borɔfo a model no de di dwuma',
    originalTwi: 'Twi a wɔkyerɛwee',
    medicalGate: 'Medical gate',
    openMed: 'OpenMed enrichment',
    voice: 'Voice input',
    analyze: 'Hwɛ entities',
    deidentify: 'Yi din / PII',
    demoFeatures: 'Demo features',
    tabResult: 'Result',
    tabPipeline: 'Pipeline',
    tabMath: 'Nkontabuo',
    charts: 'Probability charts',
    vizTour: 'Bue visualization tour',
  },
};

export const EXAMPLES_EN = [
  {
    label: 'Chest pain',
    text: 'crushing central chest pain, sweaty, cannot catch breath',
  },
  {
    label: 'Mild rash',
    text: 'mild rash on arm for a week, no fever',
  },
  {
    label: 'Abdominal pain',
    text: 'severe abdominal pain, vomiting blood',
  },
];

export const EXAMPLES_TW = [
  {
    label: 'Yafunu yare',
    text: 'Me yam hyehyee me, me nsuo gu me so, mintumi nhome yiye',
  },
  {
    label: 'Honam so',
    text: 'Me nsa so honam ayɛ kɔkɔɔ nnawɔtwe ni, me ho nnyɛ hyew',
  },
  {
    label: 'Yafunu',
    text: 'Me yafunu ye yaw yiye, me fee mogya',
  },
];
