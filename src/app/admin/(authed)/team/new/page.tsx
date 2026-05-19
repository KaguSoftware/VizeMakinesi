import Link from 'next/link'
import { EyebrowText } from '@/components/admin/ui'
import TeamMemberForm from '../TeamMemberForm'

export default function NewTeamMemberPage() {
  return (
    <div>
      <Link href="/admin/team" className="font-mono text-[11px] tracking-widest uppercase text-navy/65 hover:text-coral transition-colors">
        ← Ekip
      </Link>
      <div className="mb-10 mt-3">
        <EyebrowText>— Ekip / Yeni</EyebrowText>
        <h1 className="font-serif text-[36px] font-bold tracking-[-0.02em] text-navy mt-1">
          Yeni Ekip Üyesi
        </h1>
      </div>
      <TeamMemberForm />
    </div>
  )
}
