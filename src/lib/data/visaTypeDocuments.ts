import { createPublicClient } from '@/lib/supabase/public';
import type { Database } from '@/lib/supabase/database.types';

export type VisaTypeDocumentRow = Database['public']['Tables']['visa_type_documents']['Row'];

/**
 * Downloadable PDFs for the "Gerekli Belgeler" section of a visa-type page.
 * Admin-managed, so an empty result is a valid state — the grid renders
 * nothing and the section keeps just its prose.
 */
export async function getVisaTypeDocuments(pageKey: string): Promise<VisaTypeDocumentRow[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('visa_type_documents')
    .select('*')
    .eq('page_key', pageKey)
    .order('sort_order', { ascending: true });

  return (data ?? []) as VisaTypeDocumentRow[];
}
