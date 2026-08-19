import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getCountryBySlug, getCountrySlugsStatic } from '@/lib/data/countries';
import CountryHero from '@/components/visa/CountryHero/CountryHero';
import GenelBilgi from '@/components/visa/GenelBilgi/GenelBilgi';
import VizeTurleri from '@/components/visa/VizeTurleri/VizeTurleri';
import FAQ from '@/components/shared/FAQ/FAQ';
import SchengenStubHero from '@/components/visa/SchengenStubHero/SchengenStubHero';
import BasvuruSureci from '@/components/visa/BasvuruSureci/BasvuruSureci';
import GerekliEvraklar from '@/components/visa/GerekliEvraklar/GerekliEvraklar';
import CountryCTA from '@/components/visa/CountryCTA/CountryCTA';
import { SCHENGEN_SLUG_MAP } from '@/data/schengen';
import { SCHENGEN_PATH } from '@/lib/routes';
import { FadeIn } from '@/components/shared/motion';

export const revalidate = 60;

interface Props {
  params: Promise<{ countrySlug: string }>;
}

export async function generateStaticParams() {
  const dbSlugs = await getCountrySlugsStatic();
  const dbSet = new Set(dbSlugs);
  const schengenSlugs = [...SCHENGEN_SLUG_MAP.keys()].filter((s) => !dbSet.has(s));
  // Schengen bölge sayfası kök seviyede (/schengen) yayınlanır.
  return [...dbSlugs, ...schengenSlugs]
    .filter((slug) => slug !== 'schengen')
    .map((slug) => ({ countrySlug: slug }));
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
  // Eski /vize/schengen adresi kalıcı olarak /schengen'e taşındı.
  if (countrySlug === 'schengen') redirect(SCHENGEN_PATH);

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
        bullets={(countrySlug === 'america' || countrySlug === 'abd') ? [
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

      <GenelBilgi
        items={country.general_info ?? []}
        title={country.general_info_title}
        description={country.general_info_description}
      />

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

      {/* 01b — Vize Türleri */}
      <VizeTurleri
        countrySlug={countrySlug}
        hasItems={country.visa_types.length > 0}
        title={country.visa_types_title}
        lead={country.visa_types_lead}
      />

      {/* 02 — Nasıl Yapılır */}
      <BasvuruSureci
        countryName={country.name}
        steps={country.process_steps.map((s) => ({ title: s.title, description: s.description }))}
      />

      {/* 03 — Gerekli Belgeler */}
      <GerekliEvraklar
        countryName={country.name}
        documents={country.documents}
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
