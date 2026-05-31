'use client'

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

type EntryRow = Database['public']['Tables']['home_region_entries']['Row']

interface RowProps {
  entry: EntryRow
  onVisibleToggle: (id: string, val: boolean) => void
  onEdit: (entry: EntryRow) => void
  onDelete: (id: string) => void
}

function SortableEntryRow({ entry, onVisibleToggle, onEdit, onDelete }: RowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: entry.id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={[
        'flex items-center gap-3 px-3 py-2.5 border-b border-navy/8 bg-white transition-opacity',
        isDragging ? 'opacity-40' : '',
      ].join(' ')}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-navy/40 hover:text-navy select-none text-[16px] shrink-0 touch-none p-1 -m-1"
      >
        ⠿
      </button>

      <span className="font-serif text-[14px] text-navy min-w-[120px] shrink-0">{entry.name}</span>

      <span className="font-mono text-[9px] bg-navy/5 text-navy/60 px-1.5 py-0.5 rounded shrink-0">
        {entry.preset_key}
      </span>

      <span className="font-mono text-[10px] text-navy/40 truncate flex-1 min-w-0">
        {entry.href}
      </span>

      {entry.pinned && (
        <span className="font-mono text-[9px] bg-coral/10 text-coral px-1.5 py-0.5 rounded shrink-0">
          öne çıkan
        </span>
      )}

      <button
        type="button"
        onClick={() => onVisibleToggle(entry.id, !entry.visible)}
        className={[
          'shrink-0 px-3 py-1 font-mono text-[9px] tracking-widest uppercase border rounded-sm transition-colors duration-150',
          entry.visible
            ? 'bg-navy text-white border-navy'
            : 'bg-white text-navy/40 border-navy/20 hover:border-navy hover:text-navy',
        ].join(' ')}
      >
        {entry.visible ? 'Görünür' : 'Gizli'}
      </button>

      <button
        type="button"
        onClick={() => onEdit(entry)}
        className="shrink-0 font-mono text-[9px] tracking-widest uppercase text-navy/60 hover:text-navy transition-colors"
      >
        Düzenle
      </button>

      <button
        type="button"
        onClick={() => onDelete(entry.id)}
        className="shrink-0 font-mono text-[9px] tracking-widest uppercase text-red-400 hover:text-red-600 transition-colors"
      >
        Sil
      </button>
    </div>
  )
}

interface ListProps {
  entries: EntryRow[]
  onReorder: (next: EntryRow[]) => void
  onVisibleToggle: (id: string, val: boolean) => void
  onEdit: (entry: EntryRow) => void
  onDelete: (id: string) => void
}

export default function SortableEntryList({ entries, onReorder, onVisibleToggle, onEdit, onDelete }: ListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  )

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const oldIdx = entries.findIndex((x) => x.id === active.id)
    const newIdx = entries.findIndex((x) => x.id === over.id)
    onReorder(arrayMove(entries, oldIdx, newIdx))
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={entries.map((e) => e.id)} strategy={verticalListSortingStrategy}>
        <div className="border border-navy/10 rounded">
          {entries.map((entry) => (
            <SortableEntryRow
              key={entry.id}
              entry={entry}
              onVisibleToggle={onVisibleToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
          {entries.length === 0 && (
            <p className="font-mono text-[10px] text-navy/40 p-4 text-center">
              Henüz giriş yok.
            </p>
          )}
        </div>
      </SortableContext>
    </DndContext>
  )
}
