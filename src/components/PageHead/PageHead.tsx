import type { PageHeadProps } from './types';

export default function PageHead({ eyebrow, title, lede }: PageHeadProps) {
  return (
    <section className="pt-24 pb-[72px] border-b border-border relative overflow-hidden">
      <div className="container">
        <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted mb-14">
          {eyebrow}
        </div>
        <h1 className="font-serif font-bold text-[clamp(56px,9vw,144px)] leading-[0.92] tracking-[-0.04em] max-w-[1200px]">
          {title}
        </h1>
        {lede && (
          <p className="font-serif italic text-[22px] text-navy max-w-[620px] mt-9 leading-[1.45] border-l border-coral pl-6">
            {lede}
          </p>
        )}
      </div>
    </section>
  );
}
