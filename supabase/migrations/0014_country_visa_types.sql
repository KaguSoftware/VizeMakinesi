-- ============================================================
-- COUNTRY VISA TYPES
-- The "Hangi Vize Türüne Başvurmalısınız?" section of
-- /vize/[countrySlug]: an accordion of visa types where each
-- row's title is the clickable heading and the description is
-- revealed on click. Editable per country from the admin panel.
-- When a country has no rows here, the section is not rendered.
-- ============================================================
CREATE TABLE IF NOT EXISTS country_visa_types (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id   uuid NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  title        text NOT NULL,
  description  text NOT NULL,
  sort_order   int NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS country_visa_types_country_idx
  ON country_visa_types (country_id, sort_order);

ALTER TABLE country_visa_types ENABLE ROW LEVEL SECURITY;

-- Same policy shape as country_process_steps: public read, admin write.
CREATE POLICY "public_select_country_visa_types"
  ON country_visa_types FOR SELECT USING (true);

CREATE POLICY "admin_insert_country_visa_types"
  ON country_visa_types FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE POLICY "admin_update_country_visa_types"
  ON country_visa_types FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE POLICY "admin_delete_country_visa_types"
  ON country_visa_types FOR DELETE
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

-- Section chrome. All nullable: the site falls back to its default title and
-- lead, and hides the description when it is empty. The "Vize türlerini
-- detaylı inceleyin" link is a constant in the component, not editable.
ALTER TABLE countries
  ADD COLUMN IF NOT EXISTS visa_types_title text,
  ADD COLUMN IF NOT EXISTS visa_types_lead text,
  ADD COLUMN IF NOT EXISTS visa_types_description text;
