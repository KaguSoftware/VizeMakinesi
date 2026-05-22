'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    console.error(error)
  }, [error])

  async function copyDetails() {
    const text = [
      `Mesaj: ${error.message}`,
      error.digest ? `Hata kodu: ${error.digest}` : null,
      error.stack ? `\nStack:\n${error.stack}` : null,
    ].filter(Boolean).join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Some browsers block clipboard access in non-secure contexts. Best-effort.
    }
  }

  return (
    <div className="flex flex-col items-start gap-8 py-20">
      <div>
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-red-600 mb-4">— Hata</p>
        <h2 className="font-serif font-bold text-[clamp(32px,4vw,48px)] leading-none tracking-[-0.02em] text-navy mb-4">
          Bir şeyler ters gitti.
        </h2>
        <p className="font-serif text-[17px] text-navy/80 leading-relaxed max-w-md">
          Sayfa yüklenirken beklenmedik bir hata oluştu. Tekrar denemek için aşağıdaki butona tıklayın.
        </p>
        {error.message && (
          <p className="font-mono text-[11px] text-navy/70 mt-4 break-words max-w-md">{error.message}</p>
        )}
        {error.digest && (
          <p className="font-mono text-[10px] text-navy/60 mt-2">Hata kodu: {error.digest}</p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="font-mono text-[11px] tracking-widest uppercase px-5 py-3 border border-coral text-coral hover:bg-coral hover:text-navy transition-colors duration-150"
        >
          Tekrar Dene
        </button>
        <button
          type="button"
          onClick={copyDetails}
          className="font-mono text-[11px] tracking-widest uppercase px-5 py-3 border border-navy/40 text-navy/85 hover:border-navy transition-colors duration-150"
        >
          {copied ? 'Kopyalandı' : 'Hatayı Kopyala'}
        </button>
        <Link
          href="/admin"
          className="font-mono text-[11px] tracking-widest uppercase px-5 py-3 border border-navy/40 text-navy/85 hover:border-navy transition-colors duration-150"
        >
          Dashboard&apos;a Dön
        </Link>
      </div>
    </div>
  )
}
