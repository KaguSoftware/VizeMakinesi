import { createPublicClient } from '@/lib/supabase/public';
import type { Database } from '@/lib/supabase/database.types';

type CategoryRow = Database['public']['Tables']['mega_menu_categories']['Row'];
type ItemRow = Database['public']['Tables']['mega_menu_items']['Row'];
type CountryRow = Database['public']['Tables']['countries']['Row'];

export interface MegaMenuCountry {
  slug: string;
  name: string;
  flag_emoji: string | null;
}

export interface MegaMenuItemWithCountry {
  id: string;
  category_id: string;
  sort_order: number;
  country: MegaMenuCountry;
}

export interface MegaMenuCategory {
  id: string;
  name: string;
  sort_order: number;
  items: MegaMenuItemWithCountry[];
}

type RawItem = ItemRow & { countries: Pick<CountryRow, 'slug' | 'name' | 'flag_emoji'> | null };

export async function getMegaMenu(): Promise<MegaMenuCategory[]> {
  const supabase = createPublicClient();

  const catResult = await supabase
    .from('mega_menu_categories')
    .select('id, name, sort_order')
    .eq('visible', true)
    .order('sort_order');

  const categories = (catResult.data ?? []) as Pick<CategoryRow, 'id' | 'name' | 'sort_order'>[];
  if (categories.length === 0) return [];

  const categoryIds = categories.map((c) => c.id);

  const itemResult = await supabase
    .from('mega_menu_items')
    .select('id, category_id, sort_order, countries(slug, name, flag_emoji)')
    .in('category_id', categoryIds)
    .eq('visible', true)
    .order('sort_order');

  const items = (itemResult.data ?? []) as RawItem[];

  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    sort_order: cat.sort_order,
    items: items
      .filter((it) => it.category_id === cat.id && it.countries)
      .map((it) => ({
        id: it.id,
        category_id: it.category_id,
        sort_order: it.sort_order,
        country: it.countries as MegaMenuCountry,
      })),
  }));
}
