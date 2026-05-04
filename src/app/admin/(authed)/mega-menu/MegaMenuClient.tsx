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
import { AdminButton, EyebrowText, ConfirmDialog, useToast } from '@/components/admin/ui'
import {
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
  toggleCategoryVisible,
  createItem,
  updateItem,
  deleteItem,
  toggleItemVisible,
  reorderItems,
} from './actions'
import type { Database } from '@/lib/supabase/database.types'

type CategoryRow = Database['public']['Tables']['mega_menu_categories']['Row']
type ItemRow = Database['public']['Tables']['mega_menu_items']['Row']
type CountryRow = Database['public']['Tables']['countries']['Row']

interface ItemWithCountry extends ItemRow {
  country: Pick<CountryRow, 'id' | 'name' | 'flag_emoji'>
}

interface CategoryWithItems extends CategoryRow {
  items: ItemWithCountry[]
}

interface Props {
  initial: CategoryWithItems[]
  countries: Pick<CountryRow, 'id' | 'name' | 'flag_emoji'>[]
}

// ── Country picker modal ──────────────────────────────────────────────────────

function CountryPickerModal({
  countries,
  onSelect,
  onClose,
}: {
  countries: Props['countries']
  onSelect: (country: Props['countries'][0]) => void
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const filtered = countries.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div
      className="fixed inset-0 bg-navy/30 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-navy/10 w-full max-w-sm p-6 flex flex-col gap-4 max-h-[70vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <EyebrowText>Ülke Seç</EyebrowText>
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-[11px] text-navy/40 hover:text-navy"
          >
            ✕
          </button>
        </div>
        <input
          autoFocus
          placeholder="Ara..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border-b border-navy/20 py-2 font-serif text-[16px] text-navy placeholder:text-navy/30 focus:outline-none focus:border-coral"
        />
        <div className="overflow-y-auto flex flex-col gap-1">
          {filtered.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(c)}
              className="flex items-center gap-3 px-3 py-2 text-left hover:bg-cream transition-colors"
            >
              <span className="text-[18px]">{c.flag_emoji}</span>
              <span className="font-serif text-[15px] text-navy">{c.name}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="font-mono text-[11px] text-navy/30 py-4 text-center">Sonuç bulunamadı</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Sortable item row ─────────────────────────────────────────────────────────

function SortableItem({
  item,
  countries,
  onUpdate,
  onDelete,
  onToggleVisible,
}: {
  item: ItemWithCountry
  countries: Props['countries']
  onUpdate: (id: string, country: Props['countries'][0]) => void
  onDelete: (id: string) => void
  onToggleVisible: (id: string, visible: boolean) => void
}) {
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
          className="shrink-0 cursor-grab active:cursor-grabbing text-navy/20 hover:text-navy/50 select-none"
        >
          ⠿
        </button>
        <span className="text-[18px] shrink-0">{item.country.flag_emoji}</span>
        <span className="flex-1 font-serif text-[15px] text-navy">{item.country.name}</span>
        <button
          type="button"
          onClick={() => setShowPicker(true)}
          className="font-mono text-[10px] tracking-widest uppercase text-navy/30 hover:text-navy transition-colors"
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
              : 'border-navy/20 text-navy/30 hover:border-navy/40',
          ].join(' ')}
        >
          {item.visible ? 'Görünür' : 'Gizli'}
        </button>
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="font-mono text-[10px] tracking-widest uppercase text-navy/25 hover:text-red-500 transition-colors"
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

// ── Sortable category card ────────────────────────────────────────────────────

function SortableCategory({
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
}: {
  cat: CategoryWithItems
  countries: Props['countries']
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
  onToggleVisible: (id: string, visible: boolean) => void
  onAddItem: (categoryId: string, country: Props['countries'][0]) => void
  onUpdateItem: (id: string, country: Props['countries'][0]) => void
  onDeleteItem: (id: string) => void
  onToggleItemVisible: (id: string, visible: boolean) => void
  onReorderItems: (categoryId: string, items: ItemWithCountry[]) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cat.id })
  const [editingName, setEditingName] = useState(cat.name)
  const [showAddPicker, setShowAddPicker] = useState(false)

  const sensors = useSensors(useSensor(PointerSensor))

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
            className="shrink-0 cursor-grab active:cursor-grabbing text-navy/25 hover:text-navy/60 select-none"
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
                : 'border-navy/20 text-navy/30 hover:border-navy/40',
            ].join(' ')}
          >
            {cat.visible ? 'Görünür' : 'Gizli'}
          </button>
          <button
            type="button"
            onClick={() => onDelete(cat.id)}
            className="font-mono text-[10px] tracking-widest uppercase text-navy/25 hover:text-red-500 transition-colors"
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
            <p className="font-mono text-[11px] text-navy/30 italic py-2">Henüz ülke eklenmedi</p>
          )}

          <button
            type="button"
            onClick={() => setShowAddPicker(true)}
            className="mt-3 font-mono text-[11px] tracking-widest uppercase text-coral hover:text-navy transition-colors"
          >
            + Ülke Ekle
          </button>
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

// ── Main client component ─────────────────────────────────────────────────────

