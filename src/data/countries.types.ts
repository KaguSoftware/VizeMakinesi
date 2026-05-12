// Re-exported for backwards compatibility. New code should import from @/lib/data/countries.
export type { CountryWithRelations } from '@/lib/data/countries';

export type CountrySlug =
  | 'uk'
  | 'germany'
  | 'france'
  | 'italy'
  | 'netherlands'
  | 'usa'
  | 'canada'
  | 'australia'
  | 'uae'
  | 'china'
  | 'schengen';

export interface FAQItem {
  q: string;
  a: string;
}
