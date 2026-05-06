'use client'

import { useEffect } from 'react'

export default function AdminError({
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
    <div className="flex flex-col items-start gap-8 py-20">
      <div>
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-coral mb-4">— Hata</p>
        <h2 className="font-serif font-bold text-[clamp(32px,4vw,48px)] leading-none tracking-[-0.02em] text-navy mb-4">
          Bir şeyler ters gitti.
        </h2>
        <p className="font-serif text-[17px] text-navy/60 leading-relaxed max-w-md">
          Sayfa yüklenirken beklenmedik bir hata oluştu. Tekrar denemek için aşağıdaki butona tıklayın.
        </p>
        {error.digest && (
          <p className="font-mono text-[10px] text-navy/30 mt-4">Hata kodu: {error.digest}</p>
        )}
      </div>
      <button
        onClick={reset}
        className="font-mono text-[11px] tracking-widest uppercase px-5 py-3 border border-coral text-coral hover:bg-coral hover:text-navy transition-colors duration-150"
      >
        Tekrar Dene
      </button>
    </div>
  )
}
