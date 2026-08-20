import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleList, { type ArticleRow } from '@/components/blog/ArticleList';
import { getBlogArticleEntries } from '@/lib/data/blogArticles';
import { articleMinutes } from '@/lib/blog/articles';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Blog — Vize Makinesi',
  description: 'Vize süreçleri, seyahat tavsiyeleri ve göç hukuku hakkında güncel yazılar.',
  alternates: {
    canonical: 'https://vizemakinesi.com/blog',
  },
  openGraph: {
    title: 'Blog — Vize Makinesi',
    description: 'Vize süreçleri, seyahat tavsiyeleri ve göç hukuku hakkında güncel yazılar.',
    url: 'https://vizemakinesi.com/blog',
    siteName: 'Vize Makinesi',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog — Vize Makinesi',
    description: 'Vize süreçleri, seyahat tavsiyeleri ve göç hukuku hakkında güncel yazılar.',
  },
};

export default async function BlogPage() {
  // Kapak sayfası yok: bütün blogların makaleleri /blog altında tek akışta
  // listelenir ve her makale doğrudan /blog/<slug> adresinde açılır.
  const entries = await getBlogArticleEntries();

  const rows: ArticleRow[] = entries.map(({ article, source }) => ({
    href: `/blog/${article.slug}`,
    title: article.title,
    kicker: article.kicker,
    minutes: articleMinutes(article),
    headingCount: article.subsections.length,
    source: source.name,
    sourceEmoji: source.emoji,
  }));

  return (
    <>
      <section className="container">
        <div className="pt-14 pb-10 md:pt-16 md:pb-12">
          <div className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase mb-6">
            — Makaleler ({rows.length})
          </div>
          <h1 className="font-serif font-bold text-[clamp(25px,4vw,62px)] leading-[0.94] tracking-[-0.035em]">
            Vize <em className="font-normal italic text-coral">makaleleri</em>
          </h1>
        </div>

        <ArticleList rows={rows} />
      </section>

      {/* CTA */}
      <section className="cta-block bg-navy text-white">
        <div className="container">
          <div className="py-24 md:py-30 relative z-10">
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-coral mb-12 pb-4 border-b border-white/30">
              — Sıra sizde
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-12 lg:gap-20 items-end">
              <h2 className="font-serif font-bold text-[clamp(40px,6vw,88px)] leading-[0.96] tracking-[-0.035em] text-white">
                Gitmek istediğiniz ülkeyi seçin,{' '}
                <em className="text-coral font-normal italic">vizeyi bize bırakın.</em>
              </h2>
              <div>
                <Link
                  href="/danisma-al"
                  className="block w-full text-center font-sans font-medium text-[13px] uppercase tracking-widest px-8 py-5.5 bg-cream border border-cream text-coral hover:bg-navy hover:text-cream hover:border-cream transition-all duration-200 rounded-2xl"
                >
                  Ücretsiz danışma al →
                </Link>
                <Link
                  href="/vizeler"
                  className="block w-full text-center font-sans font-medium text-[13px] uppercase tracking-widest px-8 py-5.5 mt-3 border border-white/40 text-white hover:bg-cream hover:text-coral hover:border-cream transition-all duration-200 rounded-2xl"
                >
                  Tüm vize ülkeleri
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
