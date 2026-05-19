'use client'

import { useEffect, useState } from 'react'

/**
 * Warn the user before they unload the tab while a form has unsaved changes.
 * Pass `false` once the form is saving or has just submitted to skip the warning.
 */
export function useUnsavedChanges(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      // Modern browsers ignore the message text but require preventDefault + a returnValue.
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])
}

/**
 * Derive a dirty flag by comparing the current values against a snapshot
 * captured on the first render. Avoids the React `set-state-in-effect` rule
 * since the comparison happens during render and uses a ref for the snapshot.
 *
 * Note: values are compared via JSON.stringify so they should be JSON-safe.
 */
export function useDirtyFromSnapshot<T>(current: T): boolean {
  const currentJson = JSON.stringify(current)
  // Lazy initializer freezes the snapshot at mount; subsequent renders see the same value.
  const [initial] = useState(() => currentJson)
  return initial !== currentJson
}
