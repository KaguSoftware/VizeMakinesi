/**
 * Metin parçalarından tahmini okuma süresi (dakika).
 *
 * 200 kelime/dakika, Türkçe düz metin için makul bir ortalamadır. Sonuç en az
 * 1 dakikadır — "0 dk okuma" yazmak anlamsız olurdu.
 */
const WORDS_PER_MINUTE = 200;

export function readingMinutes(parts: string[]): number {
  const words = parts.join(' ').trim().split(/\s+/).filter(Boolean).length;
  if (words === 0) return 0;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
