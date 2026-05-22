'use client'

import { forwardRef, useId, type TextareaHTMLAttributes } from 'react'
import { AdminLabel } from './AdminLabel'

interface AdminTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
}

export const AdminTextarea = forwardRef<HTMLTextAreaElement, AdminTextareaProps>(function AdminTextarea(
  { label, className = '', id, ...props }, ref
) {
  const fallback = useId()
  const inputId = id ?? fallback
  return (
    <div className="flex flex-col gap-1.5">
      <AdminLabel htmlFor={inputId}>{label}</AdminLabel>
      <textarea
        ref={ref}
        id={inputId}
        {...props}
        className={[
          'bg-white border border-navy/40 rounded-md px-3 py-2 text-base text-navy placeholder:text-navy/50 resize-none',
          'focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/30 transition-colors duration-150',
          className,
        ].join(' ')}
      />
    </div>
  )
})
