export const SATS_COLORS = {
  red: '#DC143C',
  orange: '#FF8C00',
  yellow: '#FFC800',
  green: '#228B22',
  blue: '#1E40AF',
};

export const SATS_LEVELS = [
  { key: 'red', label: 'Red', time: '0 min', urgency: 'Immediate / life-threatening' },
  { key: 'orange', label: 'Orange', time: '< 10 min', urgency: 'Very urgent' },
  { key: 'yellow', label: 'Yellow', time: '< 60 min', urgency: 'Urgent' },
  { key: 'green', label: 'Green', time: '< 4 hr', urgency: 'Non-urgent / routine' },
  { key: 'blue', label: 'Blue', time: '< 2 hr', urgency: 'Deceased on arrival' },
];
