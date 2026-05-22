import { EyebrowText } from '@/components/admin/ui'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import CountryForm from '../CountryForm'

export default function NewCountryPage() {
  return (
    <div>
      <Breadcrumbs items={[
        { label: 'Dashboard', href: '/admin' },
        { label: 'Ülkeler', href: '/admin/countries' },
        { label: 'Yeni' },
      ]} />
      <EyebrowText>— 01 / Ülkeler</EyebrowText>
      <h1 className="font-serif text-[36px] font-bold tracking-[-0.02em] text-navy mt-1 mb-2">
        Yeni Ülke
      </h1>
      <CountryForm />
    </div>
  )
}
