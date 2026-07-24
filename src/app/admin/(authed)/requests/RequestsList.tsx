'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { EmptyState, ConfirmDialog, useToast } from '@/components/admin/ui'
import { CONTACT_OPTIONS } from '@/app/(public)/danisma-al/requestSummary'
import type { Database } from '@/lib/supabase/database.types'
import { setRequestRead, deleteRequest } from './actions'

type RequestRow = Database['public']['Tables']['consultation_requests']['Row']

function prefLabel(pref: string): string {
  const o = CONTACT_OPTIONS.find((c) => c.value === pref)
  return o ? `${o.emoji} ${o.label}` : pref
}

function relative(iso: string): string {
  const then = new Date(iso).getTime()
  const diff = Date.now() - then
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'az önce'
  if (m < 60) return `${m} dk önce`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} sa önce`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d} gün önce`
  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function dateRange(r: RequestRow): string {
  if (!r.travel_date) return '—'
  return r.return_date ? `${r.travel_date} → ${r.return_date}` : r.travel_date
}

export default function RequestsList({ initial }: { initial: RequestRow[] }) {
  const [rows, setRows] = useState<RequestRow[]>(initial)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const { showToast } = useToast()
  const rowsRef = useRef(rows)
  useEffect(() => {
    rowsRef.current = rows
  }, [rows])

  // Keep local state in sync when the server sends fresh props after a mutation.
  const [seen, setSeen] = useState(initial)
  if (seen !== initial) {
    setSeen(initial)
    setRows(initial)
  }

  useEffect(() => {
    const supabase = createClient()
    let channel: ReturnType<typeof supabase.channel> | null = null

    ;(async () => {
      // CRITICAL: an RLS table streams nothing on an anon socket even though the
      // channel reports SUBSCRIBED. Authorize the realtime socket first.
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token
      if (token) await supabase.realtime.setAuth(token)

      channel = supabase
        .channel('consultation_requests_admin')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'consultation_requests' },
          (payload) => {
            const row = payload.new as RequestRow
            if (rowsRef.current.some((r) => r.id === row.id)) return
            setRows((prev) => [row, ...prev])
            showToast('Yeni talep geldi.', 'success')
          }
        )
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'consultation_requests' },
          (payload) => {
            const row = payload.new as RequestRow
            setRows((prev) => prev.map((r) => (r.id === row.id ? row : r)))
          }
        )
        .on(
          'postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'consultation_requests' },
          (payload) => {
            const old = payload.old as { id: string }
            setRows((prev) => prev.filter((r) => r.id !== old.id))
          }
        )
        .subscribe()
    })()

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [showToast])

  function toggleRead(row: RequestRow) {
    const next = !row.is_read
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, is_read: next } : r)))
    startTransition(async () => {
      const res = await setRequestRead(row.id, next)
      if (res.error) {
        setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, is_read: !next } : r)))
        showToast('Güncellenemedi.', 'error')
      }
    })
  }

  function confirmDelete() {
    const id = confirmId
    if (!id) return
    setConfirmId(null)
    const prevRows = rowsRef.current
    setRows((prev) => prev.filter((r) => r.id !== id))
    startTransition(async () => {
      const res = await deleteRequest(id)
      if (res.error) {
        setRows(prevRows)
        showToast('Silinemedi.', 'error')
      } else {
        showToast('Talep silindi.', 'success')
      }
    })
  }

  if (rows.length === 0) {
    return (
      <EmptyState
        title="Henüz talep yok"
        description="Danışma formundan gelen talepler burada anlık olarak listelenecek."
      />
    )
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {rows.map((r) => (
          <article
            key={r.id}
            className={[
              'border bg-white p-5 md:p-6 transition-colors',
              r.is_read ? 'border-navy/10' : 'border-coral/40 bg-coral/[0.02]',
            ].join(' ')}
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-3 min-w-0">
                {!r.is_read && (
                  <span className="mt-2 w-2 h-2 rounded-full bg-coral shrink-0" aria-label="Okunmadı" />
                )}
                <div className="min-w-0">
                  <h2 className="font-serif text-[19px] text-navy leading-tight">
                    {r.first_name} {r.last_name}
                    {r.country && (
                      <span className="ml-2 font-sans text-[14px] text-navy/60">
                        {r.country_emoji ? `${r.country_emoji} ` : ''}{r.country}
                      </span>
                    )}
                  </h2>
                  <div className="mt-1 font-mono text-[11px] text-navy/55">
                    {relative(r.created_at)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => toggleRead(r)}
                  className="font-mono text-[10px] uppercase tracking-[0.14em] px-3 py-2 border border-navy/20 text-navy/70 hover:border-coral hover:text-coral transition-colors disabled:opacity-50"
                >
                  {r.is_read ? 'Okunmadı yap' : 'Okundu yap'}
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => setConfirmId(r.id)}
                  className="font-mono text-[10px] uppercase tracking-[0.14em] px-3 py-2 border border-navy/20 text-navy/70 hover:border-red-400 hover:text-red-500 transition-colors disabled:opacity-50"
                >
                  Sil
                </button>
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              <Field label="E-posta" value={<a href={`mailto:${r.email}`} className="text-coral hover:underline break-all">{r.email}</a>} />
              <Field label="Telefon" value={<a href={`tel:${r.phone}`} className="text-coral hover:underline">{r.phone}</a>} />
              <Field label="Seyahat Tarihleri" value={dateRange(r)} />
              <Field label="Dönüş Tercihi" value={prefLabel(r.contact_pref)} />
            </dl>

            {r.note?.trim() && (
              <div className="mt-4 pt-4 border-t border-navy/8">
                <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-coral mb-1">Not</div>
                <p className="font-serif text-[15px] text-navy/90 leading-snug whitespace-pre-wrap break-words">
                  {r.note.trim()}
                </p>
              </div>
            )}
          </article>
        ))}
      </div>

      {confirmId && (
        <ConfirmDialog
          message="Bu talebi silmek istediğinize emin misiniz?"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </>
  )
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-coral mb-0.5">{label}</dt>
      <dd className="font-serif text-[15px] text-navy/90 break-words">{value}</dd>
    </div>
  )
}
