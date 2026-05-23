import Link from 'next/link'

interface Props {
  title: string
  description?: string
  /** Primary call to action — when set, renders as a styled link. */
  cta?: { href: string; label: string }
  /** Optional secondary affordance, e.g. import or template. */
  secondary?: React.ReactNode
  className?: string
}

function Illustration() {
  return (
    <svg
      viewBox="0 0 96 64"
      width="96"
      height="64"
      aria-hidden
      className="text-navy/30"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
    >
      {/* Stack of empty cards — universal "nothing here yet" metaphor. */}
      <rect x="14" y="14" width="52" height="32" rx="2" />
      <rect x="22" y="22" width="52" height="32" rx="2" fill="white" stroke="currentColor" />
      <line x1="30" y1="32" x2="58" y2="32" />
      <line x1="30" y1="40" x2="50" y2="40" />
    </svg>
  )
}

export function EmptyState({ title, description, cta, secondary, className = '' }: Props) {
  return (
    <div className={['flex flex-col items-center gap-4 py-16 px-6 text-center', className].join(' ')}>
      <Illustration />
      <div className="flex flex-col gap-2 max-w-sm">
        <p className="font-serif text-[18px] text-navy">{title}</p>
        {description && (
          <p className="font-mono text-[11px] text-navy/65 leading-relaxed">{description}</p>
        )}
      </div>
      {(cta || secondary) && (
        <div className="flex items-center gap-4 mt-2">
          {cta && (
            <Link
              href={cta.href}
              className="font-mono text-[11px] tracking-widest uppercase px-5 py-3 border border-coral text-coral hover:bg-coral hover:text-navy transition-colors"
            >
              {cta.label}
            </Link>
          )}
          {secondary}
        </div>
      )}
    </div>
  )
}
