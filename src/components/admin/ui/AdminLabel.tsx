import type { LabelHTMLAttributes } from 'react'

type AdminLabelProps = LabelHTMLAttributes<HTMLLabelElement>

export function AdminLabel({ className = '', children, ...props }: AdminLabelProps) {
  return (
    <label
      {...props}
      className={['font-mono text-[11px] tracking-[0.18em] uppercase text-navy/50', className].join(' ')}
    >
      {children}
    </label>
  )
}
