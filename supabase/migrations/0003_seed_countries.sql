-- Run this AFTER 0001 and 0002. Idempotent: uses ON CONFLICT (slug) DO NOTHING for countries.

-- ============================================================
-- COUNTRIES
-- ============================================================

INSERT INTO countries (slug, name, flag_emoji, flag_type, flag_preset_key, visa_type, summary, mosaic_visible, mosaic_order, mosaic_span, has_tourism, tourism_intro, tourism_highlights, tourism_tips, tourism_best_time)
VALUES
  (
    'ingiltere',
    'Birleşik Krallık',
    '🇬🇧', 'preset', 'uk',
    'Standart Ziyaretçi Vizesi',
    'Altı aya kadar turizm veya iş ziyareti. Birleşik Krallık Vize Başvuru Merkezi''nde biyometrik alınması zorunludur.',
    true, 0, 'col-span-12 md:col-span-7',
    true,
    ARRAY[
      'Birleşik Krallık, tarih kokan taş sokaklarıyla ve modern metropol enerjisini bir arada barındıran nadir destinasyonlardan biri. Londra''nın çok kültürlü dokusu, Edinburgh''un orta çağ silueti ve İskoç Yaylaları''nın sisli manzaraları aynı seyahatte yaşanabilir.',
      'Şehir içi ulaşım son derece gelişmiş; treni, metrosu ve çift katlı otobüsleriyle planlamayı kolaylaştırır. Müzelerin büyük çoğunluğu ücretsizdir, bu da kültürel keşfi bütçe dostu kılar.'
    ],
    ARRAY[
      'Londra: British Museum, Tower Bridge, Westminster ve Tate Modern',
      'Edinburgh Kalesi ve Royal Mile yürüyüşü',
      'Stonehenge ve Bath''ın Roma hamamları',
      'Cotswolds''un masalsı köyleri',
      'Lake District ve İskoç Yaylaları''nda doğa rotaları'
    ],
    ARRAY[
      'Yağmur her mevsim olası — yanınıza her zaman ince bir su geçirmez ceket alın',
      'Şehirler arası seyahatte erken alınan tren biletleri yarı fiyatına düşebilir',
      'Oyster Card ya da temassız banka kartı Londra ulaşımını ciddi ucuzlatır',
      'Restoran hesabında servis ücreti dahil olabilir; iki kez ödememek için kontrol edin'
    ],
    'Mayıs–Eylül arası en açık ve ılıman dönemdir.'
  ),
  (
    'almanya',
    'Almanya',
    '🇩🇪', 'preset', 'germany',
    'Schengen / Ulusal Vize',
    '90 güne kadar kısa süreli Schengen ya da eğitim ve çalışma için ulusal D vizesi.',
    true, 1, 'col-span-12 md:col-span-5',
    true,
    ARRAY[
      'Almanya, Berlin''in çağdaş sanat sahnesinden Bavyera Alpleri''nin masalsı şatolarına uzanan geniş bir yelpaze sunar. Her bölgenin kendine özgü mutfağı, bira geleneği ve mimari kimliği vardır.',
      'Demir yolu ağı Avrupa''nın en gelişmişlerinden biridir; ICE hızlı trenleriyle ülkeyi uçtan uca rahatlıkla gezebilirsiniz.'
    ],
    ARRAY[
      'Berlin: Brandenburg Kapısı, Doğu Yakası Galerisi ve Müze Adası',
      'Münih ve Bavyera: Marienplatz, Neuschwanstein Şatosu',
      'Köln Katedrali ve Ren Vadisi şarap rotası',
      'Hamburg liman gezisi ve Speicherstadt depoları',
      'Romantische Straße üzerinde Rothenburg ve Würzburg'
    ],
    ARRAY[
      'Pazar günleri marketler büyük çoğunlukla kapalıdır; alışverişi cumartesi tamamlayın',
      'Nakit hâlâ yaygın — küçük kafelerde kart geçmeyebilir',
      'Otobanlarda hız limiti olmayan bölümler vardır ama yağmurlu havalarda dikkatli olun',
      'Eylül sonu–Ekim başı Oktoberfest için Münih''te konaklama erken tükenir'
    ],
    'Mayıs–Eylül arası şehir gezileri, Aralık ise Noel pazarları için ideal.'
  ),
  (
    'fransa',
    'Fransa',
    '🇫🇷', 'preset', 'france',
    'Schengen Kısa Süreli',
    'Fransa ve Schengen bölgesinde turizm, aile ziyareti veya iş amaçlı seyahat.',
    true, 2, 'col-span-12 md:col-span-4',
    true,
    ARRAY[
      'Fransa; Paris''in zarafeti, Provence''ın lavanta tarlaları ve Côte d''Azur''un Akdeniz koylarıyla her seyyaha farklı bir hikâye sunar. Mutfağı, şarabı ve sanat tarihi başlı başına seyahat sebebidir.',
      'Şehirler arası TGV trenleriyle Paris''ten Lyon''a iki, Marsilya''ya üç saatte ulaşabilirsiniz. Küçük kasabalar için araç kiralamak özgürlük sağlar.'
    ],
    ARRAY[
      'Paris: Louvre, Eiffel Kulesi, Montmartre ve Seine kıyısı',
      'Versailles Sarayı ve bahçeleri',
      'Mont Saint-Michel ve Normandiya kıyıları',
      'Provence: Avignon, Aix-en-Provence ve lavanta rotası',
      'Nice, Cannes ve Saint-Tropez Akdeniz hattı'
    ],
    ARRAY[
      'Müzelerde önceden online bilet alın; özellikle Louvre kuyruğu çok uzun olabilir',
      'Restoranlarda menü "formule" seçimi tek tek sipariş etmekten ucuzdur',
      'Bonjour ile başlamak servisi belirgin biçimde değiştirir',
      'Ağustos''ta yerel halkın çoğu tatildedir; bazı küçük işletmeler kapanır'
    ],
    'Nisan–Haziran ve Eylül–Ekim hem hava hem kalabalık açısından en dengeli dönem.'
  ),
  (
    'italya',
    'İtalya',
    '🇮🇹', 'preset', 'italy',
    'Schengen Turist Vizesi',
    'İtalya''da turizm, konferans veya aile amaçlı kısa süreli ziyaret.',
    true, 3, 'col-span-12 md:col-span-4',
    true,
    ARRAY[
      'İtalya, açık hava müzesi gibidir; Roma''da antik forumdan Floransa''da Rönesans atölyelerine, Venedik''te kanal yolculuklarından Amalfi''nin uçurumlu kıyılarına uzanır. Her bölgenin mutfağı belirgin biçimde farklıdır — kuzeyde tereyağı ve risotto, güneyde zeytinyağı ve domates hâkimdir.',
      'Trenitalia ve Italo hızlı trenleri büyük şehirleri verimli biçimde bağlar; küçük köyler içinse bölgesel trenler ve otobüsler kullanılır.'
    ],
    ARRAY[
      'Roma: Kolezyum, Vatikan, Trevi Çeşmesi ve Pantheon',
      'Floransa: Uffizi, Duomo ve Ponte Vecchio',
      'Venedik: San Marco Meydanı ve gondol turu',
      'Amalfi Kıyısı: Positano, Ravello ve Capri',
      'Toskana kırsalı ve Cinque Terre köyleri'
    ],
    ARRAY[
      'Restorana oturduğunuzda "coperto" denilen masa ücreti normaldir, şikâyet konusu değildir',
      'Roma ve Floransa''da kilise ziyaretlerinde omuz ve diz örtmek zorunludur',
      'Tren öncesi platformdaki sarı makineye bilet damgalatmayı unutmayın, ceza yazılır',
      'Bir cappuccino sabah 11''den sonra ısmarlanmaz; öğleden sonra espresso tercih edin'
    ],
    'Nisan–Haziran ve Eylül–Ekim; Ağustos sıcak ve kalabalıktır.'
  ),
  (
    'hollanda',
    'Hollanda',
    '🇳🇱', 'preset', 'netherlands',
    'Schengen / MVV',
    'Schengen ziyareti veya ikamet ve eğitim için uzun süreli MVV.',
    true, 4, 'col-span-12 md:col-span-4',
    true,
    ARRAY[
      'Hollanda, kanalları, bisiklet kültürü ve düz yatay ufuklarıyla Avrupa''nın en kompakt seyahat ülkelerinden biri. Amsterdam dışındaki Utrecht, Rotterdam ve Lahey gibi şehirler de kendi karakterleriyle keşfetmeye değer.',
      'Tüm ülkeyi birkaç saatte trenle dolaşabilirsiniz. Bisiklet kiralamak çoğu şehirde turist olmanın en doğal yoludur.'
    ],
    ARRAY[
      'Amsterdam: Rijksmuseum, Van Gogh Müzesi ve kanal turu',
      'Anne Frank Evi (bilet haftalar öncesinden açılır)',
      'Keukenhof lale bahçeleri (Mart sonu–Mayıs ortası)',
      'Rotterdam''ın modern mimarisi ve Cube Houses',
      'Zaanse Schans yel değirmenleri ve Giethoorn köyü'
    ],
    ARRAY[
      'Bisiklet yolu kaldırımdan ayrıdır; üzerinde durmak çarpışmaya neden olabilir',
      'Anne Frank Evi gibi popüler müzelerde bilet kapıdan satılmaz, online alın',
      'Kahve dükkânı (coffee shop) ile café farklıdır; ikincisi kahve içmek içindir',
      'Rüzgâr sürekli — şemsiye yerine kapüşonlu su geçirmez ceket pratiktir'
    ],
    'Lale mevsimi için Nisan; genel turizm için Mayıs–Eylül.'
  ),
  (
    'abd',
    'Amerika Birleşik Devletleri',
    '🇺🇸', 'preset', 'usa',
    'B1/B2 Ziyaretçi Vizesi',
    'Amerika Birleşik Devletleri''nde turizm, tıbbi tedavi veya iş toplantıları.',
    true, 5, 'col-span-12 md:col-span-7',
    true,
    ARRAY[
      'Amerika Birleşik Devletleri, kıta ölçeğinde bir seyahat olanağı sunar — Doğu Yakası''nın metropollerinden Orta Batı''nın milli parklarına, Kaliforniya kıyılarından New Orleans caz sahnesine kadar. Tek bir gezide her şeyi görmek zordur; bölgesel rotalar planlamak daha verimlidir.',
      'Şehir içi mesafeler yürünebilirken, eyaletler arası ulaşımda iç hat uçuş çoğunlukla en mantıklı seçenektir. Araç kiralamak Batı Yakası ve milli park rotaları için zorunlu denecek kadar pratiktir.'
    ],
    ARRAY[
      'New York: Manhattan, Central Park, Broadway ve müzeler',
      'Washington D.C.: Smithsonian müzeleri ve anıtlar',
      'San Francisco, Yosemite ve Big Sur kıyısı',
      'Las Vegas üzerinden Grand Canyon ve Antelope Canyon',
      'Florida: Miami sahilleri, Orlando temalı parklar ve Keys'
    ],
    ARRAY[
      'Restoran ve taksilerde %15–20 bahşiş yazılı olmasa da beklenir',
      'Etiket fiyatlarına eyalet vergisi eklenir; gerçek tutar kasada netleşir',
      'ESTA değil, vize ile giriş yapacaksınız — pasaportta vizenin görünür olduğundan emin olun',
      'Hava durumu kıtanın bir ucundan diğerine ciddi değişir; kapsamlı bagaj planlayın'
    ],
    'Mayıs–Ekim; ancak Florida ve Kaliforniya yıl boyu uygundur.'
  ),
  (
    'kanada',
    'Kanada',
    '🇨🇦', 'preset', 'canada',
    'Ziyaretçi Kaydı / TRV',
    'Turizm, aile veya iş amaçlı Geçici Oturma Vizesi — tek veya çoklu giriş.',
    true, 6, 'col-span-12 md:col-span-5',
    true,
    ARRAY[
      'Kanada; Vancouver''ın okyanus-dağ buluşmasından Quebec''in Fransız mirasına, Toronto metropolünden Banff''ın turkuaz göllerine uzanan dev bir doğa coğrafyasıdır. Yaz aylarında trekking, kış aylarında kayak için dünyanın önde gelen destinasyonlarından biri.',
      'Mesafeler büyüktür; Doğu ve Batı Yakası iki ayrı seyahat olarak planlanır. VIA Rail ile yapılan panoramik tren yolculuğu Kanada''yı yavaşça keşfetmenin ayrı bir biçimidir.'
    ],
    ARRAY[
      'Banff ve Jasper milli parkları, Lake Louise',
      'Vancouver, Whistler ve Vancouver Adası',
      'Toronto, CN Tower ve Niagara Şelaleleri',
      'Quebec City''nin tarihi sokakları ve Old Montreal',
      'Kuzey ışıkları için Yukon ve Northwest Territories'
    ],
    ARRAY[
      'İçecek fiyatlarına vergi ve gerekirse bahşiş eklenir; menü fiyatı son fiyat değildir',
      'Milli parklara giriş için Parks Canada günlük veya yıllık geçişi gerekir',
      'Ayı uyarılarına ciddi yaklaşın; rotalarda yiyecek koklatmamak önemli',
      'Kışın -20°C altındaki sıcaklıklar normaldir; katmanlı giyinin'
    ],
    'Doğa için Haziran–Eylül; kış sporları için Aralık–Mart.'
  ),
  (
    'avustralya',
    'Avustralya',
    '🇦🇺', 'preset', 'australia',
    'Ziyaretçi Vizesi Alt Sınıf 600',
    'Avustralya''da turizm, iş veya aile ziyareti; tam çevrimiçi başvuru.',
    true, 7, 'col-span-12 md:col-span-3',
    true,
    ARRAY[
      'Avustralya, kıta-büyüklüğünde bir ada — Sidney''in ikonik liman silüetinden Büyük Mercan Resifi''nin sualtı dünyasına, Outback''in kızıl topraklarından Tazmanya''nın el değmemiş yaylalarına. Mesafeler abartılı boyuttadır; iç hat uçuşlar planlamanın merkezindedir.',
      'Sahil şehirleri Türkiye saatine göre tersine bir mevsim takvimine sahiptir; Aralık–Şubat yaz, Haziran–Ağustos kıştır. Bu, planlamanızı tamamen değiştirecek tek detaydır.'
    ],
    ARRAY[
      'Sidney: Opera Binası, Bondi Plajı ve Liman Köprüsü',
      'Büyük Mercan Resifi''nde dalış veya snorkel',
      'Uluru / Ayers Rock ve Kızıl Merkez',
      'Melbourne kafe kültürü ve Great Ocean Road',
      'Tazmanya''da Cradle Mountain ve Hobart'
    ],
    ARRAY[
      'Güneş aşırı kuvvetlidir — yüksek SPF''li güneş kremi ve şapka şart',
      'Plajlarda yalnızca sarı-kırmızı bayrak arası yüzülmesi tavsiye edilir',
      'Yaban hayatı yakınlığı uyarılara her zaman uyun, özellikle yılan ve örümcek için',
      'Mesafeleri saatle değil, uçuşla hesaplayın; iç hat ucuza alınabilir'
    ],
    'Sidney/Melbourne için Eylül–Kasım ve Mart–Mayıs; resif için Haziran–Ekim.'
  ),
  (
    'bae',
    'Birleşik Arap Emirlikleri',
    '🇦🇪', 'preset', 'uae',
    '30 / 60 Günlük Turist Vizesi',
    'Tek veya çoklu girişli turist vizesi; tamamen elektronik, hızlı işlem.',
    true, 8, 'col-span-12 md:col-span-4',
    true,
    ARRAY[
      'Birleşik Arap Emirlikleri, çölün ortasında yükselmiş ultra-modern bir destinasyondur. Dubai''nin gökdelenleri ve alışveriş merkezleriyle Abu Dabi''nin sanat ve kültür yatırımları birbirini tamamlar.',
      'Şehir içi metro ve taksi sistemi son derece düzenlidir; Uber ve Careem yaygındır. Çölde safari turları neredeyse her ziyaretçinin programına girer.'
    ],
    ARRAY[
      'Burj Khalifa ve Dubai Mall çevresi',
      'Eski Dubai: Al Fahidi tarihi mahallesi ve baharat çarşısı',
      'Palm Jumeirah ve Atlantis adası',
      'Abu Dabi: Şeyh Zayed Camii ve Louvre Abu Dabi',
      'Çöl safarisi, deve turu ve dune-bashing deneyimi'
    ],
    ARRAY[
      'Halka açık alanlarda kıyafet kuralı vardır; omuz ve diz örtülmelidir',
      'Ramazan ayında gündüz yeme-içme yalnızca otel içinde mümkündür',
      'Alkol yalnızca lisanslı otel ve restoranlarda servis edilir',
      'Yaz aylarında dış mekân sıcaklığı 45°C''yi geçer; aktiviteleri sabah ve akşam planlayın'
    ],
    'Kasım–Mart arası en konforlu dönemdir.'
  ),
  (
    'schengen',
    'Schengen Bölgesi',
    '🇪🇺', 'preset', 'schengen',
    'Schengen Kısa Süreli (Type C)',
    'Tek vize, 29 ülke — ana varış ülkenizin konsolosluğuna başvurun.',
    true, 9, 'col-span-12 md:col-span-5',
    false,
    NULL, NULL, NULL, NULL
  )
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- CHILD ROWS (requirements, handles, faqs)
-- Wrapped in anonymous block; skips silently if country missing
-- or if rows already exist for that country.
-- ============================================================

