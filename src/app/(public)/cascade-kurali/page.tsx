import type { Metadata } from 'next';
import PageHead from '@/components/shared/PageHead/PageHead';
import CascadeHero from '@/components/cascade-kurali/CascadeHero/CascadeHero';
import CascadeSteps from '@/components/cascade-kurali/CascadeSteps/CascadeSteps';
import CascadeRules from '@/components/cascade-kurali/CascadeRules/CascadeRules';
import CascadeCalculator from '@/components/cascade-kurali/CascadeCalculator/CascadeCalculator';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Cascade Kuralı — Vize Makinesi',
  description: 'Cascade kuralı nedir, nasıl işler ve vize başvurularını nasıl etkiler?',
};

export default function CascadeKuraliPage() {
  return (
    <>
      <PageHead
        noBorder
        sectionClassName="pb-5"
        title={
          <>
            Cascade <em className="font-normal italic text-coral">Kuralı</em>
          </>
        }
      />
      <CascadeHero />
      <CascadeSteps />
      <CascadeRules />
      <CascadeCalculator />
    </>
  );
}
