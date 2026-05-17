'use client'

import { useState, useTransition } from 'react'
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminTextarea,
  AdminLabel,
  EyebrowText,
  RepeatableList,
  useToast,
} from '@/components/admin/ui'
import type { RepeatableItem } from '@/components/admin/ui/RepeatableList'
import { upsertPageSection } from './actions'

interface ParagraphItem extends RepeatableItem {
  text: string
}

interface Props {
  initialTitle: string
  initialParagraphs: string[]
}

export default function AboutForm({ initialTitle, initialParagraphs }: Props) {
  const [title, setTitle] = useState(initialTitle)
  const [paragraphs, setParagraphs] = useState<ParagraphItem[]>(
    initialParagraphs.map((text) => ({ id: crypto.randomUUID(), text }))
  )
  const { showToast } = useToast()
  const [isPending, startTransition] = useTransition()

  function handleSave() {
    startTransition(async () => {
      const result = await upsertPageSection(
        'about_tarihce',
        title,
        paragraphs.map((p) => p.text).filter(Boolean)
      )
      if (result.error) {
        showToast(result.error, 'error')
      } else {
        showToast('Kaydedildi', 'success')
      }
    })
  }

  return (
    <AdminCard>
      <EyebrowText className="mb-6">— Tarihimiz Bölümü</EyebrowText>

      <div className="flex flex-col gap-6">
        <AdminInput
          label="Başlık"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Başlık..."
        />

        <div>
          <AdminLabel>Paragraflar</AdminLabel>
          <div className="mt-1.5">
            <RepeatableList<ParagraphItem>
              items={paragraphs}
              onChange={setParagraphs}
              addLabel="Paragraf Ekle"
              emptyText="Henüz paragraf eklenmedi"
              onAdd={() => setParagraphs((prev) => [...prev, { id: crypto.randomUUID(), text: '' }])}
              renderItem={(item) => (
                <AdminTextarea
                  label="Paragraf"
                  value={item.text}
                  rows={3}
                  placeholder="Paragraf metni..."
                  onChange={(e) => {
                    setParagraphs((prev) =>
                      prev.map((p) => (p.id === item.id ? { ...p, text: e.target.value } : p))
                    )
                  }}
                />
              )}
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <AdminButton onClick={handleSave} disabled={isPending}>
            {isPending ? 'Kaydediliyor…' : 'Kaydet'}
          </AdminButton>
        </div>
      </div>
    </AdminCard>
  )
}
