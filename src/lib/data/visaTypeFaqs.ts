import { createPublicClient } from '@/lib/supabase/public';
import type { Database } from '@/lib/supabase/database.types';
import type { FAQItem } from '@/data/countries.types';

export type VisaTypeFaqRow = Database['public']['Tables']['visa_type_faqs']['Row'];

/**
 * FAQs for /vize-turleri and its visa-type sub-pages.
 *
 * `pageKey` is the sub-page slug (e.g. 'turistik-vize') or 'vize-turleri' for
 * the landing page. Rows are managed from the admin panel's "Vize Türleri"
 * section, so an empty result is a valid state — callers should render the
 * FAQ block conditionally.
 */
export async function getVisaTypeFaqs(pageKey: string): Promise<FAQItem[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('visa_type_faqs')
    .select('*')
    .eq('page_key', pageKey)
    .order('sort_order', { ascending: true });

  const rows = (data ?? []) as VisaTypeFaqRow[];
  return rows.map((row) => ({ q: row.question, a: row.answer }));
}

/**
 * Every FAQ row grouped by page key. Used by the admin editor, which renders
 * one SSS field per page in a single form.
 */
export async function getAllVisaTypeFaqs(): Promise<Record<string, FAQItem[]>> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('visa_type_faqs')
    .select('*')
    .order('sort_order', { ascending: true });

  const rows = (data ?? []) as VisaTypeFaqRow[];
  const grouped: Record<string, FAQItem[]> = {};
  for (const row of rows) {
    (grouped[row.page_key] ??= []).push({ q: row.question, a: row.answer });
  }
  return grouped;
}
