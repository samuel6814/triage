import React from 'react';
import { SlideContainer, LeadText } from '../../../components/presentation/SlideLayout';
import MathSection from '../../../components/presentation/MathSection';
import PlainEnglish from '../../../components/presentation/PlainEnglish';
import DataTable from '../../../components/presentation/DataTable';
import ColourBadge from '../../../components/presentation/ColourBadge';
import {
  TEWS_SUM,
  TEWS_COLOUR_MAP,
  TEWS_EXAMPLE,
} from '../../../components/presentation/equations';
import {
  tewsSumExample,
  tewsColourExample,
  tewsWorkedExample,
} from '../../../components/presentation/mathExamples';

const TewsFusionSlide = () => {
  const bandRows = [
    { id: 1, range: 'T > 7', color: <ColourBadge color="Red" /> },
    { id: 2, range: '5 ≤ T ≤ 6', color: <ColourBadge color="Orange" /> },
    { id: 3, range: '3 ≤ T ≤ 4', color: <ColourBadge color="Yellow" /> },
    { id: 4, range: 'T ≤ 2', color: <ColourBadge color="Green" /> },
  ];

  return (
    <SlideContainer>
      <LeadText>
        Vital signs feed TEWS score <strong>T</strong>, which enters fusion alongside BioBERT.
        Flip each formula to see the same patient vitals (HR=125, RR=26) calculated step by step.
      </LeadText>

      <MathSection
        title="TEWS summation"
        equations={[{
          latex: TEWS_SUM,
          explanation: <p>Add points from six vitals — deterministic, no AI.</p>,
          example: tewsSumExample,
        }]}
        flipMinHeight={300}
      />

      <MathSection
        title="Colour from vitals alone"
        equations={[{
          latex: TEWS_COLOUR_MAP,
          explanation: <p>Lookup T in the table to get C_TEWS before fusion.</p>,
          example: tewsColourExample,
        }]}
        compact
        flipMinHeight={200}
      />

      <MathSection
        title="Numeric example"
        equations={[{
          latex: TEWS_EXAMPLE,
          explanation: <p>HR 125 + RR 26 → T = 4 → Yellow band.</p>,
          example: tewsWorkedExample,
        }]}
        compact
        flipMinHeight={220}
      />

      <DataTable
        columns={[
          { key: 'range', label: 'TEWS total (T)' },
          { key: 'color', label: 'C_TEWS(T)' },
        ]}
        rows={bandRows}
      />

      <PlainEnglish>
        <p>TEWS meets BioBERT at fusion (Step 5). Fusion picks the safer colour when they disagree.</p>
      </PlainEnglish>
    </SlideContainer>
  );
};

export default TewsFusionSlide;
