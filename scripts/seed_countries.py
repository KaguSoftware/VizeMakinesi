# -*- coding: utf-8 -*-
"""
PDF rehberlerinden alınan ülke içeriklerini Supabase'e yazacak SQL'i üretir.

Kaynak: 35 adet "<Ülke> Vize Rehberi.pdf" (Almanya hariç 34 ülke yazılır;
Almanya zaten veritabanında mevcut ve şablonun kaynağıdır).

Çıktı: scripts/seed_countries.sql  ->  Supabase SQL Editor'e yapıştırılır.

Yazılan alanlar:
  countries.general_info, general_info_description, visa_types_description
  country_visa_types, country_process_steps, country_faqs
country_documents yazılmaz: her satır gerçek bir PDF dosyası (pdf_url) gerektirir.
"""

import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

# ---------------------------------------------------------------- yardımcılar

def q(s):
    return "'" + s.replace("'", "''") + "'"


def arr(items):
    return "ARRAY[" + ", ".join(q(i) for i in items) + "]::text[]"


# ---------------------------------------------------------------- Schengen şablonu

GI_DESC = "{N} vize başvurunuza başlamadan önce aşağıdaki temel bilgileri bilmeniz, süreci doğru planlamanıza yardımcı olacaktır."

GI_ZORUNLU = "Vize Zorunluluğu: Türkiye Cumhuriyeti umuma mahsus (bordo) pasaport sahipleri, {DAT} seyahat etmeden önce vize almak zorundadır."
GI_ZORUNLU_KISA = "Vize Zorunluluğu: Türkiye Cumhuriyeti umuma mahsus (bordo) pasaport sahipleri, {DAT} kısa süreli seyahatlerinde vize almak zorundadır."
GI_MUAF = "Vizeden Muaf Pasaportlar: Hususi (yeşil), hizmet (gri) ve diplomatik (siyah) pasaport sahipleri, 180 gün içinde 90 günü aşmayan seyahatlerinde vizeden muaftır."
GI_ULKE = ("Doğru Başvuru Ülkesi: Schengen vizesi başvurusu, seyahatinizde en uzun süre kalmayı planladığınız ülkenin "
           "temsilciliğine yapılmalıdır. Birden fazla Schengen ülkesinde eşit süre kalmayı planlıyorsanız, başvurunuzu "
           "ilk giriş yapacağınız ülkenin temsilciliğine yapmanız gerekir.")
GI_GIRIS = ("Ülkeye Giriş Yetkisi: Schengen vizesi sahibi olmak, ülkeye giriş hakkının kesin olarak tanındığı anlamına "
            "gelmez. Nihai değerlendirme, sınır kontrolü sırasında yetkili makamlar tarafından yapılır.")

VTD = "{DAT} yapacağınız seyahatin amacı, başvurmanız gereken vize türünü belirler. Aşağıda {N} için en sık başvurulan vize türlerini inceleyebilirsiniz."

VT_TEMPLATE = [
    ("{N} Turistik Vizesi",
     "Tatil, gezi, kültürel etkinlikler ve bireysel seyahatler amacıyla {DAT} gitmek isteyen kişilerin başvurabileceği Schengen (C Tipi) vizedir."),
    ("{N} Ticari Vizesi",
     "İş görüşmesi, şirket ziyareti, toplantı, fuar ve ticari etkinliklere katılım amacıyla yapılan seyahatler için başvurulan Schengen (C Tipi) vizedir."),
    ("{N} Aile Ziyareti Vizesi",
     "{LOC} yaşayan aile bireylerini veya yakınlarını ziyaret etmek isteyen kişilerin başvurabileceği Schengen (C Tipi) vizedir."),
    ("{N} Aile Birleşimi Vizesi",
     "{LOC} yasal olarak yaşayan aile bireylerinin yanına uzun süreli yerleşim amacıyla başvurulan Ulusal (D Tipi) vizedir."),
    ("{N} Öğrenci Vizesi",
     "{LOC} üniversite eğitimi veya diğer uzun süreli eğitim programlarına katılacak kişilerin başvurabileceği Ulusal (D Tipi) vizedir."),
    ("{N} Çalışma Vizesi",
     "{LOC} bir işveren yanında çalışmak, istihdam edilmek veya mesleki faaliyet yürütmek isteyen kişilerin başvurabileceği Ulusal (D Tipi) vizedir."),
    ("{N} Transit Vizesi",
     "{N} üzerinden başka bir ülkeye transit geçiş yapacak ve transit vizeye tabi olan yolcuların başvurabileceği Havaalanı Transit (A Tipi) vizedir."),
    ("{N} Fuar, Kültürel Etkinlik ve Konferans Vizesi",
     "{LOC} düzenlenen fuar, kongre, konferans ile kültürel veya bilimsel etkinliklere katılım amacıyla başvurulan Schengen (C Tipi) vizedir."),
]

STEPS_TEMPLATE = [
    ("Vize Türünün Belirlenmesi",
     "{N} vize başvurusu, seyahat amacınıza uygun vize türünün belirlenmesiyle başlar. Doğru vize türü, dosyanızın tutarlılığını belirleyen ilk adımdır."),
    ("Form ve Evrak Hazırlığı",
     "{N} vize başvuru formu doldurulur ve seyahat planınızı destekleyen belgeler hazırlanır."),
    ("Randevu, Evrak Teslimi ve Biyometrik İşlemler",
     "Randevu tarihinde başvuru merkezinde evrak teslimi yapılır ve biyometrik işlemler gerçekleştirilir. Schengen vize "
     "başvurularında parmak izi ve biyometrik fotoğraf işlemleri zorunludur. Daha önceki Schengen başvurularınızda alınan "
     "biyometrik veriler geçerli ise yeniden parmak izi vermeniz gerekmeyebilir."),
    ("Değerlendirme Süreci",
     "Başvuru dosyanız teslim edildikten sonra değerlendirme süreci başlar. {AUTH} gerekli gördüğü durumlarda ek belge talep edebilir."),
    ("Sonuç ve Pasaport Teslimi",
     "Değerlendirme tamamlandığında pasaportunuz başvuru merkezi aracılığıyla teslim edilir. Vizenizin onaylanması halinde "
     "pasaportunuz içerisinde vize etiketiyle birlikte teslim edilir; başvurunun olumsuz sonuçlanması halinde ise ret "
     "gerekçesini içeren karar formu ile birlikte pasaportunuz tarafınıza iade edilir."),
]

FAQ_TEMPLATE = [
    ("{N} vize başvurusunu ne kadar önce yapmalıyım?",
     "Schengen vize başvuruları, planlanan seyahat tarihinden en erken 6 ay önce yapılabilir. Randevu yoğunlukları ve "
     "değerlendirme süresi göz önünde bulundurulduğunda, başvurunuzu seyahatinizden en az 4–6 hafta önce tamamlamanız "
     "tavsiye edilir. Özellikle yoğun başvuru dönemlerinde randevu süreleri uzayabileceğinden başvurunuzu mümkün olduğunca "
     "erken planlamanız tavsiye edilir."),
    ("{N} vizesi kaç günde sonuçlanır?",
     "Schengen vize başvuruları, normal şartlarda başvurunun yetkili makamlara ulaşmasının ardından genellikle 15 takvim "
     "günü içerisinde sonuçlandırılır. Ancak ek belge talep edilmesi, yoğun başvuru dönemleri veya başvurunun detaylı "
     "incelemeye alınması durumunda bu süre uzayabilir. Seyahat planınızı riske atmamak için başvurunuzu son güne "
     "bırakmamanız önerilir."),
    ("{N} vize ücreti ne kadar?",
     "{N} vize başvuru ücreti; başvurulan vize türüne, başvuru sahibinin yaşına ve uygulanacak konsolosluk tarifesine göre "
     "değişiklik gösterebilir. Toplam maliyet; konsolosluk harcı, yetkili başvuru merkezi hizmet bedeli ve tercih edilmesi "
     "hâlinde seyahat sağlık sigortası veya ek başvuru hizmetlerinden oluşur. Başvuru öncesinde ödenecek tüm ücret "
     "kalemlerinin güncel tutarlarını öğrenmeniz, süreci doğru planlamanız açısından önemlidir."),
    ("{N} vizesi için banka hesabımda ne kadar para bulunmalıdır?",
     "{N} vize başvurusunda seyahat süresince yeterli maddi imkâna sahip olduğunuzu gösteren belgelerin sunulması gerekir. "
     "Başvurunuz değerlendirilirken yalnızca hesap bakiyesi değil; gelir durumunuz, hesap hareketleriniz ve sunduğunuz diğer "
     "belgeler de birlikte değerlendirilir. Bu nedenle önemli olan belirli bir tutar göstermekten ziyade, finansal "
     "durumunuzun başvuru dosyanızla tutarlı olmasıdır."),
    ("{N} vizesi için pasaportumun en az kaç ay geçerliliği olmalıdır?",
     "Schengen kuralları gereği pasaportunuzun, planlanan dönüş tarihinizden itibaren en az 3 ay daha geçerli olması "
     "gerekir. Ayrıca pasaportunuzun son 10 yıl içinde düzenlenmiş olması ve en az 2 boş sayfa içermesi zorunludur. Başvuru "
     "sürecinde olası sorunlarla karşılaşmamak adına, pasaportunuzun seyahat bitiş tarihinden sonra daha uzun süre "
     "geçerliliğini koruması tavsiye edilir."),
    ("{N} vizesi için parmak izi vermem gerekir mi?",
     "Schengen vize başvurularında biyometrik veri (parmak izi) verilmesi zorunludur. Ancak son 59 ay içinde herhangi bir "
     "Schengen ülkesi için biyometrik veri verdiyseniz, bu veriler geçerliliğini koruyorsa yeniden parmak izi vermeniz "
     "gerekmeyebilir. İlk kez başvuru yapıyorsanız veya biyometrik verilerinizin geçerlilik süresi dolmuşsa, başvuru "
     "merkezine şahsen giderek parmak izi vermeniz gerekir."),
    ("{N} vizesi ile diğer Schengen ülkelerine seyahat edebilir miyim?",
     "{N} tarafından verilen bir Schengen vizesi ile diğer Schengen ülkelerine seyahat edebilirsiniz. Ancak kural olarak; "
     "seyahatiniz birden fazla ülkeyi kapsıyorsa en uzun konaklamayı yapacağınız veya ana giriş yapacağınız ülkenin {N} "
     "olması gerekir. Ayrıca pasaport kontrolünde seyahat amacınızı ve planınızı kanıtlayan belgeleri (otel rezervasyonu, "
     "dönüş bileti vb.) yanınızda taşımanız önemlidir."),
    ("{N} Schengen vizesi ne kadar süreyle verilir?",
     "{N} tarafından verilen Schengen vizelerinin geçerlilik süresi, başvuru sahibinin seyahat geçmişi, seyahat amacı ve "
     "başvuru dosyasının değerlendirilmesine göre değişiklik gösterebilir. İlk başvurularda vize süresi çoğu zaman planlanan "
     "seyahat tarihleriyle sınırlı olurken, olumlu Schengen geçmişine sahip başvuru sahiplerine daha uzun süreli ve çok "
     "girişli vizeler verilebilmektedir. Vizenin geçerlilik süresi ve giriş hakkı tamamen yetkili makamların değerlendirmesi "
     "doğrultusunda belirlenir."),
    ("{N} vize başvuruları en çok hangi nedenlerle reddedilir?",
     "{N} vize başvurularının reddedilmesindeki en yaygın nedenler arasında; başvuru dosyasındaki bilgi ve belgelerin "
     "yetersiz veya tutarsız bulunması, finansal yeterliliğin yeterince gösterilememesi, seyahat amacının açık şekilde "
     "belgelenememesi ve başvuru sahibinin ülkesine geri döneceğine ilişkin yeterli kanaat oluşmaması yer alır."),
    ("{N} vize başvurum reddedilirse tekrar başvuru yapabilir miyim?",
     "{N} vize başvurunuzun reddedilmesi, yeniden başvuru yapmanıza engel değildir. Ancak yeni bir başvuru yapmadan önce ret "
     "gerekçesinin dikkatle değerlendirilmesi ve ret kararına neden olan eksiklik veya tutarsızlıkların giderilmesi "
     "önemlidir. Aynı bilgi ve belgelerle yeniden başvuru yapılması farklı bir sonuç doğurmayabilir. Bu nedenle yeni "
     "başvurunun, ret gerekçeleri dikkate alınarak daha güçlü ve tutarlı bir dosya ile hazırlanması tavsiye edilir."),
    ("İlk girişimi {ABL} yapmak zorunda mıyım?",
     "İlk uçuşunuzu veya girişinizi başka bir Schengen ülkesinden yapabilirsiniz. Ancak vizeyi {ABL} aldıysanız, "
     "seyahatinizin en uzun süren kısmını {LOC} geçirmeli veya seyahatinizin ana hedefi {N} olmalıdır."),
]

# ---------------------------------------------------------------- Schengen ülkeleri
# her kayıt: (slug, ad, yönelme, bulunma, ayrılma, başvuru-merkezi cümlesi,
#             4. adımdaki yetkili makam) + overrides

