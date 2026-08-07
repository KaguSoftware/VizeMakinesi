-- ============================================================
-- CONSULTATION REQUEST TYPE
-- The /danisma-al form now serves two flows:
--   'vize'        — standard visa consultation (country + travel dates)
--   'hizlandirma' — ABD (US) visa appointment expedite. No country; the two
--                   dates mean "current appointment date" → "desired date".
-- Existing rows predate the toggle, so they are all 'vize'.
-- ============================================================
ALTER TABLE consultation_requests
  ADD COLUMN request_type text NOT NULL DEFAULT 'vize';

ALTER TABLE consultation_requests
  ADD CONSTRAINT consultation_requests_request_type_check
  CHECK (request_type IN ('vize', 'hizlandirma'));

-- The admin panel filters by type, newest first.
CREATE INDEX consultation_requests_type_idx
  ON consultation_requests (request_type, created_at DESC);
