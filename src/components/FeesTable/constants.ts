import type { FeeRow } from './types';

export const FEE_ROWS: FeeRow[] = [
  { svc: 'Tourist Visa Filing',  desc: 'Schengen, UK, UAE, Asia destinations',    standard: '$185', express: '$285',   premium: '$420' },
  { svc: 'Business Visa',        desc: 'B1, business Schengen, equivalent',        standard: '$225', express: '$340',   premium: '$520' },
  { svc: 'US B1/B2 Visa',        desc: 'DS-160, MRV, mock interview',              standard: '$320', express: '$480',   premium: '$720' },
  { svc: 'Student Visa',         desc: 'F-1, Tier 4, national long-stay',          standard: '$395', express: '$590',   premium: '$890' },
  { svc: 'Work Visa',            desc: 'Sponsorship coordination',                 standard: '$650', express: '$950',   premium: '$1,450' },
  { svc: 'Passport Renewal',     desc: 'Full document handling',                   standard: '$120', express: '$185',   premium: '$280' },
  { svc: 'Document Translation', desc: 'Per page, certified',                      standard: '$25',  express: '$40',    premium: '$65' },
];

export const FEES_FOOTNOTE =
  '— Prices may vary depending on the consulate, jurisdiction, and document complexity. All fees quoted in USD; we accept bank transfer, card, and cryptocurrency.';
