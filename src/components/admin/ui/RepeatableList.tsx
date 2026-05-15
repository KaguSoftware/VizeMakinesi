'use client'

import { useId } from 'react'
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

interface SortableRowProps<T extends RepeatableItem> {
  item: T
  onDelete: () => void
  renderItem: (item: T, index: number) => React.ReactNode
  index: number
}

function SortableRow<T extends RepeatableItem>({ item, onDelete, renderItem, index }: SortableRowProps<T>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={['flex items-start gap-3 group', isDragging ? 'opacity-50' : ''].join(' ')}
    >
      {/* Drag handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="mt-2 shrink-0 cursor-grab active:cursor-grabbing text-navy/70 hover:text-navy transition-colors select-none"
        aria-label="Sürükle"
      >
        ⠿
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {renderItem(item, index)}
      </div>

      {/* Delete */}
      <button
        type="button"
        onClick={onDelete}
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
}

export function RepeatableList<T extends RepeatableItem>({
  items,
  onChange,
  renderItem,
  addLabel,
  emptyText = 'Henüz öğe eklenmedi',
  onAdd,
}: RepeatableListProps<T>) {
  const sensors = useSensors(useSensor(PointerSensor))
  const dndId = useId()

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id)
      const newIndex = items.findIndex((i) => i.id === over.id)
      onChange(arrayMove(items, oldIndex, newIndex))
    }
  }

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
                onDelete={() => onChange(items.filter((i) => i.id !== item.id))}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

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
