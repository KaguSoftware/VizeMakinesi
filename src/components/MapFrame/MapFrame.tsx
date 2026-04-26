import { MAP_LABEL, MAP_NOTE } from './constants';

export default function MapFrame() {
  return (
    <>
      <div className="w-full aspect-[4/3] border border-border bg-cream relative overflow-hidden">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'linear-gradient(to right, #D8C89A 0.5px, transparent 0.5px), linear-gradient(to bottom, #D8C89A 0.5px, transparent 0.5px)',
            backgroundSize: '56px 56px',
          }}
        />
        {/* Roads */}
        <div className="absolute left-0 right-0 top-[60%] h-6 bg-paper border-t border-b border-border" />
        <div className="absolute top-0 bottom-0 left-[35%] w-[18px] bg-paper border-l border-r border-border" />
        {/* Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[18px] h-[18px] bg-coral rounded-full shadow-[0_0_0_6px_rgba(196,80,42,0.18),0_0_0_14px_rgba(196,80,42,0.08)] map-pin" />
        {/* Label */}
        <div className="absolute bottom-5 left-5 font-mono text-[10px] uppercase tracking-[0.15em] text-navy bg-paper px-3 py-2 border border-border">
          {MAP_LABEL}
        </div>
      </div>
      <p className="text-[13px] text-muted mt-4 leading-[1.7]">{MAP_NOTE}</p>
    </>
  );
}
