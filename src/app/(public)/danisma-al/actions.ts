'use server'

import { after } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { writer } from '@/lib/supabase/writer'
import {
  sendOwnerRequestEmail,
  sendCustomerConfirmationEmail,
  type RequestEmailData,
} from '@/lib/email/resend'
import { consumeRateLimit, getClientIp } from '@/lib/rateLimit'
import { CONTACT_OPTIONS, type ContactPref } from './requestSummary'

export interface ConsultationInput {
  ad: string
  soyad: string
  email: string
  phone: string
  country: string
  countryEmoji: string | null
  travelDate: string
  returnDate: string
  contactPref: ContactPref
  note: string
  /** Honeypot — hidden from real users, so anything here means a bot. */
  website?: string
}

type Result = { ok: true } | { ok: false; error: string }

const VALID_PREFS = new Set(CONTACT_OPTIONS.map((o) => o.value))

// Per-IP caps. A real visitor sends one request, maybe two if they made
// a mistake; anything past this is a script or a spam-clicker.
const MAX_PER_HOUR = 3
const HOUR_SECONDS = 60 * 60
const MAX_PER_DAY = 6
const DAY_SECONDS = 24 * 60 * 60

const RATE_LIMIT_MESSAGE =
  'Çok fazla talep gönderdiniz. Lütfen bir süre sonra tekrar deneyin.'

export async function submitConsultationRequest(input: ConsultationInput): Promise<Result> {
  // Honeypot: the field is invisible in the form, so a filled value is a
  // bot auto-completing every input. Report success so it doesn't retry.
  if (input.website?.trim()) {
    console.warn('[danisma-al] honeypot triggered, dropping submission')
    return { ok: true }
  }

  // Throttle before touching the database or Resend — a blocked caller
  // costs us one cheap RPC instead of a row plus two emails.
  const ip = await getClientIp()
  const underHourly = await consumeRateLimit(`danisma-al:ip:${ip}:h`, MAX_PER_HOUR, HOUR_SECONDS)
  const underDaily = await consumeRateLimit(`danisma-al:ip:${ip}:d`, MAX_PER_DAY, DAY_SECONDS)
  if (!underHourly || !underDaily) {
    return { ok: false, error: RATE_LIMIT_MESSAGE }
  }

  // Server-side validation — never trust the client.
  const ad = input.ad?.trim() ?? ''
  const soyad = input.soyad?.trim() ?? ''
  const email = input.email?.trim() ?? ''
  const phone = input.phone?.trim() ?? ''
  const country = input.country?.trim() ?? ''
  const travelDate = input.travelDate?.trim() ?? ''

  if (!ad) return { ok: false, error: 'Adınızı girin.' }
  if (!soyad) return { ok: false, error: 'Soyadınızı girin.' }
  if (!/^\S+@\S+\.\S+$/.test(email)) return { ok: false, error: 'Geçerli bir e-posta girin.' }
  if (!/^\+\d{12}$/.test(phone)) return { ok: false, error: 'Telefon numarası + işaretinden sonra tam 12 rakam olmalı.' }
  if (!country) return { ok: false, error: 'Ülke seçin.' }
  if (!travelDate) return { ok: false, error: 'Gidiş tarihi seçin.' }

  const contactPref: ContactPref = VALID_PREFS.has(input.contactPref) ? input.contactPref : 'phone'
  const returnDate = input.returnDate?.trim() || null
  const note = input.note?.trim() || null
  const countryEmoji = input.countryEmoji?.trim() || null

  // Prefer the service client (guaranteed insert on an unauthenticated write);
  // fall back to the anon server client (RLS allows anon insert) if the key
  // isn't configured yet.
  let supabase
  try {
    supabase = createAdminClient()
  } catch {
    supabase = await createClient()
  }

  const { error } = await writer(supabase, 'consultation_requests').insert({
    first_name: ad,
    last_name: soyad,
    email,
    phone,
    country,
    country_emoji: countryEmoji,
    travel_date: travelDate,
    return_date: returnDate,
    contact_pref: contactPref,
    note,
  })

  if (error) {
    console.error('[danisma-al] insert failed', error)
    return { ok: false, error: 'Talep kaydedilemedi. Lütfen tekrar deneyin.' }
  }

  // Emails run after the response ships — the submit isn't blocked on Resend.
  const emailData: RequestEmailData = {
    firstName: ad,
    lastName: soyad,
    email,
    phone,
    country,
    countryEmoji,
    travelDate,
    returnDate,
    contactPref,
    note,
  }
  after(async () => {
    await Promise.allSettled([
      sendOwnerRequestEmail(emailData),
      sendCustomerConfirmationEmail(emailData),
    ])
  })

  return { ok: true }
}
