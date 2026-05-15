'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_SECTIONS = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Ülkeler', href: '/admin/countries' },
  { label: 'Mega Menü', href: '/admin/mega-menu' },
  { label: 'Marquee', href: '/admin/marquee' },
  { label: 'Ana Sayfa', href: '/admin/home-regions' },
  { label: 'Ortaklıklar', href: '/admin/partnerships' },
  { label: 'Blog', href: '/admin/blog' },
  { label: 'Ekip', href: '/admin/team' },
]

interface AdminSidebarProps {
  email: string | undefined
}

export default function AdminSidebar({ email }: AdminSidebarProps) {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-[240px] shrink-0 bg-navy flex flex-col min-h-screen">
      {/* Wordmark */}
      <div className="px-7 pt-8 pb-6 border-b border-white/10">
        <p className="font-serif italic text-cream text-[17px] leading-tight">
          Vize Makinesi · Admin
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 flex flex-col gap-0.5 px-4">
        {NAV_SECTIONS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={[
              'px-3 py-2.5 font-mono text-[11px] tracking-widest uppercase transition-colors duration-150 rounded-sm',
              isActive(item.href)
                ? 'text-coral'
                : 'text-white/85 hover:text-white',
            ].join(' ')}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Bottom: email + sign out */}
      <div className="px-7 py-6 border-t border-white/10 flex flex-col gap-3">
        <p className="font-mono text-[11px] text-white/80 truncate">{email}</p>
        <form action="/admin/signout" method="post">
          <button
            type="submit"
            className="font-mono text-[11px] tracking-widest uppercase text-white/85 hover:text-coral transition-colors"
          >
            Çıkış
          </button>
        </form>
      </div>
    </aside>
  )
}
