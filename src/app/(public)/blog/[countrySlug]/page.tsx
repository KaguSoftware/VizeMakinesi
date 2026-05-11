import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCountryBySlug, getCountrySlugsStatic as getTourismSlugsStatic } from '@/lib/data/countries';
import FlagBG from '@/components/shared/FlagBG/FlagBG';
import ChecklistList from '@/components/shared/ChecklistList/ChecklistList';
import NumberedList from '@/components/shared/NumberedList/NumberedList';

interface Props {
  params: Promise<{ countrySlug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getTourismSlugsStatic();
  return slugs.map((slug: string) => ({ countrySlug: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { countrySlug } = await params;
  const country = await getCountryBySlug(countrySlug);
  if (!country) return {};
  return {
    title: `${country.name} Gezi Rehberi — Vize Makinesi Blog`,
    description: (country.tourism_intro ?? [])[0] ?? '',
  };
}

export default async function CountryBlogPage({ params }: Props) {
  const { countrySlug } = await params;
  const country = await getCountryBySlug(countrySlug);
  if (!country) notFound();

  const intro = country.tourism_intro ?? [];
  const highlights = country.tourism_highlights ?? [];
  const tips = country.tourism_tips ?? [];
  const bestTime = country.tourism_best_time;

  const first = country.name.split(' ')[0];
  const rest = country.name.split(' ').slice(1).join(' ');

  return (
    <>
      {/* Hero */}
      <section className="pt-16 pb-14 border-b border-border relative overflow-hidden">
        <div className="absolute right-[-8%] top-1/2 -translate-y-1/2 w-[60%] h-[110%] opacity-[0.12] pointer-events-none">
          <FlagBG presetKey={country.flag_preset_key} imageUrl={country.flag_image_url} className="w-full h-full" />
        </div>

        <div className="container relative z-10">
          <div className="font-mono text-[11px] tracking-[0.15em] text-muted uppercase mb-10">
            —{' '}
            <Link href="/blog" className="hover:text-coral transition-colors">
              Blog
            </Link>
            &nbsp;/&nbsp;Ülke Rehberi&nbsp;/&nbsp;{country.name}
          </div>

          {country.tourism_hero_image_url && (
            <div className="relative w-full max-h-[280px] md:max-h-[480px] overflow-hidden mb-10">
              <Image
                src={country.tourism_hero_image_url}
                alt={country.name}
                width={1360}
                height={480}
                className="w-full h-[280px] md:h-[480px] object-cover"
                priority
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[8fr_4fr] gap-[60px] items-end">
            <div>
              <div className="text-[80px] leading-none mb-7">{country.flag_emoji}</div>
              <div className="inline-block border border-navy px-4 py-2 font-mono font-medium text-[10px] uppercase tracking-[0.15em] mb-7">
                — Turistik rehber
              </div>
              <h1 className="font-serif font-bold text-[clamp(60px,9vw,144px)] leading-[0.92] tracking-[-0.04em]">
                {first}
                {rest && <em className="font-normal italic text-coral"> {rest}</em>}
              </h1>
            </div>
            <div>
              <p className="font-serif italic text-[20px] leading-relaxed text-navy">
                {intro[0]}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Body intro */}
      <section className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-20 py-20 border-b border-border">
          <div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase mb-6">
              — 01 / Genel bakış
            </div>
            <h2 className="font-serif font-bold text-[clamp(36px,4.5vw,56px)] leading-none tracking-tight">
              {country.name}<br />kısaca.
            </h2>
            {bestTime && (
              <p className="font-serif italic text-[18px] text-navy mt-6 max-w-90 leading-relaxed">
                <span className="font-mono not-italic text-[10px] tracking-[0.2em] uppercase text-coral block mb-2">
                  — En iyi zaman
                </span>
                {bestTime}
              </p>
            )}
          </div>
          <div className="space-y-6 text-[16px] leading-[1.85] text-navy">
            {intro.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-20 py-20 border-b border-border">
          <div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase mb-6">
              — 02 / Görülmesi gerekenler
            </div>
            <h2 className="font-serif font-bold text-[clamp(36px,4.5vw,56px)] leading-none tracking-tight">
              Kaçırmamanız<br />gereken yerler.
            </h2>
            <p className="font-serif italic text-[18px] text-navy mt-6 max-w-90 leading-relaxed">
              İlk ziyaretinizi planlarken yola çıkış noktası olarak iyi bir liste.
            </p>
          </div>
          <ChecklistList items={highlights} />
        </div>
      </section>

      {/* Tips */}
      <section className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-20 py-20 border-b border-border">
          <div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase mb-6">
              — 03 / Pratik tavsiyeler
            </div>
            <h2 className="font-serif font-bold text-[clamp(36px,4.5vw,56px)] leading-none tracking-tight">
              Yerinde<br />öğrenilenler.
            </h2>
            <p className="font-serif italic text-[18px] text-navy mt-6 max-w-90 leading-relaxed">
              Küçük detaylar — ama seyahatin akışını belirgin biçimde değiştirenler.
            </p>
          </div>
          <NumberedList items={tips} />
        </div>
      </section>

      {/* CTA to visa page */}
      <section className="cta-block mt-30 bg-navy text-white">
        <div className="container">
          <div className="py-30 relative z-10">
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-coral mb-12 pb-4 border-b border-white/30">
              — Bu ülkeye gitmeye hazır mısınız?
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-20 items-end">
              <h2 className="font-serif font-bold text-[clamp(48px,6vw,96px)] leading-[0.96] tracking-[-0.035em] text-white">
                {country.name}{' '}
                <em className="text-coral font-normal italic">vize sürecini</em><br />
                bizimle tamamlayın.
              </h2>
              <div>
                <Link
                  href={`/vize/${country.slug}`}
                  className="block w-full text-center font-sans font-medium text-[13px] uppercase tracking-widest px-8 py-5.5 bg-cream border border-cream text-coral hover:bg-navy hover:text-cream hover:border-cream transition-all duration-200 rounded-2xl"
                >
                  {country.name} vize rehberini incele →
                </Link>
                <Link
                  href="/blog"
                  className="block w-full text-center font-sans font-medium text-[13px] uppercase tracking-widest px-8 py-5.5 mt-3 border border-white/40 text-white hover:bg-cream hover:text-coral hover:border-cream transition-all duration-200 rounded-2xl"
                >
                  Diğer ülke rehberleri
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
