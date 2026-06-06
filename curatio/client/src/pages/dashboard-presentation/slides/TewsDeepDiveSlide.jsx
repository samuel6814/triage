import React from 'react';
import { SlideContainer, LeadText } from '../../../components/presentation/SlideLayout';
import MathSection from '../../../components/presentation/MathSection';
import PlainEnglish from '../../../components/presentation/PlainEnglish';
import DataTable from '../../../components/presentation/DataTable';
import ColourBadge from '../../../components/presentation/ColourBadge';
import InfoTooltip from '../../../components/presentation/InfoTooltip';
import {
  TEWS_SUM,
  TEWS_HR,
  TEWS_RR,
  TEWS_COLOUR_MAP,
  TEWS_PARTIAL,
  TEWS_EXAMPLE,
} from '../../../components/presentation/equations';
import {
  tewsSumExample,
  tewsHrExample,
  tewsRrExample,
  tewsColourExample,
  tewsWorkedExample,
  tewsPartialExample,
} from '../../../components/presentation/mathExamples';

const TewsDeepDiveSlide = () => {
  const bandRows = [
    { id: 1, range: 'T > 7', color: <ColourBadge color="Red" />, ghana: 'Resuscitation Room' },
    { id: 2, range: '5 ≤ T ≤ 6', color: <ColourBadge color="Orange" />, ghana: 'Majors ED' },
    { id: 3, range: '3 ≤ T ≤ 4', color: <ColourBadge color="Yellow" />, ghana: 'Majors ED' },
    { id: 4, range: 'T ≤ 2', color: <ColourBadge color="Green" />, ghana: 'Minors / OPD' },
  ];

  return (
    <SlideContainer>
      <LeadText>
        Full TEWS mathematics — flip each formula for the same patient (HR=125, RR=26)
        calculated against SATS tables.
      </LeadText>

      <MathSection
        title="Total score"
        info="tewsSum"
        equations={[{ latex: TEWS_SUM, label: 'TEWS sum', info: 'tewsSum', example: tewsSumExample }]}
        flipMinHeight={300}
      />

      <MathSection
        title="Heart rate f₁(HR)"
        info="tewsHr"
        equations={[{ latex: TEWS_HR, label: 'Heart rate', info: 'tewsHr', example: tewsHrExample }]}
        compact
        flipMinHeight={200}
      />

      <MathSection
        title="Respiratory rate f₂(RR)"
        info="tewsRr"
        equations={[{ latex: TEWS_RR, label: 'Respiratory rate', info: 'tewsRr', example: tewsRrExample }]}
        compact
        flipMinHeight={180}
      />

      <MathSection
        title="Score → colour"
        info="tewsColourMap"
        equations={[{ latex: TEWS_COLOUR_MAP, label: 'Colour map', info: 'tewsColourMap', example: tewsColourExample }]}
        compact
        flipMinHeight={200}
      />

      <MathSection
        title="Worked example"
        info="tewsExample"
        equations={[{ latex: TEWS_EXAMPLE, label: 'Numeric example', info: 'tewsExample', example: tewsWorkedExample }]}
        compact
        flipMinHeight={220}
      />

      <MathSection
        title="Missing vitals"
        info="tewsPartial"
        equations={[{ latex: TEWS_PARTIAL, label: 'Partial TEWS', info: 'tewsPartial', example: tewsPartialExample }]}
        compact
        flipMinHeight={220}
      />

      <DataTable
        columns={[
          { key: 'range', label: 'TEWS total' },
          { key: 'color', label: 'Colour' },
          { key: 'ghana', label: 'Ghana routing' },
        ]}
        rows={bandRows}
      />

      <PlainEnglish>
        <p>Every score traceable to a SATS table row — auditable for clinical review.</p>
      </PlainEnglish>
    </SlideContainer>
  );
};

export default TewsDeepDiveSlide;
