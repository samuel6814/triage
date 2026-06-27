import React from 'react';
import {
  BeamerSlideContainer,
  LeadText,
  BodyText,
  CaptionText,
  DiagramBox,
  VariableTable,
} from '../../../../components/presentation/SlideLayout';
import MathSection from '../../../../components/presentation/MathSection';
import { ContextualMappingDiagram } from '../../../../components/presentation/diagrams/NlpDiagrams';
import { TOKEN_EMBED } from '../../../../components/presentation/equations';

export const Page11 = () => (
  <BeamerSlideContainer>
    <DiagramBox $minHeight="120px" $maxHeight="160px">
      <ContextualMappingDiagram />
    </DiagramBox>
    <BodyText>
      Three separate learned vectors are <strong>added element-wise</strong> for each token position i to produce the input embedding E(t_i).
    </BodyText>
  </BeamerSlideContainer>
);

export const Page12 = () => (
  <BeamerSlideContainer>
    <MathSection
      title="Contextual mapping formula"
      equations={[{
        latex: TOKEN_EMBED,
        label: 'E(t_i) sum',
        info: 'tokenEmbed',
      }]}
      compact
      flipMinHeight={100}
    />
    <VariableTable>
      <thead>
        <tr><th>Term</th><th>Meaning</th><th>Example</th></tr>
      </thead>
      <tbody>
        <tr><td>E_word</td><td>Token identity — what word is this?</td><td>&quot;headache&quot; vs &quot;feverish&quot;</td></tr>
        <tr><td>E_pos(i)</td><td>Position in sentence — order matters</td><td>&quot;head ache&quot; ≠ &quot;ache head&quot;</td></tr>
        <tr><td>E_seg</td><td>Which sentence (A or B)</td><td>0 for our single complaint</td></tr>
      </tbody>
    </VariableTable>
    <BodyText style={{ marginTop: '0.5rem' }}>
      <strong>Bidirectional reading:</strong> BERT sees all tokens left <em>and</em> right — &quot;feel feverish&quot; informs &quot;headache&quot; in both directions.
    </BodyText>
    <CaptionText>
      The word &quot;feel&quot; at position 6 gets a different E_pos than at position 12 in a longer sentence.
    </CaptionText>
  </BeamerSlideContainer>
);
