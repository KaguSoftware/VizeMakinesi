'use client';

import { useState } from 'react';
import type { FAQProps } from './types';
import { FAQ_EYEBROW } from './constants';

export default function FAQ({ items, title }: FAQProps) {
  const [open, setOpen] = useState<number>(0);

  return (
    <section className="py-24 border-b border-border">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-[4fr_8fr] gap-20">
          {/* left */}
          <div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase mb-6">
              {FAQ_EYEBROW}
            </div>
            <h2 className="font-serif font-bold text-[clamp(40px,5vw,60px)] leading-none tracking-tight">
              {title ?? (
                <>
                  Questions,{' '}
                  <em className="font-normal italic text-coral">answered.</em>
                </>
              )}
            </h2>
          </div>

          {/* right */}
          <div>
            {items.map((it, i) => (
              <div key={i} className="border-t border-border py-7 last:border-b">
                <button
                  className="w-full grid grid-cols-[40px_1fr_30px] gap-4 items-baseline text-left font-serif font-semibold text-[22px] tracking-tight text-navy hover:text-coral transition-colors duration-200"
                  onClick={() => setOpen(open === i ? -1 : i)}
                >
                  <span className="font-mono font-medium text-[11px] tracking-[0.18em] text-coral uppercase">
                    — {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{it.q}</span>
                  <span className="font-serif text-[28px] text-coral text-right">
                    {open === i ? '−' : '+'}
                  </span>
                </button>
                {open === i && (
                  <p className="text-muted text-base leading-relaxed mt-[18px] max-w-[720px] pl-14">
                    {it.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
