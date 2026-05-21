import FlagBG from '@/components/shared/FlagBG/FlagBG';
import { FadeIn } from '@/components/shared/motion';
import type { PageHeadProps } from './types';

export default function PageHead({ title, lede, flagPresetKey, flagImageUrl, titleClassName, ledeClassName, contentClassName, noBorder, sectionClassName }: PageHeadProps) {
  return (
    <section className={`pt-24 pb-18 relative overflow-hidden${noBorder ? '' : ' border-b border-border'}${sectionClassName ? ` ${sectionClassName}` : ''}`}>
      {(flagPresetKey || flagImageUrl) && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-[120%] opacity-[0.12] pointer-events-none hidden lg:block">
          <FlagBG presetKey={flagPresetKey} imageUrl={flagImageUrl} className="w-full h-full" />
        </div>
      )}
      <div className="container relative z-10">
        <div className={contentClassName ?? ""}>
          <FadeIn as="div" duration={0.5}>
            <h1 className={titleClassName ?? "font-serif font-bold text-[clamp(36px,6.6vw,106px)] leading-[0.95] tracking-[-0.02em] wrap-break-word hyphens-auto max-w-full"}>
              {title}
            </h1>
          </FadeIn>
          {lede && (
            <FadeIn as="div" delay={0.15} duration={0.5}>
              <p className={ledeClassName ?? "font-serif text-[20px] text-navy mt-9 leading-[1.45] border-l border-coral pl-6 wrap-break-word"}>
                {lede}
              </p>
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  );
}
