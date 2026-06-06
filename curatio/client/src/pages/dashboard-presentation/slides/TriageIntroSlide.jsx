import React from 'react';
import { SlideContainer, LeadText } from '../../../components/presentation/SlideLayout';
import DataTable from '../../../components/presentation/DataTable';
import PlainEnglish from '../../../components/presentation/PlainEnglish';
import ColourBadge from '../../../components/presentation/ColourBadge';
import { UrgencyBar } from '../../../components/presentation/FlowDiagram';

const TriageIntroSlide = () => {
  const columns = [
    { key: 'color', label: 'Colour' },
    { key: 'time', label: 'Target time' },
    { key: 'meaning', label: 'Clinical meaning' },
  ];

  const rows = [
    { id: 1, color: <ColourBadge color="Red" />, time: '0 min', meaning: 'Immediate resuscitation — life-threatening' },
    { id: 2, color: <ColourBadge color="Orange" />, time: '< 10 min', meaning: 'Very urgent — high dependency' },
    { id: 3, color: <ColourBadge color="Yellow" />, time: '< 60 min', meaning: 'Urgent — needs physician review' },
    { id: 4, color: <ColourBadge color="Green" />, time: '< 4 hours', meaning: 'Non-urgent — routine care' },
    { id: 5, color: <ColourBadge color="Blue" />, time: '< 2 hours', meaning: 'Deceased on arrival — dignity protocol' },
  ];

  return (
    <SlideContainer>
      <LeadText>
        <strong>Triage</strong> is the process of sorting patients by clinical urgency so the sickest
        are seen first. Curatio uses the <strong>South African Triage Scale (SATS)</strong>, validated
        at Komfo Anokye Teaching Hospital (KATH), Kumasi, Ghana.
      </LeadText>

      <UrgencyBar />

      <DataTable columns={columns} rows={rows} />

      <PlainEnglish>
        <p>
          Think of triage as a traffic light for the emergency department: each colour tells staff
          how quickly a patient must be seen and which hospital area they should go to. The system
          supports clinical staff — it does not replace their judgment.
        </p>
      </PlainEnglish>
    </SlideContainer>
  );
};

export default TriageIntroSlide;
