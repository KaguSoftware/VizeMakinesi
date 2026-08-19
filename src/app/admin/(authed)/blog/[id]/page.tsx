import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EyebrowText } from '@/components/admin/ui'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import TourismForm, { type TourismInitial } from './TourismForm'

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('countries')
    .select(
      'id, name, slug, has_tourism, tourism_hero_image_url, tourism_intro, tourism_highlights, tourism_tips, tourism_best_time'
    )
    .eq('id', id)
    .single()

  if (!data) notFound()
  const country = data as TourismInitial

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Blog', href: '/admin/blog' },
          { label: country.name },
        ]}
      />
      <div className="mb-10">
        <EyebrowText>— Turizm Sayfası</EyebrowText>
        <h1 className="font-serif text-[36px] font-bold tracking-[-0.02em] text-navy mt-1">
          {country.name}
        </h1>
        <p className="font-mono text-[12px] text-navy/70 mt-2">
          <Link href={`/blog/${country.slug}`} className="text-coral hover:text-navy transition-colors">
            /blog/{country.slug}
          </Link>{' '}
          sayfasının içeriği. Ülkenin vize bilgileri{' '}
          <Link
            href={`/admin/countries/${country.id}/edit`}
            className="text-coral hover:text-navy transition-colors"
          >
            Vizeler
          </Link>{' '}
          bölümünde düzenlenir.
        </p>
      </div>

      <TourismForm initial={country} />
    </div>
  )
}
