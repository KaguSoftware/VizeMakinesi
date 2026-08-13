import Link from 'next/link';
import Image from 'next/image';

interface Props {
  slug: string;
  name: string;
  flagEmoji: string | null;
  imageUrl: string | null;
  excerpt: string;
  /** Overrides the `/blog/{slug}` link target */
  href?: string;
  /** Küçük etiket — varsayılan "Gezi Rehberi" */
  kicker?: string;
  /** Başlıktaki italik ek — varsayılan " rehberi" */
  titleSuffix?: string;
  /** 1-based position in the stream, rendered as the 01 / 02 / … marker */
  index: number;
  /** Mirrors the row so the stream zig-zags down the page */
  reverse?: boolean;
  /** Eager-loads the image — set on the first row only (LCP) */
  priority?: boolean;
}

export default function BlogStreamItem({
  slug,
  name,
  flagEmoji,
  imageUrl,
  excerpt,
  href: hrefProp,
  kicker = 'Gezi Rehberi',
  titleSuffix = ' rehberi',
  index,
  reverse = false,
  priority = false,
}: Props) {
  const href = hrefProp ?? `/blog/${slug}`;

  return (
    <article className="group border-b border-border">
      <div className="container grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 py-14 md:py-20 items-center">
        {/* Visual */}
        <div
          className={`lg:col-span-7 lg:row-start-1 ${
            reverse ? 'lg:col-start-6' : 'lg:col-start-1'
          }`}
        >
          <Link href={href} className="block overflow-hidden relative">
            <div className="relative w-full aspect-video bg-[hsl(var(--color-navy)/0.04)]">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={`${name} — ${kicker}`}
                  fill
                  priority={priority}
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center border border-border">
                  <span className="text-[64px] leading-none opacity-60">{flagEmoji}</span>
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* Text */}
        <div
          className={`lg:col-span-5 lg:row-start-1 ${
            reverse ? 'lg:col-start-1' : 'lg:col-start-8'
          }`}
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="font-mono text-[11px] tracking-[0.2em] text-coral">
              {String(index).padStart(2, '0')}
            </span>
            <span className="h-px flex-1 max-w-10 bg-border" />
            {flagEmoji && <span className="text-[20px] leading-none">{flagEmoji}</span>}
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              {kicker}
            </span>
          </div>

          <h2 className="font-serif font-bold text-[clamp(30px,3.6vw,46px)] leading-[1.05] tracking-[-0.025em] mb-5">
            <Link href={href} className="group-hover:text-coral transition-colors duration-150">
              {name}
              {titleSuffix && <em className="font-normal italic text-coral">{titleSuffix}</em>}
            </Link>
          </h2>

          {excerpt && (
            <p className="text-[16px] leading-[1.8] text-muted max-w-140 line-clamp-4">{excerpt}</p>
          )}

          <Link
            href={href}
            className="inline-block mt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-coral border-b border-transparent group-hover:border-coral transition-colors duration-150"
          >
            Devamını oku →
          </Link>
        </div>
      </div>
    </article>
  );
}
