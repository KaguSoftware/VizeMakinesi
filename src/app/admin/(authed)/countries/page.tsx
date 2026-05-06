import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { EyebrowText, AdminButton } from '@/components/admin/ui'
import CountriesTable from './CountriesTable'
import type { Database } from '@/lib/supabase/database.types'

type CountryRow = Database['public']['Tables']['countries']['Row']

export default async function CountriesPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('countries')
    .select('*')
    .order('mosaic_order', { ascending: true })

  const countries = (data ?? []) as CountryRow[]

  return (
    <div>
      <div className="flex items-start justify-between mb-10">
        <div>
          <EyebrowText>— 01 / Ülkeler</EyebrowText>
          <h1 className="font-serif text-[36px] font-bold tracking-[-0.02em] text-navy mt-1">
            Ülkeler
          </h1>
        </div>
        <Link href="/admin/countries/new">
          <AdminButton variant="primary">+ Yeni Ülke Ekle</AdminButton>
        </Link>
      </div>

      <div className="border border-navy/10 bg-white overflow-x-auto">
        <CountriesTable initial={countries} />
      </div>
    </div>
  )
}
