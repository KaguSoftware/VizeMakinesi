'use client'

import { useState, useTransition } from 'react'
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
import { useToast } from '@/components/admin/ui'
import {
  createMarqueeItem,
  updateMarqueeItem,
  deleteMarqueeItem,
  toggleMarqueeItemVisible,
  reorderMarqueeItems,
  toggleMarqueeEnabled,
} from './actions'
import type { Database } from '@/lib/supabase/database.types'

type MarqueeRow = Database['public']['Tables']['marquee_items']['Row']

const MAX_ITEMS = 12

interface Props {
  location: 'home' | 'nav_ticker'
  label: string
  initialItems: MarqueeRow[]
  initialEnabled: boolean
}

function SortableItemRow({
  item,
  onUpdate,
  onDelete,
  onToggleVisible,
}: {
  item: MarqueeRow
  onUpdate: (id: string, text: string, url: string) => void
  onDelete: (id: string) => void
  onToggleVisible: (id: string, visible: boolean) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })
  const [text, setText] = useState(item.text)
  const [url, setUrl] = useState(item.url ?? '')
  const [textError, setTextError] = useState(false)

  function commitUpdate() {
    if (!text.trim()) { setTextError(true); return }
    setTextError(false)
    if (text !== item.text || url !== (item.url ?? '')) {
      onUpdate(item.id, text, url)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={['flex items-start gap-3 py-3 border-b border-navy/8 group', isDragging ? 'opacity-40' : ''].join(' ')}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="mt-2 shrink-0 cursor-grab active:cursor-grabbing text-navy/55 hover:text-navy/80 select-none"
      >
        ⠿
      </button>
      <div className="flex-1 flex flex-col gap-2">
        <div>
        <input
          value={text}
          onChange={(e) => { setText(e.target.value); if (textError && e.target.value.trim()) setTextError(false) }}
          onBlur={commitUpdate}
          placeholder="Metin..."
          className={['bg-transparent border-b py-1.5 font-serif text-[16px] text-navy placeholder:text-navy/50 focus:outline-none transition-colors', textError ? 'border-coral' : 'border-navy/20 focus:border-coral'].join(' ')}
        />
        {textError && <p className="font-mono text-[10px] text-coral mt-0.5">Metin boş olamaz</p>}
        </div>
        <div className="flex items-center gap-1.5">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={commitUpdate}
            placeholder="URL (isteğe bağlı)"
            className="flex-1 bg-transparent border-b border-navy/20 py-1 font-mono text-[12px] text-navy/70 placeholder:text-navy/40 focus:outline-none focus:border-coral transition-colors"
          />
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-navy/40 hover:text-coral transition-colors"
              title="URL'yi aç"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onToggleVisible(item.id, !item.visible)}
        className={[
          'mt-2 font-mono text-[10px] tracking-widest uppercase px-2 py-1 border transition-colors',
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
        className="mt-2 font-mono text-[10px] tracking-widest uppercase text-red-500 hover:text-red-700 transition-colors"
      >
        Sil
      </button>
    </div>
  )
}

export default function MarqueeSection({ location, label, initialItems, initialEnabled }: Props) {
  const [items, setItems] = useState<MarqueeRow[]>(initialItems)
  const [enabled, setEnabled] = useState(initialEnabled)
  const [, startTransition] = useTransition()
  const { showToast } = useToast()
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIdx = items.findIndex((i) => i.id === active.id)
    const newIdx = items.findIndex((i) => i.id === over.id)
    const reordered = arrayMove(items, oldIdx, newIdx)
    setItems(reordered)
    startTransition(async () => {
      const result = await reorderMarqueeItems(reordered.map((i) => i.id))
      if (result.error) showToast(result.error, 'error')
    })
  }

  function handleToggleEnabled() {
    const next = !enabled
    setEnabled(next)
    startTransition(async () => {
      const result = await toggleMarqueeEnabled(location, next)
      if (result.error) showToast(result.error, 'error')
    })
  }

  function handleAdd() {
    if (items.length >= MAX_ITEMS) return
    startTransition(async () => {
      const result = await createMarqueeItem(location, 'Yeni öğe')
      if ('id' in result) {
        setItems((prev) => [
          ...prev,
          {
            id: result.id,
            location,
            text: 'Yeni öğe',
            url: null,
            visible: true,
            sort_order: prev.length,
          },
        ])
      }
    })
  }

  function handleUpdate(id: string, text: string, url: string) {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, text, url: url || null } : i))
    startTransition(async () => {
      const result = await updateMarqueeItem(id, text, url)
      if (result.error) showToast(result.error, 'error')
    })
  }

  function handleDelete(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id))
    startTransition(async () => {
      const result = await deleteMarqueeItem(id)
      if (result.error) showToast(result.error, 'error')
    })
  }

  function handleToggleVisible(id: string, visible: boolean) {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, visible } : i))
    startTransition(async () => {
      const result = await toggleMarqueeItemVisible(id, visible)
      if (result.error) showToast(result.error, 'error')
    })
  }

  return (
    <div className="border border-navy/10 bg-white">
      {/* Section header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-navy/8">
        <h2 className="font-serif text-[22px] font-semibold text-navy">{label}</h2>
        <button
          type="button"
          onClick={handleToggleEnabled}
          className={[
            'font-mono text-[11px] tracking-widest uppercase px-4 py-2 border transition-colors',
            enabled
              ? 'bg-coral border-coral text-navy'
              : 'bg-transparent border-navy/20 text-navy/65 hover:border-navy/60',
          ].join(' ')}
        >
          {enabled ? 'Marquee Görünür' : 'Marquee Gizli'}
        </button>
      </div>

      {/* Items */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-[11px] tracking-widest uppercase text-navy/70">
            {items.length} / {MAX_ITEMS} öğe
          </span>
        </div>

        <DndContext id={`marquee-dnd-${location}`} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <div>
              {items.map((item) => (
                <SortableItemRow
                  key={item.id}
                  item={item}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  onToggleVisible={handleToggleVisible}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {items.length === 0 && (
          <p className="font-mono text-[11px] text-navy/60 italic py-4">Henüz öğe eklenmedi</p>
        )}

        <div className="mt-4 flex items-center gap-3">
          {items.length < MAX_ITEMS ? (
            <button
              type="button"
              onClick={handleAdd}
              className="font-mono text-[11px] tracking-widest uppercase text-coral hover:text-navy transition-colors"
            >
              + Ekle
            </button>
          ) : (
            <p className="font-mono text-[11px] text-coral">
              En fazla {MAX_ITEMS} öğe ekleyebilirsiniz
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
