import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EyebrowText } from '@/components/admin/ui'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import PartnershipForm from '../../PartnershipForm'
import type { Database } from '@/lib/supabase/database.types'

type PartnershipRow = Database['public']['Tables']['partnerships']['Row']

export default async function EditPartnershipPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('partnerships').select('*').eq('id', id).single()
  if (!data) notFound()

  const partnership = data as PartnershipRow

  return (
    <div>
      <Breadcrumbs items={[
        { label: 'Dashboard', href: '/admin' },
        { label: 'Ortaklıklar', href: '/admin/partnerships' },
        { label: partnership.name },
      ]} />
      <div className="mb-10">
        <EyebrowText>— Ortaklıklar / Düzenle</EyebrowText>
        <h1 className="font-serif text-[36px] font-bold tracking-[-0.02em] text-navy mt-1">
          {partnership.name}
        </h1>
      </div>
      <PartnershipForm partnership={partnership} />
    </div>
  )
}
