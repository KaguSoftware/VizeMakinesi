-- ============================================================
-- İSVEÇ (/vize/isvec) İÇERİK DOLGUSU
--
-- 0015 (Almanya) ile aynı yapıda: admin panelinden tek tek
-- girilmesi gereken alanları "İsveç Vize Rehberi" dokümanına
-- göre toplu olarak doldurur. Yalnızca 'isvec' satırını etkiler.
--
-- ÖNCE 0013, 0014 ve 0016 çalıştırılmalıdır (general_info_*,
-- visa_types_* kolonları ve country_visa_types tablosu).
--
-- Tekrar çalıştırılabilir: alt tablolardaki eski satırlar
-- silinip yeniden eklenir.
--
-- KAPSAM DIŞI: PDF belgeler (country_documents) — dosyalar
-- /admin/countries üzerinden yüklenmelidir.
-- ============================================================

BEGIN;

-- ── Hero + bölüm metinleri ──────────────────────────────────
UPDATE countries SET
  visa_type = 'Schengen / Ulusal Vize',
  summary   = 'Kısa süreli seyahatler için Schengen vizesi; eğitim, çalışma ve uzun süreli yaşam planları için Ulusal (D Tipi) vize seçenekleri.',

  -- "Başvuru Öncesi Bilmeniz Gerekenler" bölümü.
  -- Başlık NULL bırakıldı → site varsayılan başlığı kullanır.
  -- Maddeler "Mini Başlık: açıklama" biçimindedir; iki nokta
  -- öncesi kısım sitede kalın görünür.
  general_info_title = NULL,
  general_info_description = 'İsveç vize başvurunuza başlamadan önce aşağıdaki temel bilgileri bilmeniz, süreci doğru planlamanıza yardımcı olacaktır.',
  general_info = ARRAY[
    'Vize Zorunluluğu: Türkiye Cumhuriyeti umuma mahsus (bordo) pasaport sahipleri, İsveç''e seyahat etmeden önce vize almak zorundadır.',
    'Vizeden Muaf Pasaportlar: Hususi (yeşil), hizmet (gri) ve diplomatik (siyah) pasaport sahipleri, 180 gün içinde 90 günü aşmayan kısa süreli İsveç seyahatlerinde vizeden muaftır.',
    'Doğru Başvuru Ülkesi: Schengen vizesi başvurusu, seyahatinizde en uzun süre kalmayı planladığınız ülkenin temsilciliğine yapılmalıdır. Birden fazla Schengen ülkesinde eşit süre kalmayı planlıyorsanız, başvurunuzu ilk giriş yapacağınız ülkenin temsilciliğine yapmanız gerekir.',
    'Başvuru Merkezi: İsveç vize başvuruları, Türkiye''de VFS Global başvuru merkezleri aracılığıyla kabul edilir. Başvurular İstanbul, Ankara, İzmir ve Antalya''daki VFS Global ofislerinden yapılabilir. İsveç Başkonsolosluğu''na doğrudan Schengen vize başvurusu yapılamaz.',
    'Ülkeye Giriş Yetkisi: Schengen vizesi sahibi olmak, ülkeye giriş hakkının kesin olarak tanındığı anlamına gelmez. Nihai değerlendirme, sınır kontrolü sırasında yetkili makamlar tarafından yapılır.'
  ],

  -- "Hangi Vize Türüne Başvurmalısınız?" bölümü.
  -- Başlık ve giriş cümlesi NULL → site varsayılanlarını kullanır
  -- ("Vize türlerini detaylı inceleyin →" bağlantısı koddadır).
  visa_types_title = NULL,
  visa_types_lead = NULL,
  visa_types_description = 'İsveç''e yapacağınız seyahatin amacı, başvurmanız gereken vize türünü belirler. Aşağıda İsveç için en sık başvurulan vize türlerini inceleyebilirsiniz.',

  -- /vize-turleri/isvec hero açıklaması.
  visa_types_hero_description = 'İsveç; kısa süreli seyahatler için Schengen (C Tipi) vizesi, uzun süreli eğitim, çalışma ve aile birleşimi planları için ise oturum/çalışma izni süreçleri yürütür. Aşağıda İsveç için en sık başvurulan vize türlerini ve kapsamlarını inceleyebilirsiniz.'
WHERE slug = 'isvec';

-- ── Vize türleri (açılır-kapanır liste) ─────────────────────
DELETE FROM country_visa_types
  WHERE country_id = (SELECT id FROM countries WHERE slug = 'isvec');

