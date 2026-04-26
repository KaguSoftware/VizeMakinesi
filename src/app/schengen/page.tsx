import type { Metadata } from 'next';
import PageHead from '@/components/PageHead/PageHead';
import SchengenMembers from '@/components/SchengenMembers/SchengenMembers';
import WarningList from '@/components/WarningList/WarningList';
import { SCHENGEN_REJECTION_REASONS } from '@/components/SchengenMembers/constants';
import FAQ from '@/components/FAQ/FAQ';
import BigCTA from '@/components/BigCTA/BigCTA';
import type { FAQItem } from '@/data/countries.types';

export const metadata: Metadata = {
  title: 'Schengen Visa — Visa.Office',
  description: 'One visa, 29 countries. We file across every Schengen consulate.',
};

const SCHENGEN_FAQS: FAQItem[] = [
  { q: 'Can a Schengen visa cover all 29 countries?', a: 'Yes — once issued, a Type-C visa is valid across the whole Schengen area, subject to the main destination rule.' },
  { q: 'Which consulate should I apply through?',     a: 'The country where you spend the most days; if equal, the country of first entry.' },
  { q: 'How long is processing?',                     a: 'Usually 15 working days from biometrics; up to 45 in peak season or for additional checks.' },
];

export default function SchengenPage() {
  return (
    <>
      <PageHead
        eyebrow="— Schengen visa"
        title={<>One visa.<br /><em className="font-normal italic text-coral">Twenty-nine countries.</em></>}
        lede="The Schengen visa is a short-stay (Type C) permit valid across an entire customs union of European states. We file across every consulate."
      />

      {/* Member states */}
      <section className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-20 py-20 border-b border-border">
          <div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase mb-4">— Member states</div>
            <h2 className="font-serif font-bold text-[clamp(36px,4.5vw,56px)] leading-none tracking-[-0.025em]">
              Where it gets you.
            </h2>
            <p className="font-serif italic text-[18px] text-navy mt-6 leading-relaxed">
              All 29 Schengen states are covered by a single visa, with up to 90 days of stay per 180.
            </p>
          </div>
          <SchengenMembers />
        </div>
      </section>

      {/* Rejection reasons */}
      <section className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-20 py-20 border-b border-border">
          <div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase mb-4">— Common rejection reasons</div>
            <h2 className="font-serif font-bold text-[clamp(36px,4.5vw,56px)] leading-none tracking-[-0.025em]">
              Why files fail.
            </h2>
            <p className="font-serif italic text-[18px] text-navy mt-6 leading-relaxed">
              The most frequent reasons consulates cite when refusing a Schengen visa.
            </p>
          </div>
          <WarningList items={SCHENGEN_REJECTION_REASONS} />
        </div>
      </section>

      <FAQ items={SCHENGEN_FAQS} title={<>Schengen — <em className="font-normal italic text-coral">common questions.</em></>} />
      <BigCTA title={<>Apply for your <em className="font-normal italic text-coral">Schengen visa</em> with us.</>} />
    </>
  );
}