SCHENGEN = [
    dict(slug="avusturya", n="Avusturya", dat="Avusturya'ya", loc="Avusturya'da", abl="Avusturya'dan",
         merkez="Başvuru Merkezi: Avusturya vize başvuruları, ikamet ettiğiniz il için yetkilendirilmiş VFS Global başvuru merkezleri aracılığıyla kabul edilir.",
         auth="Konsolosluk veya yetkili makamlar",
         faq_over={1: "Schengen vize başvuruları, normal şartlarda başvurunun konsolosluğa ulaşmasının ardından genellikle 15 takvim günü içerisinde sonuçlandırılır. Ancak ek belge talep edilmesi, yoğun başvuru dönemleri veya başvurunun detaylı incelemeye alınması durumunda bu süre uzayabilir."}),

    dict(slug="belcika", n="Belçika", dat="Belçika'ya", loc="Belçika'da", abl="Belçika'dan",
         merkez="Başvuru Merkezi: Belçika vize başvuruları, Türkiye'de yetkilendirilmiş VFS Global başvuru merkezleri aracılığıyla kabul edilir. Türkiye'deki C tipi kısa süreli ve D tipi uzun süreli vize başvuruları, Belçika'nın İstanbul Başkonsolosluğu tarafından işleme alınır.",
         auth="Yetkili Belçika makamları",
         vt_over={4: "Belçika'da üniversite eğitimi, yükseköğrenim veya diğer uzun süreli eğitim programlarına katılacak kişilerin başvurabileceği Ulusal (D Tipi) vizedir.",
                  6: "Belçika üzerinden başka bir ülkeye transit geçiş yapacak ve transit vizeye tabi olan yolcuların başvurabileceği Havaalanı Transit (A Tipi) vizedir."},
         steps_over={
             1: "Belçika vize başvuru formu Visa on Web (VOW) portalı üzerinden doldurulur. Form tamamlandıktan sonra başvuru sahibi VFS Global'in randevu sistemine yönlendirilir.",
             2: "Randevu tarihinde başvuru merkezinde vize başvuru formu ve gerekli belgeler teslim edilir. Gerekli olması hâlinde parmak izi ve fotoğraf işlemleri gerçekleştirilir.",
             3: "Başvuru dosyanız teslim edildikten sonra işlem için İstanbul'daki Belçika Başkonsolosluğu'na gönderilir. Başvuru süreci boyunca dosyanızın durumunu çevrimiçi olarak takip edebilirsiniz. Yetkili Belçika makamları gerekli gördüğü durumlarda ek belge talep edebilir.",
             4: "Değerlendirme tamamlandığında pasaportunuz başvuru merkezi aracılığıyla teslim edilir veya ek ücret karşılığında kurye ile adresinize gönderilebilir."},
         faq_over={
             0: "Schengen vize başvuruları, planlanan seyahat tarihinden en erken 6 ay önce yapılabilir. Başvuruların seyahatten en geç 15 takvim günü önce yapılması gerekir. Randevu yoğunlukları ve değerlendirme süresi göz önünde bulundurulduğunda başvurunuzu mümkün olduğunca erken planlamanız tavsiye edilir.",
             1: "Schengen vize başvuruları normal şartlarda başvurunun sunulmasının ardından genellikle 15 gün içerisinde sonuçlandırılır. Başvurunun daha ayrıntılı incelenmesi veya Belçika Göçmenlik Ofisi'nin değerlendirmesine gönderilmesi gereken durumlarda işlem süresi yaklaşık 45 güne kadar uzayabilir.",
             3: "Belçika'da kısa süreli seyahatlerde yeterli maddi imkâna sahip olduğunuzu göstermeniz gerekir. Belçika'nın resmî referans tutarı, otelde konaklayan kişiler için günlük 95 Euro, arkadaş veya aile yanında konaklayan kişiler için ise günlük 45 Euro'dur. Finansal yeterlilik değerlendirilirken gelir durumunuz, banka hesap hareketleriniz ve sunduğunuz diğer belgeler de birlikte dikkate alınabilir.",
             5: "Schengen vize başvurularında biyometrik işlemler gerçekleştirilir. Ancak daha önce alınmış biyometrik verilerin geçerli olduğu durumlarda yeniden parmak izi alınması gerekmeyebilir. Belçika'nın Türkiye'deki resmî başvuru prosedürüne göre randevu sırasında gerekli olması hâlinde parmak izi ve fotoğraf alınır.",
             6: "Belçika tarafından verilen bir Schengen vizesi ile diğer Schengen ülkelerine seyahat edebilirsiniz. Ancak kural olarak seyahatiniz birden fazla ülkeyi kapsıyorsa en uzun konaklamayı yapacağınız veya seyahatinizin ana hedefini oluşturan ülkenin Belçika olması gerekir.",
             7: "Belçika tarafından verilen Schengen vizelerinin geçerlilik süresi, başvuru sahibinin seyahat amacı, seyahat geçmişi ve başvuru dosyasının değerlendirilmesine göre değişiklik gösterebilir. Vizenin geçerlilik süresi ve giriş hakkı, başvuruyu değerlendiren yetkili makamların kararı doğrultusunda belirlenir.",
             8: "Belçika vize başvurularının reddedilmesinde; başvuru dosyasındaki bilgi ve belgelerin yetersiz veya tutarsız bulunması, finansal yeterliliğin yeterince gösterilememesi, seyahat amacının açık şekilde belgelenememesi ve başvuru sahibinin seyahat sonunda Schengen bölgesinden ayrılacağına ilişkin yeterli kanaat oluşmaması gibi nedenler etkili olabilir.",
             10: "İlk uçuşunuzu veya girişinizi başka bir Schengen ülkesinden yapabilirsiniz. Ancak vizeyi Belçika'dan aldıysanız seyahatinizin en uzun süren kısmını Belçika'da geçirmeli veya seyahatinizin ana hedefi Belçika olmalıdır."}),

    dict(slug="bulgaristan", n="Bulgaristan", dat="Bulgaristan'a", loc="Bulgaristan'da", abl="Bulgaristan'dan",
         muaf="Vizeden Muaf Pasaportlar: Türkiye Cumhuriyeti diplomatik (siyah) ve hizmet (gri) pasaport sahipleri, kısa süreli seyahatlerinde vizeden muaftır. Hususi (yeşil) pasaport sahipleri için ise vize muafiyeti bulunmamaktadır.",
         merkez="Başvuru Merkezi: Bulgaristan vize başvuruları, Türkiye'deki yetkili başvuru merkezleri aracılığıyla kabul edilir. C tipi vize başvuruları Ankara, Bursa, Edirne, Gaziantep ve İstanbul'daki VFS Global merkezlerinden yapılmaktadır. D tipi vize başvurularında ise VFS Global üzerinden önceden randevu alınarak Ankara'daki Bulgaristan Büyükelçiliği'ne şahsen başvurulması gerekmektedir.",
         auth="Yetkili Bulgar makamları",
         vt_over={6: "Bulgaristan üzerinden başka bir ülkeye transit geçiş yapacak ve transit vizeye tabi olan yolcuların başvurabileceği Schengen (C Tipi) vizedir."},
         steps_over={
             2: "Randevu tarihinde başvuru merkezinde evrak teslimi yapılır ve biyometrik işlemler gerçekleştirilir. Schengen vize başvurularında parmak izi ve biyometrik fotoğraf işlemleri zorunludur. Daha önceki Schengen başvurularınızda alınan biyometrik veriler geçerli ise yeniden parmak izi vermeniz gerekmeyebilir. D tipi vize başvurularında ise kişisel başvuru ve görüşme gereklidir.",
             4: "Değerlendirme tamamlandığında pasaportunuz başvuru sürecinin yürütüldüğü kanal aracılığıyla teslim edilir. Vizenizin onaylanması halinde pasaportunuz içerisinde vize etiketiyle birlikte teslim edilir; başvurunun olumsuz sonuçlanması halinde ise ret kararı ile birlikte pasaportunuz tarafınıza iade edilir."},
         faq_over={
             3: "Bulgaristan vize başvurusunda seyahat süresince ulaşım, konaklama ve diğer masraflarınızı karşılayabilecek yeterli finansal kaynağa sahip olduğunuzu göstermeniz gerekir. Bununla birlikte yalnızca hesap bakiyesi değil; gelir durumunuz, hesap hareketleriniz ve sunduğunuz diğer belgeler de birlikte değerlendirilir. Bu nedenle finansal durumunuzun başvuru dosyanızla tutarlı olması önemlidir.",
             6: "Bulgaristan tarafından 31 Mart 2024 tarihinden itibaren verilen Schengen vizeleri ile diğer Schengen ülkelerine seyahat edebilirsiniz. Ancak kural olarak; seyahatiniz birden fazla ülkeyi kapsıyorsa en uzun konaklamayı yapacağınız veya ana destinasyonunuz olan ülkeye başvurmanız gerekir.",
             8: "Bulgaristan vize başvurularının reddedilmesindeki en yaygın nedenler arasında; başvuru dosyasındaki bilgi ve belgelerin yetersiz veya tutarsız bulunması, finansal yeterliliğin yeterince gösterilememesi, seyahat amacının açık şekilde belgelenememesi ve başvuru sahibinin seyahat sonunda Schengen bölgesinden ayrılacağına ilişkin yeterli kanaat oluşmaması yer alır.",
             10: "İlk uçuşunuzu veya girişinizi başka bir Schengen ülkesinden yapabilirsiniz. Ancak vizeyi Bulgaristan'dan aldıysanız, seyahatinizin en uzun süren kısmını Bulgaristan'da geçirmeli veya seyahatinizin ana hedefi Bulgaristan olmalıdır. Schengen vize başvurularında başvuru yapılacak ülke, seyahatin gerçek ana destinasyonuna göre belirlenmelidir."}),

    dict(slug="cekya", n="Çekya", dat="Çekya'ya", loc="Çekya'da", abl="Çekya'dan",
         merkez="Başvuru Merkezi: Çekya vize başvuruları, Türkiye'de ikamet edilen bölgeye göre yetkilendirilmiş VFS Global vize başvuru merkezleri aracılığıyla kabul edilir. Çekya'nın Ankara Büyükelçiliği ve İstanbul Başkonsolosluğu farklı illerden yapılan başvurulardan sorumludur.",
         auth="Çek Cumhuriyeti'nin yetkili makamları",
         vt_over={6: "Çekya üzerinden başka bir ülkeye transit geçiş yapacak ve transit vizeye tabi olan yolcuların başvurabileceği Havaalanı Transit (A Tipi) vizedir."},
         faq_over={
             0: "Schengen vize başvuruları, planlanan seyahat tarihinden en erken 6 ay önce yapılabilir. Başvuruların planlanan seyahatten en geç 15 takvim günü önce yapılması gerekir. Randevu yoğunlukları ve değerlendirme süresi göz önünde bulundurulduğunda, başvurunuzu seyahatinizden en az 4–6 hafta önce tamamlamanız tavsiye edilir.",
             1: "Schengen vize başvuruları, normal şartlarda başvurunun yetkili makama ulaşmasının ardından genellikle 15 takvim günü içerisinde sonuçlandırılır. Ancak ek belge talep edilmesi, yoğun başvuru dönemleri veya başvurunun detaylı incelemeye alınması durumunda bu süre uzayabilir.",
             3: "Çekya vize başvurusunda seyahat süresince yeterli maddi imkâna sahip olduğunuzu gösteren belgelerin sunulması gerekir. Başvurunuz değerlendirilirken yalnızca hesap bakiyesi değil; gelir durumunuz, hesap hareketleriniz ve sunduğunuz diğer belgeler de birlikte değerlendirilir. Bu nedenle önemli olan belirli bir tutar göstermekten ziyade, finansal durumunuzun başvuru dosyanızla tutarlı olmasıdır.",
             6: "Çekya tarafından verilen bir Schengen vizesi ile diğer Schengen ülkelerine seyahat edebilirsiniz. Ancak kural olarak; seyahatiniz birden fazla ülkeyi kapsıyorsa en uzun konaklamayı yapacağınız veya seyahatinizin ana hedefini oluşturan ülkenin Çekya olması gerekir. Ayrıca pasaport kontrolünde seyahat amacınızı ve planınızı kanıtlayan belgeleri (otel rezervasyonu, dönüş bileti vb.) yanınızda taşımanız önemlidir."}),

    dict(slug="danimarka", n="Danimarka", dat="Danimarka'ya", loc="Danimarka'da", abl="Danimarka'dan",
         merkez="Başvuru Merkezi: Danimarka vize başvuruları, Türkiye'de yetkilendirilmiş VFS Global vize başvuru merkezleri aracılığıyla kabul edilir. Başvurular Ankara, Antalya, İstanbul ve İzmir'deki VFS Global merkezlerinden yapılabilir. Başvuruların değerlendirilmesi Ankara'daki Danimarka Büyükelçiliği tarafından gerçekleştirilir.",
         auth="Danimarka Büyükelçiliği",
         vt_over={3: "Danimarka'da yasal olarak yaşayan aile bireylerinin yanına uzun süreli yerleşim amacıyla başvurulan uzun süreli oturum izni kapsamında değerlendirilen bir başvuru türüdür.",
                  4: "Danimarka'da üniversite eğitimi veya diğer uzun süreli eğitim programlarına katılacak kişilerin başvurabileceği uzun süreli oturum izni kapsamında değerlendirilen bir başvuru türüdür.",
                  5: "Danimarka'da bir işveren yanında çalışmak, istihdam edilmek veya mesleki faaliyet yürütmek isteyen kişilerin başvurabileceği uzun süreli oturum izni kapsamında değerlendirilen bir başvuru türüdür."},
         steps_over={3: "Başvuru dosyanız teslim edildikten sonra değerlendirme süreci başlar. Danimarka Büyükelçiliği gerekli gördüğü durumlarda ek belge talep edebilir veya başvuru sahibiyle iletişime geçebilir."},
         faq_over={
             0: "Schengen vize başvuruları, planlanan seyahat tarihinden en erken 6 ay önce yapılabilir. Başvuruların planlanan seyahatten en geç 15 gün önce yapılması gerekir. Randevu yoğunlukları ve değerlendirme süresi göz önünde bulundurulduğunda, başvurunuzu mümkün olduğunca erken planlamanız tavsiye edilir. Özellikle yoğun başvuru dönemlerinde randevu süreleri uzayabileceğinden başvurunuzu mümkün olduğunca erken planlamanız önemlidir.",
             1: "Schengen vize başvuruları, normal şartlarda başvurunun yetkili makama ulaşmasının ardından genellikle 15 takvim günü içerisinde sonuçlandırılır. Ancak ek belge talep edilmesi veya başvurunun daha ayrıntılı incelemeye alınması durumunda bu süre 45 güne kadar uzayabilir. Danimarka'nın Türkiye'deki resmî makamları ayrıca güncel dönemde olağan dışı başvuru yoğunluğu nedeniyle işlemlerin normalden daha uzun sürebildiğini belirtmektedir.",
             3: "Danimarka vize başvurusunda seyahat süresince yeterli maddi imkâna sahip olduğunuzu gösteren belgelerin sunulması gerekir. Başvurunuz değerlendirilirken yalnızca hesap bakiyesi değil; gelir durumunuz, hesap hareketleriniz ve sunduğunuz diğer belgeler de birlikte değerlendirilir. Bu nedenle önemli olan belirli bir tutar göstermekten ziyade, finansal durumunuzun başvuru dosyanızla tutarlı olmasıdır.",
             6: "Danimarka tarafından verilen bir Schengen vizesi ile diğer Schengen ülkelerine seyahat edebilirsiniz. Ancak vize başvurunuzun Danimarka'ya yapılabilmesi için Danimarka'nın seyahatinizin ana destinasyonu olması gerekir. Danimarka makamları, Danimarka'yı ana destinasyonunuz olarak göstermeden alınan bir Danimarka Schengen vizesiyle başka bir Schengen ülkesine seyahat edilmesi durumunda girişte sorun yaşanabileceği ve vizenin iptal edilebileceği konusunda uyarıda bulunmaktadır.",
             10: "İlk uçuşunuzu veya girişinizi başka bir Schengen ülkesinden yapabilirsiniz. Ancak vizeyi Danimarka'dan aldıysanız, Danimarka seyahatinizin ana destinasyonu olmalıdır. Seyahatinizde başka bir Schengen ülkesinde daha uzun süre kalmayı planlıyorsanız, vize başvurunuzu o ülkeye yapmanız gerekir."}),

    dict(slug="estonya", n="Estonya", dat="Estonya'ya", loc="Estonya'da", abl="Estonya'dan",
         zorunlu_kisa=True,
         muaf="Vizeden Muaf Pasaportlar: Türkiye Cumhuriyeti diplomatik (siyah), hizmet (gri) ve hususi (yeşil) pasaport sahipleri, Estonya'ya 90 güne kadar kısa süreli seyahatlerinde vizeden muaftır.",
         merkez="Başvuru Merkezi: Estonya'nın Türkiye'deki kısa süreli Schengen vize başvuruları VFS Global başvuru merkezleri aracılığıyla kabul edilmektedir.",
         auth="Estonya'nın yetkili makamları",
         vt_over={3: "Estonya'da yaşayan aile bireylerinin yanına uzun süreli yerleşim amacıyla başvurulan Ulusal (D Tipi) vizedir.",
                  4: "Estonya'da eğitim veya araştırma amacıyla uzun süreli bulunacak kişilerin başvurabileceği Ulusal (D Tipi) vizedir.",
                  5: "Estonya'da çalışmak veya uzun süreli mesleki faaliyet yürütmek isteyen kişilerin başvurabileceği Ulusal (D Tipi) vizedir."},
         faq_over={
             0: "Schengen vize başvuruları, planlanan seyahat tarihinden en erken 6 ay önce yapılabilir. Randevu yoğunlukları ve değerlendirme süresi göz önünde bulundurulduğunda başvurunuzu seyahatinizden en az 4–6 hafta önce tamamlamanız tavsiye edilir. Özellikle yoğun başvuru dönemlerinde randevu süreleri uzayabileceğinden başvurunuzu mümkün olduğunca erken planlamanız tavsiye edilir.",
             1: "Schengen vize başvuruları normal şartlarda başvurunun yetkili makamlara ulaşmasının ardından genellikle 15 takvim günü içerisinde sonuçlandırılır. Ancak ek belge talep edilmesi veya başvurunun daha ayrıntılı incelenmesi gereken durumlarda bu süre uzayabilir. Seyahat planınızı riske atmamak için başvurunuzu son güne bırakmamanız önerilir.",
             2: "Estonya vize başvuru ücreti; başvurulan vize türüne, başvuru sahibinin yaşına ve uygulanacak güncel tarifeye göre değişiklik gösterebilir. Ayrıca yetkili başvuru merkezi tarafından hizmet bedeli alınabilir. Başvuru öncesinde güncel ücretlerin kontrol edilmesi gerekir.",
             3: "Estonya vize başvurusunda seyahat süresince ulaşım, konaklama ve diğer masraflarınızı karşılayabilecek yeterli finansal kaynağa sahip olduğunuzu göstermeniz gerekir. Finansal durumunuz değerlendirilirken geliriniz, banka hesap hareketleriniz ve sunduğunuz diğer belgeler birlikte dikkate alınabilir.",
             4: "Schengen vize başvurularında pasaportunuzun planlanan dönüş tarihinizden itibaren en az 3 ay daha geçerli olması, en az 2 boş sayfa içermesi ve son 10 yıl içinde düzenlenmiş olması gerekir.",
             5: "Schengen vize başvurularında biyometrik veriler alınır. Daha önceki bir Schengen başvurusunda alınan parmak izlerinin geçerli olduğu durumlarda yeniden parmak izi alınması gerekmeyebilir.",
             6: "Estonya tarafından verilen geçerli bir Schengen vizesi ile diğer Schengen ülkelerine seyahat edebilirsiniz. Ancak vize başvurusu yapılırken seyahatinizin ana destinasyonunun Estonya olması veya Schengen kurallarına göre Estonya'nın başvuru yapılması gereken ülke olması gerekir.",
             7: "Estonya tarafından verilen Schengen vizelerinin geçerlilik süresi, başvuru sahibinin seyahat amacı, seyahat geçmişi ve başvuru dosyasının değerlendirilmesine göre değişiklik gösterebilir. Vizenin geçerlilik süresi ve giriş sayısı yetkili makamların değerlendirmesi doğrultusunda belirlenir.",
             8: "Estonya vize başvurularının reddedilmesinde; başvuru dosyasındaki bilgi ve belgelerin yetersiz veya tutarsız bulunması, seyahat amacının yeterince belgelenmemesi, finansal yeterliliğin gösterilememesi veya başvuru sahibinin vize şartlarını karşılamadığı kanaatine varılması gibi nedenler etkili olabilir.",
             9: "Estonya vize başvurunuzun reddedilmesi, yeni bir başvuru yapılmasına engel değildir. Ancak yeni bir başvuru öncesinde ret gerekçesinin dikkatle değerlendirilmesi ve varsa eksikliklerin veya tutarsızlıkların giderilmesi önemlidir.",
             10: "Schengen vize başvurularında başvuru yapılacak ülke, seyahatin ana destinasyonuna göre belirlenir. Estonya'dan alınan bir Schengen vizesiyle başka bir Schengen ülkesinden giriş yapılması tek başına vizeyi geçersiz hâle getirmez; ancak seyahat planınızın vizenin verildiği ülkeyi ana destinasyon olarak göstermesi gerekir."}),

    dict(slug="finlandiya", n="Finlandiya", dat="Finlandiya'ya", loc="Finlandiya'da", abl="Finlandiya'dan",
         zorunlu_kisa=True,
         muaf="Vizeden Muaf Pasaportlar: Türkiye Cumhuriyeti diplomatik (siyah), hizmet (gri) ve hususi (yeşil) pasaport sahipleri, Finlandiya'ya kısa süreli seyahatlerinde vizeden muaftır.",
         merkez="Başvuru Merkezi: Finlandiya'nın Türkiye'deki vize başvuruları VFS Global tarafından kabul edilmektedir. Vize başvuru merkezleri Ankara, İstanbul, İzmir ve Antalya'da hizmet vermektedir.",
         auth="Konsolosluk veya yetkili makamlar",
         vt_over={3: "Finlandiya'da yaşayan aile bireylerinin yanına uzun süreli yerleşim amacıyla başvurulan Ulusal (D Tipi) vizedir.",
                  4: "Finlandiya'da eğitim amacıyla uzun süreli bulunacak kişilerin başvurabileceği Ulusal (D Tipi) vizedir.",
                  5: "Finlandiya'da çalışmak veya uzun süreli mesleki faaliyet yürütmek isteyen kişilerin başvurabileceği Ulusal (D Tipi) vizedir."},
         faq_over={
             1: "Schengen vize başvuruları normal şartlarda başvurunun yetkili makamlara ulaşmasının ardından genellikle 15 takvim günü içerisinde sonuçlandırılır. Ancak ek belge talep edilmesi veya başvurunun daha ayrıntılı incelenmesi gereken durumlarda bu süre uzayabilir. Seyahat planınızı riske atmamak için başvurunuzu son güne bırakmamanız önerilir.",
             2: "Finlandiya vize başvuru ücreti; başvurulan vize türüne, başvuru sahibinin yaşına ve uygulanacak güncel tarifeye göre değişiklik gösterebilir. Ayrıca yetkili başvuru merkezi tarafından hizmet bedeli alınabilir. Başvuru öncesinde güncel ücretlerin kontrol edilmesi gerekir.",
             3: "Finlandiya vize başvurusunda seyahat süresince ulaşım, konaklama ve diğer masraflarınızı karşılayabilecek yeterli finansal kaynağa sahip olduğunuzu göstermeniz gerekir. Finansal durumunuz değerlendirilirken geliriniz, banka hesap hareketleriniz ve sunduğunuz diğer belgeler birlikte dikkate alınabilir.",
             4: "Schengen vize başvurularında pasaportunuzun planlanan dönüş tarihinizden itibaren en az 3 ay daha geçerli olması, en az 2 boş sayfa içermesi ve son 10 yıl içinde düzenlenmiş olması gerekir.",
             5: "Schengen vize başvurularında biyometrik veriler alınır. Daha önceki bir Schengen vize başvurusunda alınan parmak izlerinin geçerli olduğu durumlarda yeniden parmak izi alınması gerekmeyebilir.",
             6: "Finlandiya tarafından verilen geçerli bir Schengen vizesi ile diğer Schengen ülkelerine seyahat edebilirsiniz. Ancak vize başvurusu yapılırken seyahatinizin ana destinasyonunun Finlandiya olması veya Schengen kurallarına göre Finlandiya'nın başvuru yapılması gereken ülke olması gerekir.",
             7: "Finlandiya tarafından verilen Schengen vizelerinin geçerlilik süresi, başvuru sahibinin seyahat amacı, seyahat geçmişi ve başvuru dosyasının değerlendirilmesine göre değişiklik gösterebilir. Vizenin geçerlilik süresi ve giriş sayısı yetkili makamların değerlendirmesi doğrultusunda belirlenir.",
             8: "Finlandiya vize başvurularının reddedilmesinde; başvuru dosyasındaki bilgi ve belgelerin yetersiz veya tutarsız bulunması, seyahat amacının yeterince belgelenmemesi, finansal yeterliliğin gösterilememesi veya başvuru sahibinin vize şartlarını karşılamadığı kanaatine varılması gibi nedenler etkili olabilir.",
             9: "Finlandiya vize başvurunuzun reddedilmesi, yeni bir başvuru yapılmasına engel değildir. Ancak yeni bir başvuru öncesinde ret gerekçesinin dikkatle değerlendirilmesi ve varsa eksikliklerin veya tutarsızlıkların giderilmesi önemlidir.",
             10: "Schengen vize başvurularında başvuru yapılacak ülke, seyahatin ana destinasyonuna göre belirlenir. Finlandiya'dan alınan bir Schengen vizesiyle başka bir Schengen ülkesinden giriş yapılması tek başına vizeyi geçersiz hâle getirmez; ancak seyahat planınızın vizenin verildiği ülkeyi ana destinasyon olarak göstermesi gerekir."}),

    dict(slug="fransa", n="Fransa", dat="Fransa'ya", loc="Fransa'da", abl="Fransa'dan",
         merkez="Başvuru Merkezi: Fransa vize başvuruları, Türkiye'de ikamet edilen konsolosluk bölgesine göre yetkili VFS Global başvuru merkezleri aracılığıyla kabul edilir. Fransa'nın Türkiye'deki başvuru merkezleri Ankara, Gaziantep, İstanbul ve İzmir'de bulunmaktadır.",
         auth="Fransa'nın yetkili makamları",
         vt_over={6: "Fransa üzerinden başka bir ülkeye transit geçiş yapacak ve transit vizeye tabi olan yolcuların başvurabileceği havaalanı transit vizesidir. Türkiye Cumhuriyeti vatandaşları, Fransa havalimanlarının uluslararası transit alanından başka bir ülkeye geçişlerinde belirli koşullarda havaalanı transit vizesine tabi olabilir."},
         steps_over={
             2: "Randevu tarihinde yetkili VFS Global başvuru merkezinde evrak teslimi yapılır ve biyometrik işlemler gerçekleştirilir. Schengen vize başvurularında parmak izi ve biyometrik fotoğraf işlemleri zorunludur. Daha önceki Schengen başvurularınızda alınan biyometrik veriler geçerli ise yeniden parmak izi vermeniz gerekmeyebilir.",
             3: "Başvuru dosyanız teslim edildikten sonra değerlendirme süreci başlar. Fransa'nın Türkiye'deki vize başvuruları Ankara'daki Fransa Büyükelçiliği ve İstanbul'daki Fransa Başkonsolosluğu tarafından incelenir ve vize kararları bu yetkili makamlar tarafından verilir. Gerekli görülen durumlarda ek belge veya bilgi talep edilebilir.",
             4: "Değerlendirme tamamlandığında pasaportunuz başvuru merkezi aracılığıyla teslim edilir."},
         faq_over={
             0: "Schengen vize başvuruları, planlanan seyahat tarihinden en erken 6 ay önce yapılabilir. Randevu yoğunlukları ve değerlendirme süresi göz önünde bulundurulduğunda, başvurunuzu seyahatinizden en az 4–6 hafta önce tamamlamanız tavsiye edilir. Özellikle yoğun başvuru dönemlerinde randevu süreleri uzayabileceğinden başvurunuzu mümkün olduğunca erken planlamanız tavsiye edilir. Fransa'nın Türkiye'deki resmi bilgilendirmesinde de randevu sürelerinin dönemsel yoğunluğa göre değişebileceği belirtilmektedir.",
             1: "Fransa Schengen vize başvurularının sonuçlanma süresi, başvurunun niteliğine, dönemsel yoğunluğa ve gerekli görülmesi hâlinde ek belge veya inceleme talep edilmesine göre değişebilir. Bu nedenle başvurunuz için kesin bir sonuçlanma süresi garanti edilemez. Seyahat planınızı riske atmamak için başvurunuzu son güne bırakmamanız önerilir.",
             2: "Fransa vize başvuru ücreti; başvurulan vize türüne, başvuru sahibinin yaşına ve uygulanacak güncel konsolosluk tarifesine göre değişiklik gösterebilir. Toplam maliyet; konsolosluk harcı, yetkili başvuru merkezi hizmet bedeli ve tercih edilmesi hâlinde ek başvuru hizmetlerinden oluşabilir. Başvuru öncesinde ödenecek tüm ücret kalemlerinin güncel tutarlarını öğrenmeniz, süreci doğru planlamanız açısından önemlidir.",
             3: "Fransa vize başvurusunda seyahat süreniz boyunca ulaşım, konaklama ve diğer masraflarınızı karşılayabilecek yeterli finansal kaynağa sahip olduğunuzu göstermeniz gerekir. Bununla birlikte yalnızca hesap bakiyesi değil; gelir durumunuz, hesap hareketleriniz ve sunduğunuz diğer belgeler de birlikte değerlendirilir. Bu nedenle önemli olan belirli bir tutar göstermekten ziyade, finansal durumunuzun başvuru dosyanızla tutarlı olmasıdır.",
             5: "Schengen vize başvurularında biyometrik veri (parmak izi) verilmesi zorunludur. Ancak daha önceki Schengen başvurularınızda alınan biyometrik veriler geçerli ise yeniden parmak izi vermeniz gerekmeyebilir. İlk kez başvuru yapıyorsanız veya biyometrik verilerinizin yeniden alınması gerekiyorsa, başvuru merkezine şahsen giderek biyometrik işlemlerinizi tamamlamanız gerekir.",
             6: "Fransa tarafından verilen bir Schengen vizesi ile diğer Schengen ülkelerine seyahat edebilirsiniz. Ancak kural olarak; seyahatiniz birden fazla ülkeyi kapsıyorsa en uzun konaklamayı yapacağınız veya ana hedefiniz olan ülkenin Fransa olması gerekir. Ayrıca seyahat planınızın vize başvurusu sırasında sunduğunuz bilgilerle uyumlu olması önemlidir.",
             7: "Fransa tarafından verilen Schengen vizelerinin geçerlilik süresi, başvuru sahibinin seyahat geçmişi, seyahat amacı ve başvuru dosyasının değerlendirilmesine göre değişiklik gösterebilir. İlk başvurularda vize süresi çoğu zaman planlanan seyahat tarihleriyle sınırlı olurken, uygun Schengen geçmişine sahip başvuru sahiplerine daha uzun süreli ve çok girişli vizeler verilebilmektedir. Vizenin geçerlilik süresi ve giriş hakkı tamamen yetkili makamların değerlendirmesi doğrultusunda belirlenir.",
             8: "Fransa vize başvurularının reddedilmesindeki yaygın nedenler arasında; başvuru dosyasındaki bilgi ve belgelerin yetersiz veya tutarsız bulunması, finansal yeterliliğin yeterince gösterilememesi, seyahat amacının açık şekilde belgelenememesi ve başvuru sahibinin ülkesine geri döneceğine ilişkin yeterli kanaat oluşmaması yer alır.",
             10: "İlk uçuşunuzu veya girişinizi başka bir Schengen ülkesinden yapabilirsiniz. Ancak vizeyi Fransa'dan aldıysanız, seyahatinizin en uzun süren kısmını Fransa'da geçirmeli veya seyahatinizin ana hedefi Fransa olmalıdır. Vize başvurusunda sunduğunuz seyahat planının gerçek seyahatinizle uyumlu olması önemlidir."}),

    dict(slug="hirvatistan", n="Hırvatistan", dat="Hırvatistan'a", loc="Hırvatistan'da", abl="Hırvatistan'dan",
         merkez="Başvuru Merkezi: Hırvatistan vize başvuruları, Türkiye'de yetkilendirilmiş VFS Global vize başvuru merkezleri aracılığıyla kabul edilir.",
         auth="Yetkili Hırvatistan makamları",
         vt_over={6: "Hırvatistan üzerinden başka bir ülkeye transit geçiş yapacak ve transit vizeye tabi olan yolcuların başvurabileceği Schengen (A Tipi) vizedir."},
         faq_over={
             1: "Schengen vize başvuruları, normal şartlarda başvurunun konsolosluğa ulaşmasının ardından genellikle 15 takvim günü içerisinde sonuçlandırılır. Ancak ek belge talep edilmesi, yoğun başvuru dönemleri veya başvurunun detaylı incelemeye alınması durumunda bu süre 45 takvim gününe kadar uzayabilir."}),

    dict(slug="hollanda", n="Hollanda", dat="Hollanda'ya", loc="Hollanda'da", abl="Hollanda'dan",
         merkez="Başvuru Merkezi: Hollanda vize başvuruları, Türkiye'de yetkilendirilmiş VFS Global başvuru merkezleri aracılığıyla kabul edilir.",
         auth="Hollanda Dışişleri Bakanlığı",
         vtd_extra=True,
         vt_over={3: "Hollanda'da yasal olarak yaşayan aile bireylerinin yanına uzun süreli yerleşim amacıyla başvurulan uzun süreli vize ve oturum prosedürüdür.",
                  4: "Hollanda'da üniversite eğitimi veya diğer uzun süreli eğitim programlarına katılacak kişilerin başvurabileceği uzun süreli vize ve oturum prosedürüdür.",
                  5: "Hollanda'da bir işveren yanında çalışmak, istihdam edilmek veya mesleki faaliyet yürütmek isteyen kişilerin başvurabileceği uzun süreli vize ve oturum prosedürüdür.",
                  6: "Hollanda üzerinden başka bir ülkeye havaalanı transit geçişi yapacak ve transit vizeye tabi olan yolcuların başvurabileceği Havaalanı Transit Vizesidir."},
         steps_over={3: "Başvuru dosyanız teslim edildikten sonra değerlendirme süreci başlar. Hollanda Dışişleri Bakanlığı gerekli gördüğü durumlarda ek belge veya görüşme talep edebilir."},
         faq_over={
             0: "Schengen vize başvuruları, planlanan seyahat tarihinden en erken 6 ay önce yapılabilir. Hollanda için başvuruların seyahat tarihinden en geç 45 gün önce yapılması gerekir. Randevu yoğunlukları ve değerlendirme süresi göz önünde bulundurulduğunda, başvurunuzu mümkün olduğunca erken planlamanız tavsiye edilir.",
             1: "Hollanda Schengen vize başvuruları, güncel olarak ortalama 25 takvim günü içerisinde sonuçlandırılmaktadır. Ancak ek belge talep edilmesi, yoğun başvuru dönemleri veya başvurunun daha ayrıntılı incelemeye alınması durumunda bu süre 45 takvim gününe kadar uzayabilir.",
             3: "Hollanda makamları tarafından belirlenmiş tek bir resmi minimum banka bakiyesi bulunmamaktadır. Başvurunuz değerlendirilirken hesabınızda, seyahat süreniz boyunca ulaşım, konaklama ve diğer masraflarınızı karşılayabilecek yeterli finansal kaynağın bulunması beklenir. Bununla birlikte yalnızca hesap bakiyesi değil; gelir durumunuz, hesap hareketleriniz ve sunduğunuz diğer belgeler de birlikte değerlendirilir. Bu nedenle önemli olan belirli bir tutar göstermekten ziyade, finansal durumunuzun başvuru dosyanızla tutarlı olmasıdır.",
             5: "Schengen vize başvurularında 12 yaş ve üzerindeki başvuru sahiplerinden biyometrik veri (parmak izi) alınır. Ancak son 59 ay içinde herhangi bir Schengen ülkesi için biyometrik veri verdiyseniz, bu veriler geçerliliğini koruyorsa yeniden parmak izi vermeniz gerekmeyebilir. İlk kez başvuru yapıyorsanız veya biyometrik verilerinizin geçerlilik süresi dolmuşsa, başvuru merkezine şahsen giderek parmak izi vermeniz gerekir.",
             7: "Hollanda tarafından verilen Schengen vizelerinin geçerlilik süresi, başvuru sahibinin seyahat geçmişi, seyahat amacı ve başvuru dosyasının değerlendirilmesine göre değişiklik gösterebilir. İlk başvurularda vize süresi çoğu zaman planlanan seyahat tarihleriyle sınırlı olurken, olumlu Schengen geçmişine sahip başvuru sahiplerine daha uzun süreli ve çok girişli vizeler verilebilmektedir. Vizenin geçerlilik süresi ve giriş hakkı tamamen konsolosluğun değerlendirmesi doğrultusunda belirlenir."}),

    dict(slug="ispanya", n="İspanya", dat="İspanya'ya", loc="İspanya'da", abl="İspanya'dan",
         zorunlu="Vize Zorunluluğu: Türkiye Cumhuriyeti umuma mahsus (bordo) pasaport sahipleri, İspanya'ya seyahat etmeden önce vize almak zorundadır. İspanya, Schengen vizesine tabi ülkeler arasında yer almaktadır.",
         ulke=GI_ULKE + " İspanya, seyahatin tek veya ana destinasyonu olduğu durumlarda başvuruyu kabul eder.",
         merkez="Başvuru Merkezi: İspanya vize başvuruları, ikamet edilen konsolosluk yetki alanına göre yetkilendirilmiş BLS International başvuru merkezleri aracılığıyla kabul edilir. BLS International'ın Türkiye'de İstanbul, İzmir ve Antalya başvuru merkezleri bulunmaktadır.",
         auth="Konsolosluk veya yetkili makamlar",
         vt_over={4: "İspanya'da üniversite eğitimi veya 90 günden uzun süreli eğitim programlarına katılacak kişilerin başvurabileceği Ulusal (D Tipi) vizedir. 90 güne kadar olan eğitimlerde ise koşullara göre Schengen vizesi uygulanabilir.",
                  6: "İspanya üzerinden başka bir ülkeye transit geçiş yapacak ve transit vizeye tabi olan yolcuların başvurabileceği Havaalanı Transit (A Tipi) vizedir.",
                  7: "İspanya'da düzenlenen fuar, kongre, konferans ile kültürel veya bilimsel etkinliklere katılım amacıyla başvurulan Schengen (C Tipi) vizedir. Ticari, kültürel ve benzeri kısa süreli faaliyetler Schengen vizesi kapsamında değerlendirilebilir."},
         steps_over={
             2: "Randevu tarihinde yetkili BLS International başvuru merkezinde evrak teslimi yapılır ve biyometrik işlemler gerçekleştirilir. Schengen vize başvurularında parmak izi ve biyometrik fotoğraf işlemleri gerçekleştirilir. Daha önceki Schengen başvurularınızda alınan biyometrik veriler geçerli ise yeniden parmak izi vermeniz gerekmeyebilir. İspanya'nın resmi başvuru prosedüründe başvuru sırasında yüz görüntüsü ve parmak izi alınmaktadır.",
             4: "Değerlendirme tamamlandığında pasaportunuz başvuru merkezi veya konsolosluğun belirlediği yöntem aracılığıyla teslim edilir. Vizenizin onaylanması halinde pasaportunuz içerisinde vize etiketiyle birlikte teslim edilir; başvurunun olumsuz sonuçlanması halinde ise ret gerekçesini içeren karar ile birlikte pasaportunuz tarafınıza iade edilir."},
         faq_over={
             0: "Schengen vize başvuruları, planlanan seyahat tarihinden en erken 6 ay önce yapılabilir. İspanya'nın resmi bilgilendirmesine göre başvuruların seyahat tarihinden en az 15 gün önce yapılması gerekir. Randevu yoğunlukları ve değerlendirme süresi göz önünde bulundurulduğunda, başvurunuzu seyahatinizden en az 4–6 hafta önce tamamlamanız tavsiye edilir.",
             1: "Schengen vize başvuruları, normal şartlarda başvurunun sunulmasının ardından 15 takvim günü içerisinde sonuçlandırılır. Ancak bazı başvurularda ek inceleme veya yetkili makamlarla istişare gerekmesi halinde değerlendirme süresi uzayabilir. Seyahat planınızı riske atmamak için başvurunuzu son güne bırakmamanız önerilir.",
             2: "İspanya vize başvuru ücreti; başvurulan vize türüne, başvuru sahibinin yaşına ve uygulanacak güncel konsolosluk tarifesine göre değişiklik gösterebilir. Toplam maliyet; konsolosluk harcı, yetkili başvuru merkezi hizmet bedeli ve tercih edilmesi hâlinde seyahat sağlık sigortası veya ek başvuru hizmetlerinden oluşur. Başvuru öncesinde ödenecek tüm ücret kalemlerinin güncel tutarlarını öğrenmeniz, süreci doğru planlamanız açısından önemlidir.",
             3: "İspanya vize başvurusunda seyahat süreniz boyunca ulaşım, konaklama ve diğer masraflarınızı karşılayabilecek yeterli finansal kaynağa sahip olduğunuzu göstermeniz gerekir. Başvurunun değerlendirilmesinde finansal durumunuzu gösteren belgeler ile seyahat amacınızı ve koşullarınızı destekleyen diğer belgeler birlikte değerlendirilir. Bu nedenle önemli olan belirli bir tutar göstermekten ziyade, finansal durumunuzun başvuru dosyanızla tutarlı olmasıdır.",
             4: "Schengen kuralları gereği pasaportunuzun, planlanan dönüş tarihinizden itibaren en az 3 ay daha geçerli olması gerekir. Ayrıca pasaportunuzun son 10 yıl içinde düzenlenmiş olması ve en az 2 boş sayfa içermesi zorunludur.",
             5: "Schengen vize başvurularında biyometrik veri alınması gerekmektedir. Başvuru sırasında yüz görüntüsü ve parmak izi alınır. Daha önce alınmış biyometrik verilerin geçerli olduğu durumlarda yeniden parmak izi alınması gerekmeyebilir.",
             6: "İspanya tarafından verilen bir Schengen vizesi ile diğer Schengen ülkelerine seyahat edebilirsiniz. Ancak seyahatiniz birden fazla ülkeyi kapsıyorsa, başvurunun İspanya'nın seyahatinizdeki tek veya ana destinasyon olması esasına göre yapılmış olması gerekir. Ayrıca Schengen vizesi, sınırdan otomatik giriş hakkı sağlamaz.",
             7: "İspanya tarafından verilen Schengen vizelerinin geçerlilik süresi, başvuru sahibinin seyahat amacı, seyahat geçmişi ve başvuru dosyasının değerlendirilmesine göre değişiklik gösterebilir. Vizenin geçerlilik süresi ve giriş hakkı, başvuruyu değerlendiren yetkili makamların kararı doğrultusunda belirlenir.",
             8: "İspanya vize başvurularının reddedilmesinde; başvuru dosyasındaki bilgi ve belgelerin yetersiz veya tutarsız bulunması, seyahat amacının ve koşullarının yeterince belgelenememesi, finansal durumun yeterli görülmemesi veya başvuru sahibinin vize şartlarını karşılamadığı kanaatine varılması gibi nedenler etkili olabilir.",
             9: "İspanya vize başvurunuzun reddedilmesi, yeniden başvuru yapmanıza engel değildir. Ancak yeni bir başvuru yapmadan önce ret gerekçesinin dikkatle değerlendirilmesi ve ret kararına neden olan eksiklik veya tutarsızlıkların giderilmesi önemlidir. İspanya'nın resmi prosedüründe ret kararı yazılı olarak bildirilir ve başvuru sahibine belirli süreler içinde itiraz yolları da tanınır.",
             10: "İlk uçuşunuzu veya girişinizi başka bir Schengen ülkesinden yapabilirsiniz. Ancak vizeyi İspanya'dan aldıysanız, seyahatinizin ana destinasyonunun İspanya olması gerekir. Schengen vizesi başvurusu, seyahatin tek veya ana destinasyonu olan ülkeye yapılmalıdır."}),

    dict(slug="isvicre", n="İsviçre", dat="İsviçre'ye", loc="İsviçre'de", abl="İsviçre'den",
         merkez="Başvuru Merkezi: İsviçre vize başvuruları, Türkiye'de İsviçre'nin Ankara ve İstanbul'daki temsilcilikleri tarafından yetkilendirilen VFS Global başvuru merkezleri aracılığıyla kabul edilir. Türkiye'de İstanbul ve Ankara'da VFS Global başvuru merkezleri bulunmaktadır.",
         auth="İsviçre'nin yetkili makamları",
         vt_over={6: "İsviçre üzerinden başka bir ülkeye transit geçiş yapacak ve transit vizeye tabi olan yolcuların başvurabileceği Havaalanı Transit (A Tipi) vizedir."},
         faq_over={
             0: "Schengen vize başvuruları, planlanan seyahat tarihinden en erken 6 ay önce yapılabilir. İsviçre'nin Türkiye'deki resmî bilgilendirmesine göre başvurunun planlanan seyahatten en geç 15 gün önce yapılması gerekir. Randevu yoğunlukları ve değerlendirme süresi göz önünde bulundurulduğunda, başvurunuzu mümkün olduğunca erken planlamanız tavsiye edilir.",
             1: "Schengen vize başvuruları, normal şartlarda başvurunun yetkili makamlara ulaşmasının ardından genellikle 15 takvim günü içerisinde sonuçlandırılır. Ancak ek belge talep edilmesi veya başvurunun daha ayrıntılı incelemeye alınması durumunda bu süre uzayabilir.",
             3: "İsviçre vize başvurusunda seyahat süresince yeterli maddi imkâna sahip olduğunuzu gösteren belgelerin sunulması gerekir. Başvurunuz değerlendirilirken yalnızca hesap bakiyesi değil; gelir durumunuz, hesap hareketleriniz ve sunduğunuz diğer belgeler de birlikte değerlendirilir. Bu nedenle önemli olan belirli bir tutar göstermekten ziyade, finansal durumunuzun başvuru dosyanızla tutarlı olmasıdır.",
             5: "Schengen vize başvurularında biyometrik veri (parmak izi) verilmesi zorunludur. Ancak son 59 ay içinde herhangi bir Schengen ülkesi için biyometrik veri verdiyseniz, bu veriler geçerliliğini koruyorsa yeniden parmak izi vermeniz gerekmeyebilir. İlk kez başvuru yapıyorsanız veya biyometrik verilerinizin geçerlilik süresi dolmuşsa, başvuru merkezine şahsen giderek parmak izi vermeniz gerekir. İsviçre'nin resmî bilgilendirmesinde de Schengen başvurularında biyometrik verilerin alınması öngörülmektedir.",
             6: "İsviçre tarafından verilen bir Schengen vizesi ile diğer Schengen ülkelerine seyahat edebilirsiniz. Ancak kural olarak; seyahatiniz birden fazla ülkeyi kapsıyorsa en uzun konaklamayı yapacağınız veya seyahatinizin ana hedefini oluşturan ülkenin İsviçre olması gerekir. Ayrıca pasaport kontrolünde seyahat amacınızı ve planınızı kanıtlayan belgeleri (otel rezervasyonu, dönüş bileti vb.) yanınızda taşımanız önemlidir."}),

    dict(slug="italya", n="İtalya", dat="İtalya'ya", loc="İtalya'da", abl="İtalya'dan",
         merkez="Başvuru Merkezi: İtalya vize başvuruları, başvuru sahibinin ikamet ettiği konsolosluk yetki alanına göre yetkilendirilmiş iDATA başvuru merkezleri aracılığıyla kabul edilir. İtalya'nın İstanbul Başkonsolosluğu, kendi konsolosluk yetki alanında yasal olarak ikamet eden başvuru sahiplerinin iDATA üzerinden randevu almasını öngörmektedir.",
         auth="İtalya'nın yetkili konsolosluk makamları",
         vt_over={4: "İtalya'da üniversite eğitimi, dil kursu veya diğer uzun süreli eğitim programlarına katılacak kişilerin başvurabileceği Ulusal (D Tipi) vizedir.",
                  6: "İtalya üzerinden başka bir ülkeye transit geçiş yapacak ve transit vizeye tabi olan yolcuların başvurabileceği transit vize türüdür."},
         steps_over={
             2: "Randevu tarihinde yetkili iDATA başvuru merkezinde evrak teslimi yapılır ve biyometrik işlemler gerçekleştirilir. Schengen vize başvurularında parmak izi ve biyometrik fotoğraf işlemleri zorunludur. Daha önceki Schengen başvurularınızda alınan biyometrik veriler geçerli ise yeniden parmak izi vermeniz gerekmeyebilir.",
             3: "Başvuru dosyanız teslim edildikten sonra değerlendirme süreci başlar. İtalya'nın yetkili konsolosluk makamları gerekli gördüğü durumlarda ek belge veya açıklama talep edebilir.",
             4: "Değerlendirme tamamlandığında pasaportunuz başvuru merkezi aracılığıyla teslim edilir. Vize kararı, başvuruyu değerlendiren yetkili İtalyan makamları tarafından verilir."},
         faq_over={
             1: "İtalya Schengen vize başvurularının sonuçlanma süresi, başvurunun niteliğine, dönemsel yoğunluğa ve gerekli görülmesi hâlinde ek belge veya inceleme talep edilmesine göre değişebilir. Bu nedenle kesin bir sonuçlanma süresi garanti edilemez. Seyahat planınızı riske atmamak için başvurunuzu son güne bırakmamanız önerilir.",
             2: "İtalya vize başvuru ücreti; başvurulan vize türüne, başvuru sahibinin yaşına ve uygulanacak güncel konsolosluk tarifesine göre değişiklik gösterebilir. Toplam maliyet; konsolosluk harcı, yetkili başvuru merkezi hizmet bedeli ve tercih edilmesi hâlinde seyahat sağlık sigortası veya ek başvuru hizmetlerinden oluşur. Başvuru öncesinde ödenecek tüm ücret kalemlerinin güncel tutarlarını öğrenmeniz, süreci doğru planlamanız açısından önemlidir.",
             3: "İtalya vize başvurusunda seyahat süreniz boyunca ulaşım, konaklama ve diğer masraflarınızı karşılayabilecek yeterli finansal kaynağa sahip olduğunuzu göstermeniz gerekir. Bununla birlikte yalnızca hesap bakiyesi değil; gelir durumunuz, hesap hareketleriniz ve sunduğunuz diğer belgeler de birlikte değerlendirilir. Bu nedenle önemli olan belirli bir tutar göstermekten ziyade, finansal durumunuzun başvuru dosyanızla tutarlı olmasıdır.",
             5: "Schengen vize başvurularında biyometrik veri (parmak izi) verilmesi zorunludur. Ancak daha önceki Schengen başvurularınızda alınan biyometrik veriler geçerli ise yeniden parmak izi vermeniz gerekmeyebilir. İlk kez başvuru yapıyorsanız veya biyometrik verilerinizin yeniden alınması gerekiyorsa, başvuru merkezine şahsen giderek biyometrik işlemlerinizi tamamlamanız gerekir. Gerekli görülen durumlarda İtalya makamları başvuru sahibinden yeniden biyometrik işlem talep edebilir.",
             6: "İtalya tarafından verilen bir Schengen vizesi ile diğer Schengen ülkelerine seyahat edebilirsiniz. Ancak kural olarak; seyahatiniz birden fazla ülkeyi kapsıyorsa en uzun konaklamayı yapacağınız veya ana hedefiniz olan ülkenin İtalya olması gerekir. Ayrıca seyahat planınızın vize başvurusu sırasında sunduğunuz bilgilerle uyumlu olması önemlidir.",
             7: "İtalya tarafından verilen Schengen vizelerinin geçerlilik süresi, başvuru sahibinin seyahat geçmişi, seyahat amacı ve başvuru dosyasının değerlendirilmesine göre değişiklik gösterebilir. İlk başvurularda vize süresi çoğu zaman planlanan seyahat tarihleriyle sınırlı olurken, uygun Schengen geçmişine sahip başvuru sahiplerine daha uzun süreli ve çok girişli vizeler verilebilmektedir. Vizenin geçerlilik süresi ve giriş hakkı tamamen yetkili makamların değerlendirmesi doğrultusunda belirlenir.",
             8: "İtalya vize başvurularının reddedilmesindeki yaygın nedenler arasında; başvuru dosyasındaki bilgi ve belgelerin yetersiz veya tutarsız bulunması, finansal yeterliliğin yeterince gösterilememesi, seyahat amacının açık şekilde belgelenememesi ve başvuru sahibinin ülkesine geri döneceğine ilişkin yeterli kanaat oluşmaması yer alır.",
             10: "İlk uçuşunuzu veya girişinizi başka bir Schengen ülkesinden yapabilirsiniz. Ancak vizeyi İtalya'dan aldıysanız, seyahatinizin en uzun süren kısmını İtalya'da geçirmeli veya seyahatinizin ana hedefi İtalya olmalıdır. Vize başvurusunda sunduğunuz seyahat planının gerçek seyahatinizle uyumlu olması önemlidir."}),

    dict(slug="izlanda", n="İzlanda", dat="İzlanda'ya", loc="İzlanda'da", abl="İzlanda'dan",
         zorunlu="Vize Zorunluluğu: Türkiye Cumhuriyeti umuma mahsus (bordo) pasaport sahipleri, İzlanda'ya kısa süreli seyahatlerinde vize almak zorundadır. İzlanda Schengen bölgesinin bir parçasıdır ve kısa süreli seyahatlerde Schengen vize kuralları uygulanır.",
         muaf="Vizeden Muaf Pasaportlar: Türkiye Cumhuriyeti diplomatik (siyah), hizmet (gri) ve hususi (yeşil) pasaport sahipleri, İzlanda'ya 90 güne kadar kısa süreli seyahatlerinde vizeden muaftır.",
         merkez="Başvuru Merkezi: İzlanda'nın Türkiye'deki kısa süreli Schengen vize başvuruları Ankara'daki Danimarka Büyükelçiliği tarafından, VFS Global başvuru merkezi aracılığıyla kabul edilmektedir.",
         auth="Yetkili makamlar",
         vt_over={3: "İzlanda'da yaşayan aile bireylerinin yanına uzun süreli yerleşim amacıyla başvurulan oturum izni sürecidir. Oturum izni onaylandıktan sonra, vizeye tabi kişiler için İzlanda'ya giriş vizesi düzenlenebilir.",
                  4: "İzlanda'da eğitim amacıyla uzun süreli bulunmak isteyen kişilerin ilgili oturum izni için başvurması gerekir. Oturum izni onaylandıktan sonra, vizeye tabi kişiler için İzlanda'ya giriş vizesi düzenlenebilir.",
                  5: "İzlanda'da çalışmak isteyen kişilerin, çalışma hakkı sağlayan ilgili oturum izni ve çalışma izni süreçlerini tamamlaması gerekir. Oturum izni onaylandıktan sonra, vizeye tabi kişiler için İzlanda'ya giriş vizesi düzenlenebilir.",
                  6: "İzlanda üzerinden başka bir ülkeye transit geçiş yapacak ve transit vizeye tabi olan yolcuların başvurabileceği havaalanı transit vizesidir."},
         vt_titles={3: "İzlanda Aile Birleşimi"},
         steps_over={
             2: "Randevu tarihinde başvuru merkezinde evrak teslimi yapılır ve biyometrik işlemler gerçekleştirilir. Schengen vize başvurularında parmak izi ve biyometrik fotoğraf işlemleri uygulanır. Daha önceki Schengen başvurularınızda alınan biyometrik veriler geçerli ise yeniden parmak izi vermeniz gerekmeyebilir.",
             4: "Değerlendirme tamamlandığında pasaportunuz başvuru sürecinin yürütüldüğü kanal aracılığıyla teslim edilir. Vizenizin onaylanması halinde pasaportunuz içerisinde vize etiketiyle birlikte teslim edilir; başvurunun olumsuz sonuçlanması halinde ise pasaportunuz tarafınıza iade edilir."},
         faq_over={
             1: "Schengen vize başvurularında değerlendirme süresi normal şartlarda yaklaşık iki hafta olabilir. Ancak ek belge talep edilmesi veya başvurunun daha ayrıntılı incelenmesi gereken durumlarda bu süre uzayabilir.",
             2: "İzlanda vize başvuru ücreti, başvurulan vize türüne ve başvuru sahibinin durumuna göre değişiklik gösterebilir. Ayrıca yetkili başvuru merkezi tarafından hizmet bedeli alınabilir. Başvuru öncesinde güncel ücretlerin kontrol edilmesi gerekir.",
             3: "İzlanda vize başvurusunda seyahat süresince ulaşım, konaklama ve diğer masraflarınızı karşılayabilecek yeterli finansal kaynağa sahip olduğunuzu göstermeniz gerekir. Finansal durumunuz değerlendirilirken geliriniz, banka hesap hareketleriniz ve sunduğunuz diğer belgeler birlikte dikkate alınabilir.",
             4: "Schengen vize başvurularında pasaportunuzun planlanan dönüş tarihinizden itibaren en az 3 ay daha geçerli olması ve en az 2 boş sayfa içermesi gerekir. Ayrıca pasaportunuzun son 10 yıl içinde düzenlenmiş olması gerekir.",
             5: "Schengen vize başvurularında biyometrik veriler alınır. Daha önceki bir Schengen vize başvurusunda alınan parmak izlerinin geçerli olduğu durumlarda yeniden parmak izi alınması gerekmeyebilir.",
             6: "İzlanda tarafından verilen geçerli bir Schengen vizesi ile diğer Schengen ülkelerine seyahat edebilirsiniz. Ancak vize başvurusu yapılırken seyahatinizin ana destinasyonunun İzlanda olması veya Schengen kurallarına göre İzlanda'nın başvuru yapılması gereken ülke olması gerekir.",
             7: "İzlanda tarafından verilen Schengen vizelerinin geçerlilik süresi, başvuru sahibinin seyahat amacı, seyahat geçmişi ve başvuru dosyasının değerlendirilmesine göre değişiklik gösterebilir. Vizenin geçerlilik süresi ve giriş sayısı yetkili makamların değerlendirmesi doğrultusunda belirlenir.",
             8: "İzlanda vize başvurularının reddedilmesinde; başvuru dosyasındaki bilgi ve belgelerin yetersiz veya tutarsız bulunması, seyahat amacının yeterince belgelenmemesi, finansal yeterliliğin gösterilememesi veya başvuru sahibinin vize şartlarını karşılamadığı kanaatine varılması gibi nedenler etkili olabilir.",
             9: "İzlanda vize başvurunuzun reddedilmesi, yeni bir başvuru yapılmasına engel değildir. Ancak yeni bir başvuru öncesinde ret gerekçesinin dikkatle değerlendirilmesi ve varsa eksikliklerin veya tutarsızlıkların giderilmesi önemlidir.",
             10: "Schengen vize başvurularında başvuru yapılacak ülke, seyahatin ana destinasyonuna göre belirlenir. İzlanda'dan alınan bir Schengen vizesiyle başka bir Schengen ülkesinden giriş yapılması tek başına vizeyi geçersiz hâle getirmez; ancak seyahat planınızın vizenin verildiği ülkeyi ana destinasyon olarak göstermesi gerekir."}),

    dict(slug="letonya", n="Letonya", dat="Letonya'ya", loc="Letonya'da", abl="Letonya'dan",
         zorunlu_kisa=True,
         muaf="Vizeden Muaf Pasaportlar: Türkiye Cumhuriyeti hususi (yeşil), hizmet (gri) ve diplomatik (siyah) pasaport sahipleri, kısa süreli seyahatlerinde vizeden muaftır.",
         merkez="Başvuru Merkezi: Letonya'nın Türkiye'deki vize başvuruları VFS Global vize başvuru merkezleri aracılığıyla kabul edilmektedir.",
         giris="Ülkeye Giriş Yetkisi: Schengen vizesi sahibi olmak, Letonya'ya veya Schengen bölgesine giriş hakkının kesin olarak tanındığı anlamına gelmez. Nihai değerlendirme, sınır kontrolü sırasında yetkili makamlar tarafından yapılır.",
         auth="Yetkili makamlar",
         vt_over={3: "Letonya'da yaşayan aile bireylerinin yanına uzun süreli yerleşim amacıyla başvurulan uzun süreli vize ve ilgili oturum izni sürecidir.",
                  4: "Letonya'da eğitim amacıyla uzun süreli bulunmak isteyen kişilerin başvurabileceği Ulusal (D Tipi) vize ve ilgili oturum izni sürecidir.",
                  5: "Letonya'da çalışmak isteyen kişilerin başvurabileceği Ulusal (D Tipi) vize ve ilgili çalışma veya oturum izni sürecidir.",
                  6: "Letonya üzerinden başka bir ülkeye transit geçiş yapacak ve transit vizeye tabi olan yolcuların başvurabileceği transit vizedir."},
         steps=[
             ("Vize Türünün Belirlenmesi", "Letonya vize başvurusu, seyahat amacına uygun vize türünün belirlenmesiyle başlar."),
             ("Form ve Evrak Hazırlığı", "Başvuru formu doldurulur ve seyahat amacını ve planını destekleyen gerekli belgeler hazırlanır."),
             ("Randevu, Evrak Teslimi ve Biyometrik İşlemler", "Randevu tarihinde yetkili başvuru merkezine gidilerek belgeler teslim edilir ve gerekli biyometrik işlemler gerçekleştirilir. Daha önceki bir Schengen başvurusunda alınan biyometrik veriler geçerli olduğu sürece yeniden parmak izi verilmesi gerekmeyebilir."),
             ("Değerlendirme Süreci", "Başvuru dosyası teslim edildikten sonra yetkili makamlar tarafından değerlendirilir. Gerekli görülmesi halinde ek belge veya bilgi talep edilebilir. Kısa süreli Schengen vize başvurularında değerlendirme normal şartlarda 15 takvim günü içinde tamamlanır; bireysel durumlarda bu süre 45 takvim gününe kadar uzayabilir."),
             ("Sonuç ve Pasaport Teslimi", "Değerlendirme tamamlandığında pasaport başvuru sürecinin yürütüldüğü kanal aracılığıyla teslim edilir."),
         ],
         faq_over={
             0: "Schengen vize başvuruları planlanan seyahat tarihinden en erken 6 ay önce yapılabilir. Başvuru ve değerlendirme sürecini göz önünde bulundurarak başvurunuzu mümkün olduğunca erken planlamanız tavsiye edilir.",
             1: "Letonya Schengen vize başvuruları normal şartlarda 15 takvim günü içinde sonuçlandırılır. Gerekli görülmesi halinde veya başvurunun daha ayrıntılı incelenmesi gereken durumlarda değerlendirme süresi 45 takvim gününe kadar uzayabilir.",
             2: "Letonya vize başvuru ücreti, başvuru türüne ve başvuru sahibinin durumuna göre değişiklik gösterebilir. Başvuru öncesinde güncel vize ücreti ve varsa başvuru merkezi hizmet bedelinin kontrol edilmesi gerekir.",
             3: "Letonya vize başvurusunda seyahat süresince masraflarınızı karşılayabilecek yeterli finansal kaynağa sahip olduğunuzu göstermeniz gerekir. Finansal durumunuz, sunduğunuz belgeler ve seyahat planınızla birlikte değerlendirilir.",
             4: "Pasaportunuzun planlanan Schengen bölgesinden ayrılış tarihinizden itibaren en az 3 ay daha geçerli olması, son 10 yıl içinde düzenlenmiş olması ve en az 2 boş sayfa içermesi gerekir.",
             5: "Schengen vize başvurularında biyometrik veriler alınır. Daha önceki bir Schengen başvurusunda alınan biyometrik veriler geçerli olduğu sürece yeniden parmak izi vermeniz gerekmeyebilir.",
             6: "Letonya tarafından verilen geçerli bir Schengen vizesi ile diğer Schengen ülkelerine seyahat edebilirsiniz. Ancak vize başvurusu yapılırken Schengen kurallarına göre seyahatinizin ana destinasyonunun Letonya olması veya Letonya'nın başvuru yapılması gereken ülke olması gerekir.",
             7: "Letonya tarafından verilen Schengen vizelerinin geçerlilik süresi ve giriş sayısı, başvuru sahibinin seyahat amacı ve başvuru dosyasının değerlendirilmesine göre belirlenir. Vizenin geçerlilik süresi ve izin verilen kalış süresi vize etiketinde belirtilir.",
             8: "Letonya vize başvurularının reddedilmesinde başvuru dosyasındaki bilgi ve belgelerin yetersiz veya tutarsız bulunması, seyahat amacının yeterince belgelenmemesi, finansal yeterliliğin gösterilememesi veya başvuru sahibinin vize şartlarını karşılamadığı kanaatine varılması gibi nedenler etkili olabilir.",
             9: "Letonya vize başvurunuzun reddedilmesi, yeniden başvuru yapmanıza engel değildir. Yeni bir başvuru öncesinde ret gerekçesinin dikkatle değerlendirilmesi ve varsa eksikliklerin veya tutarsızlıkların giderilmesi önemlidir.",
             10: "İlk girişinizi Letonya'dan yapmak her durumda zorunlu değildir. Ancak Schengen vizesi başvurusu yapılırken seyahatinizin ana destinasyonunun Letonya olması ve başvuruda sunduğunuz seyahat planının gerçek seyahatinizle uyumlu olması gerekir."}),
]

