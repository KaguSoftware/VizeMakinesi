'use client'

import { useState, useTransition } from 'react'
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminTextarea,
  AdminLabel,
  EyebrowText,
  PdfUploader,
  RepeatableList,
  useToast,
} from '@/components/admin/ui'
import type { RepeatableItem } from '@/components/admin/ui/RepeatableList'
import { saveVisaTypeFaqs, saveVisaTypeDocuments } from './actions'

export interface VisaTypeSectionData {
  pageKey: string
  label: string
  /** Public URL this content appears on. */
  path: string
  faqs: { q: string; a: string }[]
  documents: { label: string; pdf_url: string }[]
  /** The landing page has an SSS block but no documents section. */
  hasDocuments: boolean
}

interface FaqRow extends RepeatableItem {
  question: string
  answer: string
}

interface DocRow extends RepeatableItem {
  label: string
  pdf_url: string
}

function mkFaq(question = '', answer = ''): FaqRow {
  return { id: crypto.randomUUID(), question, answer }
}

function mkDoc(label = '', pdf_url = ''): DocRow {
  return { id: crypto.randomUUID(), label, pdf_url }
}

/* ─────────────────────────── SSS ─────────────────────────── */

function FaqEditor({ section }: { section: VisaTypeSectionData }) {
  const [items, setItems] = useState<FaqRow[]>(section.faqs.map((f) => mkFaq(f.q, f.a)))
  const { showToast } = useToast()
  const [isPending, startTransition] = useTransition()

  function update(id: string, patch: Partial<FaqRow>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  }

  function handleSave() {
    startTransition(async () => {
      const payload = items
        .map((it) => ({ question: it.question.trim(), answer: it.answer.trim() }))
        // Drop rows the editor added but never filled in.
        .filter((it) => it.question || it.answer)

      const result = await saveVisaTypeFaqs(section.pageKey, payload)
      if (result.error) showToast(result.error, 'error')
      else showToast('SSS kaydedildi', 'success')
    })
  }

  return (
    <AdminCard>
      <div className="mb-6">
        <EyebrowText>— Sıkça Sorulan Sorular</EyebrowText>
        <p className="font-mono text-[11px] text-navy/60 mt-1.5">{items.length} soru</p>
      </div>

      <AdminLabel>SSS</AdminLabel>
      <div className="mt-1.5">
        <RepeatableList<FaqRow>
          items={items}
          onChange={setItems}
          addLabel="Soru Ekle"
          emptyText="Henüz soru eklenmedi"
          onAdd={() => setItems((prev) => [...prev, mkFaq()])}
          hasContent={(it) => Boolean(it.question.trim() || it.answer.trim())}
          renderItem={(item) => (
            <div className="flex flex-col gap-3">
              <AdminInput
                label="Soru"
                value={item.question}
                placeholder="Soru..."
                onChange={(e) => update(item.id, { question: e.target.value })}
              />
              <AdminTextarea
                label="Cevap"
                value={item.answer}
                rows={4}
                placeholder="Cevap..."
                onChange={(e) => update(item.id, { answer: e.target.value })}
              />
            </div>
          )}
        />
      </div>

      <div className="flex justify-end pt-6">
        <AdminButton onClick={handleSave} disabled={isPending}>
          {isPending ? 'Kaydediliyor…' : 'SSS Kaydet'}
        </AdminButton>
      </div>
    </AdminCard>
  )
}

/* ──────────────────────── Belgeler (PDF) ──────────────────────── */

