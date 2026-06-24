import React from 'react';
import {
  CompactSlideContainer,
  LeadText,
  DataTable,
  TwoColumn,
} from '../../../../components/presentation/SlideLayout';
import MathSection from '../../../../components/presentation/MathSection';
import {
  TokenizationPipeline,
  ClsTokenDiagram,
} from '../../../../components/presentation/diagrams/NlpDiagrams';
import { TOKENIZATION_TAU, CLS_HEAD } from '../../../../components/presentation/equations';

const ID_TABLE_LEFT = [
  ['0', '—', '[CLS]', '101'],
  ['1', 'I', 'i', '1045'],
  ['2', 'have', 'have', '2031'],
  ['3', 'a', 'a', '1037'],
  ['4', 'headache', 'head+##ache', '7994, 8772'],
  ['5', 'and', 'and', '1998'],
];

const ID_TABLE_RIGHT = [
  ['6', 'feel', 'feel', '2514'],
  ['7', 'feverish', 'fever+##ish', '9643, 6804'],
  ['8', '.', '.', '1012'],
  ['…', '…', '…', '…'],
  ['M', '—', '[SEP]', '102'],
];

const IdTable = ({ rows }) => (
  <DataTable>
    <thead>
      <tr><th>i</th><th>Raw</th><th>Token</th><th>ID</th></tr>
    </thead>
    <tbody>
      {rows.map(([i, raw, tok, id]) => (
        <tr key={i}><td>{i}</td><td>{raw}</td><td><code>{tok}</code></td><td>{id}</td></tr>
      ))}
    </tbody>
  </DataTable>
);

export const Page06 = () => (
  <CompactSlideContainer>
    <LeadText>
      Computers cannot read English — they only understand numbers. WordPiece splits rare words;
      vocabulary 𝒱 has ~30,000 entries.
    </LeadText>
    <MathSection
      title="Tokenization"
      equations={[{
        latex: TOKENIZATION_TAU,
        label: 'X → τ → IDs',
        info: 'tokenizationTau',
      }]}
      compact
      flipMinHeight={100}
    />
    <TokenizationPipeline />
  </CompactSlideContainer>
);

export const Page07 = () => (
  <CompactSlideContainer>
    <LeadText>
      <strong>Input:</strong> &quot;I have a headache and feel feverish.&quot; — each ID maps to a row in E_word.
    </LeadText>
    <TwoColumn>
      <IdTable rows={ID_TABLE_LEFT} />
      <IdTable rows={ID_TABLE_RIGHT} />
    </TwoColumn>
    <LeadText style={{ fontSize: '0.82rem' }}>
      Reserved: [CLS]=101 (classification summary), [SEP]=102 (sentence end).
    </LeadText>
  </CompactSlideContainer>
);

export const Page08 = () => (
  <CompactSlideContainer>
    <TwoColumn>
      <div>
        <LeadText style={{ fontWeight: 700, color: '#166534' }}>[CLS] = Classification token</LeadText>
        <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#475569' }}>
          <li>Artificial token — not from the patient&apos;s words</li>
          <li>Always at position i = 0 before any real text</li>
          <li>After 12 layers, h_[CLS] becomes a 768-dim summary of the entire complaint</li>
          <li>Multiplied by classification weights to predict acuity</li>
        </ul>
        <LeadText style={{ fontSize: '0.85rem' }}>
          Think of [CLS] as an empty notebook filled as the model reads every word.
        </LeadText>
      </div>
      <ClsTokenDiagram />
    </TwoColumn>
    <MathSection
      title="[CLS] summary vector"
      equations={[{
        latex: CLS_HEAD,
        label: 'h_[CLS]',
        info: 'clsToken',
      }]}
      compact
      flipMinHeight={100}
    />
  </CompactSlideContainer>
);
