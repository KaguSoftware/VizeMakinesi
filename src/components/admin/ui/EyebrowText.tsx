import type { HTMLAttributes } from 'react'

interface EyebrowTextProps extends HTMLAttributes<HTMLParagraphElement> {}

export function EyebrowText({ className = '', children, ...props }: EyebrowTextProps) {
  return (
    <p
      {...props}
      className={['font-mono text-[11px] tracking-[0.2em] uppercase text-navy/40', className].join(' ')}
    >
      {children}
    </p>
  )
}
