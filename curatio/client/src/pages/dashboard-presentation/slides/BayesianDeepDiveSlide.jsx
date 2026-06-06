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
      info="bayesPosterior"
      equations={[{ latex: BAYES_POSTERIOR, label: "Bayes' rule", info: 'bayesPosterior', example: bayesPosteriorExample }]}
      flipMinHeight={320}
    />

    <MathSection
      title="Evidence vector E"
      info="bayesEvidence"
      equations={[{ latex: BAYES_EVIDENCE, label: 'Evidence vector', info: 'bayesEvidence', example: bayesEvidenceExample }]}
      compact
      flipMinHeight={200}
    />

    <MathSection
      title="Pick the winner"
      info="bayesArgmax"
      equations={[{ latex: BAYES_ARGMAX, label: 'argmax', info: 'bayesArgmax', example: bayesArgmaxExample }]}
      compact
      flipMinHeight={180}
    />

    <MathSection
      title="Serious disease override"
      info="bayesDisease"
      equations={[
        { latex: BAYES_DISEASE, label: 'P(D | S)', info: 'bayesDisease', example: bayesDiseaseExample },
        { latex: BAYES_OVERRIDE, label: 'Override rule', info: 'bayesOverride', example: bayesOverrideExample },
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
