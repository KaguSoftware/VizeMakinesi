import type { ButtonHTMLAttributes } from 'react'

interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
}

const VARIANTS = {
  primary: 'bg-coral text-navy border border-coral hover:bg-coral/80',
  secondary: 'bg-transparent text-navy border border-navy hover:border-coral hover:text-coral',
  danger: 'bg-transparent text-red-600 border border-red-400 hover:border-red-600',
}

export function AdminButton({ variant = 'primary', className = '', children, ...props }: AdminButtonProps) {
  return (
    <button
      {...props}
      className={[
        'font-mono text-[11px] tracking-widest uppercase px-5 py-3 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed',
        VARIANTS[variant],
        className,
      ].join(' ')}
    >
      {children}
    </button>
  )
}
