import type { Metadata } from 'next';
import Image from 'next/image';
import { getAllCountriesForBlog } from '@/lib/data/countries';

export const metadata: Metadata = {
  title: 'Blog — Vize Makinesi',
  description: 'Vize süreçleri, seyahat tavsiyeleri ve göç hukuku hakkında güncel yazılar.',
};

export default async function BlogPage() {
  const allCountries = await getAllCountriesForBlog();
  const countries = allCountries.filter((c) => c.slug !== 'schengen');

  return (
    <>
      {/* Hero */}
      <section className="pt-24 pb-[72px] border-b border-border">
        <div className="container">
          <div className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase mb-6">
            — Ofis yazıları
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-16 items-end">
            <div>
              <h1 className="font-serif font-bold text-[clamp(56px,6vw,96px)] leading-none tracking-[-0.02em]">
                Hangi ülkede<br />
                <em className="font-normal italic text-coral">ne yapılır?</em>
              </h1>
            </div>
            <div className="pb-2">
              <p className="font-serif text-[20px] text-navy leading-[1.55] border-l border-coral pl-6">
                Ülkeye göre değişen vize süreçleri, kritik belgeler ve dikkat edilmesi gereken farklılıklar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Country blog posts grid */}
      <section className="container pb-24">
        {countries.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-serif italic text-[22px] text-navy/40">Henüz blog yazısı yok.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px border border-border">
            {countries.map((country) => {
              const slug = `/blog/${country.slug}`;
              const excerpt = (country.tourism_intro ?? [])[0] ?? '';
              return (
                <article
                  key={country.slug}
                  className="flex flex-col border-border hover:bg-[hsl(var(--color-navy)/0.03)] transition-colors duration-150 group"
                >
                  {country.tourism_hero_image_url && (
                    <a href={slug} className="block overflow-hidden">
                      <div className="relative w-full aspect-video">
                        <Image
                          src={country.tourism_hero_image_url}
                          alt={country.name}
                          fill
                          className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    </a>
                  )}
                  <div className="p-10 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-6">
                      {country.flag_emoji && <span className="text-[22px] leading-none">{country.flag_emoji}</span>}
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-coral">
                        {country.name}
                      </span>
                      <span className="font-mono text-[10px] text-muted">·</span>
                      <span className="font-mono text-[10px] text-muted">Gezi Rehberi</span>
                    </div>
                    <h2 className="font-serif font-bold text-[clamp(20px,2vw,26px)] leading-snug tracking-[-0.015em] mb-4 group-hover:text-coral transition-colors duration-150">
                      <a href={slug}>{country.name} Gezi Rehberi</a>
                    </h2>
                    {excerpt && <p className="text-[15px] leading-[1.75] text-muted">{excerpt}</p>}
                    <a href={slug} className="mt-8 block font-mono text-[11px] uppercase tracking-[0.14em] text-coral">
                      Devamını oku →
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
