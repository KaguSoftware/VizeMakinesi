'use client'

import { forwardRef, useId, type SelectHTMLAttributes } from 'react'
import { AdminLabel } from './AdminLabel'

interface AdminSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
}

export const AdminSelect = forwardRef<HTMLSelectElement, AdminSelectProps>(function AdminSelect(
  { label, className = '', id, children, ...props }, ref
) {
  const fallback = useId()
  const inputId = id ?? fallback
  return (
    <div className="flex flex-col gap-1.5">
      <AdminLabel htmlFor={inputId}>{label}</AdminLabel>
      <select
        ref={ref}
        id={inputId}
        {...props}
        className={[
          'bg-white border border-navy/40 rounded-md px-3 py-2 text-base text-navy',
          'focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/30 transition-colors duration-150 cursor-pointer',
          className,
        ].join(' ')}
      >
        {children}
      </select>
    </div>
  )
})
