import FlagBG from '@/components/shared/FlagBG/FlagBG';
import type { PageHeadProps } from './types';

export default function PageHead({ title, lede, flagPresetKey, flagImageUrl, titleClassName }: PageHeadProps) {
  return (
    <section className="pt-24 pb-[72px] border-b border-border relative overflow-hidden">
      {(flagPresetKey || flagImageUrl) && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-[120%] opacity-[0.12] pointer-events-none hidden lg:block">
          <FlagBG presetKey={flagPresetKey} imageUrl={flagImageUrl} className="w-full h-full" />
        </div>
      )}
      <div className="container relative z-10">
        <div className="lg:w-1/2 lg:pr-8">
          <h1 className={titleClassName ?? "font-serif font-bold text-[clamp(48px,6.6vw,106px)] leading-[0.95] tracking-[-0.02em] wrap-break-word hyphens-auto"}>
            {title}
          </h1>
          {lede && (
            <p className="font-serif text-[20px] text-navy mt-9 leading-[1.45] border-l border-coral pl-6 break-words">
              {lede}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
