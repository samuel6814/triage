import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Mic, Shield, Sparkles, Stethoscope, UserX } from 'lucide-react';
import ColourBadge from '../../components/presentation/ColourBadge';
import VoiceInput from '../../components/voice/VoiceInput';
import { ACUITY_LEVELS, getAcuityMeta } from '../../data/acuityLevels';
import LanguageToggle from '../../components/test/LanguageToggle';
import ProbabilityChart from '../../components/test/ProbabilityChart';
import { PipelinePanel, MathPanel } from '../../components/test/PipelineExplain';
import {
  UI_COPY,
  EXAMPLES_EN,
  EXAMPLES_TW,
} from '../../components/test/uiCopy';

const Page = styled.div`
  min-height: 100vh;
  background: #f4f7f5;
  padding: 100px 5% 60px;
  box-sizing: border-box;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const Container = styled.div`
  max-width: 1040px;
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

const VitalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
  margin-top: 1rem;
`;

const VitalField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  label {
    font-size: 0.72rem;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  input, select {
    padding: 8px 10px;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    font-size: 0.9rem;
    font-family: inherit;
    background: #fff;

    &:focus {
      outline: none;
      border-color: #22c55e;
      box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
    }
  }
`;

const TraumaRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 0.75rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
`;

const AuditGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
  margin: 1rem 0;
`;

const AuditCell = styled.div`
  padding: 10px 12px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;

  small {
    display: block;
    font-size: 0.68rem;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    margin-bottom: 4px;
  }
`;

const PathwayBlock = styled.div`
  margin-top: 1.25rem;
  padding: 1rem 1.15rem;
  border-radius: 14px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;

  h3 {
    margin: 0 0 0.35rem;
    font-size: 0.95rem;
    font-weight: 800;
    color: #166534;
  }

  p {
    margin: 0 0 0.5rem;
    font-size: 0.88rem;
    color: #334155;
    line-height: 1.45;
  }

  ul {
    margin: 0.5rem 0 0;
    padding-left: 1.1rem;
    font-size: 0.85rem;
    color: #475569;
  }
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

const ResultTabBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 1.25rem;
`;

const ResultTabBtn = styled.button`
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid ${(p) => (p.$active ? '#166534' : '#e2e8f0')};
  background: ${(p) => (p.$active ? '#f0fdf4' : '#fff')};
  color: ${(p) => (p.$active ? '#166534' : '#64748b')};
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
`;

/** Examples live in components/test/uiCopy.js (EN + Twi). */

// Empty in local dev so requests stay relative and hit the Vite proxy.
// In production set VITE_API_URL to the deployed API origin (e.g. the Render URL).
const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

const formatPct = (value) => `${(value * 100).toFixed(4)}%`;

const EMPTY_VITALS = {
  heart_rate_bpm: '',
  respiratory_rate: '',
  temperature_c: '',
  mobility: '',
  avpu: '',
  trauma: false,
};

const buildVitalsPayload = (vitals) => {
  const out = {};
  if (vitals.heart_rate_bpm !== '') out.heart_rate_bpm = Number(vitals.heart_rate_bpm);
  if (vitals.respiratory_rate !== '') out.respiratory_rate = Number(vitals.respiratory_rate);
  if (vitals.temperature_c !== '') out.temperature_c = Number(vitals.temperature_c);
  if (vitals.mobility) out.mobility = vitals.mobility;
  if (vitals.avpu) out.avpu = vitals.avpu;
  if (vitals.trauma) out.trauma = true;
  return out;
};

const hasAnyVital = (vitals) => Object.keys(buildVitalsPayload(vitals)).length > 0;

