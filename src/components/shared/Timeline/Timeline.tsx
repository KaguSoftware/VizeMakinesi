"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TIMELINE_STEPS } from './constants';

const COLORS = {
  coral: '#309c9b',
  navy: '#1a5c5b',
  paper: '#fdfbe5',
  white: '#ffffff',
};

export default function Timeline() {
  const [active, setActive] = useState<number | null>(0);
  const activeStep = active !== null ? TIMELINE_STEPS[active] : null;
  const nextStep = active !== null && active < TIMELINE_STEPS.length - 1 ? active + 1 : null;

  return (
    <div className="py-12 md:py-30 relative">
      {/* dashed line */}
      <div className="hidden md:block absolute top-40 left-[8%] right-[8%] border-t border-dashed border-border" />

      <div className="grid grid-cols-2 md:grid-cols-6 gap-6 relative">
        {TIMELINE_STEPS.map((step, i) => {
          const isActive = active === i;
          const isNext = nextStep === i;

          const targetBg = isActive ? COLORS.coral : COLORS.paper;
          const targetBorder = isActive ? COLORS.coral : isNext ? COLORS.coral : COLORS.navy;
          const targetColor = isActive ? COLORS.white : isNext ? COLORS.coral : COLORS.navy;

          return (
            <div key={step.n} className="text-center px-2 md:px-3">
              <div className="relative w-20 h-20 mx-auto mb-7">
                <AnimatePresence>
                  {isNext && (
                    <motion.span
                      layoutId="timeline-next-indicator"
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
          );
        })}
      </div>

      {/* Full-width detail panel */}
      <AnimatePresence mode="wait" initial={false}>
        {activeStep && (
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto', marginTop: 48 }}
            exit={{ opacity: 0, y: -8, height: 0, marginTop: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border border-border rounded-2xl px-5 py-6 md:px-10 md:py-8 bg-paper">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut', delay: 0.15 }}
              >
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="font-serif italic text-[28px] text-coral">{activeStep.n}</span>
                  <h3 className="font-serif font-semibold text-[24px] tracking-[-0.015em]">{activeStep.title}</h3>
                </div>
                <p className="text-[16px] leading-[1.75] text-foreground max-w-3xl">{activeStep.detail}</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
