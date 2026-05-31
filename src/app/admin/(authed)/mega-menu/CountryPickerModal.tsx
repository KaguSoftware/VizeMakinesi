'use client'

import { useState } from 'react'
import { EyebrowText } from '@/components/admin/ui'
import type { Database } from '@/lib/supabase/database.types'

type CountryRow = Database['public']['Tables']['countries']['Row']
export type PickableCountry = Pick<CountryRow, 'id' | 'name' | 'flag_emoji'>

interface Props {
  countries: PickableCountry[]
  onSelect: (country: PickableCountry) => void
  onClose: () => void
}

export default function CountryPickerModal({ countries, onSelect, onClose }: Props) {
  const [query, setQuery] = useState('')
  const filtered = countries.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div
      className="fixed inset-0 bg-navy/30 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-navy/10 w-full max-w-sm p-6 flex flex-col gap-4 max-h-[70vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <EyebrowText>Ülke Seç</EyebrowText>
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-[11px] text-navy/70 hover:text-navy"
          >
            ✕
          </button>
        </div>
        <input
          autoFocus
          placeholder="Ara..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border-b border-navy/20 py-2 font-serif text-[16px] text-navy placeholder:text-navy/55 focus:outline-none focus:border-coral"
        />
        <div className="overflow-y-auto flex flex-col gap-1">
          {filtered.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(c)}
              className="flex items-center gap-3 px-3 py-2 text-left hover:bg-cream transition-colors"
            >
              <span className="text-[18px]">{c.flag_emoji}</span>
              <span className="font-serif text-[15px] text-navy">{c.name}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="font-mono text-[11px] text-navy/60 py-4 text-center">Sonuç bulunamadı</p>
          )}
        </div>
      </div>
    </div>
  )
}
