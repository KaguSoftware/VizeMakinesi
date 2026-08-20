import Link from 'next/link';
import type { BlogArticle } from '@/lib/blog/articles';

interface Props {
  basePath: string;
  prev: BlogArticle | null;
  next: BlogArticle | null;
  /** "— Tüm ... yazıları" bağlantısının metni. */
  backLabel: string;
}

/** Yazı sayfasının altındaki önceki / sonraki + kapak sayfasına dönüş. */
export default function ArticleNav({ basePath, prev, next, backLabel }: Props) {
  return (
    <section className="container">
      <div className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        {prev ? (
          <Link
            href={`${basePath}/${prev.slug}`}
            className="group block border border-border rounded-lg p-6 hover:border-coral transition-colors duration-200"
          >
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted">
              ← Önceki yazı
            </span>
            <span className="mt-3 block font-serif font-bold text-[20px] leading-snug text-navy group-hover:text-coral transition-colors duration-200">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}

        {next && (
          <Link
            href={`${basePath}/${next.slug}`}
            className="group block border border-border rounded-lg p-6 md:text-right hover:border-coral transition-colors duration-200"
          >
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted">
              Sonraki yazı →
            </span>
            <span className="mt-3 block font-serif font-bold text-[20px] leading-snug text-navy group-hover:text-coral transition-colors duration-200">
              {next.title}
            </span>
          </Link>
        )}
      </div>

      <div className="pb-16">
        <Link
          href={basePath}
          className="font-mono text-[10px] tracking-[0.2em] uppercase text-navy hover:text-coral transition-colors"
        >
          — {backLabel}
        </Link>
      </div>
    </section>
  );
}
