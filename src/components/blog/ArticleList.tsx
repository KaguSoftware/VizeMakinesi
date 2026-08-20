import Link from 'next/link';
import { articleMinutes, articleSummary, type BlogArticle } from '@/lib/blog/articles';

interface Props {
  /** Yazıların yayınlandığı kök yol, örn. /blog/almanya */
  basePath: string;
  articles: BlogArticle[];
  /** Bölümün üstündeki etiket. */
  eyebrow?: string;
}

/**
 * Kapak sayfasındaki makale listesi. Schengen rehberi ile ülke bloglarının
 * ortak bileşeni — iki tarafta da aynı tasarım.
 */
export default function ArticleList({ basePath, articles, eyebrow = 'Makaleler' }: Props) {
  if (articles.length === 0) return null;

  return (
    <section className="container">
      <div className="py-16 md:py-20">
        <div className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase mb-10">
          — {eyebrow}
        </div>

        {articles.map((article, i) => {
          const summary = articleSummary(article);
          return (
            <Link
              key={article.slug}
              href={`${basePath}/${article.slug}`}
              className="group block border-t border-border last:border-b py-8 -mx-2 px-2 rounded transition-colors duration-200 hover:bg-coral/[0.03]"
            >
              <div className="grid grid-cols-[46px_1fr] md:grid-cols-[46px_1fr_auto] gap-4 md:gap-8 items-start">
                <span className="font-mono font-medium text-[11px] tracking-[0.18em] text-coral uppercase pt-2">
                  — {String(i + 1).padStart(2, '0')}
                </span>

                <div className="min-w-0">
                  <h2 className="font-serif font-bold text-coral text-[clamp(22px,2.6vw,34px)] leading-[1.12] tracking-[-0.02em] group-hover:text-navy transition-colors duration-200">
                    {article.title}
                  </h2>
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] tracking-[0.2em] uppercase text-muted">
                    {article.kicker && (
                      <>
                        <span>{article.kicker}</span>
                        <span aria-hidden className="text-border">/</span>
                      </>
                    )}
                    <span>{articleMinutes(article)} dk okuma</span>
                    <span aria-hidden className="text-border">/</span>
                    <span>{article.subsections.length} başlık</span>
                  </div>
                  {summary && (
                    <p className="mt-5 max-w-[680px] text-[16px] leading-[1.8] text-navy">
                      {summary}
                    </p>
                  )}
                </div>

                <span className="hidden md:block font-mono text-[10px] tracking-[0.2em] uppercase text-navy group-hover:text-coral transition-colors duration-200 pt-2 whitespace-nowrap">
                  Yazıyı oku →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
