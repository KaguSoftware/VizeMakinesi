import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCountryBySlug, getCountrySlugsStatic } from '@/lib/data/countries';
import CountryHero from '@/components/visa/CountryHero/CountryHero';
import GenelBilgi from '@/components/visa/GenelBilgi/GenelBilgi';
import FAQ from '@/components/shared/FAQ/FAQ';
import SchengenStubHero from '@/components/visa/SchengenStubHero/SchengenStubHero';
import SchengenCountryGrid from '@/components/visa/SchengenCountryGrid/SchengenCountryGrid';
import WarningList from '@/components/schengen/WarningList/WarningList';
import BasvuruSureci from '@/components/visa/BasvuruSureci/BasvuruSureci';
import GerekliEvraklar from '@/components/visa/GerekliEvraklar/GerekliEvraklar';
import CountryCTA from '@/components/visa/CountryCTA/CountryCTA';
import { SCHENGEN_SLUG_MAP } from '@/data/schengen';
import { SCHENGEN_REJECTION_REASONS } from '@/components/schengen/SchengenMembers/constants';
import { FadeIn } from '@/components/shared/motion';

export const revalidate = 60;

interface Props {
  params: Promise<{ countrySlug: string }>;
}

export async function generateStaticParams() {
  const dbSlugs = await getCountrySlugsStatic();
  const dbSet = new Set(dbSlugs);
  const schengenSlugs = [...SCHENGEN_SLUG_MAP.keys()].filter((s) => !dbSet.has(s));
  return [...dbSlugs, ...schengenSlugs].map((slug) => ({ countrySlug: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { countrySlug } = await params;
  const country = await getCountryBySlug(countrySlug);
  if (country) {
    return {
      title: `${country.name} Vizesi — Vize Makinesi`,
      description: country.summary,
    };
  }
  const stub = SCHENGEN_SLUG_MAP.get(countrySlug);
  if (stub) {
    return {
      title: `${stub.name} Vizesi — Vize Makinesi`,
      description: stub.summary,
    };
  }
  return {};
}

export default async function CountryPage({ params }: Props) {
  const { countrySlug } = await params;
  const country = await getCountryBySlug(countrySlug);

  if (!country) {
    const stub = SCHENGEN_SLUG_MAP.get(countrySlug);
    if (!stub) notFound();

    return (
      <>
        {/* 01 — Genel Bilgiler */}
        <SchengenStubHero name={stub.name} flag={stub.flag} presetKey={stub.presetKey} summary={stub.summary} />

        {/* 03 — Nasıl Yapılır */}
        <BasvuruSureci countryName={stub.name} />

        {/* 05 — FAQ */}
        {stub.faqs.length > 0 && (
          <FAQ
            items={stub.faqs}
            title={
              <>
                {stub.name} —{' '}
                <em className="font-normal italic text-coral">sık sorulan sorular.</em>
              </>
            }
          />
        )}

        <CountryCTA countryName={stub.name} />
      </>
    );
  }

  const faqItems = country.faqs.map((f) => ({ q: f.question, a: f.answer }));

  return (
    <>
      {/* 01 — Genel Bilgiler */}
      <CountryHero
        country={country}
        bullets={countrySlug === 'schengen' ? [
          'Schengen vize başvurunuzu şansa değil, profesyonellere bırakın.',
          'Sürecin başından sonuna kadar uçtan uca uzman desteği',
          'Konsolosluk standartlarına uygun, sıfır hatalı evrak hazırlığı',
          'Yüksek onay oranı ve kanıtlanmış sektör tecrübesi',
        ] : (countrySlug === 'america' || countrySlug === 'abd') ? [
          'Amerika vize başvurunuzu ve mülakat sürecinizi şansa değil, profesyonellere bırakın.',
          'Kusursuz DS-160 form hazırlığı ve uçtan uca uzman desteği',
          'Konsolosluk beklentilerine uygun evrak yönetimi ve mülakat simülasyonu',
          'Yüksek onay oranı ve kanıtlanmış sektör tecrübesi',
        ] : [
          `${country.name} vize başvurunuzu şansa değil, profesyonellere bırakın.`,
          'Sürecin başından sonuna kadar uçtan uca uzman desteği',
          'Konsolosluk standartlarına uygun, sıfır hatalı evrak hazırlığı',
          'Yüksek onay oranı ve kanıtlanmış sektör tecrübesi',
        ]}
      />

      <GenelBilgi countryName={country.name} items={country.general_info ?? []} />

      {country.appointment_days && (
        <section className="bg-coral/10 border-y border-coral/20">
          <FadeIn as="div" className="container py-5">
            <p className="font-serif text-[17px] text-navy text-center">
              <span className="font-semibold">{country.name} vizesi</span> randevunuz ortalama{' '}
              <span className="font-semibold text-coral">{country.appointment_days}</span> içinde alınabilir.
            </p>
          </FadeIn>
        </section>
      )}

      {countrySlug === 'schengen' && <SchengenCountryGrid limitCollapsed />}

      {countrySlug === 'schengen' && (
        <section className="border-t border-border">
          <div className="container py-20">
            <FadeIn as="div" className="font-mono text-[10px] tracking-[0.2em] uppercase text-coral mb-6 pb-4 border-b border-navy/20">
              — Schengen vizesi nedir
            </FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <FadeIn as="div">
                <h2 className="font-serif font-bold text-[clamp(32px,4vw,56px)] leading-none tracking-[-0.03em] text-navy">
                  Tek vize,{' '}
                  <em className="font-normal italic text-coral">29 ülke.</em>
                </h2>
              </FadeIn>
              <FadeIn as="div" delay={0.1} className="space-y-4 font-serif text-[17px] leading-relaxed text-navy/80">
                <p>
                  Avrupa sınırlarını tek bir belgeyle açan Schengen Vizesi; 29 üye ülkeyi kapsayan resmi ve standartlaştırılmış bir seyahat iznidir. İlgili vize, sahiplerine herhangi bir 180 günlük dönemde toplam 90 güne kadar serbest dolaşım özgürlüğü tanır.
                </p>
                <p>
                  Vize prosedürleri gereği başvurular, seyahat planınızdaki asıl varış noktanız üzerinden yürütülür. Çoklu ülke ziyaretlerini kapsayan karmaşık rotalarda ise süreç, en uzun süre konaklayacağınız ülkenin diplomatik temsilcilikleri aracılığıyla yönetilmelidir.
                </p>
              </FadeIn>
            </div>

            <FadeIn as="div" className="mt-16">
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-coral mb-6 pb-4 border-b border-navy/20">
                — Sık ret sebepleri
              </div>
              <h3 className="font-serif font-bold text-[clamp(24px,3vw,40px)] leading-none tracking-[-0.03em] text-navy mb-2">
                Başvuruların reddedildiği{' '}
                <em className="font-normal italic text-coral">en yaygın nedenler.</em>
              </h3>
              <WarningList items={SCHENGEN_REJECTION_REASONS} />
            </FadeIn>
          </div>
        </section>
      )}

      {/* 02 — Gerekli Belgeler */}
      <GerekliEvraklar
        countryName={country.name}
        documents={country.documents}
      />

      {/* 03 — Nasıl Yapılır */}
      <BasvuruSureci
        countryName={country.name}
        steps={country.process_steps.map((s) => ({ title: s.title, description: s.description }))}
      />

      {/* 05 — FAQ */}
      <FAQ
        items={faqItems}
        title={
          <>
            {country.name} —{' '}
            <em className="font-normal italic text-coral">sık sorulan sorular.</em>
          </>
        }
      />

      <CountryCTA countryName={country.name} />
    </>
  );
}
