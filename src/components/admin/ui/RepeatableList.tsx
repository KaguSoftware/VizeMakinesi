'use client'

import { useEffect, useId, useRef, useState } from 'react'
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

export interface RepeatableItem {
  id: string
}

function DragHandle() {
  return (
    <svg viewBox="0 0 10 16" width="10" height="16" aria-hidden className="block text-current">
      <circle cx="3" cy="3" r="1.2" fill="currentColor" />
      <circle cx="7" cy="3" r="1.2" fill="currentColor" />
      <circle cx="3" cy="8" r="1.2" fill="currentColor" />
      <circle cx="7" cy="8" r="1.2" fill="currentColor" />
      <circle cx="3" cy="13" r="1.2" fill="currentColor" />
      <circle cx="7" cy="13" r="1.2" fill="currentColor" />
    </svg>
  )
}

interface SortableRowProps<T extends RepeatableItem> {
  item: T
  onDelete: () => void
  renderItem: (item: T, index: number) => React.ReactNode
  index: number
  hasContent: boolean
}

function SortableRow<T extends RepeatableItem>({
  item, onDelete, renderItem, index, hasContent,
}: SortableRowProps<T>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })

  function handleDelete() {
    // Empty rows are safe to remove silently; non-empty rows might erase work,
    // so confirm. An undo affordance is offered via the parent's undo banner.
    if (!hasContent || window.confirm('Bu satır silinsin mi?')) onDelete()
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={['flex items-start gap-3 group', isDragging ? 'opacity-50' : ''].join(' ')}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="mt-3 shrink-0 cursor-grab active:cursor-grabbing text-navy/55 hover:text-navy transition-colors select-none"
        aria-label="Sürükle"
      >
        <DragHandle />
      </button>

      <div className="flex-1 min-w-0">
        {renderItem(item, index)}
      </div>

      <button
        type="button"
        onClick={handleDelete}
        className="mt-2 shrink-0 font-mono text-[11px] tracking-widest uppercase text-navy/75 hover:text-red-500 transition-colors"
        aria-label="Sil"
      >
        ✕
      </button>
    </div>
  )
}

interface RepeatableListProps<T extends RepeatableItem> {
  items: T[]
  onChange: (items: T[]) => void
  renderItem: (item: T, index: number) => React.ReactNode
  addLabel: string
  emptyText?: string
  onAdd: () => void
  /**
   * Optional predicate that tells the list whether a row contains user content.
   * Rows with content prompt for confirmation before deletion and support undo.
   * If omitted, every row is treated as having content (safe default).
   */
  hasContent?: (item: T) => boolean
}

export function RepeatableList<T extends RepeatableItem>({
  items,
  onChange,
  renderItem,
  addLabel,
  emptyText = 'Henüz öğe eklenmedi',
  onAdd,
  hasContent,
}: RepeatableListProps<T>) {
  const sensors = useSensors(useSensor(PointerSensor))
  const dndId = useId()

  const [undoState, setUndoState] = useState<{ item: T; index: number } | null>(null)
  const undoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current)
  }, [])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id)
      const newIndex = items.findIndex((i) => i.id === over.id)
      onChange(arrayMove(items, oldIndex, newIndex))
    }
  }

  function deleteAt(itemId: string) {
    const index = items.findIndex((i) => i.id === itemId)
    if (index < 0) return
    const removed = items[index]
    onChange(items.filter((i) => i.id !== itemId))
    if (hasContent?.(removed)) {
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current)
      setUndoState({ item: removed, index })
      undoTimeoutRef.current = setTimeout(() => setUndoState(null), 8000)
    }
  }

  function undo() {
    if (!undoState) return
    const next = items.slice()
    next.splice(Math.min(undoState.index, next.length), 0, undoState.item)
    onChange(next)
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current)
    setUndoState(null)
  }

  const hasContentFn = hasContent ?? (() => true)

  return (
    <div className="flex flex-col gap-3">
      {items.length === 0 && (
        <p className="font-mono text-[11px] text-navy/75 italic">{emptyText}</p>
      )}

      <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-3">
            {items.map((item, index) => (
              <SortableRow
                key={item.id}
                item={item}
                index={index}
                renderItem={renderItem}
                onDelete={() => deleteAt(item.id)}
                hasContent={hasContentFn(item)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {undoState && (
        <div className="flex items-center gap-3 px-3 py-2 border border-navy/20 bg-navy/5 rounded-sm">
          <p className="font-mono text-[11px] tracking-wide text-navy">Bir öğe silindi.</p>
          <button
            type="button"
            onClick={undo}
            className="font-mono text-[11px] tracking-widest uppercase text-coral hover:text-navy transition-colors"
          >
            Geri Al
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={onAdd}
        className="self-start font-mono text-[11px] tracking-widest uppercase text-coral hover:text-navy transition-colors mt-1"
      >
        + {addLabel}
      </button>
    </div>
  )
}
