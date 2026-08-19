'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { BlogSection } from '@/data/blogSchengen';

export interface GuideSectionItem extends BlogSection {
  /** Sayfa içi çapa — hero'daki bağlantılar ve derin linkler bunu kullanır. */
  anchor: string;
  /** Tahmini okuma süresi (dakika). */
  minutes: number;
}

/**
 * Rehberin ana bölümleri. Sayfa dört uzun yazıyı birden taşıdığı için bölümler
 * kapalı başlar: okur önce başlık + okuma süresi listesini görür, yalnızca
 * ilgilendiği bölümü açar. Adres çubuğundaki çapa (#2-schengen-vize-ret-...)
 * ile gelindiğinde ilgili bölüm kendiliğinden açılır.
 */
export default function GuideSections({ sections }: { sections: GuideSectionItem[] }) {
  const [open, setOpen] = useState<Set<string>>(new Set());

  // Derin bağlantıyla (#2-schengen-vize-ret-maddeleri) gelindiğinde ilgili bölüm
  // açılır. Sunucuda bölümler kapalı render edildiği için bu iş mount sonrasına
  // bırakılır — aksi hâlde hydration uyuşmazlığı olurdu.
  useEffect(() => {
    function openFromHash() {
      const hash = decodeURIComponent(window.location.hash.replace('#', ''));
      const match = sections.find((s) => s.anchor === hash);
      if (!match) return;
      setOpen((prev) => new Set(prev).add(match.anchor));
      // Açılış animasyonu düzeni değiştirdiği için kaydırma bir kare sonraya kalır.
      requestAnimationFrame(() => {
        document.getElementById(match.anchor)?.scrollIntoView({ block: 'start' });
      });
    }

    const frame = requestAnimationFrame(openFromHash);
    window.addEventListener('hashchange', openFromHash);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('hashchange', openFromHash);
    };
  }, [sections]);

  function toggle(anchor: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(anchor)) next.delete(anchor);
      else next.add(anchor);
      return next;
    });
  }

  return (
    <div className="container">
      {sections.map((section, i) => {
        const isOpen = open.has(section.anchor);
        return (
          <section key={section.anchor} id={section.anchor} className="scroll-mt-24">
            <div className="border-t border-border last:border-b">
              <button
                type="button"
                onClick={() => toggle(section.anchor)}
                aria-expanded={isOpen}
                className="w-full grid grid-cols-[46px_1fr_30px] gap-4 md:gap-6 items-start text-left py-8 cursor-pointer transition-colors duration-200 hover:bg-coral/[0.03] focus-visible:outline-none focus-visible:bg-coral/5 -mx-2 px-2 rounded"
              >
                <span className="font-mono font-medium text-[11px] tracking-[0.18em] text-coral uppercase pt-2">
                  — {String(i + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0">
                  <span className="block font-serif font-bold text-coral text-[clamp(22px,2.6vw,34px)] leading-[1.12] tracking-[-0.02em]">
                    {section.title}
                  </span>
                  <span className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] tracking-[0.2em] uppercase text-muted">
                    <span>{section.kicker}</span>
                    <span aria-hidden className="text-border">
                      /
                    </span>
                    <span>{section.minutes} dk okuma</span>
                    <span aria-hidden className="text-border">
                      /
                    </span>
                    <span>{section.subsections.length} başlık</span>
                  </span>
                </span>
                <motion.span
                  aria-hidden
                  className="font-serif text-[28px] text-coral text-right leading-none pt-1"
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                  +
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="pb-16 md:pl-[70px] max-w-[760px]">
                      {section.intro.length > 0 && (
                        <div className="space-y-5 text-[17px] leading-[1.85] text-navy">
                          {section.intro.map((paragraph, j) => (
                            <p key={j}>{paragraph}</p>
                          ))}
                        </div>
                      )}

                      {section.subsections.map((sub) => (
                        <div key={sub.heading} className="mt-12 pt-8 border-t border-border">
                          <h3 className="font-serif font-bold text-[21px] md:text-[25px] leading-snug tracking-[-0.01em] text-navy">
                            {sub.heading}
                          </h3>

                          {sub.quote && (
                            <figure className="mt-6 border-l-2 border-coral pl-5 py-1">
                              <p className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase mb-3">
                                — Ret kararında yer alan ifade
                              </p>
                              <blockquote className="font-serif italic text-[18px] leading-[1.7] text-navy">
                                “{sub.quote}”
                              </blockquote>
                              {sub.quote_en && (
                                <figcaption className="mt-3 font-mono text-[12px] leading-[1.7] text-muted">
                                  İngilizce orijinali: “{sub.quote_en}”
                                </figcaption>
                              )}
                            </figure>
                          )}

                          <div className="mt-6 space-y-5 text-[16px] leading-[1.85] text-navy">
                            {sub.paragraphs.map((paragraph, j) => (
                              <p key={j}>{paragraph}</p>
                            ))}
                          </div>

                          {sub.bullets.length > 0 && (
                            <ul className="mt-6 space-y-3">
                              {sub.bullets.map((bullet) => (
                                <li key={bullet} className="flex gap-4 border-t border-border pt-3">
                                  <span className="font-mono text-[11px] text-coral leading-[1.9]">
                                    —
                                  </span>
                                  <span className="text-[16px] leading-[1.85] text-navy">
                                    {bullet}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => {
                          toggle(section.anchor);
                          document.getElementById(section.anchor)?.scrollIntoView({ block: 'start' });
                        }}
                        className="mt-12 font-mono text-[10px] tracking-[0.2em] uppercase text-muted hover:text-coral transition-colors cursor-pointer"
                      >
                        — Bölümü kapat
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        );
      })}
    </div>
  );
}
