import { FadeIn, Stagger, StaggerItem } from '@/components/shared/motion';
import type { UrgencyProps } from './types';

export default function Urgency({ eyebrow, headline, lede, ctaPrimary, ctaSecondary, stats, variant = 'navy' }: UrgencyProps) {
  const cream = variant === 'cream';
  return (
    <section className={`urgency-wrap py-[120px] relative overflow-hidden ${cream ? 'bg-cream' : 'bg-navy text-white'}`}>
      <div className="container relative z-10">
        {eyebrow && (
          <FadeIn as="div" className={`font-mono text-[10px] tracking-[0.2em] text-coral uppercase mb-8 pb-4 flex justify-between border-b ${cream ? 'border-navy/20' : 'border-white/30'}`}>
            {eyebrow}
          </FadeIn>
        )}
        <FadeIn as="div" delay={0.05} duration={0.55}>
          <h1 className={`font-serif font-bold text-[clamp(56px,9vw,144px)] leading-none tracking-[-0.02em] max-w-[1200px] ${cream ? 'text-navy' : ''}`}>
            {headline}
          </h1>
        </FadeIn>
        <FadeIn as="div" delay={0.15}>
          <p className={`font-serif text-[22px] max-w-[620px] mt-9 leading-[1.45] border-l border-coral pl-6 ${cream ? 'text-navy' : 'text-white/92'}`}>
            {lede}
          </p>
        </FadeIn>
        <FadeIn as="div" delay={0.25} className="mt-10 flex gap-3 flex-wrap">
          <a
            className="inline-flex items-center font-sans font-medium text-[13px] uppercase tracking-[0.1em] px-8 py-[22px] bg-coral border border-coral text-white hover:bg-navy hover:text-white hover:border-navy transition-all duration-200 rounded-2xl"
            href={ctaPrimary.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {ctaPrimary.label}
          </a>
          <a
            className={`inline-flex items-center font-sans font-medium text-[13px] uppercase tracking-[0.1em] px-8 py-[22px] transition-all duration-200 rounded-2xl ${cream ? 'border border-navy/40 text-navy hover:bg-navy hover:text-white hover:border-navy' : 'border border-white/50 text-white hover:bg-white hover:text-navy'}`}
            href={ctaSecondary.href}
          >
            {ctaSecondary.label}
          </a>
        </FadeIn>
        {/* Stats */}
        {stats && (
          <Stagger as="div" className={`grid grid-cols-3 mt-16 pt-9 gap-6 border-t ${cream ? 'border-navy/20' : 'border-white/30'}`} delayChildren={0.1}>
            {stats.map((s) => (
              <StaggerItem key={s.n}>
                <div className="font-serif font-bold text-[72px] text-coral leading-[0.9] tracking-[-0.03em]">
                  {s.n}
                </div>
                <div className={`font-mono text-[10px] uppercase tracking-[0.2em] mt-3 ${cream ? 'text-navy/60' : 'text-white/75'}`}>
                  {s.label}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
