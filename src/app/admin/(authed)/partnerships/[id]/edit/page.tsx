import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EyebrowText } from '@/components/admin/ui'
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
      <Link href="/admin/partnerships" className="font-mono text-[11px] tracking-widest uppercase text-navy/65 hover:text-coral transition-colors">
        ← Ortaklıklar
      </Link>
      <div className="mb-10 mt-3">
        <EyebrowText>— Ortaklıklar / Düzenle</EyebrowText>
        <h1 className="font-serif text-[36px] font-bold tracking-[-0.02em] text-navy mt-1">
          {partnership.name}
        </h1>
      </div>
      <PartnershipForm partnership={partnership} />
    </div>
  )
}
