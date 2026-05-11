-- Seeds the remaining home-page countries into `countries` so they appear on /blog.
-- Idempotent via ON CONFLICT (slug) DO NOTHING. Existing rows are not touched.
-- Tourism copy and images can be enriched later via /admin/countries.

INSERT INTO countries (slug, name, flag_emoji, flag_type, flag_preset_key, visa_type, summary, mosaic_visible, has_tourism)
VALUES
  ('avusturya',   'Avusturya',    '🇦🇹', 'preset', 'austria',       'Schengen Vizesi', '', false, false),
  ('belcika',     'Belçika',      '🇧🇪', 'preset', 'belgium',       'Schengen Vizesi', '', false, false),
  ('bulgaristan', 'Bulgaristan',  '🇧🇬', 'preset', 'bulgaria',      'Schengen Vizesi', '', false, false),
  ('hirvatistan', 'Hırvatistan',  '🇭🇷', 'preset', 'croatia',       'Schengen Vizesi', '', false, false),
  ('cekya',       'Çekya',        '🇨🇿', 'preset', 'czech',         'Schengen Vizesi', '', false, false),
  ('danimarka',   'Danimarka',    '🇩🇰', 'preset', 'denmark',       'Schengen Vizesi', '', false, false),
  ('estonya',     'Estonya',      '🇪🇪', 'preset', 'estonia',       'Schengen Vizesi', '', false, false),
  ('finlandiya',  'Finlandiya',   '🇫🇮', 'preset', 'finland',       'Schengen Vizesi', '', false, false),
  ('yunanistan',  'Yunanistan',   '🇬🇷', 'preset', 'greece',        'Schengen Vizesi', '', false, false),
  ('macaristan',  'Macaristan',   '🇭🇺', 'preset', 'hungary',       'Schengen Vizesi', '', false, false),
  ('izlanda',     'İzlanda',      '🇮🇸', 'preset', 'iceland',       'Schengen Vizesi', '', false, false),
  ('letonya',     'Letonya',      '🇱🇻', 'preset', 'latvia',        'Schengen Vizesi', '', false, false),
  ('lihtenstayn', 'Lihtenştayn',  '🇱🇮', 'preset', 'liechtenstein', 'Schengen Vizesi', '', false, false),
  ('litvanya',    'Litvanya',     '🇱🇹', 'preset', 'lithuania',     'Schengen Vizesi', '', false, false),
  ('luksemburg',  'Lüksemburg',   '🇱🇺', 'preset', 'luxembourg',    'Schengen Vizesi', '', false, false),
  ('malta',       'Malta',        '🇲🇹', 'preset', 'malta',         'Schengen Vizesi', '', false, false),
  ('norvec',      'Norveç',       '🇳🇴', 'preset', 'norway',        'Schengen Vizesi', '', false, false),
  ('polonya',     'Polonya',      '🇵🇱', 'preset', 'poland',        'Schengen Vizesi', '', false, false),
  ('portekiz',    'Portekiz',     '🇵🇹', 'preset', 'portugal',      'Schengen Vizesi', '', false, false),
  ('romanya',     'Romanya',      '🇷🇴', 'preset', 'romania',       'Schengen Vizesi', '', false, false),
  ('slovakya',    'Slovakya',     '🇸🇰', 'preset', 'slovakia',      'Schengen Vizesi', '', false, false),
  ('slovenya',    'Slovenya',     '🇸🇮', 'preset', 'slovenia',      'Schengen Vizesi', '', false, false),
  ('ispanya',     'İspanya',      '🇪🇸', 'preset', 'spain',         'Schengen Vizesi', '', false, false),
  ('isvec',       'İsveç',        '🇸🇪', 'preset', 'sweden',        'Schengen Vizesi', '', false, false),
  ('isvicre',     'İsviçre',      '🇨🇭', 'preset', 'switzerland',   'Schengen Vizesi', '', false, false),
  ('irlanda',     'İrlanda',      '🇮🇪', 'preset', 'ireland',       'Kısa Süreli Ziyaretçi Vizesi', '', false, false),
  ('cin',         'Çin',          '🇨🇳', 'preset', 'china',         'Turist Vizesi (L)', '', false, false)
ON CONFLICT (slug) DO NOTHING;
