import type { HeroMetaItem, HeroEyebrowItem } from './types';

export const HERO_EYEBROW: HeroEyebrowItem[] = [
  { key: 'No. 001', text: 'The practice' },
  { key: '—',       text: 'Founded MMVIII · Eighteen years on the desk' },
  { text: "Issue 47 / Spring '26" },
];

export const HERO_META: HeroMetaItem[] = [
  { num: '18',   unit: 'YRS',  label: '— In Practice' },
  { num: '42',   unit: 'K+',   label: '— Applications Filed' },
  { num: '63',   unit: '/195', label: '— Countries Served' },
  { num: '96.4', unit: '%',    label: '— Approval Rate' },
];
