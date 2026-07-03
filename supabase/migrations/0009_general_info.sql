-- Add general_info bullet points column to countries table.
-- Used for the "Genel Bilgi" section on each country's visa page.
ALTER TABLE countries
  ADD COLUMN IF NOT EXISTS general_info text[] NOT NULL DEFAULT '{}';
