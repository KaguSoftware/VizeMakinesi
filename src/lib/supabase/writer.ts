// Supabase v2 narrows insert/update/upsert payloads to `never` when its
// internal GenericSchema markers can't be resolved from our
// database.types.ts (a hand-maintained subset rather than fully
// cli-generated). Routing writes through this helper isolates the narrow
// `as` casts to a single place; SELECT queries remain fully typed.

import type { createClient as createServerClient } from './server'

type SB = Awaited<ReturnType<typeof createServerClient>>

interface ChainedResult {
  eq: (column: string, value: string) => Promise<{ error: { message: string } | null }>
}

interface Writer {
  insert: (values: unknown) => Promise<{ error: { message: string } | null }>
  update: (values: unknown) => ChainedResult
  delete: () => ChainedResult
  upsert: (
    values: unknown,
    options?: { onConflict?: string },
  ) => Promise<{ error: { message: string } | null }>
}

// Add a table name to this union when a new table needs writes.
export type WritableTable =
  | 'countries'
  | 'country_requirements'
  | 'country_handles'
  | 'country_faqs'
  | 'country_documents'
  | 'page_sections'

export function writer(supabase: SB, table: WritableTable): Writer {
  return supabase.from(table) as unknown as Writer
}
