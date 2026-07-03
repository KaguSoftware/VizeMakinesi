'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import FlagBG from '@/components/shared/FlagBG/FlagBG';
import { SCHENGEN_MEMBERS } from '@/data/schengen';
import { EASE_OUT_EXPO, STAGGER_GAP, VIEWPORT } from '@/components/shared/motion/constants';
import { FadeIn } from '@/components/shared/motion';
import { useMosaicScrollReveal } from '@/components/shared/useMosaicScrollReveal';

const MotionLink = motion.create(Link);

export interface SchengenEntry {
  id: string;
  name: string;
  href: string;
  preset_key: string;
  pinned: boolean;
}

const EXTRA_ENTRIES_FALLBACK: { flag: string; name: string; slug: string; presetKey: string }[] = [];

const PINNED_SLUGS = ['fransa', 'ispanya', 'italya', 'almanya', 'yunanistan', 'avusturya', 'portekiz', 'hollanda', 'hirvatistan', 'macaristan', 'isvicre', 'cekya', 'danimarka', 'belcika', 'bulgaristan'];

const ALL_ORDER = [
  'avusturya','belcika','bulgaristan','hirvatistan','cekya',
  'danimarka','estonya','finlandiya','fransa','almanya',
  'yunanistan','macaristan','izlanda','italya','letonya',
  'lihtenstayn','litvanya','luksemburg','malta','hollanda',
  'norvec','polonya','portekiz','romanya','slovakya',
  'slovenya','ispanya','isvec','isvicre',
];

const HOME_VISIBLE_COUNT = 7;

// Build fallback arrays from hardcoded data (used when no entries prop is provided)
const bySlug = Object.fromEntries(SCHENGEN_MEMBERS.map((m) => [m.slug, m]));
const pinnedFallback = PINNED_SLUGS.map((s) => bySlug[s]);
const restFallback = ALL_ORDER.filter((s) => !PINNED_SLUGS.includes(s)).map((s) => bySlug[s]);

interface Props {
  entries?: SchengenEntry[];
  hideHeader?: boolean;
  limitCollapsed?: boolean;
}

export default function SchengenCountryGrid({ entries, hideHeader, limitCollapsed }: Props) {
  const [expanded, setExpanded] = useState(false);
  const reduced = useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);

  // When entries prop is provided, use DB data; otherwise fall back to hardcoded
  const usePropEntries = entries !== undefined && entries.length > 0;

  const pinnedEntries: { name: string; href: string; preset_key: string }[] = usePropEntries
    ? entries!.filter((e) => e.pinned)
    : [
        ...EXTRA_ENTRIES_FALLBACK.map((e) => ({
          name: e.name,
          href: `/vize/${e.slug}`,
          preset_key: e.presetKey,
        })),
        ...pinnedFallback.map((m) => ({
          name: m.name,
          href: `/vize/${m.slug}`,
          preset_key: m.presetKey,
        })),
      ];

  const restEntries: { name: string; href: string; preset_key: string }[] = usePropEntries
    ? entries!.filter((e) => !e.pinned)
    : restFallback.map((m) => ({
        name: m.name,
        href: `/vize/${m.slug}`,
        preset_key: m.presetKey,
      }));

  // If no entries are pinned, treat all as the default visible set (no expand needed)
  const noPinned = usePropEntries && pinnedEntries.length === 0;
  const effectivePinned = noPinned ? restEntries : pinnedEntries;
  const effectiveRest = noPinned ? [] : restEntries;

  const collapsedPinned = limitCollapsed ? effectivePinned.slice(0, HOME_VISIBLE_COUNT) : effectivePinned;
  const visibleCards = expanded ? [...effectivePinned, ...effectiveRest] : collapsedPinned;
  const hiddenCount = limitCollapsed && !expanded
    ? effectiveRest.length + Math.max(0, effectivePinned.length - HOME_VISIBLE_COUNT)
    : effectiveRest.length;

  useMosaicScrollReveal(gridRef, [expanded, visibleCards.length]);

  function renderCard(entry: { name: string; href: string; preset_key: string }, key: string, index: number) {
    // Cards revealed by expansion are already in the viewport — no stagger delay needed.
    // Initial cards use index-based delay to reproduce the scroll stagger effect.
    const isExpandedCard = expanded && index >= collapsedPinned.length;
    const delay = isExpandedCard ? 0 : index * STAGGER_GAP;

    return (
      <MotionLink
        key={key}
        href={entry.href}
        className="mosaic-cell relative border-b border-r border-border bg-cream overflow-hidden focus-visible:outline-2 focus-visible:outline-coral focus-visible:-outline-offset-2"
        initial={reduced ? undefined : { opacity: 0, y: 16 }}
        whileInView={reduced ? undefined : {
          opacity: 1, y: 0,
          transition: { duration: 0.4, ease: EASE_OUT_EXPO, delay },
        }}
        viewport={reduced ? undefined : VIEWPORT}
        transition={reduced ? undefined : { duration: 0.18, ease: EASE_OUT_EXPO }}
        whileHover={reduced ? undefined : { y: -3 }}
        whileTap={reduced ? undefined : { scale: 0.98 }}
      >
        <FlagBG presetKey={entry.preset_key} className="flag-svg" />
        <div className="flag-overlay-light" />
        <div className="flag-overlay-dark" />

        <div className="relative z-10 flex flex-col justify-between h-full p-6 min-h-44">
          <div className="font-mono text-[10px] sm:text-[9px] tracking-[0.18em] uppercase hv-white transition-colors duration-700 text-muted">
            — Vize Bilgisi
          </div>
          <div>
            <h3 className="font-serif font-semibold text-[24px] leading-[1.1] tracking-[-0.01em] hv-white transition-colors duration-700 text-navy">
              {entry.name}
            </h3>
            <div className="font-mono text-[10px] sm:text-[9px] uppercase tracking-[0.18em] text-coral hv-coral transition-colors duration-700 mt-1">
              Detay →
            </div>
          </div>
        </div>
      </MotionLink>
    );
  }

  return (
    <section className="border-t border-border">
      {!hideHeader && (
        <FadeIn as="div" className="container py-20">
          <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-coral mb-6 pb-4 border-b border-navy/20">
            — Schengen bölgesi ülkeleri
          </div>
          <h2 className="font-serif font-bold text-[clamp(32px,4vw,56px)] leading-none tracking-[-0.03em] text-navy mb-12">
            Hangi ülkeye{' '}
            <em className="font-normal italic text-coral">vize almak istiyorsunuz?</em>
          </h2>
        </FadeIn>
      )}

      <div className="container">
        <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 border-t border-l border-border">
          {visibleCards.map((entry, i) => renderCard(entry, `${entry.href}-${i}`, i))}

          {!expanded && hiddenCount > 0 && (
            <button
              onClick={() => setExpanded(true)}
              className="relative border-b border-r border-border bg-cream overflow-hidden group cursor-pointer active:bg-coral/5 transition-colors focus-visible:outline-2 focus-visible:outline-coral focus-visible:-outline-offset-2"
              aria-label={`${hiddenCount} ülke daha göster`}
            >
              <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-44 gap-3">
                <div className="w-14 h-14 rounded-full border-2 border-navy/30 group-hover:border-coral group-active:scale-95 flex items-center justify-center transition-all duration-300">
                  <span className="font-serif text-[32px] leading-none text-navy/40 group-hover:text-coral transition-colors duration-300">+</span>
                </div>
                <div className="font-mono text-[10px] sm:text-[9px] uppercase tracking-[0.18em] text-navy/40 group-hover:text-coral transition-colors duration-300 text-center px-4">
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
