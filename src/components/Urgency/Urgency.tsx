import type { UrgencyProps } from './types';

export default function Urgency({ eyebrow, headline, lede, ctaPrimary, ctaSecondary, stats }: UrgencyProps) {
  return (
    <section className="urgency-wrap bg-navy text-white py-[120px] relative overflow-hidden">
      <div className="container relative z-10">
        <div className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase mb-8 pb-4 border-b border-white/30 flex justify-between">
          {eyebrow}
        </div>
        <h1 className="font-serif font-bold text-[clamp(56px,9vw,144px)] leading-[0.92] tracking-[-0.04em] max-w-[1200px]">
          {headline}
        </h1>
        <p className="font-serif italic text-[22px] text-white/92 max-w-[620px] mt-9 leading-[1.45] border-l border-coral pl-6">
          {lede}
        </p>
        <div className="mt-10 flex gap-3 flex-wrap">
          <a
            className="inline-flex items-center font-sans font-medium text-[13px] uppercase tracking-[0.1em] px-8 py-[22px] bg-coral border border-coral text-white hover:bg-white hover:text-navy hover:border-white transition-all duration-200"
            href={ctaPrimary.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {ctaPrimary.label}
          </a>
          <a
            className="inline-flex items-center font-sans font-medium text-[13px] uppercase tracking-[0.1em] px-8 py-[22px] border border-white/50 text-white hover:bg-white hover:text-navy transition-all duration-200"
            href={ctaSecondary.href}
          >
            {ctaSecondary.label}
          </a>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-3 border-t border-white/30 mt-16 pt-9 gap-6">
          {stats.map((s) => (
            <div key={s.n}>
              <div className="font-serif font-bold text-[72px] text-coral leading-[0.9] tracking-[-0.03em]">
                {s.n}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/75 mt-3">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
