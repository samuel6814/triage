import { SATS_COLORS } from '../../components/presentation/satsColors';

export const COMPLAINT_TEXT =
  'I have a headache and feel feverish. My body aches and I feel weak.';

export const TOKEN_ROWS = [
  { i: 0, raw: '—', token: '[CLS]', id: '101' },
  { i: 1, raw: 'I', token: 'i', id: '1045' },
  { i: 2, raw: 'have', token: 'have', id: '2031' },
  { i: 3, raw: 'a', token: 'a', id: '1037' },
  { i: 4, raw: 'headache', token: 'head+##ache', id: '7994, 8772' },
  { i: 5, raw: 'and', token: 'and', id: '1998' },
  { i: 6, raw: 'feel', token: 'feel', id: '2514' },
  { i: 7, raw: 'feverish', token: 'fever+##ish', id: '9643, 6804' },
  { i: 8, raw: '.', token: '.', id: '1012' },
  { i: 'M', raw: '—', token: '[SEP]', id: '102' },
];

export const KEY_TOKENS = ['[CLS]', 'i', 'have', 'head', 'feel', 'fever', '[SEP]'];

export const EMBED_SAMPLE = {
  '[CLS]': [0.02, 0.11, -0.05, 0.33, 0.08, -0.12, 0.21, 0.04],
  head: [0.31, -0.18, 0.52, 0.09, 0.44, 0.27, -0.11, 0.61],
  fever: [0.44, 0.27, -0.11, 0.61, 0.19, 0.33, -0.22, 0.15],
  weak: [0.22, 0.15, 0.38, -0.09, 0.11, 0.42, 0.05, -0.18],
};

export const MATRIX_ROWS = [
  { i: 0, token: '[CLS]', dims: [0.02, 0.11, -0.05, 0.33] },
  { i: 1, token: 'i', dims: [-0.08, 0.04, 0.19, 0.01] },
  { i: 2, token: 'have', dims: [0.15, -0.22, 0.07, 0.44] },
  { i: 4, token: 'head', dims: [0.31, -0.18, 0.52, 0.09] },
  { i: 7, token: 'fever', dims: [0.44, 0.27, -0.11, 0.61] },
];

export const ATTENTION_WEIGHTS = [
  { token: 'i', weight: 0.02 },
  { token: 'have', weight: 0.01 },
  { token: 'headache', weight: 0.32 },
  { token: 'feel', weight: 0.06 },
  { token: 'feverish', weight: 0.41 },
  { token: 'weak', weight: 0.18 },
];

export const SOFTMAX_OUTPUT = [
  { level: 1, label: 'Red', prob: 0.03, color: SATS_COLORS.red },
  { level: 2, label: 'Orange', prob: 0.07, color: SATS_COLORS.orange },
  { level: 3, label: 'Yellow', prob: 0.72, color: SATS_COLORS.yellow },
  { level: 4, label: 'Green', prob: 0.14, color: SATS_COLORS.green },
  { level: 5, label: 'Green', prob: 0.04, color: SATS_COLORS.green },
];

export const MLM_EXAMPLE = {
  tokens: ['The', 'patient', '[MASK]', 'severe', 'headache'],
  correct: 'headache',
  pGood: 0.92,
  pBad: 0.01,
};

export const ENCODER_LAYER_PHASES = [
  { range: '1–4', label: 'Shallow', focus: 'Individual words & simple phrases' },
  { range: '5–8', label: 'Middle', focus: 'headache + feverish + weak combined' },
  { range: '9–12', label: 'Deep', focus: 'Abstract clinical urgency patterns' },
];

export const LAYER_WALKTHROUGH = {
  headache: 2.0,
  attentionAdd: 0.5,
  afterNorm: 2.3,
  afterFfn: 2.8,
  afterResidual: 5.1,
};

export const ACUITY_TO_COLOUR = [
  { index: 0, level: 1, colour: 'Red' },
  { index: 1, level: 2, colour: 'Orange' },
  { index: 2, level: 3, colour: 'Yellow' },
  { index: 3, level: 4, colour: 'Green' },
  { index: 4, level: 5, colour: 'Green' },
];

export const CROSS_ENTROPY_EXAMPLE = {
  trueLabel: 'Yellow',
  wrongPred: 'Green',
  wrongProb: 0.9,
  trueProb: 0.05,
  loss: 3.0,
};

export const GRADIENT_DESCENT_STATS = {
  learningRate: '2×10⁻⁵',
  evalLoss: 0.001812,
  epochs: 3,
  steps: 13500,
  nTrain: 80000,
};
