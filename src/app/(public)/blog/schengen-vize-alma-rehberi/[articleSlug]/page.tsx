import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SCHENGEN_GUIDE } from '@/data/schengenGuide';
import { getBlogSchengenArticle, getBlogSchengenPage } from '@/lib/data/blogSchengenPage';
import { articleMinutes, articleSummary } from '@/lib/blog/articles';
import ArticleBody from '@/components/blog/ArticleBody';
import ArticleNav from '@/components/blog/ArticleNav';

export const revalidate = 3600;

const BASE = SCHENGEN_GUIDE.href;
const SITE = 'https://vizemakinesi.com';

interface Props {
  params: Promise<{ articleSlug: string }>;
}

/**
 * Yazı sayısı admin panelinden değiştiğinde yeni yollar da üretilsin diye
 * slug'lar içerik tablosundan okunur. Bilinmeyen bir slug 404 döner.
 */
export async function generateStaticParams() {
  const content = await getBlogSchengenPage();
  return content.articles.map((article) => ({ articleSlug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { articleSlug } = await params;
  const found = await getBlogSchengenArticle(articleSlug);
  if (!found) return {};

  const { article } = found;
  const title = `${article.title} — Vize Makinesi`;
  const description = articleSummary(article);
  const url = `${SITE}${BASE}/${article.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Vize Makinesi',
      locale: 'tr_TR',
      type: 'article',
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function SchengenArticlePage({ params }: Props) {
  const { articleSlug } = await params;
  const found = await getBlogSchengenArticle(articleSlug);
  if (!found) notFound();

  const { article, index, all } = found;
  const minutes = articleMinutes(article);
  const prev = index > 0 ? all[index - 1] : null;
  const next = index < all.length - 1 ? all[index + 1] : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: articleSummary(article),
    url: `${SITE}${BASE}/${article.slug}`,
    inLanguage: 'tr',
    isPartOf: { '@type': 'CollectionPage', url: `${SITE}${BASE}` },
    publisher: {
      '@type': 'Organization',
      name: 'Vize Makinesi',
      url: SITE,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="pt-16 pb-14 border-b border-border">
        <div className="container">
          <div className="font-mono text-[11px] tracking-[0.15em] text-muted uppercase mb-10">
            —{' '}
            <Link href="/blog" className="hover:text-coral transition-colors">
              Blog
            </Link>
            &nbsp;/&nbsp;
            <Link href={BASE} className="hover:text-coral transition-colors">
              Schengen Rehberi
            </Link>
            &nbsp;/&nbsp;{String(index + 1).padStart(2, '0')}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[8fr_4fr] gap-[60px] items-end">
            <div>
              {article.kicker && (
                <div className="inline-block border border-navy px-4 py-2 font-mono font-medium text-[10px] uppercase tracking-[0.15em] mb-7">
                  — {article.kicker}
                </div>
              )}
              <h1 className="font-serif font-bold text-[clamp(30px,4.4vw,68px)] leading-[0.98] tracking-[-0.03em]">
                {article.title}
              </h1>
            </div>
            <div>
              {article.excerpt && (
                <p className="font-serif italic text-[20px] leading-relaxed text-navy">
                  {article.excerpt}
                </p>
              )}
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-border flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] tracking-[0.2em] uppercase text-muted">
            <span>~{minutes} dk okuma</span>
            <span aria-hidden className="text-border">/</span>
            <span>{article.subsections.length} başlık</span>
          </div>
        </div>
      </section>

      <ArticleBody article={article} />

      <ArticleNav basePath={BASE} prev={prev} next={next} backLabel="Tüm Schengen yazıları" />

      {/* CTA */}
      <section className="cta-block bg-navy text-white">
        <div className="container">
          <div className="py-24 md:py-30 relative z-10">
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-coral mb-12 pb-4 border-b border-white/30">
              — Sıra sizde
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-12 lg:gap-20 items-end">
              <h2 className="font-serif font-bold text-[clamp(40px,6vw,88px)] leading-[0.96] tracking-[-0.035em] text-white">
                Size hangi belgelerin gerektiğini{' '}
                <em className="text-coral font-normal italic">birlikte belirleyelim.</em>
              </h2>
              <div>
                <Link
                  href="/danisma-al"
                  className="block w-full text-center font-sans font-medium text-[13px] uppercase tracking-widest px-8 py-5.5 bg-cream border border-cream text-coral hover:bg-navy hover:text-cream hover:border-cream transition-all duration-200 rounded-2xl"
                >
                  Ücretsiz danışma al →
                </Link>
                <Link
                  href={BASE}
                  className="block w-full text-center font-sans font-medium text-[13px] uppercase tracking-widest px-8 py-5.5 mt-3 border border-white/40 text-white hover:bg-cream hover:text-coral hover:border-cream transition-all duration-200 rounded-2xl"
                >
                  Schengen rehberi
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
