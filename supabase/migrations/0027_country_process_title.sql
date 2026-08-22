-- "Vize İşlemleri nasıl yapılır?" bölümü artık diğer bölümler gibi
-- tek bir bölüm başlığı + bölüm açıklaması ile yönetiliyor. Başlığın sabit
-- ikinci satırı ("nasıl yapılır?") kaldırıldı; başlığın tamamı adminden yazılır.
alter table countries add column if not exists process_title text;

update countries
   set process_title = name || ' Vize İşlemleri Nasıl Yapılır?'
 where process_title is null;

-- Schengen sayfasındaki bölüm de aynı düzene geçti: sabit ikinci satır kaldırıldı,
-- başlığın tamamı tek alanda yazılıyor. Giriş cümlesi (process_lead) artık kullanılmıyor.
update schengen_page
   set process_title = process_title || ' Nasıl Yapılır?'
 where process_title not ilike '%nasıl yapılır%';
