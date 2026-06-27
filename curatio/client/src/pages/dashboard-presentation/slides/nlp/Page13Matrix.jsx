import React from 'react';
import {
  BeamerSlideContainer,
  LeadText,
  BodyText,
  CaptionText,
  DataTable,
  DiagramBox,
} from '../../../../components/presentation/SlideLayout';
import MathSection from '../../../../components/presentation/MathSection';
import { InputMatrixFlowDiagram } from '../../../../components/presentation/diagrams/NlpDiagrams';
import { INPUT_MATRIX, CLS_OUTPUT } from '../../../../components/presentation/equations';

const MATRIX_ROWS = [
  ['0', '[CLS]', '0.02', '0.11', '-0.05', '0.33'],
  ['1', 'i', '-0.08', '0.04', '0.19', '0.01'],
  ['2', 'have', '0.15', '-0.22', '0.07', '0.44'],
  ['4', 'head', '0.31', '-0.18', '0.52', '0.09'],
  ['7', 'fever', '0.44', '0.27', '-0.11', '0.61'],
];

export const Page13 = () => (
  <BeamerSlideContainer>
    <LeadText>
      After embedding every token, the full sentence becomes a matrix:
    </LeadText>
    <MathSection
      title="Input matrix"
      equations={[{
        latex: INPUT_MATRIX,
        label: 'H⁽⁰⁾ shape',
        info: 'inputMatrix',
      }]}
      compact
      flipMinHeight={100}
    />
    <BodyText>
      Each <strong>row</strong> = one token&apos;s 768-dimensional embedding. Each <strong>column</strong> = one feature dimension across all tokens.
    </BodyText>
    <DiagramBox $minHeight="80px">
      <InputMatrixFlowDiagram />
    </DiagramBox>
    <CaptionText>
      The matrix shape stays M × 768 through all 12 layers — only the <em>values</em> inside change.
    </CaptionText>
  </BeamerSlideContainer>
);

export const Page14 = () => (
  <BeamerSlideContainer>
    <LeadText><strong>Example submatrix</strong> (first 4 of 768 dimensions shown):</LeadText>
    <DataTable>
      <thead>
        <tr><th>i</th><th>Token</th><th>D₁</th><th>D₂</th><th>D₃</th><th>D₄</th><th>…</th></tr>
      </thead>
      <tbody>
        {MATRIX_ROWS.map(([i, tok, ...dims]) => (
          <tr key={i}>
            <td>{i}</td>
            <td><code>{tok}</code></td>
            {dims.map((d) => <td key={d}>{d}</td>)}
            <td>…</td>
          </tr>
        ))}
        <tr><td>⋮</td><td>⋮</td><td>⋮</td><td>⋮</td><td>⋮</td><td>⋮</td><td>⋮</td></tr>
      </tbody>
    </DataTable>
    <BodyText>
      After L = 12 transformer layers: h_[CLS] = H⁽¹²⁾ subscript (0,:) — the first row of the final layer output, a single 768-dim vector summarising the complaint.
    </BodyText>
  </BeamerSlideContainer>
);
