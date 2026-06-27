export const RUNNING_COMPLAINT =
  'I have a headache and feel feverish. My body aches and I feel weak.';

export const OUTLINE_SECTIONS = [
  { title: 'Clinical Context', items: ['The Clinical Scenario', 'Dual Pathway: TEWS vs NLP', 'NLP Supervised Learning'] },
  { title: 'NLP Pipeline', items: ['Tokenization → ID tables → [CLS]', 'Embedding lookup → vector space', 'Contextual mapping → H⁽⁰⁾ matrix', '12 encoder layers → self-attention'] },
  { title: 'BERT Pre-Training', items: ['Masked Language Modeling', 'MLM loss', 'Independent vs dependent variables'] },
  { title: 'Learning Math', items: ['Attention softmax', 'Classification softmax', 'Cross-entropy & backprop', 'Gradient descent & fine-tuning'] },
  { title: 'Summary', items: ['End-to-end: complaint → Yellow (72%)'] },
];
