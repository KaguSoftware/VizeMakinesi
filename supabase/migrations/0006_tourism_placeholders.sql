-- Adds placeholder tourism content for the countries seeded in 0005.
-- Updates only rows that still have has_tourism = false AND empty tourism_intro,
-- so manually edited rows are never overwritten.

UPDATE countries SET
  has_tourism = true,
  tourism_best_time = 'Nisan–Ekim arası şehir gezileri için idealdir.',
  tourism_intro = ARRAY[
    'Avusturya, Viyana''nın imparatorluk saraylarından Alplerin görkemli dağ köylerine uzanan olağanüstü bir çeşitlilik sunar. Klasik müzik mirası, buz gibi göller ve dünyaca ünlü kayak pistleri ülkeyi her mevsim cazip kılar.',
    'Ulaşım altyapısı son derece gelişmiştir; Viyana metrosu ve şehirlerarası trenler seyahati kolaylaştırır. Kafeler ve pastaneler Avusturya kültürünün ayrılmaz bir parçasıdır.'
  ],
  tourism_highlights = ARRAY[
    'Viyana: Schönbrunn Sarayı, Belvedere ve Stephansdom',
    'Salzburg: Mozart''ın doğduğu ev ve eski şehir',
    'Hallstatt gölü ve köyü — UNESCO Dünya Mirası',
    'Innsbruck''ta Alp manzarası ve tarihi çarşı',
    'Grossglockner Dağ Yolu''nda nefes kesen manzara'
  ],
  tourism_tips = ARRAY[
    'Viyana kartı (Vienna City Card) müzeler ve toplu taşıma için büyük tasarruf sağlar',
    'Kayak sezonunda (Aralık–Mart) dağ bölgelerinde konaklama erken dolar',
    'Restoranlar genellikle saat 22:00''ye kadar açıktır; geç akşam yemeği yaygındır',
    'Avusturya süpermarketleri pazar günleri kapalıdır, alışverişinizi önceden yapın'
  ]
WHERE slug = 'avusturya' AND has_tourism = false;

UPDATE countries SET
  has_tourism = true,
  tourism_best_time = 'Nisan–Eylül arası turizm için en uygun dönemdir.',
  tourism_intro = ARRAY[
    'Belçika, Avrupa''nın tam kalbinde yer alan; minik ama zengin kültürel dokusuyla büyüleyici bir destinasyondur. Brüksel''in Art Nouveau mimarisi, Brugge''nin ortaçağ kanalları ve Gent''in canlı öğrenci atmosferi farklı ruh hallerine hitap eder.',
    'Belçika çikolatası, waffle ve birası dünya standartlarını belirler. Her kasabada keşfedilmeyi bekleyen küçük bira barları ve çikolatacılar bulunur.'
  ],
  tourism_highlights = ARRAY[
    'Brüksel: Grand Place, Atomium ve Manneken Pis',
    'Brugge kanalları ve ortaçağ kent dokusu — UNESCO Mirası',
    'Gent: Gravensteen Şatosu ve Graslei kıyısı',
    'Antwerp elmas çarşısı ve Rubens Evi',
    'Ardennes ormanlarında doğa yürüyüşü'
  ],
  tourism_tips = ARRAY[
    'Belçika''da tren ağı çok gelişmiştir; şehirler arası seyahatte bütçe dostudur',
    'Brugge yoğun turist çeker — erken rezervasyon şart',
    'Bira menüsü bazen yüzlerce çeşit içerir; garsondan öneri isteyin',
    'Fransızca ve Flemenkçe iki resmi dil; hangi bölgede olduğunuza dikkat edin'
  ]
WHERE slug = 'belcika' AND has_tourism = false;

UPDATE countries SET
  has_tourism = true,
  tourism_best_time = 'Mayıs–Eylül arası seyahat için en uygun dönemdir.',
  tourism_intro = ARRAY[
    'Bulgaristan, Karadeniz kıyılarından Balkan dağlarına, antik Trakya şehirlerinden Osmanlı döneminden kalma mimariye uzanan bütçe dostu ve keşfedilmemiş bir destinasyondur. Türk ziyaretçilere kültürel olarak tanıdık pek çok iz taşır.',
    'Sofya, modern bir Avrupa başkenti olmakla birlikte tarihi kiliseler ve Osmanlı yapılarıyla iç içedir. Yemek ve konaklama maliyetleri AB ortalamasının çok altındadır.'
  ],
  tourism_highlights = ARRAY[
    'Sofya: Alexander Nevsky Katedrali, Boyana Kilisesi ve Vitosha Dağı',
    'Plovdiv eski şehri ve sanat galerileri — Avrupa Kültür Başkenti',
    'Karadeniz kıyısında Varna ve Sozopol plajları',
    'Rila Manastırı — UNESCO Dünya Mirası',
    'Bansko kayak merkezi ve Pirin Milli Parkı'
  ],
  tourism_tips = ARRAY[
    'Bulgar Levası Euro''ya dönüştürülmemiştir; nakit bulundurmak faydalıdır',
    'Başını sallama "hayır", yanlara sallama "evet" anlamına gelir — kafa karıştırıcı olabilir',
    'Sofya''da pek çok müze Pazartesi kapalıdır',
    'Karadeniz tatil bölgeleri Temmuz–Ağustos''ta çok kalabalıklaşır'
  ]
WHERE slug = 'bulgaristan' AND has_tourism = false;

