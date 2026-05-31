'use client'

import {
  AdminInput,
  AdminTextarea,
  AdminLabel,
  ImageUploader,
  RepeatableList,
} from '@/components/admin/ui'
import { Divider, FieldError, mkText, type TextItem } from './shared'
import type { ValidationError } from '../validation'

interface Props {
  hasTourism: boolean
  tourismHeroUrl: string
  tourismIntro: TextItem[]
  tourismHighlights: TextItem[]
  tourismTips: TextItem[]
  tourismBestTime: string
  errors: ValidationError[]
  onHasTourismChange: (val: boolean) => void
  onTourismHeroUrlChange: (val: string) => void
  onTourismIntroChange: (val: TextItem[]) => void
  onTourismHighlightsChange: (val: TextItem[]) => void
  onTourismTipsChange: (val: TextItem[]) => void
  onTourismBestTimeChange: (val: string) => void
}

export default function TourismSection({
  hasTourism,
  tourismHeroUrl,
  tourismIntro,
  tourismHighlights,
  tourismTips,
  tourismBestTime,
  errors,
  onHasTourismChange,
  onTourismHeroUrlChange,
  onTourismIntroChange,
  onTourismHighlightsChange,
  onTourismTipsChange,
  onTourismBestTimeChange,
}: Props) {
  return (
    <>
      <Divider id="turizm" label="Turizm İçeriği" />

      <div className="flex flex-col gap-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={hasTourism}
            onChange={(e) => onHasTourismChange(e.target.checked)}
            className="accent-coral w-4 h-4"
          />
          <span className="font-mono text-[11px] tracking-widest uppercase text-navy/85">
            Blog / Turizm sayfası aktif
          </span>
        </label>

        {hasTourism && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <AdminLabel>Kapak Görseli</AdminLabel>
              <ImageUploader
                bucket="country-tourism"
                value={tourismHeroUrl}
                onChange={onTourismHeroUrlChange}
                label="Kapak Görseli"
                previewClassName="w-48 h-28"
              />
            </div>

            <div>
              <AdminLabel className="mb-3 block">Giriş Paragrafları</AdminLabel>
              <RepeatableList<TextItem>
                items={tourismIntro}
                onChange={onTourismIntroChange}
                onAdd={() => onTourismIntroChange([...tourismIntro, mkText()])}
                addLabel="Paragraf Ekle"
                emptyText="Henüz paragraf eklenmedi"
                renderItem={(item, index) => (
                  <AdminTextarea
                    label={`Paragraf ${index + 1}`}
                    value={item.text}
                    onChange={(e) => onTourismIntroChange(
                      tourismIntro.map((t) => t.id === item.id ? { ...t, text: e.target.value } : t)
                    )}
                    rows={2}
                  />
                )}
              />
              <FieldError errors={errors} field="tourism_intro" />
            </div>

            <div>
              <AdminLabel className="mb-3 block">Öne Çıkanlar</AdminLabel>
              <RepeatableList<TextItem>
                items={tourismHighlights}
                onChange={onTourismHighlightsChange}
                onAdd={() => onTourismHighlightsChange([...tourismHighlights, mkText()])}
                addLabel="Öne Çıkan Ekle"
                emptyText="Henüz öğe eklenmedi"
                renderItem={(item, index) => (
                  <AdminInput
                    label={`Öne Çıkan ${index + 1}`}
                    value={item.text}
                    onChange={(e) => onTourismHighlightsChange(
                      tourismHighlights.map((t) => t.id === item.id ? { ...t, text: e.target.value } : t)
                    )}
                  />
                )}
              />
              <FieldError errors={errors} field="tourism_highlights" />
            </div>

            <div>
              <AdminLabel className="mb-3 block">İpuçları</AdminLabel>
              <RepeatableList<TextItem>
                items={tourismTips}
                onChange={onTourismTipsChange}
                onAdd={() => onTourismTipsChange([...tourismTips, mkText()])}
                addLabel="İpucu Ekle"
                emptyText="Henüz ipucu eklenmedi"
                renderItem={(item, index) => (
                  <AdminInput
                    label={`İpucu ${index + 1}`}
                    value={item.text}
                    onChange={(e) => onTourismTipsChange(
                      tourismTips.map((t) => t.id === item.id ? { ...t, text: e.target.value } : t)
                    )}
                  />
                )}
              />
              <FieldError errors={errors} field="tourism_tips" />
            </div>

            <AdminInput
              label="En İyi Ziyaret Zamanı"
              value={tourismBestTime}
              onChange={(e) => onTourismBestTimeChange(e.target.value)}
              placeholder="Örn: Nisan – Ekim"
            />
          </div>
        )}
      </div>
    </>
  )
}
