import type { Database } from '@/lib/supabase/database.types'

type PublicTable = keyof Database['public']['Tables']

export interface AdminNavSection {
  /** Display label shown in sidebar and dashboard tile */
  label: string
  /** Route path */
  href: string
  /** Table queried for the dashboard count, or null if the section has no countable resource */
  table: PublicTable | null
  /** Optional `.eq()` filter applied to the count query (e.g. has_tourism = true) */
  filter?: { column: string; value: string | number | boolean }
  /** True when the section's table has a `visible` boolean column (used for "X / Y görünür" counts) */
  hasVisibleFlag?: boolean
  /** Icon glyph rendered in the sidebar */
  icon: AdminNavIcon
  /** When true, only render in the sidebar (not on the dashboard grid) */
  sidebarOnly?: boolean
}

export type AdminNavIcon =
  | 'dashboard'
  | 'requests'
  | 'countries'
  | 'mega-menu'
  | 'marquee'
  | 'home-regions'
  | 'partnerships'
  | 'blog'
  | 'team'
  | 'about'
  | 'visa-types'

export const ADMIN_NAV: readonly AdminNavSection[] = [
  { label: 'Dashboard', href: '/admin', table: null, icon: 'dashboard', sidebarOnly: true },
  { label: 'Talepler', href: '/admin/requests', table: 'consultation_requests', icon: 'requests' },
  { label: 'Ülkeler', href: '/admin/countries', table: 'countries', icon: 'countries' },
  // Counts the SSS rows behind /vize-turleri and its visa-type sub-pages.
  { label: 'Vize Türleri', href: '/admin/vize-turleri', table: 'visa_type_faqs', icon: 'visa-types' },
  { label: 'Mega Menü', href: '/admin/mega-menu', table: 'mega_menu_categories', hasVisibleFlag: true, icon: 'mega-menu' },
  { label: 'Marquee', href: '/admin/marquee', table: 'marquee_items', hasVisibleFlag: true, icon: 'marquee' },
  { label: 'Hızlı Ülke Filtreleme', href: '/admin/home-regions', table: 'home_region_entries', hasVisibleFlag: true, icon: 'home-regions' },
  { label: 'Ortaklıklar', href: '/admin/partnerships', table: 'partnerships', hasVisibleFlag: true, icon: 'partnerships' },
  // The "Blog" route is really a turizm index — the actual editor lives inside
  // the country form's tourism section. Labelling it "Turizm" matches that flow.
  { label: 'Turizm', href: '/admin/blog', table: 'countries', filter: { column: 'has_tourism', value: true }, icon: 'blog' },
  { label: 'Ekip', href: '/admin/team', table: 'team_members', hasVisibleFlag: true, icon: 'team' },
  { label: 'Hakkımızda', href: '/admin/about', table: null, icon: 'about' },
] as const

export const ADMIN_RESOURCES = ADMIN_NAV.filter((s) => !s.sidebarOnly && s.table !== null)