DO $$ BEGIN

-- uk requirements
IF EXISTS (SELECT 1 FROM countries WHERE slug = 'ingiltere')
   AND NOT EXISTS (SELECT 1 FROM country_requirements WHERE country_id = (SELECT id FROM countries WHERE slug = 'ingiltere'))
THEN
  INSERT INTO country_requirements (country_id, text, sort_order) VALUES
    ((SELECT id FROM countries WHERE slug = 'ingiltere'), 'En az 6 ay geçerliliği olan pasaport', 0),
    ((SELECT id FROM countries WHERE slug = 'ingiltere'), 'Son çekilmiş vesikalık fotoğraf', 1),
    ((SELECT id FROM countries WHERE slug = 'ingiltere'), 'Son 6 aylık banka ekstreleri', 2),
    ((SELECT id FROM countries WHERE slug = 'ingiltere'), 'Birleşik Krallık''ta konaklama kanıtı', 3),
    ((SELECT id FROM countries WHERE slug = 'ingiltere'), 'Dönüş uçuşu rezervasyonu', 4),
    ((SELECT id FROM countries WHERE slug = 'ingiltere'), 'Tüm konaklamayı kapsayan seyahat sigortası', 5),
    ((SELECT id FROM countries WHERE slug = 'ingiltere'), 'Çalışma belgesi veya ticaret sicili', 6);
