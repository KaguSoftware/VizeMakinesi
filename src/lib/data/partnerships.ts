import { createPublicClient } from '@/lib/supabase/public';
import type { Database } from '@/lib/supabase/database.types';

export type PartnershipRow = Database['public']['Tables']['partnerships']['Row'];

export async function getPartnerships(): Promise<PartnershipRow[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('partnerships')
    .select('*')
    .eq('visible', true)
    .order('sort_order');
  if (error) throw error;
  return (data ?? []) as PartnershipRow[];
}
