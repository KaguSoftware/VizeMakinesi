'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const passwordRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      // Surface a user-friendly Turkish message for the common "wrong password" case
      const friendly = /invalid login credentials/i.test(authError.message)
        ? 'E-posta veya şifre hatalı.'
        : authError.message
      setError(friendly)
      setLoading(false)
      // Clear password and refocus so the user can retry without extra clicks
      setPassword('')
      passwordRef.current?.focus()
      return
    }

    const userId = authData.user?.id
    const { data: adminProfile, error: adminError } = userId
      ? await supabase
          .from('admin_profiles')
          .select('id')
          .eq('id', userId)
          .maybeSingle()
      : { data: null, error: null }

    if (adminError || !adminProfile) {
      await supabase.auth.signOut()
      setError('Bu hesap admin olarak yetkilendirilmemiş.')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Eyebrow */}
        <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-navy/40 mb-3">
          — Vize Makinesi
        </p>

        <h1 className="font-serif text-[36px] font-bold tracking-[-0.02em] text-navy leading-[1.1] mb-10">
          Admin Girişi
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label htmlFor="admin-email" className="font-mono text-[11px] tracking-[0.18em] uppercase text-navy/60">
              — E-posta
            </label>
            <input
              id="admin-email"
              type="email"
              inputMode="email"
              required
              autoFocus
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-navy/20 bg-transparent px-4 py-3 font-mono text-[14px] text-navy placeholder:text-navy/30 focus:outline-none focus:border-navy transition-colors"
              placeholder="ornek@domain.com"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label htmlFor="admin-password" className="font-mono text-[11px] tracking-[0.18em] uppercase text-navy/60">
              — Şifre
            </label>
            <input
              id="admin-password"
              ref={passwordRef}
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-navy/20 bg-transparent px-4 py-3 font-mono text-[14px] text-navy placeholder:text-navy/30 focus:outline-none focus:border-navy transition-colors"
              placeholder="••••••••"
            />
          </div>

          {/* Error */}
          {error && (
            <p role="alert" className="font-mono text-[12px] text-coral">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-navy text-cream font-mono text-[12px] tracking-[0.18em] uppercase px-6 py-4 hover:bg-navy/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Giriş yapılıyor…' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  )
}