UPDATE countries SET
  has_tourism = true,
  tourism_best_time = 'Mayıs–Eylül arası Adriyatik kıyıları için mükemmeldir.',
  tourism_intro = ARRAY[
    'Hırvatistan, Adriyatik''in kristal berraklığındaki koyları, şelaleli milli parkları ve ortaçağdan kalma surlu şehirleriyle Avrupa''nın en gözde tatil destinasyonlarından biridir. Dubrovnik surları ve Plitvice Gölleri dünyaca tanınan simgelerdir.',
    'Binlerce adadan oluşan kıyı şeridi, tekne turlarını ve ada atlamalarını doğal bir seçenek hâline getirir. Deniz mahsulleri ağırlıklı yerel mutfak tazedir ve lezzetlidir.'
  ],
  tourism_highlights = ARRAY[
    'Dubrovnik surları ve eski şehir — Game of Thrones çekim mekânı',
    'Plitvice Gölleri Milli Parkı — UNESCO Dünya Mirası',
    'Split: Diocletianus Sarayı ve Riva kıyısı',
    'Hvar adası: lavanta tarlaları ve gece hayatı',
    'Korčula ve Vis adaları — kalabalıktan uzak alternatifler'
  ],
  tourism_tips = ARRAY[
    'Dubrovnik Temmuz–Ağustos''ta aşırı kalabalıklaşır; Haziran veya Eylül tercih edin',
    'Ada feribot biletlerini önceden alın; yaz sezonunda dolar',
    'Kuna kullanımdan kalktı — Euro geçerlidir',
    'Plaj barlarında fiyatlar yüksektir; süpermarketten alıp kumsal pikniği daha uygun olur'
  ]
WHERE slug = 'hirvatistan' AND has_tourism = false;

UPDATE countries SET
  has_tourism = true,
  tourism_best_time = 'Mayıs–Eylül arası şehir ve doğa gezileri için idealdir.',
  tourism_intro = ARRAY[
    'Çekya, Orta Avrupa''nın en iyi korunmuş gotik ve barok mimarisine sahip ülkelerinden biridir. Prag''ın Ortaçağ köprüleri ve kale manzarası her mevsim büyüleyici bir atmosfer yaratır.',
    'Başkentin dışına çıkıldığında Bohemya''nın şelaleli vadileri, Moravya''nın şarap bölgeleri ve Karlovy Vary''nin kaplıcaları keşfedilmeyi bekler.'
  ],
  tourism_highlights = ARRAY[
    'Prag: Charles Köprüsü, Prag Kalesi ve Josefov Yahudi Mahallesi',
    'Český Krumlov — UNESCO korumalı ortaçağ şehri',
    'Brno yer altı labirentleri ve Villa Tugendhat',
    'Moravya şarap rotası — Mikulov ve Valtice',
    'Bohemya İsviçresi Milli Parkı''nda kaya formasyonları'
  ],
  tourism_tips = ARRAY[
    'Çek Korunası kullanılır; Euro her yerde kabul görmez',
    'Prag''da taksi yerine Bolt veya Uber kullanmak çok daha ucuzdur',
    'Bira kültürü çok güçlü — Pilsner Urquell ve Budvar asılları burada',
    'Eski şehir merkezinde kilit yerlerde gece çok gürültülü olabilir'
  ]
WHERE slug = 'cekya' AND has_tourism = false;

UPDATE countries SET
  has_tourism = true,
  tourism_best_time = 'Mayıs–Ağustos arası Kuzey Avrupa deneyimi için idealdir.',
  tourism_intro = ARRAY[
    'Danimarka, İskandinavya''nın en erişilebilir ve yaşam kalitesiyle öne çıkan ülkesidir. Kopenhag''ın renkli rıhtımı, modern mutfak anlayışı ve bisiklet dostu şehir tasarımı dünyaya örnek gösterilmektedir.',
    'Kronborg Şatosu''ndan Viking müzelerine, Legoland''dan Faroe Adaları''nın vahşi doğasına kadar çeşitlilik büyüktür. Yüksek fiyat seviyesine rağmen değerini veren bir destinasyon.'
  ],
  tourism_highlights = ARRAY[
    'Kopenhag: Nyhavn rıhtımı, Tivoli Bahçeleri ve Küçük Deniz Kızı heykeli',
    'Kronborg Şatosu — Hamlet''in efsanevi mekânı, UNESCO Mirası',
    'Aarhus: ARoS sanat müzesi ve eski şehir',
    'Roskilde Viking Gemi Müzesi',
    'Billund''da Legoland — ailelerin vazgeçilmezi'
  ],
  tourism_tips = ARRAY[
    'Danimarka oldukça pahalıdır; bütçenizi İskandinav standartlarına göre ayarlayın',
    'Kopenhag''da bisiklet kiralamak hem ucuz hem keyiflidir',
    'Kart ödemesi her yerde geçerlidir; nakit neredeyse kullanılmaz',
    'Yaz günleri çok uzundur — gece 22''de hâlâ aydınlık olabilir'
  ]
WHERE slug = 'danimarka' AND has_tourism = false;

UPDATE countries SET
  has_tourism = true,
  tourism_best_time = 'Mayıs–Eylül arası ılıman ve uzun gündüzlü günler sunar.',
  tourism_intro = ARRAY[
    'Estonya, Baltık''ın dijital öncüsü olmakla birlikte Tallinn''in ortaçağ surları ve kaldırım taşlı sokakları ziyaretçiyi yüzyıllar öncesine götürür. Küçük ama özgün bir ülke.',
    'Doğası da en az şehirleri kadar etkileyicidir; bataklık yürüyüşleri, ormanlar ve adalı kıyı şeridi aktif tatilcileri bekler.'
  ],
  tourism_highlights = ARRAY[
    'Tallinn eski şehri — Avrupa''nın en iyi korunmuş ortaçağ kenti, UNESCO Mirası',
    'Kadriorg Sarayı ve parkı',
    'Lahemaa Milli Parkı''nda bataklık ve orman yürüyüşü',
    'Tartu Üniversite Şehri ve Estonyaca kültür müzesi',
    'Saaremaa Adası: rüzgar değirmenleri ve meteor krateri'
  ],
  tourism_tips = ARRAY[
    'Tallinn merkezi yürüyerek gezilecek kadar küçüktür',
    'Helsinki''ye feribot seferleri günlük işler; iki şehri birden görebilirsiniz',
    'İngilizce her yerde konuşulur; dil sorunu yaşamazsınız',
    'Kış aylarında hava çok soğuk ve donuktur; giysilerinizi buna göre planlayın'
  ]
