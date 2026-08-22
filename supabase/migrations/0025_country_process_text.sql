-- "… Vize İşlemleri nasıl yapılır?" bölümünün sağ sütunu artık numaralı adım
-- listesi yerine admin panelinden yazılan tek bir paragraf gösteriyor.
alter table countries add column if not exists process_text text;

-- Mevcut adımlar paragrafa taşınır; metin adminde yeniden düzenlenebilir.
-- country_process_steps tablosu geri dönüş ihtimaline karşı silinmiyor.
update countries c
   set process_text = sub.text
  from (
    select country_id,
           string_agg(title || ': ' || description, ' ' order by sort_order) as text
      from country_process_steps
     group by country_id
  ) sub
 where sub.country_id = c.id
   and c.process_text is null;
