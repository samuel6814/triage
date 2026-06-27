import React from 'react';
import {
  BeamerSlideContainer,
  BeamerColumns,
  LeadText,
  BodyText,
  CaptionText,
  BulletList,
  DataTable,
  DiagramBox,
  PlainEnglishBlock,
} from '../../../../components/presentation/SlideLayout';
import {
  TokenizationPipeline,
  ClsTokenDiagram,
} from '../../../../components/presentation/diagrams/NlpDiagrams';

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
  <BeamerSlideContainer>
    <LeadText>
      Computers cannot read English — they only understand numbers.
      X → τ → (t₁, …, t_M), M ≤ 128.
    </LeadText>
    <BulletList>
      <li><strong>WordPiece:</strong> common words whole; rare words split (&quot;headache&quot; → head+##ache)</li>
      <li>Vocabulary 𝒱: ~30,000 entries; each ID = row index in embedding table</li>
    </BulletList>
    <DiagramBox $minHeight="70px">
      <TokenizationPipeline />
    </DiagramBox>
  </BeamerSlideContainer>
);

export const Page07 = () => (
  <BeamerSlideContainer>
    <LeadText>
      <strong>Input:</strong> &quot;I have a headache and feel feverish.&quot; — Each ID → row in E_word.
    </LeadText>
    <BeamerColumns $ratio="1fr 1fr">
      <IdTable rows={ID_TABLE_LEFT} />
      <IdTable rows={ID_TABLE_RIGHT} />
    </BeamerColumns>
    <CaptionText>
      Reserved: [CLS]=101 (classification summary), [SEP]=102 (sentence end).
    </CaptionText>
  </BeamerSlideContainer>
);

export const Page08 = () => (
  <BeamerSlideContainer>
    <BeamerColumns>
      <div>
        <BodyText style={{ fontWeight: 700, color: '#166534', marginBottom: '0.5rem' }}>
          [CLS] = Classification token
        </BodyText>
        <BulletList>
          <li>Artificial token — <em>not</em> from the patient&apos;s words</li>
          <li>Always inserted at position i = 0 before any real text</li>
          <li><strong>Purpose:</strong> After 12 transformer layers, h_[CLS] becomes a 768-dimensional <strong>summary</strong> of the entire complaint</li>
          <li>This summary vector is multiplied by classification weights to predict acuity</li>
        </BulletList>
        <BodyText style={{ marginTop: '0.5rem' }}>
          [SEP] (ID 102) marks the end of the sentence — a boundary marker.
        </BodyText>
        <PlainEnglishBlock>
          Think of [CLS] as an empty notebook at the start. As the model reads every word, it fills that notebook with a compressed summary used for the final triage decision.
        </PlainEnglishBlock>
      </div>
      <DiagramBox $minHeight="180px">
        <ClsTokenDiagram />
      </DiagramBox>
    </BeamerColumns>
  </BeamerSlideContainer>
);
