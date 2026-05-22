import { createClient } from '@/lib/supabase/server'
import { EyebrowText } from '@/components/admin/ui'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import MarqueeSection from './MarqueeSection'
import type { Database } from '@/lib/supabase/database.types'

type MarqueeRow = Database['public']['Tables']['marquee_items']['Row']
type MarqueeSettingRow = Database['public']['Tables']['marquee_settings']['Row']

export default async function MarqueePage() {
  const supabase = await createClient()

  const [itemsResult, settingsResult] = await Promise.all([
    supabase.from('marquee_items').select('*').order('sort_order'),
    supabase.from('marquee_settings').select('*'),
  ])

  const allItems = (itemsResult.data ?? []) as MarqueeRow[]
  const settings = (settingsResult.data ?? []) as MarqueeSettingRow[]

  const homeItems = allItems.filter((i) => i.location === 'home')
  const navItems = allItems.filter((i) => i.location === 'nav_ticker')
  const homeEnabled = settings.find((s) => s.location === 'home')?.enabled ?? false
  const navEnabled = settings.find((s) => s.location === 'nav_ticker')?.enabled ?? false

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Marquee' }]} />
      <div className="mb-10">
        <EyebrowText>— Marquee</EyebrowText>
        <h1 className="font-serif text-[36px] font-bold tracking-[-0.02em] text-navy mt-1">
          Marquee
        </h1>
      </div>

      <div className="flex flex-col gap-8">
        <MarqueeSection
          location="home"
          label="Ana Sayfa Marquee"
          initialItems={homeItems}
          initialEnabled={homeEnabled}
        />
        <MarqueeSection
          location="nav_ticker"
          label="Navbar Ticker"
          initialItems={navItems}
          initialEnabled={navEnabled}
        />
      </div>
    </div>
  )
}
