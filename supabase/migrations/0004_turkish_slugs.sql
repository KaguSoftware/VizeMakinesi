-- Rename country slugs from English to Turkish.
-- Safe to run multiple times (already-renamed slugs will be no-ops).

UPDATE countries SET slug = 'ingiltere'  WHERE slug = 'uk';
UPDATE countries SET slug = 'almanya'    WHERE slug = 'germany';
UPDATE countries SET slug = 'fransa'     WHERE slug = 'france';
UPDATE countries SET slug = 'italya'     WHERE slug = 'italy';
UPDATE countries SET slug = 'hollanda'   WHERE slug = 'netherlands';
UPDATE countries SET slug = 'abd'        WHERE slug = 'usa';
UPDATE countries SET slug = 'kanada'     WHERE slug = 'canada';
UPDATE countries SET slug = 'avustralya' WHERE slug = 'australia';
UPDATE countries SET slug = 'bae'        WHERE slug = 'uae';
