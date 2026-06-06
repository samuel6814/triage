import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import PresentationScreen from './PresentationScreen';

import TriageIntroSlide from './slides/TriageIntroSlide';
import PathwayMappingSlide from './slides/PathwayMappingSlide';
import InputOverviewSlide from './slides/InputOverviewSlide';
import TextExampleSlide from './slides/TextExampleSlide';
import VoicePipelineSlide from './slides/VoicePipelineSlide';
import BioBERTPipelineSlide from './slides/BioBERTPipelineSlide';
import FusionPipelineSlide from './slides/FusionPipelineSlide';
import TewsFusionSlide from './slides/TewsFusionSlide';
import BayesianFallbackSlide from './slides/BayesianFallbackSlide';
import FusionDeepDiveSlide from './slides/FusionDeepDiveSlide';
import BioBERTTrainingSlide from './slides/BioBERTTrainingSlide';
import BioBERTInferenceSlide from './slides/BioBERTInferenceSlide';
import DataExplorationSlide from './slides/DataExplorationSlide';
import TewsDeepDiveSlide from './slides/TewsDeepDiveSlide';
import BayesianDeepDiveSlide from './slides/BayesianDeepDiveSlide';
import WorkedExampleSlide from './slides/WorkedExampleSlide';
import ResusSlide from './slides/ResusSlide';

const NavigationFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f1f5f9;
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #1e293b;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  visibility: ${props => props.hidden ? 'hidden' : 'visible'};

  &:hover {
    background: #f0fdf4;
    border-color: #bbf7d0;
    color: #166534;
    transform: ${props => props.direction === 'prev' ? 'translateX(-2px)' : 'translateX(2px)'};
  }

  span.sub-text {
    display: block;
    font-size: 0.75rem;
    color: #94a3b8;
    font-weight: 500;
    text-align: ${props => props.direction === 'prev' ? 'left' : 'right'};
  }
