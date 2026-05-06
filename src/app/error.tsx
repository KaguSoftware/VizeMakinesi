'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-cream text-navy font-sans">
        <div className="container max-w-2xl flex flex-col items-start gap-8 py-32">
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-coral mb-4">— Beklenmedik hata</p>
            <h1 className="font-serif font-bold text-[clamp(48px,6vw,80px)] leading-none tracking-[-0.03em] mb-6">
              Bir şeyler<br />
              <em className="font-normal italic text-coral">ters gitti.</em>
            </h1>
            <p className="font-serif text-[18px] text-navy/60 leading-relaxed max-w-md">
              Sayfa beklenmedik bir hatayla karşılaştı. Lütfen tekrar deneyin veya ana sayfaya dönün.
            </p>
            {error.digest && (
              <p className="font-mono text-[10px] text-navy/30 mt-4">Hata kodu: {error.digest}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={reset}
              className="font-mono text-[11px] tracking-widest uppercase px-6 py-3 bg-coral border border-coral text-navy hover:bg-coral/80 transition-colors duration-150"
            >
              Tekrar Dene
            </button>
            <Link
              href="/"
              className="font-mono text-[11px] tracking-widest uppercase px-6 py-3 border border-navy text-navy hover:bg-navy hover:text-white transition-colors duration-150"
            >
              Ana Sayfa
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}
