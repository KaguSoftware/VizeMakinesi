import type { Metadata } from 'next';
import Urgency from '@/components/Urgency/Urgency';
import { EXPEDITE_STATS } from '@/components/StatsGrid/constants';
import NumberedList from '@/components/NumberedList/NumberedList';
import ChecklistList from '@/components/ChecklistList/ChecklistList';
import FAQ from '@/components/FAQ/FAQ';
import BigCTA from '@/components/BigCTA/BigCTA';
import type { FAQItem } from '@/data/countries.types';
import type { NumberedListItem } from '@/components/NumberedList/types';
import { SITE } from '@/data/site';

export const metadata: Metadata = {
  title: 'US Visa Expediting — Visa.Office',
  description: 'Get a US visa interview in 5–10 days. We handle DS-160, expedite requests, and slot booking.',
};

const EXPEDITE_STEPS: NumberedListItem[] = [
  { title: 'Eligibility check',  text: 'We confirm your reason qualifies — medical, business, urgent travel, student visa appointment.' },
  { title: 'Request submission', text: 'We file the expedite request with your full justification packet within 24 hours.' },
  { title: 'Slot booking',       text: 'We monitor consulate calendars in 30-minute intervals and grab the earliest available.' },
];

const REQUIREMENTS = [
  'Approved DS-160 confirmation',
  'MRV fee receipt (paid)',
  'Documented urgency — medical, business, or academic',
  'Original interview appointment confirmation',
  'Supporting letter (we draft it)',
];

const FAQS: FAQItem[] = [
  { q: 'How fast can you actually get an interview?',  a: 'For qualifying cases we frequently secure interviews within 5–10 working days, sometimes the next day in medical emergencies.' },
  { q: 'What if my expedite request is denied?',       a: 'We appeal once at no extra cost. If still denied we hold your slot and monitor for cancellation slots daily.' },
  { q: 'Does this work in every consulate?',           a: 'Yes — we operate across all US consulates worldwide. Some posts are faster than others; we\'ll be honest in the eligibility memo.' },
];

export default function USExpeditePage() {
  return (
    <>
      <Urgency
        eyebrow="— US visa appointment expediting"
        headline={
          <>
            The interview is in{' '}
            <em className="text-coral font-normal italic">twelve months.</em>
            <br />
            You leave in{' '}
            <em className="text-coral font-normal italic">three weeks.</em>
          </>
        }
        lede="When the regular calendar doesn't fit your travel, our expediting practice gets you in front of a consular officer in days, not months."
        ctaPrimary={{ label: 'Start an Expedite Request →', href: `${SITE.whatsappHref}?text=Hello%2C%20I%20need%20US%20visa%20expediting` }}
        ctaSecondary={{ label: `Call ${SITE.phone}`, href: SITE.phoneHref }}
        stats={EXPEDITE_STATS}
      />

      <section className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-20 py-20 border-b border-border">
          <div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase mb-4">— How it works</div>
            <h2 className="font-serif font-bold text-[clamp(36px,4.5vw,56px)] leading-none tracking-[-0.025em]">
              Three steps.<br />Often three days.
            </h2>
          </div>
          <NumberedList items={EXPEDITE_STEPS} />
        </div>
      </section>

      <section className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-20 py-20 border-b border-border">
          <div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase mb-4">— Requirements</div>
            <h2 className="font-serif font-bold text-[clamp(36px,4.5vw,56px)] leading-none tracking-[-0.025em]">
              What we need<br />from you.
            </h2>
          </div>
          <ChecklistList items={REQUIREMENTS} />
        </div>
      </section>

      <FAQ items={FAQS} title={<>Expediting — <em className="font-normal italic text-coral">common questions.</em></>} />
      <BigCTA title={<>Travel <em className="font-normal italic text-coral">this month?</em><br />Let&apos;s start today.</>} />
    </>
  );
}
