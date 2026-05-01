'use client';

import { useState } from 'react';
import { TOURS, TOUR_FILTER_OPTIONS } from './constants';
import type { TourRegion } from './constants';

export default function TourFilters() {
  const [active, setActive] = useState<TourRegion>('Tümü');
  const filtered = active === 'Tümü' ? TOURS : TOURS.filter((t) => t.region === active);

  return (
    <>
      {/* Filter buttons */}
      <div className="flex gap-1 mt-10 mb-2 flex-wrap">
        {TOUR_FILTER_OPTIONS.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`font-mono font-medium text-[10px] uppercase tracking-[0.15em] px-[22px] py-3 border transition-all duration-150 ${
              active === f
                ? 'bg-navy text-white border-navy'
                : 'bg-transparent text-navy border-border hover:border-navy'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Tour rows */}
      <div className="pt-6">
        {filtered.map((t, i) => (
          <div
            key={t.id}
            className="grid grid-cols-1 md:grid-cols-[80px_3fr_2fr_1.5fr_1fr] gap-8 px-7 py-9 border-t border-border border-l-2 border-l-coral last:border-b hover:bg-cream transition-colors duration-200 items-center"
          >
            <div className="font-serif font-bold text-[36px] text-coral tracking-[-0.01em]">
              {String(i + 1).padStart(2, '0')}
            </div>
            <div>
              <h4 className="font-serif font-semibold text-[28px] mb-1.5 tracking-[-0.02em]">
                {t.name}
              </h4>
              <div className="text-[14px] text-muted">{t.sub}</div>
            </div>
            <div>
              <strong className="block font-mono font-medium text-[10px] uppercase tracking-[0.18em] text-muted mb-1">
                Süre
              </strong>
              <span className="text-[14px]">{t.days}</span>
            </div>
            <div>
              <strong className="block font-mono font-medium text-[10px] uppercase tracking-[0.18em] text-muted mb-1">
                Grup
              </strong>
              <span className="text-[14px]">{t.group}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
