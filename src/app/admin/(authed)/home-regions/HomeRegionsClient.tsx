'use client'

import { useState } from 'react'
import type { RegionKey } from './actions'
import type { Database } from '@/lib/supabase/database.types'
import RegionSection from './RegionSection'

type EntryRow = Database['public']['Tables']['home_region_entries']['Row']

interface Props {
  initialEntries: Record<RegionKey, EntryRow[]>
  initialSettings: Record<RegionKey, boolean>
}

const REGION_ORDER: RegionKey[] = ['avrupa', 'asya', 'amerika', 'diger']

export default function HomeRegionsClient({ initialEntries, initialSettings }: Props) {
  const [entriesMap, setEntriesMap] = useState<Record<RegionKey, EntryRow[]>>(initialEntries)
  const [settingsMap, setSettingsMap] = useState<Record<RegionKey, boolean>>(initialSettings)

  function updateRegionEntries(region: RegionKey, next: EntryRow[]) {
    setEntriesMap((prev) => ({ ...prev, [region]: next }))
  }

  function updateRegionVisible(region: RegionKey, val: boolean) {
    setSettingsMap((prev) => ({ ...prev, [region]: val }))
  }

  return (
    <div className="flex flex-col gap-4">
      {REGION_ORDER.map((region) => (
        <RegionSection
          key={region}
          region={region}
          entries={entriesMap[region]}
          regionVisible={settingsMap[region]}
          onEntriesChange={(next) => updateRegionEntries(region, next)}
          onRegionVisibleChange={(val) => updateRegionVisible(region, val)}
        />
      ))}
    </div>
  )
}