# --- Baltık/Kuzey tipi rehberlerde ortak süreç ve SSS gövdesi -----------------

def baltic_steps(n, extra_eval=None, extra_appt=None):
    return [
        ("Vize Türünün Belirlenmesi", f"{n} vize başvurusu, seyahat amacına uygun vize türünün belirlenmesiyle başlar."),
        ("Form ve Evrak Hazırlığı", "Başvuru formu doldurulur ve seyahat amacını ve planını destekleyen gerekli belgeler hazırlanır."),
        ("Randevu, Evrak Teslimi ve Biyometrik İşlemler",
         extra_appt or "Randevu tarihinde yetkili başvuru merkezine gidilerek belgeler teslim edilir ve gerekli biyometrik "
                       "işlemler gerçekleştirilir. Daha önceki bir Schengen başvurusunda alınan biyometrik veriler geçerli "
                       "olduğu sürece yeniden parmak izi verilmesi gerekmeyebilir."),
        ("Değerlendirme Süreci",
         extra_eval or "Başvuru dosyası teslim edildikten sonra yetkili makamlar tarafından değerlendirilir. Gerekli "
                       "görülmesi halinde ek belge veya bilgi talep edilebilir."),
        ("Sonuç ve Pasaport Teslimi",
         "Değerlendirme tamamlandığında pasaport başvuru sürecinin yürütüldüğü kanal aracılığıyla teslim edilir."),
    ]


def baltic_faq(n, dat, loc, abl, over=None):
    base = {
        0: "Schengen vize başvuruları planlanan seyahat tarihinden en erken 6 ay önce yapılabilir. Randevu ve değerlendirme "
           "sürecini göz önünde bulundurarak başvurunuzu mümkün olduğunca erken planlamanız tavsiye edilir.",
        1: f"{n} Schengen vize başvurularında değerlendirme süresi başvurunun niteliğine ve gerekli incelemelere göre "
           "değişebilir. Ek belge veya ayrıntılı inceleme gereken durumlarda değerlendirme süresi uzayabilir.",
        2: f"{n} vize başvuru ücreti, başvuru türüne ve başvuru sahibinin durumuna göre değişiklik gösterebilir. Başvuru "
           "öncesinde güncel vize ücreti ve varsa başvuru merkezi hizmet bedelinin kontrol edilmesi gerekir.",
        3: f"{n} vize başvurusunda seyahat süresince masraflarınızı karşılayabilecek yeterli finansal kaynağa sahip "
           "olduğunuzu göstermeniz gerekir. Finansal durumunuz, sunduğunuz belgeler ve seyahat planınızla birlikte "
           "değerlendirilir.",
        4: "Pasaportunuzun planlanan Schengen bölgesinden ayrılış tarihinizden itibaren en az 3 ay daha geçerli olması ve "
           "ilgili Schengen pasaport koşullarını karşılaması gerekir.",
        5: "Schengen vize başvurularında biyometrik veriler alınır. Daha önceki bir Schengen başvurusunda alınan biyometrik "
           "veriler geçerli olduğu sürece yeniden parmak izi vermeniz gerekmeyebilir.",
        6: f"{n} tarafından verilen geçerli bir Schengen vizesi ile diğer Schengen ülkelerine seyahat edebilirsiniz. Ancak "
           f"vize başvurusu yapılırken Schengen kurallarına göre seyahatinizin ana destinasyonunun {n} olması veya "
           f"{n} için başvuru yapılması gereken ülke olması gerekir.",
        7: f"{n} tarafından verilen Schengen vizelerinin geçerlilik süresi ve giriş sayısı, başvuru sahibinin seyahat amacı "
           "ve başvuru dosyasının değerlendirilmesine göre belirlenir. Vizenin geçerlilik süresi ve izin verilen kalış "
           "süresi vize etiketinde belirtilir.",
        8: f"{n} vize başvurularının reddedilmesinde başvuru dosyasındaki bilgi ve belgelerin yetersiz veya tutarsız "
           "bulunması, seyahat amacının yeterince belgelenmemesi, finansal yeterliliğin gösterilememesi veya başvuru "
           "sahibinin vize şartlarını karşılamadığı kanaatine varılması gibi nedenler etkili olabilir.",
        9: f"{n} vize başvurunuzun reddedilmesi, yeniden başvuru yapmanıza engel değildir. Yeni bir başvuru öncesinde ret "
           "gerekçesinin değerlendirilmesi ve varsa eksikliklerin veya tutarsızlıkların giderilmesi önemlidir.",
        10: f"İlk girişinizi {abl} yapmak her durumda zorunlu değildir. Ancak Schengen vizesi başvurusu yapılırken "
            f"seyahatinizin ana destinasyonunun {n} olması ve başvuruda sunduğunuz seyahat planının gerçek seyahatinizle "
            "uyumlu olması gerekir.",
    }
    if over:
        base.update(over)
    return base