WHERE slug = 'estonya' AND has_tourism = false;

UPDATE countries SET
  has_tourism = true,
  tourism_best_time = 'Haziran–Ağustos arası gece yarısı güneşi deneyimi için eşsizdir.',
  tourism_intro = ARRAY[
    'Finlandiya, binlerce gölü, sonsuz ormanları ve Lapland''ın kuzey ışıklarıyla doğa tutkunlarının rüya destinasyonudur. Helsinki''nin tasarım odaklı şehir kültürü ise modern yaşama dair ilham verir.',
    'Yaz aylarında gece yarısı güneşi, kışın Aurora Borealis gösterisi ülkeyi dört mevsim farklı bir deneyime dönüştürür.'
  ],
  tourism_highlights = ARRAY[
    'Helsinki: Tasarım Müzesi, Suomenlinna Deniz Kalesi ve pazarları',
    'Lapland''da Noel Baba Köyü ve kuzey ışıkları turu',
    'Rovaniemi: Arctic Circle deneyimi',
    'Saimaa Gölü bölgesinde kano ve sauna kültürü',
    'Nuuksio Milli Parkı''nda orman yürüyüşü'
  ],
  tourism_tips = ARRAY[
    'Sauna Finlandiya''da bir kültürdür — mutlaka deneyin',
    'Kış turları için çok katmanlı giyim şarttır; -20°C sıradan',
    'Doğa alanlarında "herkes hakları" ile serbestçe kamp yapılabilir',
    'Helsinki pahalıdır ama küçük kasabalar çok daha bütçe dostudur'
  ]
WHERE slug = 'finlandiya' AND has_tourism = false;

UPDATE countries SET
  has_tourism = true,
  tourism_best_time = 'Nisan–Haziran ve Eylül–Ekim arası sıcak ama kalabalıksız dönemdir.',
  tourism_intro = ARRAY[
    'Yunanistan, antik uygarlık izlerini Akdeniz''in masmavi sularıyla bir araya getiren eşsiz bir destinasyondur. Atina''nın Akropolü''nden Santorini''nin volkanik koylarına, Girit''in bereketli mutfağına uzanan bu topraklar binlerce yıldır seyyahları büyülemektedir.',
    'Adalı yapısı her zevke hitap eden tatil seçenekleri sunar: eğlence için Mykonos, huzur için Rodos, tarih için Delos ve doğa için Kefalonyalılar deniz kıyısının en güzel köşelerini paylaşır.'
  ],
  tourism_highlights = ARRAY[
    'Atina: Akropolis, Parthenon ve Ulusal Arkeoloji Müzesi',
    'Santorini: Oia gün batımı ve kaldera manzarası',
    'Girit: Knossos Sarayı, Samaria Gorge ve Hanya eski limanı',
    'Mykonos: Little Venice ve Windmills',
    'Meteora kayalık manastırları — UNESCO Dünya Mirası'
  ],
  tourism_tips = ARRAY[
    'Ada feribot biletleri Temmuz–Ağustos''ta hızla tükenir; önceden alın',
    'Öğle arası (14:00–17:00) bazı dükkanlar ve müzeler kapanır',
    'Yunan yemekleri büyük porsiyonlarda gelir; iki kişi üç tabak paylaşabilir',
    'Atina''da taksi uygulamaları standart taksilerden genellikle daha ucuzdur'
  ]
WHERE slug = 'yunanistan' AND has_tourism = false;

UPDATE countries SET
  has_tourism = true,
  tourism_best_time = 'Nisan–Haziran ve Eylül–Ekim arası gezinmek için en güzel dönemdir.',
  tourism_intro = ARRAY[
    'Macaristan, Orta Avrupa''nın en cazip başkentlerinden Budapeşte''ye ev sahipliği yapar. Tuna Nehri''nden yükselen kale silüeti ve Art Nouveau binalariyla şehir gece de gündüz de etkileyicidir.',
    'Termal kaplıca kültürü Macaristan''a özgü bir deneyim sunar; onlarca tarihi hamam ziyaretçilere açıktır. Balaton Gölü ise yaz mevsiminin vazgeçilmez tatil adresidir.'
  ],
  tourism_highlights = ARRAY[
    'Budapeşte: Buda Kalesi, Parlamento binası ve Büyük Sinagog',
    'Széchenyi ve Gellért termal kaplıcaları',
    'Danube Bend''de Visegrád ve Esztergom kasabaları',
    'Balaton Gölü''nde plaj ve şarap turu',
    'Eger şarap vadisi — Boğazın Kanı efsanesi'
  ],
  tourism_tips = ARRAY[
    'Forint kullanılır; döviz bürolarında bozdurmak bankadan iyi kur verir',
    'Kaplıcalarda yüzme şapkası zorunlu olabilir, yanınıza alın',
    'Budapeşte eğlence hayatıyla meşhurdur; hafta sonları çok kalabalıklaşır',
    'Tram ve metro günlük kart alarak kullanmak ekonomiktir'
  ]
WHERE slug = 'macaristan' AND has_tourism = false;

