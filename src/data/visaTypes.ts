// Static editorial content for /vize-turleri and its visa-type sub-pages.
//
// Only the prose lives here — the "Sıkça Sorulan Sorular" block on every one
// of these pages is admin-managed and comes from the `visa_type_faqs` table
// via `src/lib/data/visaTypeFaqs.ts`. The `slug` of each entry doubles as the
// FAQ `page_key`, so adding a visa type here means adding FAQ rows under the
// same key.

export interface VisaTypeSection {
  heading: string;
  paragraphs: string[];
  /** Optional unordered list (belge listeleri, "kimler başvurabilir" vb.). */
  bullets?: string[];
  /**
   * Optional ordered list rendered as numbered steps. Used by the
   * "Başvuru Nasıl Yapılır?" sections, where the order matters.
   */
  steps?: string[];
  /**
   * Marks the "Gerekli Belgeler" section. That section additionally renders
   * the admin-uploaded PDF cards from `visa_type_documents`, matching the
   * documents section on /vize/[countrySlug].
   */
  isDocuments?: boolean;
}

export interface VisaTypeCta {
  title: string;
  text: string;
  label: string;
}

export interface VisaTypeContent {
  /** URL segment under /vize-turleri, and the FAQ page_key. */
  slug: string;
  title: string;
  /** Grouping on the main page: short-stay vs long-stay. */
  category: 'kisa' | 'uzun';
  icon: string;
  /** Schengen visa class shown as a chip on the card. */
  tag: 'Tip C' | 'Tip D';
  /** One-liner used on the main page grid. */
  cardDesc: string;
  /** Sub-heading under the sub-page h1. */
  heroSubtitle: string;
  sections: VisaTypeSection[];
  cta: VisaTypeCta;
  faqTitle: string;
}

