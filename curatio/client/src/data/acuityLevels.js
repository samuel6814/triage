/** Nurse-assigned triage acuity 1–5 (Triagegeist / KATH SATS mapping used by the BioBERT model). */
export const ACUITY_LEVELS = [
  {
    level: 1,
    colour: 'Red',
    time: 'Immediate (0 min)',
    meaning: 'Life-threatening — immediate resuscitation',
    detail: 'Red protocol: resuscitation room; bypass registration if needed.',
  },
  {
    level: 2,
    colour: 'Orange',
    time: 'Within 10 minutes',
    meaning: 'Very urgent — high dependency',
    detail: 'Orange protocol: majors/emergency area; seen within 10 minutes.',
  },
  {
    level: 3,
    colour: 'Yellow',
    time: 'Within 60 minutes',
    meaning: 'Urgent — physician review needed',
    detail: 'Yellow protocol: majors area; standing orders while waiting.',
  },
  {
    level: 4,
    colour: 'Green',
    time: 'Within 4 hours',
    meaning: 'Non-urgent — stable, can wait',
    detail: 'Green protocol: minors, OPD, or polyclinic — away from critical ER.',
  },
  {
    level: 5,
    colour: 'Green',
    time: 'Within 4 hours',
    meaning: 'Routine — lowest clinical priority',
    detail: 'Green protocol: advice, follow-up, or administrative visits.',
  },
];

export function getAcuityMeta(level) {
  return ACUITY_LEVELS.find((a) => a.level === level) ?? {
    level,
    colour: 'Green',
    time: '—',
    meaning: 'Unknown level',
    detail: '',
  };
}
