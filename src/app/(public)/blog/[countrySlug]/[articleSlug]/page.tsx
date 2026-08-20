import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCountryBlogArticle, getCountryBlogParamsStatic } from '@/lib/data/countryBlog';
import { articleMinutes, articleSummary } from '@/lib/blog/articles';
import ArticleBody from '@/components/blog/ArticleBody';
import ArticleNav from '@/components/blog/ArticleNav';
import FlagBG from '@/components/shared/FlagBG/FlagBG';
import { countryHref } from '@/lib/routes';

export const revalidate = 3600;

const SITE = 'https://vizemakinesi.com';

interface Props {
  params: Promise<{ countrySlug: string; articleSlug: string }>;
}

/**
 * Makale sayısı admin panelinden değiştiği için yollar içerikten okunur.
 * Sonradan eklenen bir makale ilk istekte üretilir (ISR), bilinmeyen bir slug
 * 404 döner.
 */
export async function generateStaticParams() {
  return getCountryBlogParamsStatic();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { countrySlug, articleSlug } = await params;
  const found = await getCountryBlogArticle(countrySlug, articleSlug);
  if (!found) return {};

  const { country, article } = found;
  const title = `${article.title} — ${country.name} | Vize Makinesi`;
  const description = articleSummary(article).slice(0, 160);
  const url = `${SITE}/blog/${country.slug}/${article.slug}`;
  const image = country.heroImageUrl;

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

export default async function CountryBlogArticlePage({ params }: Props) {
  const { countrySlug, articleSlug } = await params;
  const found = await getCountryBlogArticle(countrySlug, articleSlug);
  if (!found) notFound();

  const { country, article, index } = found;
  const basePath = `/blog/${country.slug}`;
  const minutes = articleMinutes(article);
  const prev = index > 0 ? country.articles[index - 1] : null;
  const next = index < country.articles.length - 1 ? country.articles[index + 1] : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: articleSummary(article).slice(0, 160),
    url: `${SITE}${basePath}/${article.slug}`,
    inLanguage: 'tr',
    isPartOf: { '@type': 'CollectionPage', url: `${SITE}${basePath}` },
    publisher: {
      '@type': 'Organization',
      name: 'Vize Makinesi',
      url: SITE,
    },
    ...(country.heroImageUrl ? { image: country.heroImageUrl } : {}),
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
            presetKey={country.flagPresetKey}
            imageUrl={country.flagImageUrl}
            className="w-full h-full"
          />
        </div>

        <div className="container relative z-10">
          <div className="font-mono text-[11px] tracking-[0.15em] text-muted uppercase mb-10">
            —{' '}
            <Link href="/blog" className="hover:text-coral transition-colors">
              Blog
            </Link>
            &nbsp;/&nbsp;
            <Link href={basePath} className="hover:text-coral transition-colors">
              {country.name}
            </Link>
            &nbsp;/&nbsp;{String(index + 1).padStart(2, '0')}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[8fr_4fr] gap-[60px] items-end">
            <div>
              <div className="inline-block border border-navy px-4 py-2 font-mono font-medium text-[10px] uppercase tracking-[0.15em] mb-7">
                — {article.kicker || `${country.name} rehberi`}
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

      <ArticleNav
        basePath={basePath}
        prev={prev}
        next={next}
        backLabel={`Tüm ${country.name} yazıları`}
      />

      {/* CTA */}
      <section className="cta-block bg-navy text-white">
        <div className="container">
          <div className="py-24 md:py-30 relative z-10">
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-coral mb-12 pb-4 border-b border-white/30">
              — Bu ülkeye gitmeye hazır mısınız?
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-12 lg:gap-20 items-end">
              <h2 className="font-serif font-bold text-[clamp(40px,6vw,88px)] leading-[0.96] tracking-[-0.035em] text-white">
                {country.name}{' '}
                <em className="text-coral font-normal italic">vize sürecini</em>
                <br />
                bizimle tamamlayın.
              </h2>
              <div>
                <Link
                  href={countryHref(country.slug)}
                  className="block w-full text-center font-sans font-medium text-[13px] uppercase tracking-widest px-8 py-5.5 bg-cream border border-cream text-coral hover:bg-navy hover:text-cream hover:border-cream transition-all duration-200 rounded-2xl"
                >
                  {country.name} vizesini incele →
                </Link>
                <Link
                  href={basePath}
                  className="block w-full text-center font-sans font-medium text-[13px] uppercase tracking-widest px-8 py-5.5 mt-3 border border-white/40 text-white hover:bg-cream hover:text-coral hover:border-cream transition-all duration-200 rounded-2xl"
                >
                  {country.name} rehberi
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
