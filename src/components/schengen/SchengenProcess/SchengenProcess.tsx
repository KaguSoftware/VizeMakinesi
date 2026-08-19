'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { FadeIn } from '@/components/shared/motion';
import { EASE_OUT_EXPO, VIEWPORT } from '@/components/shared/motion/constants';
import { splitHeading } from '@/lib/text/heading';

interface Props {
  title: string;
  description?: string;
  steps: string[];
}

const STEP_GAP = 0.12;

/**
 * "Schengen Vize Başvurusu Nasıl Yapılır?" — adımlar sırayla soldan kayarak
 * girer; solundaki coral ray yukarıdan aşağıya çizilerek akışı gösterir.
 * (Rehberdeki ok akışının hareketli karşılığı — ayrıca ok işareti kullanılmaz.)
 */
export default function SchengenProcess({ title, description, steps }: Props) {
  const reduced = useReducedMotion();

  if (steps.length === 0) return null;

  const [head, tail] = splitHeading(title);

  return (
    <section className="container border-b border-border">
      <div className="pt-16 pb-20 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-16 items-start">
        <FadeIn as="div">
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

        <div className="relative">
          {/* Adımları birbirine bağlayan ray — adımlarla birlikte çizilir. */}
          <motion.span
            aria-hidden
            className="absolute left-[13px] top-2 bottom-2 w-px bg-coral/30 origin-top"
            initial={reduced ? undefined : { scaleY: 0 }}
            whileInView={reduced ? undefined : {
              scaleY: 1,
              transition: { duration: steps.length * STEP_GAP + 0.5, ease: 'linear' },
            }}
            viewport={reduced ? undefined : VIEWPORT}
          />

          <ol className="relative flex flex-col">
            {steps.map((step, i) => (
              <motion.li
                key={`${step}-${i}`}
                className="flex items-center gap-5 py-4"
                initial={reduced ? undefined : { opacity: 0, x: -28 }}
                whileInView={reduced ? undefined : {
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.5, ease: EASE_OUT_EXPO, delay: i * STEP_GAP },
                }}
                viewport={reduced ? undefined : VIEWPORT}
              >
                <span className="shrink-0 grid place-items-center w-7 h-7 rounded-full border border-coral bg-cream font-mono text-[11px] font-bold tracking-[0.05em] text-coral">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-sans font-medium text-[15px] leading-snug text-navy">
                  {step}
                </span>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
