'use client'

import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

interface DirtyContextValue {
  isDirty: boolean
  setDirty: (v: boolean) => void
  /** Returns true if the caller is clear to navigate; otherwise prompts the user. */
  confirmDiscard: () => boolean
}

const DirtyContext = createContext<DirtyContextValue | null>(null)

/**
 * Warn the user before they unload the tab while a form has unsaved changes.
 * Pass `false` once the form is saving or has just submitted to skip the warning.
 *
 * Also registers the dirty flag globally so that admin sidebar links and other
 * in-app navigation can prompt the user before leaving. See {@link useDirtyGuard}.
 */
export function useUnsavedChanges(dirty: boolean) {
  const ctx = useContext(DirtyContext)
  const setGlobalDirty = ctx?.setDirty

  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  useEffect(() => {
    if (!setGlobalDirty) return
    setGlobalDirty(dirty)
    return () => setGlobalDirty(false)
  }, [dirty, setGlobalDirty])
}

/**
 * Derive a dirty flag by comparing the current values against a snapshot
 * captured on the first render. The current snapshot is memoized when the
 * input identity is stable to avoid re-stringifying large forms on every
 * keystroke.
 *
 * Pass `baselineKey` and change it (e.g. bump a counter after a successful
 * save) to re-capture the snapshot from the current values — forms that stay
 * on the page after saving need this, otherwise they'd read as dirty forever.
 */
export function useDirtyFromSnapshot<T>(current: T, baselineKey: unknown = null): boolean {
  const currentJson = useMemo(() => JSON.stringify(current), [current])
  const [baseline, setBaseline] = useState({ key: baselineKey, json: currentJson })

  // Re-baseline during render (React's "adjust state when a prop changes"
  // pattern) rather than in an effect, so the flag is already correct on the
  // render where the key changes — no dirty flicker after a save.
  const stale = !Object.is(baseline.key, baselineKey)
  if (stale) setBaseline({ key: baselineKey, json: currentJson })

  return !stale && baseline.json !== currentJson
}

// ── Global dirty-form guard ──────────────────────────────────────────────────

export function DirtyFormProvider({ children }: { children: ReactNode }) {
  const [isDirty, setIsDirty] = useState(false)

  const setDirty = useCallback((v: boolean) => setIsDirty(v), [])

  // confirmDiscard captures the latest `isDirty` via its closure. It changes
  // identity when the dirty flag flips, which is fine — consumers call it
  // inline in click handlers, they don't depend on its referential stability.
  const confirmDiscard = useCallback(() => {
    if (!isDirty) return true
    return window.confirm(
      'Kaydedilmemiş değişiklikler var. Sayfadan ayrılmak istediğinize emin misiniz?'
    )
  }, [isDirty])

  const value = useMemo(
    () => ({ isDirty, setDirty, confirmDiscard }),
    [isDirty, setDirty, confirmDiscard],
  )
  return createElement(DirtyContext.Provider, { value }, children)
}

export function useDirtyGuard(): DirtyContextValue {
  const ctx = useContext(DirtyContext)
  return ctx ?? { isDirty: false, setDirty: () => {}, confirmDiscard: () => true }
}
