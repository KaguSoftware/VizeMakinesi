import type { CountryWithRelations } from '@/lib/data/countries';

export interface MosaicCardProps {
  country: CountryWithRelations;
  index: number;
  span: string;
  rowIndex: number;
}
