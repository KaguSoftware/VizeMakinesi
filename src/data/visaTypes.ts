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
  /** Optional bulleted document list rendered under the paragraphs. */
  bullets?: string[];
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
      'Turistik vize başvurunuzda hangi koşulların, belgelerin ve değerlendirme kriterlerinin belirleyici olduğunu öğrenin.',
    sections: [
      {
        heading: 'Turistik Vize Nedir ve Kimler Başvurabilir?',
        paragraphs: [
          'Turistik vize; tatil, gezi, kültürel keşif ve kısa süreli bireysel seyahatler amacıyla başka bir ülkeye gitmek isteyen kişilerin başvurduğu vize türüdür. Turistik vizeye; tatil veya bireysel seyahat planlayanların yanı sıra organize tur programlarına katılacak, arkadaşlarını veya yakınlarını ziyaret edecek ya da kültürel, sanatsal ve sportif etkinlikleri izleyici olarak takip edecek kişiler de başvurabilir.',
        ],
      },
      {
        heading: 'Turistik Vize İçin Gerekli Belgeler',
        isDocuments: true,
        paragraphs: [
          'Turistik vize başvurularında istenen belgeler; başvurulan ülkeye ve başvuru sahibinin kişisel durumuna göre değişebilir. Ancak başvurunun temelini oluşturan belgeler genellikle kimlik ve pasaport bilgilerini, seyahat planını, konaklama düzenlemelerini ve seyahatin finansal olarak karşılanabileceğini gösteren evrakları kapsar.',
          'Başvuru sahibinin çalışma, eğitim, şirket, sponsorluk veya aile durumuna ilişkin belgeler de kişisel koşullara bağlı olarak dosyaya eklenebilir. Hazırlanacak belgelerin başvuru formundaki bilgilerle ve seyahat planıyla birbiriyle uyumlu olması önemlidir.',
        ],
      },
      {
        heading: 'Turistik Vize Başvurusu Nasıl Yapılır?',
        paragraphs: [
          'Turistik vize başvurusu, seyahat planının belirlenmesi ve başvurulacak ülkenin güncel vize koşullarının kontrol edilmesiyle başlar. Ardından başvuru için gerekli belgeler hazırlanır ve ilgili ülkenin belirlediği başvuru kanalı üzerinden başvuru gerçekleştirilir.',
          'Başvuru formunun doldurulması, gerekli ücretin ödenmesi ve başvuru türüne göre randevu alınarak biyometrik işlemlerin tamamlanması gerekebilir. Bazı ülkelerde başvuru ve belge teslimi tamamen veya kısmen çevrim içi yürütülebilir.',
          'Başvuru tamamlandıktan sonra dosya ilgili makam tarafından incelenir. Gerekli görülmesi halinde başvuru sahibinden ek belge, bilgi veya mülakat talep edilebilir. Değerlendirme tamamlandığında başvuru sonucu bildirilir.',
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
      'Ticari vize başvurunuzda hangi koşulların, belgelerin ve değerlendirme kriterlerinin belirleyici olduğunu öğrenin.',
    sections: [
      {
        heading: 'Ticari Vize Nedir ve Kimler Başvurabilir?',
        paragraphs: [
          'Ticari vize; iş görüşmeleri, şirket ziyaretleri, toplantılar, fuarlar, konferanslar ve iş bağlantıları kurmaya yönelik kısa süreli seyahatler amacıyla başka bir ülkeye gitmek isteyen kişilerin başvurduğu vize türüdür. Ticari vizeye, planlanan iş faaliyetini destekleyen bilgi ve belgelere sahip olan kişiler başvurabilir.',
        ],
      },
      {
        heading: 'Ticari Vize İçin Gerekli Belgeler',
        isDocuments: true,
        paragraphs: [
          'Ticari vize başvurularında istenen belgeler; başvurulan ülkeye, başvuru sahibinin mesleki durumuna ve planlanan ticari faaliyetin niteliğine göre değişebilir. Başvurunun temelini, kimlik ve pasaport bilgileriyle birlikte seyahatin amacını ve ticari niteliğini gösteren belgeler oluşturur.',
          'Başvuruya göre iş görüşmesi, şirket ziyareti, fuar veya konferans gibi planlanan faaliyeti destekleyen davet, kayıt veya organizasyon belgeleri; başvuru sahibinin çalıştığını veya ticari faaliyet yürüttüğünü gösteren mesleki belgeler ve seyahat masraflarının nasıl karşılanacağını gösteren finansal belgeler talep edilebilir.',
          'Hazırlanan belgelerin başvuru formundaki bilgilerle, seyahat planıyla ve başvurunun ticari amacıyla birbiriyle uyumlu olması önemlidir.',
        ],
      },
      {
        heading: 'Ticari Vize Başvurusu Nasıl Yapılır?',
        paragraphs: [
          'Ticari vize başvurusu, planlanan iş seyahatinin ve başvuru koşullarının belirlenmesiyle başlar. Ardından seyahatin amacını ve ticari faaliyetleri destekleyen belgeler hazırlanır ve başvurulan ülkenin belirlediği başvuru kanalı üzerinden başvuru gerçekleştirilir.',
          'Başvuru formunun doldurulması, gerekli ücretin ödenmesi ve başvuru türüne göre randevu alınarak biyometrik işlemlerin tamamlanması gerekebilir. Bazı ülkelerde başvuru ve belge teslimi tamamen veya kısmen çevrim içi yürütülebilir.',
          'Başvuru tamamlandıktan sonra dosya ilgili makam tarafından incelenir. Gerekli görülmesi halinde başvuru sahibinden ek belge, bilgi veya mülakat talep edilebilir. Değerlendirme tamamlandığında başvuru sonucu bildirilir.',
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
      text: 'İş seyahatinizin amacını, ticari bağlantılarınızı ve başvuru koşullarınızı birlikte değerlendirerek dosyanız için izlemeniz gereken yolu belirleyelim.',
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
      'Aile ziyareti vize başvurunuzda hangi koşulların, belgelerin ve değerlendirme kriterlerinin önemli olduğunu öğrenin.',
    sections: [
      {
        heading: 'Aile Ziyareti Vizesi Nedir ve Kimler Başvurabilir?',
        paragraphs: [
          'Aile ziyareti vizesi; yurt dışında yaşayan aile bireylerini veya yakınlarını kısa süreli olarak ziyaret etmek isteyen kişilerin başvurduğu vize türüdür. Ziyaretin amacı, süresi ve başvuru sahibinin ziyaret edeceği kişiyle olan ilişkisi başvurunun değerlendirilmesinde dikkate alınabilir.',
          'Aile ziyareti vizesine; eşini, çocuklarını, anne veya babasını, kardeşlerini ya da diğer yakınlarını kısa süreli ziyaret etmek isteyen kişiler başvurabilir. Ziyaretin niteliğine göre davet eden kişinin ülkedeki yasal statüsünü ve başvuru sahibiyle olan ilişkisini gösteren belgeler de talep edilebilir.',
        ],
      },
      {
        heading: 'Aile Ziyareti Vizesi İçin Gerekli Belgeler',
        isDocuments: true,
        paragraphs: [
          'Aile ziyareti vize başvurularında istenen belgeler; başvurulan ülkeye, ziyaret edilecek kişinin statüsüne ve başvuru sahibinin kişisel durumuna göre değişebilir. Başvurunun temelini kimlik ve pasaport belgeleri, seyahat planı, konaklama düzenlemeleri ve seyahatin finansal olarak karşılanabileceğini gösteren belgeler oluşturur.',
          'Aile ziyaretinin amacını desteklemek için davet mektubu, ziyaret edilecek kişinin kimlik veya oturum durumunu gösteren belgeler ve başvuru sahibiyle arasındaki aile bağını ortaya koyan resmi belgeler talep edilebilir.',
          'Başvuru sahibinin çalışma, eğitim, şirket veya sponsorluk durumuna ilişkin belgeler de kişisel koşullara ve başvurulan ülkenin uygulamalarına göre dosyaya eklenebilir. Sunulan belgelerin başvuru formundaki bilgilerle, seyahat planıyla ve ziyaretin amacıyla birbiriyle uyumlu olması önemlidir.',
        ],
      },
      {
        heading: 'Aile Ziyareti Vizesi Başvurusu Nasıl Yapılır?',
        paragraphs: [
          'Aile ziyareti vize başvurusu, ziyaretin amacı ve başvuru koşullarının belirlenmesiyle başlar. Ardından başvuru sahibinin ve ziyaret edilecek kişinin durumunu destekleyen belgeler hazırlanır ve başvurulan ülkenin belirlediği başvuru kanalı üzerinden başvuru gerçekleştirilir.',
          'Başvuru formunun doldurulması, gerekli ücretin ödenmesi ve başvuru türüne göre randevu alınarak biyometrik işlemlerin tamamlanması gerekebilir. Bazı ülkelerde başvuru ve belge teslimi tamamen veya kısmen çevrim içi yürütülebilir.',
          'Başvuru tamamlandıktan sonra dosya ilgili makam tarafından incelenir. Gerekli görülmesi halinde başvuru sahibinden veya davet eden kişiden ek belge, bilgi ya da mülakat talep edilebilir.',
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
      text: 'Ziyaretinizin amacını, aile bağınızı ve başvuru koşullarınızı birlikte değerlendirerek dosyanız için izlemeniz gereken yolu belirleyelim.',
      label: 'Aile Ziyareti Başvurunuzu Planlayın',
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
      'Transit vize başvurunuzda hangi durumlarda vize gerektiğini, hangi koşulların ve belgelerin önemli olduğunu öğrenin.',
    sections: [
      {
        heading: 'Transit Vize Nedir ve Kimler Başvurabilir?',
        paragraphs: [
          'Transit vize; bir ülkeye asıl seyahat noktası olarak gitmeden, başka bir ülkeye ulaşmak amacıyla transit geçiş yapan yolcular için düzenlenen vize türüdür. Transit geçiş, havalimanında aktarma yapılması veya belirli durumlarda bir ülkenin topraklarından kısa süreli geçilmesi şeklinde gerçekleşebilir.',
          'Transit vize gerekip gerekmediği; seyahat güzergâhına, aktarma yapılan ülkeye, yolcunun vatandaşlığına ve transit sırasında ülkeye giriş yapılıp yapılmadığına göre değişebilir. Özellikle havalimanlarında uluslararası transit alanından ayrılmadan yapılan aktarmalar ile ülkeye giriş gerektiren aktarmalar aynı şekilde değerlendirilmez.',
          'Schengen ülkelerinde havalimanı transit vizesi, uluslararası transit alanından ayrılmadan başka bir ülkeye devam edilen belirli aktarmalarda uygulanır. Havalimanı transit vizesi, kural olarak Schengen bölgesine giriş hakkı vermez.',
        ],
      },
      {
        heading: 'Transit Vize İçin Gerekli Belgeler',
        isDocuments: true,
        paragraphs: [
          'Transit vize başvurularında istenen belgeler; aktarma yapılan ülkeye, seyahat güzergâhına ve başvuru sahibinin durumuna göre değişebilir. Başvurunun temelini genellikle geçerli pasaport, seyahat güzergâhını gösteren belgeler ve gidilecek ülkeye devam edileceğini gösteren seyahat belgeleri oluşturur.',
          'Başvurunun niteliğine göre aşağıdaki belgeler talep edilebilir:',
        ],
        bullets: [
          'Geçerli pasaport ve kimlik bilgilerini gösteren belgeler',
          'Uçuş veya ulaşım rezervasyonları',
          'Transit geçiş yapılacak ülkeye ilişkin seyahat bilgileri',
          'Nihai varış ülkesine giriş hakkını gösteren vize veya izin',
          'Gerekli durumlarda konaklama ve finansal durumu gösteren belgeler',
          'Seyahatin amacını veya transit geçişin koşullarını destekleyen ek belgeler',
        ],
      },
      {
        heading: 'Transit Vize Başvurusu Nasıl Yapılır?',
        paragraphs: [
          'Transit vize başvurusu, seyahat güzergâhının ve transit geçiş yapılacak ülkenin vize koşullarının belirlenmesiyle başlar. Öncelikle aktarma sırasında ülkeye giriş yapılıp yapılmayacağı ve başvuru sahibinin vatandaşlığı açısından transit vize gerekip gerekmediği kontrol edilir.',
          'Gerekli olması halinde başvuru formu ve destekleyici belgeler hazırlanarak ilgili konsolosluk veya yetkilendirilmiş başvuru kanalı üzerinden başvuru yapılır. Başvuru türüne göre randevu alınması ve biyometrik işlemlerin tamamlanması gerekebilir.',
          'Başvuru sırasında seyahat güzergâhının, aktarma noktalarının ve nihai varış ülkesine ilişkin bilgilerin birbiriyle uyumlu şekilde sunulması önemlidir.',
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
      text: 'Seyahat güzergâhınızı ve aktarma koşullarınızı birlikte değerlendirerek transit vize gerekliliğinizi ve izlemeniz gereken yolu belirleyelim.',
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
      'Fuar, konferans veya kültürel etkinlik katılımınız için hangi koşulların, belgelerin ve değerlendirme kriterlerinin önemli olduğunu öğrenin.',
    sections: [
      {
        heading: 'Fuar, Kültürel Etkinlik ve Konferans Vizesi Nedir ve Kimler Başvurabilir?',
        paragraphs: [
          'Fuar, kültürel etkinlik ve konferans vizesi; yurt dışında düzenlenen fuar, konferans, kongre, seminer, kültürel veya benzeri etkinliklere kısa süreli olarak katılmak isteyen kişilerin başvurduğu vize türüdür.',
          'Bu kapsamda fuarları ziyaret edecek veya katılımcı olarak yer alacak kişiler, konferans ve kongrelere katılacak profesyoneller, kültürel etkinlikleri takip edecek kişiler ve etkinliğin niteliğine göre sanat veya spor organizasyonlarına katılacak kişiler başvurabilir.',
          'Başvurunun niteliği, katılım şekli ve etkinliğin amacı; sunulması gereken belgeleri ve başvurunun değerlendirilmesini etkileyebilir.',
        ],
      },
      {
        heading: 'Fuar, Kültürel Etkinlik ve Konferans Vizesi İçin Gerekli Belgeler',
        isDocuments: true,
        paragraphs: [
          'Bu tür vize başvurularında gerekli belgeler; etkinliğin niteliğine, başvurulan ülkeye ve başvuru sahibinin etkinliğe katılım şekline göre değişebilir. Başvurunun temelini genellikle kimlik ve pasaport belgeleri, seyahat planı ve seyahatin finansal olarak karşılanabileceğini gösteren belgeler oluşturur.',
          'Etkinliğin amacını ve katılımı desteklemek için aşağıdaki belgelerden biri veya birkaçı talep edilebilir:',
        ],
        bullets: [
          'Etkinlik organizatöründen davet veya katılım yazısı',
          'Fuar, konferans veya kongre kayıt belgesi',
          'Giriş bileti veya katılımcı kartı',
          'Etkinlik programı ve etkinliğin tarihlerini gösteren belgeler',
          'Stant, katılımcılık veya organizasyona ilişkin sözleşme ve belgeler',
          'Etkinliğe ilişkin profesyonel veya kurumsal bağlantıyı gösteren belgeler',
        ],
      },
      {
        heading: 'Fuar, Kültürel Etkinlik ve Konferans Vizesi Başvurusu Nasıl Yapılır?',
        paragraphs: [
          'Başvuru, öncelikle katılacağınız etkinliğin ve seyahat amacının belirlenmesiyle başlar. Etkinliğin tarihleri, düzenlendiği yer, katılım şekliniz ve seyahat süresi belirlendikten sonra başvuru için gerekli belgeler hazırlanır.',
          'Başvuru formu ve destekleyici belgeler, başvurulan ülkenin belirlediği konsolosluk veya yetkilendirilmiş başvuru kanalı üzerinden sunulur. Başvuru türüne göre randevu alınması ve biyometrik işlemlerin tamamlanması gerekebilir.',
          'Başvuruda etkinlik bilgileri, seyahat planı, konaklama ve finansal duruma ilişkin bilgilerin birbiriyle uyumlu olması önemlidir.',
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
      title: 'Etkinlik Vize Başvurunuzu Planlayın',
      text: 'Katılacağınız etkinliği, katılım şeklinizi ve başvuru koşullarınızı birlikte değerlendirerek dosyanız için izlemeniz gereken yolu belirleyelim.',
      label: 'Etkinlik Vize Başvurunuzu Planlayın',
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
      'Aile birleşimi vizesi başvurunuzda hangi koşulların, belgelerin ve değerlendirme kriterlerinin önemli olduğunu öğrenin.',
    sections: [
      {
        heading: 'Aile Birleşimi Vizesi Nedir ve Kimler Başvurabilir?',
        paragraphs: [
          'Aile birleşimi vizesi; başka bir ülkede yasal olarak yaşayan aile bireyinin yanına uzun süreli olarak yerleşmek isteyen kişilerin başvurduğu vize türüdür. Başvurunun amacı, aile bireylerinin aynı ülkede birlikte yaşayabilmesini sağlamaktır.',
          'Aile birleşimi kapsamında başvuru yapabilecek kişiler ve başvurunun şartları, gidilecek ülkenin göç mevzuatına ve aile bireyleri arasındaki hukuki ilişkiye göre değişebilir. Eşler, çocuklar ve bazı durumlarda diğer aile bireyleri için farklı koşullar uygulanabilir.',
          'Başvuru sahibinin aile ilişkisini, aile birleşimi hakkının bulunduğunu ve ilgili ülkenin uzun süreli yerleşim şartlarını karşıladığını gösteren belgeler talep edilebilir.',
        ],
      },
      {
        heading: 'Aile Birleşimi Vizesi İçin Gerekli Belgeler',
        isDocuments: true,
        paragraphs: [
          'Aile birleşimi başvurularında gerekli belgeler; başvurulan ülkeye, başvuru sahibinin aile ilişkisine ve ülkede yaşayan aile bireyinin statüsüne göre değişiklik gösterebilir.',
          'Başvurularda genellikle aşağıdaki belge grupları talep edilir:',
        ],
        bullets: [
          'Geçerli pasaport ve kimlik belgeleri',
          'Evlilik veya aile bağını gösteren resmi belgeler',
          'Başvuru sahibinin ve aile bireyinin kişisel durumunu gösteren belgeler',
          'Ülkede yaşayan aile bireyinin oturum veya vatandaşlık durumunu gösteren belgeler',
          'Konut ve yaşam koşullarına ilişkin belgeler',
          'Gelir veya finansal yeterliliği gösteren belgeler',
          'Gerekli durumlarda sağlık sigortası ve diğer destekleyici belgeler',
        ],
      },
      {
        heading: 'Aile Birleşimi Vizesi Başvurusu Nasıl Yapılır?',
        paragraphs: [
          'Aile birleşimi başvurusu, öncelikle başvuru sahibinin ve yurt dışında yaşayan aile bireyinin aile birleşimi şartlarını karşılayıp karşılamadığının belirlenmesiyle başlar.',
          'Gerekli belgeler hazırlandıktan sonra başvuru, ilgili ülkenin belirlediği konsolosluk, büyükelçilik veya yetkilendirilmiş başvuru kanalı üzerinden yapılır. Başvuru türüne göre randevu, biyometrik işlemler, mülakat veya ek belge sunulması gerekebilir.',
          'Bazı ülkelerde aile birleşimi sürecinin bir bölümü, başvuru sahibinin bulunduğu ülkeden değil, aile bireyinin yaşadığı ülkedeki göç makamları tarafından yürütülebilir. Bu nedenle başvuru sürecinin yalnızca vize başvurusu olarak değil, ilgili ülkenin aile birleşimi prosedürünün tamamı olarak değerlendirilmesi gerekir.',
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
      title: 'Aile Birleşimi Sürecinizi Planlayın',
      text: 'Aile ilişkinizi, yurt dışındaki aile bireyinizin statüsünü ve başvuru koşullarınızı değerlendirerek aile birleşimi sürecinizi doğru adımlarla planlayalım.',
      label: 'Vize Başvurunuzu Planlayın',
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
      'Yurt dışında eğitim alacak öğrenciler için hangi koşulların, belgelerin ve başvuru adımlarının önemli olduğunu öğrenin.',
    sections: [
      {
        heading: 'Öğrenci Vizesi Nedir ve Kimler Başvurabilir?',
        paragraphs: [
          'Öğrenci vizesi; yurt dışında eğitim almak, akademik bir programa katılmak veya belirli süreli bir eğitim programında bulunmak isteyen kişilerin başvurduğu uzun süreli vize türüdür.',
          'Öğrenci vizesine üniversite, yüksek lisans veya doktora programlarına kabul edilen öğrencilerin yanı sıra, ülkenin uygulamalarına bağlı olarak dil eğitimi, mesleki eğitim veya diğer uzun süreli eğitim programlarına katılacak kişiler de başvurabilir.',
          'Başvurunun yapılabilmesi için genellikle eğitim kurumundan alınmış resmi bir kabul veya kayıt belgesinin bulunması gerekir. Vize şartları; eğitimin türüne, süresine ve başvurulan ülkenin eğitim ve göç mevzuatına göre değişebilir.',
        ],
      },
      {
        heading: 'Öğrenci Vizesi İçin Gerekli Belgeler',
        isDocuments: true,
        paragraphs: [
          'Öğrenci vizesi başvurularında talep edilen belgeler; eğitim programına, başvurulan ülkeye ve öğrencinin kişisel durumuna göre değişiklik gösterebilir.',
          'Başvurularda genellikle aşağıdaki belge grupları talep edilir:',
        ],
        bullets: [
          'Geçerli pasaport ve kimlik belgeleri',
          'Eğitim kurumundan alınmış kabul veya kayıt belgesi',
          'Eğitim programının süresini ve niteliğini gösteren belgeler',
          'Eğitim ve yaşam giderlerinin karşılanabileceğini gösteren finansal belgeler',
          'Konaklama bilgileri',
          'Gerekli durumlarda sağlık sigortası',
          'Eğitim geçmişini gösteren diploma, transkript veya benzeri belgeler',
          'Başvuru formu ve gerekli diğer başvuru belgeleri',
        ],
      },
      {
        heading: 'Öğrenci Vizesi Başvurusu Nasıl Yapılır?',
        paragraphs: [
          'Öğrenci vizesi başvurusu, öncelikle eğitim kurumundan kabul veya kayıt alınmasıyla başlar. Eğitim programının başlangıç tarihi, süresi ve eğitim koşulları belirlendikten sonra başvuru için gerekli belgeler hazırlanır.',
          'Başvuru formu ve destekleyici belgeler, başvurulan ülkenin belirlediği konsolosluk, büyükelçilik veya yetkilendirilmiş başvuru kanalı üzerinden sunulur. Başvuru türüne göre randevu, biyometrik işlemler, mülakat veya ek belge sunulması gerekebilir.',
          'Başvurunun eğitim başlangıç tarihinden önce sonuçlanabilmesi için randevu ve işlem sürelerinin önceden dikkate alınması önemlidir.',
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
      title: 'Eğitiminiz İçin Vize Sürecinizi Planlayın',
      text: 'Eğitim programınızı, başvuru koşullarınızı ve gerekli belgeleri değerlendirerek öğrenci vize sürecinizi doğru adımlarla planlayalım.',
      label: 'Vize Başvurunuzu Planlayın',
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
      'Yurt dışında çalışmak için vize başvurunuzda hangi koşulların, belgelerin ve başvuru adımlarının önemli olduğunu öğrenin.',
    sections: [
      {
        heading: 'Çalışma Vizesi Nedir ve Kimler Başvurabilir?',
        paragraphs: [
          'Çalışma vizesi; başka bir ülkede yasal olarak çalışmak isteyen kişilerin, ilgili ülkenin çalışma ve göç mevzuatı kapsamında başvurduğu vize türüdür.',
          'Çalışma vizesine, yurt dışında bir işverenden iş teklifi veya iş sözleşmesi alan kişiler başta olmak üzere, ülkenin uygulamalarına göre belirli mesleki veya nitelikli çalışma programlarına kabul edilen kişiler başvurabilir.',
          'Çalışma vizesinin şartları; yapılacak işin niteliğine, işverenin durumuna, başvuru sahibinin mesleki yeterliliklerine, çalışma süresine ve başvurulan ülkenin göç mevzuatına göre değişiklik gösterebilir.',
          'Bazı ülkelerde vize başvurusundan önce işverenin çalışma izni, işgücü onayı veya benzeri bir prosedürü tamamlaması gerekebilir.',
        ],
      },
      {
        heading: 'Çalışma Vizesi İçin Gerekli Belgeler',
        isDocuments: true,
        paragraphs: [
          'Çalışma vizesi başvurularında talep edilen belgeler; çalışılacak ülkeye, mesleğe, işverenin durumuna ve çalışma programının niteliğine göre değişebilir.',
          'Başvurularda genellikle aşağıdaki belge grupları talep edilir:',
        ],
        bullets: [
          'Geçerli pasaport ve kimlik belgeleri',
          'İş sözleşmesi veya resmi iş teklifi',
          'İşveren tarafından sağlanan çalışma veya istihdam belgeleri',
          'Çalışma izni, onay veya ilgili makam tarafından verilen izin belgesi',
          'Eğitim ve mesleki yeterlilik belgeleri',
          'Özgeçmiş ve çalışma deneyimini gösteren belgeler',
          'Gerekli durumlarda dil yeterliliğini gösteren belgeler',
          'Gerekli durumlarda sağlık sigortası ve sağlık raporları',
          'Başvuru formu ve diğer destekleyici belgeler',
        ],
      },
      {
        heading: 'Çalışma Vizesi Başvurusu Nasıl Yapılır?',
        paragraphs: [
          'Çalışma vizesi başvurusu, öncelikle başvuru sahibinin ilgili ülkede çalışmasını sağlayacak iş veya çalışma programının belirlenmesiyle başlar.',
          'İş teklifi veya iş sözleşmesi alındıktan sonra, çalışılacak ülkenin mevzuatına göre işveren tarafından çalışma izni, istihdam onayı veya benzeri bir prosedürün tamamlanması gerekebilir.',
          'Gerekli izin ve belgeler hazırlandıktan sonra vize başvurusu, ilgili konsolosluk, büyükelçilik veya yetkilendirilmiş başvuru kanalı üzerinden yapılır. Başvuru türüne göre randevu, biyometrik işlemler, mülakat veya ek belge sunulması gerekebilir.',
          'Başvurunun, iş sözleşmesi, çalışma izni ve diğer destekleyici belgelerde yer alan bilgilerle tutarlı şekilde hazırlanması önemlidir.',
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
      title: 'Çalışma Vize Sürecinizi Planlayın',
      text: 'İş teklifinizi, çalışma koşullarınızı ve kişisel durumunuzu değerlendirerek çalışma vize süreciniz için gerekli adımları birlikte planlayalım.',
      label: 'Vize Başvurunuzu Planlayın',
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
