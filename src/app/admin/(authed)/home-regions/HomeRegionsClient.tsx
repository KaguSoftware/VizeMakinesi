'use client'

import { useState, useTransition } from 'react'
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
import { AdminButton, ConfirmDialog, useToast } from '@/components/admin/ui'
import {
  deleteEntry,
  toggleEntryVisible,
  reorderEntries,
  toggleRegionVisible,
  type RegionKey,
} from './actions'
import type { Database } from '@/lib/supabase/database.types'
import EntryDialog from './EntryDialog'

type EntryRow = Database['public']['Tables']['home_region_entries']['Row']

const REGION_LABELS: Record<RegionKey, string> = {
  avrupa: 'Avrupa ve Schengen',
  amerika: 'Amerika Kıtası',
  asya: 'Asya ve Pasifik',
  diger: 'Diğer Ülkeler',
}

interface Props {
  initialEntries: Record<RegionKey, EntryRow[]>
  initialSettings: Record<RegionKey, boolean>
}

// ── Sortable entry row ────────────────────────────────────────────────────────

function SortableEntryRow({
  entry,
  onVisibleToggle,
  onEdit,
  onDelete,
}: {
  entry: EntryRow
  onVisibleToggle: (id: string, val: boolean) => void
  onEdit: (entry: EntryRow) => void
  onDelete: (id: string) => void
}) {
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
        className="cursor-grab active:cursor-grabbing text-navy/40 hover:text-navy select-none text-[16px] shrink-0"
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

// ── Sortable list (flat) ──────────────────────────────────────────────────────

function SortableList({
  entries,
  onReorder,
  onVisibleToggle,
  onEdit,
  onDelete,
}: {
  entries: EntryRow[]
  onReorder: (next: EntryRow[]) => void
  onVisibleToggle: (id: string, val: boolean) => void
  onEdit: (entry: EntryRow) => void
  onDelete: (id: string) => void
}) {
  const sensors = useSensors(useSensor(PointerSensor))

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

// ── Region section ────────────────────────────────────────────────────────────

function RegionSection({
  region,
  entries,
  regionVisible,
  onEntriesChange,
  onRegionVisibleChange,
}: {
  region: RegionKey
  entries: EntryRow[]
  regionVisible: boolean
  onEntriesChange: (next: EntryRow[]) => void
  onRegionVisibleChange: (val: boolean) => void
}) {
  const [open, setOpen] = useState(region === 'avrupa')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editEntry, setEditEntry] = useState<EntryRow | null | 'new'>('new' as never)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [, startTransition] = useTransition()
  const { showToast } = useToast()

  // For avrupa: split into pinned + non-pinned sub-groups
  const pinnedEntries = entries.filter((e) => e.pinned)
  const restEntries = entries.filter((e) => !e.pinned)

  function handleVisibleToggle(id: string, val: boolean) {
    startTransition(async () => {
      const res = await toggleEntryVisible(id, val)
      if (res.error) {
        showToast(res.error, 'error')
        return
      }
      onEntriesChange(entries.map((e) => (e.id === id ? { ...e, visible: val } : e)))
      showToast(val ? 'Görünür yapıldı' : 'Gizlendi')
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const res = await deleteEntry(id)
      if (res.error) {
        showToast(res.error, 'error')
        return
      }
      onEntriesChange(entries.filter((e) => e.id !== id))
      showToast('Giriş silindi')
    })
    setDeleteId(null)
  }

  function handleReorder(group: 'pinned' | 'rest', next: EntryRow[]) {
    const other = group === 'pinned' ? restEntries : pinnedEntries
    const combined = group === 'pinned' ? [...next, ...other] : [...other, ...next]
    onEntriesChange(combined)
    startTransition(async () => {
      await reorderEntries(next.map((e) => e.id))
    })
  }

  function handleFlatReorder(next: EntryRow[]) {
    onEntriesChange(next)
    startTransition(async () => {
      await reorderEntries(next.map((e) => e.id))
    })
  }

  function handleSaved(saved: EntryRow) {
    const existing = entries.find((e) => e.id === saved.id)
    if (existing) {
      onEntriesChange(entries.map((e) => (e.id === saved.id ? saved : e)))
    } else {
      onEntriesChange([...entries, saved])
    }
  }

  function handleRegionToggle() {
    const next = !regionVisible
    onRegionVisibleChange(next)
    startTransition(async () => {
      const res = await toggleRegionVisible(region, next)
      if (res.error) showToast(res.error, 'error')
      else showToast(next ? 'Bölge gösterilecek' : 'Bölge gizlenecek')
    })
  }

  return (
    <>
      {/* Accordion header */}
      <div className="border border-navy/10 rounded overflow-hidden">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setOpen((v) => !v)}
          onKeyDown={(e) => e.key === 'Enter' && setOpen((v) => !v)}
          className="w-full flex items-center gap-3 px-5 py-4 bg-white hover:bg-navy/2 transition-colors cursor-pointer select-none"
        >
          <span className="font-mono text-[11px] text-navy/40 transition-transform duration-200 select-none"
            style={{ display: 'inline-block', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>
            ▶
          </span>
          <span className="font-serif text-[18px] font-bold text-navy flex-1">
            {REGION_LABELS[region]}
          </span>
          <span className="font-mono text-[10px] bg-navy/8 text-navy/60 px-2 py-0.5 rounded">
            {entries.length} giriş
          </span>
          {region === 'diger' && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleRegionToggle() }}
              className={[
                'ml-2 px-3 py-1 font-mono text-[9px] tracking-widest uppercase border rounded-sm transition-colors duration-150',
                regionVisible
                  ? 'bg-coral text-white border-coral'
                  : 'bg-white text-navy/40 border-navy/20 hover:border-coral hover:text-coral',
              ].join(' ')}
            >
              {regionVisible ? 'Bölge Görünür' : 'Bölge Gizli'}
            </button>
          )}
        </div>

        {/* Accordion body */}
        {open && (
          <div className="border-t border-navy/10 bg-navy/1 p-4 flex flex-col gap-4">
            {region === 'avrupa' ? (
              <>
                {/* Pinned sub-group */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-navy/50">
                      Öne Çıkanlar
                    </span>
                    <span className="font-mono text-[9px] bg-coral/10 text-coral px-1.5 py-0.5 rounded">
                      {pinnedEntries.length}
                    </span>
                  </div>
                  <SortableList
                    entries={pinnedEntries}
                    onReorder={(next) => handleReorder('pinned', next)}
                    onVisibleToggle={handleVisibleToggle}
                    onEdit={(e) => { setEditEntry(e); setDialogOpen(true) }}
                    onDelete={(id) => setDeleteId(id)}
                  />
                  <div className="mt-2">
                    <AdminButton
                      variant="secondary"
                      onClick={() => { setEditEntry(null); setDialogOpen(true) }}
                    >
                      + Öne Çıkan Ekle
                    </AdminButton>
                  </div>
                </div>

                {/* Non-pinned sub-group */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-navy/50">
                      Diğerleri
                    </span>
                    <span className="font-mono text-[9px] bg-navy/8 text-navy/50 px-1.5 py-0.5 rounded">
                      {restEntries.length}
                    </span>
                  </div>
                  <SortableList
                    entries={restEntries}
                    onReorder={(next) => handleReorder('rest', next)}
                    onVisibleToggle={handleVisibleToggle}
                    onEdit={(e) => { setEditEntry(e); setDialogOpen(true) }}
                    onDelete={(id) => setDeleteId(id)}
                  />
                  <div className="mt-2">
                    <AdminButton
                      variant="secondary"
                      onClick={() => { setEditEntry(null); setDialogOpen(true) }}
                    >
                      + Giriş Ekle
                    </AdminButton>
                  </div>
                </div>
              </>
            ) : (
              <>
                <SortableList
                  entries={entries}
                  onReorder={handleFlatReorder}
                  onVisibleToggle={handleVisibleToggle}
                  onEdit={(e) => { setEditEntry(e); setDialogOpen(true) }}
                  onDelete={(id) => setDeleteId(id)}
                />
                <AdminButton
                  variant="secondary"
                  onClick={() => { setEditEntry(null); setDialogOpen(true) }}
                >
                  + Giriş Ekle
                </AdminButton>
              </>
            )}
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {deleteId && (
        <ConfirmDialog
          message="Bu girişi silmek istediğinizden emin misiniz?"
          confirmLabel="Sil"
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {/* Add/Edit dialog */}
      {dialogOpen && (
        <EntryDialog
          region={region}
          entry={editEntry && editEntry !== 'new' ? (editEntry as EntryRow) : undefined}
          onClose={() => { setDialogOpen(false); setEditEntry(null) }}
          onSaved={handleSaved}
        />
      )}
    </>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

const REGION_ORDER: RegionKey[] = ['avrupa', 'asya', 'amerika', 'diger']

export default function HomeRegionsClient({ initialEntries, initialSettings }: Props) {
  const [entriesMap, setEntriesMap] = useState<Record<RegionKey, EntryRow[]>>(initialEntries)
  const [settingsMap, setSettingsMap] = useState<Record<RegionKey, boolean>>(initialSettings)

  function updateRegionEntries(region: RegionKey, next: EntryRow[]) {
    setEntriesMap((prev) => ({ ...prev, [region]: next }))
  }

  function updateRegionVisible(region: RegionKey, val: boolean) {
    setSettingsMap((prev) => ({ ...prev, [region]: val }))
  }

  return (
    <div className="flex flex-col gap-4">
      {REGION_ORDER.map((region) => (
        <RegionSection
          key={region}
          region={region}
          entries={entriesMap[region]}
          regionVisible={settingsMap[region]}
          onEntriesChange={(next) => updateRegionEntries(region, next)}
          onRegionVisibleChange={(val) => updateRegionVisible(region, val)}
        />
      ))}
    </div>
  )
}
