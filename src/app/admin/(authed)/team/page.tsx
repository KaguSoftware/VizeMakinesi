import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { EyebrowText, AdminButton } from '@/components/admin/ui'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import AdminTeamGrid from './TeamGrid'
import type { Database } from '@/lib/supabase/database.types'

type TeamMemberRow = Database['public']['Tables']['team_members']['Row']

export default async function TeamPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('team_members')
    .select('*')
    .order('sort_order', { ascending: true })

  const members = (data ?? []) as TeamMemberRow[]

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Ekip' }]} />
      <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
        <div>
          <EyebrowText>— Ekip</EyebrowText>
          <h1 className="font-serif text-[36px] font-bold tracking-[-0.02em] text-navy mt-1">
            Ekip
          </h1>
        </div>
        <Link href="/admin/team/new">
          <AdminButton variant="primary">+ Yeni Üye Ekle</AdminButton>
        </Link>
      </div>

      <AdminTeamGrid initial={members} />
    </div>
  )
}
