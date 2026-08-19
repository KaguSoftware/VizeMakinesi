-- ============================================================
-- SCHENGEN BÖLGESİ SAYFASI (/schengen)
--
-- Sayfanın tüm metinleri tek satırlık bir tabloda tutulur
-- (id = 1). Ülke kartları (SchengenCountryGrid) ve hero'nun
-- ülke bilgileri hâlâ `countries` tablosundaki 'schengen'
-- satırından gelir; buradaki alanlar yalnızca /schengen
-- sayfasına özgü bölümleri kapsar:
--   • Hero'nun sol sütunundaki lead / not / maddeler
--   • "Tek vize, 29 ülke" giriş başlığı (ülke kartlarının üstünde)
--   • Schengen Vizesinin Temel Kuralları
--   • C Tipi / D Tipi vize türleri
--   • Başvuru adımları
--   • SSS (sayfanın tek SSS kaynağı — country_faqs artık
--     /schengen'de kullanılmaz)
--
-- Yönetim: /admin/schengen
-- ============================================================
CREATE TABLE IF NOT EXISTS schengen_page (
  id                      smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),

  -- Hero (sol sütun)
  hero_lead               text NOT NULL DEFAULT '',
  hero_note               text NOT NULL DEFAULT '',
  hero_bullets            text[] NOT NULL DEFAULT '{}',

  -- "Tek vize, 29 ülke" — başlığın altında doğrudan ülke kartları gelir
  intro_title             text NOT NULL DEFAULT '',

  -- Temel kurallar — [{ "title": "...", "description": "..." }]
  rules_title             text NOT NULL DEFAULT '',
  rules_description       text NOT NULL DEFAULT '',
  rules                   jsonb NOT NULL DEFAULT '[]'::jsonb,

  -- Vize türleri — C ve D grupları, aynı madde biçimi
  visa_types_title        text NOT NULL DEFAULT '',
  visa_types_description  text NOT NULL DEFAULT '',
  visa_types_c_title      text NOT NULL DEFAULT '',
  visa_types_c            jsonb NOT NULL DEFAULT '[]'::jsonb,
  visa_types_d_title      text NOT NULL DEFAULT '',
  visa_types_d_description text NOT NULL DEFAULT '',
  visa_types_d            jsonb NOT NULL DEFAULT '[]'::jsonb,

  -- Başvuru adımları — sıralı kısa etiketler (ok akışı)
  process_title           text NOT NULL DEFAULT '',
  process_description     text NOT NULL DEFAULT '',
  process_steps           text[] NOT NULL DEFAULT '{}',

  -- SSS — [{ "question": "...", "answer": "..." }]
  faq_title               text NOT NULL DEFAULT '',
  faqs                    jsonb NOT NULL DEFAULT '[]'::jsonb,

  updated_at              timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE schengen_page ENABLE ROW LEVEL SECURITY;

-- page_sections ile aynı politika biçimi: herkes okur, admin yazar.
CREATE POLICY "public_select_schengen_page"
  ON schengen_page FOR SELECT USING (true);

CREATE POLICY "admin_insert_schengen_page"
  ON schengen_page FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE POLICY "admin_update_schengen_page"
  ON schengen_page FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));


