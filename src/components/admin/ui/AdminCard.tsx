import type { HTMLAttributes } from 'react'

type AdminCardProps = HTMLAttributes<HTMLDivElement>

export function AdminCard({ className = '', children, ...props }: AdminCardProps) {
  return (
    <div
      {...props}
      className={['border border-navy/30 bg-white p-8 rounded-md', className].join(' ')}
    >
      {children}
    </div>
  )
}
