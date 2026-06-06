import React from 'react';
import { SlideContainer, LeadText } from '../../../components/presentation/SlideLayout';
import MathSection from '../../../components/presentation/MathSection';
import PlainEnglish from '../../../components/presentation/PlainEnglish';
import {
  BAYES_POSTERIOR,
  BAYES_ARGMAX,
  BAYES_DISEASE,
} from '../../../components/presentation/equations';
import {
  bayesPosteriorExample,
  bayesArgmaxExample,
  bayesDiseaseExample,
} from '../../../components/presentation/mathExamples';

const BayesianFallbackSlide = () => (
  <SlideContainer>
    <LeadText>
      When BioBERT is uncertain or vitals are missing, Bayesian estimates the most likely colour.
      Flip each formula to see chest pain at KATH worked through the maths.
    </LeadText>

    <MathSection
      title="Bayes' rule — colour posterior"
      equations={[{
        latex: BAYES_POSTERIOR,
        explanation: (
          <p>Prior × likelihood, normalised — updates guess using hospital history + symptoms.</p>
        ),
        example: bayesPosteriorExample,
      }]}
      flipMinHeight={320}
    />

    <MathSection
      title="Decision when evidence is weak"
      equations={[{
        latex: BAYES_ARGMAX,
        explanation: <p>Pick the colour with the highest posterior probability.</p>,
        example: bayesArgmaxExample,
      }]}
      compact
      flipMinHeight={180}
    />

    <MathSection
      title="Disease-level override"
      equations={[{
        latex: BAYES_DISEASE,
        explanation: <p>Serious disease suspected → upgrade even if vitals look mild.</p>,
        example: bayesDiseaseExample,
      }]}
      compact
      flipMinHeight={200}
    />

    <PlainEnglish title="When does Bayesian run?">
      <ul>
        <li>Missing vitals — partial TEWS only</li>
        <li>BioBERT confidence &lt; τ (~0.85)</li>
        <li>Language and vitals disagree at fusion</li>
      </ul>
    </PlainEnglish>
  </SlideContainer>
);

export default BayesianFallbackSlide;
