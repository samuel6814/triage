import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import ColourBadge from '../../components/presentation/ColourBadge';

const Page = styled.div`
  min-height: 100vh;
  background: #f4f7f5;
  padding: 100px 5% 60px;
  box-sizing: border-box;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const Container = styled.div`
  max-width: 720px;
  margin: 0 auto;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1.5rem;

  &:hover { color: #166534; }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: #166534;
  margin: 0 0 0.5rem;
`;

const Subtitle = styled.p`
  color: #64748b;
  margin: 0 0 2rem;
  line-height: 1.6;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 20px;
  border: 1px solid rgba(22, 101, 52, 0.08);
  box-shadow: 0 10px 40px rgba(22, 101, 52, 0.06);
  padding: 1.75rem;
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: #166534;
  margin-bottom: 0.5rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  box-sizing: border-box;
  line-height: 1.5;

  &:focus {
    outline: none;
    border-color: #22c55e;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
  }
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 0.75rem;
`;

const Chip = styled.button`
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #475569;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f0fdf4;
    border-color: #bbf7d0;
    color: #166534;
  }
`;

const SubmitBtn = styled.button`
  margin-top: 1.25rem;
  padding: 14px 28px;
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 100px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  box-shadow: 0 8px 20px rgba(34, 197, 94, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 12px 28px rgba(34, 197, 94, 0.35);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorBox = styled.div`
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  color: #b91c1c;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
`;

const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.25rem;
`;

const LevelDisplay = styled.div`
  font-size: 1.75rem;
  font-weight: 800;
  color: #1e293b;
`;

const ConfidenceBar = styled.div`
  height: 8px;
  background: #f1f5f9;
  border-radius: 999px;
  overflow: hidden;
  margin: 0.75rem 0;

  div {
    height: 100%;
    background: #22c55e;
    border-radius: 999px;
    transition: width 0.4s ease;
  }
`;

const ProbTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  th, td {
    padding: 10px 12px;
    text-align: left;
    border-bottom: 1px solid #f1f5f9;
  }

  th {
    color: #64748b;
    font-weight: 600;
    font-size: 0.75rem;
    text-transform: uppercase;
  }

  tr:last-child td { border-bottom: none; }
`;

const Flag = styled.span`
  display: inline-block;
  margin-top: 0.75rem;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => (props.$warn ? '#fef3c7' : '#f0fdf4')};
  color: ${props => (props.$warn ? '#92400e' : '#166534')};
`;

const EXAMPLES = [
  { label: 'Thunderclap headache', text: 'thunderclap headache, worsening with movement' },
  { label: 'Chest pain', text: 'central crushing chest pain, radiating to left arm' },
  { label: 'Routine', text: 'contraception advice, intermittent' },
];

const TriageTestPage = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/triage/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        const detail = data.detail ?? data.message ?? 'Prediction failed';
        throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
      }
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Container>
        <BackLink to="/">
          <ArrowLeft size={18} /> Back to home
        </BackLink>

        <Title>Test BioBERT Triage</Title>
        <Subtitle>
          Enter a chief complaint (plain text). The fine-tuned BioBERT model predicts
          acuity level 1–5 and maps it to a SATS colour.
        </Subtitle>

        {error && <ErrorBox>{error}</ErrorBox>}

        <Card>
          <form onSubmit={handleSubmit}>
            <Label htmlFor="complaint">Chief complaint</Label>
            <TextArea
              id="complaint"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. thunderclap headache, worsening with movement"
              maxLength={2000}
            />
            <ChipRow>
              {EXAMPLES.map((ex) => (
                <Chip
                  key={ex.label}
                  type="button"
                  onClick={() => setText(ex.text)}
                >
                  {ex.label}
                </Chip>
              ))}
            </ChipRow>
            <SubmitBtn type="submit" disabled={loading || !text.trim()}>
              {loading ? (
                <>
                  <Loader2 size={18} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                  Running model…
                </>
              ) : (
                <>
                  <Sparkles size={18} /> Predict acuity
                </>
              )}
            </SubmitBtn>
          </form>
        </Card>

        {result && (
          <Card>
            <ResultHeader>
              <LevelDisplay>
                Level {result.predicted_acuity_level}
              </LevelDisplay>
              <ColourBadge color={result.sats_colour} />
            </ResultHeader>

            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
              Confidence: <strong style={{ color: '#1e293b' }}>{(result.confidence * 100).toFixed(1)}%</strong>
            </div>
            <ConfidenceBar>
              <div style={{ width: `${Math.min(result.confidence * 100, 100)}%` }} />
            </ConfidenceBar>

            <Flag $warn={result.bayesian_candidate}>
              {result.bayesian_candidate
                ? 'Borderline confidence — fusion would consider Bayesian fallback (τ ≈ 0.85)'
                : 'High confidence — BioBERT signal trusted at fusion'}
            </Flag>

            <ProbTable style={{ marginTop: '1.5rem' }}>
              <thead>
                <tr>
                  <th>Acuity level</th>
                  <th>Probability</th>
                </tr>
              </thead>
              <tbody>
                {result.probabilities.map((p) => (
                  <tr key={p.level}>
                    <td>Level {p.level}</td>
                    <td>{(p.probability * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </ProbTable>
          </Card>
        )}
      </Container>
    </Page>
  );
};

export default TriageTestPage;
