import type { Metadata } from 'next';
import PageHead from '@/components/PageHead/PageHead';
import Timeline from '@/components/Timeline/Timeline';

export const metadata: Metadata = {
  title: 'How It Works — Vize Makinesi',
  description: 'Our five-step visa practice: intake, documents, submission, tracking, and result.',
};

export default function HowItWorksPage() {
  return (
    <>
      <PageHead
        eyebrow="— How our agency works"
        title={<>From first call to <em className="font-normal italic text-coral">passport in hand.</em></>}
        lede="A predictable five-step process that has carried more than forty thousand applicants through the world's consulates."
      />
      <section className="container">
        <Timeline />
      </section>
    </>
  );
}
