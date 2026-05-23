'use client'

import Link, { type LinkProps } from 'next/link'
import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from 'react'
import { useDirtyGuard } from '@/lib/hooks/useUnsavedChanges'

type Props = LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>

export const GuardedLink = forwardRef<HTMLAnchorElement, Props>(function GuardedLink(
  { onClick, href, ...rest }, ref
) {
  const { confirmDiscard } = useDirtyGuard()

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    // Let the parent handler run first; respect its preventDefault.
    onClick?.(e)
    if (e.defaultPrevented) return

    // We only guard plain left-clicks without modifier keys — modified clicks
    // open in a new tab/window which is safe regardless of dirty state.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

    if (!confirmDiscard()) {
      e.preventDefault()
    }
    // Otherwise fall through to Next's <Link> default navigation.
  }

  return <Link ref={ref} href={href} onClick={handleClick} {...rest} />
})
