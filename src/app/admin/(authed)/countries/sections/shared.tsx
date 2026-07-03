// Shared helpers used by the CountryForm section components.

import type { RepeatableItem } from '@/components/admin/ui'
import type { ValidationError } from '../validation'

export interface TextItem extends RepeatableItem { text: string }
export interface FaqItem extends RepeatableItem { question: string; answer: string }
export interface DocumentItem extends RepeatableItem { label: string; pdf_url: string }

export function mkText(text = ''): TextItem {
  return { id: crypto.randomUUID(), text }
}

export function mkFaq(question = '', answer = ''): FaqItem {
  return { id: crypto.randomUUID(), question, answer }
}

export function mkDoc(label = '', pdf_url = ''): DocumentItem {
  return { id: crypto.randomUUID(), label, pdf_url }
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    // U+0300..U+036F is the "Combining Diacritical Marks" Unicode block.
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function Divider({ id, label }: { id?: string; label: string }) {
  return (
    <h2
      id={id}
      className="mt-12 mb-4 font-mono text-xs tracking-widest uppercase text-navy scroll-mt-24"
    >
      {label}
    </h2>
  )
}

export function FieldError({ errors, field }: { errors: ValidationError[]; field: string }) {
  const e = errors.find((e) => e.field === field)
  if (!e) return null
  return <p className="font-mono text-[11px] text-red-500 mt-1">{e.message}</p>
}

export const PRESET_KEYS = [
  { key: 'uk', label: 'İngiltere' },
  { key: 'germany', label: 'Almanya' },
  { key: 'france', label: 'Fransa' },
  { key: 'italy', label: 'İtalya' },
  { key: 'netherlands', label: 'Hollanda' },
  { key: 'usa', label: 'ABD' },
  { key: 'canada', label: 'Kanada' },
  { key: 'australia', label: 'Avustralya' },
  { key: 'uae', label: 'BAE' },
  { key: 'china', label: 'Çin' },
  { key: 'schengen', label: 'Schengen' },
  { key: 'ireland', label: 'İrlanda' },
]

export const MOSAIC_SPANS = [
  { value: 'col-span-12 md:col-span-3', label: 'Dar (3)' },
  { value: 'col-span-12 md:col-span-4', label: 'Orta (4)' },
  { value: 'col-span-12 md:col-span-5', label: 'Geniş (5)' },
  { value: 'col-span-12 md:col-span-7', label: 'Tam (7)' },
]

export const FORM_SECTIONS = [
  { id: 'temel', label: 'Temel Bilgiler' },
  { id: 'bayrak', label: 'Bayrak' },
  { id: 'mozaik', label: 'Ana Sayfa Mozaik' },
  { id: 'genel-bilgi', label: 'Genel Bilgi' },
  { id: 'pdf-belgeler', label: 'PDF Belgeler' },
  { id: 'sss', label: 'SSS' },
  { id: 'turizm', label: 'Turizm İçeriği' },
] as const
