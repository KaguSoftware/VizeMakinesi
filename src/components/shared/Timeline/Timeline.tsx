"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TIMELINE_STEPS } from './constants';
import type { TimelineStep } from './types';

const COLORS = {
  coral: '#309c9b',
  navy: '#1a5c5b',
  paper: '#fdfbe5',
  white: '#ffffff',
};

/** Şerit tek ekrana bu adım sayısına kadar sığar; fazlası yatay kaydırmaya döner. */
const FIT_LIMIT = 6;

/** Kartın daire merkezinden aşağı kayması (absolute `top` değeriyle aynı). */
const CARD_TOP = 88;
/**
 * Şeridin sabit yüksekliği. Kart `absolute` durduğu için yüksekliğe katkı vermez;
 * burası hangi adım açık olursa olsun aynı kalır, böylece bölüm tıklamalarda
 * yerinden oynamaz. Değer en uzun karta göre seçildi (CARD_TOP + kart + pay);
 * adım metinleri uzatılırsa buranın da büyütülmesi gerekir.
 */
const STRIP_H = 371;

/** Seçili adımın dairesinin yanında açılan detay kartı. */
function DetailCard({ step }: { step: TimelineStep }) {
  return (
    <div
      className="rounded-[22px] border border-border/70 bg-white shadow-[0_20px_50px_-28px_rgba(26,92,91,0.6)] px-7 md:px-8 py-6 md:py-7"
    >
      <h3 className="font-serif font-semibold text-[21px] md:text-[24px] leading-tight tracking-[-0.015em] text-navy mb-4">
        {step.title}
      </h3>
      <ul className="flex flex-col gap-2.5">
        {step.details.map((d, i) => (
          <li key={i} className="relative pl-4 text-[14px] md:text-[15px] leading-[1.6] text-navy/85">
            <span className="absolute left-0 top-0 text-navy/45 select-none">–</span>
            {d}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ArrowButton({
  dir,
  disabled,
  onClick,
}: {
  dir: 'prev' | 'next';
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 'prev' ? 'Önceki adımlar' : 'Sonraki adımlar'}
      className="shrink-0 w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center text-navy/60 hover:text-coral hover:bg-white/70 transition-colors duration-200 disabled:opacity-25 disabled:pointer-events-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {dir === 'prev' ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
      </svg>
    </button>
  );
}

/**
 * Yatay süreç şeridi: numaralı daireler kesikli çizgiyle bağlanır, seçilen
 * adımın dairesi büyür ve hemen yanında detay kartı açılır. Kart akışın dışında
 * (absolute) durur; böylece adımlar yerinden oynamaz.
 *
 * Altı adıma kadar tüm adımlar aynı anda görünür ve ok tuşları gizlidir; daha
 * fazlası olduğunda şerit yatay kaydırmaya döner ve oklar belirir. Mobilde
 * (md altı) bunun yerine dikey akordeon şerit kullanılır.
 *
 * `id` layout animasyon anahtarını ayırır, böylece aynı sayfadaki iki şerit
 * aynı parıltıyı paylaşmaz.
 */
export default function Timeline({
  steps = TIMELINE_STEPS,
  id = 'timeline',
}: {
  steps?: TimelineStep[];
  id?: string;
}) {
  const [active, setActive] = useState<number | null>(steps.length > 1 ? 1 : 0);
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const scrolls = steps.length > FIT_LIMIT;
  // Sıradaki adım hafifçe parlar; tıklanabilir olduğu böyle sezilir.
  const nextIndex = active !== null && active < steps.length - 1 ? active + 1 : null;

  const syncEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft >= el.scrollWidth - el.clientWidth - 4,
    });
  }, []);

  useLayoutEffect(syncEdges, [syncEdges, steps.length]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(syncEdges);
    ro.observe(el);
    return () => ro.disconnect();
  }, [syncEdges]);

  const scrollByStep = (dir: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * Math.max(240, track.clientWidth * 0.6), behavior: 'smooth' });
  };

  // Açık kart, dairenin merkezinden başlayıp yaklaşık iki hücre boyunca uzanır;
  // altında kalan başlıkları gizleyerek kart kenarlarından metin sızmasını önlüyoruz.
  const flipOf = (i: number) => steps.length > 2 && i >= steps.length - 2;
  const coveredByCard = (i: number) => {
    if (active === null || i === active) return false;
    const d = flipOf(active) ? active - i : i - active;
    return d === 1 || d === 2;
  };

  const cellClass = scrolls
    ? 'w-[152px] md:w-[176px] shrink-0'
    : 'w-[152px] shrink-0 md:w-auto md:flex-1 md:min-w-0';

  return (
    <div className="py-6 md:pt-10 md:pb-5 relative">
      {/* Yatay şerit yalnızca md+ ekranda; mobilde aşağıdaki dikey liste kullanılır. */}
      <div className="hidden md:flex items-start gap-3">
        <div className={`hidden ${scrolls ? 'md:flex' : ''} pt-[26px]`}>
          <ArrowButton dir="prev" disabled={edges.start} onClick={() => scrollByStep(-1)} />
        </div>

        <div
          ref={trackRef}
          onScroll={syncEdges}
          className={`timeline-track flex-1 overflow-x-auto ${scrolls ? '' : 'md:overflow-x-visible'}`}
        >
          <div
            style={{ minHeight: STRIP_H }}
            className={`relative flex items-start ${
              scrolls ? 'min-w-max' : 'min-w-max md:min-w-0 md:w-full'
            }`}
          >
            {steps.map((step, i) => {
              const isActive = active === i;
              const isNext = nextIndex === i;
              // Sağdaki son iki adımda kart sola doğru açılır, taşmasın diye.
              const flip = flipOf(i);

              return (
                <div key={step.n} className={`relative text-center px-1 ${cellClass}`}>
                  {/* Kesikli bağlantı çizgisi: önceki dairenin merkezinden bu dairenin merkezine */}
                  {i > 0 && (
                    <span
                      aria-hidden
                      className="absolute top-10 right-1/2 w-full h-px border-t border-dashed border-border z-0"
                    />
                  )}

                  <div className="relative z-30 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          layoutId={`${id}-active-glow`}
                          className="absolute inset-0 rounded-full pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{
                            opacity: 1,
                            boxShadow: [
                              '0 0 0px 0px rgba(48,156,155,0)',
                              '0 0 26px 10px rgba(48,156,155,0.5)',
                              '0 0 0px 0px rgba(48,156,155,0)',
                            ],
                          }}
                          exit={{ opacity: 0 }}
                          transition={{
                            layout: { type: 'spring', stiffness: 260, damping: 28 },
                            opacity: { duration: 0.25 },
                            boxShadow: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
                          }}
                        />
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {isNext && (
                        <motion.span
                          layoutId={`${id}-next-glow`}
                          className="absolute inset-0 rounded-full pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{
                            opacity: 1,
                            boxShadow: [
                              '0 0 10px 2px rgba(48,156,155,0.25)',
                              '0 0 24px 8px rgba(48,156,155,0.7)',
                              '0 0 10px 2px rgba(48,156,155,0.25)',
                            ],
                          }}
                          exit={{ opacity: 0 }}
                          transition={{
                            layout: { type: 'spring', stiffness: 260, damping: 28 },
                            opacity: { duration: 0.25 },
                            boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                          }}
                        />
                      )}
                    </AnimatePresence>

                    <motion.button
                      type="button"
                      onClick={() => setActive(isActive ? null : i)}
                      aria-expanded={isActive}
                      animate={{
                        scale: isActive ? 1.16 : isNext ? 1.04 : 1,
                        backgroundColor: isActive ? COLORS.coral : COLORS.paper,
                        borderColor: isActive || isNext ? COLORS.coral : COLORS.navy,
                        color: isActive ? COLORS.white : isNext ? COLORS.coral : COLORS.navy,
                      }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      whileHover={{ scale: isActive ? 1.16 : 1.08 }}
                      whileTap={{ scale: isActive ? 1.1 : 0.95 }}
                      className="w-20 h-20 rounded-full flex items-center justify-center font-serif italic font-normal text-[26px] tracking-[-0.02em] relative z-10 border cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2"
                    >
                      {step.n}
                    </motion.button>
                  </div>

                  {/* Kart yalnızca md+ ekranda başlıkların üstüne bindiği için gizleme de orada geçerli. */}
                  <div
                    className={`px-1 transition-opacity duration-300 ${
                      isActive || coveredByCard(i) ? 'md:opacity-0' : 'md:opacity-100'
                    }`}
                  >
                    <div className="font-serif font-semibold text-[18px] md:text-[20px] leading-[1.2] tracking-[-0.015em] text-navy">
                      {step.title}
                    </div>
                  </div>

                  {/* Detay kartı — dairenin merkezinden başlar, akışı bozmadan üstte durur */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        style={{ top: CARD_TOP }}
                        className={`hidden md:block absolute z-20 text-left w-[min(80vw,400px)] ${
                          flip ? 'right-1/2 -mr-10' : 'left-1/2 -ml-10'
                        }`}
                      >
                        <DetailCard step={step} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`hidden ${scrolls ? 'md:flex' : ''} pt-[26px]`}>
          <ArrowButton dir="next" disabled={edges.end} onClick={() => scrollByStep(1)} />
        </div>
      </div>

      {/* Mobil: dikey şerit — numara solda, başlık yanında, detaylar altında açılır.
          Yatay kaydırma dar ekranda başlıkları kırptığı için mobilde kullanılmıyor. */}
      <ol className="md:hidden list-none flex flex-col">
        {steps.map((step, i) => {
          const isActive = active === i;
          const isNext = nextIndex === i;

          return (
            <li key={step.n} className="relative pl-[68px]">
              {/* Kesikli dikey bağlantı çizgisi: bu dairenin altından sonrakine */}
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-[25px] top-[66px] bottom-0 w-px border-l border-dashed border-border"
                />
              )}

              <button
                type="button"
                onClick={() => setActive(isActive ? null : i)}
                aria-expanded={isActive}
                className="w-full text-left py-3.5 flex items-center gap-3 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-coral rounded-lg"
              >
                <motion.span
                  aria-hidden
                  animate={{
                    backgroundColor: isActive ? COLORS.coral : COLORS.paper,
                    borderColor: isActive || isNext ? COLORS.coral : COLORS.navy,
                    color: isActive ? COLORS.white : isNext ? COLORS.coral : COLORS.navy,
                  }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="absolute left-0 top-2.5 w-[52px] h-[52px] rounded-full border flex items-center justify-center font-serif italic text-[22px] tracking-[-0.02em]"
                >
                  {step.n}
                </motion.span>

                <span
                  className={`flex-1 font-serif font-semibold text-[19px] leading-[1.25] tracking-[-0.015em] transition-colors duration-300 ${
                    isActive ? 'text-coral' : 'text-navy'
                  }`}
                >
                  {step.title}
                </span>

                <motion.span
                  aria-hidden
                  animate={{ rotate: isActive ? 180 : 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="shrink-0 text-navy/45 leading-none"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-5">
                      <DetailCard step={step} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
