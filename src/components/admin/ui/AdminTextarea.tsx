import type { TextareaHTMLAttributes } from 'react'
import { AdminLabel } from './AdminLabel'

interface AdminTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
}

export function AdminTextarea({ label, className = '', id, ...props }: AdminTextareaProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      <AdminLabel htmlFor={inputId}>— {label}</AdminLabel>
      <textarea
        id={inputId}
        {...props}
        className={[
          'bg-transparent border-b border-navy/20 py-2 font-serif text-[18px] text-navy placeholder:text-navy/25 resize-none',
          'focus:outline-none focus:border-coral transition-colors duration-150',
          className,
        ].join(' ')}
      />
    </div>
  )
}
