import FlagBG from '@/components/shared/FlagBG/FlagBG';
import type { CountryHeroProps } from './types';

const DEFAULT_BULLETS = [
  'Uzman danışmanlarımız her adımda yanınızda',
  'Evraklarınızı birlikte hazırlıyoruz, eksik bırakmıyoruz',
  'Onlarca başarılı başvuruyla kazanılmış deneyim',
];

export default function CountryHero({ country, bullets }: CountryHeroProps) {
  const activeBullets = bullets ?? DEFAULT_BULLETS;
  const words = country.name.split(' ');
  const first = words[0];
  const rest  = words.slice(1).join(' ');

  return (
    <section className="pt-16 pb-14 border-b border-border relative overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-[110%] opacity-[0.12] pointer-events-none hidden lg:block">
        <FlagBG presetKey={country.flag_preset_key} imageUrl={country.flag_image_url} className="w-full h-full" />
      </div>

      <div className="container relative z-10">
<div className="lg:w-1/2 lg:pr-8">
          <div className="flex items-center gap-10 mb-7">
            <div className="text-[80px] leading-none">{country.flag_emoji}</div>
            <div className="inline-block border border-navy px-4 py-2 font-mono font-medium text-[10px] uppercase tracking-[0.15em]">
              — {country.visa_type}
            </div>
          </div>

          <h1 className="font-serif font-bold text-[clamp(28px,6.6vw,106px)] leading-[0.95] tracking-[-0.04em] mb-10 whitespace-nowrap">
            {first}
            {rest && <em className="font-normal italic text-coral"> {rest}</em>}
          </h1>
          <p className="font-serif italic text-[20px] leading-relaxed text-navy">
            {country.summary}
          </p>

          <div className="mt-10 flex flex-col gap-3 border-l-2 border-coral pl-5">
            <p className="font-sans font-medium text-[15px] text-navy">
              Vize sürecinde kendinizi yalnız hissetmenize gerek yok.
            </p>
            <ul className="flex flex-col gap-2">
              {activeBullets.map((item) => (
                <li key={item} className="font-sans text-[14px] text-muted flex items-start gap-2">
                  <span className="text-coral mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
