import React from 'react';
import {
  BeamerSlideContainer,
  LeadText,
  SectionTitle,
  BodyText,
} from '../../../../components/presentation/SlideLayout';
import { OUTLINE_SECTIONS } from './nlpShared';

export const Page01 = () => (
  <BeamerSlideContainer style={{ justifyContent: 'center' }}>
    <SectionTitle style={{ fontSize: '1.75rem' }}>NLP Patient Description to Acuity</SectionTitle>
    <LeadText style={{ color: '#64748b' }}>Deep Learning and Mathematical Triage</LeadText>
    <BodyText>
      <strong>Authors:</strong> Quaigraine Samuel &amp; Twum Samuel
      <br />
      <strong>Institute:</strong> Department of Mathematics, KNUST
    </BodyText>
  </BeamerSlideContainer>
);

export const Page02 = () => (
  <BeamerSlideContainer>
    <SectionTitle>Outline</SectionTitle>
    {OUTLINE_SECTIONS.map((sec) => (
      <div key={sec.title}>
        <BodyText style={{ fontWeight: 700, color: '#166534', marginBottom: '0.25rem' }}>
          {sec.title}
        </BodyText>
        <ul style={{ margin: '0 0 0.85rem', paddingLeft: '1.35rem', color: '#475569', fontSize: '1.05rem', lineHeight: 1.6 }}>
          {sec.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    ))}
  </BeamerSlideContainer>
);
