-- ============================================================
-- VISA TYPE DOCUMENTS
-- Downloadable PDFs shown in the "Gerekli Belgeler" section of
-- each /vize-turleri/[visa-type] sub-page. Same shape and same
-- admin flow as country_documents (which powers the identical
-- section on /vize/[countrySlug]) — only the owner differs:
-- these hang off a page_key rather than a country.
--
-- Files land in the existing `country-documents` storage bucket,
-- reusing its policies and the shared PdfUploader component.
-- ============================================================
CREATE TABLE IF NOT EXISTS visa_type_documents (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key    text NOT NULL,
  label       text NOT NULL,
  pdf_url     text NOT NULL,
  sort_order  int  NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS visa_type_documents_page_idx
  ON visa_type_documents (page_key, sort_order);

ALTER TABLE visa_type_documents ENABLE ROW LEVEL SECURITY;

-- Same policy shape as country_documents: public read, admin write.
CREATE POLICY "public_select_visa_type_documents"
  ON visa_type_documents FOR SELECT USING (true);

CREATE POLICY "admin_insert_visa_type_documents"
  ON visa_type_documents FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE POLICY "admin_update_visa_type_documents"
  ON visa_type_documents FOR UPDATE
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));

CREATE POLICY "admin_delete_visa_type_documents"
  ON visa_type_documents FOR DELETE
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid()));
