"use client";
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { HERO_EYEBROW, HERO_META } from './constants';

function useCountUp(target: number, decimals: number, duration = 1400) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setValue(parseFloat((eased * target).toFixed(decimals)));
          if (t < 1) requestAnimationFrame(tick);
          else setValue(target);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, decimals, duration]);

  return { ref, value };
}

function AnimatedStat({ num, unit, label }: { num: string; unit: string; label: string }) {
  const parsed = parseFloat(num.replace(/[^0-9.]/g, ''));
  const decimals = num.includes('.') ? num.split('.')[1].length : 0;
  const { ref, value } = useCountUp(isNaN(parsed) ? 0 : parsed, decimals);

  const display = isNaN(parsed) ? num : value.toFixed(decimals);

  return (
    <div ref={ref}>
      <div className="font-serif font-bold text-navy text-[56px] leading-none mb-3 tracking-[-0.02em] flex items-baseline gap-1.5">
        {display}
        <span className="font-mono text-[14px] text-coral font-medium tracking-wider">
          {unit}
        </span>
      </div>
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
        {label}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="pt-24 pb-8 relative border-b border-border">
      <div className="container">
        {/* Eyebrow */}
        <div className="flex justify-between items-baseline flex-wrap gap-4 font-mono text-[10px] tracking-[0.2em] uppercase text-muted mb-14 pb-4 border-b border-border">
          {HERO_EYEBROW.map((item, i) => (
            <div key={i} className="flex gap-2 items-baseline">
              {item.key && <span className="text-coral">{item.key}</span>}
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-15 items-end relative">
          {/* Left: headline */}
          <div className="relative">
            <div className="absolute -top-2 left-0 font-mono text-[11px] tracking-[0.15em] text-coral uppercase">
              — Bülten #47
            </div>
            <h1 className="font-serif font-bold text-[clamp(52px,8vw,124px)] leading-[0.96] tracking-[-0.035em]">
              Vizeniz.<br />
              Bizim{' '}
              <em className="text-coral font-normal italic">misyonumuz</em>,<br />
              <span className="hero-underline">sessizce</span> tamamlandı.
            </h1>
          </div>

          {/* Right: editorial note */}
          <div className="border-l border-border pl-9 pb-3 relative">
            <div className="absolute -top-6 -left-px w-7 h-7 bg-coral flex items-center justify-center font-mono text-[11px] font-medium text-white">
              ¶
            </div>
            <p className="font-serif italic text-[19px] leading-[1.55] text-navy max-w-95 mb-8">
              <span className="not-italic font-mono text-[11px] text-muted tracking-[0.12em] uppercase block mb-4">
                — Editör notu
              </span>
              Altmıştan fazla ülkede gezginler, aileler ve işletmeler için vize başvurularını hazırlar, sunar ve takip ederiz — bir hukuk bürosunun titizliği ve bir kütüphanecinin sabrıyla.
            </p>
            <Link
              href="/danisma-al"
              className="inline-flex items-center gap-2 font-sans font-medium text-[12px] uppercase tracking-widest px-7 py-4 border border-navy text-navy hover:bg-navy hover:text-white transition-all duration-200"
            >
              Danışma Al →
            </Link>
          </div>
        </div>

        {/* Meta row */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-border mt-20 pt-9 gap-6">
          {HERO_META.map((m) => (
            <AnimatedStat key={m.label} {...m} />
          ))}
        </div>
      </div>
    </section>
  );
}
