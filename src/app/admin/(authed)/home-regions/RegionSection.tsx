'use client'

import { useState, useTransition } from 'react'
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
import SortableEntryList from './SortableEntryList'

type EntryRow = Database['public']['Tables']['home_region_entries']['Row']

const REGION_LABELS: Record<RegionKey, string> = {
  avrupa: 'Avrupa ve Schengen',
  populer: 'Popüler Vizeler',
  asya: 'Asya ve Pasifik Vizeleri',
  amerika: 'Amerika Kıtası',
  diger: 'Diğer Vizeler',
}

interface Props {
  region: RegionKey
  entries: EntryRow[]
  regionVisible: boolean
  onEntriesChange: (next: EntryRow[]) => void
  onRegionVisibleChange: (val: boolean) => void
}

export default function RegionSection({
  region,
  entries,
  regionVisible,
  onEntriesChange,
  onRegionVisibleChange,
}: Props) {
  const [open, setOpen] = useState(region === 'populer')
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
                  <SortableEntryList
                    id={`${region}-pinned`}
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
                  <SortableEntryList
                    id={`${region}-rest`}
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
                <SortableEntryList
                  id={region}
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
