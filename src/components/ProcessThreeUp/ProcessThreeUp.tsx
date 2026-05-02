import { PROCESS_STEPS } from './constants';

export default function ProcessThreeUp() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 border-t border-border">
      {PROCESS_STEPS.map((step, i) => (
        <div
          key={step.num}
          className={`p-10 ${i < PROCESS_STEPS.length - 1 ? 'md:border-r border-border' : ''} border-b md:border-b-0`}
        >
          <div className="font-serif font-bold text-[88px] leading-[0.9] text-coral mb-7 tracking-[-0.02em]">
            {step.num}
          </div>
          <div className="font-serif font-bold text-[26px] mb-4 tracking-[-0.01em]">
            {step.title}
          </div>
          <div className="text-muted text-[15px] leading-[1.7] max-w-[320px]">
            {step.body}
          </div>
        </div>
      ))}
    </div>
  );
}