SCHENGEN += [
    dict(slug="lihtenstayn", n="Lihtenştayn", dat="Lihtenştayn'a", loc="Lihtenştayn'da", abl="Lihtenştayn'dan",
         zorunlu="Vize Zorunluluğu: Türkiye Cumhuriyeti umuma mahsus (bordo) pasaport sahipleri, Lihtenştayn'a kısa süreli seyahatlerinde vize almak zorundadır. Lihtenştayn'ın vize ve giriş kuralları büyük ölçüde İsviçre ile aynıdır.",
         muaf="Vizeden Muaf Pasaportlar: Türkiye Cumhuriyeti hususi (yeşil), hizmet (gri) ve diplomatik (siyah) pasaport sahipleri, kısa süreli seyahatlerde vize muafiyeti kapsamında olabilir. Muafiyetin seyahatin amacı ve pasaport türüne göre kontrol edilmesi gerekir.",
         merkez="Başvuru Merkezi: Lihtenştayn'ın Türkiye'deki vize işlemleri İsviçre tarafından yürütülmektedir. 90 güne kadar olan Schengen vize başvuruları VFS Global aracılığıyla kabul edilirken, 90 günden uzun süreli ulusal vize başvuruları İsviçre'nin İstanbul Başkonsolosluğu üzerinden yürütülmektedir.",
         giris="Ülkeye Giriş Yetkisi: Schengen vizesi sahibi olmak, Lihtenştayn'a veya Schengen bölgesine giriş hakkının kesin olarak tanındığı anlamına gelmez. Nihai değerlendirme, sınır kontrolü sırasında yetkili makamlar tarafından yapılır.",
         baltic=True,
         vt_over={3: "Lihtenştayn'da yaşayan aile bireylerinin yanına uzun süreli yerleşim amacıyla başvurulan ulusal vize ve ilgili oturum izni sürecidir.",
                  4: "Lihtenştayn'da eğitim amacıyla uzun süreli bulunmak isteyen kişilerin başvurabileceği ulusal vize ve ilgili oturum izni sürecidir.",
                  5: "Lihtenştayn'da çalışmak isteyen kişilerin, gerekli çalışma ve oturum izinleri kapsamında başvurabileceği ulusal vize sürecidir.",
                  6: "Schengen bölgesine giriş yapmadan Lihtenştayn'a ulaşmak için kullanılan güzergâha bağlı olarak transit vize gerekliliği bulunan yolcuların başvurması gereken transit vizedir."},
         baltic_appt="Kısa süreli Schengen vize başvurularında randevu alınarak VFS Global başvuru merkezine gidilir ve belgeler teslim edilir. Gerekli biyometrik işlemler başvuru sırasında gerçekleştirilir. Daha önceki bir Schengen başvurusunda alınan biyometrik veriler geçerli olduğu sürece yeniden parmak izi verilmesi gerekmeyebilir.",
         baltic_eval="Başvuru dosyası teslim edildikten sonra yetkili makamlar tarafından değerlendirilir. Gerekli görülmesi halinde ek belge veya bilgi talep edilebilir. Schengen vize başvurularında değerlendirme normal şartlarda 15 takvim günü içinde tamamlanır; bireysel durumlarda bu süre uzayabilir.",
         faq_over={1: "Lihtenştayn adına yürütülen Schengen vize başvuruları normal şartlarda yaklaşık 15 takvim günü içinde sonuçlandırılır. Başvurunun daha ayrıntılı incelenmesi veya ek belge talep edilmesi gereken durumlarda değerlendirme süresi uzayabilir.",
                   4: "Pasaportunuzun planlanan Schengen bölgesinden ayrılış tarihinizden itibaren en az 3 ay daha geçerli olması ve son 10 yıl içinde düzenlenmiş olması gerekir.",
                   6: "Lihtenştayn adına verilen geçerli bir Schengen vizesi ile diğer Schengen ülkelerine seyahat edebilirsiniz. Ancak vize başvurusu yapılırken Schengen kurallarına göre seyahatinizin ana destinasyonunun Lihtenştayn olması veya Lihtenştayn'ın başvuru yapılması gereken ülke olması gerekir.",
                   7: "Lihtenştayn adına verilen Schengen vizelerinin geçerlilik süresi ve giriş sayısı, başvuru sahibinin seyahat amacı ve başvuru dosyasının değerlendirilmesine göre belirlenir. Vizenin geçerlilik süresi ve izin verilen kalış süresi vize etiketinde belirtilir.",
                   8: "Lihtenştayn vize başvurularının reddedilmesinde başvuru dosyasındaki bilgi ve belgelerin yetersiz veya tutarsız bulunması, seyahat amacının yeterince belgelenmemesi, finansal yeterliliğin gösterilememesi veya vize şartlarının karşılanmadığı kanaatine varılması gibi nedenler etkili olabilir."}),

    dict(slug="litvanya", n="Litvanya", dat="Litvanya'ya", loc="Litvanya'da", abl="Litvanya'dan",
         zorunlu_kisa=True,
         muaf="Vizeden Muaf Pasaportlar: Türkiye Cumhuriyeti hususi (yeşil), hizmet (gri) ve diplomatik (siyah) pasaport sahipleri, 180 gün içinde 90 günü aşmayan kısa süreli seyahatlerinde vizeden muaftır.",
         merkez="Başvuru Merkezi: Litvanya'nın Türkiye'deki Schengen vize başvuruları VFS Global vize başvuru merkezleri aracılığıyla kabul edilmektedir. Litvanya Büyükelçiliği Schengen vize başvurularını doğrudan kabul etmemektedir.",
         giris="Ülkeye Giriş Yetkisi: Schengen vizesi sahibi olmak, Litvanya'ya veya Schengen bölgesine giriş hakkının kesin olarak tanındığı anlamına gelmez. Nihai değerlendirme, sınır kontrolü sırasında yetkili makamlar tarafından yapılır.",
         baltic=True,
         vt_over={1: "İş görüşmesi, şirket ziyareti, toplantı ve ticari faaliyetler amacıyla Litvanya'ya yapılacak kısa süreli seyahatler için başvurulan Schengen (C Tipi) vizedir.",
                  3: "Litvanya'da yaşayan aile bireylerinin yanına uzun süreli yerleşim amacıyla başvurulan ulusal vize veya ilgili oturum izni sürecidir.",
                  4: "Litvanya'da eğitim amacıyla uzun süreli bulunmak isteyen kişilerin başvurabileceği ulusal vize veya ilgili oturum izni sürecidir.",
                  5: "Litvanya'da çalışmak isteyen kişilerin, çalışma amacı ve kalış süresine göre ulusal vize veya ilgili oturum izni kapsamında başvurması gereken vize sürecidir.",
                  6: "Litvanya üzerinden başka bir ülkeye transit geçiş yapacak ve transit vizeye tabi olan yolcuların başvurabileceği transit vizedir.",
                  7: "Litvanya'da düzenlenen fuar, kongre, konferans ile kültürel, bilimsel veya sportif etkinliklere katılım amacıyla başvurulan Schengen (C Tipi) vizedir."},
         baltic_appt="Schengen vize başvurusu için VFS Global üzerinden randevu alınır ve randevu tarihinde başvuru merkezine gidilerek belgeler teslim edilir. Başvurular kural olarak şahsen yapılır ve gerekli biyometrik işlemler gerçekleştirilir.",
         baltic_eval="Başvuru dosyası teslim edildikten sonra Litvanya Büyükelçiliği tarafından değerlendirilir. Gerekli görülmesi halinde ek belge veya bilgi talep edilebilir. Schengen vize başvurularında değerlendirme normal şartlarda 15 takvim günü içinde tamamlanır; daha ayrıntılı inceleme veya ek belge gerektiren durumlarda bu süre 45 takvim gününe kadar uzayabilir.",
         faq_over={6: "Litvanya tarafından verilen geçerli bir Schengen vizesi ile diğer Schengen ülkelerine seyahat edebilirsiniz. Ancak vize başvurusu yapılırken Schengen kurallarına göre seyahatinizin ana destinasyonunun Litvanya olması veya Litvanya'nın başvuru yapılması gereken ülke olması gerekir.",
                   1: "Litvanya Schengen vize başvuruları normal şartlarda 15 takvim günü içinde sonuçlandırılır. Daha ayrıntılı inceleme veya ek belge gerektiren durumlarda değerlendirme süresi 45 takvim gününe kadar uzayabilir.",
                   4: "Pasaportunuzun planlanan Schengen bölgesinden ayrılış tarihinizden itibaren en az 3 ay daha geçerli olması, son 10 yıl içinde düzenlenmiş olması ve en az 2 boş sayfa içermesi gerekir."}),

    dict(slug="luksemburg", n="Lüksemburg", dat="Lüksemburg'a", loc="Lüksemburg'da", abl="Lüksemburg'dan",
         zorunlu_kisa=True,
         muaf="Vizeden Muaf Pasaportlar: Türkiye Cumhuriyeti hususi (yeşil), hizmet (gri) ve diplomatik (siyah) pasaport sahiplerinin kısa süreli seyahatlerdeki vize durumu, pasaport türüne ve seyahatin niteliğine göre değerlendirilmelidir.",
         merkez="Başvuru Merkezi: Lüksemburg'un Türkiye'deki vize başvuruları, Lüksemburg Büyükelçiliği adına VFS Global vize başvuru merkezleri aracılığıyla kabul edilmektedir. Türkiye'de Ankara, Gaziantep, İstanbul, İzmir ve Antalya üzerinden başvuru hizmetleri sunulmaktadır.",
         giris="Ülkeye Giriş Yetkisi: Schengen vizesi sahibi olmak, Lüksemburg'a veya Schengen bölgesine giriş hakkının kesin olarak tanındığı anlamına gelmez. Nihai değerlendirme, sınır kontrolü sırasında yetkili makamlar tarafından yapılır.",
         baltic=True,
         vt_over={1: "İş görüşmesi, şirket ziyareti, toplantı, fuar ve diğer ticari faaliyetler amacıyla Lüksemburg'a yapılacak kısa süreli seyahatler için başvurulan Schengen (C Tipi) vizedir.",
                  3: "Lüksemburg'da yaşayan aile bireylerinin yanına uzun süreli yerleşim amacıyla başvurulan uzun süreli vize ve ilgili oturum izni sürecidir.",
                  4: "Lüksemburg'da eğitim amacıyla uzun süreli bulunmak isteyen kişilerin başvurabileceği uzun süreli vize ve ilgili oturum izni sürecidir.",
                  5: "Lüksemburg'da çalışmak isteyen kişilerin, çalışma ve oturum koşullarına göre başvurması gereken uzun süreli vize ve ilgili izin sürecidir.",
                  6: "Lüksemburg üzerinden başka bir ülkeye transit geçiş yapacak ve transit vizeye tabi olan yolcuların başvurabileceği transit vizedir."},
         baltic_appt="Schengen vize başvurusu için VFS Global üzerinden randevu alınır ve randevu tarihinde yetkili başvuru merkezine gidilerek belgeler teslim edilir. Gerekli biyometrik işlemler başvuru sırasında gerçekleştirilir. Daha önceki bir Schengen başvurusunda alınan biyometrik veriler geçerli olduğu sürece yeniden parmak izi verilmesi gerekmeyebilir.",
         baltic_eval="Başvuru dosyası teslim edildikten sonra Lüksemburg Büyükelçiliği tarafından değerlendirilir. VFS Global başvurunun idari olarak alınması ve iletilmesi sürecinde görev yapar; vize kararını verme yetkisi Büyükelçiliğe aittir. Gerekli görülmesi halinde ek belge veya bilgi talep edilebilir.",
         faq_over={1: "Lüksemburg Schengen vize başvurularının değerlendirilme süresi başvurunun niteliğine ve gerekli incelemelere göre değişebilir. Normal değerlendirme sürecinin dışında ek belge veya ayrıntılı inceleme gereken durumlarda süre uzayabilir.",
                   6: "Lüksemburg tarafından verilen geçerli bir Schengen vizesi ile diğer Schengen ülkelerine seyahat edebilirsiniz. Ancak vize başvurusu yapılırken Schengen kurallarına göre seyahatinizin ana destinasyonunun Lüksemburg olması veya Lüksemburg'un başvuru yapılması gereken ülke olması gerekir."}),

    dict(slug="macaristan", n="Macaristan", dat="Macaristan'a", loc="Macaristan'da", abl="Macaristan'dan",
         merkez="Başvuru Merkezi: Macaristan vize başvuruları, Türkiye'de yetkilendirilmiş AS Visa Solutions başvuru merkezleri aracılığıyla kabul edilir. C tipi vize başvuruları için randevular AS Visa Solutions'ın online sistemi üzerinden oluşturulur.",
         auth="Konsolosluk",
         steps_over={3: "Başvuru dosyanız teslim edildikten sonra değerlendirme süreci başlar. Konsolosluk gerekli gördüğü durumlarda ek belge talep edebilir veya başvuru sahibiyle mülakat gerçekleştirebilir."},
         faq_over={
             1: "Schengen vize başvuruları, normal şartlarda başvurunun yetkili makama ulaşmasının ardından genellikle 15 takvim günü içerisinde sonuçlandırılır. Ancak ek belge talep edilmesi, başvurunun detaylı incelemeye alınması veya gerekli görülmesi hâlinde mülakat yapılması durumunda bu süre uzayabilir.",
             5: "Schengen vize başvurularında biyometrik veri (parmak izi) verilmesi zorunludur. Ancak son 59 ay içinde herhangi bir Schengen ülkesi için biyometrik veri verdiyseniz, bu veriler geçerliliğini koruyorsa yeniden parmak izi vermeniz gerekmeyebilir. İlk kez başvuru yapıyorsanız veya biyometrik verilerinizin geçerlilik süresi dolmuşsa, başvuru merkezine şahsen giderek parmak izi vermeniz gerekir. Macaristan'ın Türkiye'deki resmî bilgilendirmesinde de son 59 ay içinde parmak izi vermemiş başvuru sahipleri için şahsen başvuru esası belirtilmektedir.",
             6: "Macaristan tarafından verilen bir Schengen vizesi ile diğer Schengen ülkelerine seyahat edebilirsiniz. Ancak kural olarak; seyahatiniz birden fazla ülkeyi kapsıyorsa en uzun konaklamayı yapacağınız veya seyahatinizin ana amacını oluşturan ülkenin Macaristan olması gerekir. Ayrıca pasaport kontrolünde seyahat amacınızı ve planınızı kanıtlayan belgeleri (otel rezervasyonu, dönüş bileti vb.) yanınızda taşımanız önemlidir.",
             8: "Macaristan vize başvurularının reddedilmesindeki en yaygın nedenler arasında; başvuru dosyasındaki bilgi ve belgelerin yetersiz veya tutarsız bulunması, finansal yeterliliğin yeterince gösterilememesi, seyahat amacının açık şekilde belgelenememesi ve başvuru sahibinin ülkesine geri döneceğine ilişkin yeterli kanaat oluşmaması yer alır. Macaristan'ın resmî bilgilendirmesinde de seyahat amacının ve koşullarının kanıtlanamaması ile yeterli geçim kaynağının gösterilememesi ret nedenleri arasında sayılmaktadır."}),

    dict(slug="malta", n="Malta", dat="Malta'ya", loc="Malta'da", abl="Malta'dan",
         zorunlu_kisa=True,
         muaf="Vizeden Muaf Pasaportlar: Türkiye Cumhuriyeti diplomatik (siyah), hizmet (gri) ve hususi (yeşil) pasaport sahipleri Malta'ya yapacakları seyahatlerde vizeden muaftır.",
         ulke=GI_ULKE + " Malta seyahatinizin tek veya ana destinasyonuysa başvuruyu Malta makamlarına yapmalısınız.",
         merkez="Başvuru Merkezi: Malta'nın Türkiye'deki kısa süreli Schengen vize başvuruları VFS Global vize başvuru merkezleri aracılığıyla kabul edilmektedir. VFS Global, Malta Büyükelçiliği'nin Türkiye'deki resmî hizmet sağlayıcısıdır.",
         giris="Ülkeye Giriş Yetkisi: Schengen vizesi sahibi olmak, Malta'ya veya Schengen bölgesine giriş hakkının kesin olarak tanındığı anlamına gelmez. Nihai değerlendirme, sınır kontrolü sırasında yetkili makamlar tarafından yapılır.",
         baltic=True,
         vtd="Malta'ya yapacağınız seyahatin amacı ve kalış süresi, başvurmanız gereken vize türünü belirler. Aşağıda Malta için en sık başvurulan vize türlerini inceleyebilirsiniz.",
         vt_over={1: "İş görüşmesi, şirket ziyareti, toplantı, fuar ve diğer ticari faaliyetler amacıyla Malta'ya yapılacak kısa süreli seyahatler için başvurulan Schengen (C Tipi) vizedir.",
                  3: "Malta'da yaşayan aile bireylerinin yanına uzun süreli yerleşim amacıyla başvurulan uzun süreli vize ve ilgili oturum izni sürecidir.",
                  4: "Malta'da eğitim amacıyla 90 günden uzun süre bulunmak isteyen kişilerin başvurabileceği Ulusal (D Tipi) vize sürecidir.",
                  5: "Malta'da çalışmak isteyen kişilerin, çalışma amacı ve kalış süresine göre başvurması gereken uzun süreli vize ve ilgili izin sürecidir.",
                  6: "Malta üzerinden başka bir ülkeye transit geçiş yapacak ve transit vizeye tabi olan yolcuların başvurabileceği transit vizedir."},
         baltic_first="Malta vize başvurusu, seyahat amacına ve kalış süresine uygun vize türünün belirlenmesiyle başlar.",
         baltic_appt="Kısa süreli Schengen vize başvurularında başvuru formu doldurulur ve seyahat amacını ve planını destekleyen gerekli belgeler hazırlanır. VFS Global üzerinden randevu alınarak randevu tarihinde başvuru merkezine gidilir ve belgeler teslim edilir. Biyometrik işlemler de başvuru sırasında gerçekleştirilir. Daha önceki bir Schengen başvurusunda alınan biyometrik veriler geçerli olduğu sürece yeniden parmak izi verilmesi gerekmeyebilir.",
         baltic_eval="Başvuru dosyası teslim edildikten sonra Malta'nın yetkili makamları tarafından değerlendirilir. Gerekli görülmesi halinde ek belge veya bilgi talep edilebilir. Malta'nın resmî bilgilerine göre başvurular planlanan seyahatten en erken 6 ay, denizciler için ise belirli koşullarda 9 ay önce sunulabilir ve normal başvuru için seyahatten en geç 15 takvim günü önce başvuru yapılması gerekir.",
         faq_over={0: "Malta Schengen vize başvuruları planlanan seyahat tarihinden en erken 6 ay önce yapılabilir. Başvurunun seyahatten en geç 15 takvim günü önce sunulması gerekir. Randevu ve değerlendirme sürecini göz önünde bulundurarak başvurunuzu mümkün olduğunca erken planlamanız tavsiye edilir.",
                   5: "Schengen vize başvurularında biyometrik veriler alınır. Daha önceki bir Schengen başvurusunda alınan biyometrik veriler geçerli olduğu sürece yeniden parmak izi verilmesi gerekmeyebilir. Malta'nın resmî bilgilerine göre biyometrik veriler başvuru sırasında alınır.",
                   6: "Malta tarafından verilen geçerli bir Schengen vizesi ile diğer Schengen ülkelerine seyahat edebilirsiniz. Ancak vize başvurusu yapılırken Schengen kurallarına göre seyahatinizin ana destinasyonunun Malta olması veya Malta'nın başvuru yapılması gereken ülke olması gerekir.",
                   7: "Malta tarafından verilen Schengen vizelerinin geçerlilik süresi ve giriş sayısı başvuru sahibinin durumuna ve yetkili makamların değerlendirmesine göre belirlenir. Vizenin geçerlilik süresi ve izin verilen kalış süresi vize etiketinde belirtilir."}),

    dict(slug="norvec", n="Norveç", dat="Norveç'e", loc="Norveç'te", abl="Norveç'ten",
         zorunlu="Vize Zorunluluğu: Türkiye Cumhuriyeti umuma mahsus (bordo) pasaport sahipleri, Norveç'e kısa süreli seyahatlerinde vize almak zorundadır. 90 günden uzun süreli kalışlarda ise vize yerine ilgili oturum izni sürecinin tamamlanması gerekir.",
         muaf="Vizeden Muaf Pasaportlar: Türkiye Cumhuriyeti diplomatik (siyah), hizmet (gri) ve hususi (yeşil) pasaport sahipleri, 180 gün içinde 90 günü aşmayan Norveç seyahatlerinde vizeden muaftır.",
         ulke=GI_ULKE + " Norveç'e yapılan başvurularda Norveç'in seyahatin ana destinasyonu olması gerekir.",
         merkez="Başvuru Merkezi: Norveç'in Türkiye'deki kısa süreli Schengen vize başvuruları VFS Global vize başvuru merkezleri aracılığıyla kabul edilmektedir. Norveç Büyükelçiliği, vize başvuruları için başvuru sahiplerini VFS Global'e yönlendirmektedir.",
         giris="Ülkeye Giriş Yetkisi: Schengen vizesi sahibi olmak, Norveç'e veya Schengen bölgesine giriş hakkının kesin olarak tanındığı anlamına gelmez. Nihai değerlendirme, sınır kontrolü sırasında yetkili makamlar tarafından yapılır.",
         baltic=True,
         vtd="Norveç'e yapacağınız seyahatin amacı ve kalış süresi, başvurmanız gereken vize türünü belirler. Aşağıda Norveç için en sık başvurulan vize türlerini inceleyebilirsiniz.",
         vt_over={1: "İş görüşmesi, şirket ziyareti, toplantı, fuar ve diğer ticari faaliyetler amacıyla Norveç'e yapılacak kısa süreli seyahatler için başvurulan Schengen (C Tipi) vizedir.",
                  3: "Norveç'te yaşayan aile bireylerinin yanına uzun süreli yerleşim amacıyla başvurulan oturum izni ve buna bağlı vize sürecidir.",
                  4: "Norveç'te eğitim amacıyla uzun süreli bulunmak isteyen kişilerin başvurması gereken oturum izni sürecidir.",
                  5: "Norveç'te çalışmak isteyen kişilerin, çalışma koşullarına göre başvurması gereken oturum izni sürecidir.",
                  6: "Norveç üzerinden başka bir ülkeye transit geçiş yapacak ve transit vizeye tabi olan yolcuların başvurabileceği transit vizedir."},
         baltic_first="Norveç vize başvurusu, seyahat amacına ve kalış süresine uygun vize türünün belirlenmesiyle başlar.",
         baltic_form="Kısa süreli Schengen vize başvurularında çevrim içi başvuru formu doldurulur ve başvuru ücreti çevrim içi sistem üzerinden ödenir. Başvuru formu ve ödeme bilgileri alındıktan sonra gerekli belgeler hazırlanır ve VFS Global üzerinden randevu alınır.",
         baltic_appt="Randevu tarihinde başvuru merkezine gidilerek pasaport ve belgeler teslim edilir. Gerekli biyometrik işlemler de başvuru sırasında gerçekleştirilir. Daha önce alınmış biyometrik veriler geçerli olduğu sürece yeniden parmak izi verilmesi gerekmeyebilir.",
         baltic_eval="Başvuru dosyası VFS Global tarafından Norveç makamlarına iletildikten sonra değerlendirme süreci başlar. Gerekli görülmesi halinde ek belge veya bilgi talep edilebilir. Başvurular normal şartlarda 15 takvim günü içinde sonuçlandırılır; bazı dosyalarda değerlendirme süresi 45 takvim gününe kadar uzayabilir.",
         faq_over={1: "Norveç Schengen vize başvuruları normal şartlarda 15 takvim günü içinde sonuçlandırılır. Başvurunun daha ayrıntılı incelenmesi veya ek belge talep edilmesi gereken durumlarda değerlendirme süresi 45 takvim gününe kadar uzayabilir.",
                   2: "Norveç vize başvuru ücreti, başvuru türüne ve başvuru sahibinin durumuna göre değişiklik gösterebilir. Başvuru öncesinde güncel vize ücreti ve varsa başvuru merkezi hizmet bedelinin kontrol edilmesi gerekir. Norveç'te vize başvuru ücreti çevrim içi başvuru sırasında ödenir; VFS Global ayrıca hizmet bedeli uygulayabilir.",
                   4: "Pasaportunuzun planlanan Schengen bölgesinden ayrılış tarihinizden itibaren en az 3 ay daha geçerli olması gerekir. Ayrıca başvuruda sunulan pasaportun ilgili Schengen seyahat belgesi koşullarını karşılaması gerekir.",
                   5: "Schengen vize başvurularında biyometrik veriler alınır. Daha önce alınmış biyometrik veriler geçerli olduğu sürece yeniden parmak izi verilmesi gerekmeyebilir. Norveç'in Türkiye'deki başvuru sürecinde biyometrik işlemler VFS Global başvuru merkezlerinde gerçekleştirilir.",
                   6: "Norveç tarafından verilen geçerli bir Schengen vizesi ile diğer Schengen ülkelerine seyahat edebilirsiniz. Ancak vize başvurusu yapılırken Schengen kurallarına göre seyahatinizin ana destinasyonunun Norveç olması veya Norveç'in başvuru yapılması gereken ülke olması gerekir.",
                   7: "Norveç tarafından verilen Schengen vizelerinin geçerlilik süresi ve giriş sayısı başvuru sahibinin seyahat amacı ve başvuru dosyasının değerlendirilmesine göre belirlenir. Vizenin geçerlilik süresi ve izin verilen kalış süresi vize etiketinde belirtilir."}),

    dict(slug="polonya", n="Polonya", dat="Polonya'ya", loc="Polonya'da", abl="Polonya'dan",
         zorunlu_kisa=True,
         muaf="Vizeden Muaf Pasaportlar: Türkiye Cumhuriyeti hususi (yeşil), hizmet (gri) ve diplomatik (siyah) pasaport sahipleri, 180 gün içinde 90 günü aşmayan kısa süreli seyahatlerinde vizeden muaftır.",
         ulke=GI_ULKE + " Polonya'ya başvurabilmeniz için Polonya'nın seyahatinizin tek veya ana destinasyonu olması gerekir.",
         merkez="Başvuru Merkezi: Polonya'nın Türkiye'deki kısa süreli Schengen vize başvuruları VFS Global Vize Başvuru Merkezleri aracılığıyla kabul edilmektedir. Başvurular Türkiye'deki yetkili merkezlerden randevu alınarak şahsen yapılır.",
         giris="Ülkeye Giriş Yetkisi: Schengen vizesi sahibi olmak, Polonya'ya veya Schengen bölgesine giriş hakkının kesin olarak tanındığı anlamına gelmez. Nihai değerlendirme, sınır kontrolü sırasında yetkili makamlar tarafından yapılır.",
         baltic=True,
         vtd="Polonya'ya yapacağınız seyahatin amacı ve kalış süresi, başvurmanız gereken vize türünü belirler. Aşağıda Polonya için en sık başvurulan vize türlerini inceleyebilirsiniz.",
         vt_over={1: "İş görüşmesi, şirket ziyareti, toplantı, fuar ve diğer ticari faaliyetler amacıyla Polonya'ya yapılacak kısa süreli seyahatler için başvurulan Schengen (C Tipi) vizedir.",
                  3: "Polonya'da yaşayan aile bireylerinin yanına uzun süreli yerleşim amacıyla başvurulan Ulusal (D Tipi) vize ve ilgili oturum izni sürecidir.",
                  4: "Polonya'da eğitim amacıyla uzun süreli bulunmak isteyen kişilerin başvurabileceği Ulusal (D Tipi) vizedir.",
                  5: "Polonya'da çalışmak isteyen kişilerin, çalışma amacı ve koşullarına göre başvurması gereken Ulusal (D Tipi) vize sürecidir.",
                  6: "Polonya üzerinden başka bir ülkeye transit geçiş yapacak ve transit vizeye tabi olan yolcuların başvurabileceği transit vizedir."},
         baltic_first="Polonya vize başvurusu, seyahat amacına ve kalış süresine uygun vize türünün belirlenmesiyle başlar.",
         baltic_form="Kısa süreli Schengen vize başvurularında e-Konsulat sistemi üzerinden başvuru formu doldurulur ve gerekli belgeler hazırlanır.",
         baltic_appt="Başvuru kategorisine uygun şekilde VFS Global üzerinden randevu alınır. Randevu tarihinde başvuru merkezine şahsen gidilerek belgeler ve pasaport teslim edilir, gerekli biyometrik işlemler gerçekleştirilir. Son 59 ay içinde alınmış geçerli Schengen parmak izi kaydı bulunan başvuru sahiplerinin yeniden parmak izi vermesi gerekmeyebilir.",
         baltic_eval="Başvuru dosyası Vize Başvuru Merkezi aracılığıyla Polonya'nın yetkili konsolosluk makamına iletilir ve değerlendirilir. Gerekli görülmesi halinde ek belge veya bilgi talep edilebilir. Başvurular normal şartlarda 15 takvim günü içinde karara bağlanır; başvurunun daha ayrıntılı incelenmesi gereken durumlarda bu süre 45 takvim gününe kadar uzayabilir.",
         baltic_last="Değerlendirme tamamlandığında pasaport başvurunun yapıldığı Vize Başvuru Merkezi aracılığıyla teslim edilir.",
         faq_over={1: "Polonya Schengen vize başvuruları normal şartlarda 15 takvim günü içinde sonuçlandırılır. Başvurunun daha ayrıntılı incelenmesi gereken durumlarda değerlendirme süresi 45 takvim gününe kadar uzayabilir.",
                   4: "Pasaportunuzun talep edilen vizenin sona erme tarihinden sonra en az 3 ay daha geçerli olması, son 10 yıl içinde düzenlenmiş olması ve vize işlemleri için yeterli boş sayfa içermesi gerekir.",
                   5: "Schengen vize başvurularında biyometrik veriler alınır. Son 59 ay içinde alınmış geçerli bir Schengen parmak izi kaydı bulunan başvuru sahiplerinin yeniden parmak izi vermesi gerekmeyebilir. 12 yaşından küçük çocuklar ve biyometrik veri alınmasının fiziksel olarak mümkün olmadığı kişiler belirli koşullarda parmak izi işleminden muaftır.",
                   6: "Polonya tarafından verilen geçerli bir Schengen vizesi ile diğer Schengen ülkelerine seyahat edebilirsiniz. Ancak vize başvurusu yapılırken Schengen kurallarına göre seyahatinizin ana destinasyonunun Polonya olması veya Polonya'nın başvuru yapılması gereken ülke olması gerekir."}),

    dict(slug="portekiz", n="Portekiz", dat="Portekiz'e", loc="Portekiz'de", abl="Portekiz'den",
         merkez="Başvuru Merkezi: Portekiz vize başvuruları, Türkiye'de Portekiz tarafından yetkilendirilmiş başvuru merkezi aracılığıyla kabul edilir.",
         auth="Konsolosluk veya yetkili makamlar",
         vt_over={4: "Portekiz'de üniversite eğitimi, dil kursu veya diğer uzun süreli eğitim programlarına katılacak kişilerin başvurabileceği Ulusal (D Tipi) vizedir.",
                  6: "Portekiz üzerinden başka bir ülkeye transit geçiş yapacak ve transit vizeye tabi olan yolcuların başvurabileceği Schengen (C Tipi) vizedir."},
         faq_over={
             1: "Schengen vize başvuruları, normal şartlarda başvurunun konsolosluğa ulaşmasının ardından genellikle 15 takvim günü içerisinde sonuçlandırılır. Ancak ek belge talep edilmesi, yoğun başvuru dönemleri veya başvurunun detaylı incelemeye alınması durumunda bu süre uzayabilir.",
             3: "Portekiz Konsolosluğu tarafından belirlenmiş resmi bir minimum banka bakiyesi bulunmamaktadır. Başvurunuz değerlendirilirken hesabınızda, seyahat süreniz boyunca ulaşım, konaklama ve diğer masraflarınızı karşılayabilecek yeterli finansal kaynağın bulunması beklenir. Bununla birlikte yalnızca hesap bakiyesi değil; gelir durumunuz, hesap hareketleriniz ve sunduğunuz diğer belgeler de birlikte değerlendirilir. Bu nedenle önemli olan belirli bir tutar göstermekten ziyade, finansal durumunuzun başvuru dosyanızla tutarlı olmasıdır.",
             7: "Portekiz tarafından verilen Schengen vizelerinin geçerlilik süresi, başvuru sahibinin seyahat geçmişi, seyahat amacı ve başvuru dosyasının değerlendirilmesine göre değişiklik gösterebilir. İlk başvurularda vize süresi çoğu zaman planlanan seyahat tarihleriyle sınırlı olurken, olumlu Schengen geçmişine sahip başvuru sahiplerine daha uzun süreli ve çok girişli vizeler verilebilmektedir. Vizenin geçerlilik süresi ve giriş hakkı tamamen konsolosluğun değerlendirmesi doğrultusunda belirlenir."}),

    dict(slug="romanya", n="Romanya", dat="Romanya'ya", loc="Romanya'da", abl="Romanya'dan",
         zorunlu="Vize Zorunluluğu: Türkiye Cumhuriyeti umuma mahsus (bordo) pasaport sahipleri, Romanya'ya kısa süreli seyahatlerinde vize almak zorundadır. Romanya, 31 Mart 2024 tarihinden itibaren Schengen bölgesinin tam üyesidir.",
         muaf="Vizeden Muaf Pasaportlar: Türkiye Cumhuriyeti hususi (yeşil), hizmet (gri) ve diplomatik (siyah) pasaport sahiplerinin kısa süreli Romanya seyahatlerinde vize durumu, pasaport türüne ve seyahatin koşullarına göre değerlendirilmelidir.",
         merkez="Başvuru Merkezi: Romanya vize başvuruları, Romanya Dışişleri Bakanlığı'nın eViza portalı üzerinden online olarak başlatılır. Başvuru formu ve gerekli belgeler elektronik ortamda sisteme yüklenir ve başvuru, yetkili Romanya diplomatik misyonu veya konsolosluk biriminde tamamlanır.",
         giris="Ülkeye Giriş Yetkisi: Schengen vizesi sahibi olmak, Romanya'ya veya Schengen bölgesine giriş hakkının kesin olarak tanındığı anlamına gelmez. Sınır kontrolünde seyahatin amacı, kalış süresi ve diğer giriş koşullarının karşılandığının gösterilmesi gerekebilir.",
         baltic=True,
         vtd="Romanya'ya yapacağınız seyahatin amacı ve kalış süresi, başvurmanız gereken vize türünü belirler. Aşağıda Romanya için en sık başvurulan vize türlerini inceleyebilirsiniz.",
         vt_over={1: "İş görüşmesi, şirket ziyareti, toplantı, fuar ve diğer ticari faaliyetler amacıyla Romanya'ya yapılacak kısa süreli seyahatler için başvurulan Schengen (C Tipi) vizedir.",
                  3: "Romanya'da yaşayan aile bireylerinin yanına uzun süreli yerleşim amacıyla başvurulan Ulusal (D Tipi) vize ve ilgili oturum izni sürecidir.",
                  4: "Romanya'da eğitim amacıyla uzun süreli bulunmak isteyen kişilerin başvurabileceği Ulusal (D Tipi) vize ve ilgili oturum izni sürecidir.",
                  5: "Romanya'da çalışmak isteyen kişilerin, çalışma ve oturum koşullarına göre başvurması gereken Ulusal (D Tipi) vize sürecidir.",
                  6: "Romanya üzerinden başka bir ülkeye transit geçiş yapacak ve transit vizeye tabi olan yolcuların başvurabileceği transit vizedir."},
         baltic_first="Romanya vize başvurusu, seyahat amacına ve kalış süresine uygun vize türünün belirlenmesiyle başlar.",
         baltic_form="Başvuru, Romanya Dışişleri Bakanlığı'nın eViza portalı üzerinden online olarak başlatılır. Başvuru sahibi, seyahat amacı, vatandaşlık ve seyahat belgesi gibi bilgileri girerek başvuru formunu doldurur ve gerekli belgeleri elektronik ortamda sisteme yükler.",
         baltic_appt="Randevu tarihinde gerekli belgeler ve pasaportla birlikte yetkili Romanya diplomatik misyonu veya konsolosluk birimine gidilir. Gerekli biyometrik işlemler gerçekleştirilir ve başvuru dosyası teslim edilir.",
         baltic_eval="Başvuru sonrasında Romanya makamları tarafından değerlendirme yapılır; gerekli görülmesi halinde ek belge veya bilgi talep edilebilir.",
         baltic_last="Karar tamamlandığında pasaport başvuru sürecinin yürütüldüğü kanal aracılığıyla teslim edilir.",
         faq_over={2: "Romanya vize başvuru ücreti, başvuru türüne ve başvuru sahibinin durumuna göre değişiklik gösterebilir. Başvuru öncesinde güncel vize ücretinin ve varsa ilgili hizmet bedellerinin kontrol edilmesi gerekir.",
                   4: "Pasaportunuzun planlanan Schengen bölgesinden ayrılış tarihinizden itibaren en az 3 ay daha geçerli olması ve ilgili Schengen seyahat belgesi koşullarını karşılaması gerekir.",
                   5: "Schengen vize başvurularında biyometrik veriler alınır. Daha önce alınmış biyometrik veriler geçerli olduğu sürece yeniden parmak izi verilmesi gerekmeyebilir.",
                   6: "Romanya tarafından verilen geçerli bir Schengen vizesi ile diğer Schengen ülkelerine seyahat edebilirsiniz. Ancak vize başvurusu yapılırken Schengen kurallarına göre seyahatinizin ana destinasyonunun Romanya olması veya Romanya'nın başvuru yapılması gereken ülke olması gerekir."}),

    dict(slug="slovakya", n="Slovakya", dat="Slovakya'ya", loc="Slovakya'da", abl="Slovakya'dan",
         zorunlu="Vize Zorunluluğu: Türkiye Cumhuriyeti umuma mahsus (bordo) pasaport sahipleri, Slovakya'ya kısa süreli seyahatlerinde Schengen vizesi almak zorundadır.",
         muaf="Vizeden Muaf Pasaportlar: Türkiye Cumhuriyeti diplomatik (siyah), hizmet (gri) ve hususi (yeşil) pasaport sahipleri, Slovakya'ya yapacakları kısa süreli seyahatlerde vizeden muaftır.",
         ulke=GI_ULKE + " Slovakya seyahatinizin ana destinasyonuysa başvurunuzu Slovakya makamlarına yapmalısınız.",
         merkez="Başvuru Merkezi: Slovakya'nın Türkiye'deki Schengen vize başvuruları, başvuru sahibinin ikamet ettiği ile göre yetkili BLS International veya VFS Global vize başvuru merkezleri aracılığıyla kabul edilmektedir. Başvuruların hangi merkezden yapılacağı ikamet edilen bölgeye göre belirlenmektedir.",
         giris="Ülkeye Giriş Yetkisi: Schengen vizesi sahibi olmak, Slovakya'ya veya Schengen bölgesine giriş hakkının kesin olarak tanındığı anlamına gelmez. Nihai değerlendirme, sınır kontrolü sırasında yetkili makamlar tarafından yapılır.",
         baltic=True,
         vtd="Slovakya'ya yapacağınız seyahatin amacı ve kalış süresi, başvurmanız gereken vize türünü belirler. Aşağıda Slovakya için en sık başvurulan vize türlerini inceleyebilirsiniz.",
         vt_over={1: "İş görüşmesi, şirket ziyareti, toplantı, fuar ve diğer ticari faaliyetler amacıyla Slovakya'ya yapılacak kısa süreli seyahatler için başvurulan Schengen (C Tipi) vizedir.",
                  3: "Slovakya'da yaşayan aile bireylerinin yanına uzun süreli yerleşim amacıyla başvurulan uzun süreli vize ve ilgili oturum izni sürecidir.",
                  4: "Slovakya'da eğitim amacıyla uzun süreli bulunmak isteyen kişilerin başvurabileceği Ulusal (D Tipi) vize ve ilgili oturum izni sürecidir.",
                  5: "Slovakya'da çalışmak isteyen kişilerin, çalışma amacı ve kalış süresine göre başvurması gereken Ulusal (D Tipi) vize ve ilgili oturum izni sürecidir.",
                  6: "Slovakya üzerinden başka bir ülkeye transit geçiş yapacak ve transit vizeye tabi olan yolcuların başvurabileceği transit vizedir."},
         baltic_first="Slovakya vize başvurusu, seyahat amacına ve kalış süresine uygun vize türünün belirlenmesiyle başlar.",
         baltic_form="Kısa süreli Schengen vize başvurularında başvuru formu hazırlanır ve seyahat amacını destekleyen gerekli belgeler tamamlanır.",
         baltic_appt="Başvuru sahibinin ikamet ettiği ile göre yetkili BLS International veya VFS Global başvuru merkezi üzerinden randevu alınır. Randevu tarihinde başvuru merkezine şahsen gidilerek pasaport ve belgeler teslim edilir. Gerekli biyometrik işlemler de başvuru sırasında gerçekleştirilir. Daha önce alınmış ve geçerli olan biyometrik veriler, ilgili kurallar çerçevesinde yeniden kullanılabilir.",
         baltic_eval="Başvuru dosyası yetkili başvuru merkezi aracılığıyla Slovakya'nın ilgili konsolosluk makamına iletilir ve değerlendirme süreci başlar. Gerekli görülmesi halinde ek belge veya bilgi talep edilebilir.",
         baltic_last="Değerlendirme tamamlandığında pasaport, başvurunun yapıldığı başvuru merkezi üzerinden teslim edilir.",
         faq_over={5: "Schengen vize başvurularında biyometrik veriler alınır. Daha önce alınmış ve geçerli biyometrik verilerin yeniden kullanılması mümkün olabilir. Biyometrik işlemler başvuru sürecinde yetkili başvuru merkezinde gerçekleştirilir.",
                   6: "Slovakya tarafından verilen geçerli bir Schengen vizesi ile diğer Schengen ülkelerine seyahat edebilirsiniz. Ancak vize başvurusu yapılırken Schengen kurallarına göre seyahatinizin ana destinasyonunun Slovakya olması veya Slovakya'nın başvuru yapılması gereken ülke olması gerekir.",
                   7: "Slovakya tarafından verilen Schengen vizelerinin geçerlilik süresi ve giriş sayısı, başvuru sahibinin durumuna ve yetkili makamların değerlendirmesine göre belirlenir. Vizenin geçerlilik süresi ve izin verilen kalış süresi vize etiketinde belirtilir."}),

    dict(slug="slovenya", n="Slovenya", dat="Slovenya'ya", loc="Slovenya'da", abl="Slovenya'dan",
         zorunlu="Vize Zorunluluğu: Türkiye Cumhuriyeti umuma mahsus (bordo) pasaport sahipleri, Slovenya'ya kısa süreli seyahatlerinde Schengen vizesi almak zorundadır.",
         muaf="Vizeden Muaf Pasaportlar: Türkiye Cumhuriyeti diplomatik (siyah), hizmet (gri) ve hususi (yeşil) pasaport sahipleri, 180 gün içinde 90 günü aşmayan kısa süreli Slovenya seyahatlerinde vizeden muaftır.",
         ulke="Doğru Başvuru Ülkesi: Schengen vizesi başvurusu, seyahatinizde ana destinasyon olan ülkenin temsilciliğine yapılmalıdır. Slovenya seyahatinizin ana destinasyonuysa başvurunuzu Slovenya makamlarına yapmanız gerekir.",
         merkez="Başvuru Merkezi: Slovenya'nın Türkiye'deki kısa süreli Schengen vize başvuruları Ankara'daki Slovenya Büyükelçiliği, Türkiye'deki VFS Global merkezleri ve İstanbul'daki AS Visa merkezi üzerinden kabul edilmektedir.",
         giris="Ülkeye Giriş Yetkisi: Schengen vizesi sahibi olmak, Slovenya'ya veya Schengen bölgesine giriş hakkının kesin olarak tanındığı anlamına gelmez. Nihai değerlendirme, sınır kontrolü sırasında yetkili makamlar tarafından yapılır.",
         baltic=True,
         vtd="Slovenya'ya yapacağınız seyahatin amacı ve kalış süresi, başvurmanız gereken vize türünü belirler. Aşağıda Slovenya için en sık başvurulan vize türlerini inceleyebilirsiniz.",
         vt_over={1: "İş görüşmesi, şirket ziyareti, toplantı, fuar ve diğer ticari faaliyetler amacıyla Slovenya'ya yapılacak kısa süreli seyahatler için başvurulan Schengen (C Tipi) vizedir.",
                  3: "Slovenya'da yaşayan aile bireylerinin yanına uzun süreli yerleşim amacıyla başvurulan uzun süreli vize ve ilgili oturum izni sürecidir.",
                  4: "Slovenya'da eğitim amacıyla uzun süreli bulunmak isteyen kişilerin başvurabileceği Ulusal (D Tipi) vize ve ilgili uzun süreli kalış sürecidir.",
                  5: "Slovenya'da çalışmak isteyen kişilerin, çalışma amacı ve kalış süresine göre başvurması gereken uzun süreli vize ve ilgili oturum izni sürecidir.",
                  6: "Slovenya üzerinden başka bir ülkeye transit geçiş yapacak ve transit vizeye tabi olan yolcuların başvurabileceği transit vizedir."},
         baltic_first="Slovenya vize başvurusu, seyahat amacına ve kalış süresine uygun vize türünün belirlenmesiyle başlar.",
         baltic_form="Kısa süreli Schengen vize başvurularında başvuru formu doldurulur ve seyahat amacını destekleyen gerekli belgeler hazırlanır.",
         baltic_appt="Başvuru, Ankara'daki Slovenya Büyükelçiliği, yetkili VFS Global merkezleri veya İstanbul'daki AS Visa merkezi üzerinden yapılabilir. Başvuru sahibinin şahsen başvuru sürecine katılması ve biyometrik verilerinin alınması genel kuraldır.",
         baltic_eval="Başvuru dosyası teslim edildikten sonra Slovenya'nın yetkili makamları tarafından değerlendirilir. Gerekli görülmesi halinde ek belge veya bilgi talep edilebilir. Başvuru, kural olarak seyahatten en az 15 takvim günü önce yapılmalı ve en erken seyahat tarihinden 6 ay önce sunulabilir.",
         faq_over={0: "Slovenya Schengen vize başvuruları planlanan seyahat tarihinden en erken 6 ay önce yapılabilir. Başvurunun kural olarak seyahatten en az 15 takvim günü önce sunulması gerekir. Randevu ve değerlendirme sürecini göz önünde bulundurarak başvurunuzu mümkün olduğunca erken planlamanız tavsiye edilir.",
                   1: "Slovenya Schengen vize başvurularında değerlendirme süresi başvurunun niteliğine ve gerekli incelemelere göre değişebilir. Başvurunun daha ayrıntılı incelenmesi veya ek bilgi ve belge talep edilmesi halinde süreç uzayabilir.",
                   2: "Slovenya vize başvuru ücreti, başvuru sahibinin durumuna ve başvuru türüne göre değişiklik gösterebilir. Başvuru öncesinde güncel vize ücretinin ve başvuru merkezi aracılığıyla yapılan başvurularda varsa hizmet bedelinin kontrol edilmesi gerekir.",
                   4: "Pasaportunuzun planlanan Schengen bölgesinden ayrılış tarihinizden itibaren en az 3 ay daha geçerli olması, son 10 yıl içinde düzenlenmiş olması ve en az iki boş sayfasının bulunması gerekir.",
                   5: "Schengen vize başvurularında biyometrik veriler alınır ve başvuru sahibinin genel kural olarak şahsen başvuru yapması gerekir. Belirli kategoriler için biyometrik veri alınmasına ilişkin istisnalar bulunabilir.",
                   6: "Slovenya tarafından verilen geçerli bir Schengen vizesi ile diğer Schengen ülkelerine seyahat edebilirsiniz. Ancak vize başvurusu yapılırken seyahatinizin ana destinasyonunun Slovenya olması veya Slovenya'nın başvuru yapılması gereken ülke olması gerekir.",
                   7: "Slovenya tarafından verilen Schengen vizelerinin geçerlilik süresi ve giriş sayısı, başvuru sahibinin durumuna ve yetkili makamların değerlendirmesine göre belirlenir. Vizenin geçerlilik süresi ve izin verilen kalış süresi vize etiketinde belirtilir."}),

    dict(slug="yunanistan", n="Yunanistan", dat="Yunanistan'a", loc="Yunanistan'da", abl="Yunanistan'dan",
         zorunlu="Vize Zorunluluğu: Türkiye Cumhuriyeti umuma mahsus (bordo) pasaport sahipleri, Yunanistan'a seyahat etmeden önce vize almak zorundadır. Yunanistan, Schengen vize rejimine dahildir.",
         merkez="Başvuru Merkezi: Yunanistan vize başvuruları, ikamet edilen bölgeye göre yetkili Yunanistan Konsolosluğu tarafından belirlenen Kosmos Vize başvuru merkezleri aracılığıyla kabul edilir. Türkiye'deki Yunanistan temsilciliklerinin yetki alanlarına göre başvuru merkezi ve başvuru yöntemi değişiklik gösterebilir.",
         auth="Konsolosluk veya yetkili makamlar",
         vt_over={4: "Yunanistan'da üniversite eğitimi, dil kursu veya diğer uzun süreli eğitim programlarına katılacak kişilerin başvurabileceği Ulusal (D Tipi) vizedir.",
                  6: "Yunanistan üzerinden başka bir ülkeye transit geçiş yapacak ve transit vizeye tabi olan yolcuların başvurabileceği Schengen (C Tipi) vizedir."},
         faq_over={
             1: "Schengen vize başvuruları, normal şartlarda başvurunun konsolosluğa ulaşmasının ardından genellikle 15 takvim günü içerisinde sonuçlandırılır. Ancak ek belge talep edilmesi, yoğun başvuru dönemleri veya başvurunun detaylı incelemeye alınması durumunda bu süre uzayabilir.",
             3: "Yunanistan Konsolosluğu tarafından belirlenmiş resmi bir minimum banka bakiyesi bulunmamaktadır. Başvurunuz değerlendirilirken hesabınızda, seyahat süreniz boyunca ulaşım, konaklama ve diğer masraflarınızı karşılayabilecek yeterli finansal kaynağın bulunması beklenir. Bununla birlikte yalnızca hesap bakiyesi değil; gelir durumunuz, hesap hareketleriniz ve sunduğunuz diğer belgeler de birlikte değerlendirilir. Bu nedenle önemli olan belirli bir tutar göstermekten ziyade, finansal durumunuzun başvuru dosyanızla tutarlı olmasıdır.",
             6: "Yunanistan tarafından verilen bir Schengen vizesi ile diğer Schengen ülkelerine seyahat edebilirsiniz. Ancak kural olarak; seyahatiniz birden fazla ülkeyi kapsıyorsa en uzun konaklamayı yapacağınız veya ana destinasyonunuz olan ülkenin Yunanistan olması gerekir. Ayrıca pasaport kontrolünde seyahat amacınızı ve planınızı kanıtlayan belgeleri yanınızda taşımanız önemlidir.",
             7: "Yunanistan tarafından verilen Schengen vizelerinin geçerlilik süresi, başvuru sahibinin seyahat geçmişi, seyahat amacı ve başvuru dosyasının değerlendirilmesine göre değişiklik gösterebilir. İlk başvurularda vize süresi çoğu zaman planlanan seyahat tarihleriyle sınırlı olurken, olumlu Schengen geçmişine sahip başvuru sahiplerine daha uzun süreli ve çok girişli vizeler verilebilmektedir. Vizenin geçerlilik süresi ve giriş hakkı tamamen konsolosluğun değerlendirmesi doğrultusunda belirlenir."}),
]

