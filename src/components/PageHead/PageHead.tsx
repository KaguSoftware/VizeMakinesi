import type { PageHeadProps } from './types';

export default function PageHead({ title, lede }: PageHeadProps) {
  return (
    <section className="pt-24 pb-[72px] border-b border-border relative overflow-hidden">
      <div className="container">
        <h1 className="font-serif font-bold text-[clamp(56px,9vw,144px)] leading-none tracking-[-0.02em] max-w-[1200px]">
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
