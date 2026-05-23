'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AdminButton, AdminInput } from '@/components/admin/ui'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const supabase = createClient()
      const redirectTo =
        typeof window !== 'undefined'
          ? `${window.location.origin}/admin/reset-password`
          : undefined
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      })
      if (resetError) {
        setError(resetError.message)
      } else {
        // Always show success regardless of whether the email exists — avoids
        // leaking whether a given address is a registered admin.
        setSent(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-navy/40 mb-3">
          — Vize Makinesi
        </p>

        <h1 className="font-serif text-[36px] font-bold tracking-[-0.02em] text-navy leading-[1.1] mb-4">
          Şifremi Unuttum
        </h1>

        {sent ? (
          <div className="flex flex-col gap-6">
            <p className="font-serif text-[17px] text-navy/85 leading-relaxed">
              Eğer bu adres bir admin hesabına bağlıysa, şifre sıfırlama bağlantısı
              gönderildi. E-postanızı kontrol edin.
            </p>
            <Link
              href="/admin/login"
              className="font-mono text-[11px] tracking-widest uppercase text-coral hover:text-navy transition-colors self-start"
            >
              ← Girişe Dön
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <p className="font-serif text-[15px] text-navy/75 leading-relaxed mb-2">
              Hesabınıza bağlı e-posta adresini girin; size bir sıfırlama bağlantısı
              göndereceğiz.
            </p>

            <AdminInput
              label="E-posta"
              id="forgot-email"
              type="email"
              inputMode="email"
              required
              autoFocus
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@domain.com"
            />

            {error && (
              <p role="alert" className="font-mono text-[12px] text-red-600">{error}</p>
            )}

            <div className="flex items-center gap-4 mt-2">
              <AdminButton type="submit" variant="primary" disabled={loading}>
                {loading ? 'Gönderiliyor…' : 'Bağlantı Gönder'}
              </AdminButton>
              <Link
                href="/admin/login"
                className="font-mono text-[11px] tracking-widest uppercase text-navy/60 hover:text-coral transition-colors"
              >
                ← Girişe Dön
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
