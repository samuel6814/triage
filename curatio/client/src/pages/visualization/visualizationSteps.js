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
  { step: 1, section: 'Clinical Context', title: 'Clinical Scenario', stageLabel: 'Patient intake', caption: 'A patient describes symptoms in plain language — unstructured text enters triage.', durationMs: 12000, timelinePhases: ['avatar', 'type', 'sats', 'pulse'], equations: [] },
  { step: 2, section: 'Clinical Context', title: 'Dual Pathway', stageLabel: 'Dual pathway', caption: 'Vitals scoring and language analysis run in parallel, then fuse into one colour.', durationMs: 12000, timelinePhases: ['paths', 'dots', 'fusion', 'output'], equations: [] },
  { step: 3, section: 'Clinical Context', title: 'Supervised Pipeline', stageLabel: 'Full pipeline', caption: 'Text flows through tokenize → embed → encode → classify to pick a SATS colour.', durationMs: 12000, timelinePhases: ['boxes', 'packet', 'verbs'], equations: [] },
  { step: 4, section: 'NLP Pipeline', title: 'Tokenization', stageLabel: 'Tokenize', caption: 'The complaint splits into WordPiece tokens, each mapped to a vocabulary ID.', durationMs: 12000, timelinePhases: ['sentence', 'split', 'ids'], equations: [{ latex: TOKENIZATION_TAU }] },
  { step: 5, section: 'NLP Pipeline', title: '[CLS] Token', stageLabel: '[CLS] slot', caption: '[CLS] sits at position 0 — after 12 layers it holds the whole-sentence summary.', durationMs: 12000, timelinePhases: ['slide', 'push', 'arrow'], equations: [] },
  { step: 6, section: 'NLP Pipeline', title: 'Embedding Lookup', stageLabel: 'Embed lookup', caption: 'Each token ID looks up a row of 768 numbers that encode meaning.', durationMs: 12000, timelinePhases: ['highlight', 'sweep', 'vector'], equations: [{ latex: EMBEDDING_LOOKUP }] },
  { step: 7, section: 'NLP Pipeline', title: 'Vector Space', stageLabel: 'Vector space', caption: 'Similar clinical words cluster together in learned embedding space.', durationMs: 12000, timelinePhases: ['scatter', 'cluster'], equations: [] },
  { step: 8, section: 'NLP Pipeline', title: 'Contextual Sum', stageLabel: 'Contextual sum', caption: 'Word, position, and segment embeddings add to form each token input.', durationMs: 12000, timelinePhases: ['blocks', 'merge'], equations: [{ latex: TOKEN_EMBED }] },
  { step: 9, section: 'NLP Pipeline', title: 'Input Matrix H⁽⁰⁾', stageLabel: 'Input matrix', caption: 'Every token becomes one row — M tokens × 768 dimensions.', durationMs: 12000, timelinePhases: ['rows', 'cells'], equations: [{ latex: INPUT_MATRIX }] },
  { step: 10, section: 'NLP Pipeline', title: 'Encoder Stack', stageLabel: '12 layers', caption: 'Data rises through 12 transformer layers of self-attention and feed-forward.', durationMs: 12000, timelinePhases: ['fade', 'pulse', 'labels'], equations: [] },
  { step: 11, section: 'NLP Pipeline', title: 'Inside One Layer', stageLabel: 'One layer', caption: 'Attention pulls context from feverish into headache; residuals preserve information.', durationMs: 12000, timelinePhases: ['node', 'arrow', 'update'], equations: [{ latex: ENCODER_Z }, { latex: ENCODER_H }] },
  { step: 12, section: 'NLP Pipeline', title: 'Stacking 12 Layers', stageLabel: 'Layer phases', caption: 'Shallow layers read words; deep layers encode clinical urgency.', durationMs: 12000, timelinePhases: ['stack'], equations: [{ latex: STACK_LAYERS }] },
  { step: 13, section: 'NLP Pipeline', title: 'Self-Attention', stageLabel: 'Attention', caption: 'headache attends most to feverish (41%), then weak (18%) — symptoms link together.', durationMs: 12000, timelinePhases: ['arcs', 'bars'], equations: [{ latex: ATTENTION_QKV }, { latex: ATTENTION }] },
  { step: 14, section: 'Pre-Training', title: 'Masked Language Modeling', stageLabel: 'MLM', caption: 'Before triage labels, BioBERT learns medicine by predicting masked words on PubMed.', durationMs: 12000, timelinePhases: ['blink', 'cycle', 'lock'], equations: [] },
  { step: 15, section: 'Pre-Training', title: 'MLM Loss', stageLabel: 'MLM loss', caption: 'High confidence on the correct word means a small penalty; wrong guesses cost more.', durationMs: 12000, timelinePhases: ['bars'], equations: [{ latex: MLM_LOSS }] },
  { step: 16, section: 'Learning Math', title: 'Attention Softmax', stageLabel: 'Softmax α', caption: 'Attention scores become probabilities that sum to 1 across all tokens.', durationMs: 12000, timelinePhases: ['scores', 'morph', 'sum'], equations: [{ latex: ATTENTION_SOFTMAX }] },
  { step: 17, section: 'Learning Math', title: 'Classification Softmax', stageLabel: 'Classify', caption: 'The [CLS] summary vector maps to acuity probabilities — Yellow at 72%.', durationMs: 12000, timelinePhases: ['bars', 'badge', 'pulse'], equations: [{ latex: ACUITY_SOFTMAX }] },
  { step: 18, section: 'Learning Math', title: 'Cross-Entropy Loss', stageLabel: 'Cross-entropy', caption: 'Training compares nurse labels to predictions — confident mistakes get large loss.', durationMs: 12000, timelinePhases: ['compare', 'count'], equations: [{ latex: CROSS_ENTROPY_SINGLE }] },
  { step: 19, section: 'Learning Math', title: 'Backpropagation', stageLabel: 'Backprop', caption: 'Error flows backward through all 12 layers to find which weights caused the mistake.', durationMs: 12000, timelinePhases: ['pulse', 'flash'], equations: [{ latex: CHAIN_RULE }] },
  { step: 20, section: 'Learning Math', title: 'Gradient Descent', stageLabel: 'Fine-tune', caption: '80,000 labeled complaints tune BioBERT over 13,500 steps across 3 epochs.', durationMs: 12000, timelinePhases: ['curve', 'counter'], equations: [{ latex: GRADIENT_DESCENT }, { latex: TRIAGE_FINETUNE_LOSS }] },
  { step: 21, section: 'Summary', title: 'End-to-End', stageLabel: 'Yellow 72%', caption: 'Complaint → tokens → 12 layers → Yellow (72%) → fusion with vitals.', durationMs: 14000, timelinePhases: ['flow'], equations: [] },
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
