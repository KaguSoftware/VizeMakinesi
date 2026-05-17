import Link from 'next/link';
import FlagBG from '@/components/shared/FlagBG/FlagBG';
import { FadeIn } from '@/components/shared/motion';

interface Props {
  name: string;
  flag: string;
  presetKey: string;
  summary: string;
}

export default function SchengenStubHero({ name, flag, presetKey, summary }: Props) {
  const words = name.split(' ');
  const first = words[0];
  const rest = words.slice(1).join(' ');

  return (
    <section className="pt-16 pb-14 border-b border-border relative overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-[110%] opacity-[0.12] pointer-events-none hidden lg:block">
        <FlagBG presetKey={presetKey} className="w-full h-full" />
      </div>

      <div className="container relative z-10">
        <div className="font-mono text-[11px] tracking-[0.15em] text-muted uppercase mb-10">
          —{' '}
          <Link href="/vize/schengen" className="hover:text-coral transition-colors">
            Schengen Vizesi
          </Link>
          &nbsp;/&nbsp;{name}
        </div>

        <div className="lg:w-1/2 lg:pr-8">
          <FadeIn as="div" className="flex items-center gap-10 mb-7">
            <div className="text-[80px] leading-none">{flag}</div>
            <div className="inline-block border border-navy px-4 py-2 font-mono font-medium text-[10px] uppercase tracking-[0.15em]">
              — Schengen Vizesi
            </div>
          </FadeIn>

          <FadeIn as="div" delay={0.1} duration={0.55}>
            <h1 className="font-serif font-bold text-[clamp(48px,6.6vw,106px)] leading-[0.95] tracking-[-0.04em] mb-10 break-words hyphens-auto">
              {first}
              {rest && <em className="font-normal italic text-coral"> {rest}</em>}
            </h1>
          </FadeIn>
          <FadeIn as="div" delay={0.2}>
            <p className="font-serif italic text-[20px] leading-relaxed text-navy">
              {summary}
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