-- ============================================================
-- SEED — Schengen Bölgesi rehber dokümanının metinleri.
-- Idempotent: satır zaten varsa dokunulmaz, böylece migration
-- yeniden çalıştırıldığında admin düzenlemeleri ezilmez.
-- ============================================================
INSERT INTO schengen_page (
  id,
  hero_lead, hero_note, hero_bullets,
  intro_title,
  rules_title, rules_description, rules,
  visa_types_title, visa_types_description,
  visa_types_c_title, visa_types_c,
  visa_types_d_title, visa_types_d_description, visa_types_d,
  process_title, process_description, process_steps,
  faq_title, faqs
) VALUES (
  1,
  $t$Doğru ve tutarlı bir başvuru dosyası, Schengen vize sürecinin temelini oluşturur.$t$,
  $t$Vize sürecinizi doğru planlama ve uzman desteğiyle yönetin.$t$,
  ARRAY[
    $t$Randevu sürecinde hızlı ve doğru yönlendirme$t$,
    $t$Kişisel durumunuza özel stratejik dosya analizi$t$,
    $t$Başvurunun tüm aşamalarında planlı süreç yönetimi$t$,
    $t$Süreç boyunca ulaşabileceğiniz uzman desteği$t$
  ],

  $t$Tek vize, 29 ülke.$t$,

  $t$Schengen Vizesinin Temel Kuralları$t$,
  $t$Schengen vizesi başvurularında ortak Schengen kuralları uygulanır. Başvurunuza başlamadan önce aşağıdaki temel bilgileri gözden geçirmenizi öneririz.$t$,
  $j$[
    {
      "title": "Schengen Bölgesi",
      "description": "Schengen Bölgesi, üye ülkeler arasındaki iç sınır kontrollerinin kaldırıldığı ve ortak vize kurallarının uygulandığı 29 Avrupa ülkesinden oluşur."
    },
    {
      "title": "Vize Zorunluluğu",
      "description": "Umuma Mahsus (Bordo) pasaport sahiplerinin, Schengen Bölgesi'ne yapacakları 90 güne kadar olan kısa süreli seyahatler için Schengen vizesi almaları gerekir."
    },
    {
      "title": "Vizeden Muaf Pasaportlar",
      "description": "Hususi (Yeşil), Hizmet (Gri) ve Diplomatik (Siyah) pasaport sahipleri, 180 günlük dönem içinde 90 günü aşmayan kısa süreli seyahatlerinde Schengen vizesinden muaftır."
    },
    {
      "title": "90/180 Kuralı",
      "description": "Kısa süreli Schengen seyahatlerinde, herhangi bir 180 günlük dönem içinde Schengen Bölgesi'nde toplam 90 günden fazla kalamazsınız. Bu süre, Schengen Bölgesi'ne yaptığınız tüm giriş ve çıkışlar birlikte değerlendirilerek hesaplanır."
    },
    {
      "title": "Başvuru Ülkesi",
      "description": "Schengen vize başvurunuzu, seyahatinizin ana destinasyonu olan ülkenin yetkili makamlarına yapmanız gerekir. Birden fazla Schengen ülkesini ziyaret edecekseniz, genel olarak en uzun süre kalacağınız ülke esas alınır. Birden fazla ülkede eşit süre kalmanız durumunda ise ilk giriş yapacağınız ülkeye başvurmanız gerekir."
    }
  ]$j$::jsonb,

  $t$Hangi Schengen Vize Türüne Başvurmalısınız?$t$,
  $t$Schengen vizeleri, 90 güne kadar olan kısa süreli seyahatler için düzenlenen C Tipi vizelerdir. Seyahat amacınıza göre başvurmanız gereken kategori değişir. 90 günü aşan eğitim, çalışma veya yerleşim gibi amaçlarda ise Schengen vizesi değil, seyahat edeceğiniz ülkenin ulusal D Tipi vizesine başvurmanız gerekir.$t$,

  $t$C Tipi Schengen Vizeleri$t$,
  $j$[
    {
      "title": "Turistik Vize",
      "description": "Gezi, tatil ve bireysel seyahat amacıyla yapılan kısa süreli başvurular için düzenlenen C Tipi Schengen vizesidir. Seyahat süresi, vizenin geçerlilik tarihleri ve izin verilen kalış süresi başvurunun değerlendirilmesine göre belirlenir."
    },
    {
      "title": "Ticari Vize",
      "description": "İş görüşmeleri, şirket ziyaretleri, toplantılar, fuarlar ve ticari organizasyonlara katılım amacıyla yapılan kısa süreli seyahatler için düzenlenen C Tipi Schengen vizesidir."
    },
    {
      "title": "Aile Ziyareti Vizesi",
      "description": "Schengen Bölgesi'nde yaşayan aile bireylerini veya yakınlarını ziyaret etmek amacıyla yapılan kısa süreli seyahatler için başvurulan C Tipi Schengen vizesidir. Başvurunun niteliğine göre davetiye ve ziyaret edilen kişiye ilişkin ek belgeler talep edilebilir."
    },
    {
      "title": "Transit Vize",
      "description": "Schengen Bölgesi üzerinden başka bir ülkeye seyahat ederken transit geçiş için vizeye ihtiyaç duyan yolcuların başvurduğu vize türüdür. Transit vize gerekliliği, seyahat güzergâhına ve yolcunun vatandaşlığına göre değişebilir."
    },
    {
      "title": "Fuar, Kongre ve Etkinlik Vizesi",
      "description": "Fuar, kongre, konferans, kültürel, bilimsel veya sportif etkinliklere katılmak amacıyla yapılan kısa süreli seyahatler için başvurulan C Tipi Schengen vizesidir."
    }
  ]$j$::jsonb,

  $t$D Tipi Ulusal Vizeler$t$,
  $t$90 günden uzun süreli eğitim, çalışma veya yerleşim amacı taşıyan seyahatler Schengen C Tipi vizesi kapsamında değildir. Bu durumda, seyahat edilecek ülkenin ulusal mevzuatına göre D Tipi vize başvurusu yapılması gerekir.$t$,
  $j$[
    {
      "title": "Öğrenci Vizesi",
      "description": "90 günü aşan eğitim programlarına katılmak veya uzun süreli eğitim amacıyla ilgili ülkede bulunmak isteyen kişilerin başvurması gereken ulusal D Tipi vizedir."
    },
    {
      "title": "Çalışma Vizesi",
      "description": "İlgili ülkede uzun süreli çalışmak isteyen kişilerin başvurması gereken ulusal D Tipi vizedir. Başvuru koşulları ve gerekli belgeler ülkeye göre değişiklik gösterir."
    },
    {
      "title": "Aile Birleşimi Vizesi",
      "description": "İlgili ülkede yasal olarak yaşayan aile bireylerinin yanına uzun süreli yerleşmek isteyen kişilerin başvurduğu ulusal D Tipi vizedir. Başvuru şartları ülkenin ulusal mevzuatına göre belirlenir."
    }
  ]$j$::jsonb,

  $t$Schengen Vize Başvurusu Nasıl Yapılır?$t$,
  $t$Schengen vize başvurusu; seyahat amacının ve vize türünün belirlenmesi, doğru başvuru ülkesinin seçilmesi, gerekli belgelerin hazırlanması, randevu ve biyometri işlemlerinin tamamlanması ve başvurunun değerlendirilmesi aşamalarından oluşur. Başvuru şartları ve prosedürler, başvuracağınız ülkeye göre değişebilir.$t$,
  ARRAY[
    $t$Vize türünü belirleyin$t$,
    $t$Başvuru ülkesini seçin$t$,
    $t$Belgeleri hazırlayın$t$,
    $t$Randevu ve biyometri işlemlerini tamamlayın$t$,
    $t$Başvurunuzu teslim edin$t$,
    $t$Sonucu bekleyin$t$
  ],

  $t$Schengen Vizesi Hakkında Sıkça Sorulan Sorular$t$,
  $j$[
    {
      "question": "Schengen vize başvurusunu ne kadar önce yapmalıyım?",
      "answer": "Schengen vize başvurunuzu, planlanan seyahat tarihinizden en erken 6 ay önce ve kural olarak en geç 15 takvim günü önce yapabilirsiniz. Ancak 15 günlük süre başvuruyu son dakikaya bırakmak için güvenli bir zaman aralığı değildir. Randevu bulunabilirliği, resmî tatiller ve başvurunun değerlendirme süresinin uzayabilmesi nedeniyle başvurunuzu daha erken yapmanız önerilir. Normal değerlendirme süresi 15 gün olmakla birlikte, gerekli durumlarda 45 güne kadar uzayabilir."
    },
    {
      "question": "Schengen vizesi kaç günde sonuçlanır?",
      "answer": "Schengen vize başvuruları, normal şartlarda başvurunun yetkili makama ulaştığı tarihten itibaren 15 takvim günü içinde sonuçlandırılır. Başvurunun daha ayrıntılı incelenmesi veya ek belge talep edilmesi halinde bu süre 45 güne kadar uzayabilir."
    },
    {
      "question": "Schengen vize ücreti ne kadar?",
      "answer": "Schengen vize harcı ve başvuru sırasında ödenebilecek hizmet bedelleri zaman içinde değişebilir. Güncel ücretler, başvuru yapılacak ülkeye ve yetkili başvuru merkezine göre kontrol edilmelidir."
    },
    {
      "question": "Schengen vizesi için banka hesabımda ne kadar para bulunmalıdır?",
      "answer": "Schengen vizesi için tüm ülkeler açısından geçerli tek bir minimum banka bakiyesi bulunmaz. Gerekli finansal yeterlilik, başvurulan ülkenin belirlediği günlük geçim tutarı, seyahat süresi ve konaklama gibi unsurlara göre değerlendirilir. Hesabınızdaki bakiyenin seyahat masraflarınızı karşılayabilecek düzeyde olması ve gelir durumunuzla uyumlu olması gerekir."
    },
    {
      "question": "Schengen vizesi için pasaportumun en az kaç ay geçerliliği olmalıdır?",
      "answer": "Pasaportunuzun, Schengen Bölgesi'nden planlanan çıkış tarihinizden sonra en az 3 ay daha geçerli olması gerekir. Ayrıca pasaportunuzun son 10 yıl içinde düzenlenmiş ve en az 2 boş sayfasının bulunması gerekir."
    },
    {
      "question": "Schengen vizesi için parmak izi vermem gerekir mi?",
      "answer": "Schengen vize başvurularında parmak izi alınması ve biyometrik veri kaydedilmesi genel olarak zorunludur. Ancak daha önce Schengen vizesi başvurusu sırasında parmak izi verdiyseniz ve bu biyometrik veriler 59 ay içinde yeniden kullanılabiliyorsa tekrar parmak izi vermeniz gerekmeyebilir."
    },
    {
      "question": "Schengen vizesi ile tüm Schengen ülkelerine seyahat edebilir miyim?",
      "answer": "Evet. Schengen vizesi, vizenizin geçerlilik alanı, giriş sayısı ve izin verilen kalış süresi dahilinde Schengen Bölgesi'ndeki ülkelere seyahat etmenize olanak tanır."
    },
    {
      "question": "İlk girişimi vizeyi aldığım ülkeden yapmak zorunda mıyım?",
      "answer": "Hayır. Schengen vizesi aldığınız ülkeden giriş yapmanız genel olarak zorunlu değildir. Ancak seyahat planınızın, vize başvurusu sırasında sunduğunuz bilgilerle uyumlu olması ve başvuru yaptığınız ülkenin seyahatinizin ana destinasyonu olması gerekir."
    },
    {
      "question": "Tek girişli ve çok girişli Schengen vizesi arasındaki fark nedir?",
      "answer": "Tek girişli (Single Entry) Schengen vizesi, Schengen Bölgesi'ne bir kez giriş yapmanıza izin verir. Bölgeden çıktıktan sonra vizenizin geçerlilik süresi devam etse bile aynı vizeyle yeniden giriş yapamazsınız. Çok girişli (Multiple Entry) Schengen vizesi ise vizenin geçerlilik süresi ve izin verilen kalış süresi içinde Schengen Bölgesi'ne birden fazla giriş ve çıkış yapmanıza olanak tanır."
    },
    {
      "question": "Schengen vize başvuruları en çok hangi nedenlerle reddedilir?",
      "answer": "Schengen vize başvuruları; seyahat amacının yeterince kanıtlanmaması, sunulan belgelerde eksiklik veya tutarsızlık bulunması, yeterli maddi imkânın gösterilememesi ya da başvuru sahibinin seyahat sonunda ülkesine döneceğine ilişkin yeterli kanaat oluşmaması gibi nedenlerle reddedilebilir. Ret gerekçesi, her başvurunun kendi koşulları değerlendirilerek belirlenir."
    },
    {
      "question": "Schengen vize başvurum reddedilirse tekrar başvuru yapabilir miyim?",
      "answer": "Evet. Schengen vize başvurunuzun reddedilmesi, yeniden başvuru yapmanıza engel değildir. Ancak yeni bir başvuru yapmadan önce ret gerekçesini değerlendirmeniz ve önceki başvuruda yetersiz veya eksik görülen hususları gidermeniz önemlidir."
    }
  ]$j$::jsonb
)
ON CONFLICT (id) DO NOTHING;
