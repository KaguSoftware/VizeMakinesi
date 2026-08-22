import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EyebrowText } from '@/components/admin/ui'
import { Breadcrumbs } from '@/components/admin/Breadcrumbs'
import CountryForm from '../../CountryForm'
import type { CountryWithRelations } from '@/lib/data/countries'
import type { Database } from '@/lib/supabase/database.types'

type CountryRow = Database['public']['Tables']['countries']['Row']
type RequirementRow = Database['public']['Tables']['country_requirements']['Row']
type FaqRow = Database['public']['Tables']['country_faqs']['Row']
type DocumentRow = Database['public']['Tables']['country_documents']['Row']
type VisaTypeRow = Database['public']['Tables']['country_visa_types']['Row']

export default async function EditCountryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: country } = await supabase.from('countries').select('*').eq('id', id).single()
  if (!country) notFound()

  const [reqsRes, faqsRes, docsRes, visaTypesRes] = await Promise.all([
    supabase.from('country_requirements').select('*').eq('country_id', id).order('sort_order'),
    supabase.from('country_faqs').select('*').eq('country_id', id).order('sort_order'),
    supabase.from('country_documents').select('*').eq('country_id', id).order('sort_order'),
    supabase.from('country_visa_types').select('*').eq('country_id', id).order('sort_order'),
  ])

  const full: CountryWithRelations = {
    ...(country as CountryRow),
    requirements: (reqsRes.data ?? []) as RequirementRow[],
    faqs: (faqsRes.data ?? []) as FaqRow[],
    documents: (docsRes.data ?? []) as DocumentRow[],
    visa_types: (visaTypesRes.data ?? []) as VisaTypeRow[],
  }

  return (
    <div>
      <Breadcrumbs items={[
        { label: 'Dashboard', href: '/admin' },
        { label: 'Vizeler', href: '/admin/countries' },
        { label: full.name },
      ]} />
      <EyebrowText>— 01 / Vizeler</EyebrowText>
      <h1 className="font-serif text-[36px] font-bold tracking-[-0.02em] text-navy mt-1 mb-2">
        {full.name}
      </h1>
      <CountryForm country={full} />
    </div>
  )
}