END IF;

-- uk handles
IF EXISTS (SELECT 1 FROM countries WHERE slug = 'ingiltere')
   AND NOT EXISTS (SELECT 1 FROM country_handles WHERE country_id = (SELECT id FROM countries WHERE slug = 'ingiltere'))
THEN
  INSERT INTO country_handles (country_id, text, sort_order) VALUES
    ((SELECT id FROM countries WHERE slug = 'ingiltere'), 'Tüm belgelerin UKVI kontrol listelerine göre ön taraması', 0),
    ((SELECT id FROM countries WHERE slug = 'ingiltere'), 'Çevrimiçi VAF randevusu ve biyometrik programlaması', 1),
    ((SELECT id FROM countries WHERE slug = 'ingiltere'), 'Kapak mektubu ve güzergah taslağı hazırlama', 2),
    ((SELECT id FROM countries WHERE slug = 'ingiltere'), 'Destekleyici belgelerin çevirisi ve noterden geçirilmesi', 3),
    ((SELECT id FROM countries WHERE slug = 'ingiltere'), 'Karar açıklanana kadar durum takibi ve konsolosluk irtibatı', 4);
END IF;

-- uk faqs
IF EXISTS (SELECT 1 FROM countries WHERE slug = 'ingiltere')
   AND NOT EXISTS (SELECT 1 FROM country_faqs WHERE country_id = (SELECT id FROM countries WHERE slug = 'ingiltere'))