UPDATE countries SET
  has_tourism = true,
  tourism_best_time = 'Haziran–Ağustos arası en uzun gündüzlerin yaşandığı dönemdir.',
  tourism_intro = ARRAY[
    'İzlanda, dünyanın hiçbir yerinde göremeyeceğiniz jeotermal manzaralar, buzullar, şelaleler ve kuzey ışıklarıyla gerçek anlamda başka bir gezegende hissettiren bir destinasyondur.',
    'Reykjavik küçük ama canlı bir kültür ve gastronomi sahnesine sahiptir. Ring Road boyunca yapılacak bir tur İzlanda''nın tüm büyüsünü ortaya koyar.'
  ],
  tourism_highlights = ARRAY[
    'Golden Circle: Geysir, Gullfoss şelalesi ve Þingvellir Milli Parkı',
    'Blue Lagoon jeotermal kaplıcası',
    'Kuzey ışıkları (Ekim–Mart arası)',
    'Vatnajökull buzulu ve buz mağarası turu',
    'Jökulsárlón buzul gölü ve elmas plajı'
  ],
  tourism_tips = ARRAY[
    'Hava çok hızlı değişir — su geçirmez giysi ve katmanlı giyim şart',
    'Araç kiralamak kesinlikle önerilir; toplu taşıma sınırlıdır',
    'Restoran fiyatları çok yüksektir; süpermarket alışverişiyle bütçe tutturulabilir',
    'F yolları (dağ geçitleri) yalnızca 4×4 araçlarla ve yaz mevsiminde geçilebilir'
  ]
WHERE slug = 'izlanda' AND has_tourism = false;

UPDATE countries SET
  has_tourism = true,
  tourism_best_time = 'Mayıs–Eylül arası ılıman ve güneşli günler sunar.',
  tourism_intro = ARRAY[
    'Letonya, Baltık''ın en fazla Art Nouveau mimarisine sahip başkenti Riga''yı barındırır. Tarihi eski şehir, renkli pazar binaları ve Jugendstil cepheleriyle şehir büyüleyicidir.',
    'Kıyı şeridi boyunca uzanan kum tepeleri, ormanlık milli parklar ve küçük liman şehirleri doğa tutkunlarına hitap eder.'
  ],
  tourism_highlights = ARRAY[
    'Riga eski şehri — UNESCO Dünya Mirası ve Art Nouveau turu',
    'Riga Merkez Pazarı — Avrupa''nın en büyük pazar komplekslerinden biri',
    'Gauja Milli Parkı''nda kano ve yürüyüş',
    'Jūrmala plaj kasabası',
    'Sigulda''nın ortaçağ kaleleri'
  ],
  tourism_tips = ARRAY[
    'Euro kullanılır; ödeme oldukça kolaylaşmıştır',
    'Riga''da İngilizce yaygın; eski nesil daha çok Rusça konuşur',
    'Yaşlı şehir bölgesi yürüyerek rahatlıkla gezilebilir',
    'Kış aylarında çok soğuk ve karanlık — güneş gündüzleri erken batar'
  ]
WHERE slug = 'letonya' AND has_tourism = false;

UPDATE countries SET
  has_tourism = true,
  tourism_best_time = 'Mayıs–Eylül arası Alp manzarası için mükemmel bir dönemdir.',
  tourism_intro = ARRAY[
    'Lihtenştayn, Ren Nehri kıyısında Avusturya ile İsviçre arasına sıkışmış dünyanın en küçük ülkelerinden biridir. Az kişinin ayak bastığı bu cüce prenslikte günlük bir ziyaretle her yeri görebilirsiniz.',
    'Vaduz''un üzerindeki şato, orta çağdan kalma köy dokusu ve çevreleyen Alp doğası kısa ama unutulmaz bir deneyim sunar.'
  ],
  tourism_highlights = ARRAY[
    'Vaduz Şatosu — prensliğin simgesi',
    'Kunstmuseum Liechtenstein — çağdaş sanat müzesi',
    'Malbun kayak ve yaz yürüyüş merkezi',
    'Ren Vadisi boyunca bisiklet rotası',
    'Pasaportunuza Lihtenştayn damgası vurdurmak (ücretli ama popüler)'
  ],
  tourism_tips = ARRAY[
    'İsviçre Frangı geçerlidir; Euro da kabul edilir',
    'Ülke o kadar küçük ki birkaç saatte her yeri görebilirsiniz',
    'İsviçre veya Avusturya turu sırasında kolayca eklenti yapılabilir',
    'Turizm bürosu pasaporta ücretsiz damga vurur — anı olarak değerlidir'
  ]
WHERE slug = 'lihtenstayn' AND has_tourism = false;

UPDATE countries SET
  has_tourism = true,
  tourism_best_time = 'Mayıs–Eylül arası ılıman hava ve uzun günler sunar.',
  tourism_intro = ARRAY[
    'Litvanya, üç Baltık ülkesinin en güneyinde yer alır ve başkenti Vilnius''un barok mimarisiyle Orta Avrupa şehirlerini andıran kendine özgü bir karakteri vardır. UNESCO korumalı eski şehri Doğu Avrupa''nın en büyük ortaçağ kent dokularından birini oluşturur.',
    'Klaipėda liman şehri, Curonian Spit kum tepeleri ve Hill of Crosses gibi mistik mekânlar ülkeye derinlik katar.'
  ],
  tourism_highlights = ARRAY[
    'Vilnius eski şehri — UNESCO Dünya Mirası',
    'Trakai Şatosu — göl ortasındaki ada kalesi',
    'Hill of Crosses — Šiauliai yakınında binlerce haçlı kutsal mekân',
    'Curonian Spit kum tepeleri — UNESCO Dünya Mirası',
    'Kaunas: Modernist mimari ve Şeytan Müzesi'
  ],
  tourism_tips = ARRAY[
    'Euro kullanılır; ödeme her yerde kolaylaşmıştır',
    'Vilnius''ta İngilizce çok yaygındır',
    'Eski şehir meyhanelerinde geleneksel bira ve Zeppelini (patates köftesi) deneyin',
    'Curonian Spit''e ulaşmak için Klaipėda''dan feribot alınır'
  ]
