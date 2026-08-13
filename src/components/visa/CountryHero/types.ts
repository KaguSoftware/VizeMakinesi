import type { CountryWithRelations } from '@/lib/data/countries';

export interface CountryHeroProps {
  country: CountryWithRelations;
  bullets?: string[];
  /** Bullet listesinin üstündeki vurgu cümlesi. */
  lead?: string;
  /** Vurgu cümlesinin altındaki küçük satır. */
  note?: string;
}
