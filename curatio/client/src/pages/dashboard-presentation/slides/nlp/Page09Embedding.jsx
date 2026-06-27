import React from 'react';
import {
  BeamerSlideContainer,
  BeamerColumns,
  LeadText,
  BodyText,
  BulletList,
  CaptionText,
  DiagramBox,
  PlainEnglishBlock,
  SlideFigure,
} from '../../../../components/presentation/SlideLayout';
import MathSection from '../../../../components/presentation/MathSection';
import { EmbeddingLookupDiagram } from '../../../../components/presentation/diagrams/NlpDiagrams';
import { EMBEDDING_LOOKUP } from '../../../../components/presentation/equations';

export const Page09 = () => (
  <BeamerSlideContainer>
    <LeadText>
      A token ID alone carries no meaning. The <strong>embedding layer</strong> converts each ID to a dense vector:
    </LeadText>
    <MathSection
      title="Embedding lookup"
      equations={[{
        latex: EMBEDDING_LOOKUP,
        label: 'e_i = E_word[id(t_i)]',
        info: 'embeddingLookup',
      }]}
      compact
      flipMinHeight={140}
    />
    <BeamerColumns>
      <div>
        <BodyText style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Variables:</BodyText>
        <BulletList>
          <li><strong>V ≈ 30,000</strong> — vocabulary size (rows)</li>
          <li><strong>D = 768</strong> — embedding dimension (columns)</li>
          <li><strong>E_word ∈ ℝ^(V×768)</strong> — learned weight matrix</li>
          <li>ID 2031 → row 2031 → vector [0.04, −0.21, …, 0.17]</li>
        </BulletList>
        <PlainEnglishBlock>
          The embedding table is like a dictionary where each word ID points to a list of 768 numbers that encode its meaning.
        </PlainEnglishBlock>
      </div>
      <DiagramBox $minHeight="160px">
        <EmbeddingLookupDiagram />
      </DiagramBox>
    </BeamerColumns>
  </BeamerSlideContainer>
);

export const Page10 = () => (
  <BeamerSlideContainer>
    <BeamerColumns>
      <div>
        <LeadText>
          Each of the 768 dimensions is a <strong>learned feature</strong> — not hand-designed.
        </LeadText>
        <BulletList>
          <li>Similar words have similar vectors (close in space)</li>
          <li>&quot;headache&quot;, &quot;feverish&quot;, &quot;aches&quot; cluster near &quot;pain&quot;, &quot;fever&quot; in BioBERT&apos;s PubMed-trained space</li>
          <li><strong>Static</strong> (Word2Vec): one vector per word forever</li>
          <li><strong>Contextual</strong> (BERT): same word, different vector depending on sentence — next slide</li>
        </BulletList>
        <BodyText style={{ marginTop: '0.5rem' }}>
          Example vector for &quot;headache&quot;: e = [0.12, −0.45, 0.88, …, −0.01] (768 numbers)
        </BodyText>
      </div>
      <div>
        <SlideFigure style={{ height: '260px' }}>
          <img src="/assets/word_embedding.svg" alt="Word vectors in semantic space" />
        </SlideFigure>
        <CaptionText>
          Word vectors in semantic space. Word embedding illustration, Fschwarzentruber, Wikimedia Commons.
        </CaptionText>
      </div>
    </BeamerColumns>
  </BeamerSlideContainer>
);