WHERE slug = 'litvanya' AND has_tourism = false;

UPDATE countries SET
  has_tourism = true,
  tourism_best_time = 'Nisan–Ekim arası şehir turu için en keyifli dönemdir.',
  tourism_intro = ARRAY[
    'Lüksemburg, AB kurumlarının merkezi olmakla birlikte şehrin doğal vadiler içindeki konumu ve ortaçağ kalesi onu etkileyici bir kısa tatil noktasına dönüştürür. Küçük ama zengin; konaklama ve yemek seçenekleri yüksek standartları yansıtır.',
    'Şehir dışında Ardennes ormanları, Moselle şarap vadisi ve kırsal kasabalar ülkeye farklı bir boyut katar.'
  ],
  tourism_highlights = ARRAY[
    'Lüksemburg Şehri kaleleri ve Bock kazamatları — UNESCO Mirası',
    'Grund Mahallesi — vadide nehir kenarı cafeler',
    'Moselle Vadisi''nde şarap ve şarap müzeleri',
    'Vianden Şatosu — Ardennes''in en görkemli kalesi',
    'Müllerthal Bölgesi — Küçük İsviçre kayalık vadileri'
  ],
  tourism_tips = ARRAY[
    'Lüksemburg pahalı bir destinasyondur; komşu kasabalardan günübirlik gelmek ekonomik olabilir',
    'Toplu taşıma tamamen ücretsizdir — Avrupa''da benzersiz bir uygulama',
    'Üç resmi dil var: Lüksemburgca, Fransızca, Almanca',
    'AB kurumlarına ziyaretçi olarak girilebilir; önceden rezervasyon gerekebilir'
  ]
WHERE slug = 'luksemburg' AND has_tourism = false;

UPDATE countries SET
  has_tourism = true,
  tourism_best_time = 'Nisan–Haziran ve Eylül–Kasım arası en ılıman dönemdir.',
  tourism_intro = ARRAY[
    'Malta, Akdeniz''in tam ortasında tarihin üst üste yığıldığı küçük bir ada ülkesidir. Fenikelilerden Osmanlılara, Şövalyelere kadar pek çok medeniyetin bıraktığı izler adanın her köşesinde hissedilir.',
    'Valletta — Avrupa''nın en küçük başkenti — derin tarihi ve kristal mavisi limanıyla büyüleyicidir. Dalış, tarihi geziler ve Akdeniz mutfağı Malta''yı eşsiz kılar.'
  ],
  tourism_highlights = ARRAY[
    'Valletta: St. John''s Co-Cathedral ve Grand Harbour — UNESCO Mirası',
    'Mdina — "Sessiz Şehir" ortaçağ kenti',
    'Mavi Mağara (Blue Grotto) deniz mağarası turu',
    'Gozo Adası: Azure Window kalıntıları ve kırsal yaşam',
    'Megalitik tapınaklar — insanlığın en eski dini yapıları'
  ],
  tourism_tips = ARRAY[
    'Temmuz–Ağustos''ta hava çok sıcak ve kalabalık olur',
    'Araç trafiği soldan akar — İngiliz mirası',
    'Dalış için en iyi koşullar Mayıs–Kasım arası sunar',
    'İngilizce resmi dildir; iletişimde sorun yaşamazsınız'
  ]
WHERE slug = 'malta' AND has_tourism = false;

UPDATE countries SET
  has_tourism = true,
  tourism_best_time = 'Haziran–Ağustos arası uzun günler ve ılıman hava sunar.',
  tourism_intro = ARRAY[
    'Norveç, fiyortları, sarp dağları ve kuzey ışıklarıyla dünyanın en seyredilesi doğa manzaralarına ev sahipliği yapar. Oslo''nun çağdaş müzeler ve Vigeland heykel parkı ile kültürel boyutu da güçlüdür.',
    'Fiyort seferleri, kayak merkezleri ve tengeri Lofoten Adaları eşsiz deneyimler sunar. Norveç pahalıdır ancak her kuruşun karşılığı alınmaktadır.'
  ],
  tourism_highlights = ARRAY[
    'Geiranger ve Nærøyfjord fiyortları — UNESCO Dünya Mirası',
    'Oslo: Vigeland Parkı, Viking Gemi Müzesi ve Operaevi',
    'Lofoten Adaları''nın dramatik peyzajı ve balıkçı köyleri',
    'Bergen ve Bryggen tarihi ahşap evleri — UNESCO Mirası',
    'Kuzey ışıkları — Tromsø ve çevresi'
  ],
  tourism_tips = ARRAY[
    'Norveç Avrupa''nın en pahalı ülkelerinden biridir; bütçeyi önceden planlayın',
    'Fiyort turlarını erken rezerve edin; yaz sezonunda dolar',
    'Norveç kıyı feribot hattı (Hurtigruten) ülkeyi baştan sona denizden geçirir',
    'Alkolsüz markalar bile alkol satımı devlet tekeli aracılığıyla yapılır'
  ]
WHERE slug = 'norvec' AND has_tourism = false;

