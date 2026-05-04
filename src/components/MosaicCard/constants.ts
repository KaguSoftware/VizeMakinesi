// col-span: mobile shows one flag per row (full width), desktop keeps the full mosaic
export const MOSAIC_SPANS = [
  'col-span-12 md:col-span-7',   // uk
  'col-span-12 md:col-span-5',   // germany
  'col-span-12 md:col-span-4',   // france
  'col-span-12 md:col-span-4',   // italy
  'col-span-12 md:col-span-4',   // netherlands
  'col-span-12 md:col-span-7',   // usa
  'col-span-12 md:col-span-5',   // canada
  'col-span-12 md:col-span-3',   // australia
  'col-span-12 md:col-span-4',   // uae
  'col-span-12 md:col-span-5',   // schengen
] as const;

// Mobile rows: 0,1 | 2,3 | 4,5 | 6,7 | 8,9
export const MOSAIC_ROW_INDEX = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4] as const;

export type MosaicSpan = typeof MOSAIC_SPANS[number];
