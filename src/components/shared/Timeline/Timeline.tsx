"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TIMELINE_STEPS } from './constants';

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
          return (
            <div key={step.n} className="text-center px-2 md:px-3">
              <motion.button
                onClick={() => setActive(isActive ? null : i)}
                aria-expanded={isActive}
                animate={isNext ? {
                  boxShadow: [
                    '0 0 0px 0px rgba(48,156,155,0)',
                    '0 0 22px 8px rgba(48,156,155,0.55)',
                    '0 0 0px 0px rgba(48,156,155,0)',
                  ],
                } : { boxShadow: '0 0 0px 0px rgba(48,156,155,0)' }}
                transition={isNext ? {
                  duration: 1.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                } : undefined}
                className={`w-20 h-20 rounded-full flex items-center justify-center font-serif italic font-normal text-[28px] tracking-[-0.02em] mx-auto mb-7 relative z-10 border cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-coral ${
                  isActive
                    ? 'bg-coral border-coral text-white'
                    : isNext
                    ? 'bg-paper border-coral text-coral'
                    : 'bg-paper border-navy text-navy hover:border-coral hover:text-coral'
                }`}
              >
                {step.n}
              </motion.button>
              <div className="font-serif font-semibold text-[22px] mb-3 tracking-[-0.015em]">
                {step.title}
              </div>
              <div className="text-[14px] text-muted leading-[1.65]">{step.body}</div>
            </div>
          );
        })}
      </div>

      {/* Full-width detail panel */}
      {activeStep && (
        <div className="mt-12 border border-border rounded-2xl px-5 py-6 md:px-10 md:py-8 bg-paper">
          <div className="flex items-baseline gap-4 mb-4">
            <span className="font-serif italic text-[28px] text-coral">{activeStep.n}</span>
            <h3 className="font-serif font-semibold text-[24px] tracking-[-0.015em]">{activeStep.title}</h3>
          </div>
          <p className="text-[16px] leading-[1.75] text-foreground max-w-3xl">{activeStep.detail}</p>
        </div>
      )}
    </div>
  );
}
