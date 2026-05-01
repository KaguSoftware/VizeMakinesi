import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { COUNTRIES_DATA, COUNTRY_SLUGS } from '@/data/countries';
import CountryHero from '@/components/CountryHero/CountryHero';
import ChecklistList from '@/components/ChecklistList/ChecklistList';
import NumberedList from '@/components/NumberedList/NumberedList';
import FAQ from '@/components/FAQ/FAQ';
import { SITE } from '@/data/site';

interface Props {
  params: Promise<{ countrySlug: string }>;
}

export async function generateStaticParams() {
  return COUNTRY_SLUGS.map((slug) => ({ countrySlug: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { countrySlug } = await params;
  const country = COUNTRIES_DATA.find((c) => c.slug === countrySlug);
  if (!country) return {};
  return {
    title: `${country.name} Vizesi — Vize Makinesi`,
    description: country.summary,
  };
}

export default async function CountryPage({ params }: Props) {
  const { countrySlug } = await params;
  const country = COUNTRIES_DATA.find((c) => c.slug === countrySlug);
  if (!country) notFound();

  const waText = encodeURIComponent(`Merhaba, ${country.name} vizesi için başvurmak istiyorum.`);

  return (
    <>
      <CountryHero country={country} />

      {/* Gerekli belgeler */}
      <section className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-20 py-20 border-b border-border">
          <div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase mb-6">
              — 01 / Gerekli belgeler
            </div>
            <h2 className="font-serif font-bold text-[clamp(36px,4.5vw,56px)] leading-none tracking-[-0.025em]">
              Masaya<br />getirdikleriniz.
            </h2>
            <p className="font-serif italic text-[18px] text-navy mt-6 max-w-[360px] leading-relaxed">
              Eksiksiz bir dosya, vize kararının en önemli belirleyicisidir. Sizinkini satır satır inceliyoruz.
            </p>
          </div>
          <ChecklistList items={country.requirements} />
        </div>
      </section>

      {/* Ofisimizin üstlendiği */}
      <section className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-20 py-20 border-b border-border">
          <div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase mb-6">
              — 02 / Ofisimizin üstlendiği
            </div>
            <h2 className="font-serif font-bold text-[clamp(36px,4.5vw,56px)] leading-none tracking-[-0.025em]">
              Sizin yerinize<br />hallettiklerimiz.
            </h2>
            <p className="font-serif italic text-[18px] text-navy mt-6 max-w-[360px] leading-relaxed">
              Randevu rezervasyonundan pasaportunuzu kapınıza teslim etmeye kadar.
            </p>
          </div>
          <NumberedList items={country.handles} />
        </div>
      </section>

      <FAQ
        items={country.faqs}
        title={
          <>
            {country.name} —{' '}
            <em className="font-normal italic text-coral">sık sorulan sorular.</em>
          </>
        }
      />

      {/* Ülkeye özel CTA */}
      <section className="cta-block mt-[120px] bg-navy text-white">
        <div className="container">
          <div className="py-[120px] relative z-10">
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-coral mb-12 pb-4 border-b border-white/30">
              — Daha fazla bilgi alın
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-20 items-end">
              <h2 className="font-serif font-bold text-[clamp(48px,6vw,96px)] leading-[0.96] tracking-[-0.035em] text-white">
                {country.name}{' '}
                <em className="text-coral font-normal italic">başvurunuzu</em><br />
                başlatmaya hazır mısınız?
              </h2>
              <div>
                <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/65 mb-4">
                  — Hemen arayın
                </div>
                <a
                  href={SITE.phoneHref}
                  className="block font-serif font-bold text-[48px] tracking-[-0.025em] text-white mb-9 hover:text-coral transition-colors duration-200 leading-none"
                >
                  {SITE.phone}
                </a>
                <div className="flex flex-col gap-3 items-start">
                  <a
                    href={`${SITE.whatsappHref}?text=${waText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center font-sans font-medium text-[13px] uppercase tracking-[0.1em] px-8 py-[22px] bg-coral border border-coral text-navy hover:bg-transparent hover:text-coral transition-all duration-200 rounded-2xl"
                  >
                    {country.name} için WhatsApp →
                  </a>
                  <a
                    href={SITE.phoneHref}
                    className="inline-flex items-center font-sans font-medium text-[13px] uppercase tracking-[0.1em] px-8 py-[22px] border border-white/55 text-white hover:bg-coral hover:text-navy hover:border-coral transition-all duration-200 rounded-2xl"
                  >
                    Ara: {SITE.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
