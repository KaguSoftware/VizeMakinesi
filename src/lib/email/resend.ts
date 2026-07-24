import 'server-only'
import { Resend } from 'resend'
import { CONTACT_OPTIONS } from '@/app/(public)/danisma-al/requestSummary'

// DNS verified on gezimakinesi.com — send from a subdomain-free verified sender.
const FROM = 'Vize Makinesi <talep@gezimakinesi.com>'
const OWNER_TO = 'vize@gezimakinesi.com'

let client: Resend | null = null
function resend(): Resend | null {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  if (!client) client = new Resend(key)
  return client
}

export interface RequestEmailData {
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string | null
  countryEmoji: string | null
  travelDate: string | null
  returnDate: string | null
  contactPref: string
  note: string | null
}

function esc(v: string): string {
  return v
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function prefLabel(pref: string): string {
  const o = CONTACT_OPTIONS.find((c) => c.value === pref)
  return o ? `${o.emoji} ${o.label}` : pref
}

function fullName(d: RequestEmailData): string {
  return [d.firstName, d.lastName].map((p) => p.trim()).filter(Boolean).join(' ') || '—'
}

function dateRange(d: RequestEmailData): string {
  if (!d.travelDate) return '—'
  return d.returnDate ? `${d.travelDate} → ${d.returnDate}` : d.travelDate
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid #eee;font:600 11px/1.4 monospace;letter-spacing:.08em;text-transform:uppercase;color:#309c9b;white-space:nowrap;vertical-align:top;padding-right:16px">${esc(label)}</td>
    <td style="padding:10px 0;border-bottom:1px solid #eee;font:15px/1.5 Georgia,serif;color:#1a5c5b;word-break:break-word">${esc(value)}</td>
  </tr>`
}

/** Notify the business owner of a new consultation request. */
export async function sendOwnerRequestEmail(d: RequestEmailData): Promise<void> {
  const r = resend()
  if (!r) {
    console.warn('[email] RESEND_API_KEY not set — owner email skipped')
    return
  }
  const name = fullName(d)
  const country = d.country ? `${d.countryEmoji ? `${d.countryEmoji} ` : ''}${d.country}` : '—'

  const html = `<div style="background:#fdfbe5;padding:32px 0;font-family:-apple-system,system-ui,sans-serif">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5e5e5">
      <div style="background:#1a5c5b;padding:20px 28px;color:#fff">
        <div style="font:600 10px/1 monospace;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.6);margin-bottom:6px">— Yeni Talep</div>
        <div style="font:600 18px/1.2 Georgia,serif">Danışma Başvurusu</div>
      </div>
      <div style="padding:8px 28px 24px">
        <table style="width:100%;border-collapse:collapse">
          ${row('Ad Soyad', name)}
          ${row('E-posta', d.email)}
          ${row('Telefon', d.phone)}
          ${row('Gidilecek Ülke', country)}
          ${row('Seyahat Tarihleri', dateRange(d))}
          ${row('Dönüş Tercihi', prefLabel(d.contactPref))}
          ${row('Not', d.note?.trim() || '—')}
        </table>
      </div>
    </div>
  </div>`

  try {
    await r.emails.send({
      from: FROM,
      to: OWNER_TO,
      replyTo: d.email,
      subject: `Yeni danışma talebi — ${name}${d.country ? ` (${d.country})` : ''}`,
      html,
    })
  } catch (err) {
    console.error('[email] owner notification failed', err)
  }
}

/** Confirm receipt to the customer. */
export async function sendCustomerConfirmationEmail(d: RequestEmailData): Promise<void> {
  const r = resend()
  if (!r) {
    console.warn('[email] RESEND_API_KEY not set — customer email skipped')
    return
  }
  const name = fullName(d)

  const html = `<div style="background:#fdfbe5;padding:32px 0;font-family:-apple-system,system-ui,sans-serif">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5e5e5">
      <div style="background:#1a5c5b;padding:24px 28px;color:#fff">
        <div style="font:600 10px/1 monospace;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.6);margin-bottom:6px">— Vize Makinesi</div>
        <div style="font:600 20px/1.25 Georgia,serif">Talebinizi aldık, teşekkürler!</div>
      </div>
      <div style="padding:24px 28px;color:#1a5c5b;font:15px/1.6 Georgia,serif">
        <p style="margin:0 0 16px">Merhaba ${esc(d.firstName.trim() || name)},</p>
        <p style="margin:0 0 16px">Danışma talebiniz bize ulaştı. Danışmanlarımız en kısa sürede
        <strong>${esc(prefLabel(d.contactPref))}</strong> yoluyla sizinle iletişime geçecek.</p>
        <p style="margin:0 0 16px">Vize sürecinizi Vize Makinesi hızıyla birlikte yönetelim.</p>
        <p style="margin:24px 0 0;font:600 12px/1.4 monospace;letter-spacing:.06em;color:#309c9b">— VİZE MAKİNESİ EKİBİ</p>
      </div>
    </div>
  </div>`

  try {
    await r.emails.send({
      from: FROM,
      to: d.email,
      subject: 'Danışma talebiniz alındı — Vize Makinesi',
      html,
    })
  } catch (err) {
    console.error('[email] customer confirmation failed', err)
  }
}
