import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SCHENGEN_MEMBERS } from '@/data/schengen';

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
    .limit(200);

  // Merge DB countries + Schengen static members
  // Schengen entries take precedence (dedup by name), then remaining DB-only entries
  const schengenEntries = SCHENGEN_MEMBERS.map((m) => ({ name: m.name, slug: m.slug, flag_emoji: m.flag }));
  const schengenNames = new Set(schengenEntries.map((m) => m.name));
  const dbOnlyEntries = (data ?? [])
    .filter((c) => !schengenNames.has(c.name))
    .map((c) => ({ name: c.name, slug: c.slug, flag_emoji: c.flag_emoji ?? null }));

  const all = [...schengenEntries, ...dbOnlyEntries];

  const needle = turkishNormalize(q);
  const filtered = all
    .filter((c) => turkishNormalize(c.name).includes(needle))
    .sort((a, b) => a.name.localeCompare(b.name, 'tr'))
    .slice(0, 6);

  return NextResponse.json(filtered);
}
