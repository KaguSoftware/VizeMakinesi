-- ============================================================
-- ÜLKE BLOGLARI: tek sayfa → kapak + makaleler
--
-- Ülke blog sayfaları da Schengen rehberiyle aynı yapıya geçer:
--   /blog/<ülke>                 → kapak sayfası, makaleleri listeler
--   /blog/<ülke>/<makale-slug'ı> → makalenin kendi sayfası
--
-- Makale sayısı sabit değildir; /admin/blog/<ülke> ekranından eklenip
-- çıkarılır. İçerik `countries` satırında iki yeni sütunda tutulur:
--
--   blog_excerpt  — kapak sayfasının hero'sundaki özet
--   blog_articles — [{
--                     "slug", "kicker", "title", "excerpt",
--                     "intro": [...],
--                     "subsections": [{ "heading", "quote", "quote_en",
--                                       "paragraphs", "bullets" }]
--                   }]
--
-- `has_tourism` yayın bayrağı, `tourism_hero_image_url` kapak görseli olarak
-- kullanılmaya devam eder. Eski `tourism_intro / tourism_highlights /
-- tourism_tips / tourism_best_time` sütunları artık sayfada gösterilmez;
-- aşağıdaki dönüşüm içeriklerini ilk makaleye taşır. Sütunlar veri kaybı
-- riskine karşı düşürülmez, yalnızca kullanımdan kalkar.
--
-- Yönetim: /admin/blog
-- ============================================================
ALTER TABLE countries
  ADD COLUMN IF NOT EXISTS blog_excerpt  text  NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS blog_articles jsonb NOT NULL DEFAULT '[]'::jsonb;

-- ============================================================
-- DÖNÜŞÜM — mevcut turizm içeriği tek bir makaleye taşınır.
--
-- Idempotent: yalnızca makalesi olmayan ve turizm içeriği bulunan
-- satırlara dokunur, böylece migration yeniden çalıştırıldığında
-- admin düzenlemeleri ezilmez.
--
-- Oluşan makale:
--   başlık      "<Ülke> Gezi Rehberi"
--   giriş       tourism_intro
--   alt başlık  "Kaçırmamanız gereken yerler"  → tourism_highlights
--   alt başlık  "Pratik tavsiyeler"            → tourism_tips
--   alt başlık  "En iyi ziyaret zamanı"        → tourism_best_time
--
-- Slug PostgreSQL tarafında üretilir; Türkçe harfler tek tek eşlenir
-- (unaccent eklentisi "ı" ve "İ" harflerini doğru çeviremez).
-- ============================================================
UPDATE countries SET
  blog_excerpt = COALESCE(NULLIF(blog_excerpt, ''), COALESCE(tourism_intro[1], '')),
  blog_articles = jsonb_build_array(
    jsonb_build_object(
      'slug', trim(both '-' from regexp_replace(
        lower(translate(name || ' gezi rehberi',
                        'ıİşŞğĞüÜöÖçÇÂâÎîÛû',
                        'iisSgGuUoOcCAaIiUu')),
        '[^a-z0-9]+', '-', 'g')),
      'kicker', 'Gezi rehberi',
      'title', name || ' Gezi Rehberi',
      'excerpt', COALESCE(tourism_intro[1], ''),
      'intro', to_jsonb(COALESCE(tourism_intro, ARRAY[]::text[])),
      'subsections', (
        SELECT COALESCE(jsonb_agg(s), '[]'::jsonb) FROM (
          SELECT jsonb_build_object(
            'heading', 'Kaçırmamanız gereken yerler',
            'quote', '', 'quote_en', '',
            'paragraphs', '[]'::jsonb,
            'bullets', to_jsonb(tourism_highlights)
          ) AS s
          WHERE COALESCE(array_length(tourism_highlights, 1), 0) > 0
          UNION ALL
          SELECT jsonb_build_object(
            'heading', 'Pratik tavsiyeler',
            'quote', '', 'quote_en', '',
            'paragraphs', '[]'::jsonb,
            'bullets', to_jsonb(tourism_tips)
          )
          WHERE COALESCE(array_length(tourism_tips, 1), 0) > 0
          UNION ALL
          SELECT jsonb_build_object(
            'heading', 'En iyi ziyaret zamanı',
            'quote', '', 'quote_en', '',
            'paragraphs', jsonb_build_array(tourism_best_time),
            'bullets', '[]'::jsonb
          )
          WHERE COALESCE(tourism_best_time, '') <> ''
        ) AS subs
      )
    )
  )
WHERE blog_articles = '[]'::jsonb
  AND COALESCE(array_length(tourism_intro, 1), 0) > 0;
