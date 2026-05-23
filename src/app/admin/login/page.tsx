'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AdminButton, AdminInput } from '@/components/admin/ui'

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
      const friendly = /invalid login credentials/i.test(authError.message)
        ? 'E-posta veya şifre hatalı.'
        : authError.message
      setError(friendly)
      setLoading(false)
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
        <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-navy/40 mb-3">
          — Vize Makinesi
        </p>

        <h1 className="font-serif text-[36px] font-bold tracking-[-0.02em] text-navy leading-[1.1] mb-10">
          Admin Girişi
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <AdminInput
            label="E-posta"
            id="admin-email"
            type="email"
            inputMode="email"
            required
            autoFocus
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@domain.com"
          />

          <AdminInput
            label="Şifre"
            id="admin-password"
            ref={passwordRef}
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          {error && (
            <p role="alert" className="font-mono text-[12px] text-red-600">{error}</p>
          )}

          <div className="mt-2">
            <AdminButton type="submit" variant="primary" disabled={loading}>
              {loading ? 'Giriş yapılıyor…' : 'Giriş Yap'}
            </AdminButton>
          </div>

          <Link
            href="/admin/forgot-password"
            className="font-mono text-[11px] tracking-widest uppercase text-navy/60 hover:text-coral transition-colors self-start"
          >
            Şifremi unuttum
          </Link>
        </form>
      </div>
    </div>
  )
}
