import { EyebrowText } from '@/components/admin/ui'
import PartnershipForm from '../PartnershipForm'

export default function NewPartnershipPage() {
  return (
    <div>
      <div className="mb-10">
        <EyebrowText>— Ortaklıklar / Yeni</EyebrowText>
        <h1 className="font-serif text-[36px] font-bold tracking-[-0.02em] text-navy mt-1">
          Yeni Ortaklık
        </h1>
      </div>
      <PartnershipForm />
    </div>
  )
}
