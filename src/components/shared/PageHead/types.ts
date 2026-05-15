import type { ReactNode } from 'react';

export interface PageHeadProps {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  flagPresetKey?: string | null;
  flagImageUrl?: string | null;
  titleClassName?: string;
  ledeClassName?: string;
}
