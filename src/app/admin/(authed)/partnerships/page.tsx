import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { EyebrowText, AdminButton } from '@/components/admin/ui'
import PartnershipsGrid from './PartnershipsGrid'
import type { Database } from '@/lib/supabase/database.types'

type PartnershipRow = Database['public']['Tables']['partnerships']['Row']

export default async function PartnershipsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('partnerships')
    .select('*')
    .order('sort_order', { ascending: true })

  const partnerships = (data ?? []) as PartnershipRow[]

  return (
    <div>
      <div className="flex items-start justify-between mb-10">
        <div>
          <EyebrowText>— Ortaklıklar</EyebrowText>
          <h1 className="font-serif text-[36px] font-bold tracking-[-0.02em] text-navy mt-1">
            Ortaklıklar
          </h1>
        </div>
        <Link href="/admin/partnerships/new">
          <AdminButton variant="primary">+ Yeni Ortaklık Ekle</AdminButton>
        </Link>
      </div>

      <PartnershipsGrid initial={partnerships} />
    </div>
  )
}