`;

export const presentationOrder = [
  {
    id: 'triage-intro',
    path: '/dashboard',
    title: 'What is Triage?',
    subtitle: 'SATS colour-coded clinical pathways',
    component: TriageIntroSlide,
  },
  {
    id: 'pathway-mapping',
    path: '/dashboard/pathways',
    title: 'Colour → Pathways → Departments',
    subtitle: 'Ghana hospital routing (KATH / SATS)',
    component: PathwayMappingSlide,
  },
  {
    id: 'input-overview',
    path: '/dashboard/pipeline/input',
    title: 'How Data Enters the System',
    subtitle: 'Step 1 — Patient describes symptoms (audio or text)',
    component: InputOverviewSlide,
  },
  {
    id: 'text-example',
    path: '/dashboard/pipeline/text-example',
    title: 'Example Text Input',
    subtitle: 'Step 2 — What typed patient text looks like',
    component: TextExampleSlide,
  },
  {
    id: 'voice-pipeline',
    path: '/dashboard/pipeline/voice',
    title: 'Speech & Translation',
    subtitle: 'Step 3 — Audio → transcribe → translate to English',
    component: VoicePipelineSlide,
  },
  {
    id: 'biobert-pipeline',
    path: '/dashboard/pipeline/biobert',
    title: 'Fine-Tuned BioBERT Layer',
    subtitle: 'Step 4 — Text X → acuity prediction (flip for example)',
    component: BioBERTPipelineSlide,
  },
  {
    id: 'biobert-inference',
    path: '/dashboard/math/biobert-inference',
    title: 'BioBERT: Inside the Model',
    subtitle: 'Embedding, attention, classification — flip each step',
    component: BioBERTInferenceSlide,
  },
  {
    id: 'biobert-training',
    path: '/dashboard/math/biobert-training',
    title: 'BioBERT: How It Was Trained',
    subtitle: 'Pre-training + fine-tuning loss — flip for hospital rows',
    component: BioBERTTrainingSlide,
  },
  {
    id: 'data-exploration',
    path: '/dashboard/math/data-exploration',
    title: 'Data Exploration & Findings',
    subtitle: '80k records, acuity distribution, predictions',
    component: DataExplorationSlide,
  },
  {
    id: 'fusion-pipeline',
    path: '/dashboard/pipeline/fusion',
    title: 'Fusion → Triage Colour',
    subtitle: 'Step 5 — BioBERT + vitals → final colour C (flip for example)',
    component: FusionPipelineSlide,
  },
  {
    id: 'tews-fusion',
    path: '/dashboard/pipeline/tews',
    title: 'Parallel Path: Vitals → TEWS',
    subtitle: 'Vital signs scored and sent to fusion — flip for HR/RR example',
    component: TewsFusionSlide,
  },
  {
    id: 'tews-deep',
    path: '/dashboard/math/tews',
    title: 'TEWS: Full Mathematics',
    subtitle: 'Piecewise f₁…f₆ — flip each formula',
    component: TewsDeepDiveSlide,
  },
  {
    id: 'bayesian-fallback',
    path: '/dashboard/pipeline/bayesian-fallback',
    title: 'Parallel Path: Bayesian Fallback',
    subtitle: 'When confidence is low — flip for KATH posterior',
    component: BayesianFallbackSlide,
  },
  {
    id: 'bayesian-deep',
    path: '/dashboard/math/bayesian',
    title: 'Bayesian: Full Mathematics',
    subtitle: 'Posteriors, evidence E, disease override — flip each',
    component: BayesianDeepDiveSlide,
  },
  {
    id: 'fusion-deep',
    path: '/dashboard/math/fusion',
    title: 'Fusion: Full Mathematics',
    subtitle: 'Algorithm 1 priority rules — flip for chest-pain case',
    component: FusionDeepDiveSlide,
  },
  {
    id: 'worked-example',
    path: '/dashboard/math/worked-example',
    title: 'End-to-End Worked Example',
    subtitle: 'All layers → Orange at KATH — flip the formulas',
    component: WorkedExampleSlide,
  },
  {
    id: 'resus',
    path: '/dashboard/pathways/resus',
    title: 'Resuscitation (Red)',
    subtitle: 'Immediate life-saving protocol',
    component: ResusSlide,
  },
];

const PresentationPages = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentIndex = useMemo(() => {
    const index = presentationOrder.findIndex(page => page.path === location.pathname);
    return index === -1 ? 0 : index;
  }, [location.pathname]);

  const currentSlide = presentationOrder[currentIndex];
  const ActiveComponent = currentSlide.component;

  const prevSlide = currentIndex > 0 ? presentationOrder[currentIndex - 1] : null;
  const nextSlide = currentIndex < presentationOrder.length - 1 ? presentationOrder[currentIndex + 1] : null;

  return (
    <PresentationScreen
      title={currentSlide.title}
      subtitle={currentSlide.subtitle}
      slideKey={currentSlide.id}
      hasPrev={Boolean(prevSlide)}
      hasNext={Boolean(nextSlide)}
      onPrev={() => prevSlide && navigate(prevSlide.path)}
      onNext={() => nextSlide && navigate(nextSlide.path)}
    >
      <ActiveComponent />

      <NavigationFooter>
        <NavButton
          direction="prev"
          hidden={!prevSlide}
          onClick={() => prevSlide && navigate(prevSlide.path)}
        >
          <ChevronLeft size={20} />
          <div>
            <span className="sub-text">Previous</span>
            {prevSlide?.title}
          </div>
        </NavButton>

        <NavButton
          direction="next"
          hidden={!nextSlide}
          onClick={() => nextSlide && navigate(nextSlide.path)}
        >
          <div style={{ textAlign: 'right' }}>
            <span className="sub-text">Next</span>
            {nextSlide?.title}
          </div>
          <ChevronRight size={20} />
        </NavButton>
      </NavigationFooter>
    </PresentationScreen>
  );
};

export default PresentationPages;
