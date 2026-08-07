import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCountryBySlug, getCountrySlugsStatic } from '@/lib/data/countries';
import CountryVisaTypesHero from '@/components/vizeTurleri/CountryVisaTypesHero';
import CountryVisaTypesList from '@/components/vizeTurleri/CountryVisaTypesList';

export const revalidate = 60;

interface Props {
    params: Promise<{ countrySlug: string }>;
}

export async function generateStaticParams() {
    const slugs = await getCountrySlugsStatic();
    return slugs.map((slug) => ({ countrySlug: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { countrySlug } = await params;
    const country = await getCountryBySlug(countrySlug);
    if (!country) return {};
    return {
        title: `${country.name} Vize Türleri — Vize Makinesi`,
        description: `${country.name} için başvurabileceğiniz vize türleri ve kapsamları.`,
    };
}

export default async function CountryVisaTypesPage({ params }: Props) {
    const { countrySlug } = await params;
    const country = await getCountryBySlug(countrySlug);

    if (!country) notFound();

    return (
        <>
            <CountryVisaTypesHero
                name={country.name}
                description={country.visa_types_hero_description}
                flagEmoji={country.flag_emoji}
                flagPresetKey={country.flag_preset_key}
                flagImageUrl={country.flag_image_url}
            />

            {/* Admin panelinden yönetilen vize türleri (Mini Başlık + Açıklama).
                /vize/[slug] sayfasındaki açılır-kapanır listeyle aynı kaynak. */}
            <CountryVisaTypesList
                countryName={country.name}
                items={country.visa_types.map((v) => ({
                    title: v.title,
                    description: v.description,
                }))}
                description={country.visa_types_description}
            />
        </>
    );
}
