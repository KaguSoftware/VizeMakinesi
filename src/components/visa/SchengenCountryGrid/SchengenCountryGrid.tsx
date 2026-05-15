'use client';

import { useState } from 'react';
import Link from 'next/link';
import FlagBG from '@/components/shared/FlagBG/FlagBG';
import { SCHENGEN_MEMBERS } from '@/data/schengen';

const EXTRA_ENTRIES = [
  { flag: '🇬🇧', name: 'İngiltere', slug: 'ingiltere', presetKey: 'uk', subtitle: 'Vize Bilgisi' },
  { flag: '🇮🇪', name: 'İrlanda', slug: 'irlanda', presetKey: 'ireland', subtitle: 'Vize Bilgisi' },
];

const PINNED_SLUGS = ['fransa', 'ispanya', 'italya', 'almanya', 'yunanistan', 'avusturya', 'portekiz', 'hollanda', 'hirvatistan', 'macaristan', 'isvicre', 'cekya', 'danimarka', 'belcika', 'bulgaristan'];

// On home page (hideHeader), show only 2 EXTRA + 8 pinned = 10 flags, then the + button as cell 11 (3 rows of 4)
const HOME_VISIBLE_COUNT = 8;

const ALL_ORDER = [
  'avusturya','belcika','bulgaristan','hirvatistan','cekya',
  'danimarka','estonya','finlandiya','fransa','almanya',
  'yunanistan','macaristan','izlanda','italya','letonya',
  'lihtenstayn','litvanya','luksemburg','malta','hollanda',
  'norvec','polonya','portekiz','romanya','slovakya',
  'slovenya','ispanya','isvec','isvicre',
];

const bySlug = Object.fromEntries(SCHENGEN_MEMBERS.map((m) => [m.slug, m]));

const pinned = PINNED_SLUGS.map((s) => bySlug[s]);
const rest = ALL_ORDER.filter((s) => !PINNED_SLUGS.includes(s)).map((s) => bySlug[s]);

interface Props {
  hideHeader?: boolean;
  limitCollapsed?: boolean;
}

export default function SchengenCountryGrid({ hideHeader, limitCollapsed }: Props) {
  const [expanded, setExpanded] = useState(false);

  const collapsedPinned = limitCollapsed ? pinned.slice(0, HOME_VISIBLE_COUNT) : pinned;
  const visibleCards = expanded ? [...pinned, ...rest] : collapsedPinned;
  const hiddenCount = limitCollapsed && !expanded
    ? (rest.length + (pinned.length - HOME_VISIBLE_COUNT))
    : rest.length;

  return (
    <section className="border-t border-border">
      {!hideHeader && (
        <div className="container py-20">
          <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-coral mb-6 pb-4 border-b border-navy/20">
            — Schengen bölgesi ülkeleri
          </div>
          <h2 className="font-serif font-bold text-[clamp(32px,4vw,56px)] leading-none tracking-[-0.03em] text-navy mb-12">
            Hangi ülkeye{' '}
            <em className="font-normal italic text-coral">vize almak istiyorsunuz?</em>
          </h2>
        </div>
      )}

      <div className="container">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 border-t border-l border-border">
          {EXTRA_ENTRIES.map((entry) => (
            <Link
              key={entry.slug}
              href={`/vize/${entry.slug}`}
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
                    Detay →
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {visibleCards.map((member) => (
            <Link
              key={member.slug}
              href={`/vize/${member.slug}`}
              className="mosaic-cell relative border-b border-r border-border bg-cream overflow-hidden"
            >
              <FlagBG presetKey={member.presetKey} className="flag-svg" />
              <div className="flag-overlay-light" />
              <div className="flag-overlay-dark" />

              <div className="relative z-10 flex flex-col justify-between h-full p-6 min-h-44">
                <div className="font-mono text-[9px] tracking-[0.18em] uppercase hv-white transition-colors duration-700 text-muted">
                  — Vize Bilgisi
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-[24px] leading-[1.1] tracking-[-0.01em] hv-white transition-colors duration-700 text-navy">
                    {member.name}
                  </h3>
                  <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-coral hv-coral transition-colors duration-700 mt-1">
                    Detay →
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {!expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="mosaic-cell relative border-b border-r border-border bg-cream overflow-hidden group cursor-pointer"
              aria-label={`${hiddenCount} ülke daha göster`}
            >
              <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-44 gap-3">
                <div className="w-14 h-14 rounded-full border-2 border-navy/30 group-hover:border-coral flex items-center justify-center transition-colors duration-300">
                  <span className="font-serif text-[32px] leading-none text-navy/40 group-hover:text-coral transition-colors duration-300">+</span>
                </div>
                <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-navy/40 group-hover:text-coral transition-colors duration-300 text-center px-4">
                  {hiddenCount} ülke daha
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
