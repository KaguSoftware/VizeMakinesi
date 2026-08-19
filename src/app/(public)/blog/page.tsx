import type { Metadata } from 'next';
import Link from 'next/link';
import BlogStreamItem from '@/components/blog/BlogStreamItem';
import { SCHENGEN_GUIDE } from '@/data/schengenGuide';

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
  return (
    <>
      {/* 01 — Schengen rehberi: akışın en başındaki sabit yazı */}
      <BlogStreamItem
        slug={SCHENGEN_GUIDE.slug}
        href={SCHENGEN_GUIDE.href}
        name={SCHENGEN_GUIDE.name}
        titleSuffix={SCHENGEN_GUIDE.titleSuffix}
        kicker={SCHENGEN_GUIDE.kicker}
        flagEmoji={SCHENGEN_GUIDE.flagEmoji}
        imageUrl={null}
        excerpt={SCHENGEN_GUIDE.excerpt}
        index={1}
        priority
      />

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
