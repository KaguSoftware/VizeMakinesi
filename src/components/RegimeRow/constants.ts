import type { Regime } from './types';

export const REGIMES: Regime[] = [
  {
    n: '01', title: 'Tourist',
    desc: 'Short-stay leisure travel up to 90 days. Issued for sightseeing, family visits, and recreational stays. The most common visa class — and where most rejections happen on flimsy itineraries.',
    meta: ['Up to 90 days', 'Single or multiple entry', 'No work permitted'],
  },
  {
    n: '02', title: 'Business',
    desc: 'For meetings, conferences, contract negotiations, and trade fairs. Distinct from a work visa: you may not be remunerated by a local entity.',
    meta: ['Up to 180 days/year', 'Letter of invitation', 'Corporate sponsorship'],
  },
  {
    n: '03', title: 'Student',
    desc: 'Long-stay national visa tied to admission at a recognised institution. Requires proof of funds, accommodation, and often health insurance.',
    meta: ['Duration of programme', 'CAS / I-20 / Acceptance letter', 'Financial sponsor'],
  },
  {
    n: '04', title: 'Work',
    desc: 'Employer-sponsored route to legal employment abroad. Each jurisdiction has its own labour-market test and skill thresholds.',
    meta: ['Job offer required', 'Sponsorship licence', 'Skill / salary thresholds'],
  },
  {
    n: '05', title: 'Transit',
    desc: 'For passengers crossing through a country en route to a third destination. Some passports require an Airport Transit Visa (ATV) even when remaining airside.',
    meta: ['Airside or landside', 'Same-day passage', 'Single entry typical'],
  },
];
