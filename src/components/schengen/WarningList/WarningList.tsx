import type { WarningListProps } from './types';

export default function WarningList({ items }: WarningListProps) {
  return (
    <ul className="list-none mt-6 space-y-2">
      {items.map((r) => (
        <li
          key={r.title}
          className="border-l-2 border-coral px-6 py-[18px] bg-cream text-[15px] leading-relaxed"
        >
          <strong className="block font-serif font-semibold text-[18px] text-navy mb-1 tracking-[-0.01em]">
            {r.title}
          </strong>
          {r.desc}
        </li>
      ))}
    </ul>
  );
}
