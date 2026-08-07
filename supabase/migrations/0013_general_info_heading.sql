-- Editable heading + description for the "Başvuru Öncesi Bilmeniz Gerekenler"
-- section on /vize/[slug]. When null, the site falls back to the default
-- title and renders no description.
ALTER TABLE countries
  ADD COLUMN IF NOT EXISTS general_info_title text,
  ADD COLUMN IF NOT EXISTS general_info_description text;
