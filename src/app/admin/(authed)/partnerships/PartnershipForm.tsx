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
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError('Ad zorunludur'); return }
    setSaving(true)
    setError('')

    const data = { name, eyebrow, description, logo_url: logoUrl, external_url: externalUrl, visible }

    const result = isEdit
      ? await updatePartnership(partnership.id, data)
      : await createPartnership(data)

    if ('error' in result && result.error) {
      setError(result.error)
      showToast(result.error, 'error')
      setSaving(false)
      return
    }

    showToast(isEdit ? 'Ortaklık güncellendi' : 'Ortaklık oluşturuldu')
    router.push('/admin/partnerships')
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl flex flex-col gap-6">
      <AdminInput
        label="Ad"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ortaklık adı"
        required
      />
      <AdminInput
        label="Eyebrow"
        value={eyebrow}
        onChange={(e) => setEyebrow(e.target.value)}
        placeholder="Kısa etiket (isteğe bağlı)"
      />
      <AdminTextarea
        label="Açıklama"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Açıklama metni"
        rows={4}
      />

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

      {error && <p className="font-mono text-[12px] text-coral">{error}</p>}

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
