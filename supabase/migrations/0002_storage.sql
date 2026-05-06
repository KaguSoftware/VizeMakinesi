-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('country-flags',       'country-flags',       true),
  ('country-tourism',     'country-tourism',      true),
  ('partnership-logos',   'partnership-logos',    true),
  ('team-photos',         'team-photos',          true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- STORAGE POLICIES
-- ============================================================

-- country-flags
CREATE POLICY "public_select_country_flags"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'country-flags');

CREATE POLICY "admin_insert_country_flags"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'country-flags'
    AND EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid())
  );

CREATE POLICY "admin_update_country_flags"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'country-flags'
    AND EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid())
  );

CREATE POLICY "admin_delete_country_flags"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'country-flags'
    AND EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid())
  );

-- country-tourism
CREATE POLICY "public_select_country_tourism"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'country-tourism');

CREATE POLICY "admin_insert_country_tourism"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'country-tourism'
    AND EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid())
  );

CREATE POLICY "admin_update_country_tourism"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'country-tourism'
    AND EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid())
  );

CREATE POLICY "admin_delete_country_tourism"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'country-tourism'
    AND EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid())
  );

-- partnership-logos
CREATE POLICY "public_select_partnership_logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'partnership-logos');

CREATE POLICY "admin_insert_partnership_logos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'partnership-logos'
    AND EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid())
  );

CREATE POLICY "admin_update_partnership_logos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'partnership-logos'
    AND EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid())
  );

CREATE POLICY "admin_delete_partnership_logos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'partnership-logos'
    AND EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid())
  );

-- team-photos
CREATE POLICY "public_select_team_photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'team-photos');

CREATE POLICY "admin_insert_team_photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'team-photos'
    AND EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid())
  );

CREATE POLICY "admin_update_team_photos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'team-photos'
    AND EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid())
  );

CREATE POLICY "admin_delete_team_photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'team-photos'
    AND EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = auth.uid())
  );
