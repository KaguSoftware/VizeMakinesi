export interface UrgencyProps {
  eyebrow: string;
  headline: React.ReactNode;
  lede: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  stats: { n: string; label: string }[];
}

import type React from 'react';
