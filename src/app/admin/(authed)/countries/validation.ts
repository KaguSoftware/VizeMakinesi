export interface ValidationError { field: string; message: string }

export interface FaqInput { question: string; answer: string }
export interface TextInput { text: string }
export interface DocumentInput { label: string; pdf_url: string }
export interface VisaTypeInput { title: string; description: string; visa_type_slug: string | null }

// NOT: blog alanları (has_tourism, tourism_*, blog_*) bu forma dahil değildir;
// ülke bloglarının tamamı /admin/blog altında düzenlenir ve orada doğrulanır.
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
  danisma_visible: boolean
  appointment_days: string | null
  general_info: string[]
  general_info_title: string | null
  general_info_description: string | null
  visa_types_title: string | null
  visa_types_lead: string | null
  /** "… Vize İşlemleri nasıl yapılır?" bölümünün sağ sütunundaki paragraf. */
  process_text: string | null
  requirements: TextInput[]
  handles?: TextInput[]
  faqs: FaqInput[]
  documents: DocumentInput[]
  visa_types: VisaTypeInput[]
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

  return errors
}
