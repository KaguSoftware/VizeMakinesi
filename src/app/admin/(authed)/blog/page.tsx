import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getBlogSchengenPage } from '@/lib/data/blogSchengenPage'
import { AdminButton, AdminCard, EyebrowText } from '@/components/admin/ui'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import { normalizeArticles } from '@/lib/blog/articles'

interface CountryRow {
  id: string
  name: string
  slug: string
  has_tourism: boolean
  tourism_hero_image_url: string | null
  blog_articles: unknown
}

export default async function AdminBlogPage() {
  const supabase = await createClient()
  const guide = await getBlogSchengenPage()
  const { data } = await supabase
    .from('countries')
    .select('id, name, slug, has_tourism, tourism_hero_image_url, blog_articles')
    .order('name', { ascending: true })

  const countries = ((data ?? []) as CountryRow[]).map((c) => ({
    ...c,
    articleCount: normalizeArticles(c.blog_articles).length,
  }))
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
            Bütün makaleler /blog akışında tek listede görünür ve her biri kendi sayfasında
            açılır. Makaleler bu bölümden eklenip çıkarılır.
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
                {guide.articles.length} makale. Hepsi{' '}
                <Link href="/blog" className="text-coral hover:text-navy transition-colors">
                  /blog
                </Link>{' '}
                akışında listelenir; adresleri /blog/schengen-vize-alma-rehberi/… biçimindedir.
              </p>
            </div>
            <Link href="/admin/blog/schengen">
              <AdminButton variant="primary">Düzenle</AdminButton>
            </Link>
          </div>
        </AdminCard>
      </div>

      {/* Ülke blogları */}
      <div className="mb-4 flex items-baseline justify-between gap-4 flex-wrap">
        <EyebrowText>— Ülke Blogları</EyebrowText>
        <p className="font-mono text-[10px] tracking-widest uppercase text-navy/50">
          {activeCount} / {countries.length} yayında
        </p>
      </div>

      <div className="border border-navy/10 bg-white overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-navy/10">
              {['Ülke', 'Slug', 'Makale', 'Görsel', 'Durum', 'Akış', ''].map((heading) => (
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
                  <span
                    className={`font-mono text-[11px] ${
                      country.articleCount > 0 ? 'text-navy/90' : 'text-navy/30'
                    }`}
                  >
                    {country.articleCount}
                  </span>
                </td>
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
                  {country.has_tourism && country.articleCount > 0 ? (
                    <Link
                      href="/blog"
                      className="font-mono text-[10px] tracking-widest uppercase text-navy hover:text-coral transition-colors"
                    >
                      Akışta gör
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
