'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AdminButton,
  AdminInput,
  ImageUploader,
  useToast,
} from '@/components/admin/ui'
import { useDirtyFromSnapshot, useUnsavedChanges } from '@/lib/hooks/useUnsavedChanges'
import { createTeamMember, updateTeamMember } from './actions'
import type { Database } from '@/lib/supabase/database.types'

type TeamMemberRow = Database['public']['Tables']['team_members']['Row']

function suggestInitials(name: string) {
  return name.split(/\s+/).filter(Boolean).map((w) => w[0].toUpperCase()).join('')
}

interface Props {
  member?: TeamMemberRow
}

export default function TeamMemberForm({ member }: Props) {
  const router = useRouter()
  const { showToast } = useToast()
  const isEdit = !!member

  const [name, setName] = useState(member?.name ?? '')
  const [role, setRole] = useState(member?.role ?? '')
  const [initials, setInitials] = useState(member?.initials ?? '')
  const [photoUrl, setPhotoUrl] = useState(member?.photo_url ?? '')
  const [visible, setVisible] = useState(member?.visible ?? true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const dirty = useDirtyFromSnapshot({ name, role, initials, photoUrl, visible })

  useUnsavedChanges(dirty && !saving && !submitted)

  function handleNameChange(val: string) {
    setName(val)
    if (errors.name) setErrors((p) => ({ ...p, name: '' }))
    if (!isEdit || !member?.initials) setInitials(suggestInitials(val))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Ad zorunludur'
    if (!role.trim()) errs.role = 'Rol zorunludur'
    if (!initials.trim()) errs.initials = 'Baş harfler zorunludur'
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSaving(true)
    setErrors({})

    const data = { name, role, initials, photo_url: photoUrl, visible }

    const result = isEdit
      ? await updateTeamMember(member.id, data)
      : await createTeamMember(data)

    if ('error' in result && result.error) {
      setErrors({ _form: result.error })
      showToast(result.error, 'error')
      setSaving(false)
      return
    }

    showToast(isEdit ? 'Üye güncellendi' : 'Üye oluşturuldu')
    setSubmitted(true)
    router.push('/admin/team')
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl flex flex-col gap-6">
      <div>
        <AdminInput label="Ad Soyad" value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Adı Soyadı" required />
        {errors.name && <p className="font-mono text-[11px] text-coral mt-1">{errors.name}</p>}
      </div>
      <div>
        <AdminInput label="Rol" value={role} onChange={(e) => { setRole(e.target.value); if (errors.role) setErrors((p) => ({ ...p, role: '' })) }} placeholder="Vize Danışmanı" required />
        {errors.role && <p className="font-mono text-[11px] text-coral mt-1">{errors.role}</p>}
      </div>
      <div>
        <AdminInput label="Baş Harfler" value={initials} onChange={(e) => { setInitials(e.target.value.toUpperCase()); if (errors.initials) setErrors((p) => ({ ...p, initials: '' })) }} placeholder="AB" maxLength={4} required />
        {errors.initials && <p className="font-mono text-[11px] text-coral mt-1">{errors.initials}</p>}
        <p className="font-mono text-[10px] text-navy/40 mt-0.5">En fazla 4 karakter</p>
      </div>

      {/* Photo with initials preview fallback */}
      <div className="flex items-center gap-6">
        {!photoUrl && (
          <div className="w-[72px] h-[72px] rounded-full border border-navy flex items-center justify-center font-serif italic text-[26px] text-navy shrink-0">
            {initials || '?'}
          </div>
        )}
        <ImageUploader
          bucket="team-photos"
          value={photoUrl}
          onChange={setPhotoUrl}
          label="Fotoğraf"
          previewClassName="w-[72px] h-[72px] rounded-full"
        />
      </div>

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
        <AdminButton type="button" variant="secondary" onClick={() => router.push('/admin/team')}>
          İptal
        </AdminButton>
      </div>
    </form>
  )
}
