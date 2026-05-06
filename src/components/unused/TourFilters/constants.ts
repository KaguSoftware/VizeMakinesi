import type { Tour } from './types';

export const TOURS: Tour[] = [
  { id: 1, region: 'Avrupa',  name: 'İtalya ve Adriyatik',          sub: 'Roma · Floransa · Dubrovnik · Split',           days: '11 gün', group: 'Maks. 14 kişi' },
  { id: 2, region: 'Avrupa',  name: "Norveç'in Kuzey Işıkları",     sub: 'Oslo · Tromsø · Lofoten Adaları',              days: '8 gün',  group: 'Maks. 10 kişi' },
  { id: 3, region: 'Amerika', name: 'Patagonya Geçişi',             sub: 'Buenos Aires · El Calafate · Torres del Paine', days: '12 gün', group: 'Maks. 12 kişi' },
  { id: 4, region: 'Amerika', name: 'Amerikan Güneybatı Turu',      sub: 'Las Vegas · Zion · Bryce · Grand Canyon',      days: '9 gün',  group: 'Maks. 16 kişi' },
  { id: 5, region: 'Asya',    name: 'İlkbaharda Japonya',           sub: 'Tokyo · Hakone · Kyoto · Osaka',               days: '10 gün', group: 'Maks. 12 kişi' },
  { id: 6, region: 'Asya',    name: 'Vietnam Baştan Sona',          sub: 'Hanoi · Hội An · Saigon · Mekong',            days: '13 gün', group: 'Maks. 14 kişi' },
  { id: 7, region: 'Avrupa',  name: 'İber Yarımadası Yavaş Yavaş', sub: 'Lizbon · Sevilla · Granada · Barselona',       days: '10 gün', group: 'Maks. 14 kişi' },
];

export const TOUR_FILTER_OPTIONS = ['Tümü', 'Avrupa', 'Amerika', 'Asya'] as const;
export type TourRegion = typeof TOUR_FILTER_OPTIONS[number];
