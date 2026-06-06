import React from 'react';
import styled from 'styled-components';
import { SlideContainer, LeadText } from '../../../components/presentation/SlideLayout';
import MathSection from '../../../components/presentation/MathSection';
import PlainEnglish from '../../../components/presentation/PlainEnglish';
import DataTable from '../../../components/presentation/DataTable';
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

const BioBERTTrainingSlide = () => {
  const hyperRows = [
    { id: 1, setting: 'Base model', value: 'Yuvrajxms09/biobert-triage-classifier' },
    { id: 2, setting: 'Merge', value: 'train.csv ⋈ chief_complaints.csv (~80k rows)' },
    { id: 3, setting: 'Epochs', value: '3 (13,500 steps)' },
    { id: 4, setting: 'Best eval_loss', value: '0.001812' },
  ];

  return (
    <SlideContainer>
      <LeadText>
        How BioBERT learned triage — flip each loss formula to see pre-training vs fine-tuning
        on real hospital rows.
      </LeadText>

      <MathSection
        title="Pre-training (BioBERT foundation)"
        equations={[{
          latex: MLM_LOSS,
          explanation: <p>Fill-in-the-blank on PubMed teaches medical English.</p>,
          example: mlmLossExample,
        }]}
        compact
        flipMinHeight={220}
      />

      <MathSection
        title="Fine-tuning (our triage task)"
        equations={[{
          latex: TRAINING_LOSS,
          explanation: <p>Minimise error vs nurse labels on 80k chief complaints.</p>,
          example: trainingLossExample,
        }]}
        flipMinHeight={240}
      />

      <DataTable
        columns={[
          { key: 'setting', label: 'Hyperparameter' },
          { key: 'value', label: 'Value' },
        ]}
        rows={hyperRows}
      />

      <StepGrid>
        <StepBox><strong>Forward</strong><span>Guess acuity for batch of 16</span></StepBox>
        <StepBox><strong>Loss ℒ</strong><span>Compare to nurse label</span></StepBox>
        <StepBox><strong>Backprop</strong><span>Update weights</span></StepBox>
        <StepBox><strong>×3 epochs</strong><span>eval_loss → 0.001812</span></StepBox>
      </StepGrid>

      <PlainEnglish>
        <p>Vitals excluded — model learns urgency from language alone.</p>
      </PlainEnglish>
    </SlideContainer>
  );
};

export default BioBERTTrainingSlide;
