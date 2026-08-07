// "Başlık: açıklama" madde biçimi.
//
// Genel bilgi maddeleri `countries.general_info` içinde tek bir metin dizisi
// olarak tutulur. Başlık, ilk iki nokta üst üste karakterine kadar olan
// kısımdır; sitede kalın (bold) mini başlık olarak gösterilir. Açıklama içinde
// geçen diğer ":" karakterleri bölmeyi etkilemez.

export interface Labeled {
  label: string
  body: string
}

export function splitLabeled(raw: string): Labeled {
  const text = raw.trim()
  const i = text.indexOf(':')
  // Başlıksız maddeler (ör. düz cümleler) olduğu gibi gösterilir. Çok uzun bir
  // ön ek başlık sayılmaz — bu, içinde ":" geçen normal cümleleri korur.
  if (i === -1 || i > 80) return { label: '', body: text }
  return { label: text.slice(0, i).trim(), body: text.slice(i + 1).trim() }
}

export function joinLabeled(label: string, body: string): string {
  const l = label.trim()
  const b = body.trim()
  if (!l) return b
  if (!b) return l
  return `${l}: ${b}`
}
