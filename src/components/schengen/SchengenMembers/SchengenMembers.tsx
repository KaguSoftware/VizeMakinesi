import { SCHENGEN_MEMBERS } from './constants';
import { Stagger, StaggerItem } from '@/components/shared/motion';

export default function SchengenMembers() {
  return (
    <Stagger as="div" className="grid grid-cols-2 sm:grid-cols-4 border-t border-border mt-10 mb-10" gap={0.03}>
      {SCHENGEN_MEMBERS.map((m) => (
        <StaggerItem
          key={m.name}
          className="flex items-center gap-3 px-[22px] py-5 border-b border-r border-border font-serif font-medium text-base tracking-[-0.005em]"
        >
          <span>{m.name}</span>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