INSERT INTO country_visa_types (country_id, title, description, sort_order)
SELECT c.id, v.title, v.description, v.sort_order
FROM countries c, (VALUES
  ('İsveç Turistik Vizesi',
   'Tatil, gezi, kültürel etkinlikler ve bireysel seyahatler amacıyla İsveç''e gitmek isteyen kişilerin başvurabileceği Schengen (C Tipi) vizedir.', 0),
  ('İsveç Ticari Vizesi',
   'İş görüşmesi, şirket ziyareti, toplantı, fuar ve ticari etkinliklere katılım amacıyla yapılan seyahatler için başvurulan Schengen (C Tipi) vizedir.', 1),
  ('İsveç Aile Ziyareti Vizesi',
   'İsveç''te yaşayan aile bireylerini veya yakınlarını ziyaret etmek isteyen kişilerin başvurabileceği Schengen (C Tipi) vizedir.', 2),
  ('İsveç Aile Birleşimi Vizesi',
   'İsveç''te yasal olarak yaşayan aile bireylerinin yanına uzun süreli yerleşim amacıyla başvurulan oturum izni sürecidir.', 3),
  ('İsveç Öğrenci Vizesi',
   'İsveç''te üniversite eğitimi veya diğer uzun süreli eğitim programlarına katılacak kişilerin başvurabileceği oturum izni sürecidir.', 4),
  ('İsveç Çalışma Vizesi',
   'İsveç''te bir işveren yanında çalışmak, istihdam edilmek veya mesleki faaliyet yürütmek isteyen kişilerin başvurması gereken çalışma izni sürecidir.', 5),
  ('İsveç Transit Vizesi',
   'İsveç üzerinden başka bir ülkeye transit geçiş yapacak ve transit vizeye tabi olan yolcuların başvurabileceği Schengen (C Tipi) vizedir.', 6),
  ('İsveç Fuar, Kültürel Etkinlik ve Konferans Vizesi',
   'İsveç''te düzenlenen fuar, kongre, konferans ile kültürel veya bilimsel etkinliklere katılım amacıyla başvurulan Schengen (C Tipi) vizedir.', 7)
) AS v(title, description, sort_order)
WHERE c.slug = 'isvec';

-- ── Başvuru süreci adımları ─────────────────────────────────
-- Dokümandaki anlatım, bölümün numaralı adım düzenine bölündü.
DELETE FROM country_process_steps
  WHERE country_id = (SELECT id FROM countries WHERE slug = 'isvec');

INSERT INTO country_process_steps (country_id, title, description, sort_order)
SELECT c.id, s.title, s.description, s.sort_order
FROM countries c, (VALUES
  ('Vize Türünün Belirlenmesi',
   'İsveç vize başvurusu, seyahat amacınıza uygun vize türünün belirlenmesiyle başlar. Doğru vize türü, dosyanızın tutarlılığını belirleyen ilk adımdır.', 0),
  ('Form ve Evrak Hazırlığı',
   'İsveç vize başvuru formu doldurulur ve seyahat planınızı destekleyen belgeler hazırlanır.', 1),
  ('Randevu, Evrak Teslimi ve Biyometrik İşlemler',
   'Randevu tarihinde VFS Global başvuru merkezinde evrak teslimi yapılır ve biyometrik işlemler gerçekleştirilir. Son 59 ay içinde biyometrik verileri alınmış olan ve ilgili koşulları karşılayan başvuru sahiplerinin yeniden şahsen başvurması gerekmeyebilir. İlk kez başvuran veya geçerli biyometrik verisi bulunmayan başvuru sahiplerinin ise şahsen başvurması gerekir.', 2),
  ('Değerlendirme Süreci',
   'Başvuru dosyanız teslim edildikten sonra değerlendirme süreci başlar. Konsolosluk veya yetkili makamlar gerekli gördüğü durumlarda ek belge talep edebilir.', 3),
  ('Sonuç ve Pasaport Teslimi',
   'Değerlendirme tamamlandığında pasaportunuz VFS Global aracılığıyla teslim edilir. İsveç''in Türkiye''deki resmî bilgilerine göre normal değerlendirme süresi 15 gündür; VFS Global ile konsolosluk arasındaki gidiş-dönüş süreci için ayrıca 4–6 iş günü gerekebilir.', 4)
) AS s(title, description, sort_order)
WHERE c.slug = 'isvec';

-- ── Sıkça sorulan sorular ───────────────────────────────────
DELETE FROM country_faqs
  WHERE country_id = (SELECT id FROM countries WHERE slug = 'isvec');

