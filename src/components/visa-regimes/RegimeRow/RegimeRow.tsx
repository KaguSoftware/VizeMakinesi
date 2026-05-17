import { FadeIn } from '@/components/shared/motion';
import type { Regime } from './types';

interface RegimeRowProps {
  regime: Regime;
}

export default function RegimeRow({ regime }: RegimeRowProps) {
  return (
    <FadeIn as="div" className="grid grid-cols-1 md:grid-cols-[140px_1.4fr_4fr] gap-10 py-16 border-t border-border last:border-b items-start">
      <div className="font-serif font-normal italic text-[96px] leading-[0.85] text-coral tracking-[-0.04em]">
        {regime.n}
      </div>
      <h3 className="font-serif font-bold text-[44px] tracking-[-0.025em] leading-none">
        {regime.title}
      </h3>
      <div>
        <p className="text-muted leading-[1.75] text-base mb-4">{regime.desc}</p>
        <div className="flex gap-8 flex-wrap font-mono text-[10px] uppercase tracking-[0.18em] text-navy border-t border-border pt-4 mt-4">
          {regime.meta.map((m) => (
            <span key={m} className="before:content-['—'] before:mr-2 before:text-coral">
              {m}
            </span>
          ))}
        </div>
      </div>
    </FadeIn>
  );
}
