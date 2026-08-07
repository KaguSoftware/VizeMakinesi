-- /vize-turleri/[countrySlug] sayfasının hero bölümünde, "← Tüm vize türleri"
-- bağlantısının altında görünen açıklama. Ülkeye özgü vize türleri hakkında
-- kısa bilgi verir. Boş bırakılırsa hiç gösterilmez.
ALTER TABLE countries
  ADD COLUMN IF NOT EXISTS visa_types_hero_description text;
