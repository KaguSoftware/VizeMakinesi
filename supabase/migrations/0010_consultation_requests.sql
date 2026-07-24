-- ============================================================
-- CONSULTATION REQUESTS
-- Submissions from the public /danisma-al form. Public (anon) may
-- INSERT; only admins (rows in admin_profiles) may read/update/delete.
-- Streamed live into the admin panel via Realtime.
-- ============================================================
CREATE TABLE consultation_requests (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name    text NOT NULL,
  last_name     text NOT NULL,
  email         text NOT NULL,
  phone         text NOT NULL,
  country       text,
  country_emoji text,
  travel_date   text,
  return_date   text,
  contact_pref  text NOT NULL,          -- 'whatsapp' | 'email' | 'phone'
  note          text,
  is_read       boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT NOW()
);

ALTER TABLE consultation_requests ENABLE ROW LEVEL SECURITY;

-- Public site inserts (anon + authenticated). No public read.
CREATE POLICY "public_insert_consultation_requests"
  ON consultation_requests FOR INSERT
  WITH CHECK (true);

-- Admins read/update/delete (same pattern as every other admin policy).
CREATE POLICY "admin_select_consultation_requests"
  ON consultation_requests FOR SELECT
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE POLICY "admin_update_consultation_requests"
  ON consultation_requests FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE POLICY "admin_delete_consultation_requests"
  ON consultation_requests FOR DELETE
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE INDEX consultation_requests_created_at_idx
  ON consultation_requests (created_at DESC);
CREATE INDEX consultation_requests_unread_idx
  ON consultation_requests (is_read, created_at DESC);

-- Realtime: stream INSERT/UPDATE/DELETE to the admin panel.
ALTER PUBLICATION supabase_realtime ADD TABLE consultation_requests;
ALTER TABLE consultation_requests REPLICA IDENTITY FULL;