export const VISA_TYPES: VisaTypeContent[] = [
  // ==========================================================
  // KISA SÜRELİ VİZELER
  // ==========================================================
  {
    slug: 'turistik-vize',
    title: 'Turistik Vize',
    category: 'kisa',
    icon: '🏖️',
    tag: 'Tip C',
    cardDesc: 'Tatil, gezi ve kısa süreli bireysel seyahatler.',
    heroSubtitle:
      'Tatil planınızı hayata geçirmek için turistik vize başvuru sürecini ve tüm detayları inceleyin.',
    sections: [
      {
        heading: 'Turistik Vize Nedir ve Kimler Başvurabilir?',
        paragraphs: [
          'Turistik vize; tatil, gezi, kültürel keşif ve kısa süreli bireysel seyahatler amacıyla başka bir ülkeye gitmek isteyen kişilerin başvurduğu vize türüdür.',
          'Bu vizeye kimler başvurabilir?',
        ],
        bullets: [
          'Tatil veya bireysel seyahat planlayanlar',
          'Organize tur programlarına katılacak olanlar',
          'Arkadaş veya yakınlarını ziyaret edecekler',
          'Kültürel, sanatsal ya da sportif etkinlikleri izleyici olarak takip etmek isteyenler',
        ],
      },
      {
        heading: 'Turistik Vize İçin Gerekli Belgeler',
        isDocuments: true,
        paragraphs: [
          'Her ülkenin vize politikası ve her başvuranın mesleki durumu farklı olduğu için istenen belgeler de değişiklik gösterebilir. Ancak başarılı bir turistik vize dosyasında mutlaka yer alması gereken temel unsurlar şunlardır:',
        ],
        bullets: [
          'Kimlik ve Pasaport Bilgileri',
          'Seyahat ve Konaklama Planı',
          'Seyahat Sağlık Sigortası',
          'Finansal Belgeler',
          'Mesleki ve Kişisel Durum Belgeleri',
        ],
      },
      {
        heading: 'Turistik Vize Başvurusu Nasıl Yapılır?',
        paragraphs: [
          'Turistik vize almak için önce seyahat rotanızı netleştirip hedef ülkenin güncel kurallarını incelemeniz gerekir. Kurallar netleştikten sonra pasaport, konaklama ve finansal evraklarınızı eksiksiz şekilde bir araya getirmelisiniz.',
          'Evraklar hazır olduktan sonra başvuru süreci şu adımlarla ilerler:',
        ],
        steps: [
          'İlgili kurumun sisteminden başvuru formunun doldurulması ve harcın yatırılması',
          'Ülkenin prosedürüne göre randevu alınıp biyometrik işlemlerin (parmak izi) tamamlanması (bazı ülkelerde bu süreç tamamen dijital üzerinden yürütülür)',
          'Dosyanın konsolosluğa teslim edilip incelemeye alınması (bu aşamada ek evrak istenebilir veya mülakata çağrılabilir)',
          'Tüm değerlendirmelerin ardından vize sonucunun açıklanması',
        ],
      },
      {
        heading: 'Turistik Vize Başvuruları Nasıl Değerlendirilir?',
        paragraphs: [
          'Turistik vize başvurularında yalnızca sunulan belgelerin eksiksiz olması yeterli değildir. Yetkili makamlar, başvuru sahibinin sunduğu bilgiler ve belgeleri birlikte değerlendirerek başvurunun ilgili vize koşullarını karşılayıp karşılamadığını inceler.',
          'Seyahat amacı, planlanan seyahatin koşulları ve başvuru sahibinin kişisel durumu gibi unsurlar değerlendirme sürecinde dikkate alınabilir. Başvurunun nasıl değerlendirileceği ve hangi kriterlerin uygulanacağı, başvurulan ülkenin güncel vize kurallarına göre değişebilir.',
        ],
      },
    ],
    cta: {
      title: 'Turistik Vize Başvurunuzu Planlayın',
      text: 'Seyahat planınızı ve kişisel durumunuzu birlikte değerlendirerek turistik vize başvurunuz için izlemeniz gereken yolu belirleyelim.',
      label: 'Turistik Vize Başvurunuzu Planlayın',
    },
    faqTitle: 'Turistik vize —',
  },

  {
    slug: 'ticari-vize',
    title: 'Ticari Vize',
    category: 'kisa',
    icon: '💼',
    tag: 'Tip C',
    cardDesc: 'İş görüşmeleri, şirket ziyaretleri ve ticari faaliyetler.',
    heroSubtitle:
      'İş seyahatlerinizi hayata geçirmek için ticari vize başvuru sürecini ve tüm detayları inceleyin.',
    sections: [
      {
        heading: 'Ticari Vize Nedir ve Kimler Başvurabilir?',
        paragraphs: [
          'Ticari vize; iş görüşmeleri, şirket ziyaretleri, toplantılar, fuarlar, konferanslar ve iş bağlantıları kurmaya yönelik kısa süreli seyahatler amacıyla başka bir ülkeye gitmek isteyen kişilerin başvurduğu vize türüdür.',
          'Bu vizeye kimler başvurabilir?',
        ],
        bullets: [
          'İş görüşmesi veya şirket ziyareti yapacak çalışanlar ve yöneticiler',
          'Uluslararası fuar, kongre, seminer veya konferanslara katılacak olanlar',
          'Yeni ticari ortaklıklar ve iş bağlantıları kurmak isteyen girişimciler',
          'Şirket içi eğitim, montaj veya teknik incelemeler için seyahat edecek uzmanlar',
        ],
      },
      {
        heading: 'Ticari Vize İçin Gerekli Belgeler',
        isDocuments: true,
        paragraphs: [
          'Her ülkenin vize politikası ve başvuranın/şirketin durumu farklı olduğu için istenen belgeler değişiklik gösterebilir. Ancak başarılı bir ticari vize dosyasında mutlaka yer alması gereken temel unsurlar şunlardır:',
        ],
        bullets: [
          'Kimlik ve Pasaport Bilgileri',
          'Şirket ve Mesleki Belgeler',
          'Ticari Davetiye ve Etkinlik Belgeleri',
          'Finansal Belgeler',
          'Seyahat ve Konaklama Planı',
        ],
      },
      {
        heading: 'Ticari Vize Başvurusu Nasıl Yapılır?',
        paragraphs: [
          'Ticari vize almak için önce seyahat rotanızı ve iş planınızı netleştirip hedef ülkenin güncel kurallarını incelemeniz gerekir. Kurallar netleştikten sonra pasaport, mesleki evraklar ve ticari davetinizi eksiksiz şekilde bir araya getirmelisiniz.',
          'Evraklar hazır olduktan sonra başvuru süreci şu adımlarla ilerler:',
        ],
        steps: [
          'İlgili kurumun sisteminden başvuru formunun doldurulması ve harcın yatırılması',
          'Ülkenin prosedürüne göre randevu alınıp biyometrik işlemlerin (parmak izi) tamamlanması (bazı ülkelerde bu süreç tamamen dijital üzerinden yürütülür)',
          'Dosyanın konsolosluğa teslim edilip incelemeye alınması (bu aşamada ek ticari evrak istenebilir veya mülakata çağrılabilir)',
          'Tüm değerlendirmelerin ardından vize sonucunun açıklanması',
        ],
      },
      {
        heading: 'Ticari Vize Başvuruları Nasıl Değerlendirilir?',
        paragraphs: [
          'Ticari vize başvuruları, başvuru sahibinin sunduğu bilgiler ve belgeler üzerinden değerlendirilir. Yetkili makamlar, planlanan seyahatin ticari amacını, başvuru sahibinin mesleki durumu ile seyahat arasındaki ilişkiyi ve sunulan belgelerin başvuruyla uyumunu birlikte inceleyebilir.',
          'Seyahatin amacı, ziyaret edilecek şirket veya katılınacak etkinlik, seyahat süresi ve masrafların nasıl karşılanacağı gibi unsurlar başvurunun değerlendirilmesinde önem taşıyabilir.',
          'Değerlendirme kriterleri ve uygulamalar başvurulan ülkeye göre değişebileceğinden, her başvurunun ilgili ülkenin güncel vize kuralları doğrultusunda ele alınması gerekir.',
        ],
      },
    ],
    cta: {
      title: 'Ticari Vize Başvurunuzu Planlayın',
      text: 'Seyahat planınızı ve ticari durumunuzu birlikte değerlendirerek ticari vize başvurunuz için izlemeniz gereken yolu belirleyelim.',
      label: 'Ticari Vize Başvurunuzu Planlayın',
    },
    faqTitle: 'Ticari vize —',
  },

  {
    slug: 'aile-ziyareti-vizesi',
    title: 'Aile Ziyareti Vizesi',
    category: 'kisa',
    icon: '👨‍👩‍👧',
    tag: 'Tip C',
    cardDesc:
      'Yurt dışında yaşayan aile bireylerini ve yakınları ziyaret etmeye yönelik başvurular.',
    heroSubtitle:
      'Yurt dışında yaşayan aile üyelerinizi, akrabalarınızı veya arkadaşlarınızı ziyaret etmek için aile ziyareti vizesi başvuru sürecini ve tüm detayları inceleyin.',
    sections: [
      {
        heading: 'Aile Ziyareti Vizesi Nedir ve Kimler Başvurabilir?',
        paragraphs: [
          'Aile ziyareti vizesi; başka bir ülkede yasal olarak ikamet eden aile üyelerini, akrabaları veya yakın tanıdıkları ziyaret etmek amacıyla kısa süreli seyahat etmek isteyen kişilerin başvurduğu vize türüdür.',
          'Bu vizeye kimler başvurabilir?',
        ],
        bullets: [
          'Yurt dışında yaşayan anne, baba, kardeş, çocuk veya eşini ziyaret edecek olanlar',
          'Diğer yakın akrabalarını ya da aile dostlarını kısa süreliğine ziyaret etmek isteyenler',
          'Yurt dışındaki düğün, nişan, mezuniyet veya benzeri ailevi etkinliklere katılacak olanlar',
          'Doğum, hastalık veya özel mazeretler nedeniyle acil aile ziyareti gerçekleştirecek bireyler',
        ],
      },
      {
        heading: 'Aile Ziyareti Vizesi İçin Gerekli Belgeler',
        isDocuments: true,
        paragraphs: [
          'Her ülkenin vize politikası ve başvuranın durumu farklı olduğu için istenen belgeler değişiklik gösterebilir. Ancak başarılı bir aile ziyareti vizesi dosyasında mutlaka yer alması gereken temel unsurlar şunlardır:',
        ],
        bullets: [
          'Kimlik ve Pasaport Bilgileri',
          'Mesleki ve Kişisel Durum Belgeleri',
          'Resmi Davetiye ve İkamet Belgeleri',
          'Akrabalık ve Bağlantı Belgeleri',
          'Finansal Belgeler',
          'Seyahat ve Konaklama Planı',
        ],
      },
      {
        heading: 'Aile Ziyareti Vizesi Başvurusu Nasıl Yapılır?',
        paragraphs: [
          'Aile ziyareti vizesi almak için öncelikle seyahat tarihlerinizi ve davet eden kişiyle olan planınızı netleştirip hedef ülkenin güncel kurallarını incelemeniz gerekir. Kurallar netleştikten sonra pasaport, davetiye ve akrabalık bağını kanıtlayan evrakları bir araya getirmelisiniz.',
          'Evraklar hazır olduktan sonra başvuru süreci şu adımlarla ilerler:',
        ],
        steps: [
          'İlgili kurumun sisteminden başvuru formunun doldurulması ve harcın yatırılması',
          'Ülkenin prosedürüne göre randevu alınıp biyometrik işlemlerin (parmak izi) tamamlanması (bazı ülkelerde bu süreç tamamen dijital üzerinden yürütülür)',
          'Dosyanın konsolosluğa teslim edilip incelemeye alınması (bu aşamada ek akrabalık belgesi veya davetiye detayları istenebilir)',
          'Tüm değerlendirmelerin ardından vize sonucunun açıklanması',
        ],
      },
      {
        heading: 'Aile Ziyareti Vizesi Başvuruları Nasıl Değerlendirilir?',
        paragraphs: [
          'Aile ziyareti vize başvurularında, ziyaret amacının gerçek ve geçici bir ziyarete dayanıp dayanmadığı ve başvuruda sunulan bilgilerin bunu destekleyip desteklemediği değerlendirilebilir. Başvuru sahibinin ziyaret edeceği kişiyle olan ilişkisi, seyahat planı, konaklama düzenlemeleri ve finansal koşulları gibi unsurlar da başvurunun niteliğine göre dikkate alınabilir.',
          'Davetiye veya ziyaret edilecek kişiye ilişkin belgelerin başvuru sahibinin sunduğu bilgilerle uyumlu olması önemlidir. Aynı şekilde seyahat süresi, konaklama ve finansal kaynaklara ilişkin bilgilerin başvurunun genel amacıyla tutarlı olması beklenebilir.',
          'Değerlendirme kriterleri ve uygulamalar başvurulan ülkeye göre değişebileceğinden, her başvurunun ilgili ülkenin güncel vize kuralları doğrultusunda ele alınması gerekir.',
        ],
      },
    ],
    cta: {
      title: 'Aile Ziyareti Vize Başvurunuzu Planlayın',
      text: 'Seyahat planınızı ve akrabalık/kişisel durumunuzu birlikte değerlendirerek aile ziyareti vizesi başvurunuz için izlemeniz gereken yolu belirleyelim.',
      label: 'Aile Ziyareti Vize Başvurunuzu Planlayın',
    },
    faqTitle: 'Aile ziyareti vizesi —',
  },

  {
    slug: 'transit-vize',
    title: 'Transit Vize',
    category: 'kisa',
    icon: '🔄',
    tag: 'Tip C',
    cardDesc: 'Başka bir ülkeye seyahat sırasında transit geçiş gerektiren durumlar.',
    heroSubtitle:
      'Başka bir ülkeye seyahat ederken aktarma yapacağınız havalimanında veya ülkede sorun yaşamamak için transit vize süreçlerini ve detaylarını inceleyin.',
    sections: [
      {
        heading: 'Transit Vize Nedir ve Kimler Başvurabilir?',
        paragraphs: [
          'Transit vize; nihai varış noktasına ulaşmak için aradaki bir ülkenin havaalanından (havaalanı transit vizesi) veya kara/deniz yoluyla geçiş yapacak yolcuların alması gereken vize türüdür.',
          'Bu vizeye kimler başvurabilir?',
        ],
        bullets: [
          'Uçuşu sırasında belirli ülkelerin havalimanlarında transit bölgeden dışarı çıkacak veya terminal değiştirecek olanlar',
          'Aktarmalı uçuşunda havayolu veya bilet koşulları gereği pasaport kontrolünden geçerek ülkeye girmesi gerekenler',
          'Kara yolu veya demir yoluyla bir ülkeden başka bir ülkeye geçiş yapacak yolcular',
          'Gemi seyahatleri (kruvaziyer) öncesinde veya sırasında ilgili ülke limanlarından geçiş yapacak olanlar',
        ],
      },
      {
        heading: 'Transit Vize İçin Gerekli Belgeler',
        isDocuments: true,
        paragraphs: [
          'Her ülkenin vize politikası ve başvuranın rotası farklı olduğu için istenen belgeler değişiklik gösterebilir. Ancak başarılı bir transit vize dosyasında mutlaka yer alması gereken temel unsurlar şunlardır:',
        ],
        bullets: [
          'Kimlik ve Pasaport Bilgileri',
          'Nihai Hedef Ülkenin Vizesi veya Seyahat Belgeleri',
          'Uçuş ve Ulaşım Rezervasyonları',
          'Konaklama Planı',
          'Finansal Belgeler',
        ],
      },
      {
        heading: 'Transit Vize Başvurusu Nasıl Yapılır?',
        paragraphs: [
          'Transit vize almak için öncelikle uçuş rotanızı ve transit geçiş yapacağınız ülkenin kurallarını netleştirmeniz gerekir. Bazı ülkeler sadece havalimanı içinde kalındığında transit vize istemezken, bazıları pasaport kontrolünden geçilmese bile vize talep edebilir. Kurallar netleştikten sonra pasaport, uçak biletleri ve nihai hedef ülke vizenizi bir araya getirmelisiniz.',
          'Evraklar hazır olduktan sonra başvuru süreci şu adımlarla ilerler:',
        ],
        steps: [
          'İlgili kurumun sisteminden başvuru formunun doldurulması ve harcın yatırılması',
          'Ülkenin prosedürüne göre randevu alınıp işlemlerin tamamlanması (bazı ülkelerde bu süreç tamamen dijital veya online üzerinden yürütülür)',
          'Dosyanın konsolosluğa teslim edilip incelemeye alınması (bu aşamada uçuş detayları veya ek seyahat belgeleri istenebilir)',
          'Tüm değerlendirmelerin ardından vize sonucunun açıklanması',
        ],
      },
      {
        heading: 'Transit Vize Başvuruları Nasıl Değerlendirilir?',
        paragraphs: [
          'Transit vize başvurularında öncelikle planlanan seyahatin gerçekten transit geçiş niteliğinde olup olmadığı ve başvuru sahibinin transit vize şartlarını karşılayıp karşılamadığı değerlendirilir.',
          'Seyahat güzergâhı, aktarma yapılacak ülke, nihai varış noktası ve gerekli durumlarda varış ülkesine giriş izni gibi unsurlar birlikte incelenebilir. Sunulan uçuş ve seyahat belgelerinin başvuruda belirtilen güzergâhla uyumlu olması önemlidir.',
          'Transit vize kuralları ülkeye, yolcunun vatandaşlığına ve aktarma koşullarına göre değişebildiğinden, başvurunun ilgili ülkenin güncel transit vize uygulamalarına göre değerlendirilmesi gerekir.',
        ],
      },
    ],
    cta: {
      title: 'Transit Vize Başvurunuzu Planlayın',
      text: 'Uçuş rotanızı ve transit geçiş yapacağınız ülkenin kurallarını birlikte değerlendirerek transit vize başvurunuz için izlemeniz gereken yolu belirleyelim.',
      label: 'Transit Vize Başvurunuzu Planlayın',
    },
    faqTitle: 'Transit vize —',
  },

  {
    slug: 'fuar-kulturel-etkinlik-konferans-vizesi',
    title: 'Fuar, Kültürel Etkinlik ve Konferans Vizesi',
    category: 'kisa',
    icon: '🎤',
    tag: 'Tip C',
    cardDesc: 'Fuar, konferans, kongre ve benzeri etkinliklere katılım.',
    heroSubtitle:
      'Uluslararası fuarlara, akademik konferanslara, sanatsal gösterilere veya kültürel organizasyonlara katılmak için vize başvuru sürecini ve tüm detayları inceleyin.',
    sections: [
      {
        heading: 'Fuar, Kültürel Etkinlik ve Konferans Vizesi Nedir ve Kimler Başvurabilir?',
        paragraphs: [
          'Fuar, kültürel etkinlik ve konferans vizesi; ticari fuarlar, endüstriyel sergiler, akademik kongreler, bilimsel sempozyumlar, sanatsal festivaller, konserler veya uluslararası spor müsabakaları gibi özel amaçlı organizasyonlara katılmak amacıyla başka bir ülkeye gitmek isteyen kişilerin başvurduğu vize türüdür.',
          'Bu vizeye kimler başvurabilir?',
        ],
        bullets: [
          'Uluslararası fuarlara stant açarak katılımcı veya ziyaretçi olarak gidecek olan iş insanları ve çalışanlar',
          'Akademik kongre, sempozyum veya konferanslarda sunum yapacak, konuşmacı olacak veya araştırmasını paylaşacak akademisyen ve öğrenciler',
          'Tiyatro, müzik, sinema veya sergi gibi kültürel ve sanatsal projelere katılacak sanatçılar ve organizasyon ekipleri',
          'Uluslararası spor müsabakalarına, turnuvalara veya kamplara katılacak sporcular, antrenörler ve teknik heyet',
        ],
      },
      {
        heading: 'Fuar, Kültürel Etkinlik ve Konferans Vizesi İçin Gerekli Belgeler',
        isDocuments: true,
        paragraphs: [
          'Her ülkenin vize politikası ve başvuranın etkinliğe katılım statüsü farklı olduğu için istenen belgeler değişiklik gösterebilir. Ancak başarılı bir etkinlik vizesi dosyasında mutlaka yer alması gereken temel unsurlar şunlardır:',
        ],
        bullets: [
          'Kimlik ve Pasaport Bilgileri',
          'Mesleki ve Kurumsal Durum Belgeleri',
          'Etkinlik Davetiye, Kayıt ve Kabul Belgeleri',
          'Finansal Belgeler',
          'Seyahat ve Konaklama Planı',
        ],
      },
      {
        heading: 'Fuar, Kültürel Etkinlik ve Konferans Vizesi Başvurusu Nasıl Yapılır?',
        paragraphs: [
          'Bu vizeyi almak için öncelikle katılacağınız etkinliğin tarihini, yerini ve etkinlikle olan kurumsal/bireysel bağınızı netleştirip hedef ülkenin güncel kurallarını incelemeniz gerekir. Kurallar netleştikten sonra pasaport, kurumunuzdan alınacak görev yazısı ve etkinliğe katılımınızı kanıtlayan resmi evrakları bir araya getirmelisiniz.',
          'Evraklar hazır olduktan sonra başvuru süreci şu adımlarla ilerler:',
        ],
        steps: [
          'İlgili kurumun sisteminden başvuru formunun doldurulması ve harcın yatırılması',
          'Ülkenin prosedürüne göre randevu alınıp biyometrik işlemlerin (parmak izi) tamamlanması (bazı ülkelerde bu süreç tamamen dijital üzerinden yürütülür)',
          'Dosyanın konsolosluğa teslim edilip incelemeye alınması (bu aşamada ek etkinlik programı veya sunum detayları istenebilir)',
          'Tüm değerlendirmelerin ardından vize sonucunun açıklanması',
        ],
      },
      {
        heading: 'Fuar, Kültürel Etkinlik ve Konferans Vizesi Başvuruları Nasıl Değerlendirilir?',
        paragraphs: [
          'Bu tür başvurularda öncelikle seyahatin gerçek bir etkinlik katılımı amacı taşıyıp taşımadığı ve başvuru sahibinin sunduğu belgelerin bu amacı destekleyip desteklemediği değerlendirilir. Etkinliğin niteliği, başvuru sahibinin etkinlikle ilişkisi, katılım şekli, seyahat süresi ve sunulan belgelerin birbiriyle uyumu başvurunun değerlendirilmesinde dikkate alınabilir.',
          'Özellikle fuar veya konferans katılımında kayıt veya davet belgelerinin, başvuru sahibinin mesleki veya kişisel durumu ve seyahat planıyla uyumlu olması önem taşır. Etkinlik amaçlı seyahatlerde davetiye, kayıt, giriş bileti veya program gibi belgeler seyahat amacını desteklemek için kullanılabilir.',
          'Değerlendirme kriterleri ve gerekli belgeler başvurulan ülkeye ve etkinliğin niteliğine göre değişebileceğinden, başvurunun ilgili ülkenin güncel uygulamalarına göre hazırlanması gerekir.',
        ],
      },
    ],
    cta: {
      title: 'Fuar, Konferans ve Etkinlik Vize Başvurunuzu Planlayın',
      text: 'Seyahat planınızı ve uluslararası etkinlik katılım durumunuzu birlikte değerlendirerek vize başvurunuz için izlemeniz gereken yolu belirleyelim.',
      label: 'Fuar, Konferans ve Etkinlik Vize Başvurunuzu Planlayın',
    },
    faqTitle: 'Fuar, etkinlik ve konferans vizesi —',
  },

  // ==========================================================
  // UZUN SÜRELİ VİZELER
  // ==========================================================
  {
    slug: 'aile-birlesimi-vizesi',
    title: 'Aile Birleşimi Vizesi',
    category: 'uzun',
    icon: '🏠',
    tag: 'Tip D',
    cardDesc:
      'Yurt dışında yaşayan aile bireyinin yanına uzun süreli yerleşmeye yönelik başvurular.',
    heroSubtitle:
      'Yurt dışında yaşayan eşinizin veya aile bireyinizin yanına yerleşmek için aile birleşimi vizesi başvuru sürecini ve tüm detayları inceleyin.',
    sections: [
      {
        heading: 'Aile Birleşimi Vizesi Nedir ve Kimler Başvurabilir?',
        paragraphs: [
          'Aile birleşimi vizesi; başka bir ülkede vatandaşlık veya yasal oturum izniyle ikamet eden bir kişinin, aile bireylerinin de kendi yanında yaşayabilmesi amacıyla başvurduğu uzun süreli (D tipi / Ulusal) vize türüdür.',
          'Bu vizeye kimler başvurabilir?',
        ],
        bullets: [
          'Yurt dışında yaşayan yasal eşinin yanına yerleşmek isteyen evli bireyler',
          'Yurt dışındaki ebeveynlerinin yanına gitmek isteyen 18 yaş altı reşit olmayan çocuklar',
          'Belirli şartlar altında yurt dışındaki çocuklarının yanına yerleşmek isteyen bakmakla yükümlü olunan ebeveynler',
          'Evlilik hazırlığı yapıp hedef ülkede evlenecek olan nişanlılar (evlilik vizesi kapsamında)',
        ],
      },
      {
        heading: 'Aile Birleşimi Vizesi İçin Gerekli Belgeler',
        isDocuments: true,
        paragraphs: [
          'Uzun süreli bir yerleşim vizesi olduğu için istenen evraklar hem başvuranın hem de yurt dışındaki sponsorun (eşin/akrabanın) resmi durumunu kapsamalıdır. Başarılı bir aile birleşimi dosyasında mutlaka yer alması gereken temel unsurlar şunlardır:',
        ],
        bullets: [
          'Kimlik ve Pasaport Bilgileri',
          'Evlilik / Akrabalık Bağını Kanıtlayan Uluslararası Belgeler (Formül B vb.)',
          'Dil Yeterlilik Sertifikaları (ilgili ülkenin zorunlu tuttuğu dil seviye belgeleri)',
          'Sponsorun (Yurt Dışındaki Eş/Akraba) Oturum ve Vatandaşlık Belgeleri',
          'Sponsorun Gelir ve Konaklama Belgeleri (Mali Yeterlilik ve Kira Sözleşmesi)',
        ],
      },
      {
        heading: 'Aile Birleşimi Vize Başvurusu Nasıl Yapılır?',
        paragraphs: [
          'Aile birleşimi vizesi, turistik veya ticari vizelerden farklı olarak doğrudan uzun süreli ulusal (D tipi) vize kategorisinde değerlendirilir. Süreç genellikle hedef ülkenin konsolosluğu veya yetkili aracı kurumları üzerinden yürütülür.',
          'Evraklar hazır olduktan sonra başvuru süreci şu adımlarla ilerler:',
        ],
        steps: [
          'Hedef ülkenin konsolosluk sisteminden uzun süreli vize randevusunun alınması ve başvuru formunun doldurulması',
          'Uluslararası evrakların (evlenme cüzdanı, nüfus kayıt örneği vb.) apostilli ve tercüme edilmiş hallerinin hazırlanması',
          'Randevu günü şahsen başvuru merkezine gidilerek biyometrik işlemlerin ve varsa yabancı dil mülakatının tamamlanması',
          "Dosyanın hedef ülkedeki ilgili Yabancılar Şubesi'ne (Ausländerbehörde vb.) gönderilerek onay sürecinin beklenmesi",
        ],
      },
      {
        heading: 'Aile Birleşimi Vizesi Başvuruları Nasıl Değerlendirilir?',
        paragraphs: [
          'Aile birleşimi başvurularında öncelikle aile ilişkisinin hukuken geçerli olup olmadığı ve başvuru sahibinin ilgili ülkenin aile birleşimi şartlarını karşılayıp karşılamadığı değerlendirilir.',
          'Bunun yanında, ülkede yaşayan aile bireyinin yasal statüsü, gelir ve yaşam koşulları, konut durumu ve başvuruya ilişkin diğer yasal şartlar da dikkate alınabilir.',
          'Başvurunun değerlendirilmesinde özellikle aile bağını gösteren belgelerin güvenilirliği, sunulan bilgilerin birbiriyle uyumu ve başvuru sahibinin ilgili ülkenin aile birleşimi koşullarını karşılayıp karşılamadığı önem taşır.',
          'Aile birleşimi şartları ülkeye ve aile ilişkisinin niteliğine göre önemli ölçüde değişebildiğinden, başvuru dosyasının ilgili ülkenin güncel göç ve vize kurallarına göre hazırlanması gerekir.',
        ],
      },
    ],
    cta: {
      title: 'Aile Birleşimi Vize Başvurunuzu Planlayın',
      text: 'Eş ve aile birleşimi sürecinizi, dil belgelerinizi ve sponsorluk şartlarını birlikte değerlendirerek başvurunuz için en doğru adımları atalım.',
      label: 'Aile Birleşimi Vize Başvurunuzu Planlayın',
    },
    faqTitle: 'Aile birleşimi vizesi —',
  },

  {
    slug: 'ogrenci-vizesi',
    title: 'Öğrenci Vizesi',
    category: 'uzun',
    icon: '🎓',
    tag: 'Tip D',
    cardDesc: 'Yurt dışında eğitim, dil okulu ve akademik programlar.',
    heroSubtitle:
      'Yurt dışında lisans, yüksek lisans, doktora eğitimi almak, dil okuluna gitmek veya uluslararası değişim programlarına katılmak için öğrenci vizesi başvuru sürecini ve tüm detayları inceleyin.',
    sections: [
      {
        heading: 'Öğrenci Vizesi Nedir ve Kimler Başvurabilir?',
        paragraphs: [
          'Öğrenci vizesi; başka bir ülkede akredite edilmiş bir eğitim kurumunda tam zamanlı akademik eğitim, mesleki kurs, dil eğitimi veya değişim programı görmek amacıyla uzun süreli (D tipi / Ulusal) ikamet etmek isteyen kişilerin başvurduğu vize türüdür.',
          'Bu vizeye kimler başvurabilir?',
        ],
        bullets: [
          'Yurt dışındaki bir üniversiteden lisans, yüksek lisans (master) veya doktora kabulü almış olanlar',
          'Üniversite eğitimi öncesi dil hazırlık eğitimi veya şartlı kabul alan öğrenciler',
          'Yurt dışındaki sertifikalı dil okullarına veya meslek kurslarına kayıt yaptıranlar',
          'Erasmus, AIESEC veya benzeri uluslararası değişim programlarıyla gidecek olan öğrenciler',
          'Yatay geçiş veya staj programları kapsamında yurt dışındaki bir eğitim kurumunda bulunacaklar',
        ],
      },
      {
        heading: 'Öğrenci Vizesi İçin Gerekli Belgeler',
        isDocuments: true,
        paragraphs: [
          'Uzun süreli bir eğitim ve yerleşim vizesi olduğu için dosyanın hem akademik altyapıyı hem de güçlü bir finansal planı kanıtlaması gerekir. Başarılı bir öğrenci vizesi dosyasında mutlaka yer alması gereken temel unsurlar şunlardır:',
        ],
        bullets: [
          'Kimlik ve Pasaport Bilgileri',
          'Eğitim Kabul ve Kayıt Belgeleri (Üniversite Kabul Mektubu veya Kurs Kayıt Belgesi)',
          'Dil Yeterlilik Sertifikaları (IELTS, TOEFL, TestDaF, Goethe vb.)',
          'Geçmiş Eğitim Belgeleri (Diplomalar, Transkriptler ve Not Dökümleri)',
          'Finansal Yeterlilik ve Sponsorluk Belgeleri (Bloke Hesap, Banka Dökümleri veya Burs Belgeleri)',
          'Sağlık Sigortası ve Konaklama Planı',
        ],
      },
      {
        heading: 'Öğrenci Vize Başvurusu Nasıl Yapılır?',
        paragraphs: [
          'Öğrenci vizesi, turistik veya ticari vizelerden farklı olarak doğrudan uzun süreli ulusal (D tipi) vize kategorisinde değerlendirilir. Süreç, okuldan kabul alınmasıyla başlar ve hedef ülkenin konsolosluk veya yetkili aracı kurumları üzerinden yürütülür.',
          'Kabul belgesi alındıktan sonra başvuru süreci şu adımlarla ilerler:',
        ],
        steps: [
          'Hedef ülkenin konsolosluk sisteminden uzun süreli öğrenci vizesi randevusunun alınması ve başvuru formunun doldurulması',
          'Finansal garantinin (bloke hesap veya sponsor belgeleri) ve dil belgelerinin eksiksiz olarak hazırlanması',
          'Randevu günü şahsen başvuru merkezine gidilerek biyometrik işlemlerin ve niyet mülakatının tamamlanması',
          "Dosyanın hedef ülkedeki ilgili Yabancılar Şubesi'ne veya eğitim makamlarına gönderilerek onay sürecinin beklenmesi",
        ],
      },
      {
        heading: 'Öğrenci Vizesi Başvuruları Nasıl Değerlendirilir?',
        paragraphs: [
          'Öğrenci vizesi başvurularında öncelikle başvuru sahibinin gerçek bir eğitim amacıyla seyahat edip etmediği ve ilgili ülkenin öğrenci vizesi şartlarını karşılayıp karşılamadığı değerlendirilir.',
          'Eğitim kurumundan alınan kabul belgesi, eğitim programının niteliği, başvuru sahibinin eğitim geçmişi, finansal yeterliliği, konaklama düzeni ve başvuru sırasında sunulan diğer bilgiler birlikte değerlendirilebilir.',
          'Başvuruda belirtilen eğitim planının başvuru sahibinin geçmişi ve gelecekteki planlarıyla uyumlu olması ve eğitim ile yaşam giderlerinin nasıl karşılanacağının açık şekilde gösterilmesi önemlidir.',
          'Değerlendirme kriterleri ve gerekli belgeler ülkeye ve eğitim programına göre değişebileceğinden, başvurunun ilgili ülkenin güncel öğrenci vizesi ve göç kurallarına göre hazırlanması gerekir.',
        ],
      },
    ],
    cta: {
      title: 'Öğrenci Vize Başvurunuzu Planlayın',
      text: 'Kabul belgelerinizi, bloke hesap süreçlerinizi ve niyet mektubunuzu birlikte değerlendirerek eğitim yolculuğunuz için en doğru adımları atalım.',
      label: 'Öğrenci Vize Başvurunuzu Planlayın',
    },
    faqTitle: 'Öğrenci vizesi —',
  },

  {
    slug: 'calisma-vizesi',
    title: 'Çalışma Vizesi',
    category: 'uzun',
    icon: '🛠️',
    tag: 'Tip D',
    cardDesc: 'Yurt dışında yasal olarak çalışmaya yönelik başvurular.',
    heroSubtitle:
      'Yurt dışında bir iş teklifi almak, kariyerinizi uluslararası boyuta taşımak ve yasal olarak çalışmak için çalışma vizesi başvuru sürecini ve tüm detayları inceleyin.',
    sections: [
      {
        heading: 'Çalışma Vizesi Nedir ve Kimler Başvurabilir?',
        paragraphs: [
          'Çalışma vizesi; başka bir ülkede yerleşik bir işverenden resmi iş teklifi alan veya uluslararası şirket içi nakil yoluyla görevlendirilen kişilerin, hedef ülkede yasal olarak ikamet edip çalışabilmesini sağlayan uzun süreli (D tipi / Ulusal) vize türüdür.',
          'Bu vizeye kimler başvurabilir?',
        ],
        bullets: [
          'Yurt dışındaki bir şirketten resmi iş sözleşmesi veya iş teklifi (Job Offer) almış olan profesyoneller',
          'Avrupa Mavi Kart (EU Blue Card) veya nitelikli göçmenlik yasaları kapsamında şartları sağlayan uzmanlar',
          'Sağlık personeli, mühendis, IT uzmanı gibi özel meslek gruplarında kabul gören kalifiye çalışanlar',
          'Uluslararası firmaların yurt dışı şubelerine şirket içi nakil (Intra-company transfer) ile gidecek olanlar',
          'Belirli ülkelerin sunduğu serbest meslek, freelance çalışma veya girişimci vizesi programlarına hak kazananlar',
        ],
      },
      {
        heading: 'Çalışma Vizesi İçin Gerekli Belgeler',
        isDocuments: true,
        paragraphs: [
          'Uzun süreli bir yerleşim ve çalışma vizesi olduğu için dosyanın hem işverenin kurumsal altyapısını hem de başvuranın mesleki yeterliliğini kanıtlaması gerekir. Başarılı bir çalışma vizesi dosyasında mutlaka yer alması gereken temel unsurlar şunlardır:',
        ],
        bullets: [
          'Kimlik ve Pasaport Bilgileri',
          'İş Sözleşmesi ve İşverenden Alınan Resmi Görevlendirme Belgeleri',
          'Diploma, Transkript ve Mesleki Denklik (Recognition) Belgeleri',
          'Özgeçmiş (CV) ve İş Tecrübesini Kanıtlayan Hizmet/SGK Dökümleri',
          'Dil Yeterlilik Sertifikaları (ilgili ülkenin zorunlu kıldığı mesleki dil seviyesi)',
          'Uluslararası Sağlık Sigortası ve Konaklama Planı',
        ],
      },
      {
        heading: 'Çalışma Vizesi Başvurusu Nasıl Yapılır?',
        paragraphs: [
          'Çalışma vizesi, turistik veya ticari vizelerden farklı olarak doğrudan uzun süreli ulusal (D tipi) vize kategorisinde değerlendirilir. Süreç genellikle iş teklifinin alınması ve hedef ülkedeki resmi kurumların (örneğin Çalışma Ajansı / Yabancılar Dairesi) ön onayıyla başlar.',
          'Ön onay alındıktan sonra başvuru süreci şu adımlarla ilerler:',
        ],
        steps: [
          'Hedef ülkenin konsolosluk sisteminden uzun süreli çalışma vizesi randevusunun alınması ve başvuru formunun doldurulması',
          'İş sözleşmesinin, diplomaların ve mesleki denklik belgelerinin eksiksiz olarak hazırlanması',
          'Randevu günü şahsen başvuru merkezine gidilerek biyometrik işlemlerin ve mülakatın tamamlanması',
          'Dosyanın hedef ülkedeki ilgili yerel makamlara gönderilerek nihai oturum ve çalışma izni onayının beklenmesi',
        ],
      },
      {
        heading: 'Çalışma Vizesi Başvuruları Nasıl Değerlendirilir?',
        paragraphs: [
          'Çalışma vizesi başvurularında öncelikle başvuru sahibinin ilgili ülkede yasal olarak çalışabilmek için gerekli şartları karşılayıp karşılamadığı değerlendirilir.',
          'İş teklifinin veya iş sözleşmesinin niteliği, işverenin durumu, başvuru sahibinin eğitim ve mesleki deneyimi, gerekli çalışma izinleri ve başvurunun diğer koşulları birlikte incelenebilir. Bazı ülkelerde işverenin, yabancı bir çalışan istihdam etmek için ayrıca belirli şartları yerine getirmesi veya ilgili makamdan onay alması gerekebilir.',
          'Başvuruda sunulan iş, meslek, maaş, çalışma süresi ve işveren bilgileri arasında tutarlılık bulunması önemlidir. Değerlendirme kriterleri ve gerekli izinler ülkeye ve çalışma kategorisine göre değişebileceğinden, başvurunun ilgili ülkenin güncel çalışma ve göç mevzuatına göre hazırlanması gerekir.',
        ],
      },
    ],
    cta: {
      title: 'Çalışma Vizesi Başvurunuzu Planlayın',
      text: 'İş sözleşmenizi, mesleki denklik belgelerinizi ve kariyer planınızı birlikte değerlendirerek çalışma vizesi başvurunuz için en doğru adımları atalım.',
      label: 'Çalışma Vizesi Başvurunuzu Planlayın',
    },
    faqTitle: 'Çalışma vizesi —',
  },
];

