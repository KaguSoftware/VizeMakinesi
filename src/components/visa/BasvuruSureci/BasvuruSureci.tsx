"use client";

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { TIMELINE_STEPS } from '@/components/shared/Timeline/constants';
import { FadeIn, Stagger, StaggerItem } from '@/components/shared/motion';

const REZERVASYON_KURUMLARI = ['VFS Global', 'iDATA', 'BLS'];
const STEPS_PAGE_SIZE = 3;

// Same direction-aware page swap as FAQ, so pagination reads consistently
// across the site.
const pageVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 28 : -28 }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.22, ease: 'easeOut' as const },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -28 : 28,
    transition: { duration: 0.16, ease: 'easeIn' as const },
  }),
};

export interface ProcessStep {
  title: string;
  description: string;
}

interface Props {
  countryName?: string;
  /** Admin-managed steps for this country. Empty/omitted → default steps. */
  steps?: ProcessStep[];
}

export default function BasvuruSureci({ countryName, steps }: Props) {
  const basvuru = TIMELINE_STEPS[0];
  const customSteps = steps?.filter((s) => s.title && s.description) ?? [];

  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const pageCount = Math.ceil(customSteps.length / STEPS_PAGE_SIZE);
  const paginated = customSteps.length > 0 && pageCount > 1;
  const start = paginated ? page * STEPS_PAGE_SIZE : 0;
  const visibleSteps = paginated
    ? customSteps.slice(start, start + STEPS_PAGE_SIZE)
    : customSteps;

  const goTo = (next: number) => {
    setDirection(next > page ? 1 : -1);
    setPage(next);
  };

  return (
    <section className="container border-b border-border">
      <div className="pt-16 pb-12 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-16 items-start">
        <FadeIn as="div">
          <h2 className="font-serif font-bold text-[clamp(28px,3.5vw,48px)] leading-none tracking-tight text-navy mb-6">
            {countryName ? `${countryName} Vize İşlemleri` : 'Başvuru ve rezervasyon'}<br />
            <em className="font-normal italic text-coral">nasıl yapılır?</em>
          </h2>
          <p className="font-serif italic text-[18px] text-navy/70 leading-relaxed mb-8 max-w-sm">
            İlk görüşmeden pasaport teslimine kadar her adımı biz yönetiyoruz. Hiçbir ayrıntı gözden kaçmaz.
          </p>
          <Link
            href="/#nasil-calisiyoruz"
            className="inline-flex items-center gap-2 font-sans font-medium text-[13px] uppercase tracking-[0.15em] text-navy hover:text-coral transition-colors duration-200"
          >
            Süreci Detaylı İnceleyin →
          </Link>
        </FadeIn>

        <div>
          {customSteps.length > 0 ? (
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={page}
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex flex-col gap-0"
              >
                {visibleSteps.map((step, li) => {
                  const i = start + li;
                  return (
                    <div
                      key={`${step.title}-${i}`}
                      className={
                        i === 0
                          ? 'flex gap-6 py-6 border-b border-navy/10 bg-navy/3 rounded-xl px-5 -mx-5'
                          : 'flex gap-6 py-6 border-b border-navy/10'
                      }
                    >
                      <div className="font-mono text-[11px] tracking-[0.15em] pt-1 shrink-0 w-7 text-coral font-bold">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <div className="font-sans font-semibold text-[15px] mb-1 text-navy">
                          {step.title}
                        </div>
                        <div className="font-sans text-[14px] leading-relaxed text-navy/80">
                          {step.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          ) : (
            <Stagger as="div" className="flex flex-col gap-0">
              {/* Step 01 — Başvuru */}
              <StaggerItem className="flex gap-6 py-6 border-b border-navy/10 bg-navy/3 rounded-xl px-5 -mx-5">
                <div className="font-mono text-[11px] tracking-[0.15em] pt-1 shrink-0 w-7 text-coral font-bold">
                  {basvuru.n}
                </div>
                <div>
                  <div className="font-sans font-semibold text-[15px] mb-1 text-navy">
                    {basvuru.title}
                  </div>
                  <div className="font-sans text-[14px] leading-relaxed text-navy/80">
                    {basvuru.detail}
                  </div>
                </div>
              </StaggerItem>

              {/* Rezervasyon */}
              <StaggerItem className="flex gap-6 py-6 border-b border-navy/10">
                <div className="font-mono text-[11px] tracking-[0.15em] pt-1 shrink-0 w-7 text-coral font-bold">
                  02
                </div>
                <div>
                  <div className="font-sans font-semibold text-[15px] mb-1 text-navy">
                    Rezervasyon
                  </div>
                  <div className="font-sans text-[14px] leading-relaxed text-navy/80 mb-4">
                    Konsolosluk randevunuzu sizin adınıza yetkili aracı kurumlar üzerinden alıyoruz. Hangi kurumun aktif randevu verdiğini takip eder, en uygun tarihi sizin için ayarlıyoruz.
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {REZERVASYON_KURUMLARI.map((kurum) => (
                      <span
                        key={kurum}
                        className="font-mono text-[10px] tracking-[0.12em] uppercase px-3 py-1.5 border border-navy/20 text-navy/60 rounded-md"
                      >
                        {kurum}
                      </span>
                    ))}
                  </div>
                </div>
              </StaggerItem>
            </Stagger>
          )}

          {paginated && (
            <div className="flex items-center justify-between gap-4 pt-8">
              <button
                type="button"
                onClick={() => goTo(page - 1)}
                disabled={page === 0}
                aria-label="Önceki adımlar"
                className="grid place-items-center w-11 h-11 rounded-full border border-border text-coral text-[20px] leading-none transition-colors duration-200 hover:border-coral hover:bg-coral/5 disabled:opacity-30 disabled:pointer-events-none cursor-pointer focus-visible:outline-none focus-visible:bg-coral/5"
              >
                ←
              </button>

              <span className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
                {String(start + 1).padStart(2, '0')}–
                {String(start + visibleSteps.length).padStart(2, '0')}{' '}
                / {String(customSteps.length).padStart(2, '0')}
              </span>

              <button
                type="button"
                onClick={() => goTo(page + 1)}
                disabled={page >= pageCount - 1}
                aria-label="Sonraki adımlar"
                className="grid place-items-center w-11 h-11 rounded-full border border-border text-coral text-[20px] leading-none transition-colors duration-200 hover:border-coral hover:bg-coral/5 disabled:opacity-30 disabled:pointer-events-none cursor-pointer focus-visible:outline-none focus-visible:bg-coral/5"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
