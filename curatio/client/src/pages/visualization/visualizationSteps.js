import {
  TOKENIZATION_TAU,
  EMBEDDING_LOOKUP,
  TOKEN_EMBED,
  INPUT_MATRIX,
  ENCODER_Z,
  ENCODER_H,
  STACK_LAYERS,
  ATTENTION,
  ATTENTION_QKV,
  MLM_LOSS,
  ATTENTION_SOFTMAX,
  ACUITY_SOFTMAX,
  CROSS_ENTROPY_SINGLE,
  CHAIN_RULE,
  GRADIENT_DESCENT,
  TRIAGE_FINETUNE_LOSS,
} from '../../components/presentation/equations';

export const VIZ_TOTAL_STEPS = 21;

const STEP_DEFS = [
  { step: 1, section: 'Clinical Context', title: 'Clinical Scenario', stageLabel: 'Patient intake', caption: 'A patient describes symptoms in plain language — unstructured text enters triage.', durationMs: 12000, equations: [], formulaTerms: [] },
  { step: 2, section: 'Clinical Context', title: 'Dual Pathway', stageLabel: 'Dual pathway', caption: 'Vitals scoring and language analysis run in parallel, then fuse into one colour.', durationMs: 12000, equations: [], formulaTerms: [] },
  { step: 3, section: 'Clinical Context', title: 'Supervised Pipeline', stageLabel: 'Full pipeline', caption: 'Text flows through tokenize → embed → encode → classify to pick a SATS colour.', durationMs: 12000, equations: [], formulaTerms: [] },
  {
    step: 4, section: 'NLP Pipeline', title: 'Tokenization', stageLabel: 'Tokenize',
    caption: 'The complaint splits into WordPiece tokens, each mapped to a vocabulary ID.', durationMs: 12000,
    equations: [{ latex: TOKENIZATION_TAU }],
    formulaTerms: [{ id: 'tau', label: 'τ(·)' }, { id: 'id', label: 'id(t_i)' }, { id: 'vocab', label: 'V = 30k' }],
  },
  { step: 5, section: 'NLP Pipeline', title: '[CLS] Token', stageLabel: '[CLS] slot', caption: '[CLS] sits at position 0 — after 12 layers it holds the whole-sentence summary.', durationMs: 12000, equations: [], formulaTerms: [] },
  {
    step: 6, section: 'NLP Pipeline', title: 'Embedding Lookup', stageLabel: 'Embed lookup',
    caption: 'Each token ID looks up a row of 768 numbers that encode meaning.', durationMs: 12000,
    equations: [{ latex: EMBEDDING_LOOKUP }],
    formulaTerms: [{ id: 'E_word', label: 'E_word' }, { id: 'id', label: 'id(t_i)' }, { id: 'e_i', label: 'e_i ∈ ℝ⁷⁶⁸' }],
  },
  { step: 7, section: 'NLP Pipeline', title: 'Vector Space', stageLabel: 'Vector space', caption: 'Similar clinical words cluster together in learned embedding space.', durationMs: 12000, equations: [], formulaTerms: [] },
  {
    step: 8, section: 'NLP Pipeline', title: 'Contextual Sum', stageLabel: 'Contextual sum',
    caption: 'Word, position, and segment embeddings add to form each token input.', durationMs: 12000,
    equations: [{ latex: TOKEN_EMBED }],
    formulaTerms: [{ id: 'E_word', label: 'E_word' }, { id: 'E_pos', label: 'E_pos' }, { id: 'E_seg', label: 'E_seg' }, { id: 'E', label: 'E(t_i)' }],
  },
  {
    step: 9, section: 'NLP Pipeline', title: 'Input Matrix H⁽⁰⁾', stageLabel: 'Input matrix',
    caption: 'Every token becomes one row — M tokens × 768 dimensions.', durationMs: 12000,
    equations: [{ latex: INPUT_MATRIX }],
    formulaTerms: [{ id: 'H0', label: 'H⁽⁰⁾' }, { id: 'M', label: 'M tokens' }, { id: '768', label: '768 dims' }],
  },
  { step: 10, section: 'NLP Pipeline', title: 'Encoder Stack', stageLabel: '12 layers', caption: 'Data rises through 12 transformer layers of self-attention and feed-forward.', durationMs: 12000, equations: [], formulaTerms: [] },
  {
    step: 11, section: 'NLP Pipeline', title: 'Inside One Layer', stageLabel: 'One layer',
    caption: 'Attention pulls context from feverish into headache; residuals preserve information.', durationMs: 12000,
    equations: [{ latex: ENCODER_Z }, { latex: ENCODER_H }],
    formulaTerms: [{ id: 'Z', label: 'Z⁽ℓ⁾' }, { id: 'H', label: 'H⁽ℓ⁾' }, { id: 'attn', label: 'Attention' }],
  },
  {
    step: 12, section: 'NLP Pipeline', title: 'Stacking 12 Layers', stageLabel: 'Layer phases',
    caption: 'Shallow layers read words; deep layers encode clinical urgency.', durationMs: 12000,
    equations: [{ latex: STACK_LAYERS }],
    formulaTerms: [{ id: 'H0', label: 'H⁽⁰⁾' }, { id: 'H12', label: 'H⁽¹²⁾' }, { id: 'layers', label: '12 layers' }],
  },
  {
    step: 13, section: 'NLP Pipeline', title: 'Self-Attention', stageLabel: 'Attention',
    caption: 'headache attends most to feverish (41%), then weak (18%) — symptoms link together.', durationMs: 12000,
    equations: [{ latex: ATTENTION_QKV }, { latex: ATTENTION }],
    formulaTerms: [{ id: 'Q', label: 'Q' }, { id: 'K', label: 'K' }, { id: 'V', label: 'V' }, { id: 'alpha', label: 'α weights' }],
  },
  { step: 14, section: 'Pre-Training', title: 'Masked Language Modeling', stageLabel: 'MLM', caption: 'Before triage labels, BioBERT learns medicine by predicting masked words on PubMed.', durationMs: 12000, equations: [], formulaTerms: [] },
  {
    step: 15, section: 'Pre-Training', title: 'MLM Loss', stageLabel: 'MLM loss',
    caption: 'High confidence on the correct word means a small penalty; wrong guesses cost more.', durationMs: 12000,
    equations: [{ latex: MLM_LOSS }],
    formulaTerms: [{ id: 'L', label: 'ℒ_LM' }, { id: 'P', label: 'P(t_i)' }, { id: 'log', label: '−log(·)' }],
  },
  {
    step: 16, section: 'Learning Math', title: 'Attention Softmax', stageLabel: 'Softmax α',
    caption: 'Attention scores become probabilities that sum to 1 across all tokens.', durationMs: 12000,
    equations: [{ latex: ATTENTION_SOFTMAX }],
    formulaTerms: [{ id: 'alpha', label: 'α_j' }, { id: 'exp', label: 'exp(·)' }, { id: 'sum', label: 'Σ = 1' }],
  },
  {
    step: 17, section: 'Learning Math', title: 'Classification Softmax', stageLabel: 'Classify',
    caption: 'The [CLS] summary vector maps to acuity probabilities — Yellow at 72%.', durationMs: 12000,
    equations: [{ latex: ACUITY_SOFTMAX }],
    formulaTerms: [{ id: 'h', label: 'h_[CLS]' }, { id: 'W', label: 'W, b' }, { id: 'y', label: 'ŷ (5 classes)' }],
  },
  {
    step: 18, section: 'Learning Math', title: 'Cross-Entropy Loss', stageLabel: 'Cross-entropy',
    caption: 'Training compares nurse labels to predictions — confident mistakes get large loss.', durationMs: 12000,
    equations: [{ latex: CROSS_ENTROPY_SINGLE }],
    formulaTerms: [{ id: 'L', label: 'ℒ' }, { id: 'y', label: 'y (true)' }, { id: 'yhat', label: 'ŷ (pred)' }],
  },
  {
    step: 19, section: 'Learning Math', title: 'Backpropagation', stageLabel: 'Backprop',
    caption: 'Error flows backward through all 12 layers to find which weights caused the mistake.', durationMs: 12000,
    equations: [{ latex: CHAIN_RULE }],
    formulaTerms: [{ id: 'dL', label: '∂ℒ/∂W' }, { id: 'chain', label: 'chain rule' }, { id: 'layers', label: '12 layers' }],
  },
  {
    step: 20, section: 'Learning Math', title: 'Gradient Descent', stageLabel: 'Fine-tune',
    caption: '80,000 labeled complaints tune BioBERT over 13,500 steps across 3 epochs.', durationMs: 12000,
    equations: [{ latex: GRADIENT_DESCENT }, { latex: TRIAGE_FINETUNE_LOSS }],
    formulaTerms: [{ id: 'W', label: 'W_new' }, { id: 'alpha', label: 'α (lr)' }, { id: 'grad', label: '∂ℒ/∂W' }],
  },
  { step: 21, section: 'Summary', title: 'End-to-End', stageLabel: 'Yellow 72%', caption: 'Complaint → tokens → 12 layers → Yellow (72%) → fusion with vitals.', durationMs: 14000, equations: [], formulaTerms: [] },
];

export const visualizationSections = [
  { id: 'clinical', title: 'Clinical Context', steps: [1, 2, 3] },
  { id: 'pipeline', title: 'NLP Pipeline', steps: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13] },
  { id: 'pretraining', title: 'Pre-Training', steps: [14, 15] },
  { id: 'learning', title: 'Learning Math', steps: [16, 17, 18, 19, 20] },
  { id: 'summary', title: 'Summary', steps: [21] },
];

export const visualizationOrder = STEP_DEFS.map((d) => ({
  ...d,
  id: `viz-step-${d.step}`,
  path: `/visualization/${d.step}`,
}));

export function getVisualizationStep(stepNum) {
  const n = Number(stepNum);
  return visualizationOrder.find((s) => s.step === n) ?? visualizationOrder[0];
}

export function getVisualizationByPath(pathname) {
  return visualizationOrder.find((s) => s.path === pathname) ?? null;
}

export function getStepMeta(stepNum) {
  return getVisualizationStep(stepNum);
}
