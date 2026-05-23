// Minimal server-side guards used inside server actions. The admin forms
// already validate client-side; these are defence-in-depth so a forgotten or
// bypassed client rule cannot push bad data into the DB.

export class AdminValidationError extends Error {
  constructor(public readonly field: string, message: string) {
    super(message)
    this.name = 'AdminValidationError'
  }
}

export function asValidationResult<T>(fn: () => T): T | { error: string } {
  try {
    return fn()
  } catch (e) {
    if (e instanceof AdminValidationError) return { error: e.message }
    throw e
  }
}

export function reqString(field: string, value: unknown, opts: { max?: number } = {}): string {
  if (typeof value !== 'string') {
    throw new AdminValidationError(field, `${field} zorunludur`)
  }
  const trimmed = value.trim()
  if (!trimmed) {
    throw new AdminValidationError(field, `${field} zorunludur`)
  }
  if (opts.max && trimmed.length > opts.max) {
    throw new AdminValidationError(field, `${field} en fazla ${opts.max} karakter olabilir`)
  }
  return trimmed
}

export function optString(field: string, value: unknown, opts: { max?: number } = {}): string | null {
  if (value == null) return null
  if (typeof value !== 'string') {
    throw new AdminValidationError(field, `${field} geçersiz`)
  }
  const trimmed = value.trim()
  if (!trimmed) return null
  if (opts.max && trimmed.length > opts.max) {
    throw new AdminValidationError(field, `${field} en fazla ${opts.max} karakter olabilir`)
  }
  return trimmed
}

export function reqBool(field: string, value: unknown): boolean {
  if (typeof value !== 'boolean') {
    throw new AdminValidationError(field, `${field} geçersiz`)
  }
  return value
}

export function reqSlug(field: string, value: unknown): string {
  const str = reqString(field, value, { max: 80 })
  if (!/^[a-z0-9-]+$/.test(str)) {
    throw new AdminValidationError(field, 'Slug yalnızca küçük harf, rakam ve tire içerebilir')
  }
  return str
}

export function reqEnum<T extends string>(field: string, value: unknown, allowed: readonly T[]): T {
  if (typeof value !== 'string' || !(allowed as readonly string[]).includes(value)) {
    throw new AdminValidationError(field, `${field} geçersiz`)
  }
  return value as T
}

export function optUrl(field: string, value: unknown): string | null {
  const v = optString(field, value, { max: 2048 })
  if (v == null) return null
  try {
    const u = new URL(v)
    if (!/^https?:$/.test(u.protocol)) {
      throw new AdminValidationError(field, 'Yalnızca http/https adresleri kabul edilir')
    }
    return v
  } catch (e) {
    if (e instanceof AdminValidationError) throw e
    throw new AdminValidationError(field, 'Geçersiz URL')
  }
}

export function reqArrayOfStrings(
  field: string,
  value: unknown,
  opts: { maxItems?: number; maxLen?: number; minItems?: number } = {}
): string[] {
  if (!Array.isArray(value)) {
    throw new AdminValidationError(field, `${field} geçersiz`)
  }
  if (opts.minItems != null && value.length < opts.minItems) {
    throw new AdminValidationError(field, `${field} en az ${opts.minItems} öğe içermeli`)
  }
  if (opts.maxItems != null && value.length > opts.maxItems) {
    throw new AdminValidationError(field, `${field} en fazla ${opts.maxItems} öğe içerebilir`)
  }
  return value.map((v, i) => {
    if (typeof v !== 'string' || !v.trim()) {
      throw new AdminValidationError(field, `${field}[${i}] boş olamaz`)
    }
    const trimmed = v.trim()
    if (opts.maxLen && trimmed.length > opts.maxLen) {
      throw new AdminValidationError(field, `${field}[${i}] en fazla ${opts.maxLen} karakter olabilir`)
    }
    return trimmed
  })
}
