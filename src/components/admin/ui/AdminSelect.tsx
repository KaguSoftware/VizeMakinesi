import type { SelectHTMLAttributes } from 'react'
import { AdminLabel } from './AdminLabel'

interface AdminSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
}

export function AdminSelect({ label, className = '', id, children, ...props }: AdminSelectProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      <AdminLabel htmlFor={inputId}>— {label}</AdminLabel>
      <select
        id={inputId}
        {...props}
        className={[
          'bg-transparent border-b border-navy/20 py-2 font-serif text-[18px] text-navy',
          'focus:outline-none focus:border-coral transition-colors duration-150 appearance-none cursor-pointer',
          className,
        ].join(' ')}
      >
        {children}
      </select>
    </div>
  )
}