THEN
  INSERT INTO country_faqs (country_id, question, answer, sort_order) VALUES
    ((SELECT id FROM countries WHERE slug = 'ingiltere'), 'Birleşik Krallık ziyaretçi vizesi ne kadar sürer?', 'Biyometrikten itibaren standart işlem süresi 3 haftadır. Öncelikli hizmetle bu süre 5 iş gününe kısalır.', 0),
    ((SELECT id FROM countries WHERE slug = 'ingiltere'), 'Birleşik Krallık içinde kalış süresini uzatabilir miyim?', 'Ziyaretçi vizeleri 6 ayın ötesine uzatılamaz. Birleşik Krallık dışından yeni başvuru yapılması gerekmektedir.', 1),
    ((SELECT id FROM countries WHERE slug = 'ingiltere'), 'Birikimimi göstermem gerekiyor mu?', 'Sabit bir tutar yoktur; ancak başarılı başvuru sahiplerinin büyük çoğunluğu seyahati karşılayacak düzenli gelir ve birikim göstermektedir.', 2);
END IF;

-- germany requirements
IF EXISTS (SELECT 1 FROM countries WHERE slug = 'almanya')
   AND NOT EXISTS (SELECT 1 FROM country_requirements WHERE country_id = (SELECT id FROM countries WHERE slug = 'almanya'))
THEN
  INSERT INTO country_requirements (country_id, text, sort_order) VALUES
    ((SELECT id FROM countries WHERE slug = 'almanya'), 'Dönüşten 3 ay sonrasına kadar geçerli pasaport', 0),
    ((SELECT id FROM countries WHERE slug = 'almanya'), 'İki biyometrik fotoğraf', 1),
    ((SELECT id FROM countries WHERE slug = 'almanya'), 'Onaylı uçuş ve otel rezervasyonları', 2),
    ((SELECT id FROM countries WHERE slug = 'almanya'), '30.000 Euro''luk seyahat sigortası', 3),
    ((SELECT id FROM countries WHERE slug = 'almanya'), 'Maddi güç kanıtı (günlük 45 Euro)', 4),
    ((SELECT id FROM countries WHERE slug = 'almanya'), 'Seyahat amacını belirten kapak mektubu', 5);
END IF;

-- germany handles
IF EXISTS (SELECT 1 FROM countries WHERE slug = 'almanya')
   AND NOT EXISTS (SELECT 1 FROM country_handles WHERE country_id = (SELECT id FROM countries WHERE slug = 'almanya'))
THEN
  INSERT INTO country_handles (country_id, text, sort_order) VALUES
    ((SELECT id FROM countries WHERE slug = 'almanya'), 'Şehrinizde VFS Global randevu rezervasyonu', 0),
    ((SELECT id FROM countries WHERE slug = 'almanya'), 'Gerektiğinde Almanca''ya belge çevirisi', 1),
    ((SELECT id FROM countries WHERE slug = 'almanya'), 'Schengen kurallarıyla uyumlu sigorta temini', 2),
    ((SELECT id FROM countries WHERE slug = 'almanya'), 'Başvuru formu doldurma ve inceleme', 3),
    ((SELECT id FROM countries WHERE slug = 'almanya'), 'Kurye ve pasaport iade takibi', 4);
END IF;

-- germany faqs
IF EXISTS (SELECT 1 FROM countries WHERE slug = 'almanya')
   AND NOT EXISTS (SELECT 1 FROM country_faqs WHERE country_id = (SELECT id FROM countries WHERE slug = 'almanya'))
THEN
  INSERT INTO country_faqs (country_id, question, answer, sort_order) VALUES
    ((SELECT id FROM countries WHERE slug = 'almanya'), 'Almanya vizesiyle diğer Schengen ülkelerini ziyaret edebilir miyim?', 'Evet — vize verildikten sonra, ana varış ülkesi kuralına tabi olarak tüm 29 Schengen devletinde geçerlidir.', 0),
    ((SELECT id FROM countries WHERE slug = 'almanya'), 'Ne kadar erken başvurmalıyım?', 'Seyahatten 6 hafta önce başvurmanızı öneririz. Başvurular en fazla 6 ay öncesinden yapılabilir.', 1);
END IF;

-- france requirements
IF EXISTS (SELECT 1 FROM countries WHERE slug = 'fransa')
   AND NOT EXISTS (SELECT 1 FROM country_requirements WHERE country_id = (SELECT id FROM countries WHERE slug = 'fransa'))
THEN
  INSERT INTO country_requirements (country_id, text, sort_order) VALUES
    ((SELECT id FROM countries WHERE slug = 'fransa'), 'İki boş sayfası olan pasaport', 0),
    ((SELECT id FROM countries WHERE slug = 'fransa'), 'Schengen vize başvuru formu', 1),
    ((SELECT id FROM countries WHERE slug = 'fransa'), 'Seyahat sağlık sigortası', 2),
    ((SELECT id FROM countries WHERE slug = 'fransa'), 'Otel rezervasyonu veya davet mektubu', 3),
    ((SELECT id FROM countries WHERE slug = 'fransa'), 'Çalışma ve maaş kanıtı', 4),
    ((SELECT id FROM countries WHERE slug = 'fransa'), '3 aylık banka ekstresi', 5);
END IF;

-- france handles
IF EXISTS (SELECT 1 FROM countries WHERE slug = 'fransa')
   AND NOT EXISTS (SELECT 1 FROM country_handles WHERE country_id = (SELECT id FROM countries WHERE slug = 'fransa'))
THEN
  INSERT INTO country_handles (country_id, text, sort_order) VALUES
    ((SELECT id FROM countries WHERE slug = 'fransa'), 'TLS Contact randevu planlaması', 0),
    ((SELECT id FROM countries WHERE slug = 'fransa'), 'Fransızca veya İngilizce kapak mektubu hazırlama', 1),
    ((SELECT id FROM countries WHERE slug = 'fransa'), 'Konsolosluk beklentileriyle uyumlu güzergah planlaması', 2),
    ((SELECT id FROM countries WHERE slug = 'fransa'), 'Teslim öncesi dosya denetimi', 3),
    ((SELECT id FROM countries WHERE slug = 'fransa'), 'Teslim sonrası takip', 4);
END IF;

-- france faqs
IF EXISTS (SELECT 1 FROM countries WHERE slug = 'fransa')
   AND NOT EXISTS (SELECT 1 FROM country_faqs WHERE country_id = (SELECT id FROM countries WHERE slug = 'fransa'))
THEN
  INSERT INTO country_faqs (country_id, question, answer, sort_order) VALUES
    ((SELECT id FROM countries WHERE slug = 'fransa'), 'Biyometrik her zaman gerekli midir?', 'Evet, son 59 ay içinde Schengen vizesi için biyometrik vermediyseniz gereklidir.', 0),
    ((SELECT id FROM countries WHERE slug = 'fransa'), 'Başarı oranı nedir?', 'Fransa, dosyaları eksiksiz ve tutarlı olan kısa süreli başvuruların yaklaşık yüzde seksen altısını onaylamaktadır.', 1);
