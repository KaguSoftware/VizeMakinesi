import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';

export type PageSectionRow = Database['public']['Tables']['page_sections']['Row'];

export async function getPageSection(key: string): Promise<PageSectionRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('page_sections')
    .select('*')
    .eq('key', key)
    .single();
  return (data as PageSectionRow | null) ?? null;
}
