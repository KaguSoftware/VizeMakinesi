import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllCountriesForBlog } from '@/lib/data/countries';
import BlogStreamItem from '@/components/blog/BlogStreamItem';
import { INTERLUDES } from '@/components/blog/interludes';

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
  const allCountries = await getAllCountriesForBlog();
  const countries = allCountries.filter((c) => c.slug !== 'schengen');

  return (
    <>
      {/* Hero — tam ekran genişliği, alçak profil */}
      <section className="pt-14 pb-10 border-b border-border">
        <div className="w-full px-5.5 md:px-12">
          <div className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase mb-5">
            — Ofis yazıları
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-8 lg:gap-16 items-end">
            <div>
              <h1 className="font-serif font-bold text-[clamp(38px,4.4vw,64px)] leading-[0.98] tracking-[-0.025em]">
                Hangi ülkede{' '}
                <em className="font-normal italic text-coral">ne yapılır?</em>
              </h1>
            </div>
            <div className="pb-1">
              <p className="font-serif text-[17px] text-navy leading-[1.55] border-l border-coral pl-6">
                Nereye, ne zaman gidilir; hangi şehirde ne görülür? Ülke ülke gezi notları ve yerinde öğrenilen tavsiyeler.
              </p>
            </div>
          </div>
        </div>
      </section>

      {countries.length === 0 ? (
        <section className="container">
          <div className="py-40 text-center">
            <p className="font-serif italic text-[22px] text-navy/40">Henüz blog yazısı yok.</p>
          </div>
        </section>
      ) : (
        <>
          {/* Tek kolon akış — aralara infografik/görsel blokları giriyor */}
          {countries.map((country, i) => {
            const position = i + 1;
            const interlude = INTERLUDES.find((item) => item.after === position);
            return (
              <div key={country.slug}>
                <BlogStreamItem
                  slug={country.slug}
                  name={country.name}
                  flagEmoji={country.flag_emoji}
                  imageUrl={country.tourism_hero_image_url}
                  excerpt={(country.tourism_intro ?? [])[0] ?? ''}
                  index={position}
                  reverse={position % 2 === 0}
                  priority={position === 1}
                />
                {interlude?.node}
              </div>
            );
          })}

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
      )}
    </>
  );
}
