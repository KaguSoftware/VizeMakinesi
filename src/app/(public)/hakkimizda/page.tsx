import type { Metadata } from 'next';
import AboutHero from '@/components/about/AboutHero/AboutHero';
import TeamTeaser from '@/components/about/TeamTeaser/TeamTeaser';

export const metadata: Metadata = {
  title: 'Hakkımızda — Vize Makinesi',
  description: 'Vize işine sonradan girmedik. 2006\'dan bugüne, seyahat ve vize danışmanlığında deneyim.',
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <TeamTeaser />
    </>
  );
}
