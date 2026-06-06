import React from 'react';
import { SlideContainer, LeadText } from '../../../components/presentation/SlideLayout';
import MathSection from '../../../components/presentation/MathSection';
import PlainEnglish from '../../../components/presentation/PlainEnglish';
import {
  BAYES_POSTERIOR,
  BAYES_EVIDENCE,
  BAYES_ARGMAX,
  BAYES_DISEASE,
  BAYES_OVERRIDE,
} from '../../../components/presentation/equations';
import {
  bayesPosteriorExample,
  bayesEvidenceExample,
  bayesArgmaxExample,
  bayesDiseaseExample,
  bayesOverrideExample,
} from '../../../components/presentation/mathExamples';

const BayesianDeepDiveSlide = () => (
  <SlideContainer>
    <LeadText>
      Full Bayesian mathematics — flip each formula to see KATH chest-pain probabilities
      computed from real evidence E.
    </LeadText>

    <MathSection
      title="Bayes' rule"
      equations={[{ latex: BAYES_POSTERIOR, example: bayesPosteriorExample }]}
      flipMinHeight={320}
    />

    <MathSection
      title="Evidence vector E"
      equations={[{ latex: BAYES_EVIDENCE, example: bayesEvidenceExample }]}
      compact
      flipMinHeight={200}
    />

    <MathSection
      title="Pick the winner"
      equations={[{ latex: BAYES_ARGMAX, example: bayesArgmaxExample }]}
      compact
      flipMinHeight={180}
    />

    <MathSection
      title="Serious disease override"
      equations={[
        { latex: BAYES_DISEASE, example: bayesDiseaseExample },
        { latex: BAYES_OVERRIDE, label: 'Override rule', example: bayesOverrideExample },
      ]}
      compact
      flipMinHeight={200}
    />

    <PlainEnglish>
      <p>
        Prior = first guess from hospital history. Likelihood = how well symptoms fit each colour.
        Bayes combines both into an updated probability.
      </p>
    </PlainEnglish>
  </SlideContainer>
);

export default BayesianDeepDiveSlide;
