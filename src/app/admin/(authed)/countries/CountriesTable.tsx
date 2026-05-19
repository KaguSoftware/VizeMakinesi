'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  DndContext,
  closestCenter,
  PointerSensor,
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
import { ConfirmDialog, useToast } from '@/components/admin/ui'
import { reorderCountries, toggleCountryVisible, toggleDanismaVisible, deleteCountry } from './actions'
import type { Database } from '@/lib/supabase/database.types'

type CountryRow = Database['public']['Tables']['countries']['Row']

function SortableRow({
  country,
  onVisibleToggle,
  onDanismaToggle,
  onDelete,
}: {
  country: CountryRow
  onVisibleToggle: (id: string, val: boolean) => void
  onDanismaToggle: (id: string, val: boolean) => void
  onDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: country.id })

  return (
    <tr
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={['border-b border-navy/8 transition-opacity', isDragging ? 'opacity-40' : ''].join(' ')}
    >
      <td className="py-3 px-4 w-8">
        <button type="button" {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-navy/60 hover:text-navy select-none">⠿</button>
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
  const { showToast } = useToast()

  const sensors = useSensors(useSensor(PointerSensor))

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
      <DndContext id="countries-dnd" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={countries.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-navy/10">
                {['', 'Bayrak', 'Emoji', 'Ad', 'Slug', 'Görünürlük', 'Danışma', 'Turizm', '', ''].map((h, i) => (
                  <th key={i} className="py-3 px-4 text-left font-mono text-[10px] tracking-widest uppercase text-navy/65">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {countries.map((c) => (
                <SortableRow key={c.id} country={c} onVisibleToggle={handleVisibleToggle} onDanismaToggle={handleDanismaToggle} onDelete={setConfirmId} />
              ))}
            </tbody>
          </table>
          {countries.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-12">
              <p className="font-mono text-[12px] text-navy/65 text-center">Henüz ülke eklenmedi</p>
              <Link
                href="/admin/countries/new"
                className="font-mono text-[11px] tracking-widest uppercase text-coral hover:text-navy transition-colors"
              >
                + İlk Ülkeyi Ekle
              </Link>
            </div>
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
