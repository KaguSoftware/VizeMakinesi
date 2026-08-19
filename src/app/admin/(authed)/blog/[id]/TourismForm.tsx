'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminLabel,
  AdminTextarea,
  EyebrowText,
  ImageUploader,
  RepeatableList,
  useToast,
  type RepeatableItem,
} from '@/components/admin/ui'
import { useDirtyFromSnapshot, useDirtyGuard, useUnsavedChanges } from '@/lib/hooks/useUnsavedChanges'
import { updateCountryTourism } from '../actions'

interface TextItem extends RepeatableItem { text: string }
const mkText = (text = ''): TextItem => ({ id: crypto.randomUUID(), text })

export interface TourismInitial {
  id: string
  name: string
  slug: string
  has_tourism: boolean
  tourism_hero_image_url: string | null
  tourism_intro: string[] | null
  tourism_highlights: string[] | null
  tourism_tips: string[] | null
  tourism_best_time: string | null
}

export default function TourismForm({ initial }: { initial: TourismInitial }) {
  const router = useRouter()
  const { showToast } = useToast()
  const { confirmDiscard } = useDirtyGuard()
  const [isPending, startTransition] = useTransition()
  const [savedAt, setSavedAt] = useState(0)

  const [hasTourism, setHasTourism] = useState(initial.has_tourism)
  const [heroUrl, setHeroUrl] = useState(initial.tourism_hero_image_url ?? '')
  const [intro, setIntro] = useState<TextItem[]>((initial.tourism_intro ?? []).map((t) => mkText(t)))
  const [highlights, setHighlights] = useState<TextItem[]>(
    (initial.tourism_highlights ?? []).map((t) => mkText(t))
  )
  const [tips, setTips] = useState<TextItem[]>((initial.tourism_tips ?? []).map((t) => mkText(t)))
  const [bestTime, setBestTime] = useState(initial.tourism_best_time ?? '')

  const dirty = useDirtyFromSnapshot(
    {
      hasTourism,
      heroUrl,
      intro: intro.map((t) => t.text),
      highlights: highlights.map((t) => t.text),
      tips: tips.map((t) => t.text),
      bestTime,
    },
    savedAt
  )

  useUnsavedChanges(dirty && !isPending)

  function handleCancel() {
    if (confirmDiscard()) router.push('/admin/blog')
  }

  function handleSave() {
    startTransition(async () => {
      const result = await updateCountryTourism(initial.id, initial.slug, {
        has_tourism: hasTourism,
        tourism_hero_image_url: heroUrl || null,
        tourism_intro: intro.map((t) => t.text).filter(Boolean),
        tourism_highlights: highlights.map((t) => t.text).filter(Boolean),
        tourism_tips: tips.map((t) => t.text).filter(Boolean),
        tourism_best_time: bestTime || null,
      })

      if (result.error) {
        showToast(result.error, 'error')
      } else {
        setSavedAt(Date.now())
        showToast('Kaydedildi', 'success')
        router.refresh()
      }
    })
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <AdminCard>
        <EyebrowText className="mb-6">— Yayın Durumu</EyebrowText>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={hasTourism}
            onChange={(e) => setHasTourism(e.target.checked)}
            className="accent-coral w-4 h-4"
          />
          <span className="font-mono text-[11px] tracking-widest uppercase text-navy/85">
            Blog / Turizm sayfası aktif
          </span>
        </label>
        <p className="font-mono text-[11px] text-navy/60 mt-3">
          Kapatıldığında sayfa yayından kalkar; girilen içerik silinmez.
        </p>
      </AdminCard>

      {hasTourism && (
        <AdminCard>
          <EyebrowText className="mb-6">— İçerik</EyebrowText>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <AdminLabel>Kapak Görseli</AdminLabel>
              <ImageUploader
                bucket="country-tourism"
                value={heroUrl}
                onChange={setHeroUrl}
                label="Kapak Görseli"
                previewClassName="w-48 h-28"
              />
            </div>

            <div>
              <AdminLabel className="mb-3 block">Giriş Paragrafları</AdminLabel>
              <RepeatableList<TextItem>
                items={intro}
                onChange={setIntro}
                onAdd={() => setIntro([...intro, mkText()])}
                addLabel="Paragraf Ekle"
                emptyText="Henüz paragraf eklenmedi"
                hasContent={(i) => !!i.text}
                renderItem={(item, index) => (
                  <AdminTextarea
                    label={`Paragraf ${index + 1}`}
                    value={item.text}
                    rows={3}
                    onChange={(e) =>
                      setIntro(intro.map((t) => (t.id === item.id ? { ...t, text: e.target.value } : t)))
                    }
                  />
                )}
              />
            </div>

            <div>
              <AdminLabel className="mb-3 block">Öne Çıkanlar</AdminLabel>
              <RepeatableList<TextItem>
                items={highlights}
                onChange={setHighlights}
                onAdd={() => setHighlights([...highlights, mkText()])}
                addLabel="Öne Çıkan Ekle"
                emptyText="Henüz öğe eklenmedi"
                hasContent={(i) => !!i.text}
                renderItem={(item, index) => (
                  <AdminInput
                    label={`Öne Çıkan ${index + 1}`}
                    value={item.text}
                    onChange={(e) =>
                      setHighlights(
                        highlights.map((t) => (t.id === item.id ? { ...t, text: e.target.value } : t))
                      )
                    }
                  />
                )}
              />
            </div>

            <div>
              <AdminLabel className="mb-3 block">İpuçları</AdminLabel>
              <RepeatableList<TextItem>
                items={tips}
                onChange={setTips}
                onAdd={() => setTips([...tips, mkText()])}
                addLabel="İpucu Ekle"
                emptyText="Henüz ipucu eklenmedi"
                hasContent={(i) => !!i.text}
                renderItem={(item, index) => (
                  <AdminInput
                    label={`İpucu ${index + 1}`}
                    value={item.text}
                    onChange={(e) =>
                      setTips(tips.map((t) => (t.id === item.id ? { ...t, text: e.target.value } : t)))
                    }
                  />
                )}
              />
            </div>

            <AdminInput
              label="En İyi Ziyaret Zamanı"
              value={bestTime}
              onChange={(e) => setBestTime(e.target.value)}
              placeholder="Örn: Nisan – Ekim"
            />
          </div>
        </AdminCard>
      )}

      <div className="flex items-center gap-4">
        <AdminButton variant="primary" onClick={handleSave} disabled={isPending}>
          {isPending ? 'Kaydediliyor…' : 'Kaydet'}
        </AdminButton>
        <AdminButton variant="secondary" onClick={handleCancel} disabled={isPending}>
          İptal
        </AdminButton>
        {dirty && !isPending && (
          <span className="font-mono text-[11px] text-coral">Kaydedilmemiş değişiklikler var</span>
        )}
      </div>
    </div>
  )
}
