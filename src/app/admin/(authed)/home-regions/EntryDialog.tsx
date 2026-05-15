'use client'

import { useEffect, useState, useTransition } from 'react'
import { AdminButton, AdminInput, AdminSelect } from '@/components/admin/ui'
import { createEntry, updateEntry, type EntryFormData, type RegionKey } from './actions'
import type { Database } from '@/lib/supabase/database.types'

type EntryRow = Database['public']['Tables']['home_region_entries']['Row']

const PRESET_KEYS = [
  'austria', 'australia', 'belgium', 'bulgaria', 'canada', 'china', 'croatia',
  'czech', 'denmark', 'estonia', 'finland', 'france', 'germany', 'greece',
  'hungary', 'iceland', 'ireland', 'italy', 'latvia', 'liechtenstein', 'lithuania',
  'luxembourg', 'malta', 'netherlands', 'norway', 'poland', 'portugal', 'romania',
  'schengen', 'slovakia', 'slovenia', 'spain', 'sweden', 'switzerland', 'uae',
  'uk', 'usa',
] as const

const PRESET_LABELS: Record<string, string> = {
  austria: 'Avusturya', australia: 'Avustralya', belgium: 'Belçika',
  bulgaria: 'Bulgaristan', canada: 'Kanada', china: 'Çin', croatia: 'Hırvatistan',
  czech: 'Çekya', denmark: 'Danimarka', estonia: 'Estonya', finland: 'Finlandiya',
  france: 'Fransa', germany: 'Almanya', greece: 'Yunanistan', hungary: 'Macaristan',
  iceland: 'İzlanda', ireland: 'İrlanda', italy: 'İtalya', latvia: 'Letonya',
  liechtenstein: 'Lihtenştayn', lithuania: 'Litvanya', luxembourg: 'Lüksemburg',
  malta: 'Malta', netherlands: 'Hollanda', norway: 'Norveç', poland: 'Polonya',
  portugal: 'Portekiz', romania: 'Romanya', schengen: 'Schengen', slovakia: 'Slovakya',
  slovenia: 'Slovenya', spain: 'İspanya', sweden: 'İsveç', switzerland: 'İsviçre',
  uae: 'BAE', uk: 'İngiltere', usa: 'Amerika',
}

interface Props {
  region: RegionKey
  entry?: EntryRow
  onClose: () => void
  onSaved: (entry: EntryRow) => void
}

export default function EntryDialog({ region, entry, onClose, onSaved }: Props) {
  const isEdit = !!entry

  const [name, setName] = useState(entry?.name ?? '')
  const [href, setHref] = useState(entry?.href ?? '')
  const [presetKey, setPresetKey] = useState(entry?.preset_key ?? 'france')
  const [subtitle, setSubtitle] = useState(entry?.subtitle ?? 'Vize Bilgisi')
  const [pinned, setPinned] = useState(entry?.pinned ?? false)
  const [visible, setVisible] = useState(entry?.visible ?? true)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return setError('Ad zorunludur.')
    if (!href.trim()) return setError('Href zorunludur.')
    setError('')

    const data: EntryFormData = {
      region,
      name: name.trim(),
      href: href.trim(),
      preset_key: presetKey,
      subtitle: subtitle.trim() || 'Vize Bilgisi',
      pinned,
      visible,
    }

    startTransition(async () => {
      if (isEdit) {
        const res = await updateEntry(entry!.id, data)
        if (res.error) return setError(res.error)
        onSaved({ ...entry!, ...data })
      } else {
        const res = await createEntry(data)
        if ('error' in res) return setError(res.error)
        onSaved({
          id: res.id,
          ...data,
          sort_order: 0,
          created_at: new Date().toISOString(),
        })
      }
      onClose()
    })
  }

  return (
    <div
      className="fixed inset-0 bg-navy/30 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-navy/10 shadow-sm w-full max-w-md p-8 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-serif text-[20px] font-bold text-navy">
          {isEdit ? 'Girişi Düzenle' : 'Giriş Ekle'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <AdminInput
            label="Ad"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Fransa"
            required
          />

          <AdminInput
            label="Href"
            value={href}
            onChange={(e) => setHref(e.target.value)}
            placeholder="/vize/fransa"
            required
          />

          <AdminSelect
            label="Bayrak Anahtarı"
            value={presetKey}
            onChange={(e) => setPresetKey(e.target.value)}
          >
            {PRESET_KEYS.map((k) => (
              <option key={k} value={k}>
                {k} — {PRESET_LABELS[k] ?? k}
              </option>
            ))}
          </AdminSelect>

          <AdminInput
            label="Alt Başlık"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Vize Bilgisi"
          />

          <div className="flex gap-3 flex-wrap">
            {region === 'avrupa' && (
              <button
                type="button"
                onClick={() => setPinned((v) => !v)}
                className={[
                  'px-4 py-2 font-mono text-[10px] tracking-widest uppercase border transition-colors duration-150 rounded-sm',
                  pinned
                    ? 'bg-coral text-white border-coral'
                    : 'bg-white text-navy border-navy/40 hover:border-coral hover:text-coral',
                ].join(' ')}
              >
                {pinned ? 'Öne Çıkan' : 'Normal'}
              </button>
            )}

            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              className={[
                'px-4 py-2 font-mono text-[10px] tracking-widest uppercase border transition-colors duration-150 rounded-sm',
                visible
                  ? 'bg-navy text-white border-navy'
                  : 'bg-white text-navy/40 border-navy/20 hover:border-navy hover:text-navy',
              ].join(' ')}
            >
              {visible ? 'Görünür' : 'Gizli'}
            </button>
          </div>

          {error && (
            <p className="font-mono text-[11px] text-red-600">{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <AdminButton type="submit" variant="primary" disabled={isPending}>
              {isPending ? 'Kaydediliyor…' : 'Kaydet'}
            </AdminButton>
            <AdminButton type="button" variant="secondary" onClick={onClose}>
              İptal
            </AdminButton>
          </div>
        </form>
      </div>
    </div>
  )
}
