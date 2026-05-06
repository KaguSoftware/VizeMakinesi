import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/database.types';

export type MarqueeRow = Database['public']['Tables']['marquee_items']['Row'];
type MarqueeSettingRow = Database['public']['Tables']['marquee_settings']['Row'];

export async function getMarqueeItems(
  location: 'home' | 'nav_ticker'
): Promise<MarqueeRow[]> {
  const supabase = await createClient();

  const settingResult = await supabase
    .from('marquee_settings')
    .select('enabled')
    .eq('location', location)
    .single();

  const setting = settingResult.data as Pick<MarqueeSettingRow, 'enabled'> | null;
  if (!setting?.enabled) return [];

  const { data, error } = await supabase
    .from('marquee_items')
    .select('*')
    .eq('location', location)
    .eq('visible', true)
    .order('sort_order');

  if (error) throw error;
  return (data ?? []) as MarqueeRow[];
}
