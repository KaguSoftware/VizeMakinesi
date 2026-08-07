-- ============================================================
-- ALMANYA (/vize/almanya) İÇERİK DOLGUSU
--
-- Admin panelinden tek tek girilmesi gereken alanları toplu
-- olarak doldurur. Yalnızca 'almanya' satırını etkiler.
--
-- ÖNCE 0013 ve 0014 çalıştırılmalıdır (general_info_*,
-- visa_types_* kolonları ve country_visa_types tablosu).
--
-- Tekrar çalıştırılabilir: alt tablolardaki eski satırlar
-- silinip yeniden eklenir.
--
-- KAPSAM DIŞI: PDF belgeler (country_documents) — istendiği
-- üzere atlandı.
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
  general_info_description = 'Almanya vize başvurunuza başlamadan önce aşağıdaki temel bilgileri bilmeniz, süreci doğru planlamanıza yardımcı olacaktır.',
  general_info = ARRAY[
    'Vize Zorunluluğu: Türkiye Cumhuriyeti umuma mahsus (bordo) pasaport sahipleri, Almanya''ya seyahat etmeden önce vize almak zorundadır.',
    'Vizeden Muaf Pasaportlar: Hususi (yeşil), hizmet (gri) ve diplomatik (siyah) pasaport sahipleri, 180 gün içinde 90 günü aşmayan seyahatlerinde vizeden muaftır.',
    'Doğru Başvuru Ülkesi: Schengen vizesi başvurusu, seyahatinizde en uzun süre kalmayı planladığınız ülkenin temsilciliğine yapılmalıdır. Birden fazla Schengen ülkesinde eşit süre kalmayı planlıyorsanız, başvurunuzu ilk giriş yapacağınız ülkenin temsilciliğine yapmanız gerekir.',
    'Başvuru Merkezi: Almanya vize başvuruları, ikamet ettiğiniz il için yetkilendirilmiş iDATA başvuru merkezleri aracılığıyla kabul edilir.',
    'Ülkeye Giriş Yetkisi: Schengen vizesi sahibi olmak, ülkeye giriş hakkının kesin olarak tanındığı anlamına gelmez. Nihai değerlendirme, sınır kontrolü sırasında yetkili makamlar tarafından yapılır.'
  ],

  -- "Hangi Vize Türüne Başvurmalısınız?" bölümü.
  -- Başlık ve giriş cümlesi NULL → site varsayılanlarını kullanır
  -- ("Vize türlerini detaylı inceleyin →" bağlantısı koddadır).
  visa_types_title = NULL,
  visa_types_lead = NULL,
  visa_types_description = 'Almanya''ya yapacağınız seyahatin amacı, başvurmanız gereken vize türünü belirler. Aşağıda Almanya için en sık başvurulan vize türlerini inceleyebilirsiniz.'
WHERE slug = 'almanya';

-- ── Vize türleri (açılır-kapanır liste) ─────────────────────
DELETE FROM country_visa_types
  WHERE country_id = (SELECT id FROM countries WHERE slug = 'almanya');

INSERT INTO country_visa_types (country_id, title, description, sort_order)
SELECT c.id, v.title, v.description, v.sort_order
FROM countries c, (VALUES
  ('Almanya Turistik Vizesi',
   'Tatil, gezi, kültürel etkinlikler ve bireysel seyahatler amacıyla Almanya''ya gitmek isteyen kişilerin başvurabileceği Schengen (C Tipi) vizedir.', 0),
  ('Almanya Ticari Vizesi',
   'İş görüşmesi, şirket ziyareti, toplantı, fuar ve ticari etkinliklere katılım amacıyla yapılan seyahatler için başvurulan Schengen (C Tipi) vizedir.', 1),
  ('Almanya Aile Ziyareti Vizesi',
   'Almanya''da yaşayan aile bireylerini veya yakınlarını ziyaret etmek isteyen kişilerin başvurabileceği Schengen (C Tipi) vizedir.', 2),
  ('Almanya Aile Birleşimi Vizesi',
   'Almanya''da yasal olarak yaşayan aile bireylerinin yanına uzun süreli yerleşim amacıyla başvurulan Ulusal (D Tipi) vizedir.', 3),
  ('Almanya Öğrenci Vizesi',
   'Almanya''da üniversite eğitimi, dil kursu veya diğer uzun süreli eğitim programlarına katılacak kişilerin başvurabileceği Ulusal (D Tipi) vizedir.', 4),
  ('Almanya Çalışma Vizesi',
   'Almanya''da bir işveren yanında çalışmak, istihdam edilmek veya mesleki faaliyet yürütmek isteyen kişilerin başvurabileceği Ulusal (D Tipi) vizedir.', 5),
  ('Almanya Transit Vizesi',
   'Almanya üzerinden başka bir ülkeye transit geçiş yapacak ve transit vizeye tabi olan yolcuların başvurabileceği Schengen (C Tipi) vizedir.', 6),
  ('Almanya Fuar, Kültürel Etkinlik ve Konferans Vizesi',
   'Almanya''da düzenlenen fuar, kongre, konferans ile kültürel veya bilimsel etkinliklere katılım amacıyla başvurulan Schengen (C Tipi) vizedir.', 7)
) AS v(title, description, sort_order)
WHERE c.slug = 'almanya';

