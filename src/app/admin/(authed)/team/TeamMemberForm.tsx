'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AdminButton,
  AdminInput,
  ImageUploader,
  useToast,
} from '@/components/admin/ui'
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
  const [error, setError] = useState('')

  function handleNameChange(val: string) {
    setName(val)
    if (!isEdit || !member?.initials) setInitials(suggestInitials(val))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError('Ad zorunludur'); return }
    if (!role.trim()) { setError('Rol zorunludur'); return }
    if (!initials.trim()) { setError('Baş harfler zorunludur'); return }
    setSaving(true)
    setError('')

    const data = { name, role, initials, photo_url: photoUrl, visible }

    const result = isEdit
      ? await updateTeamMember(member.id, data)
      : await createTeamMember(data)

    if ('error' in result && result.error) {
      setError(result.error)
      showToast(result.error, 'error')
      setSaving(false)
      return
    }

    showToast(isEdit ? 'Üye güncellendi' : 'Üye oluşturuldu')
    router.push('/admin/team')
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl flex flex-col gap-6">
      <AdminInput label="Ad Soyad" value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Adı Soyadı" required />
      <AdminInput label="Rol" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Vize Danışmanı" required />
      <AdminInput label="Baş Harfler" value={initials} onChange={(e) => setInitials(e.target.value.toUpperCase())} placeholder="AB" maxLength={4} required />

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

      {error && <p className="font-mono text-[12px] text-coral">{error}</p>}

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