END IF;

-- italy requirements
IF EXISTS (SELECT 1 FROM countries WHERE slug = 'italya')
   AND NOT EXISTS (SELECT 1 FROM country_requirements WHERE country_id = (SELECT id FROM countries WHERE slug = 'italya'))
THEN
  INSERT INTO country_requirements (country_id, text, sort_order) VALUES
    ((SELECT id FROM countries WHERE slug = 'italya'), 'Geçerli pasaport (dönüşten 3+ ay sonrasına kadar)', 0),
    ((SELECT id FROM countries WHERE slug = 'italya'), 'İki vesikalık fotoğraf', 1),
    ((SELECT id FROM countries WHERE slug = 'italya'), 'Ayrıntılı seyahat güzergahı', 2),
    ((SELECT id FROM countries WHERE slug = 'italya'), 'Konaklama kanıtı', 3),
    ((SELECT id FROM countries WHERE slug = 'italya'), 'Schengen bölgesini kapsayan sigorta', 4),
    ((SELECT id FROM countries WHERE slug = 'italya'), 'Banka ekstresi', 5);
END IF;

-- italy handles
IF EXISTS (SELECT 1 FROM countries WHERE slug = 'italya')
   AND NOT EXISTS (SELECT 1 FROM country_handles WHERE country_id = (SELECT id FROM countries WHERE slug = 'italya'))
THEN
  INSERT INTO country_handles (country_id, text, sort_order) VALUES
    ((SELECT id FROM countries WHERE slug = 'italya'), 'İtalyan konsolosluğuna özel belge kontrol listesi', 0),
    ((SELECT id FROM countries WHERE slug = 'italya'), 'Resmi portal üzerinden randevu rezervasyonu', 1),
    ((SELECT id FROM countries WHERE slug = 'italya'), 'İtalyanca veya İngilizce vize formu doldurma', 2),
    ((SELECT id FROM countries WHERE slug = 'italya'), 'Teslim öncesi mülakat hazırlığı', 3);
END IF;

-- italy faqs
IF EXISTS (SELECT 1 FROM countries WHERE slug = 'italya')
   AND NOT EXISTS (SELECT 1 FROM country_faqs WHERE country_id = (SELECT id FROM countries WHERE slug = 'italya'))
THEN
  INSERT INTO country_faqs (country_id, question, answer, sort_order) VALUES
    ((SELECT id FROM countries WHERE slug = 'italya'), 'İtalya''nın işlem süresi ne kadar?', 'Biyometrik tesliminden sonra genellikle 10 ila 15 iş günü.', 0);
END IF;

-- netherlands requirements
IF EXISTS (SELECT 1 FROM countries WHERE slug = 'hollanda')
   AND NOT EXISTS (SELECT 1 FROM country_requirements WHERE country_id = (SELECT id FROM countries WHERE slug = 'hollanda'))
THEN
  INSERT INTO country_requirements (country_id, text, sort_order) VALUES
    ((SELECT id FROM countries WHERE slug = 'hollanda'), 'Dönüşten 3 ay sonrasına kadar geçerli pasaport', 0),
    ((SELECT id FROM countries WHERE slug = 'hollanda'), 'Hollanda ICAO özelliklerine uygun fotoğraflar', 1),
    ((SELECT id FROM countries WHERE slug = 'hollanda'), 'Seyahat amacı kanıtı', 2),
    ((SELECT id FROM countries WHERE slug = 'hollanda'), 'En az 30.000 Euro''luk sağlık sigortası', 3),
    ((SELECT id FROM countries WHERE slug = 'hollanda'), 'Yeterli maddi güç (günlük 55 Euro)', 4),
    ((SELECT id FROM countries WHERE slug = 'hollanda'), 'Devam seyahati kanıtı', 5);
END IF;

-- netherlands handles
IF EXISTS (SELECT 1 FROM countries WHERE slug = 'hollanda')
   AND NOT EXISTS (SELECT 1 FROM country_handles WHERE country_id = (SELECT id FROM countries WHERE slug = 'hollanda'))
THEN
  INSERT INTO country_handles (country_id, text, sort_order) VALUES
    ((SELECT id FROM countries WHERE slug = 'hollanda'), 'VFS slot rezervasyonu', 0),
    ((SELECT id FROM countries WHERE slug = 'hollanda'), 'IND kriterlerine göre belge incelemesi', 1),
    ((SELECT id FROM countries WHERE slug = 'hollanda'), 'Nüfus cüzdanı belgelerinin çevirisi', 2),
    ((SELECT id FROM countries WHERE slug = 'hollanda'), 'Uygulanabilir durumlarda MVV yönlendirme koordinasyonu', 3);
END IF;

-- netherlands faqs
IF EXISTS (SELECT 1 FROM countries WHERE slug = 'hollanda')
   AND NOT EXISTS (SELECT 1 FROM country_faqs WHERE country_id = (SELECT id FROM countries WHERE slug = 'hollanda'))
THEN
  INSERT INTO country_faqs (country_id, question, answer, sort_order) VALUES
    ((SELECT id FROM countries WHERE slug = 'hollanda'), 'MVV nedir?', '90 günü aşan konaklamalar için gerekli olan, çoğunlukla oturma izniyle birleştirilen uzun süreli giriş vizesidir.', 0);
END IF;

-- usa requirements
IF EXISTS (SELECT 1 FROM countries WHERE slug = 'abd')
   AND NOT EXISTS (SELECT 1 FROM country_requirements WHERE country_id = (SELECT id FROM countries WHERE slug = 'abd'))
THEN
  INSERT INTO country_requirements (country_id, text, sort_order) VALUES
    ((SELECT id FROM countries WHERE slug = 'abd'), 'Konaklamanın 6 ay ötesine kadar geçerli pasaport', 0),
    ((SELECT id FROM countries WHERE slug = 'abd'), 'DS-160 onay sayfası', 1),
    ((SELECT id FROM countries WHERE slug = 'abd'), 'MRV ücret makbuzu', 2),
    ((SELECT id FROM countries WHERE slug = 'abd'), 'ABD Dışişleri Bakanlığı özelliklerine uygun fotoğraf', 3),
    ((SELECT id FROM countries WHERE slug = 'abd'), 'Ev ülkesiyle güçlü bağ kanıtı', 4),
    ((SELECT id FROM countries WHERE slug = 'abd'), 'Seyahati karşılayacak mali belgeler', 5);
END IF;

-- usa handles
IF EXISTS (SELECT 1 FROM countries WHERE slug = 'abd')
   AND NOT EXISTS (SELECT 1 FROM country_handles WHERE country_id = (SELECT id FROM countries WHERE slug = 'abd'))
