import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { EyebrowText, AdminCard } from '@/components/admin/ui'
import { ADMIN_RESOURCES } from '@/lib/admin/nav'

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

interface Counts {
  total: number
  visible: number | null
}

async function fetchCounts(supabase: SupabaseServerClient): Promise<Counts[]> {
  return Promise.all(
    ADMIN_RESOURCES.map(async (r) => {
      if (!r.table) return { total: 0, visible: null }
      let totalQuery = supabase.from(r.table).select('*', { count: 'exact', head: true })
      if (r.filter) totalQuery = totalQuery.eq(r.filter.column, r.filter.value)
      const { count: total } = await totalQuery

      if (!r.hasVisibleFlag) {
        return { total: total ?? 0, visible: null }
      }

      let visibleQuery = supabase
        .from(r.table)
        .select('*', { count: 'exact', head: true })
        .eq('visible', true)
      if (r.filter) visibleQuery = visibleQuery.eq(r.filter.column, r.filter.value)
      const { count: visible } = await visibleQuery
      return { total: total ?? 0, visible: visible ?? 0 }
    })
  )
}

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const counts = await fetchCounts(supabase)

  return (
    <div>
      <EyebrowText>— 00 / Genel Bakış</EyebrowText>
      <h1 className="font-serif text-[40px] font-bold tracking-[-0.02em] text-navy leading-[1.1] mt-2 mb-2">
        Hoş geldiniz
      </h1>
      <p className="font-mono text-[12px] text-navy/70 mb-12">{user?.email}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ADMIN_RESOURCES.map((resource, i) => {
          const { total, visible } = counts[i]
          return (
            <AdminCard key={resource.href} className="group hover:border-coral transition-colors duration-150">
              <EyebrowText className="mb-4">{resource.label}</EyebrowText>
              <p className="font-serif text-[42px] font-bold text-navy leading-none mb-2">
                {total}
              </p>
              {visible !== null && (
                <p className="font-mono text-[11px] text-navy/60 mb-6">
                  {visible} görünür
                </p>
              )}
              {visible === null && <div className="mb-6" />}
              <Link
                href={resource.href}
                className="font-mono text-[11px] tracking-widest uppercase text-coral group-hover:text-navy transition-colors"
              >
                Yönet →
              </Link>
            </AdminCard>
          )
        })}
      </div>
    </div>
  )
}
