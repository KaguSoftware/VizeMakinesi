'use client'

import { useState } from 'react'
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
import type { Database } from '@/lib/supabase/database.types'
import CountryPickerModal, { type PickableCountry } from './CountryPickerModal'
import SortableItem, { type ItemWithCountry } from './SortableItem'

type CategoryRow = Database['public']['Tables']['mega_menu_categories']['Row']

export interface CategoryWithItems extends CategoryRow {
  items: ItemWithCountry[]
}

const MAX_ITEMS_PER_CATEGORY = 3

interface Props {
  cat: CategoryWithItems
  countries: PickableCountry[]
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
  onToggleVisible: (id: string, visible: boolean) => void
  onAddItem: (categoryId: string, country: PickableCountry) => void
  onUpdateItem: (id: string, country: PickableCountry) => void
  onDeleteItem: (id: string) => void
  onToggleItemVisible: (id: string, visible: boolean) => void
  onReorderItems: (categoryId: string, items: ItemWithCountry[]) => void
}

export default function SortableCategory({
  cat,
  countries,
  onRename,
  onDelete,
  onToggleVisible,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onToggleItemVisible,
  onReorderItems,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cat.id })
  const [editingName, setEditingName] = useState(cat.name)
  const [showAddPicker, setShowAddPicker] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  )

  function handleItemDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIdx = cat.items.findIndex((i) => i.id === active.id)
    const newIdx = cat.items.findIndex((i) => i.id === over.id)
    onReorderItems(cat.id, arrayMove(cat.items, oldIdx, newIdx))
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={{ transform: CSS.Transform.toString(transform), transition }}
        className={['border border-navy/10 bg-white', isDragging ? 'opacity-40' : ''].join(' ')}
      >
        {/* Category header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-navy/8">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="shrink-0 cursor-grab active:cursor-grabbing text-navy/55 hover:text-navy/80 select-none touch-none p-1 -m-1"
          >
            ⠿
          </button>
          <input
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            onBlur={() => { if (editingName !== cat.name) onRename(cat.id, editingName) }}
            className="flex-1 bg-transparent font-serif text-[18px] font-medium text-navy focus:outline-none border-b border-transparent focus:border-coral transition-colors"
          />
          <button
            type="button"
            onClick={() => onToggleVisible(cat.id, !cat.visible)}
            className={[
              'font-mono text-[10px] tracking-widest uppercase px-2 py-1 border transition-colors',
              cat.visible
                ? 'border-coral text-coral'
                : 'border-navy/30 text-navy/60 hover:border-navy/60',
            ].join(' ')}
          >
            {cat.visible ? 'Görünür' : 'Gizli'}
          </button>
          <button
            type="button"
            onClick={() => onDelete(cat.id)}
            className="font-mono text-[10px] tracking-widest uppercase text-red-500 hover:text-red-700 transition-colors"
          >
            Sil
          </button>
        </div>

        {/* Items */}
        <div className="px-4 py-3">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleItemDragEnd}>
            <SortableContext items={cat.items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <div className="divide-y divide-navy/5">
                {cat.items.map((item) => (
                  <SortableItem
                    key={item.id}
                    item={item}
                    countries={countries}
                    onUpdate={onUpdateItem}
                    onDelete={onDeleteItem}
                    onToggleVisible={onToggleItemVisible}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {cat.items.length === 0 && (
            <p className="font-mono text-[11px] text-navy/60 italic py-2">Henüz ülke eklenmedi</p>
          )}

          <div className="mt-3 flex items-center gap-3">
            {cat.items.length < MAX_ITEMS_PER_CATEGORY ? (
              <button
                type="button"
                onClick={() => setShowAddPicker(true)}
                className="font-mono text-[11px] tracking-widest uppercase text-coral hover:text-navy transition-colors"
              >
                + Ülke Ekle
              </button>
            ) : (
              <p className="font-mono text-[11px] text-coral">
                En fazla {MAX_ITEMS_PER_CATEGORY} ülke ekleyebilirsiniz
              </p>
            )}
            <span className="font-mono text-[10px] text-navy/40">
              {cat.items.length} / {MAX_ITEMS_PER_CATEGORY}
            </span>
          </div>
        </div>
      </div>

      {showAddPicker && (
        <CountryPickerModal
          countries={countries}
          onSelect={(c) => { onAddItem(cat.id, c); setShowAddPicker(false) }}
          onClose={() => setShowAddPicker(false)}
        />
      )}
    </>
  )
}
