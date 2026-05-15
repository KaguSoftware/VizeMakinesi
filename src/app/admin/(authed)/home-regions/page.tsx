import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { EyebrowText } from '@/components/admin/ui'
import HomeRegionsClient from './HomeRegionsClient'
import type { Database } from '@/lib/supabase/database.types'

type EntryRow = Database['public']['Tables']['home_region_entries']['Row']
type SettingRow = Database['public']['Tables']['home_region_settings']['Row']
type RegionKey = 'avrupa' | 'amerika' | 'asya' | 'diger'

const REGIONS: RegionKey[] = ['avrupa', 'amerika', 'asya', 'diger']

export default async function HomeRegionsPage() {
  await requireAdmin()
  const supabase = await createClient()

  const [{ data: allEntries }, { data: allSettings }] = await Promise.all([
    supabase
      .from('home_region_entries')
      .select('*')
      .order('pinned', { ascending: false })
      .order('sort_order', { ascending: true }),
    supabase.from('home_region_settings').select('*'),
  ])

  const entries = (allEntries ?? []) as EntryRow[]
  const settings = (allSettings ?? []) as SettingRow[]

  const initialEntries = Object.fromEntries(
    REGIONS.map((r) => [r, entries.filter((e) => e.region === r)])
  ) as Record<RegionKey, EntryRow[]>

  const initialSettings = Object.fromEntries(
    REGIONS.map((r) => [r, settings.find((s) => s.region === r)?.visible ?? true])
  ) as Record<RegionKey, boolean>

  return (
    <div>
      <div className="mb-10">
        <EyebrowText>— Ana Sayfa</EyebrowText>
        <h1 className="font-serif text-[36px] font-bold tracking-[-0.02em] text-navy mt-1">
          Ana Sayfa Bölgeleri
        </h1>
      </div>
      <HomeRegionsClient
        initialEntries={initialEntries}
        initialSettings={initialSettings}
      />
    </div>
  )
}
