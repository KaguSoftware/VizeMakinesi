'use client'

import { AdminInput, AdminTextarea } from '@/components/admin/ui'
import { Divider, FieldError } from './shared'
import type { ValidationError } from '../validation'

interface Props {
  name: string
  slug: string
  flagEmoji: string
  visaType: string
  summary: string
  appointmentDays: string
  slugError: string | null
  slugChecking: boolean
  errors: ValidationError[]
  onNameChange: (val: string) => void
  onSlugChange: (val: string) => void
  onSlugBlur: () => void
  onFlagEmojiChange: (val: string) => void
  onVisaTypeChange: (val: string) => void
  onSummaryChange: (val: string) => void
  onAppointmentDaysChange: (val: string) => void
  /** Randevu süresi bölümü ilgili ülke sayfasında gösterilmiyorsa gizlenir (ör. Schengen). */
  showAppointmentDays?: boolean
}

export default function TemelSection({
  name,
  slug,
  flagEmoji,
  visaType,
  summary,
  appointmentDays,
  slugError,
  slugChecking,
  errors,
  onNameChange,
  onSlugChange,
  onSlugBlur,
  onFlagEmojiChange,
  onVisaTypeChange,
  onSummaryChange,
  onAppointmentDaysChange,
  showAppointmentDays = true,
}: Props) {
  return (
    <>
      <Divider id="temel" label="Temel Bilgiler" />

      <div className="flex flex-col gap-6">
        <div>
          <AdminInput
            label="Ad"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
          <FieldError errors={errors} field="name" />
        </div>

        <div>
          <AdminInput
            label="Slug"
            value={slug}
            onChange={(e) => onSlugChange(e.target.value)}
            onBlur={onSlugBlur}
          />
          {slugChecking && (
            <p className="font-mono text-[11px] text-navy/60 mt-1">Slug kontrol ediliyor…</p>
          )}
          {!slugChecking && (slugError
            ? <p className="font-mono text-[11px] text-red-500 mt-1">{slugError}</p>
            : <FieldError errors={errors} field="slug" />
          )}
        </div>

        <div>
          <AdminInput
            label="Bayrak Emoji"
            value={flagEmoji}
            onChange={(e) => onFlagEmojiChange(e.target.value)}
            placeholder="🇹🇷"
          />
          <FieldError errors={errors} field="flag_emoji" />
        </div>

        <div>
          <AdminInput
            label="Vize Türü"
            value={visaType}
            onChange={(e) => onVisaTypeChange(e.target.value)}
            placeholder="Örn: Schengen Vizesi"
          />
          <FieldError errors={errors} field="visa_type" />
        </div>

        <div>
          <AdminTextarea
            label="Özet"
            value={summary}
            onChange={(e) => onSummaryChange(e.target.value)}
            rows={3}
          />
          <FieldError errors={errors} field="summary" />
        </div>

        {showAppointmentDays && (
        <div>
          <AdminInput
            label="Tahmini Randevu Süresi"
            value={appointmentDays}
            onChange={(e) => onAppointmentDaysChange(e.target.value)}
            placeholder="Örn: 2-3 hafta"
          />
          <p className="mt-1 font-mono text-[11px] text-navy/70">
            Boş bırakılırsa ilgili bölüm gösterilmez.
          </p>
        </div>
        )}
      </div>
    </>
  )
}
