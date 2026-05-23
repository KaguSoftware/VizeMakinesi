'use client'

import { AdminSelect } from '@/components/admin/ui'
import { Divider, MOSAIC_SPANS } from './shared'

interface Props {
  mosaicVisible: boolean
  danismaVisible: boolean
  mosaicSpan: string
  onMosaicVisibleChange: (val: boolean) => void
  onDanismaVisibleChange: (val: boolean) => void
  onMosaicSpanChange: (val: string) => void
}

export default function MosaicSection({
  mosaicVisible,
  danismaVisible,
  mosaicSpan,
  onMosaicVisibleChange,
  onDanismaVisibleChange,
  onMosaicSpanChange,
}: Props) {
  return (
    <>
      <Divider id="mozaik" label="Ana Sayfa Mozaik" />

      <div className="flex flex-col gap-5">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={mosaicVisible}
            onChange={(e) => onMosaicVisibleChange(e.target.checked)}
            className="accent-coral w-4 h-4"
          />
          <span className="font-mono text-[11px] tracking-widest uppercase text-navy/85">
            Ana sayfada görünür
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={danismaVisible}
            onChange={(e) => onDanismaVisibleChange(e.target.checked)}
            className="accent-coral w-4 h-4"
          />
          <span className="font-mono text-[11px] tracking-widest uppercase text-navy/85">
            Danışma formunda görünür
          </span>
        </label>

        <AdminSelect
          label="Genişlik"
          value={mosaicSpan}
          onChange={(e) => onMosaicSpanChange(e.target.value)}
        >
          {MOSAIC_SPANS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </AdminSelect>
      </div>
    </>
  )
}
