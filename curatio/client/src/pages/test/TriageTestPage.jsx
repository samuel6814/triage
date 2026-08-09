import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Mic, Shield, Sparkles, Stethoscope, UserX } from 'lucide-react';
import ColourBadge from '../../components/presentation/ColourBadge';
import VoiceInput from '../../components/voice/VoiceInput';
import { ACUITY_LEVELS, getAcuityMeta } from '../../data/acuityLevels';

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
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #475569;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  line-height: 1.35;
  max-width: 100%;

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

const RejectionCard = styled(Card)`
  border-color: #fde68a;
  background: #fffbeb;
`;

const RejectionTitle = styled.h2`
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  font-weight: 800;
  color: #92400e;
`;

const RejectionMessage = styled.p`
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  color: #78350f;
  line-height: 1.55;
`;

const GuidanceMessage = styled.p`
  margin: 0;
  font-size: 0.88rem;
  color: #92400e;
  line-height: 1.55;
  padding-top: 0.75rem;
  border-top: 1px solid #fde68a;
`;

const CategoryLabel = styled.span`
  display: inline-block;
  margin-bottom: 0.75rem;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: #fef3c7;
  color: #92400e;
`;

const EntitySection = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid #f1f5f9;
`;

const EntityTitle = styled.h3`
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  font-weight: 800;
  color: #166534;
`;

const EntityList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
`;

const EntityItem = styled.li`
  padding: 10px 12px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  font-size: 0.85rem;
  color: #334155;
  line-height: 1.45;

  strong {
    color: #166534;
  }
`;

const EntityTag = styled.span`
  display: inline-block;
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  background: ${props => (props.$negated ? '#fef3c7' : '#ecfdf5')};
  color: ${props => (props.$negated ? '#92400e' : '#166534')};
`;

const GuideCard = styled(Card)`
  padding: 1.25rem 1.5rem;
`;

const GuideTitle = styled.h2`
  margin: 0 0 0.35rem;
  font-size: 1rem;
  font-weight: 800;
  color: #166534;
`;

const GuideIntro = styled.p`
  margin: 0 0 1rem;
  font-size: 0.88rem;
  color: #64748b;
  line-height: 1.5;
`;

const LevelGuideTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;

  th, td {
    padding: 10px 12px;
    text-align: left;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: top;
  }

  th {
    color: #64748b;
    font-weight: 700;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  tr:last-child td { border-bottom: none; }

  td:first-child {
    font-weight: 800;
    color: #166534;
    white-space: nowrap;
    width: 72px;
  }
`;

const ResultMeaning = styled.p`
  margin: 0.35rem 0 0;
  font-size: 1rem;
  font-weight: 600;
  color: #475569;
  line-height: 1.45;
`;

const ResultDetail = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.88rem;
  color: #64748b;
  line-height: 1.45;
`;

const StatusBar = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.82rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  background: ${(p) => (p.$ok ? '#f0fdf4' : '#fef2f2')};
  color: ${(p) => (p.$ok ? '#166534' : '#b91c1c')};
  border: 1px solid ${(p) => (p.$ok ? '#bbf7d0' : '#fecaca')};
`;

const FeatureBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 1rem;
`;

const FeatureBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid ${(p) => (p.$active ? '#22c55e' : '#e2e8f0')};
  background: ${(p) => (p.$active ? '#f0fdf4' : '#fff')};
  color: ${(p) => (p.$active ? '#166534' : '#475569')};
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: #bbf7d0;
    background: #f8fafc;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SecondaryBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #475569;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #f8fafc;
    border-color: #cbd5e1;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 0.75rem;
`;

const SideResultCard = styled(Card)`
  border-color: #e2e8f0;
`;

/** Ghanaian patient-voice narratives with embedded clinical discriminators (validated on local model). */
const EXAMPLES = [
  {
    label: 'Chest tight after Kejetia',
    text: 'Tension pneumothorax with vomiting — they rush me from Kejetia to KATH this morning. I cannot breathe properly, my chest feel tight like band, and I vomited twice in the trotro on the way.',
  },
  {
    label: 'Purple spots from Sunyani',
    text: 'Meningococcal purpura, since yesterday. Dark spots spread on my skin since I leave Sunyani. My mother bring me to KATH because the marks no dey normal and I dey weak and confused.',
  },
  {
    label: 'Worst headache at the market',
    text: 'I was selling at Kejetia when the worst headache of my life start — thunderclap headache, worsening with movement. My neck stiff, light bother me, and I vomit before my sister bring me here.',
  },
  {
    label: 'Sudden chest and back pain',
    text: 'The pain in my chest and back start sudden like knife while I dey rest at Bantama. Doctor at polyclinic write aortic dissection suspected, worsening with movement. I sweat plenty even though the room cool.',
  },
  {
    label: 'Rash and blisters on my side',
    text: 'Three days now I get painful rash and blisters on my left side with shingles with pain with associated nausea. I feel feverish small but I still walk — my wife say make we come Komfo Anokye for review.',
  },
  {
    label: 'Red ring after farm work',
    text: 'After farm work near Ejisu I see red circle on my arm like erythema migrans tick bite, intermittent. The mark dey grow, my head ache small, but I no collapse — I want nurse make check am today.',
  },
  {
    label: 'Sore throat two days',
    text: 'For two days my throat pain when I swallow and the nurse say tonsillitis, since yesterday. I can still eat light soup but fever come and go. I walk from Bantama to OPD myself — not feeling like emergency.',
  },
  {
    label: 'Red eye since yesterday',
    text: 'Conjunctivitis in known patient — my eye red and scratchy since yesterday but I see fine. I buy eye drop at Kejetia pharmacy and walk to OPD at KATH for check, not emergency.',
  },
  {
    label: 'Family planning visit',
    text: 'I am not sick for emergency. I come for contraception advice, intermittent because my period no dey regular after the injection last year. No pain, no bleeding — I just need nurse talk before I travel Accra.',
  },
  {
    label: 'Stitches removal only',
    text: 'The doctor at Manhyia District sew my small cut last week. Today I come for suture removal request only — wound clean, pain small, no fever. I want the stitches out before I go back farm at Ejisu.',
  },
];

// Empty in local dev so requests stay relative and hit the Vite proxy.
// In production set VITE_API_URL to the deployed API origin (e.g. the Render URL).
const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

const formatPct = (value) => `${(value * 100).toFixed(4)}%`;

const TriageTestPage = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [useGate, setUseGate] = useState(true);
  const [useOpenMed, setUseOpenMed] = useState(true);
  const [showVoice, setShowVoice] = useState(false);
  const [sideResult, setSideResult] = useState(null);
  const [sideLoading, setSideLoading] = useState(null);
  const [mlHealth, setMlHealth] = useState(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/triage/health`);
        const data = await res.json();
        if (res.ok) {
          setMlHealth({ ok: true, ...data });
        } else {
          setMlHealth({ ok: false, detail: data.detail ?? 'ML service error' });
        }
      } catch (err) {
        setMlHealth({ ok: false, detail: err.message });
      }
    };
    checkHealth();
  }, []);

  const buildPredictUrl = () => {
    const params = new URLSearchParams();
    params.set('gate', useGate ? 'true' : 'false');
    params.set('openmed', useOpenMed ? 'true' : 'false');
    const qs = params.toString();
    return `${API_BASE}/api/triage/predict${qs ? `?${qs}` : ''}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setSideResult(null);

    try {
      const res = await fetch(buildPredictUrl(), {
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

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setSideLoading('analyze');
    setSideResult(null);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/triage/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ?? data.message ?? 'Analyze failed');
      setSideResult({ type: 'analyze', data });
    } catch (err) {
      setError(err.message);
    } finally {
      setSideLoading(null);
    }
  };

  const handleDeidentify = async () => {
    if (!text.trim()) return;
    setSideLoading('deidentify');
    setSideResult(null);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/triage/deidentify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), method: 'mask' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ?? data.message ?? 'De-identify failed');
      setSideResult({ type: 'deidentify', data });
    } catch (err) {
      setError(err.message);
    } finally {
      setSideLoading(null);
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
          Medical gate and OpenMed enrichment are on by default.
          Use the toggles below for voice intake or to turn features off; PII tools are below.
        </Subtitle>

        {mlHealth && (
          <StatusBar $ok={mlHealth.ok}>
            {mlHealth.ok
              ? `ML ready — ${mlHealth.model_variant ?? 'baseline'} model${mlHealth.model_loaded ? ' loaded' : ''}${mlHealth.openmed_enabled ? ' · OpenMed available' : ''}`
              : `ML unavailable — ${mlHealth.detail}. Run npm run dev from curatio/server.`}
          </StatusBar>
        )}

        <GuideCard>
          <GuideTitle>What do levels 1–5 mean?</GuideTitle>
          <GuideIntro>
            Lower number = more urgent (SATS at KATH). Try the examples — natural Ghanaian descriptions
            with the kind of clinical terms nurses chart in triage.
          </GuideIntro>
          <LevelGuideTable>
            <thead>
              <tr>
                <th>Level</th>
                <th>SATS</th>
                <th>Target</th>
                <th>Clinical meaning</th>
              </tr>
            </thead>
            <tbody>
              {ACUITY_LEVELS.map((row) => (
                <tr key={row.level}>
                  <td>Level {row.level}</td>
                  <td><ColourBadge color={row.colour} /></td>
                  <td>{row.time}</td>
                  <td>{row.meaning}</td>
                </tr>
              ))}
            </tbody>
          </LevelGuideTable>
        </GuideCard>

        {error && <ErrorBox>{error}</ErrorBox>}

        <Card>
          <Label>Demo features</Label>
          <FeatureBar>
            <FeatureBtn
              type="button"
              $active={useGate}
              onClick={() => setUseGate((v) => !v)}
            >
              <Shield size={14} />
              Medical gate
            </FeatureBtn>
            <FeatureBtn
              type="button"
              $active={useOpenMed}
              onClick={() => setUseOpenMed((v) => !v)}
            >
              <Stethoscope size={14} />
              OpenMed enrichment
            </FeatureBtn>
            <FeatureBtn
              type="button"
              $active={showVoice}
              onClick={() => setShowVoice((v) => !v)}
            >
              <Mic size={14} />
              Voice input
            </FeatureBtn>
          </FeatureBar>
          <ActionRow>
            <SecondaryBtn
              type="button"
              onClick={handleAnalyze}
              disabled={!text.trim() || sideLoading === 'analyze'}
            >
              {sideLoading === 'analyze' ? <Loader2 size={14} className="spin" /> : <Stethoscope size={14} />}
              Analyze entities
            </SecondaryBtn>
            <SecondaryBtn
              type="button"
              onClick={handleDeidentify}
              disabled={!text.trim() || sideLoading === 'deidentify'}
            >
              {sideLoading === 'deidentify' ? <Loader2 size={14} className="spin" /> : <UserX size={14} />}
              De-identify
            </SecondaryBtn>
          </ActionRow>
        </Card>

        <Card>
          <form onSubmit={handleSubmit}>
            <Label htmlFor="complaint">Chief complaint</Label>
            {showVoice && (
              <VoiceInput
                onEnglishText={(transcript) => setText((prev) => (prev ? `${prev} ${transcript}` : transcript))}
              />
            )}
            <TextArea
              id="complaint"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Describe symptoms in the patient's own words — include what happened, where they came from, and key clinical terms if known"
              maxLength={2000}
            />
            <ChipRow aria-label="Example chief complaints">
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

        {sideResult?.type === 'analyze' && (
          <SideResultCard>
            <EntityTitle>OpenMed entity analysis</EntityTitle>
            {sideResult.data.diseases?.length > 0 && (
              <>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: 6 }}>
                  Diseases / conditions
                </div>
                <EntityList>
                  {sideResult.data.diseases.map((entity) => (
                    <EntityItem key={`sd-${entity.start}-${entity.text}`}>
                      <strong>{entity.text}</strong>
                      <EntityTag $negated={entity.negated}>
                        {entity.negated ? 'negated' : entity.label || 'condition'}
                      </EntityTag>
                    </EntityItem>
                  ))}
                </EntityList>
              </>
            )}
            {sideResult.data.drugs?.length > 0 && (
              <>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', margin: '12px 0 6px' }}>
                  Medications
                </div>
                <EntityList>
                  {sideResult.data.drugs.map((entity) => (
                    <EntityItem key={`sp-${entity.start}-${entity.text}`}>
                      <strong>{entity.text}</strong>
                      <EntityTag $negated={entity.negated}>
                        {entity.negated ? 'negated' : entity.label || 'drug'}
                      </EntityTag>
                    </EntityItem>
                  ))}
                </EntityList>
              </>
            )}
            {!sideResult.data.diseases?.length && !sideResult.data.drugs?.length && (
              <EntityItem>No entities detected above confidence threshold.</EntityItem>
            )}
          </SideResultCard>
        )}

        {sideResult?.type === 'deidentify' && (
          <SideResultCard>
            <EntityTitle>De-identified text</EntityTitle>
            <EntityItem style={{ whiteSpace: 'pre-wrap' }}>
              {sideResult.data.deidentified_text ?? sideResult.data.text ?? JSON.stringify(sideResult.data)}
            </EntityItem>
          </SideResultCard>
        )}

        {result && result.is_medical_complaint === false && (
          <RejectionCard>
            <RejectionTitle>Not a medical chief complaint</RejectionTitle>
            {result.rejection_category && (
              <CategoryLabel>{result.rejection_category.replace(/_/g, ' ')}</CategoryLabel>
            )}
            <RejectionMessage>{result.message}</RejectionMessage>
            {result.guidance && <GuidanceMessage>{result.guidance}</GuidanceMessage>}
          </RejectionCard>
        )}

        {result && result.is_medical_complaint !== false && (() => {
          const meta = getAcuityMeta(result.predicted_acuity_level);
          return (
          <Card>
            <ResultHeader>
              <div>
                <LevelDisplay>
                  Level {result.predicted_acuity_level}
                </LevelDisplay>
                <ResultMeaning>{meta.meaning}</ResultMeaning>
                <ResultDetail>{meta.detail} Target: {meta.time}.</ResultDetail>
              </div>
              <ColourBadge color={result.sats_colour} />
            </ResultHeader>

            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
              Confidence: <strong style={{ color: '#1e293b' }}>{formatPct(result.confidence)}</strong>
            </div>
            <ConfidenceBar>
              <div style={{ width: `${Math.min(result.confidence * 100, 100)}%` }} />
            </ConfidenceBar>

            {(result.calibration_warning || result.confidence >= 0.999) && (
              <Flag $warn>
                Model is highly confident — treat as a text-only signal and verify with TEWS/vitals before
                clinical decisions.
              </Flag>
            )}

            <Flag $warn={result.bayesian_candidate}>
              {result.bayesian_candidate
                ? 'Text-only prediction with low confidence — calculate TEWS manually from vitals (heart rate, blood pressure, respiratory rate, SpO₂, temperature) for a clearer triage picture.'
                : 'Text-only prediction. Calculate TEWS manually from the patient\'s vitals for a fuller triage assessment alongside this result.'}
            </Flag>

            <ProbTable style={{ marginTop: '1.5rem' }}>
              <thead>
                <tr>
                  <th>Level</th>
                  <th>SATS</th>
                  <th>Meaning</th>
                  <th>Probability</th>
                </tr>
              </thead>
              <tbody>
                {result.probabilities.map((p) => {
                  const row = getAcuityMeta(p.level);
                  const isPredicted = p.level === result.predicted_acuity_level;
                  return (
                  <tr key={p.level} style={isPredicted ? { background: '#f0fdf4' } : undefined}>
                    <td><strong>Level {p.level}</strong></td>
                    <td><ColourBadge color={row.colour} /></td>
                    <td>{row.meaning}</td>
                    <td>{formatPct(p.probability)}</td>
                  </tr>
                  );
                })}
              </tbody>
            </ProbTable>

            {result.entities && (
              <EntitySection>
                <EntityTitle>OpenMed entities</EntityTitle>
                {result.entities.diseases?.length > 0 && (
                  <>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: 6 }}>
                      Diseases / conditions
                    </div>
                    <EntityList>
                      {result.entities.diseases.map((entity) => (
                        <EntityItem key={`d-${entity.start}-${entity.text}`}>
                          <strong>{entity.text}</strong>
                          <EntityTag $negated={entity.negated}>
                            {entity.negated ? 'negated' : entity.label || 'condition'}
                          </EntityTag>
                          {entity.score != null && (
                            <span style={{ marginLeft: 8, color: '#94a3b8' }}>
                              {(entity.score * 100).toFixed(1)}%
                            </span>
                          )}
                        </EntityItem>
                      ))}
                    </EntityList>
                  </>
                )}
                {result.entities.drugs?.length > 0 && (
                  <>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', margin: '12px 0 6px' }}>
                      Medications
                    </div>
                    <EntityList>
                      {result.entities.drugs.map((entity) => (
                        <EntityItem key={`p-${entity.start}-${entity.text}`}>
                          <strong>{entity.text}</strong>
                          <EntityTag $negated={entity.negated}>
                            {entity.negated ? 'negated' : entity.label || 'drug'}
                          </EntityTag>
                        </EntityItem>
                      ))}
                    </EntityList>
                  </>
                )}
                {!result.entities.diseases?.length && !result.entities.drugs?.length && (
                  <EntityItem>No entities detected above confidence threshold.</EntityItem>
                )}
              </EntitySection>
            )}
          </Card>
          );
        })()}
      </Container>
    </Page>
  );
};

export default TriageTestPage;
