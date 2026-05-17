import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SCHENGEN_MEMBERS } from '@/data/schengen';
import { CITY_TO_COUNTRY } from '@/data/cities';

function turkishNormalize(s: string) {
  return s
    .replace(/İ/g, 'i').replace(/I/g, 'ı')
    .replace(/Ğ/g, 'ğ').replace(/Ü/g, 'ü')
    .replace(/Ş/g, 'ş').replace(/Ö/g, 'ö').replace(/Ç/g, 'ç')
    .toLowerCase();
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim();
  if (!q || q.length < 1) return NextResponse.json([]);

  const supabase = await createClient();
  const { data } = await supabase
    .from('countries')
    .select('name, slug, flag_emoji')
    .order('name')
    .limit(200) as { data: { name: string; slug: string; flag_emoji: string | null }[] | null };

  // Merge DB countries + Schengen static members
  const schengenEntries = SCHENGEN_MEMBERS.map((m) => ({ name: m.name, slug: m.slug, flag_emoji: m.flag }));
  const schengenNames = new Set(schengenEntries.map((m) => m.name));
  const dbOnlyEntries = (data ?? [])
    .filter((c) => !schengenNames.has(c.name))
    .map((c) => ({ name: c.name, slug: c.slug, flag_emoji: c.flag_emoji ?? null }));

  const all = [...schengenEntries, ...dbOnlyEntries];
  const allBySlug = new Map(all.map((c) => [c.slug, c]));

  const needle = turkishNormalize(q);

  // Direct country name matches
  const countryMatches = all.filter((c) => turkishNormalize(c.name).includes(needle));

  // City matches → resolve to the linked country, annotate with matched city
  const cityMatchedSlugs = new Set<string>();
  const cityMatches: (typeof countryMatches[0] & { matchedCity?: string })[] = [];

  for (const entry of CITY_TO_COUNTRY) {
    if (turkishNormalize(entry.city) === needle) {
      if (cityMatchedSlugs.has(entry.countrySlug)) continue;
      const country = allBySlug.get(entry.countrySlug);
      if (country) {
        cityMatchedSlugs.add(entry.countrySlug);
        cityMatches.push({ ...country, matchedCity: entry.city });
      }
    }
  }

  // Merge: country matches first, then city matches for countries not already listed
  const seen = new Set(countryMatches.map((c) => c.slug));
  const merged: (typeof countryMatches[0] & { matchedCity?: string })[] = [
    ...countryMatches,
    ...cityMatches.filter((c) => !seen.has(c.slug)),
  ];

  const result = merged
    .sort((a, b) => a.name.localeCompare(b.name, 'tr'))
    .slice(0, 6);

  return NextResponse.json(result);
}