/** FAQ page_key used by the /vize-turleri landing page itself. */
export const VIZE_TURLERI_FAQ_KEY = 'vize-turleri';

/** Every page_key that the admin panel exposes an SSS editor for. */
export const VISA_FAQ_PAGE_KEYS: readonly string[] = [
  VIZE_TURLERI_FAQ_KEY,
  ...VISA_TYPES.map((t) => t.slug),
];

export function getVisaType(slug: string): VisaTypeContent | undefined {
  return VISA_TYPES.find((t) => t.slug === slug);
}

/**
 * Same as `getVisaType` but for call sites that pass a slug hardcoded in a
 * route file, where a miss is a build-time authoring error rather than a 404.
 */
export function getVisaTypeOrThrow(slug: string): VisaTypeContent {
  const type = getVisaType(slug);
  if (!type) throw new Error(`Bilinmeyen vize türü slug'ı: ${slug}`);
  return type;
}

export const SHORT_STAY_TYPES = VISA_TYPES.filter((t) => t.category === 'kisa');
export const LONG_STAY_TYPES = VISA_TYPES.filter((t) => t.category === 'uzun');

/**
 * Ülke sayfasındaki vize türü kartlarında yalnızca kısa süreli (Tip C) türler
 * gösterilir; uzun süreli (Tip D) vizeler /vize-turleri alt sayfalarında anlatılır.
 */
