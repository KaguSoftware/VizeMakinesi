'use client'

import { AdminSelect, AdminLabel, ImageUploader } from '@/components/admin/ui'
import FlagBG from '@/components/shared/FlagBG/FlagBG'
import { Divider, FieldError, PRESET_KEYS } from './shared'
import type { ValidationError } from '../validation'

interface Props {
  flagType: 'preset' | 'image'
  flagPresetKey: string
  flagImageUrl: string
  errors: ValidationError[]
  onFlagTypeChange: (val: 'preset' | 'image') => void
  onFlagPresetKeyChange: (val: string) => void
  onFlagImageUrlChange: (val: string) => void
}

export default function FlagSection({
  flagType,
  flagPresetKey,
  flagImageUrl,
  errors,
  onFlagTypeChange,
  onFlagPresetKeyChange,
  onFlagImageUrlChange,
}: Props) {
  return (
    <>
      <Divider id="bayrak" label="Bayrak" />

      <div className="flex flex-col gap-5">
        <div className="flex gap-6">
          {(['preset', 'image'] as const).map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer font-mono text-[11px] tracking-widest uppercase text-navy/85">
              <input
                type="radio"
                value={t}
                checked={flagType === t}
                onChange={() => onFlagTypeChange(t)}
                className="accent-coral"
              />
              {t === 'preset' ? 'Hazır SVG' : 'Görsel Yükle'}
            </label>
          ))}
        </div>

        {flagType === 'preset' && (
          <div>
            <AdminSelect
              label="Hazır Bayrak"
              value={flagPresetKey}
              onChange={(e) => onFlagPresetKeyChange(e.target.value)}
            >
              <option value="">Seçin…</option>
              {PRESET_KEYS.map(({ key, label }) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </AdminSelect>
            {flagPresetKey && (
              <div className="mt-3 w-20 h-12 relative overflow-hidden rounded-sm border border-navy/40">
                <FlagBG presetKey={flagPresetKey} className="absolute inset-0 w-full h-full" />
              </div>
            )}
            <FieldError errors={errors} field="flag_preset_key" />
          </div>
        )}

        {flagType === 'image' && (
          <div className="flex flex-col gap-3">
            <AdminLabel>Bayrak Görseli</AdminLabel>
            <ImageUploader
              bucket="country-flags"
              value={flagImageUrl}
              onChange={onFlagImageUrlChange}
              label="Bayrak"
              previewClassName="w-20 h-12"
            />
            <FieldError errors={errors} field="flag_image_url" />
          </div>
        )}
      </div>
    </>
  )
}
