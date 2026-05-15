export interface ValidationError { field: string; message: string }

export interface FaqInput { question: string; answer: string }
export interface TextInput { text: string }

export interface CountryFormData {
  name: string
  slug: string
  flag_emoji: string | null
  flag_type: 'preset' | 'image' | null
  flag_preset_key: string | null
  flag_image_url: string | null
  visa_type: string | null
  summary: string | null
  mosaic_visible: boolean
  mosaic_span: string | null
  has_tourism: boolean
  danisma_visible: boolean
  tourism_hero_image_url: string | null
  tourism_intro: string[]
  tourism_highlights: string[]
  tourism_tips: string[]
  tourism_best_time: string | null
  appointment_days: string | null
  requirements: TextInput[]
  handles: TextInput[]
  faqs: FaqInput[]
}

export function validateCountry(data: CountryFormData): ValidationError[] {
  const errors: ValidationError[] = []

  if (!data.name.trim()) errors.push({ field: 'name', message: 'Ad zorunludur' })
  if (!data.slug.trim()) errors.push({ field: 'slug', message: 'Slug zorunludur' })
  if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) errors.push({ field: 'slug', message: 'Slug yalnızca küçük harf, rakam ve tire içerebilir' })
  if (!data.flag_emoji?.trim()) errors.push({ field: 'flag_emoji', message: 'Bayrak emoji zorunludur' })
  if (!data.visa_type?.trim()) errors.push({ field: 'visa_type', message: 'Vize türü zorunludur' })
  if (!data.summary?.trim()) errors.push({ field: 'summary', message: 'Özet zorunludur' })
  if (data.flag_type === 'preset' && !data.flag_preset_key) errors.push({ field: 'flag_preset_key', message: 'Hazır SVG seçilmelidir' })
  if (data.flag_type === 'image' && !data.flag_image_url) errors.push({ field: 'flag_image_url', message: 'Görsel yüklenmelidir' })
  if (data.has_tourism) {
    if (data.tourism_intro.length === 0) errors.push({ field: 'tourism_intro', message: 'En az bir giriş paragrafı gereklidir' })
    if (data.tourism_highlights.length === 0) errors.push({ field: 'tourism_highlights', message: 'En az bir öne çıkan nokta gereklidir' })
    if (data.tourism_tips.length === 0) errors.push({ field: 'tourism_tips', message: 'En az bir ipucu gereklidir' })
  }

  return errors
}
