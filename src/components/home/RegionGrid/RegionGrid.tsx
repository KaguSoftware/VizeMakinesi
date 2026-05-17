"use client";
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import FlagBG from '@/components/shared/FlagBG/FlagBG';
import { EASE_OUT_EXPO, STAGGER_GAP, VIEWPORT } from '@/components/shared/motion/constants';

interface RegionEntry {
  name: string;
  href: string;
  presetKey: string;
  subtitle: string;
}

interface RegionGridProps {
  entries: RegionEntry[];
}

const MotionLink = motion.create(Link);

export default function RegionGrid({ entries }: RegionGridProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 border-t border-l border-border"
      initial={reduced ? undefined : 'hidden'}
      whileInView={reduced ? undefined : 'show'}
      viewport={VIEWPORT}
      variants={{ hidden: {}, show: { transition: { staggerChildren: STAGGER_GAP } } }}
    >
      {entries.map((entry) => (
        <MotionLink
          key={entry.href}
          href={entry.href}
          className="mosaic-cell relative border-b border-r border-border bg-cream overflow-hidden"
          variants={reduced ? undefined : {
            hidden: { opacity: 0, y: 16 },
            show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT_EXPO } },
          }}
          whileHover={reduced ? undefined : { y: -3 }}
          transition={{ duration: 0.18, ease: EASE_OUT_EXPO }}
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
                {entry.subtitle} →
              </div>
            </div>
          </div>
        </MotionLink>
      ))}
    </motion.div>
  );
}
