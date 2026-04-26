import { EDITORIAL_QUOTE } from './constants';

export default function EditorialQuote() {
  const { quote, by, eyebrow, title, paragraphs } = EDITORIAL_QUOTE;

  return (
    <section className="py-[120px] border-b border-border">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Pull-quote */}
          <div className="relative">
            <span
              className="font-serif italic text-coral pointer-events-none select-none"
              style={{
                position: 'absolute',
                top: '-32px',
                left: '-16px',
                fontSize: '240px',
                lineHeight: '0.6',
              }}
            >
              &ldquo;
            </span>
            <q className="block font-serif italic text-[clamp(28px,3vw,40px)] leading-[1.25] tracking-[-0.015em] relative pl-[60px]">
              {quote}
            </q>
            <div className="flex items-center gap-4 mt-9 pl-[60px] font-mono text-[11px] tracking-[0.15em] text-muted uppercase">
              <span className="w-10 h-px bg-coral block" />
              {by}
            </div>
          </div>

          {/* Editorial note */}
          <div className="border-l border-border pl-14">
            <div className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase mb-6">
              {eyebrow}
            </div>
            <h3 className="font-serif font-bold text-[38px] leading-[1.1] tracking-[-0.02em] mb-6">
              {title}
            </h3>
            <div className="editorial-body">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-muted text-base leading-[1.8] mb-4">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
