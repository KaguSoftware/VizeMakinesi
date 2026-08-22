import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCountryBySlug } from '@/lib/data/countries';
import { getSchengenPage } from '@/lib/data/schengenPage';
import CountryHero from '@/components/visa/CountryHero/CountryHero';
import SchengenIntro from '@/components/schengen/SchengenIntro/SchengenIntro';
import SchengenCountryGrid from '@/components/visa/SchengenCountryGrid/SchengenCountryGrid';
import SchengenRules from '@/components/schengen/SchengenRules/SchengenRules';
import SchengenVisaTypes from '@/components/schengen/SchengenVisaTypes/SchengenVisaTypes';
import SchengenProcess from '@/components/schengen/SchengenProcess/SchengenProcess';
import FAQ from '@/components/shared/FAQ/FAQ';
import { splitHeading } from '@/lib/text/heading';

export const revalidate = 60;

/**
 * Schengen Bölgesi sayfası. Bölüm sırası rehber dokümanını izler:
 * hero → "Tek vize, 29 ülke" → ülkeler → temel kurallar → vize türleri →
 * başvuru süreci → SSS.
 *
 * Hero'nun ülke bilgileri (ad, bayrak, özet) `countries` tablosundaki
 * 'schengen' satırından; diğer tüm metinler `schengen_page` tablosundan
 * gelir ve /admin/schengen üzerinden yönetilir.
 */
export async function generateMetadata(): Promise<Metadata> {
  const country = await getCountryBySlug('schengen');
  if (!country) return {};
  return {
    title: `${country.name} Vizesi — Vize Makinesi`,
    description: country.summary,
  };
}

export default async function SchengenPage() {
  const [country, content] = await Promise.all([
    getCountryBySlug('schengen'),
    getSchengenPage(),
  ]);

  if (!country) notFound();

  // SSS başlığı da sitenin iki tonlu başlık biçimini kullanır.
  const [faqHead, faqTail] = splitHeading(content.faq_title);

  return (
    <>
      <CountryHero
        country={country}
        lead={content.hero_lead}
        note={content.hero_note}
        bullets={content.hero_bullets}
      />

      <SchengenIntro title={content.intro_title}>
        <SchengenCountryGrid hideHeader limitCollapsed />
      </SchengenIntro>

      <SchengenRules
        title={content.rules_title}
        description={content.rules_description}
        items={content.rules}
      />

      <SchengenVisaTypes
        title={content.visa_types_title}
        description={content.visa_types_description}
        groups={[
          { title: content.visa_types_c_title, items: content.visa_types_c },
          {
            title: content.visa_types_d_title,
            description: content.visa_types_d_description,
            items: content.visa_types_d,
          },
        ]}
      />

      <SchengenProcess
        title={content.process_title}
        description={content.process_description}
      />

      {content.faqs.length > 0 && (
        <FAQ
          items={content.faqs.map((f) => ({ q: f.question, a: f.answer }))}
          title={
            <>
              {faqHead}
              {faqTail && (
                <>
                  {' '}
                  <em className="font-normal italic text-coral">{faqTail}</em>
                </>
              )}
            </>
          }
        />
      )}
    </>
  );
}
