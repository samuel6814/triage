import React from 'react';
import styled from 'styled-components';
import { SlideContainer, LeadText } from '../../../components/presentation/SlideLayout';
import MathSection from '../../../components/presentation/MathSection';
import PlainEnglish from '../../../components/presentation/PlainEnglish';
import DataTable from '../../../components/presentation/DataTable';
import InfoTooltip from '../../../components/presentation/InfoTooltip';
import NegativeLogDemo from '../../../components/presentation/NegativeLogDemo';
import { TRAINING_LOSS, MLM_LOSS } from '../../../components/presentation/equations';
import {
  mlmLossExample,
  trainingLossExample,
} from '../../../components/presentation/mathExamples';

const StepGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
`;

const StepBox = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  strong { display: block; color: #166534; margin-bottom: 4px; }
  span { font-size: 0.85rem; color: #64748b; }
`;

const PhaseLabel = styled.span`
  display: block;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #64748b;
  margin-bottom: 0.35rem;
`;

const BioBERTTrainingSlide = () => {
  const hyperRows = [
    {
      id: 1,
      setting: <>Base model <InfoTooltip topic="baseModel" /></>,
      value: 'Yuvrajxms09/biobert-triage-classifier',
    },
    {
      id: 2,
      setting: <>Merge <InfoTooltip topic="dataMerge" /></>,
      value: 'train.csv ⋈ chief_complaints.csv (~80k rows)',
    },
    {
      id: 3,
      setting: <>Epochs <InfoTooltip topic="epochs" /></>,
      value: '3 (13,500 steps)',
    },
    {
      id: 4,
      setting: <>Best eval_loss <InfoTooltip topic="evalLoss" /></>,
      value: '0.001812',
    },
  ];

  return (
    <SlideContainer>
      <LeadText>
        BioBERT learned in two phases — <strong>medical school</strong> (fill-in-the-blank on PubMed)
        then <strong>residency</strong> (triage on 80k hospital rows). Flip each formula for a worked
        example, and use the <strong>−log(P)</strong> slider below during Q&amp;A.
      </LeadText>

      <MathSection
        title="Phase 1: Medical school — the pre-training loss"
        info="mlmLoss"
        equations={[{
          latex: MLM_LOSS,
          label: 'L_LM — masked language modelling',
          info: 'mlmLoss',
          explanation: (
            <p>
              Millions of PubMed sentences, ~15% of words masked — predict the blank from context
              (e.g. &quot;severe ___ pain&quot; → <strong>chest</strong>).
            </p>
          ),
          example: mlmLossExample,
        }]}
        compact
        flipMinHeight={220}
      />

      <PlainEnglish title="Say this live — Phase 1">
        <p>
          Before our AI could triage patients, it had to understand medical terminology. This first
          formula is the Masked Language Modelling loss. The model was given millions of medical
          sentences with 15% of the words blanked out. It had to look at the context — like
          &quot;severe ___ pain&quot; — and predict the missing word. If it predicted &quot;chest&quot;,
          the probability P was high, and the mathematical penalty dropped. Through millions of
          repetitions, the model mapped the complex grammar of clinical medicine.
        </p>
      </PlainEnglish>

      <MathSection
        title="Phase 2: Residency — the fine-tuning loss"
        info="fineTuneLoss"
        equations={[{
          latex: TRAINING_LOSS,
          label: 'L — cross-entropy on nurse labels',
          info: 'fineTuneLoss',
          explanation: (
            <p>
              Each of N ≈ 80k complaints: read X_i, guess acuity; penalise −log P(y_i | X_i) when
              the model disagrees with the nurse label y_i.
            </p>
          ),
          example: trainingLossExample,
        }]}
        flipMinHeight={240}
      />

      <PlainEnglish title="Say this live — Phase 2">
        <p>
          Once the model understood clinical language, we fine-tuned it on our specific task using
          cross-entropy loss. For every patient in our historical dataset, the model reads the text
          and guesses a triage level. If the real nurse marked the patient as Orange, but the model
          was only 10% confident it was Orange, this negative-log formula generates a massive
          mathematical penalty. The model is forced to update its weights to reduce that penalty,
          learning to align its predictions with real-world clinical triage decisions.
        </p>
      </PlainEnglish>

      <PlainEnglish title={<>Why the negative log (−log P)? <InfoTooltip topic="negativeLog" /></>}>
        <PhaseLabel>Interactive — use in the viva</PhaseLabel>
        <p style={{ marginBottom: '0.75rem' }}>
          Both formulas use <strong>−log(P)</strong> instead of plain percentages. When confidence
          in the correct answer is high, the penalty is tiny; when it is low, the penalty explodes —
          that steep curve is what forces the model to learn. Drag the slider:
        </p>
        <NegativeLogDemo />
      </PlainEnglish>

      <DataTable
        columns={[
          { key: 'setting', label: 'Hyperparameter' },
          { key: 'value', label: 'Value' },
        ]}
        rows={hyperRows}
      />

      <StepGrid>
        <StepBox><strong>Forward <InfoTooltip topic="forwardPass" /></strong><span>Guess acuity for batch of 16</span></StepBox>
        <StepBox><strong>Loss ℒ <InfoTooltip topic="lossFn" /></strong><span>Compare to nurse label</span></StepBox>
        <StepBox><strong>Backprop <InfoTooltip topic="backprop" /></strong><span>Update weights</span></StepBox>
        <StepBox>
          <strong>×3 epochs <InfoTooltip topic="trainingLoop" /></strong>
          <span>eval_loss → 0.001812</span>
        </StepBox>
      </StepGrid>

      <PlainEnglish>
        <p>Vitals excluded during NLP training — the model learns urgency from language alone; TEWS joins at fusion.</p>
      </PlainEnglish>
    </SlideContainer>
  );
};

export default BioBERTTrainingSlide;
