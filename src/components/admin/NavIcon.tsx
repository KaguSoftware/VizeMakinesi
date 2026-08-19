import type { AdminNavIcon } from '@/lib/admin/nav'

interface Props {
  name: AdminNavIcon
  className?: string
}

export function NavIcon({ name, className = 'w-4 h-4' }: Props) {
  switch (name) {
    case 'dashboard':
      return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" className={className}>
          <rect x="2" y="2" width="5" height="5" />
          <rect x="9" y="2" width="5" height="5" />
          <rect x="2" y="9" width="5" height="5" />
          <rect x="9" y="9" width="5" height="5" />
        </svg>
      )
    case 'requests':
      return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" className={className}>
          <path d="M2 4h12v8H2z" />
          <path d="M2 4l6 5 6-5" />
        </svg>
      )
    case 'countries':
      return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" className={className}>
          <circle cx="8" cy="8" r="6" />
          <path d="M2 8h12M8 2c1.8 2 1.8 10 0 12M8 2c-1.8 2-1.8 10 0 12" />
        </svg>
      )
    case 'visa-types':
      return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" className={className}>
          <rect x="2" y="3" width="12" height="10" rx="1.5" />
          <circle cx="6" cy="7" r="1.5" />
          <path d="M9.5 6.5h3M9.5 9h3M3.5 10.5c.6-1 1.6-1.5 2.5-1.5s1.9.5 2.5 1.5" />
        </svg>
      )
    case 'schengen':
      return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" className={className}>
          <circle cx="8" cy="8" r="6" />
          <ellipse cx="8" cy="8" rx="2.6" ry="6" />
          <path d="M2.3 6h11.4M2.3 10h11.4" />
        </svg>
      )
    case 'mega-menu':
      return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" className={className}>
          <line x1="2" y1="4" x2="14" y2="4" />
          <line x1="2" y1="8" x2="14" y2="8" />
          <line x1="2" y1="12" x2="14" y2="12" />
        </svg>
      )
    case 'marquee':
      return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" className={className}>
          <path d="M2 8h9M11 5l3 3-3 3" />
        </svg>
      )
    case 'home-regions':
      return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" className={className}>
          <path d="M2 7l6-5 6 5v7H2z" />
          <path d="M6 14V9h4v5" />
        </svg>
      )
    case 'partnerships':
      return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" className={className}>
          <circle cx="5" cy="8" r="3" />
          <circle cx="11" cy="8" r="3" />
        </svg>
      )
    case 'blog':
      return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" className={className}>
          <rect x="3" y="2" width="10" height="12" />
          <line x1="5" y1="5" x2="11" y2="5" />
          <line x1="5" y1="8" x2="11" y2="8" />
          <line x1="5" y1="11" x2="9" y2="11" />
        </svg>
      )
    case 'team':
      return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" className={className}>
          <circle cx="8" cy="6" r="2.5" />
          <path d="M3 14c.5-2.5 2.5-4 5-4s4.5 1.5 5 4" />
        </svg>
      )
    case 'about':
      return (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" className={className}>
          <circle cx="8" cy="8" r="6" />
          <line x1="8" y1="7" x2="8" y2="12" />
          <circle cx="8" cy="4.5" r="0.6" fill="currentColor" stroke="none" />
        </svg>
      )
  }
}
