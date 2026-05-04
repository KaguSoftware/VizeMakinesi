import type { HTMLAttributes } from 'react'

interface AdminCardProps extends HTMLAttributes<HTMLDivElement> {}

export function AdminCard({ className = '', children, ...props }: AdminCardProps) {
  return (
    <div
      {...props}
      className={['border border-navy/15 bg-white p-8', className].join(' ')}
    >
      {children}
    </div>
  )
}
