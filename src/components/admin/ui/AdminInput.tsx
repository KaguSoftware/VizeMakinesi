import type { InputHTMLAttributes } from 'react'
import { AdminLabel } from './AdminLabel'

interface AdminInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function AdminInput({ label, className = '', id, ...props }: AdminInputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      <AdminLabel htmlFor={inputId}>{label}</AdminLabel>
      <input
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
}
