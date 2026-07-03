import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'
import { requireAdmin } from '@/lib/auth/requireAdmin'

export const runtime = 'nodejs'

const MAX_BYTES = 20 * 1024 * 1024 // 20 MB

export async function POST(req: NextRequest) {
  await requireAdmin()

  const contentType = req.headers.get('content-type') ?? ''
  if (!contentType.includes('application/pdf')) {
    return NextResponse.json({ error: 'PDF bekleniyor' }, { status: 400 })
  }

  const buffer = await req.arrayBuffer()
  if (buffer.byteLength > MAX_BYTES) {
    return NextResponse.json({ error: 'Dosya çok büyük (en fazla 20 MB)' }, { status: 413 })
  }

  const doc = await PDFDocument.load(buffer, { ignoreEncryption: true })
  const compressed = await doc.save({ useObjectStreams: true, addDefaultPage: false })

  return new NextResponse(Buffer.from(compressed), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Length': String(compressed.byteLength),
    },
  })
}
