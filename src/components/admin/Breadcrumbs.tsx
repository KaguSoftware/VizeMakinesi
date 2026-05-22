import { GuardedLink } from './GuardedLink'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface Props {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: Props) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 flex-wrap font-mono text-[11px] tracking-widest uppercase text-navy/55">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={i} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <GuardedLink href={item.href} className="hover:text-coral transition-colors">
                  {item.label}
                </GuardedLink>
              ) : (
                <span className={isLast ? 'text-navy' : ''} aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast && <span aria-hidden className="text-navy/30">›</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
