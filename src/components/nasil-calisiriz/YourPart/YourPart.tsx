import { FadeIn } from '@/components/shared/motion';
import { YOUR_PART } from '../constants';

export default function YourPart() {
  return (
    <section className="container">
      <div className="pt-16 pb-20 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-10 lg:gap-16 items-start">
        <FadeIn as="div">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral mb-4">
            — Sizin payınız
          </div>
          <h2 className="font-serif font-bold text-[clamp(28px,3.5vw,48px)] leading-[1.05] tracking-tight text-navy">
            Sizin yapacaklarınız{' '}
            <em className="font-normal italic text-coral">oldukça sınırlı.</em>
          </h2>
        </FadeIn>

        <ul className="list-none">
          {YOUR_PART.map((item, i) => (
            <FadeIn key={item} delay={i * 0.1} as="li">
              <p className="border-t border-border pt-6 pb-8 font-serif text-[20px] md:text-[26px] leading-[1.45] tracking-[-0.015em] text-navy">
                {item}
              </p>
            </FadeIn>
          ))}
        </ul>
      </div>
    </section>
  );
}
