import { cache } from 'react';
import { createPublicClient } from '@/lib/supabase/public';
import { createStaticClient } from '@/lib/supabase/static';
import type { Database } from '@/lib/supabase/database.types';

type CountryRow = Database['public']['Tables']['countries']['Row'];
type RequirementRow = Database['public']['Tables']['country_requirements']['Row'];
type FaqRow = Database['public']['Tables']['country_faqs']['Row'];
type DocumentRow = Database['public']['Tables']['country_documents']['Row'];
type VisaTypeRow = Database['public']['Tables']['country_visa_types']['Row'];

export type { DocumentRow, VisaTypeRow };

export interface CountryWithRelations extends CountryRow {
  requirements: RequirementRow[];
  faqs: FaqRow[];
  documents: DocumentRow[];
  visa_types: VisaTypeRow[];
}

async function attachRelations(countries: CountryRow[]): Promise<CountryWithRelations[]> {
  if (countries.length === 0) return [];

  const supabase = createPublicClient();
  const ids = countries.map((c) => c.id);

  // Run the relation queries in parallel — they're independent.
  const [reqsResult, faqsResult, docsResult, visaTypesResult] = await Promise.all([
    supabase.from('country_requirements').select('*').in('country_id', ids).order('sort_order'),
    supabase.from('country_faqs').select('*').in('country_id', ids).order('sort_order'),
    supabase.from('country_documents').select('*').in('country_id', ids).order('sort_order'),
    supabase.from('country_visa_types').select('*').in('country_id', ids).order('sort_order'),
  ]);

  const reqs = (reqsResult.data ?? []) as RequirementRow[];
  const faqs = (faqsResult.data ?? []) as FaqRow[];
  const docs = (docsResult.data ?? []) as DocumentRow[];
  const visaTypes = (visaTypesResult.data ?? []) as VisaTypeRow[];

  return countries.map((c) => ({
    ...c,
    requirements: reqs.filter((r) => r.country_id === c.id),
    faqs: faqs.filter((f) => f.country_id === c.id),
    documents: docs.filter((d) => d.country_id === c.id),
    visa_types: visaTypes.filter((v) => v.country_id === c.id),
  }));
}

export async function getAllCountries(): Promise<CountryWithRelations[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .eq('mosaic_visible', true)
    .order('mosaic_order');
  if (error) throw error;
  return attachRelations((data ?? []) as CountryRow[]);
}

// Wrapped in React cache() so a single request that calls this multiple times
// (e.g. generateMetadata + page component) only round-trips Supabase once.
export const getCountryBySlug = cache(
  async (slug: string): Promise<CountryWithRelations | null> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error || !data) return null;
    const row = data as CountryRow;
    const [withRelations] = await attachRelations([row]);
    return withRelations ?? null;
  }
);

export async function getTourismCountries(): Promise<CountryWithRelations[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .eq('has_tourism', true)
    .order('mosaic_order');
  if (error) throw error;
  return attachRelations((data ?? []) as CountryRow[]);
}

export async function getCountrySlugs(): Promise<string[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('countries')
    .select('slug')
    .order('mosaic_order');
  if (error) throw error;
  return ((data ?? []) as { slug: string }[]).map((c) => c.slug);
}

// Build-time variants (no cookies) for use in generateStaticParams.
export async function getCountrySlugsStatic(): Promise<string[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from('countries')
    .select('slug')
    .order('mosaic_order');
  if (error) throw error;
  return ((data ?? []) as { slug: string }[]).map((c) => c.slug);
}

export interface CountrySlim {
  slug: string;
  name: string;
  flag_emoji: string | null;
  flag_type: 'preset' | 'image' | null;
  flag_preset_key: string | null;
  flag_image_url: string | null;
}

export async function getAllCountriesSlim(): Promise<CountrySlim[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('countries')
    .select('slug, name, flag_emoji, flag_type, flag_preset_key, flag_image_url')
    .order('name');
  if (error) throw error;
  return (data ?? []) as CountrySlim[];
}

export interface DanismaCountry {
  name: string;
  flag_emoji: string | null;
  flag_type: 'preset' | 'image' | null;
  flag_preset_key: string | null;
  flag_image_url: string | null;
}

export async function getDanismaCountries(): Promise<DanismaCountry[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('countries')
    .select('name, flag_emoji, flag_type, flag_preset_key, flag_image_url')
    .eq('danisma_visible', true)
    .order('name');
  if (error) throw error;
  return (data ?? []) as DanismaCountry[];
}

export async function getTourismSlugsStatic(): Promise<string[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from('countries')
    .select('slug')
    .eq('has_tourism', true)
    .order('mosaic_order');
  if (error) throw error;
  return ((data ?? []) as { slug: string }[]).map((c) => c.slug);
}
