/**
 * Türkçe metinden URL parçası üretir.
 *
 * `String.normalize` tek başına yetmez: "ı" ve "İ" Unicode'da ayrıştırılabilir
 * karakterler olmadığı için normalize sonrası tamamen düşerler ve başlık
 * bozulur ("Açıklanamaması" → "aklanamamas"). Bu yüzden Türkçeye özgü harfler
 * önce elle eşlenir, kalan aksanlar normalize ile temizlenir.
 */
const TR_CHARS: Record<string, string> = {
  ı: 'i', İ: 'i', ş: 's', Ş: 's', ğ: 'g', Ğ: 'g',
  ü: 'u', Ü: 'u', ö: 'o', Ö: 'o', ç: 'c', Ç: 'c',
};

export function slugifyTr(input: string): string {
  return input
    .replace(/[ıİşŞğĞüÜöÖçÇ]/g, (c) => TR_CHARS[c])
    .toLowerCase()
    .normalize('NFD')
    // U+0300..U+036F — "Combining Diacritical Marks" bloğu.
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
