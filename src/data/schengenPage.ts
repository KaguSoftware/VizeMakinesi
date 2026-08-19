/**
 * /schengen sayfasının varsayılan metinleri.
 *
 * Kaynak: "Schengen Bölgesi Sayfası" rehber dokümanı. Aynı içerik
 * `supabase/migrations/0019_schengen_page.sql` ile `schengen_page`
 * tablosuna seed edilir; buradaki kopya, tablo henüz uygulanmadığında
 * (veya satır silindiğinde) sayfanın boş kalmaması için fallback olarak
 * kullanılır ve admin formunun "varsayılana dön" değerlerini besler.
 */

export interface SchengenListItem {
  title: string;
  description: string;
}

export interface SchengenFaqItem {
  question: string;
  answer: string;
}

export interface SchengenPageContent {
  hero_lead: string;
  hero_note: string;
  hero_bullets: string[];

  intro_title: string;

  rules_title: string;
  rules_description: string;
  rules: SchengenListItem[];

  visa_types_title: string;
  visa_types_description: string;
  visa_types_c_title: string;
  visa_types_c: SchengenListItem[];
  visa_types_d_title: string;
  visa_types_d_description: string;
  visa_types_d: SchengenListItem[];

  process_title: string;
  process_description: string;
  process_steps: string[];

  faq_title: string;
  faqs: SchengenFaqItem[];
}

