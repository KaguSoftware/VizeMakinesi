import { createClient } from '@/lib/supabase/client'
import { compressImage } from './compress'

export async function uploadImage(
  bucket: string,
  file: File,
  path?: string
): Promise<string> {
  const webp = await compressImage(file)

  const filePath = path ?? `${crypto.randomUUID()}-${webp.name}`

  const supabase = createClient()
  const { error } = await supabase.storage.from(bucket).upload(filePath, webp, {
    upsert: true,
    contentType: 'image/webp',
  })

  if (error) throw error

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
  return data.publicUrl
}
