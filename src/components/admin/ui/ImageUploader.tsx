'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Props {
  bucket: string
  value: string
  onChange: (url: string) => void
  label?: string
  previewClassName?: string
}

type UploadPhase = 'idle' | 'compressing' | 'uploading' | 'done'

export function ImageUploader({ bucket, value, onChange, label = 'Görsel', previewClassName }: Props) {
  const [phase, setPhase] = useState<UploadPhase>('idle')
  const [sizeBefore, setSizeBefore] = useState<number | null>(null)
  const [sizeAfter, setSizeAfter] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    setError(null)
    setSizeBefore(file.size)
    setSizeAfter(null)
    setPhase('compressing')

    try {
      // compressImage is called inside uploadImage — we intercept phase transitions
      // by splitting the steps manually here
      const { compressImage } = await import('@/lib/images/compress')
      const compressed = await compressImage(file)
      setSizeAfter(compressed.size)
      setPhase('uploading')

      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const filePath = `${crypto.randomUUID()}-${compressed.name}`
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, compressed, { upsert: true, contentType: 'image/webp' })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
      onChange(data.publicUrl)
      setPhase('done')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Yükleme başarısız')
      setPhase('idle')
    }
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
          <Image src={value} alt={label} fill className="object-cover" />
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
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          />
        </label>

        {value && !isUploading && (
          <button
            type="button"
            onClick={() => { onChange(''); setPhase('idle'); setSizeBefore(null); setSizeAfter(null) }}
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

      {error && <p className="font-mono text-[11px] text-red-500">{error}</p>}
    </div>
  )
}
