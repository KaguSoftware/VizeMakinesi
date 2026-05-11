import Link from 'next/link';
import FlagBG from '@/components/shared/FlagBG/FlagBG';

interface RegionEntry {
  name: string;
  href: string;
  presetKey: string;
  subtitle: string;
}

interface RegionGridProps {
  entries: RegionEntry[];
}

export default function RegionGrid({ entries }: RegionGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 border-t border-l border-border">
      {entries.map((entry) => (
        <Link
          key={entry.href}
          href={entry.href}
          className="mosaic-cell relative border-b border-r border-border bg-cream overflow-hidden"
        >
          <FlagBG presetKey={entry.presetKey} className="flag-svg" />
          <div className="flag-overlay-light" />
          <div className="flag-overlay-dark" />

          <div className="relative z-10 flex flex-col justify-between h-full p-6 min-h-44">
            <div className="font-mono text-[9px] tracking-[0.18em] uppercase hv-white transition-colors duration-700 text-muted">
              — Vize Bilgisi
            </div>
            <div>
              <h3 className="font-serif font-semibold text-[24px] leading-[1.1] tracking-[-0.01em] hv-white transition-colors duration-700 text-navy">
                {entry.name}
              </h3>
              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-coral hv-coral transition-colors duration-700 mt-1">
                {entry.subtitle} →
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
