"use client";

interface Props {
  value: string | number;
  onChange: (v: string) => void;
  options: { label: string; value: string | number }[];
  className?: string;
  cream?: boolean;
  coral?: boolean;
}

export default function NativeSelect({ value, onChange, options, className, cream, coral }: Props) {
  const textCls = cream ? "text-cream" : coral ? "text-coral" : "text-navy";
  const arrowCls = cream ? "text-cream/60" : coral ? "text-coral/50" : "text-navy/40";
  return (
    <div className={`relative ${className ?? ""}`}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`appearance-none bg-transparent font-serif text-[16px] sm:text-[14px] ${textCls} font-semibold pr-5 pl-0 py-0.5 border-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:rounded cursor-pointer`}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <span className={`pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 font-mono text-[10px] ${arrowCls}`}>▾</span>
    </div>
  );
}
