export const BLOOD_TYPES = ['O-', 'O+', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'] as const;

export const BLOOD_INFO: Record<string, { description: string; compatible: string }> = {
  'O-': { description: 'Universal donor', compatible: 'All blood types' },
  'O+': { description: 'Most common positive', compatible: 'O+, A+, B+, AB+' },
  'A-': { description: 'Common in emergencies', compatible: 'A-, A+, AB-, AB+' },
  'A+': { description: 'Second most common', compatible: 'A+, AB+' },
  'B-': { description: 'Rare blood type', compatible: 'B-, B+, AB-, AB+' },
  'B+': { description: 'Third most common', compatible: 'B+, AB+' },
  'AB+': { description: 'Universal recipient', compatible: 'AB+' },
  'AB-': { description: 'Rare plasma type', compatible: 'AB-, AB+' },
};

export const DEMO_STEPS = [
  { time: '00:00', action: 'Request raised', details: 'EMG-0041 by KIMS Hospital', status: 'success' as const },
  { time: '00:03', action: 'Ravi alerted', details: 'O-, 2.1km, Score: 91', status: 'in-progress' as const, aiReasoning: 'Highest score, nearest' },
  { time: '00:48', action: 'No response', details: 'Auto-escalating...', status: 'failed' as const },
  { time: '00:51', action: 'Priya alerted', details: 'O-, 3.4km, Score: 84', status: 'pending' as const, aiReasoning: 'Recalculating... Next best match' },
  { time: '01:10', action: 'Declined', details: 'Location too far', status: 'pending' as const },
  { time: '01:13', action: 'Arjun alerted', details: 'O-, 4.2km, Score: 79', status: 'pending' as const },
  { time: '01:45', action: 'ACCEPTED', details: 'ETA: 7 min', status: 'pending' as const },
];

export const DEMO_METRICS = {
  livesSaved: 23,
  donorsOnline: 142,
  avgTime: 8.4,
  activeEmergencies: 2,
};

export const BLOOD_INVENTORY = [
  { type: 'O-', units: 2, critical: true },
  { type: 'O+', units: 18, critical: false },
  { type: 'A+', units: 12, critical: false },
  { type: 'A-', units: 4, critical: false },
  { type: 'B+', units: 9, critical: false },
  { type: 'B-', units: 2, critical: true },
  { type: 'AB+', units: 6, critical: false },
  { type: 'AB-', units: 14, critical: false },
];

export const ACTIVE_EMERGENCIES = [
  {
    id: 'EMG-0041',
    hospital: 'KIMS Hospital',
    location: 'ICU 3B',
    bloodType: 'O-',
    survivalRate: 42,
    status: 'critical' as const,
  },
  {
    id: 'EMG-0042',
    hospital: 'Apollo Hospital',
    location: 'Emergency Ward',
    bloodType: 'A+',
    survivalRate: 67,
    status: 'warning' as const,
  },
];

export const AI_MATCHES = [
  { id: 'D1', name: 'Ravi K.', bloodType: 'O-', distance: 2.1, score: 91, status: 'alerting' as const },
  { id: 'D2', name: 'Priya S.', bloodType: 'O-', distance: 3.4, score: 84, status: 'standby' as const },
  { id: 'D3', name: 'Arjun M.', bloodType: 'O-', distance: 4.8, score: 72, status: 'standby' as const },
];

export const DONOR_PROFILE = {
  name: 'Rahul Sharma',
  bloodType: 'O-',
  livesSaved: 23,
  reliabilityScore: 91,
  isAvailable: true,
  totalDonations: 15,
  lastDonation: '2024-01-15',
};