UPDATE countries SET
  has_tourism = true,
  tourism_best_time = 'Mayıs–Eylül arası şehir gezisi için en uygun dönemdir.',
  tourism_intro = ARRAY[
    'Polonya, Orta Avrupa''nın en hızlı büyüyen turizm destinasyonlarından biridir. Varşova''nın savaştan yeniden doğmuş tarihi merkezi, Krakov''un masalsı eski şehri ve Gdansk''ın renkli cepheli rıhtımları her biri ayrı bir deneyim sunar.',
    'Tuz madeni, dünyanın en derin orman kalıntısı ve Auschwitz-Birkenau Anıtı gibi hem doğal hem tarihi hem de insanlık mirası açısından ağır yükler taşıyan mekânlar Polonya''yı düşündürücü kılar.'
  ],
  tourism_highlights = ARRAY[
    'Krakov eski şehri ve Wawel Kalesi — UNESCO Mirası',
    'Wieliczka Tuz Madeni — UNESCO Mirası, yer altı sanat şaheseri',
    'Auschwitz-Birkenau Müzesi ve Anıtı',
    'Varşova: Pazar Meydanı, Wilanów Sarayı ve modern sanat müzeleri',
    'Gdansk renkli rıhtım binaları ve Amber Müzesi'
  ],
  tourism_tips = ARRAY[
    'Zloty kullanılır; Euro kabul görmez',
    'Polonya ucuz bir destinasyondur — kaliteli yemek ve konaklama bütçe dostudur',
    'Pierogi (mantı), żurek (çavdar çorbası) ve bigos muhakkak denenmelidir',
    'Tren bağlantıları gelişmiştir; şehirler arası ulaşım rahatlıkla planlanabilir'
  ]
WHERE slug = 'polonya' AND has_tourism = false;

UPDATE countries SET
  has_tourism = true,
  tourism_best_time = 'Nisan–Haziran ve Eylül–Ekim arası kalabalık olmadan en güzel dönemdir.',
  tourism_intro = ARRAY[
    'Portekiz, Avrupa''nın güneybatı ucunda yer alan; fado müziğinin melankolisi, pastel renkli azulejo çinileri ve Atlantik''in köpüklü dalgalarıyla kendine özgü bir ruh hali yaratan destinasyondur. Lizbon''un tramvay hatları ve Sintra''nın masalsı sarayları seyahat fotoğrafçılarının favori mekânlarıdır.',
    'Porto şarabı, Algarve''nin altın kumlu koyları ve Azorlar''ın volkanik manzarası ülkeyi çok boyutlu kılar. Fiyat-kalite oranı Batı Avrupa''nın en iyileri arasındadır.'
  ],
  tourism_highlights = ARRAY[
    'Lizbon: Alfama mahallesi, Belém Kulesi ve Jerónimos Manastırı',
    'Sintra''nın renkli sarayları ve ormanı — UNESCO Mirası',
    'Porto: Ribeira kıyısı, şarap mahzenleri ve tren istasyonu azulejoları',
    'Algarve''nin lagün ve uçurum kıyıları',
    'Azorlar Adaları — Avrupa''nın saklı cenneti'
  ],
  tourism_tips = ARRAY[
    'Lizbon''da tram 28 her zaman kalabalık — sabah erken veya akşam geç tercih edin',
    'Pastel de nata (yumurtalı tart) Belém''in orijinalinde denenmelidir',
    'Portekizce İspanyolcaya yakındır; bazı ifadeler anlaşılır',
    'Uber Lizbon''da taksilere göre çok daha uygun fiyatlıdır'
  ]
WHERE slug = 'portekiz' AND has_tourism = false;

UPDATE countries SET
  has_tourism = true,
  tourism_best_time = 'Mayıs–Eylül arası Karadeniz kıyıları ve şehir gezileri için idealdir.',
  tourism_intro = ARRAY[
    'Romanya, Transilvanya ormanları, Orta Çağ kaleleri ve Karpatların yüksek yaylaları ile Draküla efsanesinin anavatanı olmayı aşan zengin bir tarihe sahiptir. Bükreş''in Belle Époque mimarisi ve bohem mahalleleri şehre farklı bir nefes katar.',
    'Kırsal Romanya; ahşap kiliseler, çoban köyleri ve bozulmamış doğasıyla Avrupa''nın en özgün geleneksel yaşam dokularından birini korumaktadır.'
  ],
  tourism_highlights = ARRAY[
    'Bran Kalesi — Draküla efsanesiyle özdeşleşen Transilvanya sembolü',
    'Bükreş: Halk Sarayı, Lipscani sokakları ve Cişmigiu Parkı',
    'Sighişoara ortaçağ kenti — UNESCO Mirası',
    'Sinaia: Peles Şatosu ve dağ manzarası',
    'Maramureş''in ahşap kiliseleri ve kırsal yaşamı'
  ],
  tourism_tips = ARRAY[
    'Rumen Leyi kullanılır; kur avantajlıdır — bütçe dostu bir destinasyon',
    'Karpatlar''da yol koşulları değişken olabilir; araç kiralayanlar dikkatli olmalı',
    'Bükreş''te gece ekonomisi canlıdır; eğlence için çok seçenek var',
    'Romanya muhtarı yemekleri (sarmale, mici) mutlaka denenmelidir'
  ]
WHERE slug = 'romanya' AND has_tourism = false;

UPDATE countries SET
  has_tourism = true,
  tourism_best_time = 'Nisan–Ekim arası şehir ve doğa gezileri için uygundur.',
  tourism_intro = ARRAY[
    'Slovakya, Bratislava''nın Tuna kıyısındaki şairin şehir atmosferinden Tatra Dağları''nın alpine zirvelerine kadar geniş bir yelpaze sunar. Komşu Avusturya ve Macaristan''a kıyasla çok daha az kalabalık ve bütçe dostudur.',
    'Ortaçağ kaleleri, mağara sistemleri ve termal kapıcaları ülkeyi küçük ama sürprizlerle dolu kılar.'
  ],
  tourism_highlights = ARRAY[
    'Bratislava Kalesi ve Tuna manzarası',
    'Yüksek Tatras Dağları''nda yürüyüş ve kayak',
    'Spis Kalesi — Avrupa''nın en büyük ortaçağ kalesi kalıntısı, UNESCO Mirası',
    'Demänovská Buz Mağarası',
    'Bojnice Şatosu — masalvari su kalesinin Orta Avrupa versiyonu'
  ],
  tourism_tips = ARRAY[
    'Euro kullanılır; ödeme kolaylaşmıştır',
    'Bratislava''dan Viyana''ya trenle 1 saatte ulaşılabilir — kombine tur için ideal',
    'Slovak mutfağı Macar mutfağına benzer; bryndzové halušky (patatesli köfte) deneyin',
    'Tatras''ta hava çok hızlı değişir; yanınıza yağmurluk alın'
  ]
