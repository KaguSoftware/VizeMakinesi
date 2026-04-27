import type { Metadata } from 'next';
import PageHead from '@/components/PageHead/PageHead';
import PassportRow from '@/components/PassportRow/PassportRow';

export const metadata: Metadata = {
  title: 'Passport Services — Vize Makinesi',
  description: 'New passports, renewals, lost or stolen replacements, and child passports.',
};

export default function PassportPage() {
  return (
    <>
      <PageHead
        eyebrow="— Passport services"
        title={<>The document <em className="font-normal italic text-coral">before</em> the visa.</>}
        lede="We handle every passport situation — first issue, renewal, replacement, and child applications — with the same rigour as our visa work."
      />
      <section className="container pt-6">
        <PassportRow />
      </section>
    </>
  );
}
