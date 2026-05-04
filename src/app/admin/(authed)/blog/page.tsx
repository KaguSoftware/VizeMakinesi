import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { AdminButton, EyebrowText } from '@/components/admin/ui'
import type { Database } from '@/lib/supabase/database.types'

type CountryRow = Pick<
  Database['public']['Tables']['countries']['Row'],
  'id' | 'name' | 'slug' | 'has_tourism' | 'tourism_hero_image_url'
>

export default async function AdminBlogPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('countries')
    .select('id, name, slug, has_tourism, tourism_hero_image_url')
    .order('name', { ascending: true })

  const countries = (data ?? []) as CountryRow[]
  const activePosts = countries.filter((country) => country.has_tourism)

  return (
    <div>
      <div className="flex items-start justify-between mb-10">
        <div>
          <EyebrowText>— 05 / Blog</EyebrowText>
          <h1 className="font-serif text-[36px] font-bold tracking-[-0.02em] text-navy mt-1">
            Blog / Turizm
          </h1>
        </div>
        <Link href="/admin/countries">
          <AdminButton variant="secondary">Ülkeleri Yönet</AdminButton>
        </Link>
      </div>

      <div className="border border-navy/10 bg-white overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-navy/10">
              {['Ülke', 'Slug', 'Kapak', 'Yayın', ''].map((heading) => (
                <th
                  key={heading}
                  className="py-3 px-4 text-left font-mono text-[10px] tracking-widest uppercase text-navy/30"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activePosts.map((country) => (
              <tr key={country.id} className="border-b border-navy/8">
                <td className="py-3 px-4 font-serif text-[16px] font-medium text-navy">
                  {country.name}
                </td>
                <td className="py-3 px-4 font-mono text-[11px] text-navy/40">
                  {country.slug}
                </td>
                <td className="py-3 px-4">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-navy/40">
                    {country.tourism_hero_image_url ? 'Var' : 'Yok'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <Link
                    href={`/blog/${country.slug}`}
                    className="font-mono text-[10px] tracking-widest uppercase text-navy/40 hover:text-navy transition-colors"
                  >
                    Görüntüle
                  </Link>
                </td>
                <td className="py-3 px-4">
                  <Link
                    href={`/admin/countries/${country.id}/edit`}
                    className="font-mono text-[10px] tracking-widest uppercase text-navy/40 hover:text-navy transition-colors"
                  >
                    Düzenle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {activePosts.length === 0 && (
          <div className="py-10 text-center">
            <p className="font-mono text-[12px] text-navy/30 mb-4">
              Henüz aktif blog / turizm sayfası yok.
            </p>
            <Link href="/admin/countries">
              <AdminButton variant="primary">Ülke Düzenle</AdminButton>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