# ---------------------------------------------------------------- Schengen dışı ülkeler

OTHER = [
 dict(slug="abd", n="ABD", label="Amerika Birleşik Devletleri (ABD)",
  gi=[
   "Vize Zorunluluğu: Türkiye Cumhuriyeti umuma mahsus (bordo) pasaport sahipleri, ABD'ye seyahat etmeden önce vize almak zorundadır.",
   "Vizeden Muaf Pasaportlar: Hususi (yeşil), hizmet (gri) ve diplomatik (siyah) pasaport sahipleri de dâhil olmak üzere tüm T.C. pasaport türleri ABD seyahatlerinde vizeye tabidir.",
   "Doğru Başvuru Sistemi: ABD vize başvurusu, doğrudan ABD Dışişleri Bakanlığı'nın resmi platformu olan DS-160 formunun İngilizce olarak doldurulmasıyla başlatılır.",
   "Başvuru Merkezi: Randevular ve biyometrik işlemler (fotoğraf ve parmak izi) ABD Ankara Büyükelçiliği veya ABD İstanbul Başkonsolosluğu bünyesinde doğrudan konsolosluk yetkilileriyle gerçekleştirilir. Aracı kurum (vize başvuru merkezi) kullanılmaz.",
   "Ülkeye Giriş Yetkisi: ABD vizesi sahibi olmak, ülkeye giriş hakkının kesin olarak tanındığı anlamına gelmez. Nihai değerlendirme, havalimanındaki sınır kontrolü sırasında ABD Gümrük ve Sınır Muhafaza (CBP) memurları tarafından yapılır.",
  ],
  gid="ABD vize başvurunuza başlamadan önce aşağıdaki temel bilgileri bilmeniz, süreci doğru planlamanıza yardımcı olacaktır.",
  vtd="Doğru vize türüne başvurmak, başvuru sürecinin en önemli adımlarından biridir. ABD'ye yapacağınız seyahatin amacı, başvurmanız gereken vize türünü belirler.",
  vt=[
   ("ABD Turistik ve Ticari Vizesi (B1/B2)", "Tatil, gezi, aile/arkadaş ziyareti, tıbbi tedavi (B2) veya iş görüşmesi, konferans, fuar katılımı (B1) amacıyla yapılan seyahatler için verilen birleşik ziyaretçi vizesidir."),
   ("ABD Öğrenci Vizesi (F1 / M1)", "ABD'de üniversite, dil okulu veya akademik programlara katılacak kişiler (F1) ile mesleki/teknik eğitim alacak kişiler (M1) için verilen vize türüdür."),
   ("ABD Değişim Programı Vizesi (J1)", "Work and Travel, staj, akademisyen, araştırmacı veya Au Pair gibi değişim programlarına katılacak kişilerin başvurabileceği vize türüdür."),
   ("ABD Geçici Çalışma Vizesi (H, L, O, P Vizeleri)", "ABD'li bir işverenden onaylı dilekçe (I-129 / I-797 PETITION) almış uzman çalışanlar, şirket içi transferler veya üstün yetenekli kişilerin başvurduğu geçici çalışma vizesidir."),
   ("ABD Transit Vizesi (C1)", "ABD havalimanları üzerinden başka bir üçüncü ülkeye aktarmalı geçiş yapacak yolcuların ihtiyaç duyduğu vize türüdür."),
  ],
  steps=[
   ("DS-160 Formunun Doldurulması", "ABD vize başvurusu, DS-160 başvuru formunun eksiksiz, doğru ve İngilizce olarak doldurulmasıyla başlar."),
   ("Randevu Oluşturulması", "Form onaylandıktan sonra resmi randevu sistemi üzerinden profil oluşturulur ve konsolosluk mülakat randevusu alınır."),
   ("Biyometrik İşlemler ve Mülakat", "Randevu tarihinde seçilen konsolosluğa (İstanbul veya Ankara) şahsen gidilerek biyometrik veriler teslim edilir ve ABD konsolosluk görevlisi ile birebir mülakat gerçekleştirilir."),
   ("Değerlendirme", "Mülakat esnasında vize görevlisi başvurunuzu anlık olarak değerlendirir."),
   ("Sonuç ve Pasaport Teslimi", "Vizenizin onaylanması halinde pasaportunuz teslim alınır ve basım işlemlerinin ardından PTT aracılığıyla tarafınıza gönderilir; başvurunun olumsuz sonuçlanması halinde ise pasaportunuz mülakat sonunda ret gerekçesini içeren belge ile tarafınıza iade edilir."),
  ],
  faqs=[
   ("ABD vize başvurusunu ne kadar önce yapmalıyım?", "ABD Konsolosluklarındaki randevu yoğunlukları ve bekleme süreleri dönemsel olarak değişkenlik göstermektedir. Bu nedenle seyahat planınızın aksamaması adına başvurunuzu planlanan seyahat tarihinden mümkün olduğunca erken (mümkünse aylar öncesinden) başlatmanız tavsiye edilir."),
   ("ABD vizesi kaç günde sonuçlanır?", "Mülakatınız olumlu geçtiği takdirde pasaportunuz vize basımı tamamlanarak ortalama 3-5 iş günü içerisinde seçtiğiniz PTT şubesine teslim edilir. Ek inceleme (idari işlem / Administrative Processing) kararı verilen başvurularda ise süreç uzayabilir."),
   ("ABD vize ücreti ne kadardır?", "Vize harçları; başvurulan vize türüne (B1/B2, F1, H1-B vb.) ve başvuru kategorisine göre değişiklik göstermektedir. Güncel konsolosluk MRV harçları ve danışmanlık hizmet bedellerimiz hakkında detaylı bilgi almak için ekibimizle iletişime geçebilirsiniz."),
   ("ABD vizesi için banka hesabımda ne kadar para bulunmalıdır?", "ABD Konsolosluğu sabit bir tutar belirtmez. Mülakat esnasında temel odak noktası; seyahatinizi kendi finansal kaynaklarınızla karşılayabileceğinizi ve Türkiye'deki düzenli gelirinizi belgelendirmenizdir."),
   ("ABD vizesi için pasaportumun en az kaç ay geçerliliği olmalıdır?", "Pasaportunuzun, ABD'de kalmayı planladığınız sürenin bitiminden itibaren en az 6 ay daha geçerliliği bulunmalıdır."),
   ("Eski pasaportumdaki geçerli ABD vizesi ile yeni pasaportumla seyahat edebilir miyim?", "Evet. Eski pasaportunuzun süresi dolmuş olsa bile, içindeki ABD vizesi iptal edilmediği veya hasar görmediği sürece geçerlidir. Seyahatiniz sırasında eski (vizeli) ve yeni (geçerli) pasaportunuzu yanınızda birlikte taşıyarak seyahat edebilirsiniz."),
   ("10 yıllık ABD vizesi almak, ABD'de 10 yıl boyunca kesintisiz kalabileceğim anlamına mı gelir?", "Hayır. Vizenin 10 yıllık olması giriş izninizin geçerlilik süresidir. ABD'ye giriş yaptığınızda havalimanındaki Sınır Güvenlik Memuru (CBP) kalabileceğiniz süreyi belirler (genellikle tek girişte en fazla 6 aydır)."),
   ("ABD vizesi için mülakata girmem ve parmak izi vermem gerekir mi?", "Evet. 14-79 yaş arasındaki başvuru sahiplerinin ABD Konsolosluğu'na şahsen giderek mülakata katılması ve parmak izi vermesi zorunludur."),
   ("ABD vize mülakatında Türkçe konuşabilir miyim?", "Evet. Turistik ve ticari (B1/B2) vize mülakatlarında Konsolosluk yetkilileri Türkçe bilmektedir. Mülakatınızı Türkçe olarak gerçekleştirebilirsiniz. (Öğrenci veya çalışma vizelerinde İngilizce seviyesi ölçülebilir)."),
   ("Süresi dolan ABD vizemi mülakata girmeden (posta yoluyla) yenileyebilir miyim?", "Evet. Daha önce ABD vizesi almış ve vize süresi dolalı belirli bir süreyi geçmemiş kişiler (veya belirli yaş kriterlerindeki başvuru sahipleri) mülakat muafiyeti (Interview Waiver) kapsamında konsolosluğa gitmeden posta yoluyla vizelerini yenileyebilirler."),
   ("Erken randevu (acil randevu) talebi nasıl oluşturulur?", "Sağlık aciliyetleri, cenaze, acil iş toplantıları veya yaklaşan okul başlangıç tarihleri gibi belgeli acil durumlar için sistem üzerinden kanıtlayıcı evraklar sunularak konsolosluktan öne çekilmiş acil randevu (Expedited Appointment) talep edilebilir."),
   ("Evraklarımı başvuru merkezine götürmem gerekiyor mu, yoksa internetten mi yükleniyor?", "ABD vize sisteminde ana beyan DS-160 formu üzerinden online yapılır. Destekleyici evraklar internete yüklenmez; randevu günü mülakat esnasında konsolosluk görevlisinin talep etme ihtimaline karşı yanınızda fiziki olarak bulundurulur."),
   ("Geçerli bir Schengen veya İngiltere vizesinin olması ABD vize şansımı artırır mı?", "Evet. Daha önce gelişmiş ülkelere yapılmış, kurallara uygun şekilde tamamlanmış seyahat geçmişi (Schengen, İngiltere, Kanada vb.), güvenilir bir seyahat profili çizdiği için ABD vize mülakatında olumlu bir izlenim sağlar."),
   ("ABD vize başvuruları en çok hangi nedenlerle reddedilir?", "ABD vize retleri büyük oranda 214(b) maddesi (Türkiye'ye yeterli sosyal ve ekonomik bağların gösterilememesi ve göçmenlik potansiyeli şüphesi) kapsamındadır. Ayrıca DS-160 formundaki çelişkili bilgiler ve mülakattaki güvensiz ifadeler de ret nedenlerindendir."),
   ("ABD vize başvurum reddedilirse tekrar başvuru yapabilir miyim?", "Evet. ABD vize reddine itiraz mekanizması bulunmamaktadır. Ancak durumunuzda veya finansal/sosyal şartlarınızda önemli bir değişiklik olduğunda yeniden DS-160 formu doldurup yeni bir randevu alarak başvuru yapabilirsiniz."),
  ]),

 dict(slug="avustralya", n="Avustralya",
  gi=[
   "Vize Zorunluluğu: Türkiye Cumhuriyeti umuma mahsus (bordo) pasaport sahipleri, Avustralya'ya seyahat etmeden önce vize almak zorundadır.",
   "Vizeden Muaf Pasaportlar: Hususi (yeşil), hizmet (gri) ve diplomatik (siyah) pasaport sahipleri de dâhil olmak üzere tüm T.C. pasaport türleri Avustralya seyahatlerinde vizeye tabidir.",
   "Doğru Başvuru Sistemi: Avustralya vize başvurusu, Avustralya İçişleri Bakanlığı'nın resmi platformu olan ImmiAccount üzerinden tamamen dijital olarak yapılır.",
   "Başvuru Merkezi: Başvuru internetten yüklendikten sonra biyometrik işlemler (parmak izi ve fotoğraf) yetkilendirilmiş VFS Global Avustralya Vize Başvuru Merkezleri aracılığıyla tamamlanır.",
   "Ülkeye Giriş Yetkisi: Avustralya vizesi sahibi olmak, ülkeye giriş hakkının kesin olarak tanındığı anlamına gelmez. Nihai değerlendirme, sınır kontrolü sırasında Avustralya Sınır Gücü (ABF) memurları tarafından yapılır.",
  ],
  gid="Avustralya vize başvurunuza başlamadan önce aşağıdaki temel bilgileri bilmeniz, süreci doğru planlamanıza yardımcı olacaktır.",
  vtd="Doğru vize türüne başvurmak, başvuru sürecinin en önemli adımlarından biridir. Avustralya'ya yapacağınız seyahatin amacı, başvurmanız gereken vize türünü belirler.",
  vt=[
   ("Avustralya Ziyaretçi Vizesi (Visitor Visa - Subclass 600)", "Tatil, gezi, aile/arkadaş ziyareti veya kısa süreli iş görüşmeleri amacıyla yapılan seyahatler için verilen vize türüdür."),
   ("Avustralya Öğrenci Vizesi (Student Visa - Subclass 500)", "Avustralya'da dil okulu, lisans, yüksek lisans veya mesleki eğitim alacak kişilerin başvurması gereken vize türüdür."),
   ("Avustralya Çalışma ve Tatil Vizesi (Work and Holiday - Subclass 462)", "18-30 yaş arasındaki gençlere Avustralya'da 1 yıla kadar hem tatil yapma hem de çalışma imkânı sunan kotalı vize türüdür."),
   ("Avustralya Transit Vizesi (Subclass 771)", "Avustralya üzerinden başka bir üçüncü ülkeye aktarmalı geçiş yapacak ve havalimanında 8 saatten fazla kalacak kişilerin alması gereken vize türüdür."),
  ],
  steps=[
   ("Online Başvurunun Oluşturulması", "Avustralya vize süreci, ImmiAccount resmi portalı üzerinden online başvuru formunun eksiksiz doldurulmasıyla başlar."),
   ("Belgelerin Yüklenmesi ve Harç Ödemesi", "Seyahat amacınızı, finansal yeterliliğinizi ve Türkiye'ye geri döneceğinizi kanıtlayan tüm belgeler sistem standartlarına uygun olarak dijital ortama yüklenir ve vize harcı ödenir."),
   ("Biyometrik İşlemler", "Başvuru gönderildikten sonra sistem tarafından Biyometrik Talep Mektubu (Biometrics Requirement Letter) oluşturulur. Bu mektupla yetkili VFS Global merkezinden randevu alınarak parmak izi ve biyometrik fotoğraf teslim edilir."),
   ("Değerlendirme Süreci", "Değerlendirme doğrudan Avustralya İçişleri Bakanlığı vize memurları tarafından yapılır."),
   ("Sonuç", "Başvurunuz onaylandığında elektronik vize belgeniz (e-Visa PDF) sistem üzerinden tarafınıza iletilir; pasaportunuza fiziki etiket yapıştırılmaz."),
  ],
  faqs=[
   ("Avustralya vizesi pasaporta etiket olarak basılıyor mu?", "Hayır. Avustralya vizeleri tamamen elektroniktir (e-Visa). Pasaportunuza fiziki bir vize etiketi yapıştırılmaz; onaylandığında vize numaranız dijital olarak pasaport sisteminize tanımlanır ve size onay belgesi (PDF) iletilir."),
   ("Avustralya vizesi için konsolosluğa gitmek veya mülakata girmek gerekiyor mu?", "Hayır, yüz yüze mülakat yapılmaz. Ancak başvuruyu ImmiAccount üzerinden tamamladıktan sonra, parmak izi ve biyometrik fotoğraf vermek için yetkili VFS Global merkezine gitmeniz zorunludur."),
   ("Hiç seyahat geçmişim (Schengen, ABD vb.) yoksa Avustralya vizesi alabilir miyim?", "Alabilirsiniz ancak zorlaşır. Avustralya Göçmenlik Makamı, Türkiye'den çok uzak bir lokasyona ilk kez gidilmesini \"göçmenlik/iltica şüphesi\" olarak değerlendirebilir. Seyahat geçmişi olmaması durumunda Türkiye'deki finansal, iş ve ailevi bağların çok güçlü belgelenmesi gerekir."),
   ("Avustralya Turist Vizesi (Subclass 600) ile orada çalışabilir miyim?", "Hayır. Ziyaretçi vizesi sahiplerinin Avustralya'da herhangi bir işte yasal olarak çalışması kesinlikle yasaktır. Çalışma hakkı yalnızca Öğrenci Vizesi (kısıtlı saatler) ve Work and Holiday (Subclass 462) vizesi sahiplerine tanınır."),
   ("Avustralya Öğrenci Vizesi alanların çalışma izni ne kadardır?", "Öğrenci Vizesi (Subclass 500) sahipleri eğitim dönemleri boyunca 2 haftada toplam 48 saate kadar, resmi okul tatillerinde ise sınırsız çalışma hakkına sahiptir."),
   ("Avustralya vizesinde \"No Further Stay\" (8503 Şartı) ne anlama gelir?", "Vizenize bu kod eklendiyse, Avustralya'dayken mevcut vizenizi uzatamaz veya başka bir vize türüne (örneğin öğrenci veya çalışma vizesine) içeriden başvuru yapamazsınız. Vize süreniz dolmadan ülkeden çıkış yapmanız gerekir."),
   ("Avustralya vize başvurum reddedilirse itiraz hakkım var mıdır?", "Avustralya dışından yapılan bireysel turistik başvurularda standart bir itiraz hakkı (AAT temyizi) bulunmaz. Ancak ret gerekçeleri incelenip dosyadaki eksikler giderilerek ImmiAccount üzerinden sıfırdan yeni bir başvuru yapılabilir."),
   ("Sadece Yeni Zelanda vizesi almak için Avustralya transit vizesine başvurmak gerekiyor mu?", "Evet. Yeni Zelanda'ya giderken Avustralya üzerinden aktarma yapacaksanız ve bekleme süreniz 8 saati aşıyorsa veya havalimanında bagaj alıp yeniden check-in yapmanız gerekiyorsa Avustralya Transit Vizesi (Subclass 771) almanız zorunludur. Transit vize harçsızdır ancak başvuru süreci standart vize gibidir."),
   ("Avustralya vizesi kaç yıllık verilir ve ülkede tek seferde en fazla ne kadar kalabilirim?", "Avustralya turistik vizeleri konsolosluğun takdirine bağlı olarak genellikle 1 yıllık çok girişli (Multiple Entry) olarak düzenlenir. Ancak 1 yıllık vize almanız ülkede 1 yıl aralıksız kalabileceğiniz anlamına gelmez; her girişte tek seferde kalabileceğiniz azami süre genellikle 3 ay (90 gün) ile sınırlandırılır."),
   ("Akraba veya arkadaştan gelen davetiye (Sponsorship) vize onayını kesinleştirir mi?", "Hayır, tek başına yeterli değildir. Avustralya'daki bir yakınınızın size davetiye göndermesi seyahat amacınızı destekler; ancak vize memuru öncelikle sizin Türkiye'ye geri dönmenizi sağlayacak güçlü ekonomik ve sosyal bağlarınız (düzenli iş, mülk, aile vb.) olup olmadığına bakar."),
   ("Avustralya vize başvurusu sonuçlanmadan uçak bileti satın almalı mıyım?", "Kesinlikle hayır. Avustralya İçişleri Bakanlığı, vizeniz onaylanmadan kesin (ödenmiş) uçak bileti ve otel rezervasyonu yapılmamasını açıkça tavsiye eder. Başvuru aşamasında yalnızca taslak seyahat planı sunmanız yeterlidir."),
   ("Öğrenci veya Ziyaretçi vizesi alırken sağlık taraması (Sağlık Raporu) yaptırmak zorunda mıyım?", "Her başvuru sahibi için zorunlu değildir. Ancak 6 aydan uzun süreli kalışlarda (Öğrenci vizesi vb.), belirli yaşın üzerindeki başvuru sahiplerinde veya sağlık/bakım sektöründe bulunacak kişilerden Avustralya Konsolosluğu'nun panel doktorlarından alınmış resmi sağlık raporu (Panel Physician Health Assessment) talep edilebilir."),
   ("Avustralya vizesi reddedildikten sonra ödenen başvuru harcı iade edilir mi?", "Hayır. Vize başvuru harçları başvurunun değerlendirilme süreci için ödenir. Başvurunuz ret ile sonuçlansa dahi Avustralya Hükümeti tarafından ödenen ücretler iade edilmez."),
  ]),

 dict(slug="bae", n="BAE", label="Birleşik Arap Emirlikleri (BAE / Dubai)",
  gi=[
   "Vize Zorunluluğu: Türkiye Cumhuriyeti umuma mahsus (bordo) pasaport sahipleri, BAE'ye (Dubai, Abu Dabi vb.) seyahat etmeden önce vize almak zorundadır.",
   "Vizeden Muaf Pasaportlar: Hususi (yeşil), hizmet (gri) ve diplomatik (siyah) pasaport sahipleri, 180 gün içinde 90 güne kadar BAE seyahatlerinde vizeden muaftır.",
   "Doğru Başvuru Sistemi: BAE vize başvurusu tamamen dijital ortamda e-Vize olarak gerçekleştirilir.",
   "Başvuru Merkezi: BAE vizelerinde konsolosluğa gitmeye, fiziki randevuya veya pasaport teslim etmeye gerek yoktur. Başvurular yetkili acenteler veya BAE merkezli havayolu şirketleri üzerinden online yapılır.",
   "Ülkeye Giriş Yetkisi: e-Vize sahibi olmak ülkeye giriş garantisi vermez. Nihai değerlendirme, havalimanında BAE Sınır Güvenliği memurları tarafından yapılır.",
  ],
  gid="BAE vize başvurunuza başlamadan önce aşağıdaki temel bilgileri bilmeniz, süreci doğru planlamanıza yardımcı olacaktır.",
  vtd="Doğru vize türüne başvurmak, başvuru sürecinin en önemli adımlarından biridir. BAE'ye yapacağınız seyahatin amacı ve kalış süreniz, başvurmanız gereken vize türünü belirler.",
  vt=[
   ("30 Günlük Tek Girişli Turistik Vize", "Kısa süreli tatil, iş görüşmesi veya aile ziyareti amacıyla BAE'ye gidecek ve tek bir giriş-çıkış yapacak kişilerin başvurduğu e-vize türüdür."),
   ("30 Günlük Çok Girişli Turistik Vize", "30 günlük süre içinde BAE'ye ve komşu ülkelere (örneğin Umman veya Katar) birden fazla giriş-çıkış yapacak kişilerin tercih ettiği vize türüdür."),
   ("60 Günlük Tek / Çok Girişli Turistik Vize", "BAE'de daha uzun süre kalmayı, iş aramayı veya uzun süreli tatil yapmayı planlayan kişiler için verilen e-vize türüdür."),
   ("48 ve 96 Saatlik Transit Vize", "BAE havalimanları (Dubai, Abu Dabi vb.) üzerinden üçüncü bir ülkeye aktarma yapacak ve bekleme süresinde şehre çıkmak isteyen yolcuların alabileceği vize türüdür."),
  ],
  steps=[
   ("Dijital Belgelerin Hazırlanması", "Başvuru için pasaportunuzun resimli sayfasının renkli taranmış hali ve biyometrik fotoğrafınız dijital sisteme yüklenir. Fiziki evrak hazırlığı veya banka dökümü şartı bulunmamaktadır."),
   ("Sisteme Veri Girişi", "Göçmenlik sistemine (ICP/GDRFA) veri girişi yapıldıktan sonra sistem onay süreci başlar."),
   ("Sonuç ve e-Vize Teslimi", "Vize onaylandığında, tarafınıza PDF formatında elektronik vize (e-Vize) düzenlenir. Bu belgenin çıktısını alarak seyahat etmeniz yeterlidir; pasaportunuza herhangi bir fiziki etiket yapıştırılmaz."),
  ],
  faqs=[
   ("Dubai vizesi almak Abu Dabi veya Şarjah seyahatleri için de geçerli midir?", "Evet. Alınan e-vize Birleşik Arap Emirlikleri'nin tüm emirliklerinde (Dubai, Abu Dabi, Şarjah, Ajman, Fuceyre, Resül-Hayme, Ümmül-Kayveyn) geçerlidir. Her emirlik için ayrı vize alınmaz."),
   ("Dubai e-Vizesi kaç günde çıkar?", "Başvurular standart olarak 24 ila 48 saat içerisinde sonuçlanmaktadır. Ancak BAE'de cuma öğleden sonra, cumartesi ve pazar günlerinin resmi tatil/hafta sonu olduğu ve sistem incelemelerinin bu günlerde yavaşlayabileceği göz önünde bulundurulmalıdır."),
   ("Dubai vizesi onaylandıktan sonra ne kadar süre içinde kullanılmalıdır?", "Onaylanan e-vizenin geçerlilik süresi düzenlendiği tarihten itibaren 60 gündür. Vizeniz çıktıktan sonra 60 gün içinde BAE'ye giriş yapmanız gerekir. Giriş yaptıktan sonra vize tipinize göre (30 veya 60 gün) kalış süreniz başlar."),
   ("BAE vize başvurusunda parmak izi verilmesi veya konsolosluğa gidilmesi gerekiyor mu?", "Hayır. Başvuru aşamasında parmak izi verilmez ve konsolosluğa gidilmez. Biyometrik göz/yüz taraması yalnızca BAE havalimanına vardığınızda pasaport kontrol noktasında yapılır."),
   ("Yeşil (Hususi) Pasaport sahiplerinin Dubai'ye giderken vize alması gerekir mi?", "Hayır. Hususi (yeşil), Hizmet (gri) ve Diplomatik (siyah) pasaport sahibi T.C. vatandaşları 180 gün içinde 90 güne kadar BAE seyahatlerinde vizeden muaftır."),
   ("BAE e-Vizesi ile BAE'de yasal olarak çalışabilir miyim?", "Hayır. Turistik veya ticari e-vize ile BAE'de çalışmak kesinlikle yasaktır. BAE'de çalışabilmek için BAE merkezli bir şirketin size resmi Çalışma İzni (Work Permit) ve Oturum Vizesi (Residency Visa) çıkarması şarttır."),
   ("Tek başıma seyahat edecek 18-21 yaş arası gençlerin veya kadınların BAE vizesi alması zor mudur?", "BAE Göçmenlik Dairesi 18-21 yaş altı bireylerin tek başına seyahatlerinde sistem üzerinden ek güvenlik kontrolleri veya birinci derece akraba güvencesi talep edebilir. Bu yaş grubundaki kişilerin başvurularının dikkatle planlanması gerekir."),
   ("Dubai havalimanında aktarmam var, şehre çıkmak için vize almalı mıyım?", "Havalimanının transit alanından çıkmayıp yalnızca uçak değiştirecekseniz vizeye ihtiyacınız yoktur. Ancak havalimanından çıkıp şehre gezmeye gitmek veya bagajınızı alıp başka bir havayoluyla yeniden check-in yapmak istiyorsanız Transit Vize veya 30 Günlük Turistik Vize almanız gerekir."),
   ("BAE vizesi alırken banka hesap dökümü veya maaş bordrosu sunmak zorunda mıyım?", "Hayır. Standart BAE e-vize başvurularında konsolosluk tarzı banka dökümleri, tapu, çalışma belgeleri veya maaş bordroları talep edilmez. Başvuru tamamen pasaport ve fotoğraf ile yapılır."),
   ("BAE vize ihlali (Overstay) yapılırsa ne olur?", "Vizenizin izin verdiği kalış süresini (30 veya 60 gün) aşmanız durumunda BAE Göçmenlik Dairesi kaldığınız her fazla gün için sistem üzerinden ciddi para cezaları uygular. Ayrıca ceza ödenmeden ülkeden çıkışa izin verilmez ve sonraki başvurularınız için giriş yasağı koyulabilir."),
   ("BAE vize başvurum reddedilirse ödediğim harç iade edilir mi?", "Hayır. BAE Göçmenlik Dairesi (ICP/GDRFA) başvurunun incelenmesi aşamasında harcı tahsil eder. Başvurunun reddedilmesi durumunda ödenen vize ücretleri iade edilmez."),
   ("Sadece uçak bileti ve otel rezervasyonu ile BAE vizesi alınabilir mi?", "BAE e-Vize başvurusunda otel veya uçak bileti sunmak kural olarak zorunlu değildir; sadece pasaport ve fotoğraf yeterlidir. Ancak sınır kontrolü sırasında BAE polisinin dönüş biletinizi ve konaklayacağınız yeri sorma hakkı saklıdır."),
   ("Ülkeye giriş yaptıktan sonra vize süremi BAE'den çıkmadan uzatabilir miyim?", "Evet. BAE Göçmenlik Dairesi'nin sunduğu sistem sayesinde, 30 veya 60 günlük turistik vizenizi BAE dışına çıkış yapmadan (Inside Country Visa Change) ek harç ödeyerek uzatabilirsiniz."),
   ("Ad-soyad benzerliğinden dolayı vize onayının takılması (Blacklist / Security Check) nedir?", "BAE göçmenlik sistemi isim bazlı güvenlik taraması yapar. Adınız veya soyadınız BAE güvenlik listesindeki (kara liste) biriyle eşleşirse başvurunuz \"Security Check\"e düşer. Bu durumda ek kimlik doğrulamaları veya pasaport detayları talep edilebilir ve süreç birkaç gün uzayabilir."),
   ("Eski pasaportumdaki vize ile yeni pasaportumla BAE'ye giriş yapabilir miyim?", "Hayır. BAE e-vizeleri doğrudan başvuru yaptığınız pasaport numarasına dijital olarak tanımlanır. Pasaportunuzu yenilediyseniz eski pasaporttaki vizeyle seyahat edemezsiniz; yeni pasaport numaranızla sıfırdan e-vize almanız gerekir."),
  ]),

 dict(slug="cin", n="Çin", label="Çin Halk Cumhuriyeti",
  gi=[
   "Vize Zorunluluğu: Türkiye Cumhuriyeti umuma mahsus (bordo) pasaport sahipleri, Çin'e seyahat etmeden önce vize almak zorundadır.",
   "Vizeden Muaf Pasaportlar: Hususi (yeşil), hizmet (gri) ve diplomatik (siyah) pasaport sahipleri için vize uygulaması pasaport türüne ve seyahatin niteliğine göre değişebilmektedir. Seyahat öncesinde güncel vize muafiyeti koşullarının kontrol edilmesi gerekir.",
   "Doğru Başvuru Sistemi: Çin vize başvurusu, Çin Vize Başvuru Servis Merkezi'nin resmi platformu olan COAVS sistemi üzerinden online başvuru formunun eksiksiz doldurulmasıyla başlatılır.",
   "Başvuru Merkezi: Form onaylandıktan sonra yetkili Çin Vize Başvuru Merkezi (İstanbul veya Ankara) üzerinden randevu alınarak başvuru işlemleri tamamlanır.",
   "Ülkeye Giriş Yetkisi: Çin vizesi sahibi olmak ülkeye giriş garantisi vermez; nihai karar sınır kontrolü sırasında Çin makamları tarafından verilir.",
  ],
  gid="Çin vize başvurunuza başlamadan önce aşağıdaki temel bilgileri bilmeniz, süreci doğru planlamanıza yardımcı olacaktır.",
  vtd="Doğru vize türüne başvurmak, başvuru sürecinin en önemli adımlarından biridir. Çin'e yapacağınız seyahatin amacı, başvurmanız gereken vize türünü belirler.",
  vt=[
   ("Çin Turistik Vizesi (L Vizesi)", "Çin'e turistik gezi, kültürel seyahat veya bireysel ziyaret amacıyla gidecek kişilerin başvurabileceği vize türüdür."),
   ("Çin Ticari Vizesi (M Vizesi)", "Çin'de iş görüşmesi, fuar, ticari toplantı veya diğer ticari faaliyetlere katılacak kişilerin başvurabileceği vize türüdür."),
   ("Çin Çalışma Vizesi (Z Vizesi)", "Çin'de yasal olarak çalışacak kişilerin başvurması gereken vize türüdür."),
   ("Çin Öğrenci Vizesi (X1 / X2)", "Çin'de eğitim alacak öğrencilerin başvurabileceği vize türüdür. Eğitim süresine göre X1 veya X2 vizesi uygulanır."),
   ("Çin Aile Ziyareti Vizesi (Q1 / Q2)", "Çin vatandaşı veya Çin'de daimi ikamet eden aile üyelerini ziyaret edecek kişilerin başvurabileceği vize türüdür."),
  ],
  steps=[
   ("Vize Türünün Belirlenmesi", "Çin vize süreci, seyahat amacınıza uygun vize türünün belirlenmesi ve gerekli belgelerin hazırlanmasıyla başlar."),
   ("Online Form ve Onay", "COAVS sistemi üzerinden online başvuru formu eksiksiz doldurulur, gerekli bilgiler ve fotoğraf sisteme yüklenerek başvuru formunun onay süreci tamamlanır."),
   ("Randevu ve Evrak Teslimi", "Form onaylandıktan sonra yetkili Çin Vize Başvuru Merkezi üzerinden randevu alınır. Randevu tarihinde başvuru için hazırlanan fiziki evraklar teslim edilir ve gerekli biyometrik işlemler gerçekleştirilir."),
   ("Değerlendirme Süreci", "Başvuru dosyası, Çin'in ilgili konsolosluk makamları tarafından değerlendirilir."),
   ("Sonuç ve Pasaport Teslimi", "Başvurunun olumlu sonuçlanması halinde vize pasaportunuza işlenir ve pasaportunuz başvuru merkezi üzerinden teslim alınır."),
  ],
  faqs=[
   ("Çin vize başvurusunu ne kadar önce yapmalıyım?", "Çin vize başvurularında işlem süreleri dönemsel yoğunluğa ve başvuru türüne göre değişiklik gösterebilir. Seyahat planınızda aksama yaşamamak adına başvurunuzu planlanan seyahat tarihinden mümkün olduğunca önce başlatmanız tavsiye edilir."),
   ("Çin vizesi kaç günde sonuçlanır?", "Başvuruların sonuçlanma süresi başvuru türüne, konsolosluk yoğunluğuna ve seçilen işlem türüne göre değişebilir. Standart ve ekspres işlem seçenekleri bulunabilmektedir."),
   ("Çin vizesi için parmak izi vermem gerekir mi?", "Çin vize başvurularında biyometrik veri uygulaması başvuru sahibinin yaşına, vize türüne ve güncel muafiyet koşullarına göre değişiklik gösterebilir. Başvuru öncesinde güncel biyometrik uygulamanın kontrol edilmesi gerekir."),
   ("Çin vizesi için mülakata girmem gerekir mi?", "Standart başvurularda her başvuru sahibi için yüz yüze mülakat uygulanmaz. Ancak konsolosluk gerekli gördüğü durumlarda başvuru sahibini görüşmeye çağırabilir."),
   ("Çin vizesi için banka hesabımda ne kadar para bulunmalıdır?", "Çin vizesi için herkes açısından geçerli sabit bir banka bakiyesi bulunmamaktadır. Finansal belgelerin, seyahat masraflarınızı karşılayabilecek durumda olduğunuzu gösterecek şekilde hazırlanması önemlidir."),
   ("Çin vizesi için davetiye gerekli midir?", "Davetiye, başvurulan vize türüne göre değişiklik gösterir. Özellikle ticari (M) vize başvurularında Çin'deki davet eden kurum veya şirketten alınan davet mektubu başvuru dosyasının önemli belgelerinden biridir."),
   ("Çin'e turistik seyahat için hangi vizeye başvurmalıyım?", "Turistik amaçlı seyahatler için L Vizesi başvurusu yapılır. Seyahatinizin amacı ve planlanan kalış süresine göre uygun vize türü ve giriş sayısı belirlenir."),
   ("Çin'e fuar veya iş görüşmesi için hangi vizeyle gidebilirim?", "Fuar, iş görüşmesi, ticari toplantı ve benzeri ticari faaliyetler için M Vizesi başvurusu yapılır. Başvuru sırasında seyahat amacını destekleyen ticari belgelerin ve gerekli davetiyenin sunulması gerekebilir."),
   ("Hong Kong veya Makao'ya gidip Çin'e tekrar giriş yapacaksam vizem nasıl olmalı?", "Çin ana karasına tekrar giriş yapmayı planlıyorsanız vizenizin giriş sayısına dikkat etmeniz gerekir. Tek girişli bir Çin vizesiyle Çin'den çıktıktan sonra aynı vizeyle tekrar giriş yapılamaz. Seyahat planınıza göre çift veya çok girişli vize gerekebilir."),
   ("Eski pasaportumda geçerli Çin vizem varsa yeni pasaportumla seyahat edebilir miyim?", "Bu durum vizenin ve pasaportların durumuna göre değişebilir. Seyahat öncesinde eski pasaporttaki vizenin yeni pasaportla birlikte kullanılıp kullanılamayacağı Çin konsolosluk makamlarından teyit edilmelidir."),
   ("Çin vizesi reddedilirse tekrar başvuru yapabilir miyim?", "Evet. Ret sonrasında yeniden başvuru yapılabilir. Ancak yeni başvurudan önce önceki başvurunun ret gerekçelerinin değerlendirilmesi ve gerekli eksikliklerin giderilmesi önemlidir."),
   ("Çin vizesi ile ülkede izin verilen süreden fazla kalabilir miyim?", "Hayır. Çin vizesinde belirtilen izin verilen kalış süresinin aşılmaması gerekir. Seyahat planınızın vizenizde tanınan kalış süresiyle uyumlu olması önemlidir."),
  ]),

 dict(slug="ingiltere", n="İngiltere",
  gi=[
   "Vize Zorunluluğu: Türkiye Cumhuriyeti umuma mahsus (bordo) pasaport sahipleri, İngiltere'ye seyahat etmeden önce vize almak zorundadır.",
   "Vizeden Muaf Pasaportlar: Hususi (yeşil), hizmet (gri) ve diplomatik (siyah) pasaport sahipleri de dâhil olmak üzere tüm T.C. pasaport türleri İngiltere seyahatlerinde vizeye tabidir (İngiltere, Schengen vize muafiyet kurallarına dâhil değildir).",
   "Doğru Başvuru Sistemi: İngiltere vize başvurusu, doğrudan Birleşik Krallık Hükümeti'nin resmi platformu GOV.UK üzerinden çevrim içi (online) olarak başlatılmalıdır.",
   "Başvuru Merkezi: İngiltere vize başvuruları, GOV.UK üzerinden form tamamlandıktan sonra yetkilendirilmiş VFS Global başvuru merkezleri aracılığıyla kabul edilir.",
   "Ülkeye Giriş Yetkisi: İngiltere vizesi sahibi olmak, ülkeye giriş hakkının kesin olarak tanındığı anlamına gelmez. Nihai değerlendirme, sınır kontrolü sırasında Birleşik Krallık Sınır Muhafaza (UK Border Force) yetkilileri tarafından yapılır.",
  ],
  gid="İngiltere vize başvurunuza başlamadan önce aşağıdaki temel bilgileri bilmeniz, süreci doğru planlamanıza yardımcı olacaktır.",
  vtd="İngiltere'ye yapacağınız seyahatin amacı, başvurmanız gereken vize türünü belirler. Aşağıda İngiltere için en sık başvurulan vize türlerini inceleyebilirsiniz.",
  vt=[
   ("İngiltere Turistik Vizesi", "Tatil, gezi, kültürel etkinlikler ve bireysel seyahatler amacıyla İngiltere'ye gitmek isteyen kişilerin başvurabileceği Standart Ziyaretçi Vizesidir (Standard Visitor Visa)."),
   ("İngiltere Ticari Vizesi", "İş görüşmesi, şirket ziyareti, toplantı, konferans veya ticari etkinliklere katılım amacıyla yapılan seyahatler için başvurulan Standart Ziyaretçi Vizesidir."),
   ("İngiltere Aile ve Arkadaş Ziyareti Vizesi", "İngiltere'de yaşayan aile bireylerini, akrabaları veya arkadaşları ziyaret etmek isteyen kişilerin başvurabileceği Standart Ziyaretçi Vizesidir."),
   ("İngiltere Aile Birleşimi ve Yerleşim Vizesi", "İngiltere'de yasal olarak yaşayan veya İngiliz vatandaşı olan eş/aile bireylerinin yanına uzun süreli yerleşim amacıyla başvurulan yerleşim (Family / Spouse Visa) vizesidir."),
   ("İngiltere Öğrenci Vizesi (Student / Short-term Student)", "İngiltere'de üniversite eğitimi, dil kursu veya diğer eğitim programlarına katılacak kişilerin başvurabileceği öğrenci vizesi türüdür."),
   ("İngiltere Çalışma Vizesi (Vasıflı Çalışan - Skilled Worker)", "İngiltere'de bir işveren tarafından sponsorluk lisansı ile istihdam edilmek isteyen kişilerin başvurabileceği puan tabanlı çalışma vizesidir."),
   ("İngiltere Transit Vizesi", "İngiltere üzerinden başka bir ülkeye aktarmalı geçiş yapacak ve transit vizeye tabi olan yolcuların başvurabileceği vize türüdür."),
   ("İngiltere Tıbbi Tedavi Vizesi", "İngiltere'deki özel veya resmi sağlık kuruluşlarında tıbbi tedavi görmek amacıyla başvurulan özel ziyaretçi vizesidir."),
  ],
  steps=[
   ("Vize Türünün Belirlenmesi", "İngiltere vize başvurusu, seyahat amacınıza uygun vize türünün belirlenmesiyle başlar."),
   ("Online Form ve Belge Yükleme", "GOV.UK portalı üzerinden resmi başvuru formu İngilizce olarak doldurulur, vize harcı ödenir ve seyahat planınızı destekleyen belgeler dijital ortama (PDF) yüklenir."),
   ("Biyometrik İşlemler", "Randevu tarihinde VFS Global başvuru merkezinde biyometrik işlemler (fotoğraf ve parmak izi) gerçekleştirilir. İngiltere vize başvurularında daha önce vize alınmış olsa dahi her başvuruda yeniden parmak izi verilmesi zorunludur."),
   ("Değerlendirme Süreci", "Başvuru dosyanız teslim edildikten sonra İngiltere İçişleri Bakanlığı (Home Office) tarafından değerlendirme süreci başlar. Konsolosluk gerekli gördüğü durumlarda ek belge talep edebilir."),
   ("Sonuç ve Pasaport Teslimi", "Değerlendirme tamamlandığında pasaportunuz başvuru merkezi aracılığıyla teslim edilir. Vizenizin onaylanması halinde pasaportunuz içerisinde vize etiketiyle birlikte teslim edilir; başvurunun olumsuz sonuçlanması halinde ise ret gerekçesini içeren karar formu ile birlikte pasaportunuz tarafınıza iade edilir."),
  ],
  faqs=[
   ("İngiltere vize başvurusunu ne kadar önce yapmalıyım?", "İngiltere vize başvuruları, planlanan seyahat tarihinden en erken 3 ay önce yapılabilir. Randevu yoğunlukları ve değerlendirme süresi göz önünde bulundurulduğunda, başvurunuzu seyahatinizden en az 6-8 hafta önce tamamlamanız tavsiye edilir. Özellikle yaz sezonunda ve resmi tatil dönemlerinde randevu bulmak zorlaşabileceğinden başvurunuzu mümkün olduğunca erken planlamanız önerilir."),
   ("İngiltere vizesi kaç günde sonuçlanır?", "Standart İngiltere vize başvuruları, başvuru merkezindeki biyometrik randevu tarihinden itibaren ortalama 15 iş günü (3 hafta) içerisinde sonuçlandırılır. Ek belge talep edilmesi veya detaylı incelemeye alınması durumunda bu süre uzayabilir. Ayrıca ek harç ödenerek sunulan ekspres vize (Priority veya Super Priority) hizmetleriyle süreci kısaltmak mümkündür."),
   ("İngiltere vize ücreti ne kadardır?", "Vize ücretleri; başvurulan vize türüne, talep edilen vize süresine (6 ay, 2 yıl, 5 yıl, 10 yıl) ve tercih edilecek ek hizmetlere (ekspres vize, VIP hizmetler vb.) göre değişiklik göstermektedir. Güncel başvuru harçları ve hizmet bedelleri hakkında detaylı bilgi almak için ekibimizle iletişime geçebilirsiniz."),
   ("İngiltere vizesi için banka hesabımda ne kadar para bulunmalıdır?", "İngiltere Konsolosluğu tarafından belirlenmiş sabit ve resmi bir minimum banka bakiyesi bulunmamaktadır. Hesabınızda, seyahat süreniz boyunca ulaşım, konaklama ve kişisel harcamalarınızı karşılamaya yetecek tutarın bulunması beklenir. En kritik husus; hesabınızdaki paranın kaynağının düzenli geliriniz ve sunduğunuz evraklarla %100 uyumlu, şeffaf ve açıklanabilir olmasıdır."),
   ("İngiltere vizesi için pasaportumun en az kaç ay geçerliliği olmalıdır?", "İngiltere için pasaportunuzun, seyahatiniz boyunca ve İngiltere'de kalmayı planladığınız süre boyunca geçerli olması yeterlidir. Schengen vizelerindeki gibi dönüş sonrası ek 3 ay şartı aranmaz. Ancak pasaportunuzda en az 1 adet boş vize sayfası bulunması zorunludur."),
   ("İngiltere vizesi için parmak izi vermem gerekir mi?", "Evet, İngiltere vize başvurularında biyometrik veri (parmak izi ve dijital fotoğraf) verilmesi zorunludur. Daha önce Schengen veya İngiltere vizesi için parmak izi vermiş olsanız bile, her yeni İngiltere başvurusunda VFS Global merkezine şahsen giderek biyometrik işlemlerinizi tekrarlamanız gerekir."),
   ("Evraklarımı başvuru merkezine götürmem gerekiyor mu, yoksa internetten mi yükleniyor?", "İngiltere vize sisteminde tüm destekleyici belgeler randevu gününden önce sisteme dijital (PDF) olarak yüklenir. Randevu günü başvuru merkezine fiziki dosya taşımak yerine yalnızca pasaportunuz ve randevu onay belgeniz ile gitmeniz yeterlidir."),
   ("Geçerli bir Schengen vize geçmişimin olması İngiltere vize şansımı artırır mı?", "Evet. Daha önce Schengen ülkelerine, ABD'ye veya Kanada'ya yapılmış ve kurallara uygun şekilde tamamlanmış seyahatler, İngiltere başvurunuzda \"güvenilir seyahat geçmişi\" olarak olumlu değerlendirilir ve dosyanızı güçlendirir."),
   ("Birleşik Krallık vizesi ile İskoçya, Galler veya Kuzey İrlanda'ya seyahat edebilir miyim?", "Evet. Alacağınız Birleşik Krallık vizesi ile İngiltere, İskoçya, Galler ve Kuzey İrlanda'nın tamamına ek bir vizeye ihtiyaç duymadan seyahat edebilirsiniz."),
   ("İngiltere vizesi ile Schengen ülkelerine seyahat edebilir miyim?", "Hayır, İngiltere Schengen Alanı'na veya Avrupa Birliği'ne dâhil değildir. İngiltere vizesi ile Schengen ülkelerine (Almanya, Fransa, İtalya vb.) giriş yapamazsınız. Bu ülkelere seyahat edebilmek için ayrıca Schengen vizesi almanız gerekmektedir."),
   ("İngiltere vizesi ne kadar süreyle verilir?", "İngiltere turistik/ziyaretçi vizeleri standart olarak en az 6 aylık ve çok girişli (Multiple Entry) olarak verilir. Düzenli seyahat geçmişi bulunan kişilere konsolosluk değerlendirmesine bağlı olarak 2 yıllık, 5 yıllık veya 10 yıllık uzun süreli vizeler de verilebilmektedir."),
   ("İngiltere vize başvuruları en çok hangi nedenlerle reddedilir?", "İngiltere vize başvurularındaki en yaygın ret nedenleri; banka hesabındaki açıklanamayan düzensiz/yüksek para girişleri, kaynağı belgelenmeyen finansal birikimler, başvuru sahibinin Türkiye'deki sosyo-ekonomik bağlarının yetersiz görülmesi ve seyahat amacının inandırıcı bulunmamasıdır."),
   ("İngiltere vize başvurum reddedilirse tekrar başvuru yapabilir miyim?", "İngiltere vize başvurunuzun reddedilmesi yeniden başvuru yapmanıza engel değildir. Ancak ret mektubundaki gerekçeler detaylıca analiz edilip, eksiklikler tam olarak giderilmeden yapılan tekrar başvurular yeniden ret ile sonuçlanabilir. Bu nedenle yeni başvurunun ret gerekçelerine yanıt veren güçlü bir dosya ile yapılması kritik önem taşır."),
  ]),

 dict(slug="irlanda", n="İrlanda",
  gi=[
   "Vize Zorunluluğu: Türkiye Cumhuriyeti umuma mahsus (bordo) pasaport sahipleri, İrlanda'ya seyahat etmeden önce vize almak zorundadır.",
   "Vizeden Muaf Pasaportlar: Hususi (yeşil), hizmet (gri) ve umuma mahsus (bordo) pasaport sahipleri de dâhil olmak üzere T.C. pasaport sahipleri İrlanda seyahatlerinde vizeye tabidir. (İrlanda, Schengen vize muafiyet kurallarına dâhil değildir).",
   "Doğru Başvuru Sistemi: İrlanda vize başvurusu, doğrudan İrlanda Göçmenlik Makamı'nın resmi çevrim içi sistemi AVATS üzerinden başlatılmalıdır.",
   "Başvuru Merkezi: İrlanda vize başvuruları, AVATS formu tamamlandıktan sonra yetkilendirilmiş VFS Global başvuru merkezleri aracılığıyla kabul edilir.",
   "Ülkeye Giriş Yetkisi: İrlanda vizesi sahibi olmak, ülkeye giriş hakkının kesin olarak tanındığı anlamına gelmez. Nihai değerlendirme, sınır kontrolü sırasında İrlanda Sınır Kontrol yetkilileri tarafından yapılır.",
  ],
  gid="İrlanda vize başvurunuza başlamadan önce aşağıdaki temel bilgileri bilmeniz, süreci doğru planlamanıza yardımcı olacaktır.",
  vtd="Doğru vize türüne başvurmak, başvuru sürecinin en önemli adımlarından biridir. İrlanda'ya yapacağınız seyahatin amacı, başvurmanız gereken vize türünü belirler.",
  vt=[
   ("İrlanda Turistik Vizesi", "Tatil, gezi, kültürel etkinlikler ve bireysel seyahatler amacıyla İrlanda'ya gitmek isteyen kişilerin başvurabileceği Kısa Süreli Ziyaretçi Vizesidir (Short Stay 'C' Tourist Visa)."),
   ("İrlanda Ticari Vizesi", "İş görüşmesi, şirket ziyareti, toplantı veya konferans katılımı amacıyla yapılan seyahatler için başvurulan Kısa Süreli Ticari Vizedir (Short Stay 'C' Business Visa)."),
   ("İrlanda Aile ve Arkadaş Ziyareti Vizesi", "İrlanda'da yaşayan aile bireylerini veya arkadaşları ziyaret etmek isteyen kişilerin başvurabileceği ziyaret vizesidir (Visit Friend / Family)."),
   ("İrlanda Öğrenci Vizesi", "İrlanda'da dil eğitimi (özellikle İngilizce dil okulları) veya üniversite/yükseköğrenim programlarına katılacak kişilerin süresine göre ('C' veya 'D' tipi) başvuracağı eğitim vizesidir."),
   ("İrlanda Aile Birleşimi Vizesi", "İrlanda'da yasal olarak yaşayan veya İrlanda vatandaşı olan kişilerin aile üyelerinin yanına yerleşmesi için başvurulan uzun süreli ('D' tipi Join Family) vizedir."),
   ("İrlanda Çalışma Vizesi", "İrlanda'da bir işverenden kabul almış ve yetkili makamlardan çalışma izni (Employment Permit) alınmış kişilerin başvurabileceği uzun süreli ('D' tipi) vizedir."),
   ("İrlanda Transit Vizesi", "İrlanda üzerinden başka bir ülkeye aktarmalı geçiş yapacak ve transit vizeye tabi olan yolcuların başvurabileceği vize türüdür."),
  ],
  steps=[
   ("Vize Türünün Belirlenmesi", "İrlanda vize başvurusu, seyahat amacınıza uygun vize türünün belirlenmesiyle başlar."),
   ("AVATS Formu ve Randevu", "AVATS portalı üzerinden resmi başvuru formu İngilizce olarak doldurulur. Ardından sistemin sunduğu özet belgesi ve dilekçe hazırlanarak VFS Global merkezinden randevu alınır."),
   ("Evrak Teslimi", "Randevu tarihinde başvuru merkezinde fiziki evrak dosyası ve pasaport teslim edilir. İrlanda konsolosluk prosedürleri gereği başvurularda belgelerin asılları ve Türkçe belgelerin İngilizce tercümeleri dosyaya eklenir."),
   ("Değerlendirme Süreci", "Başvuru dosyanız teslim edildikten sonra Ankara İrlanda Büyükelçiliği / İrlanda Göçmenlik Makamı tarafından değerlendirme süreci başlar. Konsolosluk gerekli gördüğü durumlarda ek belge veya mülakat talep edebilir."),
   ("Sonuç ve Pasaport Teslimi", "Değerlendirme tamamlandığında pasaportunuz başvuru merkezi aracılığıyla teslim edilir. Vizenizin onaylanması halinde pasaportunuz içerisinde vize etiketiyle birlikte teslim edilir; başvurunun olumsuz sonuçlanması halinde ise ret gerekçesini içeren karar formu ile birlikte pasaportunuz tarafınıza iade edilir."),
  ],
  faqs=[
   ("İrlanda vize başvurusunu ne kadar önce yapmalıyım?", "İrlanda vize başvuruları, planlanan seyahat tarihinden en erken 3 ay önce yapılabilir. Konsolosluk inceleme süreleri ve randevu yoğunlukları göz önünde bulundurulduğunda, başvurunuzu seyahatinizden en az 6-8 hafta önce tamamlamanız önemle tavsiye edilir."),
   ("İrlanda vizesi kaç günde sonuçlanır?", "İrlanda vize başvurularının değerlendirme süresi vize türüne ve dönemsel yoğunluğa göre değişmekle birlikte, standart turistik başvurular için ortalama 15-20 iş günü (3-4 hafta) sürmektedir. Uzun süreli veya çalışma/eğitim vizelerinde bu süre uzayabilir."),
   ("İrlanda vize ücreti ne kadardır?", "Vize ücretleri; başvurulan vize türüne (Tek girişli 'C', Çok girişli 'C' veya Uzun dönem 'D' tipi) ve tercih edilecek ek hizmetlere göre değişiklik göstermektedir. Güncel başvuru harçları ve hizmet bedelleri hakkında detaylı bilgi almak için ekibimizle iletişime geçebilirsiniz."),
   ("İrlanda vizesi için banka hesabımda ne kadar para bulunmalıdır?", "İrlanda Konsolosluğu sabit bir tutar ilan etmemekle birlikte, son 6 aylık banka dökümünüzde seyahat masraflarınızı karşılayacak miktarın bulunmasını ister. En kritik kural; hesaptaki paranın aniden yatırılmamış olması, kaynağının şeffaf, düzenli gelirinize dayalı ve belgelenebilir olmasıdır."),
   ("İrlanda vizesi için pasaportumun en az kaç ay geçerliliği olmalıdır?", "İrlanda başvurularında pasaportunuzun, planlanan seyahat bitiş (dönüş) tarihinizden itibaren en az 6 ay daha geçerli olması ve en az 2 adet boş vize sayfasının bulunması zorunludur."),
   ("İrlanda vizesi için parmak izi vermem gerekir mi?", "İrlanda vize sisteminde şu an için standart biyometrik parmak izi verisi alınmamaktadır; ancak evrak teslimi ve pasaport kontrolü için başvuru sahibinin veya yetkili temsilcisinin VFS Global merkezine şahsen başvurması gerekmektedir."),
   ("Evraklarımı başvuru merkezine götürmem gerekiyor mu, yoksa internetten mi yükleniyor?", "İrlanda başvuru sürecinde AVATS formu online doldurulduktan sonra, hazırlanan tüm evrakların ve pasaportun asıllarının/fotokopilerinin randevu gününde fiziki olarak VFS Global başvuru merkezine teslim edilmesi gerekmektedir."),
   ("Geçerli bir Schengen veya İngiltere vize geçmişimin olması İrlanda vize şansımı artırır mı?", "Evet. Daha önce Schengen alanına, İngiltere'ye, ABD'ye veya Kanada'ya yapılmış ve kurallara uygun tamamlanmış seyahatler, seyahat geçmişinizi kanıtladığı için İrlanda vize dosyanızı oldukça güçlü kılar."),
   ("Birleşik Krallık (İngiltere) vizesi veya Schengen vizesi ile İrlanda'da seyahat edebilir miyim?", "İrlanda Schengen Alanı'na dâhil değildir, bu nedenle Schengen vizesi ile İrlanda'ya giriş yapılamaz. Ancak İngiltere ile İrlanda arasındaki özel muafiyet programı (BIVS - British-Irish Visa Scheme) kapsamında, belirli şartları taşıyan ve üzerinde 'BIVS' ibaresi bulunan İngiltere vizeleriyle (önce İngiltere'ye giriş yapmak kaydıyla) İrlanda'ya geçiş mümkündür. Standart vizelerde ise ayrı İrlanda vizesi alınmalıdır."),
   ("İrlanda vizesi ne kadar süreyle verilir?", "İlk kez başvuran kişilere genellikle seyahat tarihlerini kapsayan tek girişli (Single Entry) vize verilir. Düzenli seyahat geçmişi ve haklı gerekçeleri olan başvuru sahiplerine konsolosluk takdirine bağlı olarak çok girişli (Multiple Entry) vizeler de tanımlanabilmektedir."),
   ("İrlanda vize başvuruları en çok hangi nedenlerle reddedilir?", "En sık karşılaşılan ret nedenleri; banka hesabındaki paranın kaynağının belgelenememesi/son dakika toplu para yatırılması, Türkiye'ye geri dönüleceğine dair bağların inandırıcı bulunmaması, seyahat amacının tam açıklanamaması ve eksik/hatalı belge sunulmasıdır."),
   ("İrlanda vize başvurum reddedilirse tekrar başvuru yapabilir miyim?", "Evet. Ret kararı sonrasında eksiklikler giderilerek yeniden başvuru yapılabileceği gibi, kararın tebliğ edilmesinden itibaren belirtilen süre içerisinde (genellikle 2 ay) ret kararına itiraz etme (Appeal) hakkınız da bulunmaktadır."),
   ("Kuzey İrlanda'ya (Belfast) seyahat etmek için İrlanda vizesi yeterli midir?", "Hayır. Kuzey İrlanda (Belfast), Birleşik Krallık (İngiltere) toprağıdır. İrlanda Cumhuriyeti (Dublin) vizesi ile Kuzey İrlanda'ya geçiş yapılamaz. Kuzey İrlanda seyahati için İngiltere vizesi alınması zorunludur."),
  ]),

 dict(slug="kanada", n="Kanada",
  gi=[
   "Vize Zorunluluğu: Türkiye Cumhuriyeti umuma mahsus (bordo) pasaport sahipleri, Kanada'ya seyahat etmeden önce vize almak zorundadır.",
   "Vizeden Muaf Pasaportlar: Hususi (yeşil), hizmet (gri) ve diplomatik (siyah) pasaport sahipleri de dâhil olmak üzere tüm T.C. pasaport türleri Kanada seyahatlerinde vizeye tabidir.",
   "Doğru Başvuru Sistemi: Kanada vize başvurusu, Kanada Hükümeti'nin resmi platformu olan IRCC Portal üzerinden dijital olarak başlatılır ve tüm belgeler sisteme online olarak yüklenir.",
   "Başvuru Merkezi: Başvuru internetten tamamlandıktan sonra biyometrik işlemler (parmak izi ve fotoğraf) yetkilendirilmiş VFS Global Kanada Vize Başvuru Merkezleri aracılığıyla yapılır.",
   "Ülkeye Giriş Yetkisi: Kanada vizesi sahibi olmak, ülkeye giriş hakkının kesin olarak tanındığı anlamına gelmez. Nihai değerlendirme, havalimanındaki sınır kontrolü sırasında Kanada Sınır Hizmetleri Ajansı (CBSA) memurları tarafından yapılır.",
  ],
  gid="Kanada vize başvurunuza başlamadan önce aşağıdaki temel bilgileri bilmeniz, süreci doğru planlamanıza yardımcı olacaktır.",
  vtd="Doğru vize türüne başvurmak, başvuru sürecinin en önemli adımlarından biridir. Kanada'ya yapacağınız seyahatin amacı, başvurmanız gereken vize türünü belirler.",
  vt=[
   ("Kanada Turistik Vizesi (Visitor Visa / TRV)", "Tatil, gezi, kültürel etkinlikler ve bireysel seyahatler amacıyla Kanada'ya gitmek isteyen kişilerin başvurabileceği Geçici İkamet Vizesidir."),
   ("Kanada Ticari Vizesi (Business Visitor)", "İş görüşmesi, konferans, fuar katılımı veya ticari toplantılar amacıyla yapılan seyahatler için başvurulan ziyaretçi vizesidir."),
   ("Kanada Aile ve Arkadaş Ziyareti Vizesi", "Kanada'da yasal olarak oturan aile bireylerini veya arkadaşları ziyaret etmek amacıyla yapılan başvurulardır."),
   ("Kanada Öğrenci Vizesi ve Öğrenim İzni (Study Permit)", "Kanada'da 6 aydan kısa süreli dil okulları için standart ziyaretçi vizesi; 6 aydan uzun süren dil okulu, kolej veya üniversite eğitimleri için ise Öğrenim İzni (Study Permit) alınmalıdır."),
   ("Kanada Çalışma İzni (Work Permit)", "Kanada'daki bir işverenden onaylı iş teklifi (LMIA) alan veya açık çalışma izni kategorilerine uyan kişilerin başvurabileceği izin türüdür."),
   ("Kanada Süper Vize (Super Visa)", "Kanada vatandaşlarının veya daimi ikamet edenlerin (Permanent Resident) ebeveynleri ve büyükanne/büyükbabaları için verilen, 10 yıla kadar geçerli ve tek girişte 5 yıla kadar kalış imkânı sunan özel vize türüdür."),
   ("Kanada Transit Vizesi", "Kanada havalimanları üzerinden başka bir üçüncü ülkeye aktarmalı geçiş yapacak yolcuların alması gereken vize türüdür."),
  ],
  steps=[
   ("Vize Türünün Belirlenmesi", "Kanada vize başvurusu, seyahat amacınıza uygun vize türünün belirlenmesiyle başlar."),
   ("IRCC Formları ve Belge Yükleme", "IRCC portalı üzerinden resmi başvuru formları eksiksiz doldurulur, seyahat planınızı ve Türkiye'ye geri döneceğinizi kanıtlayan tüm belgeler dijital ortama (PDF) yüklenir ve vize harcı ödenir."),
   ("Biyometrik İşlemler", "Başvuru yüklendikten sonra IRCC tarafından Biyometrik Talep Mektubu (Biometric Instruction Letter) düzenlenir. Bu mektupla VFS Global merkezinden randevu alınarak parmak izi ve fotoğraf işlemleri tamamlanır."),
   ("Değerlendirme Süreci", "Değerlendirme süreci doğrudan Kanada Göçmenlik Makamı (IRCC) tarafından yürütülür."),
   ("Sonuç ve Pasaport Teslimi", "Başvurunun onaylanması durumunda pasaport talep mektubu (Passport Submission Letter) iletilir ve pasaport basım için VFS Global aracılığıyla konsolosluğa gönderilir."),
  ],
  faqs=[
   ("Kanada vize başvurusunu ne kadar önce yapmalıyım?", "Kanada vize inceleme süreleri dönemsel olarak ve dosya yoğunluğuna göre değişebilmektedir. Seyahat planınızda aksama yaşamamak adına başvurunuzu planlanan seyahat tarihinizden en az 2-3 ay önce başlatmanız tavsiye edilir."),
   ("Kanada vizesi kaç günde sonuçlanır?", "Biyometrik verilerin verilmesinin ardından standart ziyaretçi vizesi başvuruları ortalama 4 ila 8 hafta içerisinde sonuçlanmaktadır. Yoğun dönemlerde veya ek inceleme gerektiren durumlarda bu süre uzayabilir."),
   ("Kanada vize ücreti ne kadardır?", "Vize ücretleri; başvurulan vize türüne (Ziyaretçi vizesi, Öğrenim/Çalışma izni), biyometrik veri ücretine ve tercih edilecek ek hizmetlere göre değişiklik göstermektedir. Güncel başvuru harçları ve hizmet bedellerimiz hakkında detaylı bilgi almak için ekibimizle iletişime geçebilirsiniz."),
   ("Kanada vizesi için banka hesabımda ne kadar para bulunmalıdır?", "Kanada Konsolosluğu sabit bir tutar ilan etmez. Ancak hesabınızda uçak bileti, konaklama ve günlük harcamalarınızı rahatlıkla karşılayacak tutarda bakiye bulunmalıdır. Paranın kaynağının düzenli gelirinize dayanması ve hesaba son dakika kaynağı belirsiz toplu para yatırılmamış olması en kritik kuraldır."),
   ("Kanada vizesi için pasaportumun en az kaç ay geçerliliği olmalıdır?", "Pasaportunuzun planlanan seyahat süresini kapsayacak geçerlilikte olması yeterlidir. Ancak Kanada vizeleri genellikle pasaport süresinin bitim tarihine kadar verildiği için, uzun süreli vize alabilmek adına pasaport sürenizin olabildiğince uzun (örneğin 10 yıllık) olması büyük avantaj sağlar."),
   ("Kanada vizesi ne kadar süreyle verilir?", "Kanada vizeleri kural olarak çok girişli (Multiple Entry) ve başvuru sahibinin mevcut pasaportunun geçerlilik süresinin son gününe kadar (en fazla 10 yıla kadar) verilir."),
   ("Kanada vizesi için parmak izi vermem gerekir mi?", "Evet. Kanada vize başvurularında biyometrik veri (parmak izi ve fotoğraf) verilmesi zorunludur. Verilen biyometrik veriler 10 yıl boyunca geçerlidir; son 10 yıl içinde Kanada için parmak izi verdiyseniz yeni başvuruda tekrar vermeniz gerekmez."),
   ("Evraklarımı başvuru merkezine götürmem gerekiyor mu, yoksa internetten mi yükleniyor?", "Kanada vize başvurusunda tüm destekleyici belgeler internet üzerinden (IRCC Portal) dijital olarak yüklenir. Başvuru merkezine (VFS Global) yalnızca biyometrik işlem (parmak izi) vermek ve vize onaylandıktan sonra pasaportunuzu teslime etmek için gidilir."),
   ("Kanada vize mülakatı yapılıyor mu?", "Hayır, Kanada vize başvurularında standart olarak yüz yüze mülakat yapılmaz. Tüm değerlendirme sisteme yüklenen dijital belgeler ve niyet mektubu üzerinden gerçekleştirilir. Konsolosluk çok istisnai durumlarda mülakat talep edebilir."),
   ("Geçerli bir ABD vizesinin olması Kanada vize başvurusunu etkiler mi?", "Evet. Geçerli bir ABD vizesine sahip olmak veya son 10 yıl içinde Kanada/ABD vizesi almış olmak başvuru sürecinizi kolaylaştırır (CAN+ Programı kapsamına girebilirsiniz) ve finansal evrak yükünüzü hafifleterek onay şansınızı artırabilir."),
   ("Akrabalarımdan veya arkadaşlarımdan davetiye gelmesi vize almamı garantiler mi?", "Hayır. Davetiye tek başına vize garantisi sağlamaz. Önemli olan davet eden kişinin Kanada'daki yasal statüsü ile başvuru sahibinin Türkiye'ye olan bağlarını ve seyahat masraflarını nasıl karşılayacağını eksiksiz belgelemesidir."),
   ("Kanada vize başvuruları en çok hangi nedenlerle reddedilir?", "En yaygın ret gerekçeleri; başvuru sahibinin Türkiye'deki finansal ve ailevi bağlarının yetersiz görülmesi (ülkesine geri döneceğine ikna olunmaması), seyahat amacının inandırıcı bulunmaması, banka hesabındaki paranın kaynağının belgelenememesi ve eksik/çelişkili belge sunulmasıdır."),
   ("Kanada vize başvurum reddedilirse tekrar başvuru yapabilir miyim?", "Evet. Ret gerekçelerini ayrıntılı olarak gösteren GCMS Notları (Global Case Management System) talep edilip ret nedeni tam olarak analiz edildikten sonra, eksiklikler giderilerek yeniden başvuru yapılabilir."),
   ("Kanada vizesi alıp Amerika'ya, ya da ABD vizesiyle Kanada'ya kara yoluyla geçebilir miyim?", "Kanada vizesi ile ABD'ye giriş yapılamaz, iki ülke bağımsız vize rejimlerine sahiptir. Aynı şekilde yalnızca ABD vizeniz olması Kanada'ya geçiş hakkı tanımaz. İki ülke arasında (kara veya hava yoluyla) geçiş yapabilmek için her iki ülkenin de geçerli vizesine sahip olmanız gerekir."),
   ("Sadece dil okuluna gitmek için vize alıp orada çalışabilir miyim?", "Hayır. Kanada'da dil eğitimi (ESL/FSL) alan öğrencilerin haftalık yarı zamanlı çalışma izni (Work Permit) hakkı yoktur. Çalışma izni hakkı yalnızca devlet kolejleri veya üniversitelerde tam zamanlı akademik eğitim alan öğrencilere tanınır."),
  ]),
]

