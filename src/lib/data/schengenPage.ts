import { createPublicClient } from '@/lib/supabase/public';
import type { Database } from '@/lib/supabase/database.types';
import {
  SCHENGEN_PAGE_DEFAULTS,
  type SchengenFaqItem,
  type SchengenListItem,
  type SchengenPageContent,
} from '@/data/schengenPage';

type SchengenPageRow = Database['public']['Tables']['schengen_page']['Row'];

/** jsonb sütunları serbest biçimlidir; yalnızca dolu ve doğru şekilli maddeler alınır. */
function toListItems(value: unknown): SchengenListItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => (v && typeof v === 'object' ? (v as Record<string, unknown>) : null))
    .map((v) => ({
      title: typeof v?.title === 'string' ? v.title : '',
      description: typeof v?.description === 'string' ? v.description : '',
    }))
    .filter((v) => v.title || v.description);
}

function toFaqItems(value: unknown): SchengenFaqItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => (v && typeof v === 'object' ? (v as Record<string, unknown>) : null))
    .map((v) => ({
      question: typeof v?.question === 'string' ? v.question : '',
      answer: typeof v?.answer === 'string' ? v.answer : '',
    }))
    .filter((v) => v.question && v.answer);
}

function pick<T>(value: T | null | undefined, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string' && !value.trim()) return fallback;
  if (Array.isArray(value) && value.length === 0) return fallback;
  return value;
}

function fromRow(row: SchengenPageRow): SchengenPageContent {
  const d = SCHENGEN_PAGE_DEFAULTS;
  return {
    hero_lead: pick(row.hero_lead, d.hero_lead),
    hero_note: pick(row.hero_note, d.hero_note),
    hero_bullets: pick(row.hero_bullets, d.hero_bullets),

    intro_title: pick(row.intro_title, d.intro_title),

    rules_title: pick(row.rules_title, d.rules_title),
    rules_description: pick(row.rules_description, d.rules_description),
    rules: pick(toListItems(row.rules), d.rules),

    visa_types_title: pick(row.visa_types_title, d.visa_types_title),
    visa_types_description: pick(row.visa_types_description, d.visa_types_description),
    visa_types_c_title: pick(row.visa_types_c_title, d.visa_types_c_title),
    visa_types_c: pick(toListItems(row.visa_types_c), d.visa_types_c),
    visa_types_d_title: pick(row.visa_types_d_title, d.visa_types_d_title),
    visa_types_d_description: pick(row.visa_types_d_description, d.visa_types_d_description),
    visa_types_d: pick(toListItems(row.visa_types_d), d.visa_types_d),

    process_title: pick(row.process_title, d.process_title),
    process_lead: pick(row.process_lead, d.process_lead),
    process_description: pick(row.process_description, d.process_description),

    faq_title: pick(row.faq_title, d.faq_title),
    faqs: pick(toFaqItems(row.faqs), d.faqs),
  };
}

/**
 * /schengen sayfasının içeriği. Tablo henüz uygulanmadıysa veya satır yoksa
 * rehber dokümanının varsayılan metinleri döner — sayfa hiçbir durumda boş
 * kalmaz.
 */
export async function getSchengenPage(): Promise<SchengenPageContent> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('schengen_page')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  const row = data as SchengenPageRow | null;
  return row ? fromRow(row) : SCHENGEN_PAGE_DEFAULTS;
}

export type { SchengenPageContent, SchengenListItem, SchengenFaqItem };
