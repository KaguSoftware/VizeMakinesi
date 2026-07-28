import Image from 'next/image';
import type { ReactNode } from 'react';

/** Static map — Tailwind can't see interpolated class names. */
const STAT_COLS: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
};

export interface InterludeStat {
  value: string;
  label: string;
}

interface Props {
  eyebrow: string;
  title: ReactNode;
  note?: string;
  /**
   * Drop an infographic (or any wide visual) in here. Use either `imageUrl`
   * for a single uploaded image, `stats` for a quick number band, or pass
   * `children` for fully custom content.
   */
  imageUrl?: string;
  imageAlt?: string;
  /** Aspect ratio of the image slot — tall infographics want e.g. "4/5" */
  imageRatio?: string;
  stats?: InterludeStat[];
  children?: ReactNode;
  /** Navy slab instead of the default paper slab */
  dark?: boolean;
}

export default function BlogInterlude({
  eyebrow,
  title,
  note,
  imageUrl,
  imageAlt = '',
  imageRatio = '16/9',
  stats,
  children,
  dark = false,
}: Props) {
  return (
    <section
      className={`border-b border-border ${dark ? 'bg-navy text-white' : ''}`}
    >
      <div className="container">
        <div className="py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-8 lg:gap-16 items-end mb-12">
            <div>
              <div className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase mb-5">
                — {eyebrow}
              </div>
              <h2
                className={`font-serif font-bold text-[clamp(32px,4vw,52px)] leading-[1.02] tracking-[-0.03em] ${
                  dark ? 'text-white' : ''
                }`}
              >
                {title}
              </h2>
            </div>
            {note && (
              <p
                className={`font-serif italic text-[18px] leading-relaxed border-l pl-6 ${
                  dark ? 'text-white/80 border-white/30' : 'text-navy border-coral'
                }`}
              >
                {note}
              </p>
            )}
          </div>

          {/* ── Visual slot ── */}
          {children}

          {imageUrl && (
            <div
              className="relative w-full overflow-hidden border border-border"
              style={{ aspectRatio: imageRatio }}
            >
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1360px"
              />
            </div>
          )}

          {stats && stats.length > 0 && (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 ${
                STAT_COLS[Math.min(stats.length, 4)]
              } gap-px ${dark ? 'bg-white/20' : 'bg-border'} border ${
                dark ? 'border-white/20' : 'border-border'
              }`}
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className={`p-8 md:p-10 ${dark ? 'bg-navy' : 'bg-cream'}`}
                >
                  <div
                    className={`font-serif font-bold text-[clamp(40px,5vw,68px)] leading-none tracking-[-0.03em] mb-4 ${
                      dark ? 'text-white' : 'text-navy'
                    }`}
                  >
                    {stat.value}
                  </div>
                  <div
                    className={`font-mono text-[10px] uppercase tracking-[0.18em] ${
                      dark ? 'text-white/60' : 'text-muted'
                    }`}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
