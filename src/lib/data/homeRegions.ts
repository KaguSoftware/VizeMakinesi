import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/database.types'

export type RegionKey = 'avrupa' | 'populer' | 'asya' | 'amerika' | 'diger'
export type HomeRegionEntry = Database['public']['Tables']['home_region_entries']['Row']
export type HomeRegionSetting = Database['public']['Tables']['home_region_settings']['Row']

const REGIONS: RegionKey[] = ['avrupa', 'populer', 'asya', 'amerika', 'diger']

export async function getHomeRegionsData() {
  const supabase = await createClient()

  const [entriesResult, settingsResult] = await Promise.all([
    supabase
      .from('home_region_entries')
      .select('*')
      .eq('visible', true)
      .order('pinned', { ascending: false })
      .order('sort_order', { ascending: true }),
    supabase.from('home_region_settings').select('*'),
  ])

  const allEntries = (entriesResult.data ?? []) as HomeRegionEntry[]
  const allSettings = (settingsResult.data ?? []) as HomeRegionSetting[]

  const entries = Object.fromEntries(
    REGIONS.map((r) => [r, allEntries.filter((e) => e.region === r)])
  ) as Record<RegionKey, HomeRegionEntry[]>

  const settingsMap = Object.fromEntries(
    allSettings.map((s) => [s.region, s.visible])
  ) as Partial<Record<RegionKey, boolean>>

  const settings = Object.fromEntries(
    REGIONS.map((r) => [r, settingsMap[r] ?? true])
  ) as Record<RegionKey, boolean>

  return { entries, settings }
}