SCHENGEN_BOLGESI = dict(slug="schengen", n="Schengen Bölgesi",
  gi_title="Schengen Vizesinin Temel Kuralları",
  gi=[
   "Schengen Bölgesi: Schengen Bölgesi, üye ülkeler arasındaki iç sınır kontrollerinin kaldırıldığı ve ortak vize kurallarının uygulandığı 29 Avrupa ülkesinden oluşur.",
   "Vize Zorunluluğu: Umuma Mahsus (Bordo) pasaport sahiplerinin, Schengen Bölgesi'ne yapacakları 90 güne kadar olan kısa süreli seyahatler için Schengen vizesi almaları gerekir.",
   "Vizeden Muaf Pasaportlar: Hususi (Yeşil), Hizmet (Gri) ve Diplomatik (Siyah) pasaport sahipleri, 180 günlük dönem içinde 90 günü aşmayan kısa süreli seyahatlerinde Schengen vizesinden muaftır.",
   "90/180 Kuralı: Kısa süreli Schengen seyahatlerinde, herhangi bir 180 günlük dönem içinde Schengen Bölgesi'nde toplam 90 günden fazla kalamazsınız. Bu süre, Schengen Bölgesi'ne yaptığınız tüm giriş ve çıkışlar birlikte değerlendirilerek hesaplanır.",
   "Başvuru Ülkesi: Schengen vize başvurunuzu, seyahatinizin ana destinasyonu olan ülkenin yetkili makamlarına yapmanız gerekir. Birden fazla Schengen ülkesini ziyaret edecekseniz, genel olarak en uzun süre kalacağınız ülke esas alınır. Birden fazla ülkede eşit süre kalmanız durumunda ise ilk giriş yapacağınız ülkeye başvurmanız gerekir.",
  ],
  gid="Schengen vizesi başvurularında ortak Schengen kuralları uygulanır. Başvurunuza başlamadan önce aşağıdaki temel bilgileri gözden geçirmenizi öneririz.",
  vt_title="Hangi Schengen Vize Türüne Başvurmalısınız?",
  vtd="Schengen vizeleri, 90 güne kadar olan kısa süreli seyahatler için düzenlenen C Tipi vizelerdir. Seyahat amacınıza göre başvurmanız gereken kategori değişir. 90 günü aşan eğitim, çalışma veya yerleşim gibi amaçlarda ise Schengen vizesi değil, seyahat edeceğiniz ülkenin ulusal D Tipi vizesine başvurmanız gerekir.",
  summary="Turistik, ticari ve aile ziyareti gibi 90 güne kadar olan kısa süreli seyahatler için tek vizeyle Schengen Bölgesi'ndeki 29 ülkeye seyahat edebilirsiniz.",
  vt=[
   ("Turistik Vize (C Tipi)", "Gezi, tatil ve bireysel seyahat amacıyla yapılan kısa süreli başvurular için düzenlenen C Tipi Schengen vizesidir. Seyahat süresi, vizenin geçerlilik tarihleri ve izin verilen kalış süresi başvurunun değerlendirilmesine göre belirlenir."),
   ("Ticari Vize (C Tipi)", "İş görüşmeleri, şirket ziyaretleri, toplantılar, fuarlar ve ticari organizasyonlara katılım amacıyla yapılan kısa süreli seyahatler için düzenlenen C Tipi Schengen vizesidir."),
   ("Aile Ziyareti Vizesi (C Tipi)", "Schengen Bölgesi'nde yaşayan aile bireylerini veya yakınlarını ziyaret etmek amacıyla yapılan kısa süreli seyahatler için başvurulan C Tipi Schengen vizesidir. Başvurunun niteliğine göre davetiye ve ziyaret edilen kişiye ilişkin ek belgeler talep edilebilir."),
   ("Transit Vize (C Tipi)", "Schengen Bölgesi üzerinden başka bir ülkeye seyahat ederken transit geçiş için vizeye ihtiyaç duyan yolcuların başvurduğu vize türüdür. Transit vize gerekliliği, seyahat güzergâhına ve yolcunun vatandaşlığına göre değişebilir."),
   ("Fuar, Kongre ve Etkinlik Vizesi (C Tipi)", "Fuar, kongre, konferans, kültürel, bilimsel veya sportif etkinliklere katılmak amacıyla yapılan kısa süreli seyahatler için başvurulan C Tipi Schengen vizesidir."),
   ("Öğrenci Vizesi (D Tipi Ulusal Vize)", "90 günü aşan eğitim programlarına katılmak veya uzun süreli eğitim amacıyla ilgili ülkede bulunmak isteyen kişilerin başvurması gereken ulusal D Tipi vizedir."),
   ("Çalışma Vizesi (D Tipi Ulusal Vize)", "İlgili ülkede uzun süreli çalışmak isteyen kişilerin başvurması gereken ulusal D Tipi vizedir. Başvuru koşulları ve gerekli belgeler ülkeye göre değişiklik gösterir."),
   ("Aile Birleşimi Vizesi (D Tipi Ulusal Vize)", "İlgili ülkede yasal olarak yaşayan aile bireylerinin yanına uzun süreli yerleşmek isteyen kişilerin başvurduğu ulusal D Tipi vizedir. Başvuru şartları ülkenin ulusal mevzuatına göre belirlenir."),
  ],
  steps=[
   ("Vize Türünü Belirleyin", "Schengen vize başvurusu, seyahat amacının ve vize türünün belirlenmesiyle başlar."),
   ("Başvuru Ülkesini Seçin", "Doğru başvuru ülkesinin seçilmesi gerekir; başvuru, seyahatinizin ana destinasyonu olan ülkenin yetkili makamlarına yapılır."),
   ("Belgeleri Hazırlayın", "Gerekli belgeler hazırlanır. Başvuru şartları ve prosedürler, başvuracağınız ülkeye göre değişebilir."),
   ("Randevu ve Biyometri İşlemlerini Tamamlayın", "Randevu ve biyometri işlemlerinin tamamlanması gerekir."),
   ("Başvurunuzu Teslim Edin", "Hazırlanan başvuru dosyası yetkili başvuru kanalı aracılığıyla teslim edilir."),
   ("Sonucu Bekleyin", "Başvurunun değerlendirilmesi aşaması ile süreç tamamlanır."),
  ],
  faqs=[
   ("Schengen vize başvurusunu ne kadar önce yapmalıyım?", "Schengen vize başvurunuzu, planlanan seyahat tarihinizden en erken 6 ay önce ve kural olarak en geç 15 takvim günü önce yapabilirsiniz. Ancak 15 günlük süre başvuruyu son dakikaya bırakmak için güvenli bir zaman aralığı değildir. Randevu bulunabilirliği, resmî tatiller ve başvurunun değerlendirme süresinin uzayabilmesi nedeniyle başvurunuzu daha erken yapmanız önerilir. Normal değerlendirme süresi 15 gün olmakla birlikte, gerekli durumlarda 45 güne kadar uzayabilir."),
   ("Schengen vizesi kaç günde sonuçlanır?", "Schengen vize başvuruları, normal şartlarda başvurunun yetkili makama ulaştığı tarihten itibaren 15 takvim günü içinde sonuçlandırılır. Başvurunun daha ayrıntılı incelenmesi veya ek belge talep edilmesi halinde bu süre 45 güne kadar uzayabilir."),
   ("Schengen vize ücreti ne kadar?", "Schengen vize harcı ve başvuru sırasında ödenebilecek hizmet bedelleri zaman içinde değişebilir. Güncel ücretler, başvuru yapılacak ülkeye ve yetkili başvuru merkezine göre kontrol edilmelidir."),
   ("Schengen vizesi için banka hesabımda ne kadar para bulunmalıdır?", "Schengen vizesi için tüm ülkeler açısından geçerli tek bir minimum banka bakiyesi bulunmaz. Gerekli finansal yeterlilik, başvurulan ülkenin belirlediği günlük geçim tutarı, seyahat süresi ve konaklama gibi unsurlara göre değerlendirilir. Hesabınızdaki bakiyenin seyahat masraflarınızı karşılayabilecek düzeyde olması ve gelir durumunuzla uyumlu olması gerekir."),
   ("Schengen vizesi için pasaportumun en az kaç ay geçerliliği olmalıdır?", "Pasaportunuzun, Schengen Bölgesi'nden planlanan çıkış tarihinizden sonra en az 3 ay daha geçerli olması gerekir. Ayrıca pasaportunuzun son 10 yıl içinde düzenlenmiş ve en az 2 boş sayfasının bulunması gerekir."),
   ("Schengen vizesi için parmak izi vermem gerekir mi?", "Schengen vize başvurularında parmak izi alınması ve biyometrik veri kaydedilmesi genel olarak zorunludur. Ancak daha önce Schengen vizesi başvurusu sırasında parmak izi verdiyseniz ve bu biyometrik veriler 59 ay içinde yeniden kullanılabiliyorsa tekrar parmak izi vermeniz gerekmeyebilir."),
   ("Schengen vizesi ile tüm Schengen ülkelerine seyahat edebilir miyim?", "Evet. Schengen vizesi, vizenizin geçerlilik alanı, giriş sayısı ve izin verilen kalış süresi dahilinde Schengen Bölgesi'ndeki ülkelere seyahat etmenize olanak tanır."),
   ("İlk girişimi vizeyi aldığım ülkeden yapmak zorunda mıyım?", "Hayır. Schengen vizesi aldığınız ülkeden giriş yapmanız genel olarak zorunlu değildir. Ancak seyahat planınızın, vize başvurusu sırasında sunduğunuz bilgilerle uyumlu olması ve başvuru yaptığınız ülkenin seyahatinizin ana destinasyonu olması gerekir."),
   ("Tek girişli ve çok girişli Schengen vizesi arasındaki fark nedir?", "Tek girişli (Single Entry) Schengen vizesi, Schengen Bölgesi'ne bir kez giriş yapmanıza izin verir. Bölgeden çıktıktan sonra vizenizin geçerlilik süresi devam etse bile aynı vizeyle yeniden giriş yapamazsınız. Çok girişli (Multiple Entry) Schengen vizesi ise vizenin geçerlilik süresi ve izin verilen kalış süresi içinde Schengen Bölgesi'ne birden fazla giriş ve çıkış yapmanıza olanak tanır."),
   ("Schengen vize başvuruları en çok hangi nedenlerle reddedilir?", "Schengen vize başvuruları; seyahat amacının yeterince kanıtlanmaması, sunulan belgelerde eksiklik veya tutarsızlık bulunması, yeterli maddi imkânın gösterilememesi ya da başvuru sahibinin seyahat sonunda ülkesine döneceğine ilişkin yeterli kanaat oluşmaması gibi nedenlerle reddedilebilir. Ret gerekçesi, her başvurunun kendi koşulları değerlendirilerek belirlenir."),
   ("Schengen vize başvurum reddedilirse tekrar başvuru yapabilir miyim?", "Evet. Schengen vize başvurunuzun reddedilmesi, yeniden başvuru yapmanıza engel değildir. Ancak yeni bir başvuru yapmadan önce ret gerekçesini değerlendirmeniz ve önceki başvuruda yetersiz veya eksik görülen hususları gidermeniz önemlidir."),
  ])

