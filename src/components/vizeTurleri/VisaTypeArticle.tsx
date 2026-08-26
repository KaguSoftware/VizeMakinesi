import Link from 'next/link';
import DocumentGrid from '@/components/shared/DocumentGrid/DocumentGrid';
import type { DocumentGridItem } from '@/components/shared/DocumentGrid/DocumentGrid';
import type { VisaTypeContent } from '@/data/visaTypes';

/**
 * Body of a /vize-turleri/[visa-type] sub-page: hero, the editorial sections
 * (each optionally carrying a bulleted document list) and the closing CTA.
 *
 * The FAQ block is deliberately not rendered here — it is admin-managed and
 * composed by the page itself so the section can be omitted when empty.
 */
export default function VisaTypeArticle({
  content,
  documents,
}: {
  content: VisaTypeContent;
  /** Admin-uploaded PDFs, rendered inside the "Gerekli Belgeler" section. */
  documents: DocumentGridItem[];
}) {
  return (
    <>
      {/* Hero */}
      <section className="bg-cream py-[100px]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
            {/* Left: back link + title */}
            <div>
              <Link
                href="/vize-turleri"
                className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase hover:text-navy transition-colors"
              >
                ← Vize Türleri
              </Link>

              <h1 className="font-serif font-bold text-[clamp(36px,4.5vw,64px)] leading-none tracking-[-0.02em] text-navy mt-6">
                {content.title}
              </h1>
            </div>

            {/* Right: description + visa class. The top padding clears the
                back link and the title above it, so the description starts
                around the title's lower edge. */}
            <div className="lg:pt-28">
              <p className="font-serif text-[20px] leading-[1.45] border-l border-coral pl-6 text-navy">
                {content.heroSubtitle}
              </p>

              <span className="inline-block mt-8 font-mono text-[10px] tracking-widest uppercase text-coral border border-coral/30 bg-coral/8 rounded-md px-2.5 py-1">
                {content.tag}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial sections */}
      {content.sections.map((section) => (
        <section key={section.heading} className="container">
          <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 lg:gap-20 py-16 border-b border-border">
            <h2 className="font-serif font-bold text-[clamp(26px,3vw,40px)] leading-[1.1] tracking-[-0.025em] text-navy">
              {section.heading}
            </h2>

            <div className="flex flex-col gap-5">
              {section.paragraphs.map((p, i) => (
                <p key={i} className="text-muted text-base leading-relaxed max-w-[68ch]">
                  {p}
                </p>
              ))}

              {/* Unordered list: belge listeleri, "kimler başvurabilir" maddeleri. */}
              {section.bullets && (
                <ul className="list-none mt-1">
                  {section.bullets.map((b, i) => (
                    <li
                      key={i}
                      className="grid grid-cols-[22px_1fr] gap-3 py-[14px] border-t border-border text-base leading-relaxed first:border-t-0"
                    >
                      <span
                        aria-hidden
                        className="text-coral text-[13px] leading-[1.7] font-mono"
                      >
                        —
                      </span>
                      <span className="text-navy">{b}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Ordered list: başvuru adımları, sırası anlamlı olduğu için numaralı. */}
              {section.steps && (
                <ol className="list-none mt-1">
                  {section.steps.map((step, i) => (
                    <li
                      key={i}
                      className="grid grid-cols-[60px_1fr] gap-4 py-[18px] border-t border-border text-base leading-relaxed first:border-t-0"
                    >
                      <span className="font-mono text-[11px] tracking-[0.15em] text-coral font-medium pt-[5px]">
                        — {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-navy">{step}</span>
                    </li>
                  ))}
                </ol>
              )}

              {/* Same PDF cards as the documents section on /vize/[slug]. */}
              {section.isDocuments && documents.length > 0 && (
                <div className="mt-3">
                  <DocumentGrid documents={documents} />
                </div>
              )}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}

/** Closing call-to-action shared by every visa-type page. */
export function VisaTypeCta({
  title,
  text,
  label,
  href,
}: {
  title: string;
  text: string;
  label: string;
  href: string;
}) {
  // Spacing lives on the inner div: `.container` sets the `padding`
  // shorthand, which would otherwise zero out any py-* utility on it.
  return (
    <section className="container">
      <div className="my-20 rounded-3xl bg-navy text-cream px-8 py-16 md:px-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
          {/* Left: title */}
          <h2 className="font-serif font-bold text-[clamp(28px,3.5vw,48px)] leading-[1.1] tracking-[-0.025em]">
            {title}
          </h2>

          {/* Right: supporting copy + action */}
          <div>
            <p className="text-cream/75 text-base leading-relaxed">{text}</p>
            <Link
              href={href}
              className="inline-flex items-center justify-center mt-8 font-sans font-medium text-[13px] uppercase tracking-[0.1em] px-8 py-[20px] bg-coral border border-coral text-white hover:bg-cream hover:text-navy hover:border-cream transition-all duration-200 rounded-2xl"
            >
              {label} →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
