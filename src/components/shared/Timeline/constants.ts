import type { TimelineStep } from './types';

export const TIMELINE_STEPS: TimelineStep[] = [
  {
    n: '01',
    title: 'İlk Görüşme ve Stratejik Planlama',
    body: 'Profilinizi ve seyahat hedeflerinizi analiz ederek başvuru stratejinizi belirliyoruz.',
    detail:
      'Uzman danışmanlarımızla yapacağınız ilk görüşmede profilinizi, seyahat amacınızı ve tarihlerinizi analiz ediyoruz. Bu bilgilere dayanarak, onay şansınızın en yüksek olduğu ve takviminize en uygun ülkeyi nokta atışıyla belirliyor, size özel başvuru stratejisini oluşturuyoruz.',
  },
  {
    n: '02',
    title: 'Hızlı Randevu Alımı',
    body: 'Seyahat planınıza en uygun randevu tarihini hızla adınıza rezerve ediyoruz.',
    detail:
      'Zaman kaybetmeden, konsolosluk sistemlerini yakından takip ederek seyahat planınıza en uygun randevu tarihini "makine" hızıyla adınıza rezerve ediyoruz.',
  },
  {
    n: '03',
    title: 'Titiz Evrak Hazırlığı',
    body: 'Tüm belgelerinizi eksiksiz ve hatasız hazırlıyoruz.',
    detail:
      'Vize reddinin en büyük sebebi olan evrak hatalarını ortadan kaldırıyoruz. Gerekli tüm belgelerinizi bir hukuk bürosu titizliğiyle topluyor, güncel prosedürlere göre eksiksiz ve hatasız bir dosya haline getiriyoruz.',
  },
  {
    n: '04',
    title: 'Vize Başvurusu ve Dosya Sunumu',
    body: 'Dosyanızı yetkililere sunuyor, gerektiğinde size eşlik ediyoruz.',
    detail:
      'Hazırlanan kusursuz dosyanızı resmi makamlara sunma aşaması, ilgili ülkenin prosedürlerine göre şekillenir. Başvuru merkezinde şahsen bulunmanız gereken durumlarda (parmak izi vb.), uzman operasyon ekibimiz size bizzat eşlik ederek süreci yönetir. Şahsen bulunmanızın gerekmediği ülkelerde ise tüm başvuru ve sunum işlemlerini sizin yerinize biz gerçekleştiririz.',
  },
  {
    n: '05',
    title: 'Aktif Süreç Takibi',
    body: 'Başvurunuzu sonuçlanana kadar anlık takip ediyor, sizi bilgilendiriyoruz.',
    detail:
      'Başvurunuz yapıldıktan sonra süreci şansa bırakmıyoruz. Dosyanızın konsolosluktaki tüm değerlendirme aşamalarını anlık olarak takip ediyor ve durum hakkında sizi düzenli olarak bilgilendiriyoruz.',
  },
  {
    n: '06',
    title: 'Mutlu Sonuç ve Şahsi Teslimat',
    body: 'Onaylı vizenizi ve pasaportunuzu güvenle kapınıza teslim ediyoruz.',
    detail:
      'Sürecin sonunda konsolosluktan çıkan onaylı vizenizi ve pasaportunuzu teslim alıyor, güvenli bir şekilde doğrudan size ulaştırıyoruz. Sınırlar açılıyor, size sadece seyahatinizin tadını çıkarmak kalıyor!',
  },
];

export const TIMELINE_ACTIVE_INDEX = 1;
