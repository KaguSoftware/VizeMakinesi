'use client'

import { useEffect } from 'react'
import { AdminButton } from './AdminButton'

interface Props {
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ message, confirmLabel = 'Sil', onConfirm, onCancel }: Props) {
  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  return (
    <div
      className="fixed inset-0 bg-navy/30 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white border border-navy/10 shadow-sm w-full max-w-sm p-8 flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-serif text-[17px] text-navy leading-snug">{message}</p>
        <div className="flex items-center gap-3">
          <AdminButton variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </AdminButton>
          <AdminButton variant="secondary" onClick={onCancel}>
            İptal
          </AdminButton>
        </div>
      </div>
    </div>
  )
}
