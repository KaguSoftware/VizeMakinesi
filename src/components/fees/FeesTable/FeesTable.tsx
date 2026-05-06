import { SERVICE_GROUPS, FEES_FOOTNOTE } from './constants';

export default function FeesTable() {
  return (
    <div className="mt-16 pb-16">
      {SERVICE_GROUPS.map((group) => (
        <div key={group.eyebrow} className="mb-16">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-coral mb-6 pb-4 border-b border-border">
            {group.eyebrow}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px border border-border">
            {group.services.map((row) => (
              <div key={row.svc} className="p-8">
                <div className="font-serif font-semibold text-[22px] tracking-[-0.01em] mb-1">
                  {row.svc}
                </div>
                <div className="text-[13px] text-muted mb-6">{row.desc}</div>
                <ul className="flex flex-col gap-2.5 list-none">
                  {row.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[14px] leading-snug text-muted">
                      <span className="text-coral mt-0.5 shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
      <p className="font-mono text-[11px] tracking-[0.1em] text-muted border-t border-border pt-6 uppercase">
        {FEES_FOOTNOTE}
      </p>
    </div>
  );
}
