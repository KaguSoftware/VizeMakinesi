'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Database } from '@/lib/supabase/database.types'
import CountryPickerModal, { type PickableCountry } from './CountryPickerModal'

type ItemRow = Database['public']['Tables']['mega_menu_items']['Row']

export interface ItemWithCountry extends ItemRow {
  country: PickableCountry
}

interface Props {
  item: ItemWithCountry
  countries: PickableCountry[]
  onUpdate: (id: string, country: PickableCountry) => void
  onDelete: (id: string) => void
  onToggleVisible: (id: string, visible: boolean) => void
}

export default function SortableItem({ item, countries, onUpdate, onDelete, onToggleVisible }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })
  const [showPicker, setShowPicker] = useState(false)

  return (
    <>
      <div
        ref={setNodeRef}
        style={{ transform: CSS.Transform.toString(transform), transition }}
        className={['flex items-center gap-3 py-2 group', isDragging ? 'opacity-40' : ''].join(' ')}
      >
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="shrink-0 cursor-grab active:cursor-grabbing text-navy/55 hover:text-navy/80 select-none touch-none p-1 -m-1"
        >
          ⠿
        </button>
        <span className="text-[18px] shrink-0">{item.country.flag_emoji}</span>
        <span className="flex-1 font-serif text-[15px] text-navy">{item.country.name}</span>
        <button
          type="button"
          onClick={() => setShowPicker(true)}
          className="font-mono text-[10px] tracking-widest uppercase text-navy hover:text-coral transition-colors"
        >
          Değiştir
        </button>
        <button
          type="button"
          onClick={() => onToggleVisible(item.id, !item.visible)}
          className={[
            'font-mono text-[10px] tracking-widest uppercase px-2 py-1 border transition-colors',
            item.visible
              ? 'border-coral text-coral'
              : 'border-navy/30 text-navy/60 hover:border-navy/60',
          ].join(' ')}
        >
          {item.visible ? 'Görünür' : 'Gizli'}
        </button>
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="font-mono text-[10px] tracking-widest uppercase text-red-500 hover:text-red-700 transition-colors"
        >
          Sil
        </button>
      </div>
      {showPicker && (
        <CountryPickerModal
          countries={countries}
          onSelect={(c) => { onUpdate(item.id, c); setShowPicker(false) }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </>
  )
}
