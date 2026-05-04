import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { EyebrowText, AdminCard } from '@/components/admin/ui'

const RESOURCES = [
  { label: 'Ülkeler', href: '/admin/countries', table: 'countries', filter: null },
  { label: 'Mega Menü', href: '/admin/mega-menu', table: 'mega_menu_categories', filter: null },
  { label: 'Marquee', href: '/admin/marquee', table: 'marquee_items', filter: null },
  { label: 'Ortaklıklar', href: '/admin/partnerships', table: 'partnerships', filter: null },
  { label: 'Blog / Turizm', href: '/admin/blog', table: 'countries', filter: { column: 'has_tourism', value: true } },
  { label: 'Ekip', href: '/admin/team', table: 'team_members', filter: null },
] as const

async function fetchCounts(supabase: Awaited<ReturnType<typeof createClient>>) {
  const results = await Promise.all(
    RESOURCES.map(async (r) => {
      let q = supabase.from(r.table).select('*', { count: 'exact', head: true })
      if (r.filter) {
        q = q.eq(r.filter.column, r.filter.value)
      }
      const { count } = await q
      return count ?? 0
    })
  )
  return results
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
      <p className="font-mono text-[12px] text-navy/40 mb-12">{user?.email}</p>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {RESOURCES.map((resource, i) => (
          <AdminCard key={resource.href} className="group hover:border-coral transition-colors duration-150">
            <EyebrowText className="mb-4">{resource.label}</EyebrowText>
            <p className="font-serif text-[42px] font-bold text-navy leading-none mb-6">
              {counts[i]}
            </p>
            <Link
              href={resource.href}
              className="font-mono text-[11px] tracking-widest uppercase text-coral group-hover:text-navy transition-colors"
            >
              Yönet →
            </Link>
          </AdminCard>
        ))}
      </div>
    </div>
  )
}