export const SCHENGEN_PAGE_DEFAULTS: SchengenPageContent = {
  hero_lead: 'Doğru ve tutarlı bir başvuru dosyası, Schengen vize sürecinin temelini oluşturur.',
  hero_note: 'Vize sürecinizi doğru planlama ve uzman desteğiyle yönetin.',
  hero_bullets: [
    'Randevu sürecinde hızlı ve doğru yönlendirme',
    'Kişisel durumunuza özel stratejik dosya analizi',
    'Başvurunun tüm aşamalarında planlı süreç yönetimi',
    'Süreç boyunca ulaşabileceğiniz uzman desteği',
  ],

  intro_title: 'Tek vize, 29 ülke.',
  rules_title: 'Schengen Vizesinin Temel Kuralları',
  rules_description:
    'Schengen vizesi başvurularında ortak Schengen kuralları uygulanır. Başvurunuza başlamadan önce aşağıdaki temel bilgileri gözden geçirmenizi öneririz.',
  rules: [
    {
      title: 'Schengen Bölgesi',
      description:
        'Schengen Bölgesi, üye ülkeler arasındaki iç sınır kontrollerinin kaldırıldığı ve ortak vize kurallarının uygulandığı 29 Avrupa ülkesinden oluşur.',
    },
    {
      title: 'Vize Zorunluluğu',
      description:
        'Umuma Mahsus (Bordo) pasaport sahiplerinin, Schengen Bölgesi\'ne yapacakları 90 güne kadar olan kısa süreli seyahatler için Schengen vizesi almaları gerekir.',
    },
    {
      title: 'Vizeden Muaf Pasaportlar',
      description:
        'Hususi (Yeşil), Hizmet (Gri) ve Diplomatik (Siyah) pasaport sahipleri, 180 günlük dönem içinde 90 günü aşmayan kısa süreli seyahatlerinde Schengen vizesinden muaftır.',
    },
    {
      title: '90/180 Kuralı',
      description:
        'Kısa süreli Schengen seyahatlerinde, herhangi bir 180 günlük dönem içinde Schengen Bölgesi\'nde toplam 90 günden fazla kalamazsınız. Bu süre, Schengen Bölgesi\'ne yaptığınız tüm giriş ve çıkışlar birlikte değerlendirilerek hesaplanır.',
    },
    {
      title: 'Başvuru Ülkesi',
      description:
        'Schengen vize başvurunuzu, seyahatinizin ana destinasyonu olan ülkenin yetkili makamlarına yapmanız gerekir. Birden fazla Schengen ülkesini ziyaret edecekseniz, genel olarak en uzun süre kalacağınız ülke esas alınır. Birden fazla ülkede eşit süre kalmanız durumunda ise ilk giriş yapacağınız ülkeye başvurmanız gerekir.',
    },
  ],

  visa_types_title: 'Hangi Schengen Vize Türüne Başvurmalısınız?',
  visa_types_description:
    'Schengen vizeleri, 90 güne kadar olan kısa süreli seyahatler için düzenlenen C Tipi vizelerdir. Seyahat amacınıza göre başvurmanız gereken kategori değişir. 90 günü aşan eğitim, çalışma veya yerleşim gibi amaçlarda ise Schengen vizesi değil, seyahat edeceğiniz ülkenin ulusal D Tipi vizesine başvurmanız gerekir.',
  visa_types_c_title: 'C Tipi Schengen Vizeleri',
  visa_types_c: [
    {
      title: 'Turistik Vize',
      description:
        'Gezi, tatil ve bireysel seyahat amacıyla yapılan kısa süreli başvurular için düzenlenen C Tipi Schengen vizesidir. Seyahat süresi, vizenin geçerlilik tarihleri ve izin verilen kalış süresi başvurunun değerlendirilmesine göre belirlenir.',
    },
    {
      title: 'Ticari Vize',
      description:
        'İş görüşmeleri, şirket ziyaretleri, toplantılar, fuarlar ve ticari organizasyonlara katılım amacıyla yapılan kısa süreli seyahatler için düzenlenen C Tipi Schengen vizesidir.',
    },
    {
      title: 'Aile Ziyareti Vizesi',
      description:
        'Schengen Bölgesi\'nde yaşayan aile bireylerini veya yakınlarını ziyaret etmek amacıyla yapılan kısa süreli seyahatler için başvurulan C Tipi Schengen vizesidir. Başvurunun niteliğine göre davetiye ve ziyaret edilen kişiye ilişkin ek belgeler talep edilebilir.',
    },
    {
      title: 'Transit Vize',
      description:
        'Schengen Bölgesi üzerinden başka bir ülkeye seyahat ederken transit geçiş için vizeye ihtiyaç duyan yolcuların başvurduğu vize türüdür. Transit vize gerekliliği, seyahat güzergâhına ve yolcunun vatandaşlığına göre değişebilir.',
    },
    {
      title: 'Fuar, Kongre ve Etkinlik Vizesi',
      description:
        'Fuar, kongre, konferans, kültürel, bilimsel veya sportif etkinliklere katılmak amacıyla yapılan kısa süreli seyahatler için başvurulan C Tipi Schengen vizesidir.',
    },
  ],
  visa_types_d_title: 'D Tipi Ulusal Vizeler',
  visa_types_d_description:
    '90 günden uzun süreli eğitim, çalışma veya yerleşim amacı taşıyan seyahatler Schengen C Tipi vizesi kapsamında değildir. Bu durumda, seyahat edilecek ülkenin ulusal mevzuatına göre D Tipi vize başvurusu yapılması gerekir.',
  visa_types_d: [
    {
      title: 'Öğrenci Vizesi',
      description:
        '90 günü aşan eğitim programlarına katılmak veya uzun süreli eğitim amacıyla ilgili ülkede bulunmak isteyen kişilerin başvurması gereken ulusal D Tipi vizedir.',
    },
    {
      title: 'Çalışma Vizesi',
      description:
        'İlgili ülkede uzun süreli çalışmak isteyen kişilerin başvurması gereken ulusal D Tipi vizedir. Başvuru koşulları ve gerekli belgeler ülkeye göre değişiklik gösterir.',
    },
    {
      title: 'Aile Birleşimi Vizesi',
      description:
        'İlgili ülkede yasal olarak yaşayan aile bireylerinin yanına uzun süreli yerleşmek isteyen kişilerin başvurduğu ulusal D Tipi vizedir. Başvuru şartları ülkenin ulusal mevzuatına göre belirlenir.',
    },
  ],

  process_title: 'Schengen Vize Başvurusu Nasıl Yapılır?',
  process_description:
    'Schengen vize başvurusu; seyahat amacının ve vize türünün belirlenmesi, doğru başvuru ülkesinin seçilmesi, gerekli belgelerin hazırlanması, randevu ve biyometri işlemlerinin tamamlanması ve başvurunun değerlendirilmesi aşamalarından oluşur. Başvuru şartları ve prosedürler, başvuracağınız ülkeye göre değişebilir.',
  process_steps: [
    'Vize türünü belirleyin',
    'Başvuru ülkesini seçin',
    'Belgeleri hazırlayın',
    'Randevu ve biyometri işlemlerini tamamlayın',
    'Başvurunuzu teslim edin',
    'Sonucu bekleyin',
  ],

  faq_title: 'Schengen Vizesi Hakkında Sıkça Sorulan Sorular',
  faqs: [
    {
      question: 'Schengen vize başvurusunu ne kadar önce yapmalıyım?',
      answer:
        'Schengen vize başvurunuzu, planlanan seyahat tarihinizden en erken 6 ay önce ve kural olarak en geç 15 takvim günü önce yapabilirsiniz. Ancak 15 günlük süre başvuruyu son dakikaya bırakmak için güvenli bir zaman aralığı değildir. Randevu bulunabilirliği, resmî tatiller ve başvurunun değerlendirme süresinin uzayabilmesi nedeniyle başvurunuzu daha erken yapmanız önerilir. Normal değerlendirme süresi 15 gün olmakla birlikte, gerekli durumlarda 45 güne kadar uzayabilir.',
    },
    {
      question: 'Schengen vizesi kaç günde sonuçlanır?',
      answer:
        'Schengen vize başvuruları, normal şartlarda başvurunun yetkili makama ulaştığı tarihten itibaren 15 takvim günü içinde sonuçlandırılır. Başvurunun daha ayrıntılı incelenmesi veya ek belge talep edilmesi halinde bu süre 45 güne kadar uzayabilir.',
    },
    {
      question: 'Schengen vize ücreti ne kadar?',
      answer:
        'Schengen vize harcı ve başvuru sırasında ödenebilecek hizmet bedelleri zaman içinde değişebilir. Güncel ücretler, başvuru yapılacak ülkeye ve yetkili başvuru merkezine göre kontrol edilmelidir.',
    },
    {
      question: 'Schengen vizesi için banka hesabımda ne kadar para bulunmalıdır?',
      answer:
        'Schengen vizesi için tüm ülkeler açısından geçerli tek bir minimum banka bakiyesi bulunmaz. Gerekli finansal yeterlilik, başvurulan ülkenin belirlediği günlük geçim tutarı, seyahat süresi ve konaklama gibi unsurlara göre değerlendirilir. Hesabınızdaki bakiyenin seyahat masraflarınızı karşılayabilecek düzeyde olması ve gelir durumunuzla uyumlu olması gerekir.',
    },
    {
      question: 'Schengen vizesi için pasaportumun en az kaç ay geçerliliği olmalıdır?',
      answer:
        'Pasaportunuzun, Schengen Bölgesi\'nden planlanan çıkış tarihinizden sonra en az 3 ay daha geçerli olması gerekir. Ayrıca pasaportunuzun son 10 yıl içinde düzenlenmiş ve en az 2 boş sayfasının bulunması gerekir.',
    },
    {
      question: 'Schengen vizesi için parmak izi vermem gerekir mi?',
      answer:
        'Schengen vize başvurularında parmak izi alınması ve biyometrik veri kaydedilmesi genel olarak zorunludur. Ancak daha önce Schengen vizesi başvurusu sırasında parmak izi verdiyseniz ve bu biyometrik veriler 59 ay içinde yeniden kullanılabiliyorsa tekrar parmak izi vermeniz gerekmeyebilir.',
    },
    {
      question: 'Schengen vizesi ile tüm Schengen ülkelerine seyahat edebilir miyim?',
      answer:
        'Evet. Schengen vizesi, vizenizin geçerlilik alanı, giriş sayısı ve izin verilen kalış süresi dahilinde Schengen Bölgesi\'ndeki ülkelere seyahat etmenize olanak tanır.',
    },
    {
      question: 'İlk girişimi vizeyi aldığım ülkeden yapmak zorunda mıyım?',
      answer:
        'Hayır. Schengen vizesi aldığınız ülkeden giriş yapmanız genel olarak zorunlu değildir. Ancak seyahat planınızın, vize başvurusu sırasında sunduğunuz bilgilerle uyumlu olması ve başvuru yaptığınız ülkenin seyahatinizin ana destinasyonu olması gerekir.',
    },
    {
      question: 'Tek girişli ve çok girişli Schengen vizesi arasındaki fark nedir?',
      answer:
        'Tek girişli (Single Entry) Schengen vizesi, Schengen Bölgesi\'ne bir kez giriş yapmanıza izin verir. Bölgeden çıktıktan sonra vizenizin geçerlilik süresi devam etse bile aynı vizeyle yeniden giriş yapamazsınız. Çok girişli (Multiple Entry) Schengen vizesi ise vizenin geçerlilik süresi ve izin verilen kalış süresi içinde Schengen Bölgesi\'ne birden fazla giriş ve çıkış yapmanıza olanak tanır.',
    },
    {
      question: 'Schengen vize başvuruları en çok hangi nedenlerle reddedilir?',
      answer:
        'Schengen vize başvuruları; seyahat amacının yeterince kanıtlanmaması, sunulan belgelerde eksiklik veya tutarsızlık bulunması, yeterli maddi imkânın gösterilememesi ya da başvuru sahibinin seyahat sonunda ülkesine döneceğine ilişkin yeterli kanaat oluşmaması gibi nedenlerle reddedilebilir. Ret gerekçesi, her başvurunun kendi koşulları değerlendirilerek belirlenir.',
    },
    {
      question: 'Schengen vize başvurum reddedilirse tekrar başvuru yapabilir miyim?',
      answer:
        'Evet. Schengen vize başvurunuzun reddedilmesi, yeniden başvuru yapmanıza engel değildir. Ancak yeni bir başvuru yapmadan önce ret gerekçesini değerlendirmeniz ve önceki başvuruda yetersiz veya eksik görülen hususları gidermeniz önemlidir.',
    },
  ],
};
