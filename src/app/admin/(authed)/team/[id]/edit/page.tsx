import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EyebrowText } from '@/components/admin/ui'
import TeamMemberForm from '../../TeamMemberForm'
import type { Database } from '@/lib/supabase/database.types'

type TeamMemberRow = Database['public']['Tables']['team_members']['Row']

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('team_members').select('*').eq('id', id).single()
  if (!data) notFound()

  const member = data as TeamMemberRow

  return (
    <div>
      <Link href="/admin/team" className="font-mono text-[11px] tracking-widest uppercase text-navy/65 hover:text-coral transition-colors">
        ← Ekip
      </Link>
      <div className="mb-10 mt-3">
        <EyebrowText>— Ekip / Düzenle</EyebrowText>
        <h1 className="font-serif text-[36px] font-bold tracking-[-0.02em] text-navy mt-1">
          {member.name}
        </h1>
      </div>
      <TeamMemberForm member={member} />
    </div>
  )
}
