import FlagBG from '@/components/FlagBG/FlagBG';
import type { PageHeadProps } from './types';

export default function PageHead({ title, lede, flagSlug }: PageHeadProps) {
  return (
    <section className="pt-24 pb-[72px] border-b border-border relative overflow-hidden">
      {flagSlug && (
        <div className="absolute right-[-8%] top-1/2 -translate-y-1/2 w-[50%] h-[120%] opacity-[0.12] pointer-events-none">
          <FlagBG slug={flagSlug} className="w-full h-full" />
        </div>
      )}
      <div className="container relative z-10">
        <h1 className="font-serif font-bold text-[clamp(48px,7vw,112px)] leading-none tracking-[-0.02em] whitespace-nowrap">
          {title}
        </h1>
        {lede && (
          <p className="font-serif text-[22px] text-navy max-w-none whitespace-nowrap mt-9 leading-[1.45] border-l border-coral pl-6">
            {lede}
          </p>
        )}
      </div>
    </section>
  );
}
