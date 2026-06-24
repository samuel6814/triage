import React from 'react';
import {
  CompactSlideContainer,
  LeadText,
  DataTable,
} from '../../../../components/presentation/SlideLayout';
import MathSection from '../../../../components/presentation/MathSection';
import { INPUT_MATRIX, CLS_HEAD } from '../../../../components/presentation/equations';

const MATRIX_ROWS = [
  ['0', '[CLS]', '0.02', '0.11', '-0.05', '0.33'],
  ['1', 'i', '-0.08', '0.04', '0.19', '0.01'],
  ['2', 'have', '0.15', '-0.22', '0.07', '0.44'],
  ['4', 'head', '0.31', '-0.18', '0.52', '0.09'],
  ['7', 'fever', '0.44', '0.27', '-0.11', '0.61'],
];

export const Page13 = () => (
  <CompactSlideContainer>
    <MathSection
      title="Input matrix"
      equations={[{
        latex: INPUT_MATRIX,
        label: 'H^(0) shape',
        info: 'inputMatrix',
      }]}
      compact
      flipMinHeight={100}
    />
    <LeadText style={{ fontSize: '0.85rem' }}>
      Each <strong>row</strong> = one token&apos;s 768-d embedding. Each <strong>column</strong> = one feature
      dimension across all tokens. Row 0 = [CLS] → becomes triage summary.
    </LeadText>
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.78rem', flexWrap: 'wrap' }}>
      <span style={{ padding: '0.5rem', background: '#f8fafc', borderRadius: '6px' }}>IDs: 101, 1045, 2031…</span>
      <span>→</span>
      <span style={{ padding: '0.5rem', background: '#f0fdf4', borderRadius: '6px' }}>E_word lookup</span>
      <span>→</span>
      <span style={{ padding: '0.5rem', background: '#fef9c3', borderRadius: '6px', fontWeight: 700 }}>H^(0) M×768</span>
    </div>
    <LeadText style={{ fontSize: '0.82rem' }}>
      Matrix shape stays M×768 through all 12 layers — only the values inside change.
    </LeadText>
  </CompactSlideContainer>
);

export const Page14 = () => (
  <CompactSlideContainer>
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
    <MathSection
      title="After 12 layers"
      equations={[{
        latex: CLS_HEAD,
        label: 'h_[CLS] from row 0',
        info: 'cls768',
      }]}
      compact
      flipMinHeight={100}
    />
  </CompactSlideContainer>
);
