import Link from 'next/link';
import FlagBG from '@/components/FlagBG/FlagBG';
import type { MosaicCardProps } from './types';
import type { CountrySlug } from '@/data/countries.types';

export default function MosaicCard({ country, index, span }: MosaicCardProps) {
  return (
    <Link
      href={`/visa/${country.slug}`}
      className={`mosaic-cell ${span} border-b border-r border-border flex flex-col justify-between min-h-[360px] p-10 pb-8 cursor-pointer relative bg-white overflow-hidden`}
    >
      {/* Flag background */}
      <FlagBG slug={country.slug as CountrySlug} className="flag-svg" />
      {/* Gradient overlay */}
      <div className="flag-overlay" />

      {/* Corner number */}
      <div className="absolute top-7 right-8 font-mono text-[11px] tracking-[0.18em] text-muted uppercase z-10 hv-white transition-colors duration-[900ms]">
        — {String(index + 1).padStart(2, '0')} / 10
      </div>

      {/* Content */}
      <div className="relative z-10 pt-2">
        <h3 className="font-serif font-semibold text-[32px] leading-[1.05] mb-1.5 tracking-[-0.02em] hv-white transition-colors duration-[900ms]">
          {country.name}
        </h3>
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-coral mb-5 hv-coral transition-colors duration-[900ms]">
          — {country.visaType}
        </div>
        <p className="text-[14.5px] text-muted leading-[1.65] mb-6 max-w-[380px] hv-white transition-colors duration-[900ms]">
          {country.summary}
        </p>
      </div>

      {/* Price row */}
      <div className="cell-price-row relative z-10 flex justify-between items-baseline border-t border-border pt-5 transition-colors duration-[900ms]">
        <div>
          <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-muted mb-1 hv-white transition-colors duration-[900ms]">
            — Starting from
          </span>
          <div className="font-serif font-bold text-[28px] text-coral tracking-[-0.01em] hv-coral transition-colors duration-[900ms]">
            {country.startingPrice}
          </div>
        </div>
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-navy hv-white transition-colors duration-[900ms]">
          View →
        </div>
      </div>
    </Link>
  );
}
