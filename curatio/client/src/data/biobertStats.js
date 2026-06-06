// Auto-generated from fine-tuned-biobert CSV files

export const datasetSizes = [
  { id: 1, dataset: 'train.csv', rows: '80,000', role: 'Labels + vitals (80k acuity labels)' },
  { id: 2, dataset: 'test.csv', rows: '20,000', role: 'Held-out evaluation (no labels)' },
  { id: 3, dataset: 'chief_complaints.csv', rows: '100,000', role: 'Raw symptom text input' },
  { id: 4, dataset: 'triage_predictions_results.csv', rows: '100,000', role: 'Model inference output' },
];

export const acuityDistribution = [
  {
    "level": "Level 1",
    "count": "3,222",
    "pct": "4.0%"
  },
  {
    "level": "Level 2",
    "count": "13,439",
    "pct": "16.8%"
  },
  {
    "level": "Level 3",
    "count": "28,921",
    "pct": "36.2%"
  },
  {
    "level": "Level 4",
    "count": "23,020",
    "pct": "28.8%"
  },
  {
    "level": "Level 5",
    "count": "11,398",
    "pct": "14.2%"
  }
];

export const examplePredictions = [
  {
    "patient_id": "TG-UXRGA9UCO",
    "complaint": "thunderclap headache, worsening with movement",
    "predicted": "Level 2",
    "confidence": "1.00",
    "note": "High-confidence urgent case"
  },
  {
    "patient_id": "TG-B19DBBS2G",
    "complaint": "contraception advice, intermittent",
    "predicted": "Level 5",
    "confidence": "1.00",
    "note": "Non-urgent correctly classified"
  },
  {
    "patient_id": "TG-7OKLDLKAQ",
    "complaint": "acute angle closure glaucoma in known patient",
    "predicted": "Level 2",
    "confidence": "0.8537",
    "note": "Low confidence \u2014 Bayesian candidate"
  },
  {
    "patient_id": "TG-2MIQ3DLS7",
    "complaint": "acute angle closure glaucoma with associated nausea",
    "predicted": "Level 2",
    "confidence": "0.8550",
    "note": "Low confidence \u2014 Bayesian candidate"
  }
];

export const confidenceStats = {
  fullConfidencePct: 99.6,
  partialConfidenceCount: 361,
  totalPredictions: 100000,
};