THEN
  INSERT INTO country_handles (country_id, text, sort_order) VALUES
    ((SELECT id FROM countries WHERE slug = 'abd'), 'Eksiksiz DS-160 formu hazırlama', 0),
    ((SELECT id FROM countries WHERE slug = 'abd'), 'MRV ücret işlemleri', 1),
    ((SELECT id FROM countries WHERE slug = 'abd'), 'Danışmanlarımızla sahte mülakat koçluğu', 2),
    ((SELECT id FROM countries WHERE slug = 'abd'), 'Büyükelçilikte randevu planlaması', 3),
    ((SELECT id FROM countries WHERE slug = 'abd'), 'Uygun durumlarda hızlandırılmış randevu talepleri', 4);
END IF;

-- usa faqs
IF EXISTS (SELECT 1 FROM countries WHERE slug = 'abd')
   AND NOT EXISTS (SELECT 1 FROM country_faqs WHERE country_id = (SELECT id FROM countries WHERE slug = 'abd'))
THEN
  INSERT INTO country_faqs (country_id, question, answer, sort_order) VALUES
    ((SELECT id FROM countries WHERE slug = 'abd'), 'Mülakat nasıl işliyor?', 'Amaç ve bağlara odaklanan, genellikle 2 ila 5 dakika süren bir konsolosluk görevlisi görüşmesidir.', 0),
    ((SELECT id FROM countries WHERE slug = 'abd'), 'Acil randevu başvurusu yapabilir miyim?', 'Evet, tıbbi, iş veya acil seyahat durumları için. Talebi sizin adınıza biz göndeririz.', 1);
END IF;

-- canada requirements
IF EXISTS (SELECT 1 FROM countries WHERE slug = 'kanada')
   AND NOT EXISTS (SELECT 1 FROM country_requirements WHERE country_id = (SELECT id FROM countries WHERE slug = 'kanada'))
THEN
  INSERT INTO country_requirements (country_id, text, sort_order) VALUES
    ((SELECT id FROM countries WHERE slug = 'kanada'), 'Konaklamanın tüm süresi boyunca geçerli pasaport', 0),
    ((SELECT id FROM countries WHERE slug = 'kanada'), 'IMM 5257 başvuru formu', 1),
    ((SELECT id FROM countries WHERE slug = 'kanada'), 'IRCC özelliklerine uygun güncel fotoğraf', 2),
    ((SELECT id FROM countries WHERE slug = 'kanada'), 'Maddi güç kanıtı', 3),
    ((SELECT id FROM countries WHERE slug = 'kanada'), 'Seyahat amacı belgeleri', 4),
    ((SELECT id FROM countries WHERE slug = 'kanada'), 'Adli sicil belgesi (istenirse)', 5);
END IF;

-- canada handles
IF EXISTS (SELECT 1 FROM countries WHERE slug = 'kanada')
   AND NOT EXISTS (SELECT 1 FROM country_handles WHERE country_id = (SELECT id FROM countries WHERE slug = 'kanada'))
THEN
  INSERT INTO country_handles (country_id, text, sort_order) VALUES
    ((SELECT id FROM countries WHERE slug = 'kanada'), 'IRCC çevrimiçi portal yönetimi', 0),
    ((SELECT id FROM countries WHERE slug = 'kanada'), 'VAC''da biyometrik randevu rezervasyonu', 1),
    ((SELECT id FROM countries WHERE slug = 'kanada'), 'Açıklama mektubu hazırlama', 2),
    ((SELECT id FROM countries WHERE slug = 'kanada'), 'Pasaport iadesine kadar durum takibi', 3);
END IF;

-- canada faqs
IF EXISTS (SELECT 1 FROM countries WHERE slug = 'kanada')
   AND NOT EXISTS (SELECT 1 FROM country_faqs WHERE country_id = (SELECT id FROM countries WHERE slug = 'kanada'))
THEN
  INSERT INTO country_faqs (country_id, question, answer, sort_order) VALUES
    ((SELECT id FROM countries WHERE slug = 'kanada'), 'Kanada ziyaretçi vizesi ne kadar süre geçerlidir?', 'Pasaport geçerliliğine kadar veya en fazla 10 yıl; her girişte 6 aya kadar kalış hakkıyla.', 0);
END IF;

-- australia requirements
IF EXISTS (SELECT 1 FROM countries WHERE slug = 'avustralya')
   AND NOT EXISTS (SELECT 1 FROM country_requirements WHERE country_id = (SELECT id FROM countries WHERE slug = 'avustralya'))
THEN
  INSERT INTO country_requirements (country_id, text, sort_order) VALUES
    ((SELECT id FROM countries WHERE slug = 'avustralya'), 'Geçerli pasaport', 0),
    ((SELECT id FROM countries WHERE slug = 'avustralya'), 'ImmiAccount kaydı', 1),
    ((SELECT id FROM countries WHERE slug = 'avustralya'), 'Sağlık sigortası önerilir', 2),
    ((SELECT id FROM countries WHERE slug = 'avustralya'), 'Konaklama için maddi güç', 3),
    ((SELECT id FROM countries WHERE slug = 'avustralya'), 'İstenirse karakter belgeleri', 4);
END IF;

-- australia handles
IF EXISTS (SELECT 1 FROM countries WHERE slug = 'avustralya')
   AND NOT EXISTS (SELECT 1 FROM country_handles WHERE country_id = (SELECT id FROM countries WHERE slug = 'avustralya'))
THEN
  INSERT INTO country_handles (country_id, text, sort_order) VALUES
    ((SELECT id FROM countries WHERE slug = 'avustralya'), 'ImmiAccount kurulumu ve başvuru', 0),
    ((SELECT id FROM countries WHERE slug = 'avustralya'), 'Belge yükleme ve versiyon kontrolü', 1),
    ((SELECT id FROM countries WHERE slug = 'avustralya'), 'Gerekirse sağlık muayenesi koordinasyonu', 2),
    ((SELECT id FROM countries WHERE slug = 'avustralya'), 'Karar takibi', 3);
END IF;

-- australia faqs
IF EXISTS (SELECT 1 FROM countries WHERE slug = 'avustralya')
   AND NOT EXISTS (SELECT 1 FROM country_faqs WHERE country_id = (SELECT id FROM countries WHERE slug = 'avustralya'))
THEN
  INSERT INTO country_faqs (country_id, question, answer, sort_order) VALUES
    ((SELECT id FROM countries WHERE slug = 'avustralya'), 'Tıbbi muayene gerekiyor mu?', 'Yalnızca 6 ayı aşan konaklamalar veya İçişleri Bakanlığı tarafından işaretlenen durumlar için.', 0);
END IF;

-- uae requirements
IF EXISTS (SELECT 1 FROM countries WHERE slug = 'bae')
   AND NOT EXISTS (SELECT 1 FROM country_requirements WHERE country_id = (SELECT id FROM countries WHERE slug = 'bae'))
