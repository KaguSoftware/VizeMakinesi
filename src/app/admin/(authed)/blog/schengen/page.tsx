import Link from 'next/link'
import { EyebrowText } from '@/components/admin/ui'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import { getBlogSchengenPage } from '@/lib/data/blogSchengenPage'
import BlogSchengenForm from './BlogSchengenForm'

export default async function BlogSchengenAdminPage() {
  const content = await getBlogSchengenPage()

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Blog', href: '/admin/blog' },
          { label: 'Schengen Rehberi' },
        ]}
      />
      <div className="mb-10">
        <EyebrowText>— Blog Yazısı</EyebrowText>
        <h1 className="font-serif text-[36px] font-bold tracking-[-0.02em] text-navy mt-1">
          Schengen Rehberi
        </h1>
        <p className="font-mono text-[12px] text-navy/70 mt-2">
          <Link
            href="/blog/schengen-vize-alma-rehberi"
            className="text-coral hover:text-navy transition-colors"
          >
            /blog/schengen-vize-alma-rehberi
          </Link>{' '}
          yazısının tüm bölümleri.
        </p>
      </div>

      <BlogSchengenForm initial={content} />
    </div>
  )
}
