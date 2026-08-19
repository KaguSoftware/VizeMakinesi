-- ============================================================
-- BLOG — SCHENGEN REHBERİ (/blog/schengen-vize-alma-rehberi)
--
-- Sayfanın tüm metinleri tek satırda tutulur (id = 1).
-- `sections` jsonb'i rehber dokümanındaki dört ana yazıyı
-- (kırmızı başlıklar) sırayla taşır:
--
--   [{
--     "kicker": "Ret gerekçeleri",
--     "title":  "Schengen Vize Reddi Nedenleri",
--     "intro":  ["giriş paragrafı", ...],
--     "subsections": [{
--       "heading":    "1. Seyahat Amacının ...",
--       "quote":      "",            -- ret kararındaki Türkçe ifade
--       "quote_en":   "",            -- İngilizce orijinali
--       "paragraphs": ["...", ...],
--       "bullets":    ["...", ...]
--     }]
--   }]
--
-- Satır boş bırakılabilir: yükleyici (src/lib/data/blogSchengenPage.ts)
-- boş alanlar için src/data/blogSchengen.ts içindeki varsayılan
-- metinlere düşer. /admin/blog/schengen ekranındaki ilk kayıt bu
-- varsayılanları tabloya yazar.
--
-- Yönetim: /admin/blog/schengen
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_schengen_page (
  id              smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),

  hero_kicker     text NOT NULL DEFAULT '',
  hero_title      text NOT NULL DEFAULT '',
  hero_title_em   text NOT NULL DEFAULT '',
  hero_excerpt    text NOT NULL DEFAULT '',

  sections        jsonb NOT NULL DEFAULT '[]'::jsonb,

  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE blog_schengen_page ENABLE ROW LEVEL SECURITY;

-- schengen_page ile aynı politika biçimi: herkes okur, admin yazar.
CREATE POLICY "public_select_blog_schengen_page"
  ON blog_schengen_page FOR SELECT USING (true);

CREATE POLICY "admin_insert_blog_schengen_page"
  ON blog_schengen_page FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE POLICY "admin_update_blog_schengen_page"
  ON blog_schengen_page FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

-- Idempotent: satır zaten varsa dokunulmaz, admin düzenlemeleri ezilmez.
INSERT INTO blog_schengen_page (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;