THEN
  INSERT INTO country_requirements (country_id, text, sort_order) VALUES
    ((SELECT id FROM countries WHERE slug = 'bae'), '6 ay geçerli pasaport', 0),
    ((SELECT id FROM countries WHERE slug = 'bae'), 'Renkli pasaport taraması', 1),
    ((SELECT id FROM countries WHERE slug = 'bae'), 'Beyaz arka planlı vesikalık fotoğraf', 2),
    ((SELECT id FROM countries WHERE slug = 'bae'), 'Onaylı uçuş rezervasyonu', 3);
END IF;

-- uae handles
IF EXISTS (SELECT 1 FROM countries WHERE slug = 'bae')
   AND NOT EXISTS (SELECT 1 FROM country_handles WHERE country_id = (SELECT id FROM countries WHERE slug = 'bae'))
THEN
  INSERT INTO country_handles (country_id, text, sort_order) VALUES
    ((SELECT id FROM countries WHERE slug = 'bae'), 'Onaylı kanallar üzerinden çevrimiçi başvuru', 0),
    ((SELECT id FROM countries WHERE slug = 'bae'), 'Fotoğraf uyumluluk kontrolü', 1),
    ((SELECT id FROM countries WHERE slug = 'bae'), 'E-vizenin e-posta adresinize teslimi', 2),
    ((SELECT id FROM countries WHERE slug = 'bae'), 'BAE içinde uzatma yardımı', 3);
END IF;

-- uae faqs
IF EXISTS (SELECT 1 FROM countries WHERE slug = 'bae')
   AND NOT EXISTS (SELECT 1 FROM country_faqs WHERE country_id = (SELECT id FROM countries WHERE slug = 'bae'))
THEN
  INSERT INTO country_faqs (country_id, question, answer, sort_order) VALUES
    ((SELECT id FROM countries WHERE slug = 'bae'), 'BAE e-vizesi ne kadar hızlı çıkar?', 'Genellikle 48 ila 72 saat. 24 saat içinde ekspres hizmet mevcuttur.', 0);
END IF;

-- schengen requirements
IF EXISTS (SELECT 1 FROM countries WHERE slug = 'schengen')
   AND NOT EXISTS (SELECT 1 FROM country_requirements WHERE country_id = (SELECT id FROM countries WHERE slug = 'schengen'))
THEN
  INSERT INTO country_requirements (country_id, text, sort_order) VALUES
    ((SELECT id FROM countries WHERE slug = 'schengen'), 'Son 10 yılda düzenlenmiş pasaport', 0),
    ((SELECT id FROM countries WHERE slug = 'schengen'), '30.000 Euro seyahat sigortası', 1),
    ((SELECT id FROM countries WHERE slug = 'schengen'), 'Otel ve uçuş rezervasyonları', 2),
    ((SELECT id FROM countries WHERE slug = 'schengen'), '3 aylık banka ekstresi', 3),
    ((SELECT id FROM countries WHERE slug = 'schengen'), 'Kapak mektubu ve güzergah', 4);
END IF;

-- schengen handles
IF EXISTS (SELECT 1 FROM countries WHERE slug = 'schengen')
   AND NOT EXISTS (SELECT 1 FROM country_handles WHERE country_id = (SELECT id FROM countries WHERE slug = 'schengen'))
THEN
  INSERT INTO country_handles (country_id, text, sort_order) VALUES
    ((SELECT id FROM countries WHERE slug = 'schengen'), 'Ana varış ülkesine göre doğru konsolosluğun belirlenmesi', 0),
    ((SELECT id FROM countries WHERE slug = 'schengen'), 'Birden fazla ülkeyi kapsayan güzergah yapılandırması', 1),
    ((SELECT id FROM countries WHERE slug = 'schengen'), 'Sigorta ve konaklama düzenlemeleri', 2),
    ((SELECT id FROM countries WHERE slug = 'schengen'), 'Başvuru incelemesi ve teslimi', 3);
END IF;

-- schengen faqs
IF EXISTS (SELECT 1 FROM countries WHERE slug = 'schengen')
   AND NOT EXISTS (SELECT 1 FROM country_faqs WHERE country_id = (SELECT id FROM countries WHERE slug = 'schengen'))
THEN
  INSERT INTO country_faqs (country_id, question, answer, sort_order) VALUES
    ((SELECT id FROM countries WHERE slug = 'schengen'), 'Hangi konsolosluğa başvurmalıyım?', 'En uzun süre geçireceğiniz ülkeye. Süre eşitse, ilk giriş ülkesine.', 0);
END IF;

END $$;

-- ============================================================
-- MEGA MENU
-- ============================================================

DO $$ BEGIN

IF NOT EXISTS (SELECT 1 FROM mega_menu_categories WHERE name = 'Avrupa') THEN
  INSERT INTO mega_menu_categories (name, sort_order, visible) VALUES ('Avrupa', 0, true);
END IF;

IF NOT EXISTS (SELECT 1 FROM mega_menu_categories WHERE name = 'Amerika') THEN
  INSERT INTO mega_menu_categories (name, sort_order, visible) VALUES ('Amerika', 1, true);
END IF;

IF NOT EXISTS (SELECT 1 FROM mega_menu_categories WHERE name = 'Asya ve Pasifik') THEN
  INSERT INTO mega_menu_categories (name, sort_order, visible) VALUES ('Asya ve Pasifik', 2, true);
END IF;

END $$;

DO $$ BEGIN

-- Avrupa items
IF NOT EXISTS (
  SELECT 1 FROM mega_menu_items
  WHERE category_id = (SELECT id FROM mega_menu_categories WHERE name = 'Avrupa')
)
THEN
  INSERT INTO mega_menu_items (category_id, country_id, sort_order, visible) VALUES
    ((SELECT id FROM mega_menu_categories WHERE name = 'Avrupa'), (SELECT id FROM countries WHERE slug = 'ingiltere'),          0, true),
    ((SELECT id FROM mega_menu_categories WHERE name = 'Avrupa'), (SELECT id FROM countries WHERE slug = 'almanya'),     1, true),
    ((SELECT id FROM mega_menu_categories WHERE name = 'Avrupa'), (SELECT id FROM countries WHERE slug = 'fransa'),      2, true),
    ((SELECT id FROM mega_menu_categories WHERE name = 'Avrupa'), (SELECT id FROM countries WHERE slug = 'italya'),       3, true),
    ((SELECT id FROM mega_menu_categories WHERE name = 'Avrupa'), (SELECT id FROM countries WHERE slug = 'hollanda'), 4, true),
    ((SELECT id FROM mega_menu_categories WHERE name = 'Avrupa'), (SELECT id FROM countries WHERE slug = 'schengen'),    5, true);
END IF;

