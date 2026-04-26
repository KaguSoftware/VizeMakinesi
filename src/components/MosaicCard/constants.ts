export const MOSAIC_SPANS = [
  'col-span-7',
  'col-span-5',
  'col-span-4',
  'col-span-4',
  'col-span-4',
  'col-span-5',
  'col-span-7',
  'col-span-3',
  'col-span-3',
  'col-span-6',
] as const;

export type MosaicSpan = typeof MOSAIC_SPANS[number];
