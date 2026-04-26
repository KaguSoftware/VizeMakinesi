import { TIMELINE_STEPS, TIMELINE_ACTIVE_INDEX } from './constants';

export default function Timeline() {
  return (
    <div className="py-[120px] relative">
      {/* dashed line */}
      <div className="hidden md:block absolute top-1/2 left-[8%] right-[8%] border-t border-dashed border-border" />

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
        {TIMELINE_STEPS.map((step, i) => (
          <div key={step.n} className="text-center md:text-center px-3">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center font-serif italic font-normal text-[28px] tracking-[-0.02em] mx-auto mb-7 relative z-10 border transition-colors ${
                i === TIMELINE_ACTIVE_INDEX
                  ? 'bg-coral border-coral text-white'
                  : 'bg-paper border-navy text-navy'
              }`}
            >
              {step.n}
            </div>
            <div className="font-serif font-semibold text-[22px] mb-3 tracking-[-0.015em]">
              {step.title}
            </div>
            <div className="text-[14px] text-muted leading-[1.65]">{step.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
