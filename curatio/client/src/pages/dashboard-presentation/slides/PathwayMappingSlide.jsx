import React from 'react';
import { SlideContainer, LeadText } from '../../../components/presentation/SlideLayout';
import DataTable from '../../../components/presentation/DataTable';
import ColourBadge from '../../../components/presentation/ColourBadge';
import { PathwayDiagram } from '../../../components/presentation/FlowDiagram';

const PathwayMappingSlide = () => {
  const columns = [
    { key: 'color', label: 'Colour' },
    { key: 'pathway', label: 'Pathway' },
    { key: 'destination', label: 'Ghana destination' },
    { key: 'action', label: 'System action' },
  ];

  const rows = [
    {
      id: 1,
      color: <ColourBadge color="Red" />,
      pathway: 'RED Protocol',
      destination: 'Resuscitation Room',
      action: 'Code Red alarm; bypass registration and payment',
    },
    {
      id: 2,
      color: <ColourBadge color="Orange" />,
      pathway: 'ORANGE Protocol',
      destination: 'Majors (ED)',
      action: '10-minute countdown; cardiology dashboard alert',
    },
    {
      id: 3,
      color: <ColourBadge color="Yellow" />,
      pathway: 'YELLOW Protocol',
      destination: 'Majors (ED)',
      action: 'Standing orders (e.g. malaria test) while waiting',
    },
    {
      id: 4,
      color: <ColourBadge color="Green" />,
      pathway: 'GREEN Protocol',
      destination: 'Minors / OPD / Polyclinic',
      action: 'Divert non-urgent cases away from the ER',
    },
    {
      id: 5,
      color: <ColourBadge color="Blue" />,
      pathway: 'BLUE Protocol',
      destination: 'Mortuary',
      action: 'Silent dignity protocol; notify social workers',
    },
  ];

  return (
    <SlideContainer>
      <LeadText>
        Each SATS colour maps to a clinical pathway and a specific department within Ghanaian
        hospital workflows. Curatio routes patients automatically based on the assigned colour.
      </LeadText>

      <PathwayDiagram />

      <DataTable columns={columns} rows={rows} />
    </SlideContainer>
  );
};

export default PathwayMappingSlide;
