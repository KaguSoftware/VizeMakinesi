import Link from 'next/link'
import { EyebrowText } from '@/components/admin/ui'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import { getSchengenPage } from '@/lib/data/schengenPage'
import SchengenForm from './SchengenForm'

export default async function SchengenAdminPage() {
  const content = await getSchengenPage()

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Schengen Sayfası' }]} />
      <div className="mb-10">
        <EyebrowText>— Schengen Bölgesi</EyebrowText>
        <h1 className="font-serif text-[36px] font-bold tracking-[-0.02em] text-navy mt-1">
          Schengen Sayfası
        </h1>
        <p className="font-mono text-[12px] text-navy/70 mt-2">
          <Link href="/schengen" className="text-coral hover:text-navy transition-colors">
            /schengen
          </Link>{' '}
          sayfasının tüm bölümleri.
        </p>
      </div>

      <SchengenForm initial={content} />
    </div>
  )
}
