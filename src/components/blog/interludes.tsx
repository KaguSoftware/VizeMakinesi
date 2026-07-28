import type { ReactNode } from 'react';

/**
 * Ara bloklar — akışın içine serpiştirilen görsel duraklar.
 *
 * `after` = kaçıncı yazıdan sonra görüneceği (1 tabanlı).
 * Yeni bir infografik eklemek için diziye bir kayıt ekleyin ve
 * <BlogInterlude> bileşenine ya `imageUrl` (yüklenmiş infografik görseli),
 * ya `stats` (hızlı rakam bandı) ya da doğrudan `children` (özel içerik) verin.
 * Dikey infografikler için `imageRatio="4/5"` gibi bir oran geçin.
 *
 * Örnek:
 *
 *   import BlogInterlude from './BlogInterlude';
 *
 *   export const INTERLUDES: Interlude[] = [
 *     {
 *       after: 3,
 *       node: (
 *         <BlogInterlude
 *           key="belgeler"
 *           eyebrow="Görsel özet"
 *           title={<>Başvuru dosyası, <em className="font-normal italic text-coral">tek bakışta.</em></>}
 *           note="Kısa açıklama satırı."
 *           imageUrl="https://.../infografik.webp"
 *           imageAlt="Vize başvuru belgeleri infografiği"
 *         />
 *       ),
 *     },
 *   ];
 */
export interface Interlude {
  after: number;
  node: ReactNode;
}

export const INTERLUDES: Interlude[] = [];
