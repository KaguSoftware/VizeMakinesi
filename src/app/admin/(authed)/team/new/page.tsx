import { EyebrowText } from '@/components/admin/ui'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import TeamMemberForm from '../TeamMemberForm'

export default function NewTeamMemberPage() {
  return (
    <div>
      <Breadcrumbs items={[
        { label: 'Dashboard', href: '/admin' },
        { label: 'Ekip', href: '/admin/team' },
        { label: 'Yeni' },
      ]} />
      <div className="mb-10">
        <EyebrowText>— Ekip / Yeni</EyebrowText>
        <h1 className="font-serif text-[36px] font-bold tracking-[-0.02em] text-navy mt-1">
          Yeni Ekip Üyesi
        </h1>
      </div>
      <TeamMemberForm />
    </div>
  )
}
