import type { ReactNode } from 'react';

export interface PageHeadProps {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  flagPresetKey?: string | null;
  flagImageUrl?: string | null;
  titleClassName?: string;
  ledeClassName?: string;
  contentClassName?: string;
  noBorder?: boolean;
  sectionClassName?: string;
  /** Heroes paint immediately by default (LCP). Pass false to keep the
      classic fade — e.g. when the head is re-keyed and should re-animate. */
  priority?: boolean;
}
