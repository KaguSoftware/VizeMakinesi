-- ============================================================
-- RATE LIMITS
-- Sliding-window throttle for public, unauthenticated writes
-- (currently only the /danisma-al consultation form).
--
-- One row per accepted request. `bucket` is an opaque key chosen by
-- the caller — e.g. 'danisma-al:ip:1.2.3.4'. Nothing here is readable
-- by the public: the table is locked down and all access goes through
-- the SECURITY DEFINER function below.
-- ============================================================
CREATE TABLE rate_limit_hits (
  id         bigserial PRIMARY KEY,
  bucket     text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX rate_limit_hits_bucket_idx
  ON rate_limit_hits (bucket, created_at DESC);

ALTER TABLE rate_limit_hits ENABLE ROW LEVEL SECURITY;
-- No policies on purpose: anon/authenticated get nothing. The service
-- role bypasses RLS, and consume_rate_limit() runs as its owner.

-- Counts hits in the trailing window and records this one if there's
-- room. Returns TRUE when the caller is allowed through, FALSE when
-- they've hit the cap. Count + insert happen in a single statement so
-- concurrent submissions can't both slip past the limit.
CREATE OR REPLACE FUNCTION consume_rate_limit(
  p_bucket          text,
  p_limit           int,
  p_window_seconds  int
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_used int;
BEGIN
  -- Opportunistic cleanup: drop rows that fell out of every window we
  -- care about. Cheap, and keeps the table from growing unbounded
  -- without needing a cron job.
  DELETE FROM rate_limit_hits
   WHERE created_at < NOW() - INTERVAL '24 hours';

  SELECT COUNT(*) INTO v_used
    FROM rate_limit_hits
   WHERE bucket = p_bucket
     AND created_at > NOW() - (p_window_seconds * INTERVAL '1 second');

  IF v_used >= p_limit THEN
    RETURN false;
  END IF;

  INSERT INTO rate_limit_hits (bucket) VALUES (p_bucket);
  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION consume_rate_limit(text, int, int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION consume_rate_limit(text, int, int) TO anon, authenticated, service_role;
