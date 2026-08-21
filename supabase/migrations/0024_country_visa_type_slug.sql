-- Ülkeye özel vize türlerini /vize-turleri kataloğuna bağlar.
-- Katalog eşlemesi karta ikon, "Tip C" rozeti ve vize türü sayfasına link verir.
alter table country_visa_types add column visa_type_slug text;

-- Mevcut satırların başlıklarından katalog eşlemesi (yalnızca Tip C türleri).
update country_visa_types set visa_type_slug = 'turistik-vize'
  where visa_type_slug is null and title ilike '%turist%';
update country_visa_types set visa_type_slug = 'ticari-vize'
  where visa_type_slug is null and title ilike '%ticar%';
update country_visa_types set visa_type_slug = 'transit-vize'
  where visa_type_slug is null and title ilike '%transit%';
update country_visa_types set visa_type_slug = 'aile-ziyareti-vizesi'
  where visa_type_slug is null and title ilike '%aile ziyaret%';
update country_visa_types set visa_type_slug = 'fuar-kulturel-etkinlik-konferans-vizesi'
  where visa_type_slug is null
    and (title ilike '%fuar%' or title ilike '%konferans%' or title ilike '%etkinlik%');

-- D Tipi (uzun süreli) satırlar kaldırılır: ülke sayfasındaki kartlarda
-- yalnızca kısa süreli (Tip C) vizeler gösterilir.
delete from country_visa_types
 where title ilike '%aile birleşim%'
    or title ilike '%öğrenci%'
    or title ilike '%çalışma%'
    or title ilike '%ulusal%'
    or title ilike '%d tipi%';

-- Yalnızca kaldırılan /vize-turleri/[countrySlug] sayfasının kullandığı sütunlar.
alter table countries drop column if exists visa_types_description;
alter table countries drop column if exists visa_types_hero_description;
