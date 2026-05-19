import Link from 'next/link'
import { EyebrowText } from '@/components/admin/ui'
import PartnershipForm from '../PartnershipForm'

export default function NewPartnershipPage() {
  return (
    <div>
      <Link href="/admin/partnerships" className="font-mono text-[11px] tracking-widest uppercase text-navy/65 hover:text-coral transition-colors">
        ← Ortaklıklar
      </Link>
      <div className="mb-10 mt-3">
        <EyebrowText>— Ortaklıklar / Yeni</EyebrowText>
        <h1 className="font-serif text-[36px] font-bold tracking-[-0.02em] text-navy mt-1">
          Yeni Ortaklık
        </h1>
      </div>
      <PartnershipForm />
    </div>
  )
}
