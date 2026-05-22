'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { parseSupabaseStorageUrl } from '@/lib/images/paths'

interface Props {
  bucket: string
  value: string
  onChange: (url: string) => void
  label?: string
  previewClassName?: string
  /** Hint passed to next/image for the preview thumbnail. Defaults to a small fixed size. */
  previewSizes?: string
}

type UploadPhase = 'idle' | 'compressing' | 'uploading'

export function ImageUploader({
  bucket,
  value,
  onChange,
  label = 'Görsel',
  previewClassName,
  previewSizes = '256px',
}: Props) {
  const [phase, setPhase] = useState<UploadPhase>('idle')
  const [sizeBefore, setSizeBefore] = useState<number | null>(null)
  const [sizeAfter, setSizeAfter] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  async function removeFromStorage(url: string) {
    const parsed = parseSupabaseStorageUrl(url)
    // Only delete objects in the bucket we manage — defends against accidental
    // cross-bucket removal if a stale URL is somehow attached to the form.
    if (!parsed || parsed.bucket !== bucket) return
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      await supabase.storage.from(bucket).remove([parsed.path])
    } catch {
      // Best-effort: a stale orphan is preferable to a broken UI.
    }
  }

  async function handleFile(file: File) {
    setError(null)

    const MAX_INPUT_BYTES = 25 * 1024 * 1024
    if (file.size > MAX_INPUT_BYTES) {
      setError('Dosya çok büyük (en fazla 25 MB).')
      return
    }
    if (!file.type.startsWith('image/')) {
      setError('Sadece görsel dosyaları yüklenebilir.')
      return
    }

    const previousUrl = value

    setSizeBefore(file.size)
    setSizeAfter(null)
    setPhase('compressing')

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const { compressImage } = await import('@/lib/images/compress')
      const compressed = await compressImage(file)
      if (controller.signal.aborted) return
      setSizeAfter(compressed.size)
      setPhase('uploading')

      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      // Output is always WebP — use a clean filename, don't preserve user input.
      const filePath = `${crypto.randomUUID()}.webp`
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, compressed, { upsert: true, contentType: 'image/webp' })

      if (controller.signal.aborted) return
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
      onChange(data.publicUrl)
      setPhase('idle')
      // Fire-and-forget cleanup of the previous object.
      if (previousUrl && previousUrl !== data.publicUrl) {
        void removeFromStorage(previousUrl)
      }
    } catch (e) {
      if (controller.signal.aborted) {
        setPhase('idle')
        return
      }
      const msg = e instanceof Error ? e.message : 'Yükleme başarısız'
      if (/network|fetch|failed to fetch/i.test(msg)) {
        setError('Ağ hatası. Bağlantıyı kontrol edip tekrar deneyin.')
      } else if (/payload|too large|413/i.test(msg)) {
        setError('Dosya boyutu sunucu sınırını aşıyor.')
      } else {
        setError(msg)
      }
      setPhase('idle')
    } finally {
      if (abortRef.current === controller) abortRef.current = null
    }
  }

  function cancelUpload() {
    abortRef.current?.abort()
    abortRef.current = null
    setPhase('idle')
    setSizeBefore(null)
    setSizeAfter(null)
  }

  function removeImage() {
    const previousUrl = value
    onChange('')
    setPhase('idle')
    setSizeBefore(null)
    setSizeAfter(null)
    if (previousUrl) void removeFromStorage(previousUrl)
  }

  function formatBytes(bytes: number) {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  const isUploading = phase === 'compressing' || phase === 'uploading'
  const phaseLabel = phase === 'compressing' ? 'Sıkıştırılıyor…' : phase === 'uploading' ? 'Yükleniyor…' : null

  return (
    <div className="flex flex-col gap-3">
      {value && (
        <div className={['relative overflow-hidden border border-navy/40 rounded-md', previewClassName ?? 'w-48 h-28'].join(' ')}>
          <Image src={value} alt={label} fill sizes={previewSizes} className="object-cover" />
        </div>
      )}

      <div className="flex items-center gap-4">
        <label className={['cursor-pointer font-mono text-[11px] tracking-widest uppercase transition-colors', isUploading ? 'text-navy/75 pointer-events-none' : 'text-coral hover:text-navy'].join(' ')}>
          {isUploading
            ? phaseLabel
            : value
              ? `${label} Değiştir`
              : `+ ${label} Yükle`}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={isUploading}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }}
          />
        </label>

        {isUploading && (
          <button
            type="button"
            onClick={cancelUpload}
            className="font-mono text-[11px] tracking-widest uppercase text-navy/80 hover:text-red-500 transition-colors"
          >
            İptal
          </button>
        )}

        {value && !isUploading && (
          <button
            type="button"
            onClick={removeImage}
            className="font-mono text-[11px] tracking-widest uppercase text-navy/80 hover:text-red-500 transition-colors"
          >
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
