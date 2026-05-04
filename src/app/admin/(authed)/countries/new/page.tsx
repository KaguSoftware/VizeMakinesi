import { EyebrowText } from '@/components/admin/ui'
import CountryForm from '../CountryForm'

export default function NewCountryPage() {
  return (
    <div>
      <EyebrowText>— 01 / Ülkeler</EyebrowText>
      <h1 className="font-serif text-[36px] font-bold tracking-[-0.02em] text-navy mt-1 mb-2">
        Yeni Ülke
      </h1>
      <CountryForm />
    </div>
  )
}
