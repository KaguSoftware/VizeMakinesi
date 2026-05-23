'use client'

import { useFormStatus } from 'react-dom'

function Button() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="self-start font-mono text-[11px] tracking-widest uppercase text-white/85 hover:text-coral transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Çıkış yapılıyor…' : 'Çıkış'}
    </button>
  )
}

export function SignOutButton() {
  return (
    <form action="/admin/signout" method="post">
      <Button />
    </form>
  )
}
