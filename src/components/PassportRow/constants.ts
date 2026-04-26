import type { PassportService } from './types';

export const PASSPORT_SERVICES: PassportService[] = [
  {
    title: 'New Passport',
    desc: 'First-issue applications for adults — appointment booking, document review, biometric photo studio referral.',
    time: '4–6 wks', label: 'Standard',
  },
  {
    title: 'Renewal',
    desc: 'Mail-in or in-person renewal of existing passports, including damaged or near-expiry documents.',
    time: '2–3 wks', label: 'Standard',
  },
  {
    title: 'Lost or Stolen',
    desc: 'Police report coordination, emergency travel document filing, expedited replacement.',
    time: '5–7 days', label: 'Expedited',
  },
  {
    title: 'Child Passport',
    desc: 'First-time minor passports — both-parent consent handling, court-order management for separated parents.',
    time: '3–5 wks', label: 'Standard',
  },
];
