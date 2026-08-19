/**
 * /blog/schengen-vize-alma-rehberi sayfasının içeriği.
 *
 * Sayfa, rehber dokümanındaki dört ana yazıyı tek bir sayfada, her biri kendi
 * bölümü olacak şekilde taşır (dokümandaki kırmızı başlıklar = bölüm başlıkları).
 * İçerik `blog_schengen_page` tablosundan (id = 1) gelir; tablo veya alan boşsa
 * buradaki varsayılanlar kullanılır — sayfa hiçbir durumda boş kalmaz.
 *
 * Yönetim: /admin/blog/schengen
 */

/** Bölüm içindeki alt başlık — dokümandaki kalın ara başlıklara karşılık gelir. */
export interface BlogSubsection {
  heading: string;
  /** Ret kararında yer alan Türkçe ifade (yalnızca "Ret Maddeleri" bölümünde). */
  quote: string;
  /** Aynı ifadenin İngilizce orijinali. */
  quote_en: string;
  paragraphs: string[];
  bullets: string[];
}

/** Dokümandaki kırmızı başlıklardan biri — sayfadaki bir ana bölüm. */
export interface BlogSection {
  /** Bölümün üstündeki küçük etiket, örn. "Ret gerekçeleri". */
  kicker: string;
  title: string;
  /** Alt başlıklardan önce gelen giriş paragrafları. */
  intro: string[];
  subsections: BlogSubsection[];
}

export interface BlogSchengenContent {
  hero_kicker: string;
  hero_title: string;
  /** Başlığın italik/coral görünen ikinci yarısı. */
  hero_title_em: string;
  hero_excerpt: string;
  sections: BlogSection[];
}

/** Alt başlık üretici — opsiyonel alanları doldurur. */
function sub(
  heading: string,
  paragraphs: string[],
  extra: { quote?: string; quote_en?: string; bullets?: string[] } = {}
): BlogSubsection {
  return {
    heading,
    quote: extra.quote ?? '',
    quote_en: extra.quote_en ?? '',
    paragraphs,
    bullets: extra.bullets ?? [],
  };
}