-- ── Başvuru süreci adımları ─────────────────────────────────
-- Metindeki anlatım, bölümün numaralı adım düzenine bölündü.
DELETE FROM country_process_steps
  WHERE country_id = (SELECT id FROM countries WHERE slug = 'almanya');

INSERT INTO country_process_steps (country_id, title, description, sort_order)
SELECT c.id, s.title, s.description, s.sort_order
FROM countries c, (VALUES
  ('Vize Türünün Belirlenmesi',
   'Almanya vize başvurusu, seyahat amacınıza uygun vize türünün belirlenmesiyle başlar. Doğru vize türü, dosyanızın tutarlılığını belirleyen ilk adımdır.', 0),
  ('Form ve Evrak Hazırlığı',
   'Almanya vize başvuru formu doldurulur ve seyahat planınızı destekleyen belgeler hazırlanır.', 1),
  ('Randevu, Evrak Teslimi ve Biyometrik İşlemler',
   'Randevu tarihinde başvuru merkezinde evrak teslimi yapılır ve biyometrik işlemler gerçekleştirilir. Schengen vize başvurularında parmak izi ve biyometrik fotoğraf işlemleri zorunludur. Daha önceki Schengen başvurularınızda alınan biyometrik veriler geçerli ise yeniden parmak izi vermeniz gerekmeyebilir.', 2),
  ('Değerlendirme Süreci',
   'Başvuru dosyanız teslim edildikten sonra değerlendirme süreci başlar. Konsolosluk veya yetkili makamlar gerekli gördüğü durumlarda ek belge talep edebilir.', 3),
  ('Sonuç ve Pasaport Teslimi',
   'Değerlendirme tamamlandığında pasaportunuz başvuru merkezi aracılığıyla teslim edilir. Vizenizin onaylanması halinde pasaportunuz içerisinde vize etiketiyle birlikte teslim edilir; başvurunun olumsuz sonuçlanması halinde ise ret gerekçesini içeren karar formu ile birlikte pasaportunuz tarafınıza iade edilir.', 4)
) AS s(title, description, sort_order)
WHERE c.slug = 'almanya';

-- ── Sıkça sorulan sorular ───────────────────────────────────
-- Eski seed satırları (0003) dahil tüm SSS'ler bu listeyle
-- değiştirilir. ✅ işaretleri bileşende gerekli değil.
DELETE FROM country_faqs
  WHERE country_id = (SELECT id FROM countries WHERE slug = 'almanya');

