import Link from 'next/link';
import FlagBG from '@/components/FlagBG/FlagBG';
import type { CountryHeroProps } from './types';
import type { CountrySlug } from '@/data/countries.types';

export default function CountryHero({ country }: CountryHeroProps) {
  const words = country.name.split(' ');
  const first = words[0];
  const rest  = words.slice(1).join(' ');

  return (
    <section className="pt-16 pb-14 border-b border-border relative overflow-hidden">
      {/* Flag BG */}
      <div className="absolute right-[-8%] top-1/2 -translate-y-1/2 w-[60%] h-[110%] opacity-[0.12] pointer-events-none">
        <FlagBG slug={country.slug as CountrySlug} className="w-full h-full" />
      </div>

      <div className="container relative z-10">
        {/* Breadcrumb */}
        <div className="font-mono text-[11px] tracking-[0.15em] text-muted uppercase mb-10">
          —{' '}
          <Link href="/" className="hover:text-coral transition-colors">
            Visas
          </Link>
          &nbsp;/&nbsp;{country.name}
        </div>

        <div className="flex items-center gap-10 mb-7">
          <div className="text-[80px] leading-none">{country.flag}</div>
          <div className="inline-block border border-navy px-4 py-2 font-mono font-medium text-[10px] uppercase tracking-[0.15em]">
            — {country.visaType}
          </div>
        </div>

        <h1 className="font-serif font-bold text-[clamp(48px,7.2vw,115px)] leading-[0.92] tracking-[-0.04em] mb-10">
          {first}
          {rest && <em className="font-normal italic text-coral"> {rest}</em>}
        </h1>
        <p className="font-serif italic text-[20px] leading-relaxed text-navy max-w-2xl">
          {country.summary}
        </p>
      </div>
    </section>
  );
}
