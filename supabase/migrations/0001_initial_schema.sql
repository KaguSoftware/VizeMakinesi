-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- HELPER: updated_at trigger function
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE countries (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                    text UNIQUE NOT NULL,
  name                    text NOT NULL,
  flag_emoji              text,
  flag_type               text CHECK (flag_type IN ('preset', 'image')),
  flag_preset_key         text,
  flag_image_url          text,
  visa_type               text,
  summary                 text,
  mosaic_visible          bool NOT NULL DEFAULT true,
  mosaic_order            int,
  mosaic_span             text,
  has_tourism             bool NOT NULL DEFAULT false,
  tourism_intro           text[],
  tourism_highlights      text[],
  tourism_tips            text[],
  tourism_best_time       text,
  tourism_hero_image_url  text,
  created_at              timestamptz NOT NULL DEFAULT NOW(),
  updated_at              timestamptz NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_countries_updated_at
  BEFORE UPDATE ON countries
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE country_requirements (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id  uuid NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  text        text NOT NULL,
  sort_order  int NOT NULL DEFAULT 0
);

CREATE TABLE country_handles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id  uuid NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  text        text NOT NULL,
  sort_order  int NOT NULL DEFAULT 0
);

CREATE TABLE country_faqs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id  uuid NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  question    text NOT NULL,
  answer      text NOT NULL,
  sort_order  int NOT NULL DEFAULT 0
);

CREATE TABLE mega_menu_categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  sort_order  int NOT NULL DEFAULT 0,
  visible     bool NOT NULL DEFAULT true
);

CREATE TABLE mega_menu_items (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id  uuid NOT NULL REFERENCES mega_menu_categories(id) ON DELETE CASCADE,
  country_id   uuid NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  sort_order   int NOT NULL DEFAULT 0,
  visible      bool NOT NULL DEFAULT true
);

CREATE TABLE marquee_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location    text NOT NULL CHECK (location IN ('home', 'nav_ticker')),
  text        text NOT NULL,
  url         text,
  visible     bool NOT NULL DEFAULT true,
  sort_order  int NOT NULL DEFAULT 0
);

CREATE TABLE marquee_settings (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location  text UNIQUE NOT NULL CHECK (location IN ('home', 'nav_ticker')),
  enabled   bool NOT NULL DEFAULT true
);

CREATE TABLE partnerships (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  eyebrow      text,
  description  text,
  logo_url     text,
  external_url text,
  visible      bool NOT NULL DEFAULT true,
  sort_order   int NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE team_members (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  initials   text NOT NULL,
  role       text NOT NULL,
  photo_url  text,
  visible    bool NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE admin_profiles (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      text NOT NULL,
  name       text,
  created_at timestamptz NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TRIGGER: limit marquee_items to 12 per location
-- ============================================================
CREATE OR REPLACE FUNCTION check_marquee_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM marquee_items WHERE location = NEW.location) >= 12 THEN
    RAISE EXCEPTION 'Cannot have more than 12 marquee items for location "%"', NEW.location;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_marquee_limit
  BEFORE INSERT ON marquee_items
  FOR EACH ROW EXECUTE FUNCTION check_marquee_limit();

-- ============================================================
-- RLS: enable on all tables
-- ============================================================
ALTER TABLE countries              ENABLE ROW LEVEL SECURITY;
ALTER TABLE country_requirements   ENABLE ROW LEVEL SECURITY;
ALTER TABLE country_handles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE country_faqs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE mega_menu_categories   ENABLE ROW LEVEL SECURITY;
ALTER TABLE mega_menu_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE marquee_items          ENABLE ROW LEVEL SECURITY;
ALTER TABLE marquee_settings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE partnerships           ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members           ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles         ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES: public-facing tables
-- ============================================================

-- Helper: is caller an admin?
-- We inline the check to avoid a separate function for clarity.

-- countries
CREATE POLICY "public_select_countries"
  ON countries FOR SELECT USING (true);

CREATE POLICY "admin_insert_countries"
  ON countries FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE POLICY "admin_update_countries"
  ON countries FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE POLICY "admin_delete_countries"
  ON countries FOR DELETE
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

-- country_requirements
CREATE POLICY "public_select_country_requirements"
  ON country_requirements FOR SELECT USING (true);

CREATE POLICY "admin_insert_country_requirements"
  ON country_requirements FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE POLICY "admin_update_country_requirements"
  ON country_requirements FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE POLICY "admin_delete_country_requirements"
  ON country_requirements FOR DELETE
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

-- country_handles
CREATE POLICY "public_select_country_handles"
  ON country_handles FOR SELECT USING (true);

CREATE POLICY "admin_insert_country_handles"
  ON country_handles FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE POLICY "admin_update_country_handles"
  ON country_handles FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE POLICY "admin_delete_country_handles"
  ON country_handles FOR DELETE
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

-- country_faqs
CREATE POLICY "public_select_country_faqs"
  ON country_faqs FOR SELECT USING (true);

CREATE POLICY "admin_insert_country_faqs"
  ON country_faqs FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE POLICY "admin_update_country_faqs"
  ON country_faqs FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE POLICY "admin_delete_country_faqs"
  ON country_faqs FOR DELETE
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

-- mega_menu_categories
CREATE POLICY "public_select_mega_menu_categories"
  ON mega_menu_categories FOR SELECT USING (true);

CREATE POLICY "admin_insert_mega_menu_categories"
  ON mega_menu_categories FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE POLICY "admin_update_mega_menu_categories"
  ON mega_menu_categories FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE POLICY "admin_delete_mega_menu_categories"
  ON mega_menu_categories FOR DELETE
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

-- mega_menu_items
CREATE POLICY "public_select_mega_menu_items"
  ON mega_menu_items FOR SELECT USING (true);

CREATE POLICY "admin_insert_mega_menu_items"
  ON mega_menu_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE POLICY "admin_update_mega_menu_items"
  ON mega_menu_items FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE POLICY "admin_delete_mega_menu_items"
  ON mega_menu_items FOR DELETE
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

-- marquee_items
CREATE POLICY "public_select_marquee_items"
  ON marquee_items FOR SELECT USING (true);

CREATE POLICY "admin_insert_marquee_items"
  ON marquee_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE POLICY "admin_update_marquee_items"
  ON marquee_items FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE POLICY "admin_delete_marquee_items"
  ON marquee_items FOR DELETE
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

-- marquee_settings
CREATE POLICY "public_select_marquee_settings"
  ON marquee_settings FOR SELECT USING (true);

CREATE POLICY "admin_insert_marquee_settings"
  ON marquee_settings FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE POLICY "admin_update_marquee_settings"
  ON marquee_settings FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE POLICY "admin_delete_marquee_settings"
  ON marquee_settings FOR DELETE
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

-- partnerships
CREATE POLICY "public_select_partnerships"
  ON partnerships FOR SELECT USING (true);

CREATE POLICY "admin_insert_partnerships"
  ON partnerships FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE POLICY "admin_update_partnerships"
  ON partnerships FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE POLICY "admin_delete_partnerships"
  ON partnerships FOR DELETE
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

-- team_members
CREATE POLICY "public_select_team_members"
  ON team_members FOR SELECT USING (true);

CREATE POLICY "admin_insert_team_members"
  ON team_members FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE POLICY "admin_update_team_members"
  ON team_members FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE POLICY "admin_delete_team_members"
  ON team_members FOR DELETE
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

-- admin_profiles: own row select only; all writes blocked (service role only)
CREATE POLICY "own_select_admin_profiles"
  ON admin_profiles FOR SELECT
  USING (auth.uid() = id);
