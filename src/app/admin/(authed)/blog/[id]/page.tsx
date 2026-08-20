import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EyebrowText } from '@/components/admin/ui'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import { normalizeArticles } from '@/lib/blog/articles'
import CountryBlogForm, { type CountryBlogInitial } from './CountryBlogForm'

interface CountryRow {
  id: string
  name: string
  slug: string
  has_tourism: boolean
  tourism_hero_image_url: string | null
  blog_articles: unknown
}

export default async function EditCountryBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('countries')
    .select('id, name, slug, has_tourism, tourism_hero_image_url, blog_articles')
    .eq('id', id)
    .single()

  if (!data) notFound()
  const row = data as CountryRow

  const initial: CountryBlogInitial = {
    id: row.id,
    name: row.name,
    slug: row.slug,
    has_tourism: row.has_tourism,
    hero_image_url: row.tourism_hero_image_url,
    articles: normalizeArticles(row.blog_articles),
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Blog', href: '/admin/blog' },
          { label: row.name },
        ]}
      />
      <div className="mb-10">
        <EyebrowText>— Ülke Blogu</EyebrowText>
        <h1 className="font-serif text-[36px] font-bold tracking-[-0.02em] text-navy mt-1">
          {row.name}
        </h1>
        <p className="font-mono text-[12px] text-navy/70 mt-2">
          <Link href="/blog" className="text-coral hover:text-navy transition-colors">
            /blog
          </Link>{' '}
          akışında yayınlanan makaleler (adresleri /blog/{row.slug}/…). Ülkenin vize bilgileri{' '}
          <Link
            href={`/admin/countries/${row.id}/edit`}
            className="text-coral hover:text-navy transition-colors"
          >
            Vizeler
          </Link>{' '}
          bölümünde düzenlenir.
        </p>
      </div>

      <CountryBlogForm initial={initial} />
    </div>
  )
}
