import React from 'react';
import {
  CompactSlideContainer,
  LeadText,
  SectionTitle,
} from '../../../../components/presentation/SlideLayout';
import { OUTLINE_SECTIONS } from './nlpShared';

export const Page01 = () => (
  <CompactSlideContainer>
    <SectionTitle style={{ fontSize: '1.35rem', margin: 0 }}>NLP Patient Description to Acuity</SectionTitle>
    <LeadText style={{ fontSize: '1rem', color: '#64748b' }}>
      Deep Learning and Mathematical Triage
    </LeadText>
    <LeadText>
      <strong>Authors:</strong> Quaigraine Samuel &amp; Twum Samuel
      <br />
      <strong>Institute:</strong> Department of Mathematics, KNUST
    </LeadText>
    <LeadText style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: 'auto' }}>
      Curatio interactive deck — flip cards and formula ? tooltips on math slides.
    </LeadText>
  </CompactSlideContainer>
);

export const Page02 = () => (
  <CompactSlideContainer>
    <SectionTitle>Outline</SectionTitle>
    {OUTLINE_SECTIONS.map((sec) => (
      <div key={sec.title}>
        <LeadText style={{ fontWeight: 700, color: '#166534', marginBottom: '0.25rem' }}>
          {sec.title}
        </LeadText>
        <ul style={{ margin: '0 0 0.75rem', paddingLeft: '1.25rem', color: '#475569', fontSize: '0.88rem' }}>
          {sec.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    ))}
  </CompactSlideContainer>
);
