import type { NumberedListProps } from './types';

export default function NumberedList({ items }: NumberedListProps) {
  return (
    <ul className="list-none">
      {items.map((item, i) => {
        const text   = typeof item === 'string' ? item : item.text;
        const title  = typeof item === 'string' ? undefined : item.title;
        return (
          <li
            key={i}
            className="grid grid-cols-[80px_1fr] gap-4 py-7 border-t border-border last:border-b"
          >
            <div className="font-serif font-bold text-[36px] text-coral leading-none tracking-[-0.01em]">
              {String(i + 1).padStart(2, '0')}.
            </div>
            <div className="text-base leading-relaxed">
              {title && (
                <strong className="block font-serif font-semibold text-[20px] mb-1 tracking-[-0.01em]">
                  {title}
                </strong>
              )}
              {text}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