INSERT INTO country_faqs (country_id, question, answer, sort_order)
SELECT c.id, f.question, f.answer, f.sort_order
FROM countries c, (VALUES
  ('İsveç vize başvurusunu ne kadar önce yapmalıyım?',
   'Schengen vize başvuruları, planlanan seyahat tarihinden en erken 6 ay önce yapılabilir. Randevu yoğunlukları ve değerlendirme süresi göz önünde bulundurulduğunda, başvurunuzu seyahatinizden en az 4–6 hafta önce tamamlamanız tavsiye edilir. İsveç''in resmî bilgilerine göre başvurunun kural olarak seyahatten en az 15 takvim günü önce sunulması gerekir.', 0),
  ('İsveç vizesi kaç günde sonuçlanır?',
   'Schengen vize başvuruları, normal şartlarda başvurunun konsolosluğa ulaşmasının ardından 15 gün içerisinde sonuçlandırılır. VFS Global ile konsolosluk arasındaki gidiş-dönüş süreci için ayrıca 4–6 iş günü gerekebilir. Ek belge veya daha ayrıntılı inceleme gereken durumlarda süreç uzayabilir.', 1),
  ('İsveç vize ücreti ne kadar?',
   'İsveç vize başvuru ücreti; başvurulan vize türüne ve başvuru sahibinin yaşına göre değişiklik gösterebilir. Türkiye''deki güncel Schengen vize ücretleri İsveç''in resmî sayfasında yayımlanmaktadır. Ayrıca VFS Global tarafından vize ücretine ek olarak başvuru başına hizmet bedeli alınmaktadır.', 2),
  ('İsveç vizesi için banka hesabımda ne kadar para bulunmalıdır?',
   'İsveç vize başvurusunda seyahat süreniz boyunca ulaşım, konaklama ve diğer masraflarınızı karşılayabilecek yeterli finansal kaynağa sahip olduğunuzu göstermeniz gerekir. Bununla birlikte yalnızca hesap bakiyesi değil; gelir durumunuz, hesap hareketleriniz ve sunduğunuz diğer belgeler de birlikte değerlendirilir. Bu nedenle önemli olan belirli bir tutar göstermekten ziyade, finansal durumunuzun başvuru dosyanızla tutarlı olmasıdır.', 3),
  ('İsveç vizesi için pasaportumun en az kaç ay geçerliliği olmalıdır?',
   'Schengen kuralları gereği pasaportunuzun, planlanan dönüş tarihinizden itibaren en az 3 ay daha geçerli olması gerekir. Ayrıca pasaportunuzun son 10 yıl içinde düzenlenmiş olması ve en az 2 boş sayfa içermesi gerekir. İsveç makamları ayrıca pasaportun başvuru sahibinin imzasını taşımasına ilişkin koşullar uygulamaktadır.', 4),
  ('İsveç vizesi için parmak izi vermem gerekir mi?',
   'Schengen vize başvurularında biyometrik veri alınır. Ancak son 59 ay içinde Schengen vizesi için biyometrik verileriniz alınmış ve ilgili kayıt geçerli ise yeniden şahsen başvurmanız veya parmak izi vermeniz gerekmeyebilir. İlk kez başvuran veya bu koşulu karşılamayan kişilerin başvuru merkezine şahsen gitmesi gerekir.', 5),
  ('İsveç vizesi ile diğer Schengen ülkelerine seyahat edebilir miyim?',
   'İsveç tarafından verilen bir Schengen vizesi ile diğer Schengen ülkelerine seyahat edebilirsiniz. Ancak kural olarak seyahatinizdeki ana destinasyonun İsveç olması gerekir. Ayrıca sınır kontrolünde seyahat amacınızı ve planınızı destekleyen belgeleri yanınızda bulundurmanız önemlidir.', 6),
  ('İsveç Schengen vizesi ne kadar süreyle verilir?',
   'İsveç tarafından verilen Schengen vizelerinin geçerlilik süresi, başvuru sahibinin seyahat geçmişi, seyahat amacı ve başvuru dosyasının değerlendirilmesine göre değişiklik gösterebilir. Vizenin geçerlilik süresi ve izin verilen kalış süresi tamamen yetkili makamların değerlendirmesi doğrultusunda belirlenir.', 7),
  ('İsveç vize başvuruları en çok hangi nedenlerle reddedilir?',
   'İsveç vize başvurularının reddedilmesindeki yaygın nedenler arasında; başvuru dosyasındaki bilgi ve belgelerin yetersiz veya tutarsız bulunması, finansal yeterliliğin yeterince gösterilememesi, seyahat amacının açık şekilde belgelenememesi ve başvuru sahibinin vize şartlarını karşılamadığı kanaatinin oluşması yer alır. İsveç''in resmî vize bilgilerinde de eksik belgelerin başvurunun reddedilmesine neden olabileceği belirtilmektedir.', 8),
  ('İsveç vize başvurum reddedilirse tekrar başvuru yapabilir miyim?',
   'İsveç vize başvurunuzun reddedilmesi, yeniden başvuru yapmanıza engel değildir. Ancak yeni bir başvuru yapmadan önce ret gerekçesinin dikkatle değerlendirilmesi ve ret kararına neden olan eksiklik veya tutarsızlıkların giderilmesi önemlidir.', 9),
  ('İlk girişimi İsveç''ten yapmak zorunda mıyım?',
   'İlk uçuşunuzu veya girişinizi başka bir Schengen ülkesinden yapabilirsiniz. Ancak vizeyi İsveç''ten aldıysanız, seyahatinizin ana hedefinin İsveç olması veya en uzun konaklamayı İsveç''te yapmanız gerekir. Schengen vizesi başvurusu ana destinasyon ülkesine yapılmalıdır.', 10)
) AS f(question, answer, sort_order)
WHERE c.slug = 'isvec';

COMMIT;