WHERE slug = 'slovakya' AND has_tourism = false;

UPDATE countries SET
  has_tourism = true,
  tourism_best_time = 'Mayıs–Eylül arası hem kıyı hem doğa için mükemmeldir.',
  tourism_intro = ARRAY[
    'Slovenya, küçük yüzölçümüne rağmen Adriyatik kıyısından Alp zirvelerine, mağara sistemlerinden bağ vadilerine inanılmaz bir çeşitlilik sunar. Başkent Ljubljana''nın insanı rahatça yürüyerek keşfedebileceği boyutu ve araçsız şehir merkezi onu Avrupa''nın en konforlu başkentlerinden biri yapar.',
    'Bled Gölü''nün adası, Postojna Mağarası ve Triglav Milli Parkı dünya çapında tanınan destinasyonlardır.'
  ],
  tourism_highlights = ARRAY[
    'Bled Gölü ve göl ortasındaki kilise adası',
    'Ljubljana: Ejder Köprüsü, Kale ve Plečnik eserleri',
    'Postojna Mağarası — Avrupa''nın en büyük ziyaret edilebilir mağaralarından biri',
    'Triglav Milli Parkı''nda yürüyüş ve Soça Nehri''nde rafting',
    'Piran Adriyatik sahil kasabası — Venedik dokusunu andıran eski şehir'
  ],
  tourism_tips = ARRAY[
    'Euro kullanılır; küçük bir ülke olduğu için her şeye kolayca erişilir',
    'Bled her mevsim güzeldir ama Ağustos''ta çok kalabalıklaşır',
    'Slovenya dünyanın en çevre dostu turizm destinasyonlarından biri seçilmiştir',
    'Ljubljana''da araba gereksizdir; bisiklet veya yürümek en iyi seçenektir'
  ]
WHERE slug = 'slovenya' AND has_tourism = false;

UPDATE countries SET
  has_tourism = true,
  tourism_best_time = 'Nisan–Haziran ve Eylül–Ekim arası sıcak ama sakin dönemdir.',
  tourism_intro = ARRAY[
    'İspanya, flamenko ritimlerinden gotik katedrallerine, güneşli Endülüs sokaklarından Barselona''nın Gaudí mimarisine kadar birbirinden farklı bölgelerin bir araya geldiği büyüleyici bir destinasyondur. Her bölgenin kendi dili, mutfağı ve kültürel kimliği vardır.',
    'Akdeniz ve Atlantik kıyıları, Pire Ren dağları ve büyük şehirlerin yoğun sanat müzeleri İspanya''yı Avrupa''nın en çok ziyaret edilen ülkelerinden biri yapar.'
  ],
  tourism_highlights = ARRAY[
    'Barselona: Sagrada Família, Park Güell ve Barceloneta plajı',
    'Madrid: Prado Müzesi, Retiro Parkı ve Gran Vía',
    'Granada: Elhamra Sarayı ve Albaicín mahallesi — UNESCO Mirası',
    'Sevilla: Katedral, Alcázar ve Las Setas',
    'Toledo''nun ortaçağ sokakları ve Segovia Romanya akvedükti'
  ],
  tourism_tips = ARRAY[
    'İspanyollar geç yer; öğle 14:00–15:00, akşam 21:00–22:00 normaldir',
    'Siesta geleneği özellikle küçük kasabalarda öğle saatlerinde devam eder',
    'AVE yüksek hızlı trenler şehirler arasında çok konforlu ve hızlıdır',
    'Tapas kültüründe bardak şarap veya bira ile ücretsiz atıştırmalık verilir — şehirden şehire değişir'
  ]
WHERE slug = 'ispanya' AND has_tourism = false;

UPDATE countries SET
  has_tourism = true,
  tourism_best_time = 'Haziran–Ağustos arası uzun gündüzler ve ılıman hava sunar.',
  tourism_intro = ARRAY[
    'İsveç, ABBA''nın müziği ve IKEA''nın sadeliği gibi küresel kültüre armağanlarıyla tanınan; Kuzey Avrupa''nın zarif ve düzenli destinasyonudur. Stockholm''ün su üzerindeki ada kentsel dokusu Avrupa''nın en güzel şehir manzaralarından birini oluşturur.',
    'Güneyden kuzeye uzanan ülkede skoğe ormanları, midsommar gelenekleri, buzul göller ve Lapland''da ren geyiği safarileri yaşanabilir.'
  ],
  tourism_highlights = ARRAY[
    'Stockholm: Gamla Stan eski şehir, Vasa Müzesi ve Djurgården adası',
    'Götheborg: Liseberg eğlence parkı ve balık pazarı',
    'Dalarna''da midsommar kutlamaları ve kır evleri',
    'Swedish Lapland''da ren geyiği ve husky safari',
    'Öland ve Gotland adaları — yaz tatilinin gözdesi'
  ],
  tourism_tips = ARRAY[
    'İsveç pahalıdır; fika (kahve molası) kültürünü ucuz kafelerde yaşayabilirsiniz',
    'Nakit neredeyse kullanılmaz — kart her yerde geçerlidir',
    'Allemansrätten (herkes hakkı) kanunuyla doğada özgürce yürüyüp kamp yapabilirsiniz',
    'Temmuz''da pek çok Swede tatile gider; bazı dükkan ve restoranlar kapanır'
  ]
