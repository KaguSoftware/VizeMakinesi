import type { ReactNode } from 'react';
import type { CountrySlug } from '@/data/countries.types';

export interface PageHeadProps {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  flagSlug?: CountrySlug;
}
