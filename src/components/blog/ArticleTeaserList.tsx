'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

export interface ArticleTeaser {
  slug: string;
  title: string;
  kicker: string;
  minutes: number;
}

interface Props {
  /** Makalelerin yayınlandığı kök yol, örn. /blog/almanya */
  basePath: string;
  teasers: ArticleTeaser[];
  /** Akışta ters çevrilen satırlarda panel sağa yaslanır. */
  align?: 'left' | 'right';
}

/** Bir sayfada gösterilen makale satırı sayısı. */
const PAGE_SIZE = 3;

// Yön duyarlı sayfa geçişi — FAQ bileşenindeki hareketle aynı dil.
const pageVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 24 : -24 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.22, ease: 'easeOut' as const } },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -24 : 24,
    transition: { duration: 0.16, ease: 'easeIn' as const },
  }),
};

/**
 * Blog akışındaki kartın görsel sütununda duran makale listesi.
 *
 * Her sayfada üç makale görünür; daha fazlası varsa altındaki oklarla
 * sayfalar arasında gezilir (örn. dört makalede ikinci sayfada tek satır).
 */
export default function ArticleTeaserList({ basePath, teasers, align = 'left' }: Props) {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const pageCount = Math.ceil(teasers.length / PAGE_SIZE);
  const paginated = pageCount > 1;
  const start = page * PAGE_SIZE;
  const visible = teasers.slice(start, start + PAGE_SIZE);

  function goTo(next: number) {
    setDirection(next > page ? 1 : -1);
    setPage(next);
  }

  return (
    <div
      // Panel genişliği sınırlanır: 7 sütunluk alana yayılan satırlar başlık ile
      // okun arasında kocaman boşluk bırakıyordu. Alt sınır üç satırlık yüksekliğe
      // eşittir: hem tek makalesi olan bloglar ince bir şeride düşmez, hem de
      // sayfalar arasında geçerken kart yüksekliği zıplamaz.
      className={[
        'border border-border rounded-xl px-6 py-6 md:px-8 md:py-7 flex flex-col',
        'w-full max-w-[560px] min-h-[386px]',
        align === 'right' ? 'lg:ml-auto' : '',
      ].join(' ')}
    >
      <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted mb-1">
        — Makaleler ({teasers.length})
      </p>

      <div className="flex-1">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {visible.map((teaser, i) => (
              <Link
                key={teaser.slug}
                href={`${basePath}/${teaser.slug}`}
                className="group/row flex items-baseline gap-4 border-b border-border py-4 last:border-b-0"
              >
                <span className="font-mono text-[11px] tracking-[0.18em] text-coral shrink-0">
                  {String(start + i + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0">
                  <span className="font-serif font-semibold text-[17px] md:text-[19px] leading-snug tracking-[-0.01em] text-navy group-hover/row:text-coral transition-colors duration-200">
                    {teaser.title}
                    <span
                      aria-hidden
                      className="ml-2 font-mono text-[13px] text-coral opacity-0 group-hover/row:opacity-100 transition-opacity duration-200"
                    >
                      →
                    </span>
                  </span>
                  <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] tracking-[0.18em] uppercase text-muted">
                    {teaser.kicker && (
                      <>
                        <span>{teaser.kicker}</span>
                        <span aria-hidden className="text-border">
                          /
                        </span>
                      </>
                    )}
                    <span>{teaser.minutes} dk okuma</span>
                  </span>
                </span>
              </Link>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {paginated && (
        <div className="flex items-center gap-3 pt-5 mt-1 border-t border-border">
          <button
            type="button"
            onClick={() => goTo(page - 1)}
            disabled={page === 0}
            aria-label="Önceki makaleler"
            className="grid place-items-center w-9 h-9 rounded-full border border-border text-coral text-[16px] leading-none transition-colors duration-200 hover:border-coral hover:bg-coral/5 disabled:opacity-30 disabled:pointer-events-none cursor-pointer focus-visible:outline-none focus-visible:bg-coral/5"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => goTo(page + 1)}
            disabled={page >= pageCount - 1}
            aria-label="Sonraki makaleler"
            className="grid place-items-center w-9 h-9 rounded-full border border-border text-coral text-[16px] leading-none transition-colors duration-200 hover:border-coral hover:bg-coral/5 disabled:opacity-30 disabled:pointer-events-none cursor-pointer focus-visible:outline-none focus-visible:bg-coral/5"
          >
            →
          </button>
          <span className="ml-auto font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
            {String(start + 1).padStart(2, '0')}–{String(start + visible.length).padStart(2, '0')} /{' '}
            {String(teasers.length).padStart(2, '0')}
          </span>
        </div>
      )}
    </div>
  );
}
