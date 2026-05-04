import type { HeroMetaItem, HeroEyebrowItem } from './types';

export const HERO_EYEBROW: HeroEyebrowItem[] = [
  { key: 'No. 001', text: 'Ofisimiz' },
  { key: '—',       text: 'Kuruluş MMVIII · On sekiz yıllık deneyim' },
  { text: "Sayı 47 / İlkbahar '26" },
];

export const HERO_META: HeroMetaItem[] = [
  { num: '18',   unit: 'YIL',  label: '— Aktif Süre' },
  { num: '42',   unit: 'B+',   label: '— Tamamlanan Başvuru' },
  { num: '63',   unit: '/195', label: '— Hizmet Verilen Ülke' },
  { num: '96.4', unit: '%',    label: '— Onaylama Oranı' },
];
