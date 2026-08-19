'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FadeIn } from '@/components/shared/motion';
import { splitHeading } from '@/lib/text/heading';
import type { SchengenListItem } from '@/data/schengenPage';

interface Group {
  title: string;
  description?: string;
  items: SchengenListItem[];
}

interface Props {
  title: string;
  description?: string;
  groups: Group[];
}

/**
 * Grup başlığı bir açar/kapatır düğmesidir: vize türleri tıklanmadan görünmez.
 * Açılış hareketi SSS bölümündeki akordeonla aynı biçimdedir.
 */
function VisaTypeGroup({ group, index }: { group: Group; index: number }) {
  const [open, setOpen] = useState(false);
  const panelId = `schengen-visa-group-${index}`;

  if (group.items.length === 0) return null;

  return (
    <div className="border-t border-border last:border-b">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="w-full grid grid-cols-[40px_1fr_30px] gap-4 items-center text-left font-serif font-semibold text-[clamp(20px,2.2vw,26px)] tracking-[-0.02em] text-navy hover:text-coral active:bg-coral/5 transition-colors duration-200 py-6 cursor-pointer focus-visible:outline-none focus-visible:bg-coral/5 -mx-2 px-2 rounded"
      >
        <span className="font-mono font-medium text-[11px] tracking-[0.18em] text-coral uppercase">
          — {String(index + 1).padStart(2, '0')}
        </span>
        <span>{group.title}</span>
        <motion.span
          className="font-serif text-[28px] text-coral text-right leading-none"
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="pb-7 pl-0 sm:pl-14">
              {group.description && (
                <p className="font-serif text-[16px] leading-relaxed text-navy/70 mb-5">
                  {group.description}
                </p>
              )}

              <ul className="list-none space-y-2">
                {group.items.map((item) => (
                  <li
                    key={item.title}
                    className="border-l-2 border-coral px-6 py-[18px] bg-cream text-[15px] leading-relaxed"
                  >
                    <strong className="block font-serif font-semibold text-[18px] text-navy mb-1 tracking-[-0.01em]">
                      {item.title}
                    </strong>
                    {item.description}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * "Hangi Schengen Vize Türüne Başvurmalısınız?" — C Tipi (kısa süreli) ve
 * D Tipi (ulusal, uzun süreli) grupları. Temel Kurallar bölümüyle aynı iki
 * sütunlu düzen: başlık solda, açılır-kapanır gruplar sağda.
 */
export default function SchengenVisaTypes({ title, description, groups }: Props) {
  const filled = groups.filter((g) => g.items.length > 0);
  if (filled.length === 0) return null;

  const [head, tail] = splitHeading(title);

  return (
    <section className="container border-b border-border">
      <div className="pt-16 pb-20 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-16 items-start">
        <FadeIn as="div" className="lg:sticky lg:top-24">
          <h2 className="font-serif font-bold text-[clamp(28px,3.5vw,48px)] leading-none tracking-tight text-navy">
            {head}
            {tail && (
              <>
                {' '}
                <em className="font-normal italic text-coral">{tail}</em>
              </>
            )}
          </h2>
          {description && (
            <p className="mt-5 font-serif text-[17px] leading-relaxed text-navy/70">
              {description}
            </p>
          )}
        </FadeIn>

        <div>
          {filled.map((group, i) => (
            <VisaTypeGroup key={group.title} group={group} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