function DocumentsEditor({ section }: { section: VisaTypeSectionData }) {
  const [items, setItems] = useState<DocRow[]>(
    section.documents.map((d) => mkDoc(d.label, d.pdf_url)),
  )
  const { showToast } = useToast()
  const [isPending, startTransition] = useTransition()

  function update(id: string, patch: Partial<DocRow>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  }

  function handleSave() {
    startTransition(async () => {
      const payload = items
        .map((it) => ({ label: it.label.trim(), pdf_url: it.pdf_url.trim() }))
        .filter((it) => it.label || it.pdf_url)

      const result = await saveVisaTypeDocuments(section.pageKey, payload)
      if (result.error) showToast(result.error, 'error')
      else showToast('Belgeler kaydedildi', 'success')
    })
  }

  return (
    <AdminCard>
      <div className="mb-6">
        <EyebrowText>— Gerekli Belgeler (PDF)</EyebrowText>
        <p className="font-mono text-[11px] text-navy/60 mt-1.5">
          {items.length} belge · sayfadaki &quot;Gerekli Belgeler&quot; bölümünde indirilebilir
          kart olarak görünür
        </p>
      </div>

      <AdminLabel>Belgeler</AdminLabel>
      <div className="mt-1.5">
        <RepeatableList<DocRow>
          items={items}
          onChange={setItems}
          addLabel="Yeni Belge Ekle"
          emptyText="Henüz belge eklenmedi"
          onAdd={() => setItems((prev) => [...prev, mkDoc()])}
          hasContent={(it) => Boolean(it.label.trim() || it.pdf_url.trim())}
          renderItem={(item) => (
            <div className="flex flex-col gap-3">
              <AdminInput
                label="Belge Adı"
                value={item.label}
                placeholder="Örn: Turistik Vize Başvuru Formu"
                onChange={(e) => update(item.id, { label: e.target.value })}
              />
              <PdfUploader
                value={item.pdf_url}
                onChange={(url) => update(item.id, { pdf_url: url })}
              />
            </div>
          )}
        />
      </div>

      <div className="flex justify-end pt-6">
        <AdminButton onClick={handleSave} disabled={isPending}>
          {isPending ? 'Kaydediliyor…' : 'Belgeleri Kaydet'}
        </AdminButton>
      </div>
    </AdminCard>
  )
}

/* ──────────────────────────── Shell ──────────────────────────── */

/**
 * Visa-type picker plus the editors for the selected one.
 *
 * Rendering all nine pages at once made this screen unusably long, so only the
 * selected page's sections are mounted. Each editor still saves independently.
 * The selected key is part of the component key of the editors below, so
 * switching pages remounts them with that page's data.
 */
export default function VisaTypesEditor({ sections }: { sections: VisaTypeSectionData[] }) {
  const [selectedKey, setSelectedKey] = useState(sections[0]?.pageKey ?? '')
  const selected = sections.find((s) => s.pageKey === selectedKey) ?? sections[0]

  if (!selected) return null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 items-start">
      {/* Picker */}
      <nav
        aria-label="Vize türü seç"
        className="flex flex-col gap-1 lg:sticky lg:top-8 border border-border rounded-lg p-2 bg-white"
      >
        {sections.map((s) => {
          const isActive = s.pageKey === selected.pageKey
          return (
            <button
              key={s.pageKey}
              type="button"
              onClick={() => setSelectedKey(s.pageKey)}
              aria-current={isActive ? 'true' : undefined}
              className={[
                'text-left px-3 py-2.5 rounded-sm font-mono text-[11px] tracking-widest uppercase transition-colors duration-150',
                isActive
                  ? 'bg-navy text-cream font-semibold'
                  : 'text-navy/75 hover:text-navy hover:bg-navy/5',
              ].join(' ')}
            >
              {s.label}
            </button>
          )
        })}
      </nav>

      {/* Editors for the selected page only */}
      <div className="flex flex-col gap-6 min-w-0">
        <div>
          <h2 className="font-serif text-[24px] font-bold tracking-[-0.02em] text-navy">
            {selected.label}
          </h2>
          <p className="font-mono text-[11px] text-navy/60 mt-1.5">{selected.path}</p>
        </div>

        <FaqEditor key={`faq-${selected.pageKey}`} section={selected} />

        {selected.hasDocuments && (
          <DocumentsEditor key={`doc-${selected.pageKey}`} section={selected} />
        )}
      </div>
    </div>
  )
}
