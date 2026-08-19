"use client";

import { Fragment, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TIMELINE_STEPS } from './constants';
import type { TimelineStep } from './types';

const COLORS = {
  coral: '#309c9b',
  navy: '#1a5c5b',
  paper: '#fdfbe5',
  white: '#ffffff',
};

function DetailPanel({ step }: { step: TimelineStep }) {
  return (
    <div className="border border-border rounded-2xl px-5 py-6 md:px-10 md:py-8 bg-paper">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut', delay: 0.15 }}
      >
        <div className="flex items-baseline gap-4 mb-4">
          <span className="font-serif italic text-[28px] text-coral">{step.n}</span>
          <h3 className="font-serif font-semibold text-[24px] tracking-[-0.015em]">{step.title}</h3>
        </div>
        <p className="text-[16px] leading-[1.75] text-foreground max-w-3xl">{step.detail}</p>
      </motion.div>
    </div>
  );
}

/**
 * `steps` defaults to the six-step home-page process. Other pages pass their
 * own set; the `layoutId` glow is keyed off `id` so two timelines on one page
 * don't share an indicator.
 */
export default function Timeline({ steps = TIMELINE_STEPS, id = 'timeline' }: { steps?: TimelineStep[]; id?: string }) {
  const [active, setActive] = useState<number | null>(0);
  const activeStep = active !== null ? steps[active] : null;
  const nextStep = active !== null && active < steps.length - 1 ? active + 1 : null;

  // Mobile grid is 2 cols, so the row containing step i is Math.floor(i / 2).
  // We render a col-span-2 panel after each row's last cell, visible only on mobile,
  // and only when the active step belongs to that row.
  const activeRow = active !== null ? Math.floor(active / 2) : null;

  return (
    <div className="py-12 md:py-30 relative">
      {/* dashed line */}
      <div className="hidden md:block absolute top-40 left-[8%] right-[8%] border-t border-dashed border-border" />

      <div className="grid grid-cols-2 md:grid-cols-6 gap-6 relative">
        {steps.map((step, i) => {
          const isActive = active === i;
          const isNext = nextStep === i;

          const targetBg = isActive ? COLORS.coral : COLORS.paper;
          const targetBorder = isActive ? COLORS.coral : isNext ? COLORS.coral : COLORS.navy;
          const targetColor = isActive ? COLORS.white : isNext ? COLORS.coral : COLORS.navy;

          const row = Math.floor(i / 2);
          const isRowEndMobile = i % 2 === 1 || i === steps.length - 1;
          const showInlinePanel = isRowEndMobile && activeRow === row && activeStep !== null;

          return (
            <Fragment key={step.n}>
              <div className="text-center px-2 md:px-3">
                <div className="relative w-20 h-20 mx-auto mb-7">
                  <AnimatePresence>
                    {isNext && (
                      <motion.span
                        layoutId={`${id}-next-indicator`}
                        className="absolute inset-0 rounded-full pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                          boxShadow: [
                            '0 0 0px 0px rgba(48,156,155,0)',
                            '0 0 22px 8px rgba(48,156,155,0.55)',
                            '0 0 0px 0px rgba(48,156,155,0)',
                          ],
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                          layout: { type: 'spring', stiffness: 260, damping: 28 },
                          opacity: { duration: 0.25 },
                          boxShadow: {
                            duration: 1.4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          },
                        }}
                      />
                    )}
                  </AnimatePresence>
                  <motion.button
                    onClick={() => setActive(isActive ? null : i)}
                    aria-expanded={isActive}
                    animate={{
                      backgroundColor: targetBg,
                      borderColor: targetBorder,
                      color: targetColor,
                    }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.94 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center font-serif italic font-normal text-[28px] tracking-[-0.02em] relative z-10 border cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
                  >
                    {step.n}
                  </motion.button>
                </div>
                <div className="font-serif font-semibold text-[22px] mb-3 tracking-[-0.015em]">
                  {step.title}
                </div>
                <div className="text-[14px] text-muted leading-[1.65]">{step.body}</div>
              </div>

              {/* Mobile-only: inline detail panel rendered after the row containing the active step. */}
              {isRowEndMobile && (
                <div className="md:hidden col-span-2">
                  <AnimatePresence mode="wait" initial={false}>
                    {showInlinePanel && activeStep && (
                      <motion.div
                        key={active}
                        initial={{ opacity: 0, y: 12, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto', marginTop: 16 }}
                        exit={{ opacity: 0, y: -8, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <DetailPanel step={activeStep} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </Fragment>
          );
        })}
      </div>

      {/* Desktop-only full-width detail panel below the row */}
      <AnimatePresence mode="wait" initial={false}>
        {activeStep && (
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto', marginTop: 48 }}
            exit={{ opacity: 0, y: -8, height: 0, marginTop: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden hidden md:block"
          >
            <DetailPanel step={activeStep} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
