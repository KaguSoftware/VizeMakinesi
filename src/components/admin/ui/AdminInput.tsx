'use client'

import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { AdminLabel } from './AdminLabel'

interface AdminInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export const AdminInput = forwardRef<HTMLInputElement, AdminInputProps>(function AdminInput(
  { label, className = '', id, ...props }, ref
) {
  // Always derive a stable id when the caller didn't provide one. Falling back
  // to the label text caused collisions when the same label appeared in two
  // RepeatableList rows (e.g. "Belge 1" inside an inner-rendered list).
  const fallback = useId()
  const inputId = id ?? fallback
  return (
    <div className="flex flex-col gap-1.5">
      <AdminLabel htmlFor={inputId}>{label}</AdminLabel>
      <input
        ref={ref}
        id={inputId}
        {...props}
        className={[
          'bg-white border border-navy/40 rounded-md px-3 py-2 text-base text-navy placeholder:text-navy/50',
          'focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/30 transition-colors duration-150',
          className,
        ].join(' ')}
      />
    </div>
  )
})