OTHER.append(SCHENGEN_BOLGESI)


# ---------------------------------------------------------------- derleyici

def build_schengen(c):
    n, dat, loc, abl = c["n"], c["dat"], c["loc"], c["abl"]

    def f(s):
        return (s.replace("{N}", n).replace("{DAT}", dat)
                 .replace("{LOC}", loc).replace("{ABL}", abl))

    zorunlu = c.get("zorunlu") or f(GI_ZORUNLU_KISA if c.get("zorunlu_kisa") else GI_ZORUNLU)
    gi = [zorunlu, c.get("muaf", GI_MUAF), c.get("ulke", GI_ULKE),
          c["merkez"], c.get("giris", GI_GIRIS)]

    vt = []
    for i, (t, d) in enumerate(VT_TEMPLATE):
        title = c.get("vt_titles", {}).get(i) or f(t)
        desc = c.get("vt_over", {}).get(i) or f(d)
        vt.append((title, desc))

    if c.get("baltic"):
        steps = baltic_steps(n, c.get("baltic_eval"), c.get("baltic_appt"))
        if c.get("baltic_first"):
            steps[0] = (steps[0][0], c["baltic_first"])
        if c.get("baltic_form"):
            steps[1] = (steps[1][0], c["baltic_form"])
        if c.get("baltic_last"):
            steps[4] = (steps[4][0], c["baltic_last"])
        faq_bodies = baltic_faq(n, dat, loc, abl, c.get("faq_over"))
    elif c.get("steps"):
        steps = c["steps"]
        faq_bodies = {i: (c.get("faq_over", {}).get(i) or f(a)) for i, (_, a) in enumerate(FAQ_TEMPLATE)}
    else:
        steps = []
        for i, (t, d) in enumerate(STEPS_TEMPLATE):
            desc = c.get("steps_over", {}).get(i) or f(d).replace("{AUTH}", c.get("auth", "Konsolosluk veya yetkili makamlar"))
            steps.append((t, desc))
        faq_bodies = {i: (c.get("faq_over", {}).get(i) or f(a)) for i, (_, a) in enumerate(FAQ_TEMPLATE)}

    faqs = [(f(qq), faq_bodies[i]) for i, (qq, _) in enumerate(FAQ_TEMPLATE)]

    return dict(slug=c["slug"], gi=gi, gid=f(GI_DESC),
                vtd=c.get("vtd") or f(VTD), vt=vt, steps=steps, faqs=faqs)


