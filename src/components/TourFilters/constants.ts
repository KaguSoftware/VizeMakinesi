import type { Tour } from './types';

export const TOURS: Tour[] = [
  { id: 1, region: 'Europe',   name: 'Italy & the Adriatic',       sub: 'Rome · Florence · Dubrovnik · Split',         days: '11 days', group: 'Max 14 guests', price: '$3,890' },
  { id: 2, region: 'Europe',   name: 'Northern Lights of Norway',  sub: 'Oslo · Tromsø · Lofoten Islands',             days: '8 days',  group: 'Max 10 guests', price: '$4,250' },
  { id: 3, region: 'Americas', name: 'Patagonia Crossing',         sub: 'Buenos Aires · El Calafate · Torres del Paine', days: '12 days', group: 'Max 12 guests', price: '$5,180' },
  { id: 4, region: 'Americas', name: 'American Southwest Loop',    sub: 'Las Vegas · Zion · Bryce · Grand Canyon',     days: '9 days',  group: 'Max 16 guests', price: '$3,420' },
  { id: 5, region: 'Asia',     name: 'Japan in Late Spring',       sub: 'Tokyo · Hakone · Kyoto · Osaka',              days: '10 days', group: 'Max 12 guests', price: '$4,780' },
  { id: 6, region: 'Asia',     name: 'Vietnam End to End',         sub: 'Hanoi · Hội An · Saigon · Mekong',           days: '13 days', group: 'Max 14 guests', price: '$3,150' },
  { id: 7, region: 'Europe',   name: 'Iberia Slowly',              sub: 'Lisbon · Sevilla · Granada · Barcelona',      days: '10 days', group: 'Max 14 guests', price: '$3,640' },
];

export const TOUR_FILTER_OPTIONS = ['All', 'Europe', 'Americas', 'Asia'] as const;
export type TourRegion = typeof TOUR_FILTER_OPTIONS[number];
