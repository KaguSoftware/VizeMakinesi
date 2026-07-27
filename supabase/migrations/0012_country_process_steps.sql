-- ============================================================
-- COUNTRY PROCESS STEPS
-- The numbered steps shown on the right side of the
-- "{Ülke} Vize İşlemleri nasıl yapılır?" section of
-- /vize/[countrySlug]. Editable per country from the admin panel.
-- When a country has no rows here, the page falls back to the
-- shared default steps hardcoded in the component.
-- ============================================================
CREATE TABLE IF NOT EXISTS country_process_steps (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id   uuid NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  title        text NOT NULL,
  description  text NOT NULL,
  sort_order   int NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS country_process_steps_country_idx
  ON country_process_steps (country_id, sort_order);

ALTER TABLE country_process_steps ENABLE ROW LEVEL SECURITY;

-- Same policy shape as country_faqs: public read, admin write.
CREATE POLICY "public_select_country_process_steps"
  ON country_process_steps FOR SELECT USING (true);

CREATE POLICY "admin_insert_country_process_steps"
  ON country_process_steps FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE POLICY "admin_update_country_process_steps"
  ON country_process_steps FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE POLICY "admin_delete_country_process_steps"
  ON country_process_steps FOR DELETE
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));
