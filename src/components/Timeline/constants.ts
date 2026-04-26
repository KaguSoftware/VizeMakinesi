import type { TimelineStep } from './types';

export const TIMELINE_STEPS: TimelineStep[] = [
  { n: '01', title: 'Application', body: 'Free 30-min consultation, eligibility memo, fixed quote.' },
  { n: '02', title: 'Documents',   body: 'We collect, translate, and notarise everything required.' },
  { n: '03', title: 'Submission',  body: 'Filing at the consulate, with biometrics and interview prep.' },
  { n: '04', title: 'Tracking',    body: 'Daily status checks; we chase the consulate so you don\'t have to.' },
  { n: '05', title: 'Result',      body: 'Passport returned to your door, with a debrief on next steps.' },
];

export const TIMELINE_ACTIVE_INDEX = 1;
