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
  arrayMove,
} from '@dnd-kit/sortable'
import { AdminButton, ConfirmDialog, useToast } from '@/components/admin/ui'
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
import SortableCategory, { type CategoryWithItems } from './SortableCategory'
import type { ItemWithCountry } from './SortableItem'
import type { PickableCountry } from './CountryPickerModal'

const MAX_ITEMS_PER_CATEGORY = 3

interface Props {
  initial: CategoryWithItems[]
  countries: PickableCountry[]
}

export default function MegaMenuClient({ initial, countries }: Props) {
  const [categories, setCategories] = useState<CategoryWithItems[]>(initial)
  const [, startTransition] = useTransition()
  const [confirmCatId, setConfirmCatId] = useState<string | null>(null)
  const { showToast } = useToast()
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  )

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

  function handleAddItem(categoryId: string, country: PickableCountry) {
    const cat = categories.find((c) => c.id === categoryId)
    if (cat && cat.items.length >= MAX_ITEMS_PER_CATEGORY) return
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

  function handleUpdateItem(id: string, country: PickableCountry) {
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
          <p className="font-mono text-[12px] text-navy/60 py-8 text-center">Henüz kategori eklenmedi</p>
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
