'use client'

import { useRef, useState } from 'react'

interface Props {
  value: string
  onChange: (url: string) => void
  label?: string
}

type Phase = 'idle' | 'compressing' | 'uploading'

const BUCKET = 'country-documents'
const MAX_BYTES = 20 * 1024 * 1024 // 20 MB

export function PdfUploader({ value, onChange, label = 'PDF' }: Props) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [sizeBefore, setSizeBefore] = useState<number | null>(null)
  const [sizeAfter, setSizeAfter] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  async function removeFromStorage(url: string) {
    try {
      const path = new URL(url).pathname.split(`/${BUCKET}/`)[1]
      if (!path) return
      const { createClient } = await import('@/lib/supabase/client')
      await createClient().storage.from(BUCKET).remove([path])
    } catch {
      // best-effort
    }
  }

  async function handleFile(file: File) {
    setError(null)
    setSizeBefore(null)
    setSizeAfter(null)

    if (file.size > MAX_BYTES) { setError('Dosya çok büyük (en fazla 20 MB).'); return }
    if (file.type !== 'application/pdf') { setError('Sadece PDF dosyaları yüklenebilir.'); return }

    const previousUrl = value
    const controller = new AbortController()
    abortRef.current = controller

    try {
      // Step 1 — compress via API route
      setSizeBefore(file.size)
      setPhase('compressing')

      const compressRes = await fetch('/api/compress-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/pdf' },
        body: file,
        signal: controller.signal,
      })

      if (!compressRes.ok) {
        const { error: msg } = await compressRes.json().catch(() => ({ error: 'Sıkıştırma başarısız' }))
        throw new Error(msg)
      }

      const compressedBuffer = await compressRes.arrayBuffer()
      if (controller.signal.aborted) return

      const compressed = new File([compressedBuffer], file.name, { type: 'application/pdf' })
      setSizeAfter(compressed.size)

      // Step 2 — upload compressed PDF to Supabase Storage
      setPhase('uploading')
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const filePath = `${crypto.randomUUID()}.pdf`
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, compressed, { upsert: true, contentType: 'application/pdf' })

      if (controller.signal.aborted) return
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath)
      onChange(data.publicUrl)
      if (previousUrl && previousUrl !== data.publicUrl) void removeFromStorage(previousUrl)
    } catch (e) {
      if (controller.signal.aborted) return
      if (e instanceof Error && e.name === 'AbortError') return
      setError(e instanceof Error ? e.message : 'Yükleme başarısız')
    } finally {
      setPhase('idle')
      if (abortRef.current === controller) abortRef.current = null
    }
  }

  function cancel() {
    abortRef.current?.abort()
    abortRef.current = null
    setPhase('idle')
    setSizeBefore(null)
    setSizeAfter(null)
  }

  function remove() {
    const prev = value
    onChange('')
    setSizeBefore(null)
    setSizeAfter(null)
    if (prev) void removeFromStorage(prev)
  }

  function formatBytes(bytes: number) {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  const busy = phase !== 'idle'
  const phaseLabel = phase === 'compressing' ? 'Sıkıştırılıyor…' : phase === 'uploading' ? 'Yükleniyor…' : null
  const filename = value ? decodeURIComponent(value.split('/').pop() ?? '') : null

  return (
    <div className="flex flex-col gap-2">
      {value && (
        <div className="flex items-center gap-3 px-3 py-2 border border-navy/20 bg-navy/3">
          <svg className="shrink-0 text-coral" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/>
          </svg>
          <span className="font-mono text-[11px] text-navy/60 truncate flex-1">{filename}</span>
          <a href={value} target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] uppercase tracking-wider text-coral hover:text-navy transition-colors">Aç</a>
        </div>
      )}

      <div className="flex items-center gap-4">
        <label className={['cursor-pointer font-mono text-[11px] tracking-widest uppercase transition-colors', busy ? 'text-navy/50 pointer-events-none' : 'text-coral hover:text-navy'].join(' ')}>
          {busy ? phaseLabel : value ? `${label} Değiştir` : `+ ${label} Yükle`}
          <input
            type="file"
            accept="application/pdf"
            className="sr-only"
            disabled={busy}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }}
          />
        </label>

        {busy && (
          <button type="button" onClick={cancel}
            className="font-mono text-[11px] tracking-widest uppercase text-navy/80 hover:text-red-500 transition-colors">
            İptal
          </button>
        )}

        {value && !busy && (
          <button type="button" onClick={remove}
            className="font-mono text-[11px] tracking-widest uppercase text-navy/80 hover:text-red-500 transition-colors">
            Kaldır
          </button>
        )}
      </div>

      {sizeBefore !== null && sizeAfter !== null && (
        <p className="font-mono text-[11px] text-navy/80">
          {formatBytes(sizeBefore)} → {formatBytes(sizeAfter)}
        </p>
      )}

      {error && <p role="alert" className="font-mono text-[11px] text-red-500">{error}</p>}
    </div>
  )
}