-- Amerika items
IF NOT EXISTS (
  SELECT 1 FROM mega_menu_items
  WHERE category_id = (SELECT id FROM mega_menu_categories WHERE name = 'Amerika')
)
THEN
  INSERT INTO mega_menu_items (category_id, country_id, sort_order, visible) VALUES
    ((SELECT id FROM mega_menu_categories WHERE name = 'Amerika'), (SELECT id FROM countries WHERE slug = 'abd'),    0, true),
    ((SELECT id FROM mega_menu_categories WHERE name = 'Amerika'), (SELECT id FROM countries WHERE slug = 'kanada'), 1, true);
END IF;

-- Asya ve Pasifik items
IF NOT EXISTS (
  SELECT 1 FROM mega_menu_items
  WHERE category_id = (SELECT id FROM mega_menu_categories WHERE name = 'Asya ve Pasifik')
)
THEN
  INSERT INTO mega_menu_items (category_id, country_id, sort_order, visible) VALUES
    ((SELECT id FROM mega_menu_categories WHERE name = 'Asya ve Pasifik'), (SELECT id FROM countries WHERE slug = 'avustralya'), 0, true),
    ((SELECT id FROM mega_menu_categories WHERE name = 'Asya ve Pasifik'), (SELECT id FROM countries WHERE slug = 'bae'),       1, true);
END IF;

END $$;

-- ============================================================
-- MARQUEE
-- ============================================================

DO $$ BEGIN

-- nav_ticker items
IF NOT EXISTS (SELECT 1 FROM marquee_items WHERE location = 'nav_ticker') THEN
  INSERT INTO marquee_items (location, text, url, visible, sort_order) VALUES
    ('nav_ticker', '— Hafta içi 18:00''a kadar açık', NULL, true, 0),
    ('nav_ticker', '· Schengen işlem süresi 12 iş günü',  NULL, true, 1),
    ('nav_ticker', '· ABD hızlandırma ',                  NULL, true, 2),
    ('nav_ticker', '· Bu gün arayın ',                    NULL, true, 3),
    ('nav_ticker', '· +90 530 775 31 31',                 NULL, true, 4),
    ('nav_ticker', '· Sekreterımızle görüşün',            NULL, true, 5);
END IF;

-- home marquee items
IF NOT EXISTS (SELECT 1 FROM marquee_items WHERE location = 'home') THEN
  INSERT INTO marquee_items (location, text, url, visible, sort_order) VALUES
    ('home', 'İngiltere Ziyaretçi Vizesi',  NULL, true, 0),
    ('home', 'Schengen Vizesi',             NULL, true, 1),
    ('home', 'ABD B1/B2 Vizesi',            NULL, true, 2),
    ('home', 'Avustralya Turist Vizesi',    NULL, true, 3),
    ('home', 'Almanya Ulusal Vizesi',       NULL, true, 4),
    ('home', 'Avustralya Vizesi ',          NULL, true, 5);
END IF;

-- marquee settings
IF NOT EXISTS (SELECT 1 FROM marquee_settings WHERE location = 'home') THEN
  INSERT INTO marquee_settings (location, enabled) VALUES ('home', true);
END IF;

IF NOT EXISTS (SELECT 1 FROM marquee_settings WHERE location = 'nav_ticker') THEN
  INSERT INTO marquee_settings (location, enabled) VALUES ('nav_ticker', true);
END IF;

END $$;

-- ============================================================
-- PARTNERSHIPS
-- ============================================================

DO $$ BEGIN

IF NOT EXISTS (SELECT 1 FROM partnerships WHERE name = 'VFS Global') THEN
  INSERT INTO partnerships (name, eyebrow, description, logo_url, external_url, visible, sort_order) VALUES
    (
      'VFS Global',
      'Vize Başvuru Merkezi',
      'Dünyanın en büyük vize dış kaynak hizmetleri şirketi olan VFS Global, 150''den fazla ülkede 3.000''i aşkın başvuru merkezi işletmektedir. Vize Makinesi olarak VFS Global altyapısını kullanarak başvurularınızı doğrudan yetkili kanallar üzerinden takip ediyor, randevu süreçlerini hızlandırıyor ve evrak kontrolünü eksiksiz yürütüyoruz.',
      '/vfs_global.png',
      NULL,
      true,
      0
    );
END IF;

IF NOT EXISTS (SELECT 1 FROM partnerships WHERE name = 'Kosmos') THEN
  INSERT INTO partnerships (name, eyebrow, description, logo_url, external_url, visible, sort_order) VALUES
    (
      'Kosmos',
      'Seyahat & Lojistik',
      'Kosmos, uluslararası seyahat lojistiği ve kurumsal seyahat yönetimi alanında köklü bir deneyime sahiptir. Bu ortaklık sayesinde vize süreçlerinizi uçuş, konaklama ve transfer planlamasıyla tek çatı altında yönetebiliyorsunuz. Eksiksiz bir seyahat deneyimi için Kosmos ile koordineli çalışıyoruz.',
      '/kosmos.png',
      NULL,
      true,
      1
    );
END IF;

IF NOT EXISTS (SELECT 1 FROM partnerships WHERE name = 'Gezi Makinesi') THEN
  INSERT INTO partnerships (name, eyebrow, description, logo_url, external_url, visible, sort_order) VALUES
    (
      'Gezi Makinesi',
      'Turizm Acentesi',
      'Gezi Makinesi, yurt içi ve yurt dışı tur organizasyonlarında uzmanlaşmış bir turizm acentesidir. Bu ortaklık sayesinde vize süreçlerinizi tur paketlerinizle entegre bir şekilde yönetebilir, seyahat planlamanızı baştan sona tek elden takip edebilirsiniz.',
      '/Gezi-Makinesi-Yatay-Logo-siyah.png',
      'https://www.instagram.com/gezimakinesicom',
      true,
      2
    );
END IF;

END $$;

-- ============================================================
-- TEAM MEMBERS
-- ============================================================

DO $$ BEGIN

IF NOT EXISTS (SELECT 1 FROM team_members) THEN
  INSERT INTO team_members (name, initials, role, photo_url, visible, sort_order) VALUES
    ('Efkan Bey',        'E',  'Kıdemli Polat Alemdar', NULL, true, 0),
    ('Kılıç',            'K',  'Schengen Birimi',        NULL, true, 1),
    ('Pala',             'P',  'ABD ve Kanada Birimi',   NULL, true, 2),
    ('Memati',           'M',  'Kıdemli Danışman',       NULL, true, 3),
    ('İskender Büyük',   'İB', 'Asya-Pasifik Birimi',   NULL, true, 4),
    ('Laz Ziya',         'LZ', 'Belge Uzmanı',           NULL, true, 5),
    ('İplikçi',          'İ',  'Danışman',               NULL, true, 6),
    ('Mehmet Karahanlı', 'MK', 'Danışman',               NULL, true, 7);
END IF;

END $$;
