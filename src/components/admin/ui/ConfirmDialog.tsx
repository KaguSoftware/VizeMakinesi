'use client'

import { useEffect, useId, useRef } from 'react'
import { AdminButton } from './AdminButton'

interface Props {
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ message, confirmLabel = 'Sil', onConfirm, onCancel }: Props) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null

    // Move focus into the dialog. The first button is the destructive action,
    // which the user is most likely to confirm.
    const firstFocusable = dialogRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    firstFocusable?.focus()

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onCancel()
        return
      }
      if (e.key !== 'Tab') return
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (!focusables || focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      previousFocusRef.current?.focus()
    }
  }, [onCancel])

  return (
    <div
      className="fixed inset-0 bg-navy/30 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-white border border-navy/10 shadow-sm w-full max-w-sm p-8 flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <p id={titleId} className="font-serif text-[17px] text-navy leading-snug">{message}</p>
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