const TriageTestPage = () => {
  const [lang, setLang] = useState('en');
  const copy = UI_COPY[lang] || UI_COPY.en;
  const examples = lang === 'tw' ? EXAMPLES_TW : EXAMPLES_EN;

  const [text, setText] = useState('');
  const [englishText, setEnglishText] = useState('');
  const [translationMeta, setTranslationMeta] = useState(null);
  const [translating, setTranslating] = useState(false);
  const [vitals, setVitals] = useState(EMPTY_VITALS);
  const [loading, setLoading] = useState(false);
  const [waitHint, setWaitHint] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [explain, setExplain] = useState(null);
  const [resultTab, setResultTab] = useState('result');
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

  const buildTriageUrl = (path) => {
    const params = new URLSearchParams();
    params.set('gate', useGate ? 'true' : 'false');
    params.set('openmed', useOpenMed ? 'true' : 'false');
    const qs = params.toString();
    return `${API_BASE}/api/triage/${path}${qs ? `?${qs}` : ''}`;
  };

  const resolveEnglishText = async () => {
    const raw = text.trim();
    if (!raw) return '';
    if (lang !== 'tw') {
      setEnglishText(raw);
      setTranslationMeta(null);
      return raw;
    }
    // Reuse voice/translate cache when complaint text has not changed
    if (
      englishText.trim()
      && translationMeta?.original?.trim() === raw
      && (translationMeta?.english || '').trim()
    ) {
      return (translationMeta.english || englishText).trim();
    }
    setTranslating(true);
    try {
      const res = await fetch(`${API_BASE}/api/triage/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: raw, source_lang: 'tw' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ?? data.message ?? 'Translation failed');
      const eng = (data.english || raw).trim();
      setEnglishText(eng);
      setTranslationMeta(data);
      return eng;
    } finally {
      setTranslating(false);
    }
  };

  const fetchExplain = async (eng) => {
    try {
      const res = await fetch(`${API_BASE}/api/triage/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: eng }),
      });
      const data = await res.json();
      if (res.ok) setExplain(data);
      else setExplain(null);
    } catch {
      setExplain(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setWaitHint(false);
    setError(null);
    setResult(null);
    setExplain(null);
    setSideResult(null);
    setResultTab('result');

    const vitalsPayload = buildVitalsPayload(vitals);
    const useFuse = Object.keys(vitalsPayload).length > 0;
    const waitTimer = window.setTimeout(() => setWaitHint(true), 25000);

    try {
      const eng = await resolveEnglishText();
      if (!eng) throw new Error('text is required');

      const res = await fetch(buildTriageUrl(useFuse ? 'fuse' : 'predict'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          useFuse
            ? { text: eng, vitals: vitalsPayload }
            : { text: eng },
        ),
      });

      const data = await res.json();
      if (!res.ok) {
        const detail = data.detail ?? data.message ?? (useFuse ? 'Fusion failed' : 'Prediction failed');
        throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
      }
      setResult(data);
      if (data.is_medical_complaint !== false) {
        await fetchExplain(eng);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      window.clearTimeout(waitTimer);
      setWaitHint(false);
      setLoading(false);
    }
  };

  const handleTranslateOnly = async () => {
    if (!text.trim() || lang !== 'tw') return;
    setError(null);
    try {
      await resolveEnglishText();
    } catch (err) {
      setError(err.message);
    }
  };

  const setVital = (key, value) => {
    setVitals((prev) => ({ ...prev, [key]: value }));
  };

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setSideLoading('analyze');
    setSideResult(null);
    setError(null);
    try {
      const eng = await resolveEnglishText();
      const res = await fetch(`${API_BASE}/api/triage/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: eng }),
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
      const eng = await resolveEnglishText();
      const res = await fetch(`${API_BASE}/api/triage/deidentify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: eng, method: 'mask' }),
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

        <Title>{copy.title}</Title>
        <Subtitle>{copy.subtitle}</Subtitle>

        <Card>
          <Label>{copy.language}</Label>
          <LanguageToggle value={lang} onChange={setLang} labels={copy} />
        </Card>

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
          <Label>{copy.demoFeatures}</Label>
          <FeatureBar>
            <FeatureBtn
              type="button"
              $active={useGate}
              onClick={() => setUseGate((v) => !v)}
            >
              <Shield size={14} />
              {copy.medicalGate}
            </FeatureBtn>
            <FeatureBtn
              type="button"
              $active={useOpenMed}
              onClick={() => setUseOpenMed((v) => !v)}
            >
              <Stethoscope size={14} />
              {copy.openMed}
            </FeatureBtn>
            <FeatureBtn
              type="button"
              $active={showVoice}
              onClick={() => setShowVoice((v) => !v)}
            >
              <Mic size={14} />
              {copy.voice}
            </FeatureBtn>
          </FeatureBar>
        </Card>

        <Card>
          <form onSubmit={handleSubmit}>
            <Label htmlFor="complaint">{copy.complaint}</Label>
            {showVoice && (
              <VoiceInput
                languageHint={lang}
                onEnglishText={(transcript) => {
                  setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
                  if (lang === 'en') {
                    setEnglishText(transcript);
                    setTranslationMeta(null);
                  }
                }}
                onTwiResult={(data) => {
                  setLang('tw');
                  setText(data.transcript_original || '');
                  setEnglishText(data.transcript_english || '');
                  setTranslationMeta({
                    original: data.transcript_original,
                    english: data.transcript_english,
                    translation_applied: Boolean(data.translation_applied),
                    source_lang: 'tw',
                  });
                }}
              />
            )}
            <TextArea
              id="complaint"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={copy.placeholder}
              maxLength={2000}
            />
            <ChipRow aria-label="Example chief complaints">
              {examples.map((ex) => (
                <Chip
                  key={ex.label}
                  type="button"
                  onClick={() => setText(ex.text)}
                >
                  {ex.label}
                </Chip>
              ))}
            </ChipRow>

            {(translationMeta || (lang === 'tw' && englishText)) && (
              <div style={{ marginTop: '1rem' }}>
                <Label>{copy.originalTwi}</Label>
                <EntityItem style={{ marginBottom: 8 }}>{translationMeta?.original || text}</EntityItem>
                <Label>{copy.englishUsed}</Label>
                <EntityItem>{englishText || translationMeta?.english}</EntityItem>
              </div>
            )}

            <ActionRow style={{ marginTop: '1rem' }}>
              <SecondaryBtn
                type="button"
                onClick={handleAnalyze}
                disabled={!text.trim() || sideLoading === 'analyze'}
              >
                {sideLoading === 'analyze' ? <Loader2 size={14} className="spin" /> : <Stethoscope size={14} />}
                {copy.analyze}
              </SecondaryBtn>
              <SecondaryBtn
                type="button"
                onClick={handleDeidentify}
                disabled={!text.trim() || sideLoading === 'deidentify'}
              >
                {sideLoading === 'deidentify' ? <Loader2 size={14} className="spin" /> : <UserX size={14} />}
                {copy.deidentify}
              </SecondaryBtn>
              {lang === 'tw' && (
                <SecondaryBtn
                  type="button"
                  onClick={handleTranslateOnly}
                  disabled={!text.trim() || translating}
                >
                  {translating ? <Loader2 size={14} className="spin" /> : null}
                  {translating ? copy.translating : copy.translate}
                </SecondaryBtn>
              )}
            </ActionRow>
            {!text.trim() && (
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                {copy.sideActionsHint}
              </p>
            )}

            <Label style={{ marginTop: '1.25rem' }}>{copy.vitals}</Label>
            <VitalsGrid>
              <VitalField>
                <label htmlFor="hr">Heart rate</label>
                <input
                  id="hr"
                  type="number"
                  min={0}
                  max={300}
                  placeholder="bpm"
                  value={vitals.heart_rate_bpm}
                  onChange={(e) => setVital('heart_rate_bpm', e.target.value)}
                />
              </VitalField>
              <VitalField>
                <label htmlFor="rr">Resp. rate</label>
                <input
                  id="rr"
                  type="number"
                  min={0}
                  max={100}
                  placeholder="/min"
                  value={vitals.respiratory_rate}
                  onChange={(e) => setVital('respiratory_rate', e.target.value)}
                />
              </VitalField>
              <VitalField>
                <label htmlFor="temp">Temp °C</label>
                <input
                  id="temp"
                  type="number"
                  step="0.1"
                  min={20}
                  max={45}
                  placeholder="36.8"
                  value={vitals.temperature_c}
                  onChange={(e) => setVital('temperature_c', e.target.value)}
                />
              </VitalField>
              <VitalField>
                <label htmlFor="mobility">Mobility</label>
                <select
                  id="mobility"
                  value={vitals.mobility}
                  onChange={(e) => setVital('mobility', e.target.value)}
                >
                  <option value="">—</option>
                  <option value="normal">Normal</option>
                  <option value="assisted">Assisted</option>
                  <option value="immobile">Immobile</option>
                </select>
              </VitalField>
              <VitalField>
                <label htmlFor="avpu">AVPU</label>
                <select
                  id="avpu"
                  value={vitals.avpu}
                  onChange={(e) => setVital('avpu', e.target.value)}
                >
                  <option value="">—</option>
                  <option value="alert">Alert</option>
                  <option value="verbal">Verbal</option>
                  <option value="pain">Pain</option>
                  <option value="unresponsive">Unresponsive</option>
                </select>
              </VitalField>
            </VitalsGrid>
            <TraumaRow>
              <input
                type="checkbox"
                checked={vitals.trauma}
                onChange={(e) => setVital('trauma', e.target.checked)}
              />
              Major trauma
            </TraumaRow>

            <SubmitBtn type="submit" disabled={loading || !text.trim()}>
              {loading ? (
                <>
                  <Loader2 size={18} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                  Running model…
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  {hasAnyVital(vitals) ? copy.fuse : copy.predict}
                </>
              )}
            </SubmitBtn>
            {waitHint && (
              <Flag $warn style={{ display: 'block', marginTop: '0.75rem' }}>
                Still waiting — OpenMed may be downloading NER models from Hugging Face.
                Turn off OpenMed enrichment for a fast BioBERT-only result, or wait for the timeout.
              </Flag>
            )}
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
          const fused = result.fused_colour || result.sats_colour;
          const isFused = Boolean(result.pathway || result.layers);
          return (
          <Card>
            <ResultTabBar>
              <ResultTabBtn type="button" $active={resultTab === 'result'} onClick={() => setResultTab('result')}>
                {copy.tabResult}
              </ResultTabBtn>
              <ResultTabBtn type="button" $active={resultTab === 'pipeline'} onClick={() => setResultTab('pipeline')}>
                {copy.tabPipeline}
              </ResultTabBtn>
              <ResultTabBtn type="button" $active={resultTab === 'math'} onClick={() => setResultTab('math')}>
                {copy.tabMath}
              </ResultTabBtn>
            </ResultTabBar>

            {resultTab === 'pipeline' && (
              <PipelinePanel explain={explain} vizLabel={copy.vizTour} />
            )}

            {resultTab === 'math' && <MathPanel />}

            {resultTab === 'result' && (
            <>
            <ResultHeader>
              <div>
                <LevelDisplay>
                  {isFused ? `Fused ${fused}` : `Level ${result.predicted_acuity_level}`}
                </LevelDisplay>
                <ResultMeaning>
                  {result.pathway?.meaning ?? meta.meaning}
                </ResultMeaning>
                <ResultDetail>
                  {result.pathway
                    ? `${result.pathway.detail} Target: ${result.pathway.t_max_label}.`
                    : `${meta.detail} Target: ${meta.time}.`}
                </ResultDetail>
              </div>
              <ColourBadge color={fused} />
            </ResultHeader>

            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
              NLP confidence: <strong style={{ color: '#1e293b' }}>{formatPct(result.confidence)}</strong>
              {result.predicted_acuity_level != null && (
                <> · NLP level {result.predicted_acuity_level}</>
              )}
            </div>
            <ConfidenceBar>
              <div style={{ width: `${Math.min(result.confidence * 100, 100)}%` }} />
            </ConfidenceBar>

            {result.layers && (
              <AuditGrid>
                <AuditCell>
                  <small>C_NLP</small>
                  <ColourBadge color={result.layers.c_nlp || 'Green'} />
                </AuditCell>
                <AuditCell>
                  <small>C_TEWS</small>
                  {result.layers.c_tews
                    ? <ColourBadge color={result.layers.c_tews} />
                    : <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>—</span>}
                </AuditCell>
                <AuditCell>
                  <small>C_disc</small>
                  {result.layers.c_disc
                    ? <ColourBadge color={result.layers.c_disc} />
                    : <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>—</span>}
                </AuditCell>
                <AuditCell>
                  <small>C_Bayes</small>
                  {result.layers.c_bayes
                    ? <ColourBadge color={result.layers.c_bayes} />
                    : <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>—</span>}
                </AuditCell>
                {result.tews?.tews_total != null && (
                  <AuditCell>
                    <small>TEWS total</small>
                    <strong>{result.tews.tews_total}</strong>
                    {result.tews.tews_incomplete && (
                      <span style={{ display: 'block', fontSize: '0.72rem', color: '#92400e' }}>
                        incomplete
                      </span>
                    )}
                  </AuditCell>
                )}
              </AuditGrid>
            )}

            {result.discriminators?.active?.length > 0 && (
              <EntitySection>
                <EntityTitle>Active discriminators</EntityTitle>
                <EntityList>
                  {result.discriminators.active.map((d) => (
                    <EntityItem key={d.id}>
                      <strong>{d.label || d.id}</strong>
                      <EntityTag>{d.colour_floor}</EntityTag>
                      {d.confidence != null && (
                        <span style={{ marginLeft: 8, color: '#94a3b8' }}>
                          {(d.confidence * 100).toFixed(0)}%
                        </span>
                      )}
                    </EntityItem>
                  ))}
                </EntityList>
              </EntitySection>
            )}

            {result.bayes?.bayes_invoked && (
              <Flag>
                Bayes ({result.bayes.scenario_key}): {result.bayes.c_bayes}
                {result.bayes.posteriors?.Orange != null && (
                  <> · P(Orange)={result.bayes.posteriors.Orange}</>
                )}
              </Flag>
            )}

            {result.pathway && (
              <PathwayBlock>
                <h3>Pathway — {result.pathway.colour}</h3>
                <p>
                  <strong>{result.pathway.destination}</strong>
                  {' · '}
                  {result.pathway.t_max_label}
                </p>
                <p>{result.pathway.escalation}</p>
                {result.pathway.actions?.length > 0 && (
                  <ul>
                    {result.pathway.actions.map((action) => (
                      <li key={action}>{action}</li>
                    ))}
                  </ul>
                )}
              </PathwayBlock>
            )}

            {(result.calibration_warning || result.confidence >= 0.999) && (
              <Flag $warn>
                Model is highly confident — treat as a text-only signal and verify with TEWS/vitals before
                clinical decisions.
              </Flag>
            )}

            {!isFused && (
              <Flag $warn={result.bayesian_candidate}>
                {result.bayesian_candidate
                  ? 'Text-only prediction with low confidence — enter vitals above to run TEWS fusion.'
                  : 'Text-only prediction. Enter optional vitals above to fuse with TEWS.'}
              </Flag>
            )}

            {result.flags?.tews_green_suppressed && (
              <Flag $warn>
                Incomplete TEWS Green suppressed — fused colour uses NLP (and higher layers) only.
              </Flag>
            )}

            {(result.entities_status === 'error' || result.entities?.entities_status === 'error') && (
              <Flag $warn>
                OpenMed NER error: {result.entities_error || result.entities?.entities_error || 'unknown'}
              </Flag>
            )}
            {(result.entities_status === 'disabled' || result.entities?.entities_status === 'disabled') && (
              <Flag>
                OpenMed NER disabled for this request.
              </Flag>
            )}

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

            <EntitySection>
              <EntityTitle>{copy.charts}</EntityTitle>
              <ProbabilityChart
                probabilities={result.probabilities}
                layers={result.layers}
                fusedColour={fused}
              />
            </EntitySection>
            </>
            )}
          </Card>
          );
        })()}
      </Container>
    </Page>
  );
};

export default TriageTestPage;
