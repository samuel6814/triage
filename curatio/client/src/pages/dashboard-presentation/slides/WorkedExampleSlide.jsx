import React from 'react';
import styled from 'styled-components';
import { SlideContainer, LeadText } from '../../../components/presentation/SlideLayout';
import MathSection from '../../../components/presentation/MathSection';
import PlainEnglish from '../../../components/presentation/PlainEnglish';
import ColourBadge from '../../../components/presentation/ColourBadge';
import InfoTooltip from '../../../components/presentation/InfoTooltip';
import { WORKED_CHEST, TEWS_EXAMPLE } from '../../../components/presentation/equations';
import {
  tewsWorkedExample,
  workedChestExample,
} from '../../../components/presentation/mathExamples';

const LayerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const LayerCard = styled.div`
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
  background: ${props => props.$bg || '#f8fafc'};
  h4 { margin: 0 0 8px; color: #166534; font-size: 0.95rem; display: flex; align-items: center; }
  p { margin: 0; color: #475569; font-size: 0.88rem; line-height: 1.55; }
`;

const ResultBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
  border: 2px solid #FF8C00;
  border-radius: 16px;
`;

const WorkedExampleSlide = () => (
  <SlideContainer>
    <LeadText>
      End-to-end Kumasi chest-pain case — flip each formula to see all three layers resolve
      to Orange at fusion.
    </LeadText>

    <LayerGrid>
      <LayerCard $bg="#f0fdf4">
        <h4>BioBERT <InfoTooltip topic="nlpChain" /></h4>
        <p>Central crushing chest pain → Orange language signal</p>
      </LayerCard>
      <LayerCard $bg="#fefce8">
        <h4>TEWS <InfoTooltip topic="tewsExample" /></h4>
        <p>HR=125, RR=26 → T=4 → Yellow from vitals alone</p>
      </LayerCard>
      <LayerCard $bg="#eff6ff">
        <h4>Bayesian <InfoTooltip topic="bayesArgmax" /></h4>
        <p>P(Orange|E) ≈ 0.89 — highest posterior</p>
      </LayerCard>
    </LayerGrid>

    <MathSection
      title="TEWS for this patient"
      info="tewsExample"
      equations={[{ latex: TEWS_EXAMPLE, label: 'TEWS calculation', info: 'tewsExample', example: tewsWorkedExample }]}
      compact
      flipMinHeight={220}
    />

    <MathSection
      title="Fusion resolution"
      info="workedChestFusion"
      equations={[{ latex: WORKED_CHEST, label: 'Fusion outcome', info: 'workedChestFusion', example: workedChestExample }]}
      flipMinHeight={280}
    />

    <ResultBanner>
      <div>
        <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 4 }}>Final triage colour</div>
        <ColourBadge color="Orange" label="ORANGE — Majors (ED)" />
      </div>
      <div style={{ color: '#475569', fontSize: '0.95rem' }}>
        → Cardiology alert<br />
        → 10-minute countdown<br />
        → Bed in Majors
      </div>
    </ResultBanner>

    <PlainEnglish>
      <p>
        Symptoms trumped moderate vitals — fusion enforced the safer Orange pathway. Flip the
        formulas above to walk the audience through each calculation live.
      </p>
    </PlainEnglish>
  </SlideContainer>
);

export default WorkedExampleSlide;