export const BLOG_SCHENGEN_DEFAULTS: BlogSchengenContent = {
  hero_kicker: 'Başvuru rehberi',
  hero_title: 'Schengen vizesi',
  hero_title_em: ' rehberi',
  hero_excerpt:
    'Ret nedenlerinden ret maddelerinin ne anlama geldiğine, ret sonrası izlenecek yoldan ilk başvurunun adımlarına kadar Schengen sürecinin tamamı tek sayfada.',

  sections: [
    // ── 01 ────────────────────────────────────────────────────────────────────
    {
      kicker: 'Ret gerekçeleri',
      title: 'Schengen Vize Reddi Nedenleri',
      intro: [
        'Schengen vizesi reddedildiğinde çoğu kişinin ilk düşündüğü şey aynıdır: “Acaba hangi belgeyi eksik verdim?”',
        'Oysa bir Schengen başvurusunda belgelerin büsbütün sunulmuş olması yeterli değildir. Konsolosluk; seyahatinizin amacını ve koşullarını, maddi durumunuzu ve seyahat sonunda Schengen bölgesinden ayrılacağınızı gösteren koşulları birlikte değerlendirir.',
        'Bu nedenle gerekli belgelerin tamamı sunulmuş olsa bile bir başvuru reddedilebilir. Sorun, başvurunun genelinde ortaya çıkan soru işaretlerinde veya belgelerin birlikte oluşturduğu tabloda olabilir.',
        'Schengen vize retleri belirli gerekçelere dayanır. Ancak ret formunda yer alan birkaç kelimelik bir gerekçe, başvurunun neden olumsuz değerlendirildiğini her zaman tek başına açıklamaz. Bunu anlamak için başvurunun bütününe ve konsolosluğun değerlendirdiği temel unsurlara bakmak gerekir.',
        'Bu bölümde Schengen vizesinin hangi durumlarda reddedilebileceğini ve bir başvurunun hangi noktalarının soru işareti oluşturabileceğini ele alıyoruz.',
      ],
      subsections: [
        sub('1. Seyahat Amacının Yeterince Açıklanamaması', [
          'Schengen vize başvurularında başvuru sahibinin neden seyahat etmek istediğinin açık ve anlaşılır olması gerekir. Turistik gezi, aile ziyareti veya iş seyahati gibi bir amaç belirtilmesi tek başına yeterli olmayabilir; bu amacın planlanan seyahatle uyumlu olması beklenir.',
          'Örneğin 10 günlük bir Avrupa seyahati planlayan bir başvuru sahibinin seyahat rotası, konaklama bilgileri ve ulaşım planı gerçekçi olmalıdır. Birden fazla ülkeyi kapsayan bir seyahat planlanıyorsa, ülkeler arasındaki geçişlerin ve kalış sürelerinin de bu planla uyumlu olması gerekir.',
          'Benzer şekilde, aile ziyareti amacıyla yapılan bir başvuruda yalnızca davet mektubu sunulması yeterli olmayabilir. Ziyaretin amacı, kalınacak süre ve başvuruda sunulan diğer bilgiler birlikte değerlendirilir.',
          'Burada önemli olan, seyahati gereğinden fazla ayrıntılandırmak değil; seyahatin nedenini, süresini ve koşullarını anlaşılır bir şekilde ortaya koymaktır.',
        ]),
        sub('2. Seyahat Planının Gerçekçi Bulunmaması', [
          'Seyahat amacının açık olması kadar, hazırlanan seyahat planının da gerçekçi ve uygulanabilir olması önemlidir. Ziyaret edilecek ülkeler, kalış süreleri, konaklamalar ve ulaşım planı birbiriyle uyumlu olmalıdır.',
          'Örneğin kısa süreli bir seyahatte çok sayıda ülke ve şehir ziyaret etmeyi planlamak, bu rotanın nasıl gerçekleştirileceğinin açıklanmasını gerektirebilir. Benzer şekilde, konaklama bilgileri ile seyahat tarihleri arasında uyumsuzluk bulunması veya planlanan ulaşımın seyahat programıyla örtüşmemesi başvuruda soru işaretleri oluşturabilir.',
          'Burada amaç, başvuru dosyasına mümkün olduğunca ayrıntılı bir program eklemek değildir. Önemli olan, sunulan seyahat planının kendi içinde tutarlı ve makul olmasıdır.',
        ]),
        sub('3. Yeterli Maddi İmkânın Gösterilememesi', [
          'Schengen vize başvurularında, planlanan seyahatin masraflarının nasıl karşılanacağı da değerlendirilir. Bu değerlendirmede yalnızca banka hesabındaki mevcut bakiye değil, düzenli gelir, çalışma durumu, hesap hareketleri ve maddi kaynakların genel yapısı gibi unsurlar da dikkate alınabilir.',
          'Örneğin kısa süreli bir Avrupa seyahati öncesinde hesapta yüksek miktarda para bulunması tek başına yeterli olmayabilir. Bu tutarın kaynağının ve başvuru sahibinin genel finansal durumu ile nasıl ilişkilendirildiğinin anlaşılır olması önemlidir.',
          'Seyahat masrafları başka biri tarafından karşılanıyorsa, sponsorun bu masrafları karşılayabilecek durumda olması ve sponsorluğun başvuruda açık şekilde ortaya konulması da önem taşır.',
          'Kısacası burada yalnızca “Hesabımda yeterli para var mı?” sorusu değil, sunulan finansal durumun planlanan seyahati makul şekilde destekleyip desteklemediği önemlidir.',
        ]),
        sub('4. Seyahat Sonunda Schengen Bölgesinden Ayrılacağınız Konusunda Yeterli Kanaat Oluşmaması', [
          'Schengen vizesi kısa süreli seyahatler için verildiğinden, başvuru sahibinin vize süresi sona ermeden Schengen bölgesinden ayrılacağına ilişkin yeterli kanaatin oluşması gerekir.',
          'Bu değerlendirmede çalışma durumu, devam eden eğitim, ailevi ve ekonomik koşullar, ülkedeki mevcut yaşam düzeni ve önceki seyahat geçmişi gibi farklı unsurlar dikkate alınabilir.',
          'Örneğin düzenli bir işte çalışan ve seyahat tarihleri için izin almış bir başvuru sahibinin mevcut çalışma düzeni, seyahat sonunda ülkesine dönmesini destekleyen unsurlardan biri olabilir. Benzer şekilde devam eden bir eğitim veya ülkedeki mevcut yaşam düzeni de değerlendirmede dikkate alınabilir.',
          'Burada tek bir belgenin varlığı belirleyici olmak zorunda değildir. Önemli olan, başvuru sahibinin mevcut koşulları ile planlanan kısa süreli seyahatin birbiriyle uyumlu olmasıdır.',
        ]),
        sub('5. Sunulan Bilgi ve Belgelerin Güvenilir Bulunması', [
          'Schengen vize başvurularında sunulan bilgilerin doğru, tutarlı ve gerçeği yansıtması beklenir. Başvuru formunda verilen bilgiler ile sunulan belgeler arasında açıklanamayan farklılıklar bulunması, başvurunun güvenilirliği konusunda soru işaretleri oluşturabilir.',
          'Örneğin başvuru formunda belirtilen çalışma durumu, gelir bilgileri veya seyahat amacı ile resmi belgelerde yer alan bilgilerin birbiriyle örtüşmemesi, başvurunun daha ayrıntılı değerlendirilmesine neden olabilir.',
          'Benzer şekilde, seyahat planını desteklemek amacıyla sunulan belgelerin başvuruda anlatılan seyahatle uyuşmaması da sorun oluşturabilir. Burada önemli olan yalnızca belgelerin sunulmuş olması değil, başvuruda verilen bilgilerin belgelerle tutarlı bir bütün oluşturmasıdır.',
          'Gerçeğe aykırı bilgi verilmesi veya sahte ya da değiştirilmiş belge sunulması ise çok daha ciddi sonuçlar doğurabilir.',
        ]),
        sub('6. Önceki Vize veya Seyahat Geçmişindeki Sorunlar', [
          'Daha önce Schengen vizesi veya başka ülkelere ait vizelerle seyahat etmiş olmak, yeni bir başvurunun değerlendirilmesinde dikkate alınabilecek unsurlardan biridir. Özellikle önceki seyahatlerde vize koşullarına uyulup uyulmadığı önem taşıyabilir.',
          'Örneğin önceki bir Schengen seyahatinde izin verilen kalış süresinin aşılması veya vize koşullarına aykırı hareket edilmesi, sonraki başvurularda soru işaretlerine neden olabilir.',
          'Buna karşılık, önceki vizelerin kurallara uygun şekilde kullanılmış olması ve seyahatlerin zamanında tamamlanması, başvuru sahibinin seyahat geçmişi açısından olumlu bir unsur olabilir.',
          'Bu nedenle yeni bir başvuru hazırlanırken yalnızca mevcut seyahate değil, başvuru sahibinin önceki vize ve seyahat geçmişine de dikkat edilmelidir.',
        ]),
        sub('7. Temel Vize Koşullarının Karşılanmaması', [
          'Schengen vize başvurularında seyahat amacına ve başvuru sahibinin durumuna göre karşılanması gereken bazı temel koşullar bulunur. Bu koşullardan birinin yerine getirilmemesi veya gerekli şartların kanıtlanamaması başvurunun olumsuz sonuçlanmasına neden olabilir.',
          'Bunlar arasında geçerli seyahat sağlık sigortasının bulunması gibi başvuru için gerekli temel şartlar da yer alır. Sunulan sigortanın gerekli kapsamı karşılamaması veya geçerli olduğunun kanıtlanamaması da başvuruda sorun oluşturabilir.',
          'Bu nedenle başvuru dosyası hazırlanırken yalnızca kişisel durumunuzu ve seyahat planınızı destekleyen belgelere değil, başvuru için zorunlu olan temel koşulların tamamının karşılandığına da dikkat etmek gerekir.',
        ]),
        sub('Sonuç', [
          'Schengen vize reddi, her zaman tek bir belgenin eksik olmasıyla açıklanamaz. Seyahat amacı, seyahat planı, maddi durum, kişisel koşullar ve sunulan bilgilerin güvenilirliği gibi farklı unsurlar birlikte değerlendirilir.',
          'Bu nedenle bir başvuruyu hazırlarken yalnızca gerekli belgeleri tamamlamak değil, başvurunun bütününün tutarlı ve anlaşılır olmasına dikkat etmek gerekir.',
          'Ret kararı aldıysanız, bir sonraki adım ise ret formunda belirtilen gerekçeyi doğru anlamaktır. Aşağıdaki “Schengen Vize Ret Maddeleri” bölümü her gerekçenin ne anlama geldiğini, “Schengen Vize Reddi Sonrası Ne Yapılmalı?” bölümü ise ret sonrasında izlenebilecek yolları ele alıyor.',
        ]),
      ],
    },

    // ── 02 ────────────────────────────────────────────────────────────────────
    {
      kicker: 'Ret formundaki maddeler',
      title: 'Schengen Vize Ret Maddeleri',
      intro: [
        'Schengen vize başvurunuz reddedildiğinde, kararın gerekçesi size yazılı olarak bildirilir. Bu gerekçeler, Schengen Vize Kodu’nda yer alan değerlendirme kriterleri doğrultusunda belirlenir ve standart bir form üzerinden bildirilir.',
        'Ancak kararda yer alan ifadeler çoğu zaman kısa ve resmî olduğu için, hangi gerekçenin ne anlama geldiğini anlamak her zaman kolay olmayabilir. Bize yöneltilen en sık sorulardan biri de tam olarak budur: “Bu gerekçe ne anlama geliyor?”',
        'Bu bölümde, Schengen vize başvurularında kullanılan ret gerekçelerini Türkçe ifadeleri ve İngilizce orijinalleriyle birlikte ele alıyor, her birinin arkasındaki değerlendirmeyi açıklıyoruz.',
      ],
      subsections: [
        sub(
          'Sahte, Tahrif Edilmiş veya Geçersiz Bir Seyahat Belgesi Sunulması',
          [
            'Bu gerekçe, başvuru sırasında sunulan pasaport veya başka bir seyahat belgesinin gerçekliğiyle ilgili ciddi bir sorun tespit edildiğinde gündeme gelir. Belgenin sahte olarak düzenlenmiş olması, üzerinde sonradan değişiklik yapılması veya gerçek bir belge üzerinde sahtecilik tespit edilmesi bu kapsamda değerlendirilebilir.',
            'Sahte veya tahrif edilmiş bir belge kullanılması, vize başvurusunun reddedilmesinin yanında, olayın koşullarına ve ilgili ülkenin hukukuna göre başka sonuçlar da doğurabilir. Bu nedenle böyle bir gerekçeyle karşılaşıldığında, kararın dayandığı durumun ne olduğunu dikkatle incelemek gerekir.',
          ],
          {
            quote: 'Sahte, tahrif edilmiş veya sahtecilik içeren bir seyahat belgesi sunuldu.',
            quote_en: 'A false/counterfeit/forged travel document was presented.',
          }
        ),
        sub(
          'Planlanan Seyahatin Amacı ve Koşullarına İlişkin Yeterli Gerekçe Sunulmaması',
          [
            'Bu gerekçe, başvuruda beyan edilen seyahatin amacı ile sunulan seyahat planı örtüşmediği durumlarda ortaya çıkar. Örneğin turistik bir seyahatte, sunulan konaklama, ulaşım ve seyahat süresi birlikte değerlendirildiğinde gezi amacı hakkında net bir tablo oluşmayabilir. Aile ziyareti veya iş seyahati gibi başvurularda da ziyaretin amacı ile sunulan belgeler ve seyahat planı arasında açıklanması gereken noktalar bulunabilir.',
            'Bu gerekçeyi aldıysanız, başvurunuzdaki seyahat amacı, tarihler, konaklama ve ulaşım bilgilerini birlikte inceleyin. Planınızın baştan sona tutarlı olup olmadığını ve sunduğunuz belgelerin bu planı yeterince açıklayıp açıklamadığını kontrol edin.',
          ],
          {
            quote: 'Planlanan seyahatin amacı ve koşullarına ilişkin yeterli gerekçe sunulmadı.',
            quote_en:
              'The justification for the purpose and conditions of the intended stay was not provided.',
          }
        ),
        sub(
          'Yeterli Maddi İmkânın Gösterilememesi',
          [
            'Bu gerekçe, seyahatinizin masraflarını karşılayabileceğiniz konusunda başvurunuzda yeterli ve inandırıcı bir tablo oluşmadığı anlamına gelir. Hesabınızda para bulunması tek başına bu durumu açıklamaz. Paranın nereden geldiği, düzenli gelirinizle nasıl bir ilişki içinde olduğu, seyahatinizin süresine ve tahmini masraflarına göre makul olup olmadığı da önem taşıyabilir.',
            'Örneğin uzun süredir düzenli bir gelir gösteren bir kişinin hesabındaki birikim ile başvurudan hemen önce hesaba yatırılmış yüksek bir tutar aynı şekilde değerlendirilmeyebilir. Benzer şekilde, seyahat masraflarını bir sponsor karşılıyorsa, bu masrafların kim tarafından ve hangi kaynakla karşılanacağına ilişkin açıklamaların da başvuruyla uyumlu olması gerekir.',
            'Bu nedenle bu gerekçeyi aldıysanız, yalnızca “Hesabımda yeterince para vardı” diye düşünmek yerine, sunduğunuz finansal belgelerin seyahatinizin masraflarını nasıl karşılayacağınızı ve gösterdiğiniz paranın kaynağını ne ölçüde açıkladığına bakmanız gerekir.',
          ],
          {
            quote:
              'Planlanan kalış süresi, ülkeye dönüş veya kabul edileceğiniz kesin olan üçüncü bir ülkeye geçiş için yeterli maddi imkâna sahip olduğunuzu gösteren kanıt sunmadınız veya bu imkânları yasal yollarla elde edebileceğinizi ortaya koyamadınız.',
            quote_en:
              'You have not provided proof of sufficient means of subsistence, for the duration of the intended stay or for the return to the country of origin or residence, or for the transit to a third country into which you are certain to be admitted, or you are not in a position to acquire such means lawfully.',
          }
        ),
        sub(
          'Son 180 Gün İçinde 90 Günlük Azami Kalış Süresinin Doldurulmuş Olması',
          [
            'Schengen kısa süreli vizelerinde temel kurallardan biri 90 gün / 180 gün kuralıdır. Önceki Schengen kalışlarınız nedeniyle içinde bulunduğunuz 180 günlük dönemde kullanılabilecek azami süreyi doldurduysanız, yeni bir kısa süreli vize başvurusu bu nedenle reddedilebilir.',
          ],
          {
            quote:
              'Son 180 günlük dönem içinde tek tip Schengen vizesi veya sınırlı bölgesel geçerliliğe sahip vize kapsamında 90 günlük azami kalış süresini doldurdunuz.',
            quote_en:
              'You have already stayed for 90 days during the current 180-day period on the basis of a uniform visa or a visa with limited territorial validity.',
          }
        ),
        sub(
          'Schengen Bilgi Sistemi’nde (SIS) Girişin Reddedilmesine Yönelik Uyarı Bulunması',
          [
            'Schengen Bilgi Sistemi (SIS), Schengen ülkelerinin belirli kişi ve nesnelere ilişkin uyarıları paylaştığı ortak bir bilgi sistemidir. Bu sistemde bir kişi hakkında Schengen bölgesine girişinin reddedilmesine yönelik bir uyarı bulunuyorsa, bu kayıt vize başvurusunun değerlendirilmesinde doğrudan önem taşır.',
            'Bu durumda öncelikle ret kararının hangi SIS kaydına dayandığını ve bu kaydın neden oluşturulduğunu öğrenmek gerekir. Kayıt hatalıysa veya artık geçerli değilse, ilgili kaydın düzeltilmesi ya da kaldırılması için uygulanabilecek yollar ayrıca değerlendirilmelidir.',
          ],
          {
            quote:
              'Schengen Bilgi Sistemi’nde (SIS), girişin reddedilmesi amacıyla hakkınızda bir uyarı kaydı bulunmaktadır.',
            quote_en:
              'An alert has been issued in the Schengen Information System (SIS) for the purpose of refusing entry.',
          }
        ),
        sub(
          'Kamu Düzeni, İç Güvenlik, Kamu Sağlığı veya Uluslararası İlişkiler Açısından Tehdit Oluşturulması',
          [
            'Bu gerekçe, başvuru sahibi hakkında daha önce yaşanmış bir olay, alınmış bir karar veya ilgili makamların sahip olduğu bir bilgi nedeniyle Schengen ülkelerinden birinin kişinin girişini uygun görmediği durumlarda karşımıza çıkabilir.',
            'Böyle bir değerlendirme yalnızca başvuru yaptığınız ülkeye ait olmak zorunda değildir; başka bir Schengen ülkesi de başvurunuzun değerlendirilmesi sırasında vize verilmesine itiraz edebilir.',
            'Daha önce bir Schengen ülkesinde giriş veya kalışla ilgili ciddi bir sorun yaşanması, kamu düzeni veya güvenlikle ilgili bir kaydın bulunması ya da ilgili makamların kişi hakkında güvenlik veya kamu düzeni bakımından olumsuz bir değerlendirmeye sahip olması bu tür bir kararın arkasında olabilir. Kamu sağlığı veya uluslararası ilişkilerle ilgili özel durumlar da aynı kapsamda değerlendirilebilir.',
            'Bu nedenle böyle bir gerekçeyle karşılaştığınızda, öncelikle ret kararındaki açıklamalar ve ek notlar incelenmeli; kararın hangi ülkenin ve hangi somut gerekçenin değerlendirmesine dayandığı anlaşılmalıdır.',
          ],
          {
            quote:
              'Bir veya daha fazla üye ülke tarafından kamu düzeni, iç güvenlik, kamu sağlığı veya bir veya daha fazla üye ülkenin uluslararası ilişkileri açısından tehdit olarak değerlendirildiniz.',
            quote_en:
              'One or more Member States consider you to be a threat to public policy, internal security, public health as defined in Article 2 point 21 of Regulation (EU) 2016/399 (Schengen Borders Code) or the international relations of one or more Member States.',
          }
        ),
        sub(
          'Yeterli ve Geçerli Seyahat Sağlık Sigortasının Bulunmaması',
          [
            'Seyahat sağlık sigortası, Schengen vize başvurusunun temel koşullarından biridir. Ancak yalnızca bir sigorta poliçesine sahip olmak yeterli değildir; poliçenin Schengen vizesi için aranan teminat, geçerlilik süresi ve bölgesel kapsam şartlarını karşılaması gerekir.',
          ],
          {
            quote:
              'Yeterli ve geçerli seyahat sağlık sigortasına sahip olduğunuzu gösteren kanıt sunmadınız.',
            quote_en:
              'You have not provided proof that you possess adequate and valid travel medical insurance.',
          }
        ),
        sub(
          'Planlanan Seyahatin Amacı ve Koşullarına İlişkin Sunulan Bilgilerin Güvenilir Bulunmaması',
          [
            'Bu gerekçe, seyahat amacı ve koşulları hakkında bilgi verilmesine rağmen, bu bilgilerin doğru veya güvenilir olduğuna ilişkin şüphe oluştuğunu gösterir. Yani sorun başvuruda yeterli açıklamanın bulunmaması değil, sunulan açıklamanın gerçeği yansıttığı konusunda ikna olunmamasıdır.',
            'Bu durum, başvuruda verilen bir bilginin başka bir belgeyle çelişmesi, sunulan belgelerden birinin doğruluğu konusunda tereddüt oluşması veya başvuruda anlatılan durumun güvenilir bulunmaması gibi farklı nedenlerle ortaya çıkabilir.',
          ],
          {
            quote:
              'Planlanan seyahatin amacı ve koşullarına ilişkin sunulan bilgiler güvenilir bulunmadı.',
            quote_en:
              'The information submitted regarding the justification for the purpose and conditions of the intended stay was not reliable.',
          }
        ),
        sub(
          'Vize Süresi Sona Ermeden Schengen Bölgesinden Ayrılma Niyetinin Belirlenememesi',
          [
            'Bu gerekçe, konsolosluğun başvuru sahibinin planlanan seyahatin sonunda Schengen bölgesinden ayrılarak Türkiye’ye döneceğine yeterince ikna olmadığı durumlarda kullanılır.',
            'Örneğin Türkiye’de çalışan bir kişi için işinin devam ediyor olması ve seyahat sonrasında işine dönecek olması, dönüş planını destekleyen önemli bir unsurdur. Aynı şekilde devam eden bir eğitim, Türkiye’de sürdürülen bir şirket veya düzenli olarak yerine getirilmesi gereken ailevi sorumluluklar da kişinin seyahat sonrasında Türkiye’ye dönmesini gerektiren koşulları gösterebilir.',
            'Buna karşılık, başvuru dosyasında kişinin Türkiye’deki mevcut durumu hakkında yeterli bilgi bulunmaması veya sunulan bilgilerin planlanan seyahat sonrasındaki durumunu açıklamaması, konsolosluğun dönüş niyeti konusunda ikna olmamasına neden olabilir.',
            'Bu nedenle bu gerekçeyle karşılaşıldığında bakılması gereken soru şudur: “Seyahatim bittikten sonra Türkiye’ye neden döneceğim?” Başvurunun bu soruya somut ve anlaşılır bir cevap verip vermediği belirleyicidir.',
          ],
          {
            quote: 'Vize süresi sona ermeden Schengen ülkelerinden ayrılma niyetiniz belirlenemedi.',
            quote_en:
              'Your intention to leave the territory of the Member States before the expiry of the visa could not be ascertained.',
          }
        ),
      ],
    },

    // ── 03 ────────────────────────────────────────────────────────────────────
    {
      kicker: 'Ret sonrası',
      title: 'Schengen Vize Reddi Sonrası Ne Yapılmalı?',
      intro: [
        'Schengen vize başvurusunun reddedilmesi, sürecin tamamen sona erdiği anlamına gelmez. Ret kararının ardından önünüzde iki temel seçenek olabilir: karara itiraz etmek veya önceki başvurudaki sorunları gidererek yeniden başvurmak.',
        'Ret kararının dosyanızdaki bilgilerle çeliştiğini düşünüyorsanız itiraz yolu değerlendirilebilir. Önceki başvuruda gerçekten eksik kalan veya yeterince açıklanmayan noktalar varsa, bunları gidererek yeniden başvurmak daha uygun olabilir.',
      ],
      subsections: [
        sub('İtiraz Etmek Ne Zaman Mantıklıdır?', [
          'İtiraz, ret kararının hatalı olduğunu düşündüğünüz durumlarda değerlendirilebilecek bir yoldur. Bunun için ret kararındaki gerekçenin neden hatalı olduğunu somut olarak ortaya koyabilmeniz gerekir.',
          'Örneğin maddi yeterlilik gerekçesiyle ret aldıysanız, başvuru sırasında düzenli gelirinizi, banka hareketlerinizi ve seyahat masraflarını nasıl karşılayacağınızı zaten açık biçimde göstermiş olabilirsiniz. Böyle bir durumda, ret kararında maddi durumunuzun neden yetersiz görüldüğü ve sunduğunuz belgelerin bu değerlendirmeyle nasıl bağdaştığı incelenebilir.',
          'Aynı durum seyahat amacı veya vize süresi sona ermeden Schengen bölgesinden ayrılma niyetiyle ilgili gerekçeler için de geçerlidir. Başvuruda seyahatin amacı, konaklama ve ulaşım bilgileri açıkça sunulmuşsa ya da Türkiye’deki işiniz, eğitiminiz ve diğer devam eden yükümlülükleriniz belgelenmişse, ret kararının bu bilgilerle ne ölçüde örtüştüğüne bakılabilir.',
        ]),
        sub('Yeniden Başvurmak Ne Zaman Daha Doğrudur?', [
          'Ret kararının dayandığı sorun önceki başvuruda gerçekten bulunuyorsa, yeniden başvuru gündeme gelir. Burada amaç, önceki başvuruda eksik veya yetersiz kalan noktaları gidererek yeni bir dosya sunmaktır.',
          'Örneğin seyahat masraflarının nasıl karşılanacağı önceki başvuruda yeterince açıklanmamışsa, yeni başvuruda finansal durumunuzu daha açık şekilde ortaya koymanız gerekir. Seyahat amacınız konusunda yeterli açıklama bulunmuyorsa, yeni başvuruda seyahatin amacını destekleyen bilgiler ve belgeler yeniden ele alınmalıdır.',
          'Bazen sorun başvurudaki tek bir belgenin eksik olmasından değil, dosyanın genelinde ortaya çıkan tabloyla ilgilidir. Böyle bir durumda yalnızca bir belge eklemek yeterli olmayabilir.',
          'Örneğin banka hesabında yeterli para bulunmasına rağmen bu paranın kaynağı açıklanamıyorsa, yalnızca daha yüksek bir bakiye göstermek önceki sorunu çözmeyebilir. Benzer şekilde, dönüş niyetiyle ilgili bir ret alınmışsa, yalnızca yeni bir rezervasyon eklemek yerine Türkiye’ye dönüşü destekleyen mevcut koşulların başvuruda nasıl ortaya konulduğuna bakılmalıdır.',
        ]),
        sub('Schengen Vize Reddine İtiraz Nasıl Yapılır?', [
          'İtiraz süreci, başvurunun yapıldığı ülkeye göre değişir. Ret kararında, itirazın hangi makama yapılacağı, hangi süre içinde başvurulması gerektiği ve izlenecek yöntem belirtilmelidir. Bu nedenle ret formunu aldıktan sonra ilk olarak bu bilgileri kontrol etmek gerekir.',
          'İtiraz bazı ülkelerde doğrudan konsolosluğa veya ilgili idari makama yazılı bir başvuruyla yapılırken, bazı ülkelerde farklı bir idari ya da yargısal yol öngörülebilir. Dolayısıyla “internetten mi yapılır, konsolosluğa mı verilir, dilekçe mi hazırlanır?” sorusunun Schengen ülkelerinin tamamı için tek bir cevabı yoktur. Ret kararında gösterilen usul izlenmelidir.',
          'İtirazın içeriğinde ise ret gerekçesine doğrudan cevap verilmelidir. Önceki başvuruda sunduğunuz bilgi ve belgelerin neden ret kararındaki değerlendirmeyi karşılamadığını veya kararın neden bu belgeler ışığında yeniden değerlendirilmesi gerektiğini açıklamanız gerekir.',
          'Kısacası, önce ret kararındaki itiraz talimatını ve süreyi kontrol edin; ardından belirtilen makama, belirtilen yöntemle başvurun ve dilekçenizi doğrudan ret gerekçesine cevap verecek şekilde hazırlayın.',
        ]),
        sub('Schengen Vize Reddi Sonrası Yeniden Başvuru Nasıl Yapılır?', [
          'Schengen vize reddinden sonra yeniden başvuru yapılabilir ve bunun için genel bir bekleme süresi bulunmaz. Yeni başvuru, ilgili ülkenin normal vize başvuru prosedürü üzerinden yapılır.',
          'Yeni başvuruda, ret gerekçesiyle ilgili konuyu daha açık şekilde ortaya koyan bilgi ve belgeler sunulmalıdır. Önceki başvuruda açıklanmayan, yeterince belgelenmeyen veya yanlış anlaşıldığını düşündüğünüz bir nokta varsa, yeni dosyada bu konuya özellikle yer verilmelidir.',
          'Örneğin maddi yeterlilikle ilgili bir sorun varsa, yalnızca banka bakiyesini göstermek yerine bu paranın kaynağını ve seyahat masraflarının nasıl karşılanacağını açıklayan belgeler sunulabilir. Seyahat amacıyla ilgili bir sorun varsa, seyahatin amacını destekleyen belgeler ve açıklamalar daha ayrıntılı hazırlanabilir.',
          'Yeni başvurunun amacı, önceki dosyayı olduğu gibi tekrar sunmak değil, ret kararında sorun oluşturan noktayı bu kez daha açık ve anlaşılır şekilde ortaya koymaktır.',
        ]),
      ],
    },

    // ── 04 ────────────────────────────────────────────────────────────────────
    {
      kicker: 'İlk başvuru',
      title: 'İlk Kez Schengen Vizesi Alacaklar Nereden Başlamalı?',
      intro: [
        'İlk kez Schengen vizesine başvuruyorsanız, önünüzde bir anda çok sayıda belge, form, randevu ve farklı bilgi bulabilirsiniz. Başvuru sürecine nereden ve hangi sırayla başlayacağınızı bilmek, bu süreci daha kolay yönetmenizi sağlar.',
        'Bu bölümde ilk Schengen başvurunuzu ilk karardan başvurunun tamamlanmasına kadar adım adım ele alıyoruz.',
      ],
      subsections: [
        sub('1. Nereye Gideceğinizi Netleştirin', [
          'İlk adım, vize başvurusu yapacağınız ülkeyi seçmek değil, seyahatinizin nereye ve ne amaçla olduğunu netleştirmektir.',
          'Bir Schengen seyahati yalnızca tek bir ülkeden oluşabilir. Örneğin Almanya’ya 10 günlük turistik bir seyahat planlıyor olabilirsiniz. Ancak birden fazla Schengen ülkesini aynı seyahatte ziyaret etmeniz de mümkündür. Almanya, Fransa ve İtalya’yı kapsayan bir Avrupa turu buna örnek olabilir.',
          'Birden fazla Schengen ülkesini ziyaret edecekseniz, başvurunuzu seyahatinizin ana destinasyonu olan ülkeye yapmanız gerekir. Turistik bir seyahatte ana destinasyon, genellikle en uzun süre kalacağınız ülkedir. Örneğin 10 günlük seyahatinizde Almanya’da 5 gün, Fransa’da 3 gün ve İtalya’da 2 gün kalacaksanız, başvurunuzu Almanya’ya yapmanız gerekir.',
          'İki veya daha fazla ülkede eşit süre kalacaksanız, bu durumda Schengen bölgesine ilk giriş yapacağınız ülke esas alınır. Örneğin Fransa’da 4 gün, İtalya’da 4 gün ve İspanya’da 2 gün kalacaksanız ve Schengen bölgesine Fransa üzerinden giriş yapacaksanız, başvurunuzu Fransa’ya yapmanız gerekir.',
          'Seyahatinizin belirli bir amacı varsa, ana destinasyonun belirlenmesinde bu amaç da dikkate alınabilir. Örneğin bir toplantı, etkinlik veya başka bir özel amaç için belirli bir ülkeye gidiyorsanız, bu amacın gerçekleştirileceği ülke ana destinasyon olabilir.',
          'Kısacası, ilk aşamada hangi ülkeleri ziyaret edeceğinizi, her birinde ne kadar kalacağınızı ve seyahatinizin amacını netleştirin. Başvuracağınız ülkeyi de bu seyahat planına göre belirleyin.',
        ]),
        sub(
          '2. Hangi Vizeye İhtiyacınız Olduğunu Belirleyin',
          [
            'Seyahat planınızı netleştirdikten sonra, seyahatinizin amacına uygun Schengen vize kategorisini belirlemeniz gerekir. Schengen vizesine seyahat amacınıza göre turistik, ticari veya aile ziyareti gibi farklı kategoriler üzerinden başvurulabilir.',
            'Vize kategorisi yalnızca başvurunun niteliğini belirlemez. Başvuruda sunmanız gereken belgeler ve seyahatinizi destekleyen evraklar da seyahat amacınıza göre değişebilir.',
            'Bu nedenle başvurunuza başlamadan önce seyahatinizin gerçek amacını belirleyerek buna uygun kategoriden ilerlemeniz önemlidir.',
          ],
          {
            bullets: [
              'Turistik seyahat → Turistik amaçlı başvuru',
              'Toplantı, fuar veya ticari görüşme → Ticari amaçlı başvuru',
              'Aile veya yakın ziyareti → Ziyaret amaçlı başvuru',
            ],
          }
        ),
        sub('3. Kendi Durumunuzu Değerlendirin', [
          'Vize kategorinizi belirledikten sonra, kendi çalışma, gelir ve finansal durumunuzu değerlendirin. Aynı vize kategorisine başvuran kişilerin hazırlaması gereken belgeler, kişisel durumlarına göre farklılık gösterebilir.',
          'Örneğin çalışan, şirket sahibi, öğrenci, emekli veya çalışmayan bir başvuru sahibinin sunacağı belgeler aynı olmayabilir. Seyahat masrafları başka biri tarafından karşılanıyorsa, sponsorlu başvurularda da farklı belgeler gerekebilir.',
          'Bu nedenle başka bir başvuru sahibinin hazırladığı evrak listesini doğrudan kendi başvurunuza uyarlamak yerine, kendi durumunuza uygun belgeleri belirlemeniz gerekir.',
        ]),
        sub('4. Seyahat Planınızı Oluşturun', [
          'Seyahat edeceğiniz ülkeleri, vize kategorinizi ve kendi durumunuzu değerlendirdikten sonra, seyahatinizin ne zaman, nasıl ve nerede gerçekleşeceğini netleştirin.',
          'Seyahat tarihleriniz, ziyaret edeceğiniz şehir ve ülkeler, konaklama düzeniniz ve ulaşım planınız baştan belirlenmelidir. Hazırlayacağınız belgeler de bu seyahat planını destekleyecektir.',
          'Seyahat planının amacı yalnızca bir güzergâh oluşturmak değil, başvurunuzun temelini oluşturan gerçek ve anlaşılabilir bir seyahat çerçevesi ortaya koymaktır.',
        ]),
        sub('5. Evraklarınızı Bu Plana Göre Hazırlayın', [
          'Seyahat planınız ve kendi durumunuz netleştikten sonra, sıra gerekli belgeleri hazırlamaya gelir. İstenen evraklar; başvurduğunuz ülkeye, vize kategorinize, seyahat amacınıza ve kişisel durumunuza göre değişebilir.',
          'Geçerli pasaport, başvuru formu, fotoğraf, seyahat amacını ve konaklamayı destekleyen belgeler, finansal durumu gösteren evraklar ve seyahat sağlık sigortası başvurularda sık karşılaşılan temel belge grupları arasındadır. Pasaportunuzun geçerlilik süresi gibi temel koşulları da başvuru öncesinde kontrol etmelisiniz.',
          'Belgelerinizi hazırlarken, başvuru formunda verdiğiniz bilgiler ile sunduğunuz belgelerin birbiriyle uyumlu olduğundan emin olun. Özellikle seyahat tarihleri, konaklama, gelir ve çalışma durumu gibi bilgilerin belgelerinizle çelişmemesi gerekir.',
          'Hangi belgelerin gerekli olduğunu belirlerken, başvuru yaptığınız ülkenin güncel resmi belge listesini esas alın.',
        ]),
        sub('6. Başvuru Merkezini ve Randevunuzu Belirleyin', [
          'Belgelerinizi hazırladıktan sonra, başvurunuzu hangi yetkili başvuru merkezi üzerinden yapacağınızı ve randevunuzu ne zaman alacağınızı belirleyin.',
          'Başvuru merkezi ve randevu sistemi ülkeye göre değişebildiği için, başvuru yapacağınız ülkenin güncel resmi yönlendirmelerini takip etmeniz önemlidir.',
          'Başvurunuzu seyahatinize çok yakın bir tarihe bırakmayın. Schengen başvurusu seyahatten en fazla 6 ay önce yapılabilir ve kural olarak seyahatten en az 15 gün önce sunulmalıdır. Değerlendirme süresi bazı durumlarda uzayabileceğinden, seyahat tarihinizi dikkate alarak yeterli zaman bırakmanız önemlidir.',
          'Başvuru sırasında vize ücretinin yanı sıra, başvuru merkezinin hizmet bedeli gibi ek ücretler de bulunabilir. Güncel ücretleri başvuru yaptığınız ülkenin resmi kaynaklarından kontrol etmelisiniz.',
        ]),
        sub('7. Başvurunuzu Yapın', [
          'Randevu gününüz geldiğinde, hazırladığınız başvuru dosyasıyla birlikte yetkili başvuru merkezine giderek başvurunuzu tamamlayabilirsiniz. Başvuru sırasında belgeleriniz teslim edilir ve gerekli biyometrik işlemler gerçekleştirilir.',
          'Başvurunuzu teslim etmeden önce formunuzdaki bilgileri ve sunduğunuz belgeleri son kez kontrol edin. Başvuruda verdiğiniz bilgilerin doğru, güncel ve belgelerinizle uyumlu olduğundan emin olun.',
          'Başvurunuz tamamlandıktan sonra dosyanız değerlendirilmek üzere ilgili konsolosluk veya büyükelçiliğe iletilir.',
        ]),
        sub('8. Sonucu Bekleyin', [
          'Başvurunuz teslim edildikten sonra dosyanız ilgili makamlar tarafından değerlendirilir. Başvurunun değerlendirilmesi kural olarak 15 takvim günü içinde tamamlanır. Ancak daha ayrıntılı bir inceleme gerektiğinde bu süre 45 güne kadar uzayabilir.',
          'Değerlendirme sırasında ek belge veya bilgi talep edilmesi de mümkündür. Böyle bir talep gelmesi durumunda, istenen belgeleri belirtilen süre içinde sunmanız gerekir.',
          'Değerlendirme tamamlandığında pasaportunuz, başvuru sırasında belirlenen yöntemle tarafınıza teslim edilir.',
          'Vize başvurusunun olumlu sonuçlanacağının garanti edilemeyeceğini unutmamak gerekir. Başvurunun reddedilmesi halinde, ret gerekçesi ve ilgili ülkenin prosedürlerine göre itiraz imkânı hakkında bilgi verilir.',
        ]),
        sub('İlk Schengen Başvurunuz İçin Kısaca', [
          'İlk Schengen başvurunuzda süreci karmaşıklaştırmadan ilerlemenin en iyi yolu, adımları doğru sırayla takip etmektir.',
          'Önce seyahatinizi netleştirin. Ardından doğru vize kategorisini ve başvuru ülkesini belirleyin. Kendi durumunuza uygun belgeleri hazırlayın, seyahat planınızla uyumlu bir dosya oluşturun ve başvurunuzu zamanında tamamlayın.',
          'İlk başvurunuzda önemli olan yalnızca gerekli belgeleri toplamak değil, seyahatinizi, kişisel durumunuzu ve sunduğunuz belgeleri birbirini destekleyen tutarlı bir bütün haline getirmektir.',
          'Hangi belgelerin sizin için gerekli olduğunu kendi seyahat planınız ve durumunuza göre öğrenmek istiyorsanız, VizeMakinesi’nin kişiselleştirilmiş belge listesiyle başvurunuza uygun evrakları belirleyebilirsiniz.',
        ]),
      ],
    },
  ],
};