INSERT INTO country_faqs (country_id, question, answer, sort_order)
SELECT c.id, f.question, f.answer, f.sort_order
FROM countries c, (VALUES
  ('Almanya vize başvurusunu ne kadar önce yapmalıyım?',
   'Schengen vize başvuruları, planlanan seyahat tarihinden en erken 6 ay önce yapılabilir. Randevu yoğunlukları ve değerlendirme süresi göz önünde bulundurulduğunda, başvurunuzu seyahatinizden en az 4–6 hafta önce tamamlamanız tavsiye edilir. Özellikle yoğun başvuru dönemlerinde randevu süreleri uzayabileceğinden başvurunuzu mümkün olduğunca erken planlamanız tavsiye edilir.', 0),
  ('Almanya vizesi kaç günde sonuçlanır?',
   'Schengen vize başvuruları, normal şartlarda başvurunun konsolosluğa ulaşmasının ardından genellikle 15 takvim günü içerisinde sonuçlandırılır. Ancak ek belge talep edilmesi, yoğun başvuru dönemleri veya başvurunun detaylı incelemeye alınması durumunda bu süre uzayabilir. Seyahat planınızı riske atmamak için başvurunuzu son güne bırakmamanız önerilir.', 1),
  ('Almanya vize ücreti ne kadar?',
   'Almanya vize başvuru ücreti; başvurulan vize türüne, başvuru sahibinin yaşına ve uygulanacak konsolosluk tarifesine göre değişiklik gösterebilir. Toplam maliyet; konsolosluk harcı, yetkili başvuru merkezi hizmet bedeli ve tercih edilmesi hâlinde seyahat sağlık sigortası veya ek başvuru hizmetlerinden oluşur. Başvuru öncesinde ödenecek tüm ücret kalemlerinin güncel tutarlarını öğrenmeniz, süreci doğru planlamanız açısından önemlidir.', 2),
  ('Almanya vizesi için banka hesabımda ne kadar para bulunmalıdır?',
   'Almanya Konsolosluğu tarafından belirlenmiş resmi bir minimum banka bakiyesi bulunmamaktadır. Başvurunuz değerlendirilirken hesabınızda, seyahat süreniz boyunca ulaşım, konaklama ve diğer masraflarınızı karşılayabilecek yeterli finansal kaynağın bulunması beklenir. Bununla birlikte yalnızca hesap bakiyesi değil; gelir durumunuz, hesap hareketleriniz ve sunduğunuz diğer belgeler de birlikte değerlendirilir. Bu nedenle önemli olan belirli bir tutar göstermekten ziyade, finansal durumunuzun başvuru dosyanızla tutarlı olmasıdır.', 3),
  ('Almanya vizesi için pasaportumun en az kaç ay geçerliliği olmalıdır?',
   'Schengen kuralları gereği pasaportunuzun, planlanan dönüş tarihinizden itibaren en az 3 ay daha geçerli olması gerekir. Ayrıca pasaportunuzun son 10 yıl içinde düzenlenmiş olması ve en az 2 boş sayfa içermesi zorunludur. Başvuru sürecinde olası sorunlarla karşılaşmamak adına, pasaportunuzun seyahat bitiş tarihinden sonra daha uzun süre geçerliliğini koruması tavsiye edilir.', 4),
  ('Almanya vizesi için parmak izi vermem gerekir mi?',
   'Schengen vize başvurularında biyometrik veri (parmak izi) verilmesi zorunludur. Ancak son 59 ay içinde herhangi bir Schengen ülkesi için biyometrik veri verdiyseniz, bu veriler geçerliliğini koruyorsa yeniden parmak izi vermeniz gerekmeyebilir. İlk kez başvuru yapıyorsanız veya biyometrik verilerinizin geçerlilik süresi dolmuşsa, başvuru merkezine şahsen giderek parmak izi vermeniz gerekir.', 5),
  ('Almanya vizesi ile diğer Schengen ülkelerine seyahat edebilir miyim?',
   'Almanya tarafından verilen bir Schengen vizesi ile diğer Schengen ülkelerine seyahat edebilirsiniz. Ancak kural olarak; seyahatiniz birden fazla ülkeyi kapsıyorsa en uzun konaklamayı yapacağınız veya ana giriş yapacağınız ülkenin Almanya olması gerekir. Ayrıca pasaport kontrolünde seyahat amacınızı ve planınızı kanıtlayan belgeleri (otel rezervasyonu, dönüş bileti vb.) yanınızda taşımanız önemlidir.', 6),
  ('Almanya Schengen vizesi ne kadar süreyle verilir?',
   'Almanya tarafından verilen Schengen vizelerinin geçerlilik süresi, başvuru sahibinin seyahat geçmişi, seyahat amacı ve başvuru dosyasının değerlendirilmesine göre değişiklik gösterebilir. İlk başvurularda vize süresi çoğu zaman planlanan seyahat tarihleriyle sınırlı olurken, olumlu Schengen geçmişine sahip başvuru sahiplerine daha uzun süreli ve çok girişli vizeler verilebilmektedir. Vizenin geçerlilik süresi ve giriş hakkı tamamen konsolosluğun değerlendirmesi doğrultusunda belirlenir.', 7),
  ('Almanya vize başvuruları en çok hangi nedenlerle reddedilir?',
   'Almanya vize başvurularının reddedilmesindeki en yaygın nedenler arasında; başvuru dosyasındaki bilgi ve belgelerin yetersiz veya tutarsız bulunması, finansal yeterliliğin yeterince gösterilememesi, seyahat amacının açık şekilde belgelenememesi ve başvuru sahibinin ülkesine geri döneceğine ilişkin yeterli kanaat oluşmaması yer alır.', 8),
  ('Almanya vize başvurum reddedilirse tekrar başvuru yapabilir miyim?',
   'Almanya vize başvurunuzun reddedilmesi, yeniden başvuru yapmanıza engel değildir. Ancak yeni bir başvuru yapmadan önce ret gerekçesinin dikkatle değerlendirilmesi ve ret kararına neden olan eksiklik veya tutarsızlıkların giderilmesi önemlidir. Aynı bilgi ve belgelerle yeniden başvuru yapılması farklı bir sonuç doğurmayabilir. Bu nedenle yeni başvurunun, ret gerekçeleri dikkate alınarak daha güçlü ve tutarlı bir dosya ile hazırlanması tavsiye edilir.', 9),
  ('İlk girişimi Almanya''dan yapmak zorunda mıyım?',
   'İlk uçuşunuzu veya girişinizi başka bir Schengen ülkesinden yapabilirsiniz. Ancak vizeyi Almanya''dan aldıysanız, seyahatinizin en uzun süren kısmını Almanya''da geçirmeli veya seyahatinizin ana hedefi Almanya olmalıdır.', 10)
) AS f(question, answer, sort_order)
WHERE c.slug = 'almanya';

COMMIT;
