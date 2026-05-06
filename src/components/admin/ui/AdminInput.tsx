import type { InputHTMLAttributes } from 'react'
import { AdminLabel } from './AdminLabel'

interface AdminInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function AdminInput({ label, className = '', id, ...props }: AdminInputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      <AdminLabel htmlFor={inputId}>— {label}</AdminLabel>
      <input
        id={inputId}
        {...props}
        className={[
          'bg-transparent border-b border-navy/20 py-2 font-serif text-[18px] text-navy placeholder:text-navy/25',
          'focus:outline-none focus:border-coral transition-colors duration-150',
          className,
        ].join(' ')}
      />
    </div>
  )
}