export default function MegaMenuClient({ initial, countries }: Props) {
  const [categories, setCategories] = useState<CategoryWithItems[]>(initial)
  const [, startTransition] = useTransition()
  const [confirmCatId, setConfirmCatId] = useState<string | null>(null)
  const { showToast } = useToast()
  const sensors = useSensors(useSensor(PointerSensor))

  function handleCategoryDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIdx = categories.findIndex((c) => c.id === active.id)
    const newIdx = categories.findIndex((c) => c.id === over.id)
    const reordered = arrayMove(categories, oldIdx, newIdx)
    setCategories(reordered)
    startTransition(async () => {
      const result = await reorderCategories(reordered.map((c) => c.id))
      if (result.error) showToast(result.error, 'error')
    })
  }

  function handleAddCategory() {
    const name = 'Yeni Kategori'
    startTransition(async () => {
      const result = await createCategory(name)
      if ('id' in result) {
        setCategories((prev) => [
          ...prev,
          { id: result.id, name, sort_order: prev.length, visible: true, items: [] },
        ])
      }
    })
  }

  function handleRename(id: string, name: string) {
    setCategories((prev) => prev.map((c) => c.id === id ? { ...c, name } : c))
    startTransition(() => { updateCategory(id, name) })
  }

  function handleDeleteCategory(id: string) {
    const cat = categories.find((c) => c.id === id)
    if (cat && cat.items.length > 0) {
      setConfirmCatId(id)
      return
    }
    executeCategoryDelete(id)
  }

  function executeCategoryDelete(id: string) {
    setConfirmCatId(null)
    setCategories((prev) => prev.filter((c) => c.id !== id))
    startTransition(async () => {
      const result = await deleteCategory(id)
      if (result.error) showToast(result.error, 'error')
      else showToast('Kategori silindi')
    })
  }

  function handleToggleCategoryVisible(id: string, visible: boolean) {
    setCategories((prev) => prev.map((c) => c.id === id ? { ...c, visible } : c))
    startTransition(async () => {
      const result = await toggleCategoryVisible(id, visible)
      if (result.error) showToast(result.error, 'error')
    })
  }

  function handleAddItem(categoryId: string, country: Props['countries'][0]) {
    startTransition(async () => {
      const result = await createItem(categoryId, country.id)
      if ('id' in result) {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === categoryId
              ? {
                  ...c,
                  items: [
                    ...c.items,
                    {
                      id: result.id,
                      category_id: categoryId,
                      country_id: country.id,
                      sort_order: c.items.length,
                      visible: true,
                      country,
                    },
                  ],
                }
              : c
          )
        )
      }
    })
  }

  function handleUpdateItem(id: string, country: Props['countries'][0]) {
    setCategories((prev) =>
      prev.map((c) => ({
        ...c,
        items: c.items.map((it) =>
          it.id === id ? { ...it, country_id: country.id, country } : it
        ),
      }))
    )
    startTransition(async () => {
      const result = await updateItem(id, country.id)
      if (result.error) showToast(result.error, 'error')
    })
  }

  function handleDeleteItem(id: string) {
    setCategories((prev) =>
      prev.map((c) => ({ ...c, items: c.items.filter((it) => it.id !== id) }))
    )
    startTransition(async () => {
      const result = await deleteItem(id)
      if (result.error) showToast(result.error, 'error')
    })
  }

  function handleToggleItemVisible(id: string, visible: boolean) {
    setCategories((prev) =>
      prev.map((c) => ({
        ...c,
        items: c.items.map((it) => (it.id === id ? { ...it, visible } : it)),
      }))
    )
    startTransition(async () => {
      const result = await toggleItemVisible(id, visible)
      if (result.error) showToast(result.error, 'error')
    })
  }

  function handleReorderItems(categoryId: string, items: ItemWithCountry[]) {
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, items } : c))
    )
    startTransition(async () => {
      const result = await reorderItems(
        items.map((it, i) => ({ id: it.id, category_id: categoryId, sort_order: i }))
      )
      if (result.error) showToast(result.error, 'error')
    })
  }

  const confirmCat = categories.find((c) => c.id === confirmCatId)

  return (
    <>
    <div className="flex flex-col gap-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCategoryDragEnd}>
        <SortableContext items={categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-4">
            {categories.map((cat) => (
              <SortableCategory
                key={cat.id}
                cat={cat}
                countries={countries}
                onRename={handleRename}
                onDelete={handleDeleteCategory}
                onToggleVisible={handleToggleCategoryVisible}
                onAddItem={handleAddItem}
                onUpdateItem={handleUpdateItem}
                onDeleteItem={handleDeleteItem}
                onToggleItemVisible={handleToggleItemVisible}
                onReorderItems={handleReorderItems}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {categories.length === 0 && (
        <p className="font-mono text-[12px] text-navy/30 py-8 text-center">Henüz kategori eklenmedi</p>
      )}

      <div className="pt-2">
        <AdminButton variant="primary" onClick={handleAddCategory}>
          + Yeni Kategori Ekle
        </AdminButton>
      </div>
    </div>

    {confirmCatId && confirmCat && (
      <ConfirmDialog
        message={`"${confirmCat.name}" kategorisi ve ${confirmCat.items.length} öğesi silinecek. Bu işlem geri alınamaz.`}
        onConfirm={() => executeCategoryDelete(confirmCatId)}
        onCancel={() => setConfirmCatId(null)}
      />
    )}
    </>
  )
}
