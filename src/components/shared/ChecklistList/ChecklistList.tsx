import { Stagger, StaggerItem } from '@/components/shared/motion';
import type { ChecklistListProps } from './types';

export default function ChecklistList({ items }: ChecklistListProps) {
  return (
    <Stagger as="ul" className="list-none" gap={0.05}>
      {items.map((item, i) => (
        <StaggerItem
          as="li"
          key={i}
          className="grid grid-cols-[60px_1fr] gap-4 py-[18px] border-t border-border text-base leading-relaxed first:border-t-0 last:border-b-0"
        >
          <div className="font-mono text-[11px] tracking-[0.15em] text-coral font-medium pt-[5px]">
            — {String(i + 1).padStart(2, '0')}
          </div>
          <div>{item}</div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