export function isShortStayType(slug: string | null | undefined): boolean {
  return !!slug && SHORT_STAY_TYPES.some((t) => t.slug === slug);
}

/** Landing-page hero bullet list. */
export const VIZE_TURLERI_HIGHLIGHTS = [
  'Doğru vize türünün belirlenmesi',
  'Kişisel durumunuza özel stratejik dosya analizi',
  'Başvurunun tüm aşamalarında planlı süreç yönetimi',
  'Süreç boyunca ulaşabileceğiniz uzman desteği',
];

/** "Vize Başvurusu Nasıl Yapılır?" block on the landing page. */
export const VIZE_BASVURU_OZET =
  'Vize başvurusu; seyahat veya yerleşim amacının belirlenmesi, başvuru koşullarının incelenmesi ve kişisel durumunuza uygun bir dosyanın hazırlanmasıyla başlar. Başvuru formu ve destekleyici belgeler hazırlandıktan sonra randevu ve gerekli biyometrik işlemler tamamlanır. Dosya ilgili makama sunulduktan sonra değerlendirme süreci başlar; gerekli görülmesi halinde ek belge veya mülakat talep edilebilir.';

/**
 * Ülke sayfasındaki vize türü kartlarında katalog bağlantısı seçilmemiş
 * kayıtlar için ikon üretir. Karta yalnızca ikon eklenir; rozet ve link
 * yine sadece gerçek katalog eşleşmesinden gelir.
 */
