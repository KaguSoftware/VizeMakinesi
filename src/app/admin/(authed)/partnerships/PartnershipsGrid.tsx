'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ConfirmDialog, EmptyState, useToast } from '@/components/admin/ui'
import { reorderPartnerships, togglePartnershipVisible, deletePartnership } from './actions'
import type { Database } from '@/lib/supabase/database.types'

type PartnershipRow = Database['public']['Tables']['partnerships']['Row']

function SortableCard({
  p,
  onToggleVisible,
  onDelete,
}: {
  p: PartnershipRow
  onToggleVisible: (id: string, visible: boolean) => void
  onDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: p.id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={['border border-navy/10 bg-white flex flex-col', isDragging ? 'opacity-40' : ''].join(' ')}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-navy/8">
        <button type="button" {...attributes} {...listeners} aria-label="Sürükle" className="cursor-grab active:cursor-grabbing text-navy/55 hover:text-navy/80 select-none focus:outline-none touch-none p-1 -m-1">⠿</button>
        <button
          type="button"
          onClick={() => onToggleVisible(p.id, !p.visible)}
          className={['font-mono text-[10px] tracking-widest uppercase px-2 py-1 border transition-colors', p.visible ? 'border-coral text-coral' : 'border-navy/30 text-navy/60 hover:border-navy/60'].join(' ')}
        >
          {p.visible ? 'Görünür' : 'Gizli'}
        </button>
      </div>
      <div className="flex-1 p-5 flex flex-col gap-3">
        {p.logo_url ? (
          <div className="h-14 flex items-center">
            <Image src={p.logo_url} alt={p.name} width={160} height={56} className="object-contain object-left" />
          </div>
        ) : (
          <div className="h-14 flex items-center">
            <span className="font-mono text-[11px] text-navy/55 uppercase tracking-widest">Logo yok</span>
          </div>
        )}
        {p.eyebrow && <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-coral">— {p.eyebrow}</div>}
        <h3 className="font-serif font-semibold text-[18px] text-navy">{p.name}</h3>
        {p.description && <p className="font-serif text-[14px] text-navy/70 line-clamp-2">{p.description}</p>}
      </div>
      <div className="flex items-center gap-4 px-5 py-3 border-t border-navy/8">
        <Link href={`/admin/partnerships/${p.id}/edit`} className="font-mono text-[10px] tracking-widest uppercase text-navy hover:text-coral transition-colors">Düzenle</Link>
        <button type="button" onClick={() => onDelete(p.id)} className="font-mono text-[10px] tracking-widest uppercase text-red-500 hover:text-red-700 transition-colors">Sil</button>
      </div>
    </div>
  )
}

export default function PartnershipsGrid({ initial }: { initial: PartnershipRow[] }) {
  const [partnerships, setPartnerships] = useState(initial)
  const [, startTransition] = useTransition()
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const { showToast } = useToast()
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIdx = partnerships.findIndex((p) => p.id === active.id)
    const newIdx = partnerships.findIndex((p) => p.id === over.id)
    const reordered = arrayMove(partnerships, oldIdx, newIdx)
    setPartnerships(reordered)
    startTransition(async () => {
      const result = await reorderPartnerships(reordered.map((p) => p.id))
      if (result.error) showToast(result.error, 'error')
    })
  }

  function handleToggleVisible(id: string, visible: boolean) {
    setPartnerships((prev) => prev.map((p) => p.id === id ? { ...p, visible } : p))
    startTransition(async () => {
      const result = await togglePartnershipVisible(id, visible)
      if (result.error) showToast(result.error, 'error')
    })
  }

  function handleDeleteConfirmed() {
    if (!confirmId) return
    const id = confirmId
    setConfirmId(null)
    setPartnerships((prev) => prev.filter((p) => p.id !== id))
    startTransition(async () => {
      const result = await deletePartnership(id)
      if (result.error) showToast(result.error, 'error')
      else showToast('Ortaklık silindi')
    })
  }

  const confirmPartnership = partnerships.find((p) => p.id === confirmId)

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={partnerships.map((p) => p.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {partnerships.map((p) => (
              <SortableCard key={p.id} p={p} onToggleVisible={handleToggleVisible} onDelete={setConfirmId} />
            ))}
          </div>
          {partnerships.length === 0 && (
            <EmptyState
              title="Henüz ortaklık yok"
              description="Web sitenizde gösterilecek ortaklıkları buradan ekleyin."
              cta={{ href: '/admin/partnerships/new', label: '+ İlk Ortaklığı Ekle' }}
            />
          )}
        </SortableContext>
      </DndContext>

      {confirmId && confirmPartnership && (
        <ConfirmDialog
          message={`"${confirmPartnership.name}" ortaklığı silinecek. Bu işlem geri alınamaz.`}
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </>
  )
}
