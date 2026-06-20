/** 28-page NLP presentation — mirrors slides_new/nlp_patient_to_acuity.pdf */

export const NLP_TOTAL_PAGES = 28;

export const nlpPresentationSections = [
  {
    id: 'intro',
    title: 'Introduction',
    pages: [
      { page: 1, title: 'Title', subtitle: 'NLP Patient Description to Acuity' },
      { page: 2, title: 'Outline', subtitle: 'Table of contents' },
    ],
  },
  {
    id: 'clinical',
    title: 'Clinical Context',
    pages: [
      { page: 3, title: 'The Clinical Scenario', subtitle: 'SATS colour bar and chief complaint' },
      { page: 4, title: 'Dual Pathway: TEWS vs NLP', subtitle: 'Fusion safety rule' },
      { page: 5, title: 'NLP Supervised Learning', subtitle: 'Bag-of-words vs deep learning' },
    ],
  },
  {
    id: 'pipeline',
    title: 'NLP Pipeline',
    pages: [
      { page: 6, title: 'Tokenization', subtitle: 'Raw text to integer IDs' },
      { page: 7, title: 'Worked Example: ID Assignment', subtitle: 'Full token ID table' },
      { page: 8, title: 'What is [CLS]?', subtitle: 'Summary token for classification' },
      { page: 9, title: 'Embedding Lookup', subtitle: 'ID to 768-D vector' },
      { page: 10, title: 'What the Vector Represents', subtitle: 'Learned dimensions D1–D768' },
      { page: 11, title: 'Contextual Mapping', subtitle: 'Three embeddings summed' },
      { page: 12, title: 'Contextual Mapping Formula', subtitle: 'Token + position + segment' },
      { page: 13, title: 'The Input Matrix H⁽⁰⁾', subtitle: 'Matrix layout' },
      { page: 14, title: 'Matrix Walkthrough', subtitle: 'Numeric example' },
      { page: 15, title: '12 Stacked Encoder Layers', subtitle: 'Transformer stack diagram' },
      { page: 16, title: 'Inside One Encoder Layer', subtitle: 'Zˡ and Hˡ formulas' },
      { page: 17, title: 'Stacking 12 Layers', subtitle: 'Words to clinical understanding' },
      { page: 18, title: 'Self-Attention Mechanism', subtitle: 'Q, K, V diagram' },
      { page: 19, title: 'Self-Attention Equation', subtitle: 'Variable-by-variable' },
    ],
  },
  {
    id: 'pretraining',
    title: 'BERT Pre-Training',
    pages: [
      { page: 20, title: 'Masked Language Modeling', subtitle: 'PubMed fill-in-the-blank' },
      { page: 21, title: 'MLM Loss Formula', subtitle: 'ℒ_LM variable breakdown' },
      { page: 22, title: 'Independent vs Dependent Variables', subtitle: 'MLM numerical example' },
    ],
  },
  {
    id: 'learning',
    title: 'Learning Math',
    pages: [
      { page: 23, title: 'Attention Softmax', subtitle: 'The probability filter' },
      { page: 24, title: 'Classification Softmax', subtitle: 'Acuity probabilities' },
      { page: 25, title: 'Forward Pass & Cross-Entropy', subtitle: 'Training penalty' },
      { page: 26, title: 'Backpropagation', subtitle: 'The chain rule' },
      { page: 27, title: 'Gradient Descent', subtitle: 'Fine-tuning on 80k complaints' },
    ],
  },
  {
    id: 'summary',
    title: 'Summary',
    pages: [
      { page: 28, title: 'End-to-End', subtitle: 'Complaint to Yellow (72%)' },
    ],
  },
];

/** Flat ordered list for prev/next navigation */
export const nlpPresentationOrder = nlpPresentationSections.flatMap((section) =>
  section.pages.map((p) => ({
    id: `nlp-page-${p.page}`,
    page: p.page,
    path: `/dashboard/nlp/${p.page}`,
    title: p.title,
    subtitle: p.subtitle,
    section: section.title,
    guideTopic: `page${p.page}`,
  }))
);

export function getSlideByPage(pageNum) {
  const n = Number(pageNum);
  return nlpPresentationOrder.find((s) => s.page === n) ?? nlpPresentationOrder[0];
}

export function getSlideByPath(pathname) {
  return nlpPresentationOrder.find((s) => s.path === pathname) ?? null;
}
