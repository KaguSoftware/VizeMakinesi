import Link from 'next/link';
import { HERO_EYEBROW, HERO_META } from './constants';

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
        <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-[60px] items-end relative">
          {/* Left: headline */}
          <div className="relative">
            <div className="absolute -top-2 left-0 font-mono text-[11px] tracking-[0.15em] text-coral uppercase">
              — Brief #47
            </div>
            <h1 className="font-serif font-bold text-[clamp(52px,8vw,124px)] leading-[0.96] tracking-[-0.035em]">
              Your visa.<br />
              Our{' '}
              <em className="text-coral font-normal italic">mission</em>,<br />
              <span className="hero-underline">quietly</span> done.
            </h1>
          </div>

          {/* Right: editorial note */}
          <div className="border-l border-border pl-9 pb-3 relative">
            <div className="absolute -top-6 -left-px w-7 h-7 bg-coral flex items-center justify-center font-mono text-[11px] font-medium text-white">
              ¶
            </div>
            <p className="font-serif italic text-[19px] leading-[1.55] text-navy max-w-[380px] mb-8">
              <span className="not-italic font-mono text-[11px] text-muted tracking-[0.12em] uppercase block mb-4">
                — Editor&apos;s note
              </span>
              We prepare, submit and track visa applications for travellers, families and businesses across sixty-plus jurisdictions — with the rigour of a legal practice and the patience of a librarian.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 font-sans font-medium text-[12px] uppercase tracking-[0.1em] px-7 py-4 border border-navy text-navy hover:bg-navy hover:text-white transition-all duration-200"
            >
              Book a Consultation →
            </Link>
          </div>
        </div>

        {/* Meta row */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-border mt-20 pt-9 gap-6">
          {HERO_META.map((m) => (
            <div key={m.label}>
              <div className="font-serif font-bold text-navy text-[56px] leading-none mb-3 tracking-[-0.02em] flex items-baseline gap-1.5">
                {m.num}
                <span className="font-mono text-[14px] text-coral font-medium tracking-[0.05em]">
                  {m.unit}
                </span>
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
