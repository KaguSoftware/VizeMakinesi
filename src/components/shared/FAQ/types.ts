import type { ReactNode } from 'react';
import type { FAQItem } from '@/data/countries.types';

export interface FAQProps {
  items: FAQItem[];
  title?: ReactNode;
}
