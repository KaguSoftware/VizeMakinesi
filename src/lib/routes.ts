/**
 * Ülke sayfalarının public URL'leri. Schengen bölge sayfası /vize/schengen
 * yerine kök seviyedeki /schengen adresinde yayınlanır; geri kalan ülkeler
 * /vize/[slug] altında kalır.
 */
export function countryHref(slug: string) {
  return slug === 'schengen' ? '/schengen' : `/vize/${slug}`;
}

export const SCHENGEN_PATH = '/schengen';