const ICON_KEYWORDS: ReadonlyArray<[readonly string[], string]> = [
  [['transit', 'aktarma'], '🔄'],
  [['fuar', 'konferans', 'etkinlik', 'kültür', 'sanat', 'spor', 'sempozyum'], '🎤'],
  [['aile birleşimi', 'birleşim'], '🏠'],
  [['aile', 'arkadaş', 'akraba', 'ziyaret', 'davet'], '👨‍👩‍👧'],
  [['ticari', 'iş ', 'işadamı', 'business', 'toplantı'], '💼'],
  [['öğrenci', 'eğitim', 'dil ', 'okul', 'staj'], '🎓'],
  [['çalışma', 'işçi', 'work'], '🛠️'],
  [['turistik', 'turist', 'tatil', 'gezi', 'seyahat'], '🏖️'],
];

/** Hiçbir anahtar kelime eşleşmediğinde kullanılan genel vize ikonu. */
export const FALLBACK_VISA_TYPE_ICON = '🛂';

export function guessVisaTypeIcon(title: string): string {
  const t = title.toLocaleLowerCase('tr');
  for (const [keywords, icon] of ICON_KEYWORDS) {
    if (keywords.some((k) => t.includes(k))) return icon;
  }
  return FALLBACK_VISA_TYPE_ICON;
}