WHERE slug = 'isvec' AND has_tourism = false;

UPDATE countries SET
  has_tourism = true,
  tourism_best_time = 'Haziran–Eylül arası dağ ve göl keşfi için en uygun dönemdir.',
  tourism_intro = ARRAY[
    'İsviçre, Alp dorukları ve buz gibi gölleriyle doğanın mühendislik harikasına dönüştüğü, saatçilik geleneğinin ve çikolatanın simgesi olduğu bir destinasyondur. Zürih''in finans başkenti ciddiyetiyle Zermatt''ın dağ kasabası sakinliği aynı tren hattıyla birbirine bağlanır.',
    'Dört dilli bu küçük ülkede her bölge farklı bir kültürel kimlik taşır; Geneva Fransız inceliğini, Lugano İtalyan sıcaklığını, Bern ortaçağ Alman kentini yansıtır.'
  ],
  tourism_highlights = ARRAY[
    'Jungfraujoch — Avrupa''nın en yüksek tren istasyonu ve buzul manzarası',
    'Matterhorn ve Zermatt dağ kasabası',
    'Luzern: Ahşap köprü ve Aslan Anıtı',
    'Geneva: BM sarayı, CERN ve Leman Gölü',
    'Interlaken''dan paraşütle atlayış — adrenalin tutkunları için'
  ],
  tourism_tips = ARRAY[
    'İsviçre Avrupa''nın en pahalı destinasyonudur — bütçeyi iyi planlayın',
    'İsviçre Pass ile trenler, otobüsler ve bazı müzeler dahildir; çok tasarruf ettirir',
    'İsviçre Frangı kullanılır; Euro genellikle kabul edilir ama kur dezavantajlı olabilir',
    'Dağ yolları ve çıkıntılar bazı aktiviteler için erken rezervasyon gerektirir'
  ]
WHERE slug = 'isvicre' AND has_tourism = false;

UPDATE countries SET
  has_tourism = true,
  tourism_best_time = 'Mayıs–Eylül arası ılıman ve yeşil dönemdir.',
  tourism_intro = ARRAY[
    'İrlanda, zümrüt yeşili kırsalı, kayalık Atlantic kıyıları ve çay dolu publarıyla seyahatçiye sıcak bir kucak açar. Dublin''in canlı gece hayatı ve Trinity College''ın tarihi, Connemara''nın ıssız güzelliğiyle denge kurar.',
    'İrlanda folklorik geleneği, Galce dili ve Kelt mirası ülkeyi kültürel açıdan özgün kılar. Dost canlısı yerel halk seyahatin en büyük artısıdır.'
  ],
  tourism_highlights = ARRAY[
    'Dublin: Trinity College, Book of Kells ve Temple Bar',
    'Cliffs of Moher — Atlantik''in üzerinde 214 metre yüksekliğinde uçurumlar',
    'Ring of Kerry — güneybatı kıyısında döngüsel manzara yolu',
    'Galway şehri ve Aran Adaları',
    'Giant''s Causeway — Kuzey İrlanda''da bazalt kayalık oluşumları, UNESCO Mirası'
  ],
  tourism_tips = ARRAY[
    'Hava değişkendir — her mevsim yağmur yağabilir, su geçirmez giysi şarttır',
    'Pub kültürü sadece içki içmek değil; müzik, sohbet ve yerel yaşamdır',
    'Sol trafik geçerlidir — araç kiralayanlar dikkat',
    'Kırsal alanlarda nakit bulundurmak faydalıdır; ATM seyrek olabilir'
  ]
WHERE slug = 'irlanda' AND has_tourism = false;

UPDATE countries SET
  has_tourism = true,
  tourism_best_time = 'Ekim–Nisan arası büyük şehirlerde seyahat için idealdir; yaz sezonunda çok sıcak olur.',
  tourism_intro = ARRAY[
    'Çin, insanlığın en köklü uygarlıklarından birinin mirasını yaşayan dünyanın en büyük ülkelerinden biridir. Pekin''in imparatorluk saraylarından Şangay''ın fütüristik gökdelenlerine, Büyük Duvar''ın sarp geçitlerinden Guilin''in gizemli kireçtaşı sütunlarına eşi benzeri olmayan bir çeşitlilik sunar.',
    'Hızlı tren ağı ülkeyi uçtan uca bağlar; lezzet dünyası ise bölgeden bölgeye tamamen değişir. Çin mutfağı tek tip değil; Sichuan''ın acısı, Kanton''ın hafifliği, Şangay''ın tatlımsı sos kültürü farklı deneyimler sunar.'
  ],
  tourism_highlights = ARRAY[
    'Pekin: Yasak Şehir, Tiananmen Meydanı ve Büyük Duvar',
    'Şangay: Bund kıyısı, Yu Garden ve Pudong gökdelenleri',
    'Xi''an: Toprak Ordusu ve eski surlu şehir',
    'Guilin ve Yangshuo''nun karst nehir manzarası',
    'Chengdu''da dev panda üreme merkezi'
  ],
  tourism_tips = ARRAY[
    'Google, WhatsApp ve Instagram Çin''de çalışmaz; VPN önceden kurulmalıdır',
    'WeChat Pay veya Alipay olmadan ödeme yapmak zorlaşabilir; nakit da işe yarar',
    'Büyük şehirlerde hava kirliliği olabilir; maske ve hava kalitesi takibi önerilebilir',
    'Vize önceden alınmalıdır; kapıda vize yoktur'
  ]
WHERE slug = 'cin' AND has_tourism = false;
