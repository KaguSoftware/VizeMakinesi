import { createClient } from '@/lib/supabase/server'
import { EyebrowText } from '@/components/admin/ui'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import RequestsList from './RequestsList'
import type { Database } from '@/lib/supabase/database.types'

export const dynamic = 'force-dynamic'

type RequestRow = Database['public']['Tables']['consultation_requests']['Row']

export default async function RequestsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('consultation_requests')
    .select('*')
    .order('created_at', { ascending: false })

  const requests = (data ?? []) as RequestRow[]
  const unread = requests.filter((r) => !r.is_read).length

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Talepler' }]} />
      <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
        <div>
          <EyebrowText>— Danışma & Hızlandırma Talepleri</EyebrowText>
          <h1 className="font-serif text-[36px] font-bold tracking-[-0.02em] text-navy mt-1">
            Talepler
            {unread > 0 && (
              <span className="ml-3 align-middle inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-coral text-white font-mono text-[12px] font-bold">
                {unread}
              </span>
            )}
          </h1>
          <p className="font-mono text-[11px] text-navy/55 mt-2">
            Yeni talepler burada anlık olarak görünür.
          </p>
        </div>
      </div>

      <RequestsList initial={requests} />
    </div>
  )
}
