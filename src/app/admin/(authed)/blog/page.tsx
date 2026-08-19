import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { AdminButton, AdminCard, EyebrowText } from '@/components/admin/ui'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
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
  // Yayındakiler üstte; gerisi alfabetik sırada kalır, böylece kapalı bir ülkenin
  // blog sayfası buradan açılabilir.
  const sorted = [...countries].sort(
    (a, b) => Number(b.has_tourism) - Number(a.has_tourism)
  )
  const activeCount = countries.filter((c) => c.has_tourism).length

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Blog' }]} />
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <EyebrowText>— Blog</EyebrowText>
          <h1 className="font-serif text-[36px] font-bold tracking-[-0.02em] text-navy mt-1">
            Blog
          </h1>
          <p className="font-mono text-[11px] text-navy/65 mt-2 max-w-md">
            Blog yazıları ve ülke turizm sayfaları buradan düzenlenir. Ülke turizm içeriği
            artık ülke formunda değil, bu bölümdedir.
          </p>
        </div>
        <Link href="/blog">
          <AdminButton variant="secondary">Blogu Görüntüle</AdminButton>
        </Link>
      </div>

      {/* Sabit yazılar */}
      <div className="mb-10">
        <AdminCard>
          <EyebrowText className="mb-4">— Yazılar</EyebrowText>
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <h2 className="font-serif text-[22px] font-bold text-navy">Schengen Rehberi</h2>
              <p className="font-mono text-[11px] text-navy/65 mt-2 max-w-lg">
                Ret nedenleri, ret maddeleri, ret sonrası ve ilk başvuru bölümlerinden oluşan
                tek sayfalık rehber.{' '}
                <Link
                  href="/blog/schengen-vize-alma-rehberi"
                  className="text-coral hover:text-navy transition-colors"
                >
                  /blog/schengen-vize-alma-rehberi
                </Link>
              </p>
            </div>
            <Link href="/admin/blog/schengen">
              <AdminButton variant="primary">Düzenle</AdminButton>
            </Link>
          </div>
        </AdminCard>
      </div>

      {/* Ülke turizm sayfaları */}
      <div className="mb-4 flex items-baseline justify-between gap-4 flex-wrap">
        <EyebrowText>— Ülke Turizm Sayfaları</EyebrowText>
        <p className="font-mono text-[10px] tracking-widest uppercase text-navy/50">
          {activeCount} / {countries.length} yayında
        </p>
      </div>

      <div className="border border-navy/10 bg-white overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-navy/10">
              {['Ülke', 'Slug', 'Kapak', 'Durum', 'Yayın', ''].map((heading) => (
                <th
                  key={heading}
                  className="py-3 px-4 text-left font-mono text-[10px] tracking-widest uppercase text-navy/60"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((country) => (
              <tr key={country.id} className="border-b border-navy/8">
                <td className="py-3 px-4 font-serif text-[16px] font-medium text-navy">
                  {country.name}
                </td>
                <td className="py-3 px-4 font-mono text-[11px] text-navy/90">{country.slug}</td>
                <td className="py-3 px-4">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-navy/90">
                    {country.tourism_hero_image_url ? 'Var' : 'Yok'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`font-mono text-[10px] tracking-widest uppercase ${
                      country.has_tourism ? 'text-coral' : 'text-navy/40'
                    }`}
                  >
                    {country.has_tourism ? 'Yayında' : 'Kapalı'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {country.has_tourism ? (
                    <Link
                      href={`/blog/${country.slug}`}
                      className="font-mono text-[10px] tracking-widest uppercase text-navy hover:text-coral transition-colors"
                    >
                      Görüntüle
                    </Link>
                  ) : (
                    <span className="font-mono text-[10px] tracking-widest uppercase text-navy/30">
                      —
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <Link
                    href={`/admin/blog/${country.id}`}
                    className="font-mono text-[10px] tracking-widest uppercase text-navy hover:text-coral transition-colors"
                  >
                    Düzenle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {countries.length === 0 && (
          <div className="py-10 text-center">
            <p className="font-mono text-[12px] text-navy/30 mb-4">Henüz ülke kaydı yok.</p>
            <Link href="/admin/countries">
              <AdminButton variant="primary">Ülke Ekle</AdminButton>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
