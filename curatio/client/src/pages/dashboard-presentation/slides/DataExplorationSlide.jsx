import React from 'react';
import { SlideContainer, LeadText } from '../../../components/presentation/SlideLayout';
import DataTable from '../../../components/presentation/DataTable';
import PlainEnglish from '../../../components/presentation/PlainEnglish';
import InfoTooltip from '../../../components/presentation/InfoTooltip';
import {
  datasetSizes,
  acuityDistribution,
  examplePredictions,
  confidenceStats,
} from '../../../data/biobertStats';

const DataExplorationSlide = () => (
  <SlideContainer>
    <LeadText>
      Training and inference ran on ~100,000 patient records. Below are dataset sizes, acuity
      distribution, and illustrative prediction examples from our fine-tuned model.
    </LeadText>

    <DataTable
      columns={[
        { key: 'dataset', label: <>Dataset <InfoTooltip topic="datasetRoles" /></> },
        { key: 'rows', label: 'Rows' },
        { key: 'role', label: 'Role' },
      ]}
      rows={datasetSizes}
    />

    <DataTable
      columns={[
        { key: 'level', label: <>Acuity level <InfoTooltip topic="acuityDistribution" /></> },
        { key: 'count', label: 'Count (train)' },
        { key: 'pct', label: '% of train' },
      ]}
      rows={acuityDistribution}
    />

    <DataTable
      columns={[
        { key: 'patient_id', label: 'Patient' },
        { key: 'complaint', label: 'Chief complaint (truncated)' },
        { key: 'predicted', label: 'Predicted' },
        { key: 'confidence', label: 'Confidence' },
        { key: 'note', label: 'Note' },
      ]}
      rows={examplePredictions}
    />

    <PlainEnglish title="Key findings">
      <ul>
        <li>{confidenceStats.fullConfidencePct}% of predictions have confidence 1.0 <InfoTooltip topic="confidence100" /></li>
        <li>{confidenceStats.partialConfidenceCount.toLocaleString()} rows have confidence between 0.6 and 0.99 — candidates for Bayesian fallback <InfoTooltip topic="bayesianCandidates" /></li>
        <li>Fine-tuning bridges PubMed English to real hospital chief-complaint phrasing</li>
        <li>Limitation: some urgent cases can be overconfidently misclassified — fusion with TEWS/Bayesian mitigates this</li>
      </ul>
    </PlainEnglish>
  </SlideContainer>
);

export default DataExplorationSlide;
