// Sitenin iki tonlu bölüm başlığı: son iki kelime coral italik, gerisi navy.
// Üç kelimeden kısa başlıklar tek renk kalır.
export function splitHeading(title: string): [string, string] {
  const words = title.trim().split(/\s+/)
  if (words.length < 3) return [title.trim(), '']
  return [words.slice(0, -2).join(' '), words.slice(-2).join(' ')]
}
