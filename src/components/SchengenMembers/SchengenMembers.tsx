import { SCHENGEN_MEMBERS } from './constants';

export default function SchengenMembers() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-border mt-10 mb-10">
      {SCHENGEN_MEMBERS.map((m) => (
        <div
          key={m.name}
          className="flex items-center gap-3 px-[22px] py-5 border-b border-r border-border font-serif font-medium text-base tracking-[-0.005em]"
        >
          <span className="text-[20px]">{m.flag}</span>
          <span>{m.name}</span>
        </div>
      ))}
    </div>
  );
}
