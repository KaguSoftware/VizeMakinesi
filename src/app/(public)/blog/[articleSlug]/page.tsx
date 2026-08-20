import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBlogArticle, getBlogArticleSlugs } from '@/lib/data/blogArticles';
import { articleMinutes, articleSummary } from '@/lib/blog/articles';
import ArticleBody from '@/components/blog/ArticleBody';
import ArticleNav from '@/components/blog/ArticleNav';
import FlagBG from '@/components/shared/FlagBG/FlagBG';
import { countryHref } from '@/lib/routes';

export const revalidate = 3600;

const SITE = 'https://vizemakinesi.com';

interface Props {
  params: Promise<{ articleSlug: string }>;
}

/**
 * Makale sayısı admin panelinden değiştiği için yollar içerikten okunur.
 * Sonradan eklenen bir makale ilk istekte üretilir (ISR), bilinmeyen bir slug
 * 404 döner.
 */
export async function generateStaticParams() {
  const slugs = await getBlogArticleSlugs();
  return slugs.map((articleSlug) => ({ articleSlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { articleSlug } = await params;
  const found = await getBlogArticle(articleSlug);
  if (!found) return {};

  const { article, source } = found;
  const title = `${article.title} — Vize Makinesi`;
  const description = articleSummary(article).slice(0, 160);
  const url = `${SITE}/blog/${article.slug}`;
  const image = source.imageUrl;

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
      ...(image ? { images: [{ url: image, width: 1360, height: 480, alt: article.title }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { articleSlug } = await params;
  const found = await getBlogArticle(articleSlug);
  if (!found) notFound();

  const { article, source, index, prev, next } = found;
  const minutes = articleMinutes(article);
  // Schengen rehberi bir ülke kaydı değil; ülke vize sayfası bağlantısı
  // yalnızca ülke bloglarında gösterilir.
  const countryLink = source.key === 'schengen' ? null : countryHref(source.key);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: articleSummary(article).slice(0, 160),
    url: `${SITE}/blog/${article.slug}`,
    inLanguage: 'tr',
    isPartOf: { '@type': 'Blog', url: `${SITE}/blog` },
    publisher: {
      '@type': 'Organization',
      name: 'Vize Makinesi',
      url: SITE,
    },
    ...(source.imageUrl ? { image: source.imageUrl } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="pt-16 pb-14 border-b border-border relative overflow-hidden">
        <div className="absolute right-[-8%] top-1/2 -translate-y-1/2 w-[60%] h-[110%] opacity-[0.12] pointer-events-none">
          <FlagBG
            presetKey={source.flagPresetKey}
            imageUrl={source.flagImageUrl}
            className="w-full h-full"
          />
        </div>

        <div className="container relative z-10">
          <div className="font-mono text-[11px] tracking-[0.15em] text-muted uppercase mb-10">
            —{' '}
            <Link href="/blog" className="hover:text-coral transition-colors">
              Blog
            </Link>
            &nbsp;/&nbsp;{source.name}&nbsp;/&nbsp;{String(index + 1).padStart(2, '0')}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[8fr_4fr] gap-[60px] items-end">
            <div>
              <div className="inline-block border border-navy px-4 py-2 font-mono font-medium text-[10px] uppercase tracking-[0.15em] mb-7">
                — {article.kicker || source.name}
              </div>
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

      <ArticleNav prev={prev} next={next} />

      {/* CTA */}
      <section className="cta-block bg-navy text-white">
        <div className="container">
          <div className="py-24 md:py-30 relative z-10">
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-coral mb-12 pb-4 border-b border-white/30">
              — Sıra sizde
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-12 lg:gap-20 items-end">
              <h2 className="font-serif font-bold text-[clamp(40px,6vw,88px)] leading-[0.96] tracking-[-0.035em] text-white">
                {countryLink ? (
                  <>
                    {source.name} <em className="text-coral font-normal italic">vize sürecini</em>
                    <br />
                    bizimle tamamlayın.
                  </>
                ) : (
                  <>
                    Size hangi belgelerin gerektiğini{' '}
                    <em className="text-coral font-normal italic">birlikte belirleyelim.</em>
                  </>
                )}
              </h2>
              <div>
                <Link
                  href={countryLink ?? '/danisma-al'}
                  className="block w-full text-center font-sans font-medium text-[13px] uppercase tracking-widest px-8 py-5.5 bg-cream border border-cream text-coral hover:bg-navy hover:text-cream hover:border-cream transition-all duration-200 rounded-2xl"
                >
                  {countryLink ? `${source.name} vizesini incele →` : 'Ücretsiz danışma al →'}
                </Link>
                <Link
                  href="/blog"
                  className="block w-full text-center font-sans font-medium text-[13px] uppercase tracking-widest px-8 py-5.5 mt-3 border border-white/40 text-white hover:bg-cream hover:text-coral hover:border-cream transition-all duration-200 rounded-2xl"
                >
                  Diğer makaleler
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
