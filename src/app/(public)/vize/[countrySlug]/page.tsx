import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCountryBySlug, getCountrySlugsStatic } from '@/lib/data/countries';
import CountryHero from '@/components/visa/CountryHero/CountryHero';
import FAQ from '@/components/shared/FAQ/FAQ';
import SchengenStubHero from '@/components/visa/SchengenStubHero/SchengenStubHero';
import SchengenCountryGrid from '@/components/visa/SchengenCountryGrid/SchengenCountryGrid';
import WarningList from '@/components/schengen/WarningList/WarningList';
import BasvuruSureci from '@/components/visa/BasvuruSureci/BasvuruSureci';
import MasayaGetirdikleriniz from '@/components/visa/MasayaGetirdikleriniz/MasayaGetirdikleriniz';
import { SITE } from '@/data/site';
import { SCHENGEN_SLUG_MAP } from '@/data/schengen';
import { SCHENGEN_REJECTION_REASONS } from '@/components/schengen/SchengenMembers/constants';

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

    const waText = encodeURIComponent(`Merhaba, ${stub.name} vizesi için başvurmak istiyorum.`);

    return (
      <>
        <SchengenStubHero name={stub.name} flag={stub.flag} presetKey={stub.presetKey} summary={stub.summary} />

        <BasvuruSureci />

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

        <section className="cta-block mt-30 bg-cream">
          <div className="container">
            <div className="py-30 relative z-10">
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-coral mb-12 pb-4 border-b border-navy/20">
                — Daha fazla bilgi alın
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-20 items-end">
                <h2 className="font-serif font-bold text-[clamp(48px,6vw,96px)] leading-[0.96] tracking-[-0.035em] text-navy">
                  {stub.name}{' '}
                  <em className="text-coral font-normal italic">başvurunuzu</em><br />
                  başlatmaya hazır mısınız?
                </h2>
                <div>
                  <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-navy/50 mb-4">
                    — Hemen arayın
                  </div>
                  <a
                    href={SITE.phoneHref}
                    className="block font-serif font-bold text-[48px] tracking-tight text-navy mb-9 hover:text-coral transition-colors duration-200 leading-none"
                  >
                    {SITE.phone}
                  </a>
                  <div className="flex flex-col gap-3 items-start w-full">
                    <a
                      href={`${SITE.whatsappHref}?text=${waText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-3 font-sans font-medium text-[16px] uppercase tracking-[0.1em] px-10 py-[28px] bg-[#25D366] border border-[#25D366] text-white hover:bg-transparent hover:text-[#25D366] transition-all duration-200 rounded-2xl whitespace-nowrap w-full"
                    >
                      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.76-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.114 1.522 5.847L.057 23.882a.5.5 0 0 0 .638.605l6.256-1.643A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.893a9.875 9.875 0 0 1-5.031-1.375l-.36-.214-3.733.979.997-3.639-.235-.374A9.855 9.855 0 0 1 2.107 12C2.107 6.58 6.58 2.107 12 2.107S21.893 6.58 21.893 12 17.42 21.893 12 21.893z" />
                      </svg>
                      WhatsApp'tan Yazın →
                    </a>
                    <a
                      href={SITE.phoneHref}
                      className="inline-flex items-center justify-center gap-3 font-sans font-medium text-[16px] uppercase tracking-[0.1em] px-10 py-[28px] border border-navy text-navy hover:bg-navy hover:text-white transition-all duration-200 rounded-2xl w-full"
                    >
                      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                      </svg>
                      Ofisi Arayın
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

  const waText = encodeURIComponent(`Merhaba, ${country.name} vizesi için başvurmak istiyorum.`);
  const faqItems = country.faqs.map((f) => ({ q: f.question, a: f.answer }));

  return (
    <>
      <CountryHero
        country={country}
        bullets={countrySlug === 'schengen' ? [
          'Schengen vize başvurunuzu şansa değil, profesyonellere bırakın.',
          'Sürecin başından sonuna kadar uçtan uca uzman desteği',
          'Konsolosluk standartlarına uygun, sıfır hatalı evrak hazırlığı',
          'Yüksek onay oranı ve kanıtlanmış sektör tecrübesi',
        ] : undefined}
      />

      {country.appointment_days && (
        <section className="bg-coral/10 border-y border-coral/20">
          <div className="container py-5">
            <p className="font-serif text-[17px] text-navy text-center">
              <span className="font-semibold">{country.name} vizesi</span> randevunuz ortalama{' '}
              <span className="font-semibold text-coral">{country.appointment_days}</span> içinde alınabilir.
            </p>
          </div>
        </section>
      )}

      {countrySlug === 'schengen' && <SchengenCountryGrid />}

      {countrySlug === 'schengen' && (
        <section className="border-t border-border">
          <div className="container py-20">
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-coral mb-6 pb-4 border-b border-navy/20">
              — Schengen vizesi nedir
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <h2 className="font-serif font-bold text-[clamp(32px,4vw,56px)] leading-none tracking-[-0.03em] text-navy">
                Tek vize,{' '}
                <em className="font-normal italic text-coral">29 ülke.</em>
              </h2>
              <div className="space-y-4 font-serif text-[17px] leading-relaxed text-navy/80">
                <p>
                  Avrupa sınırlarını tek bir belgeyle açan Schengen Vizesi; 29 üye ülkeyi kapsayan resmi ve standartlaştırılmış bir seyahat iznidir. İlgili vize, sahiplerine herhangi bir 180 günlük dönemde toplam 90 güne kadar serbest dolaşım özgürlüğü tanır.
                </p>
                <p>
                  Vize prosedürleri gereği başvurular, seyahat planınızdaki asıl varış noktanız üzerinden yürütülür. Çoklu ülke ziyaretlerini kapsayan karmaşık rotalarda ise süreç, en uzun süre konaklayacağınız ülkenin diplomatik temsilcilikleri aracılığıyla yönetilmelidir.
                </p>
              </div>
            </div>

            <div className="mt-16">
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-coral mb-6 pb-4 border-b border-navy/20">
                — Sık ret sebepleri
              </div>
              <h3 className="font-serif font-bold text-[clamp(24px,3vw,40px)] leading-none tracking-[-0.03em] text-navy mb-2">
                Başvuruların reddedildiği{' '}
                <em className="font-normal italic text-coral">en yaygın nedenler.</em>
              </h3>
              <WarningList items={SCHENGEN_REJECTION_REASONS} />
            </div>
          </div>
        </section>
      )}

      <BasvuruSureci />

      <MasayaGetirdikleriniz items={country.requirements.map((r) => r.text)} />

      <FAQ
        items={faqItems}
        title={
          <>
            {country.name} —{' '}
            <em className="font-normal italic text-coral">sık sorulan sorular.</em>
          </>
        }
      />

      <section className="cta-block mt-30 bg-cream">
        <div className="container">
          <div className="py-30 relative z-10">
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-coral mb-12 pb-4 border-b border-navy/20">
              — Daha fazla bilgi alın
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-20 items-end">
              <h2 className="font-serif font-bold text-[clamp(48px,6vw,96px)] leading-[0.96] tracking-[-0.035em] text-navy">
                {country.name}{' '}
                <em className="text-coral font-normal italic">başvurunuzu</em><br />
                başlatmaya hazır mısınız?
              </h2>
              <div>
                <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-navy/50 mb-4">
                  — Hemen arayın
                </div>
                <a
                  href={SITE.phoneHref}
                  className="block font-serif font-bold text-[48px] tracking-tight text-navy mb-9 hover:text-coral transition-colors duration-200 leading-none"
                >
                  {SITE.phone}
                </a>
                <div className="flex flex-col gap-3 items-start w-full">
                  <a
                    href={`${SITE.whatsappHref}?text=${waText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 font-sans font-medium text-[16px] uppercase tracking-[0.1em] px-10 py-[28px] bg-[#25D366] border border-[#25D366] text-white hover:bg-transparent hover:text-[#25D366] transition-all duration-200 rounded-2xl whitespace-nowrap w-full"
                  >
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.76-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.114 1.522 5.847L.057 23.882a.5.5 0 0 0 .638.605l6.256-1.643A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.893a9.875 9.875 0 0 1-5.031-1.375l-.36-.214-3.733.979.997-3.639-.235-.374A9.855 9.855 0 0 1 2.107 12C2.107 6.58 6.58 2.107 12 2.107S21.893 6.58 21.893 12 17.42 21.893 12 21.893z" />
                    </svg>
                    WhatsApp'tan Yazın →
                  </a>
                  <a
                    href={SITE.phoneHref}
                    className="inline-flex items-center justify-center gap-3 font-sans font-medium text-[16px] uppercase tracking-[0.1em] px-10 py-[28px] border border-navy text-navy hover:bg-navy hover:text-white transition-all duration-200 rounded-2xl w-full"
                  >
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                    Ofisi Arayın
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
