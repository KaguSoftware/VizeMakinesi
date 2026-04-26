import { FEE_ROWS, FEES_FOOTNOTE } from './constants';

export default function FeesTable() {
  return (
    <div className="mt-16">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left font-mono font-medium text-[10px] uppercase tracking-[0.18em] text-muted pb-[18px] border-b border-border w-[40%] px-7 pt-7">
              Service
            </th>
            <th className="text-left font-mono font-medium text-[10px] uppercase tracking-[0.18em] text-muted pb-[18px] border-b border-border px-7 pt-7">
              Standard
            </th>
            <th className="text-left font-mono font-medium text-[10px] uppercase tracking-[0.18em] text-muted pb-[18px] border-b-2 border-coral bg-cream px-7 pt-7">
              Express{' '}
              <span className="text-coral normal-case tracking-normal ml-2">· Recommended</span>
            </th>
            <th className="text-left font-mono font-medium text-[10px] uppercase tracking-[0.18em] text-muted pb-[18px] border-b border-border px-7 pt-7">
              Premium
            </th>
          </tr>
        </thead>
        <tbody>
          {FEE_ROWS.map((row, i) => (
            <tr key={i} className="border-t border-border">
              <td className="py-7 px-7 align-middle">
                <div className="font-serif font-semibold text-[20px] tracking-[-0.01em]">{row.svc}</div>
                <div className="text-[13px] text-muted mt-1">{row.desc}</div>
              </td>
              <td className="py-7 px-7 align-middle">
                <span className="font-serif font-bold text-[28px] text-coral tracking-[-0.015em]">
                  {row.standard}
                </span>
              </td>
              <td className="py-7 px-7 align-middle bg-cream border-l-2 border-r-2 border-coral">
                <span className="font-serif font-bold text-[28px] text-coral tracking-[-0.015em]">
                  {row.express}
                </span>
              </td>
              <td className="py-7 px-7 align-middle">
                <span className="font-serif font-bold text-[28px] text-coral tracking-[-0.015em]">
                  {row.premium}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="font-mono text-[11px] tracking-[0.1em] text-muted border-t border-border pt-6 mt-6 uppercase">
        {FEES_FOOTNOTE}
      </p>
    </div>
  );
}
