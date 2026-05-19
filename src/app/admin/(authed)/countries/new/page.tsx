import Link from 'next/link'
import { EyebrowText } from '@/components/admin/ui'
import CountryForm from '../CountryForm'

export default function NewCountryPage() {
  return (
    <div>
      <Link href="/admin/countries" className="font-mono text-[11px] tracking-widest uppercase text-navy/65 hover:text-coral transition-colors">
        ← Ülkeler
      </Link>
      <EyebrowText className="mt-3">— 01 / Ülkeler</EyebrowText>
      <h1 className="font-serif text-[36px] font-bold tracking-[-0.02em] text-navy mt-1 mb-2">
        Yeni Ülke
      </h1>
      <CountryForm />
    </div>
  )
}
