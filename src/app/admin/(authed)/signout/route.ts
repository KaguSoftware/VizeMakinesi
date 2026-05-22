import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  // CSRF defence: require the request to originate from this site. Both the
  // Origin and Referer headers are set by browsers on form POSTs and cannot be
  // spoofed by cross-site attackers.
  const origin = request.headers.get('origin')
  const host = request.headers.get('host')
  const referer = request.headers.get('referer')

  const expected = host ? new URL(`${request.nextUrl.protocol}//${host}`).origin : null
  const refererOrigin = referer ? safeOrigin(referer) : null

  const originOk = origin && expected && origin === expected
  const refererOk = refererOrigin && expected && refererOrigin === expected

  if (!originOk && !refererOk) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const supabase = await createClient()
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL('/admin/login', request.url))
}

function safeOrigin(url: string): string | null {
  try {
    return new URL(url).origin
  } catch {
    return null
  }
}
