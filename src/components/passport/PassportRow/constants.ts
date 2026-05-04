import type { PassportService } from './types';

export const PASSPORT_SERVICES: PassportService[] = [
  {
    title: 'Yeni Pasaport',
    desc: 'Yetişkinler için ilk başvuru — randevu rezervasyonu, belge incelemesi, biyometrik fotoğraf stüdyosu yönlendirmesi.',
    time: '4–6 hafta', label: 'Standart',
  },
  {
    title: 'Yenileme',
    desc: 'Mevcut pasaportların posta veya yüz yüze yenilenmesi; hasarlı veya geçerlilik süresi yaklaşan belgeler dahil.',
    time: '2–3 hafta', label: 'Standart',
  },
  {
    title: 'Kayıp veya Çalıntı',
    desc: 'Polis tutanağı koordinasyonu, acil seyahat belgesi başvurusu, hızlandırılmış yenileme.',
    time: '5–7 gün', label: 'Hızlandırılmış',
  },
  {
    title: 'Çocuk Pasaportu',
    desc: 'İlk kez küçük pasaportları — her iki ebeveyn onayı yönetimi, ayrı yaşayan ebeveynler için mahkeme kararı takibi.',
    time: '3–5 hafta', label: 'Standart',
  },
];
