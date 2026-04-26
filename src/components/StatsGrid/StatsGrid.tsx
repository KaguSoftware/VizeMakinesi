import type { StatsGridProps } from './types';

export default function StatsGrid({ items, onDark }: StatsGridProps) {
  return (
    <div className={`grid grid-cols-2 border-t ${onDark ? 'border-white/30 mt-16 pt-9' : 'border-border'}`}>
      {items.map((s) => (
        <div key={s.n} className="py-7 pr-4 border-t-0">
          <div className={`font-serif font-bold text-[72px] leading-[0.9] tracking-[-0.03em] text-coral`}>
            {s.n}
          </div>
          <div className={`font-mono text-[10px] uppercase tracking-[0.2em] mt-3 ${onDark ? 'text-white/75' : 'text-muted'}`}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
