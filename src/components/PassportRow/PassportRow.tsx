import { PASSPORT_SERVICES } from './constants';

export default function PassportRow() {
  return (
    <div>
      {PASSPORT_SERVICES.map((s) => (
        <div
          key={s.title}
          className="grid grid-cols-1 md:grid-cols-[4fr_5fr_3fr] gap-10 py-11 border-t border-border last:border-b items-start"
        >
          <h3 className="font-serif font-bold text-[36px] tracking-[-0.025em]">{s.title}</h3>
          <p className="text-muted text-[15px] leading-[1.75]">{s.desc}</p>
          <div>
            <div className="font-serif font-bold text-[44px] text-coral leading-[0.9] tracking-[-0.025em]">
              {s.time}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted mt-2">
              {s.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
