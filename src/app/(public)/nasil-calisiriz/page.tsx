import type { Metadata } from 'next';
import PageHead from '@/components/shared/PageHead/PageHead';
import BigCTA from '@/components/home/BigCTA/BigCTA';
import FlowChart from '@/components/nasil-calisiriz/FlowChart/FlowChart';
import YourPart from '@/components/nasil-calisiriz/YourPart/YourPart';
import { INTRO } from '@/components/nasil-calisiriz/constants';

export const metadata: Metadata = {
  title: 'Nasıl Çalışırız — Vize Makinesi',
  description:
    'Randevudan sonuca kadar vize başvurunuzu nasıl yürüttüğümüzü adım adım anlatıyoruz.',
};

export default function NasilCalisirizPage() {
  return (
    <>
      <PageHead
        titleClassName="font-serif font-bold text-[clamp(27px,4.95vw,80px)] leading-[0.95] tracking-[-0.02em] wrap-break-word hyphens-auto max-w-full"
        title={
          <>
            Siz seyahatinize odaklanın,{' '}
            <em className="font-normal italic text-coral">vize işinizi biz halledi&shy;yoruz.</em>
          </>
        }
        lede={INTRO}
      />
      <FlowChart />
      <YourPart />
      <BigCTA title={'Seyahat planınızı paylaşın,\nbaşvurunuz için gereken\nyolu birlikte belirleyelim.'} />
    </>
  );
}
