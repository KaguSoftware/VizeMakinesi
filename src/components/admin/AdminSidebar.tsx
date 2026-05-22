'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ADMIN_NAV } from '@/lib/admin/nav'
import { NavIcon } from './NavIcon'
import { SignOutButton } from './SignOutButton'
import { GuardedLink } from './GuardedLink'

interface AdminSidebarProps {
  email: string | undefined
}

export default function AdminSidebar({ email }: AdminSidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  const navContent = (
    <>
      <div className="px-7 pt-8 pb-6 border-b border-white/10">
        <p className="font-serif italic text-cream text-[17px] leading-tight">
          Vize Makinesi · Admin
        </p>
      </div>

      <nav className="flex-1 py-6 flex flex-col gap-0.5 px-4 overflow-y-auto">
        {ADMIN_NAV.map((item) => (
          <GuardedLink
            key={item.href}
            href={item.href}
            aria-current={isActive(item.href) ? 'page' : undefined}
            onClick={() => setOpen(false)}
            className={[
              'flex items-center gap-3 px-3 py-2.5 font-mono text-[11px] tracking-widest uppercase transition-colors duration-150 rounded-sm',
              isActive(item.href)
                // Background + weight distinguish active state from hover even
                // when coral and white blend together at a glance.
                ? 'text-coral bg-white/10 font-semibold'
                : 'text-white/85 hover:text-white hover:bg-white/5',
            ].join(' ')}
          >
            <NavIcon name={item.icon} className="w-4 h-4 shrink-0" />
            <span>{item.label}</span>
          </GuardedLink>
        ))}
      </nav>

      <div className="px-7 py-6 border-t border-white/10 flex flex-col gap-3">
        <p className="font-mono text-[11px] text-white/80 truncate">{email}</p>
        <SignOutButton />
      </div>
    </>
  )

  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between bg-navy text-cream px-4 py-3 border-b border-white/10">
        <p className="font-serif italic text-[14px]">Vize Makinesi · Admin</p>
        <button
          type="button"
          aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="p-2 -mr-2 text-cream"
        >
          <svg viewBox="0 0 16 16" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? (
              <path d="M3 3l10 10M13 3L3 13" />
            ) : (
              <>
                <line x1="2" y1="4" x2="14" y2="4" />
                <line x1="2" y1="8" x2="14" y2="8" />
                <line x1="2" y1="12" x2="14" y2="12" />
              </>
            )}
          </svg>
        </button>
      </header>

      {/* Mobile drawer overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-navy/40"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={[
          'md:hidden fixed top-0 left-0 bottom-0 w-[260px] z-50 bg-navy flex flex-col',
          'transition-transform duration-200',
          open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {navContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[240px] shrink-0 bg-navy flex-col min-h-screen sticky top-0">
        {navContent}
      </aside>
    </>
  )
}