ALL = [build_schengen(c) for c in SCHENGEN] + OTHER

# ---------------------------------------------------------------- SQL

out = ["-- VizeMakinesi — ülke içerik seed'i (PDF rehberlerinden üretildi)",
       "-- Supabase SQL Editor'e yapıştırıp çalıştırın. Tekrar çalıştırmak güvenlidir.",
       "BEGIN;", ""]

for c in ALL:
    slug = c["slug"]
    out.append(f"-- ===== {slug} " + "=" * (60 - len(slug)))
    out.append("UPDATE countries SET")
    out.append("  general_info = " + arr(c["gi"]) + ",")
    out.append("  general_info_description = " + q(c["gid"]) + ",")
    out.append("  visa_types_description = " + q(c["vtd"]) + ("," if any(k in c for k in ("gi_title", "vt_title", "summary")) else ""))
    extras = []
    if "gi_title" in c:
        extras.append("  general_info_title = " + q(c["gi_title"]))
    if "vt_title" in c:
        extras.append("  visa_types_title = " + q(c["vt_title"]))
    if "summary" in c:
        extras.append("  summary = " + q(c["summary"]))
    out.append(",\n".join(extras))
    out.append(f"WHERE slug = {q(slug)};")
    out.append("")
    for table in ("country_visa_types", "country_process_steps", "country_faqs"):
        out.append(f"DELETE FROM {table} WHERE country_id = (SELECT id FROM countries WHERE slug = {q(slug)});")
    out.append("")
    out.append("INSERT INTO country_visa_types (country_id, title, description, sort_order) VALUES")
    out.append(",\n".join(
        f"  ((SELECT id FROM countries WHERE slug = {q(slug)}), {q(t)}, {q(d)}, {i})"
        for i, (t, d) in enumerate(c["vt"])) + ";")
    out.append("")
    out.append("INSERT INTO country_process_steps (country_id, title, description, sort_order) VALUES")
    out.append(",\n".join(
        f"  ((SELECT id FROM countries WHERE slug = {q(slug)}), {q(t)}, {q(d)}, {i})"
        for i, (t, d) in enumerate(c["steps"])) + ";")
    out.append("")
    out.append("INSERT INTO country_faqs (country_id, question, answer, sort_order) VALUES")
    out.append(",\n".join(
        f"  ((SELECT id FROM countries WHERE slug = {q(slug)}), {q(qq)}, {q(a)}, {i})"
        for i, (qq, a) in enumerate(c["faqs"])) + ";")
    out.append("")

out.append("COMMIT;")

import os
path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "seed_countries.sql")
with open(path, "w", encoding="utf-8") as fh:
    fh.write("\n".join(out))

print(f"{len(ALL)} ülke yazıldı -> {path}")
for c in ALL:
    print(f"  {c['slug']:<14} vize türü: {len(c['vt'])}  adım: {len(c['steps'])}  SSS: {len(c['faqs'])}")
