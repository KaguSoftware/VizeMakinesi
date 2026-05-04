import { createClient } from '@/lib/supabase/server'
import { EyebrowText } from '@/components/admin/ui'
import MegaMenuClient from './MegaMenuClient'
import type { Database } from '@/lib/supabase/database.types'

type CategoryRow = Database['public']['Tables']['mega_menu_categories']['Row']
type ItemRow = Database['public']['Tables']['mega_menu_items']['Row']
type CountryRow = Database['public']['Tables']['countries']['Row']

type RawItem = ItemRow & {
  countries: Pick<CountryRow, 'id' | 'name' | 'flag_emoji'> | null
}

export default async function MegaMenuPage() {
  const supabase = await createClient()

  const [catResult, itemResult, countryResult] = await Promise.all([
    supabase
      .from('mega_menu_categories')
      .select('*')
      .order('sort_order'),
    supabase
      .from('mega_menu_items')
      .select('*, countries(id, name, flag_emoji)')
      .order('sort_order'),
    supabase
      .from('countries')
      .select('id, name, flag_emoji')
      .order('name'),
  ])

  const categories = (catResult.data ?? []) as CategoryRow[]
  const items = (itemResult.data ?? []) as RawItem[]
  const countries = (countryResult.data ?? []) as Pick<CountryRow, 'id' | 'name' | 'flag_emoji'>[]

  const initial = categories.map((cat) => ({
    ...cat,
    items: items
      .filter((it) => it.category_id === cat.id && it.countries)
      .map((it) => ({
        ...it,
        country: it.countries as Pick<CountryRow, 'id' | 'name' | 'flag_emoji'>,
      })),
  }))

  return (
    <div>
      <div className="mb-10">
        <EyebrowText>— Mega Menü</EyebrowText>
        <h1 className="font-serif text-[36px] font-bold tracking-[-0.02em] text-navy mt-1">
          Mega Menü
        </h1>
      </div>

      <MegaMenuClient initial={initial} countries={countries} />
    </div>
  )
}
