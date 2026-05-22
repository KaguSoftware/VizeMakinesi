'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import FlagBG from '@/components/shared/FlagBG/FlagBG'
import { ConfirmDialog, EmptyState, useToast } from '@/components/admin/ui'
import { reorderCountries, toggleCountryVisible, toggleDanismaVisible, deleteCountry } from './actions'
import type { Database } from '@/lib/supabase/database.types'

type CountryRow = Database['public']['Tables']['countries']['Row']

function DragDotsIcon() {
  return (
    <svg viewBox="0 0 10 16" width="10" height="16" aria-hidden className="inline-block">
      <circle cx="3" cy="3" r="1.2" fill="currentColor" />
      <circle cx="7" cy="3" r="1.2" fill="currentColor" />
      <circle cx="3" cy="8" r="1.2" fill="currentColor" />
      <circle cx="7" cy="8" r="1.2" fill="currentColor" />
      <circle cx="3" cy="13" r="1.2" fill="currentColor" />
      <circle cx="7" cy="13" r="1.2" fill="currentColor" />
    </svg>
  )
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('tr-TR', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch { return '—' }
}

function SortableRow({
  country,
  onVisibleToggle,
  onDanismaToggle,
  onDelete,
  draggable = true,
}: {
  country: CountryRow
  onVisibleToggle: (id: string, val: boolean) => void
  onDanismaToggle: (id: string, val: boolean) => void
  onDelete: (id: string) => void
  draggable?: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: country.id, disabled: !draggable })

  return (
    <tr
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={['border-b border-navy/8 transition-opacity', isDragging ? 'opacity-40' : ''].join(' ')}
    >
      <td className="py-3 px-4 w-8">
        {draggable ? (
          <button type="button" {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-navy/55 hover:text-navy select-none touch-none p-1 -m-1" aria-label="Sürükle">
            <DragDotsIcon />
          </button>
        ) : (
          <span className="text-navy/20" aria-hidden><DragDotsIcon /></span>
        )}
      </td>
      <td className="py-3 px-4 w-12">
        <div className="w-8 h-6 relative overflow-hidden rounded-sm bg-navy/5">
          <FlagBG presetKey={country.flag_preset_key ?? undefined} imageUrl={country.flag_image_url ?? undefined} className="absolute inset-0 w-full h-full" />
        </div>
      </td>
      <td className="py-3 px-4 text-[18px]">{country.flag_emoji}</td>
      <td className="py-3 px-4 font-serif text-[16px] font-medium text-navy">{country.name}</td>
      <td className="py-3 px-4 font-mono text-[11px] text-navy/85">{country.slug}</td>
      <td className="py-3 px-4">
        <button
          type="button"
          onClick={() => onVisibleToggle(country.id, !country.mosaic_visible)}
          className={['font-mono text-[10px] tracking-widest uppercase px-2 py-1 border transition-colors', country.mosaic_visible ? 'border-coral text-coral' : 'border-navy/40 text-navy/70 hover:border-navy/70'].join(' ')}
        >
          {country.mosaic_visible ? 'Görünür' : 'Gizli'}
        </button>
      </td>
      <td className="py-3 px-4">
        <button
          type="button"
          onClick={() => onDanismaToggle(country.id, !country.danisma_visible)}
          className={['font-mono text-[10px] tracking-widest uppercase px-2 py-1 border transition-colors', country.danisma_visible ? 'border-coral text-coral' : 'border-navy/40 text-navy/70 hover:border-navy/70'].join(' ')}
        >
          {country.danisma_visible ? 'Aktif' : 'Pasif'}
        </button>
      </td>
      <td className="py-3 px-4">
        {country.has_tourism && <span className="font-mono text-[10px] tracking-widest uppercase text-coral">✓</span>}
      </td>
      <td className="py-3 px-4 font-mono text-[10px] text-navy/65">{formatDate(country.updated_at)}</td>
      <td className="py-3 px-4">
        <Link href={`/admin/countries/${country.id}/edit`} className="font-mono text-[10px] tracking-widest uppercase text-navy hover:text-coral transition-colors">Düzenle</Link>
      </td>
      <td className="py-3 px-4">
        <button type="button" onClick={() => onDelete(country.id)} className="font-mono text-[10px] tracking-widest uppercase text-red-500 hover:text-red-700 transition-colors">Sil</button>
      </td>
    </tr>
  )
}

export default function CountriesTable({ initial }: { initial: CountryRow[] }) {
  const [countries, setCountries] = useState(initial)
  const [, startTransition] = useTransition()
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const { showToast } = useToast()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  )

  // Drag-and-drop only makes sense on the full unfiltered list; while a search
  // is active we render a filtered subset and disable drag handles.
  const filtered = search.trim()
    ? countries.filter((c) => {
        const q = search.trim().toLowerCase()
        return c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
      })
    : countries
  const isSearching = search.trim().length > 0

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIdx = countries.findIndex((c) => c.id === active.id)
    const newIdx = countries.findIndex((c) => c.id === over.id)
    const reordered = arrayMove(countries, oldIdx, newIdx)
    setCountries(reordered)
    startTransition(async () => {
      const result = await reorderCountries(reordered.map((c) => c.id))
      if (result.error) showToast(result.error, 'error')
    })
  }

  function handleVisibleToggle(id: string, val: boolean) {
    setCountries((prev) => prev.map((c) => c.id === id ? { ...c, mosaic_visible: val } : c))
    startTransition(async () => {
      const result = await toggleCountryVisible(id, val)
      if (result.error) showToast(result.error, 'error')
    })
  }

  function handleDanismaToggle(id: string, val: boolean) {
    setCountries((prev) => prev.map((c) => c.id === id ? { ...c, danisma_visible: val } : c))
    startTransition(async () => {
      const result = await toggleDanismaVisible(id, val)
      if (result.error) showToast(result.error, 'error')
    })
  }

  function handleDeleteConfirmed() {
    if (!confirmId) return
    const id = confirmId
    setConfirmId(null)
    setCountries((prev) => prev.filter((c) => c.id !== id))
    startTransition(async () => {
      const result = await deleteCountry(id)
      if (result.error) showToast(result.error, 'error')
      else showToast('Ülke silindi')
    })
  }

  const confirmCountry = countries.find((c) => c.id === confirmId)

  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ülke ara…"
          aria-label="Ülke ara"
          className="bg-white border border-navy/30 rounded-md px-3 py-2 text-[13px] text-navy placeholder:text-navy/40 focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/30 transition-colors min-w-[240px]"
        />
        <p className="font-mono text-[11px] text-navy/60">
          {isSearching ? `${filtered.length} / ${countries.length}` : `${countries.length} ülke`}
        </p>
      </div>

      <DndContext id="countries-dnd" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={filtered.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-navy/10">
                {['', 'Bayrak', 'Emoji', 'Ad', 'Slug', 'Görünürlük', 'Danışma', 'Turizm', 'Güncellendi', '', ''].map((h, i) => (
                  <th key={i} className="py-3 px-4 text-left font-mono text-[10px] tracking-widest uppercase text-navy/65">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <SortableRow
                  key={c.id}
                  country={c}
                  onVisibleToggle={handleVisibleToggle}
                  onDanismaToggle={handleDanismaToggle}
                  onDelete={setConfirmId}
                  draggable={!isSearching}
                />
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && countries.length > 0 && (
            <p className="font-mono text-[12px] text-navy/65 text-center py-12">
              Aramayla eşleşen ülke yok.
            </p>
          )}
          {countries.length === 0 && (
            <EmptyState
              title="Henüz ülke yok"
              description="Vize sayfalarınızın temelini oluşturan ülkeleri ekleyerek başlayın."
              cta={{ href: '/admin/countries/new', label: '+ İlk Ülkeyi Ekle' }}
            />
          )}
        </SortableContext>
      </DndContext>

      {confirmId && confirmCountry && (
        <ConfirmDialog
          message={`"${confirmCountry.name}" ülkesi ve tüm bağlı verileri silinecek. Bu işlem geri alınamaz.`}
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </>
  )
}
