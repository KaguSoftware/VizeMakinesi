/**
 * Blog akışının en başında sabit duran Schengen rehberi.
 * Ülke yazıları bu kaydın ardından 02'den itibaren numaralanır.
 */
export const SCHENGEN_GUIDE = {
  slug: 'schengen-vize-alma-rehberi',
  href: '/blog/schengen-vize-alma-rehberi',
  name: 'Schengen bölgesi',
  titleSuffix: ' vize alma rehberi',
  kicker: 'Başvuru Rehberi',
  flagEmoji: '🇪🇺',
  excerpt:
    'İlk kez Schengen vizesine başvuruyorsanız, önünüzde bir anda çok sayıda belge, form, randevu ve farklı bilgi bulabilirsiniz. Bu rehberde ilk başvurunuzu, hangi ülkeye başvuracağınızı belirlemekten sonucu beklemeye kadar adım adım ele alıyoruz.',
} as const;

export interface GuideStep {
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export const SCHENGEN_GUIDE_STEPS: GuideStep[] = [
  {
    title: 'Nereye gideceğinizi netleştirin',
    paragraphs: [
      'İlk adım, vize başvurusu yapacağınız ülkeyi seçmek değil, seyahatinizin nereye ve ne amaçla olduğunu netleştirmektir.',
      'Bir Schengen seyahati yalnızca tek bir ülkeden oluşabilir. Örneğin Almanya’ya 10 günlük turistik bir seyahat planlıyor olabilirsiniz. Ancak birden fazla Schengen ülkesini aynı seyahatte ziyaret etmeniz de mümkündür.',
      'Birden fazla Schengen ülkesini ziyaret edecekseniz, başvurunuzu seyahatinizin ana destinasyonu olan ülkeye yapmanız gerekir. Turistik bir seyahatte ana destinasyon, genellikle en uzun süre kalacağınız ülkedir. Örneğin 10 günlük seyahatinizde Almanya’da 5 gün, Fransa’da 3 gün ve İtalya’da 2 gün kalacaksanız, başvurunuzu Almanya’ya yapmanız gerekir.',
      'İki veya daha fazla ülkede eşit süre kalacaksanız, Schengen bölgesine ilk giriş yapacağınız ülke esas alınır. Seyahatinizin belirli bir amacı varsa — bir toplantı, fuar veya etkinlik gibi — bu amacın gerçekleştirileceği ülke de ana destinasyon olabilir.',
    ],
  },
  {
    title: 'Hangi vizeye ihtiyacınız olduğunu belirleyin',
    paragraphs: [
      'Seyahat planınızı netleştirdikten sonra, seyahatinizin amacına uygun Schengen vize kategorisini belirlemeniz gerekir.',
    ],
    bullets: [
      'Turistik seyahat → Turistik amaçlı başvuru',
      'Toplantı, fuar veya ticari görüşme → Ticari amaçlı başvuru',
      'Aile veya yakın ziyareti → Ziyaret amaçlı başvuru',
    ],
  },
  {
    title: 'Kendi durumunuzu değerlendirin',
    paragraphs: [
      'Vize kategorinizi belirledikten sonra, kendi çalışma, gelir ve finansal durumunuzu değerlendirin. Aynı vize kategorisine başvuran kişilerin hazırlaması gereken belgeler, kişisel durumlarına göre farklılık gösterebilir.',
      'Çalışan, şirket sahibi, öğrenci, emekli veya çalışmayan bir başvuru sahibinin sunacağı belgeler aynı olmayabilir. Seyahat masrafları başka biri tarafından karşılanıyorsa, sponsorlu başvurularda da farklı belgeler gerekebilir.',
      'Bu nedenle başka bir başvuru sahibinin hazırladığı evrak listesini doğrudan kendi başvurunuza uyarlamak yerine, kendi durumunuza uygun belgeleri belirlemeniz gerekir.',
    ],
  },
  {
    title: 'Seyahat planınızı oluşturun',
    paragraphs: [
      'Seyahat tarihleriniz, ziyaret edeceğiniz şehir ve ülkeler, konaklama düzeniniz ve ulaşım planınız baştan belirlenmelidir. Hazırlayacağınız belgeler de bu seyahat planını destekleyecektir.',
      'Seyahat planının amacı yalnızca bir güzergâh oluşturmak değil, başvurunuzun temelini oluşturan gerçek ve anlaşılabilir bir seyahat çerçevesi ortaya koymaktır.',
    ],
  },
  {
    title: 'Evraklarınızı bu plana göre hazırlayın',
    paragraphs: [
      'İstenen evraklar; başvurduğunuz ülkeye, vize kategorinize, seyahat amacınıza ve kişisel durumunuza göre değişebilir.',
      'Geçerli pasaport, başvuru formu, fotoğraf, seyahat amacını ve konaklamayı destekleyen belgeler, finansal durumu gösteren evraklar ve seyahat sağlık sigortası başvurularda sık karşılaşılan temel belge gruplarıdır. Pasaportunuzun geçerlilik süresi gibi temel koşulları da başvuru öncesinde kontrol etmelisiniz.',
      'Belgelerinizi hazırlarken, başvuru formunda verdiğiniz bilgiler ile sunduğunuz belgelerin birbiriyle uyumlu olduğundan emin olun. Özellikle seyahat tarihleri, konaklama, gelir ve çalışma durumu gibi bilgilerin belgelerinizle çelişmemesi gerekir.',
    ],
  },
  {
    title: 'Başvuru merkezini ve randevunuzu belirleyin',
    paragraphs: [
      'Başvuru merkezi ve randevu sistemi ülkeye göre değişebildiği için, başvuru yapacağınız ülkenin güncel resmi yönlendirmelerini takip etmeniz önemlidir.',
      'Başvurunuzu seyahatinize çok yakın bir tarihe bırakmayın. Schengen başvurusu seyahatten en fazla 6 ay önce yapılabilir ve kural olarak seyahatten en az 15 gün önce sunulmalıdır.',
      'Başvuru sırasında vize ücretinin yanı sıra, başvuru merkezinin hizmet bedeli gibi ek ücretler de bulunabilir. Güncel ücretleri başvuru yaptığınız ülkenin resmi kaynaklarından kontrol etmelisiniz.',
    ],
  },
  {
    title: 'Başvurunuzu yapın',
    paragraphs: [
      'Randevu gününüz geldiğinde, hazırladığınız başvuru dosyasıyla birlikte yetkili başvuru merkezine giderek başvurunuzu tamamlayabilirsiniz. Başvuru sırasında belgeleriniz teslim edilir ve gerekli biyometrik işlemler gerçekleştirilir.',
      'Başvurunuzu teslim etmeden önce formunuzdaki bilgileri ve sunduğunuz belgeleri son kez kontrol edin. Başvurunuz tamamlandıktan sonra dosyanız değerlendirilmek üzere ilgili konsolosluk veya büyükelçiliğe iletilir.',
    ],
  },
  {
    title: 'Sonucu bekleyin',
    paragraphs: [
      'Başvurunun değerlendirilmesi kural olarak 15 takvim günü içinde tamamlanır. Ancak daha ayrıntılı bir inceleme gerektiğinde bu süre 45 güne kadar uzayabilir.',
      'Değerlendirme sırasında ek belge veya bilgi talep edilmesi de mümkündür. Böyle bir talep gelmesi durumunda, istenen belgeleri belirtilen süre içinde sunmanız gerekir.',
      'Vize başvurusunun olumlu sonuçlanacağının garanti edilemeyeceğini unutmamak gerekir. Başvurunun reddedilmesi halinde, ret gerekçesi ve ilgili ülkenin prosedürlerine göre itiraz imkânı hakkında bilgi verilir.',
    ],
  },
];
