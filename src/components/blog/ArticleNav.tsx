import Link from 'next/link';
import type { BlogArticle } from '@/lib/blog/articles';

interface Props {
  prev: BlogArticle | null;
  next: BlogArticle | null;
  /** Geri bağlantısının metni. */
  backLabel?: string;
}

/**
 * Makale sayfasının altındaki önceki / sonraki bağlantıları ve akışa dönüş.
 * Kapak sayfaları kaldırıldığı için geri bağlantısı doğrudan /blog'a gider.
 */
export default function ArticleNav({ prev, next, backLabel = 'Tüm makaleler' }: Props) {
  return (
    <section className="container">
      <div className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        {prev ? (
          <Link
            href={`/blog/${prev.slug}`}
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
            href={`/blog/${next.slug}`}
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
          href="/blog"
          className="font-mono text-[10px] tracking-[0.2em] uppercase text-navy hover:text-coral transition-colors"
        >
          — {backLabel}
        </Link>
      </div>
    </section>
  );
}
