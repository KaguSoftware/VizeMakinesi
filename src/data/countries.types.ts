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
  | 'schengen';

export interface FAQItem {
  q: string;
  a: string;
}

export interface TourismInfo {
  intro: string[];
  highlights: string[];
  tips: string[];
  bestTime?: string;
}

export interface Country {
  slug: CountrySlug;
  name: string;
  flag: string;
  visaType: string;
  summary: string;
  requirements: string[];
  handles: string[];
  faqs: FAQItem[];
  tourism?: TourismInfo;
}
