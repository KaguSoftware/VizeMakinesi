import { createClient } from '@/lib/supabase/server'
import { EyebrowText } from '@/components/admin/ui'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import AboutForm from './AboutForm'
import type { Database } from '@/lib/supabase/database.types'

type PageSectionRow = Database['public']['Tables']['page_sections']['Row']

const DEFAULT_TITLE = '2006\'dan bugüne, sınırları aşan tecrübe.'
const DEFAULT_PARAGRAPHS = [
  'Her şey 2006 yılında, sınır ötesi deneyimlere yön veren Gezi Makinesi ile başladı. Biz sadece insanları bir noktadan diğerine taşımadık; binlerce gezginin hafızasına kazınan devasa festivalleri, Avrupa\'nın en prestijli kayak rotalarını ve her detayı incelikle düşünülmüş üst düzey yurtdışı organizasyonlarını bizzat organize ettik.',
]

export default async function AboutAdminPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('page_sections')
    .select('*')
    .eq('key', 'about_tarihce')
    .single()

  const section = data as PageSectionRow | null
  const title = section?.title || DEFAULT_TITLE
  const paragraphs = section?.paragraphs?.length ? section.paragraphs : DEFAULT_PARAGRAPHS

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/admin' }, { label: 'Hakkımızda' }]} />
      <div className="mb-10">
        <EyebrowText>— Hakkımızda</EyebrowText>
        <h1 className="font-serif text-[36px] font-bold tracking-[-0.02em] text-navy mt-1">
          Hakkımızda
        </h1>
      </div>

      <AboutForm initialTitle={title} initialParagraphs={paragraphs} />
    </div>
  )
}
