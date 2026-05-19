'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AdminButton,
  AdminInput,
  AdminTextarea,
  EyebrowText,
  ImageUploader,
  useToast,
} from '@/components/admin/ui'
import { useDirtyFromSnapshot, useUnsavedChanges } from '@/lib/hooks/useUnsavedChanges'
import { createPartnership, updatePartnership } from './actions'
import type { Database } from '@/lib/supabase/database.types'

type PartnershipRow = Database['public']['Tables']['partnerships']['Row']

interface Props {
  partnership?: PartnershipRow
}

export default function PartnershipForm({ partnership }: Props) {
  const router = useRouter()
  const { showToast } = useToast()
  const isEdit = !!partnership

  const [name, setName] = useState(partnership?.name ?? '')
  const [eyebrow, setEyebrow] = useState(partnership?.eyebrow ?? '')
  const [description, setDescription] = useState(partnership?.description ?? '')
  const [logoUrl, setLogoUrl] = useState(partnership?.logo_url ?? '')
  const [externalUrl, setExternalUrl] = useState(partnership?.external_url ?? '')
  const [visible, setVisible] = useState(partnership?.visible ?? true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const dirty = useDirtyFromSnapshot({ name, eyebrow, description, logoUrl, externalUrl, visible })

  useUnsavedChanges(dirty && !saving && !submitted)

  function validate() {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Ad zorunludur'
    else if (name.length > 100) e.name = 'Ad en fazla 100 karakter olabilir'
    if (eyebrow.length > 60) e.eyebrow = 'Eyebrow en fazla 60 karakter olabilir'
    if (description.length > 600) e.description = 'Açıklama en fazla 600 karakter olabilir'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSaving(true)
    setErrors({})

    const data = { name, eyebrow, description, logo_url: logoUrl, external_url: externalUrl, visible }

    const result = isEdit
      ? await updatePartnership(partnership.id, data)
      : await createPartnership(data)

    if ('error' in result && result.error) {
      setErrors({ _form: result.error })
      showToast(result.error, 'error')
      setSaving(false)
      return
    }

    showToast(isEdit ? 'Ortaklık güncellendi' : 'Ortaklık oluşturuldu')
    setSubmitted(true)
    router.push('/admin/partnerships')
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl flex flex-col gap-6">
      <div>
        <AdminInput
          label="Ad"
          value={name}
          onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: '' })) }}
          placeholder="Ortaklık adı"
          required
        />
        {errors.name && <p className="font-mono text-[11px] text-coral mt-1">{errors.name}</p>}
        <p className="font-mono text-[10px] text-navy/40 mt-0.5 text-right">{name.length} / 100</p>
      </div>
      <div>
        <AdminInput
          label="Eyebrow"
          value={eyebrow}
          onChange={(e) => { setEyebrow(e.target.value); if (errors.eyebrow) setErrors((p) => ({ ...p, eyebrow: '' })) }}
          placeholder="Kısa etiket (isteğe bağlı)"
        />
        {errors.eyebrow && <p className="font-mono text-[11px] text-coral mt-1">{errors.eyebrow}</p>}
        <p className="font-mono text-[10px] text-navy/40 mt-0.5 text-right">{eyebrow.length} / 60</p>
      </div>
      <div>
        <AdminTextarea
          label="Açıklama"
          value={description}
          onChange={(e) => { setDescription(e.target.value); if (errors.description) setErrors((p) => ({ ...p, description: '' })) }}
          placeholder="Açıklama metni"
          rows={4}
        />
        {errors.description && <p className="font-mono text-[11px] text-coral mt-1">{errors.description}</p>}
        <p className="font-mono text-[10px] text-navy/40 mt-0.5 text-right">{description.length} / 600</p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4 mt-2 mb-2">
          <EyebrowText>— Logo</EyebrowText>
          <div className="flex-1 border-t border-navy/10" />
        </div>
        <ImageUploader
          bucket="partnership-logos"
          value={logoUrl}
          onChange={setLogoUrl}
          label="Logo"
          previewClassName="w-40 h-16"
        />
      </div>

      <AdminInput
        label="Harici URL"
        value={externalUrl}
        onChange={(e) => setExternalUrl(e.target.value)}
        placeholder="https://... (isteğe bağlı)"
        type="url"
      />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className={['font-mono text-[11px] tracking-widest uppercase px-4 py-2 border transition-colors', visible ? 'bg-coral border-coral text-navy' : 'bg-transparent border-navy/30 text-navy/65 hover:border-navy/60'].join(' ')}
        >
          {visible ? 'Görünür' : 'Gizli'}
        </button>
      </div>

      {errors._form && <p className="font-mono text-[12px] text-coral">{errors._form}</p>}

      <div className="flex items-center gap-3 pt-2">
        <AdminButton type="submit" variant="primary" disabled={saving}>
          {saving ? 'Kaydediliyor...' : isEdit ? 'Kaydet' : 'Oluştur'}
        </AdminButton>
        <AdminButton type="button" variant="secondary" onClick={() => router.push('/admin/partnerships')}>
          İptal
        </AdminButton>
      </div>
    </form>
  )
}
