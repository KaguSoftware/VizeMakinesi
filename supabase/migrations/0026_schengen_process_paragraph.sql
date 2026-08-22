-- "Schengen Vize Başvurusu Nasıl Yapılır?" bölümü artık ülke sayfalarındaki
-- (BasvuruSureci) düzeni kullanıyor: solda başlık + italik giriş cümlesi,
-- sağda tek paragraf ve altında "Süreci Detaylı İnceleyin" bağlantısı.
--
-- Sağdaki paragraf mevcut `process_description` sütunundan gelir; sol sütunun
-- italik cümlesi için yeni `process_lead` eklenir. `process_steps` artık
-- kullanılmıyor, geri dönüş ihtimaline karşı silinmiyor.
alter table schengen_page add column if not exists process_lead text not null default '';

update schengen_page
   set process_lead = 'İlk görüşmeden pasaport teslimine kadar her adımı biz yönetiyoruz. Hiçbir ayrıntı gözden kaçmaz.'
 where id = 1
   and coalesce(process_lead, '') = '';

-- Başlık artık ülke sayfalarındaki gibi iki satır: buradaki metin 1. satırdır,
-- altındaki italik "nasıl yapılır?" satırı bileşende sabittir.
update schengen_page
   set process_title = 'Schengen Vize İşlemleri'
 where id = 1
   and process_title = 'Schengen Vize Başvurusu Nasıl Yapılır?';
