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
import { reorderTeamMembers, toggleTeamMemberVisible, deleteTeamMember } from './actions'
import type { Database } from '@/lib/supabase/database.types'

type TeamMemberRow = Database['public']['Tables']['team_members']['Row']

function SortableCard({
  m,
  onToggleVisible,
  onDelete,
}: {
  m: TeamMemberRow
  onToggleVisible: (id: string, visible: boolean) => void
  onDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: m.id })

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
          onClick={() => onToggleVisible(m.id, !m.visible)}
          className={['font-mono text-[10px] tracking-widest uppercase px-2 py-1 border transition-colors', m.visible ? 'border-coral text-coral' : 'border-navy/30 text-navy/60 hover:border-navy/60'].join(' ')}
        >
          {m.visible ? 'Görünür' : 'Gizli'}
        </button>
      </div>

      <div className="p-6 flex flex-col items-center gap-3 flex-1">
        {m.photo_url ? (
          <Image src={m.photo_url} alt={m.name} width={72} height={72} className="w-[72px] h-[72px] rounded-full object-cover border border-navy" />
        ) : (
          <div className="w-[72px] h-[72px] rounded-full border border-navy flex items-center justify-center font-serif italic text-[26px] text-navy">
            {m.initials}
          </div>
        )}
        <div className="text-center">
          <div className="font-serif font-semibold text-[16px] text-navy">{m.name}</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-navy/65 mt-1">{m.role}</div>
        </div>
      </div>

      <div className="flex items-center gap-4 px-4 py-3 border-t border-navy/8">
        <Link href={`/admin/team/${m.id}/edit`} className="font-mono text-[10px] tracking-widest uppercase text-navy hover:text-coral transition-colors">Düzenle</Link>
        <button type="button" onClick={() => onDelete(m.id)} className="font-mono text-[10px] tracking-widest uppercase text-red-500 hover:text-red-700 transition-colors">Sil</button>
      </div>
    </div>
  )
}

export default function AdminTeamGrid({ initial }: { initial: TeamMemberRow[] }) {
  const [members, setMembers] = useState(initial)
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
    const oldIdx = members.findIndex((m) => m.id === active.id)
    const newIdx = members.findIndex((m) => m.id === over.id)
    const reordered = arrayMove(members, oldIdx, newIdx)
    setMembers(reordered)
    startTransition(async () => {
      const result = await reorderTeamMembers(reordered.map((m) => m.id))
      if (result.error) showToast(result.error, 'error')
    })
  }

  function handleToggleVisible(id: string, visible: boolean) {
    setMembers((prev) => prev.map((m) => m.id === id ? { ...m, visible } : m))
    startTransition(async () => {
      const result = await toggleTeamMemberVisible(id, visible)
      if (result.error) showToast(result.error, 'error')
    })
  }

  function handleDeleteConfirmed() {
    if (!confirmId) return
    const id = confirmId
    setConfirmId(null)
    setMembers((prev) => prev.filter((m) => m.id !== id))
    startTransition(async () => {
      const result = await deleteTeamMember(id)
      if (result.error) showToast(result.error, 'error')
      else showToast('Üye silindi')
    })
  }

  const confirmMember = members.find((m) => m.id === confirmId)

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={members.map((m) => m.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {members.map((m) => (
              <SortableCard key={m.id} m={m} onToggleVisible={handleToggleVisible} onDelete={setConfirmId} />
            ))}
          </div>
          {members.length === 0 && (
            <EmptyState
              title="Henüz ekip üyesi yok"
              description="Hakkımızda sayfasında gösterilecek ekip üyelerini buradan ekleyin."
              cta={{ href: '/admin/team/new', label: '+ İlk Üyeyi Ekle' }}
            />
          )}
        </SortableContext>
      </DndContext>

      {confirmId && confirmMember && (
        <ConfirmDialog
          message={`"${confirmMember.name}" silinecek. Bu işlem geri alınamaz.`}
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </>
  )
}
