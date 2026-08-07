import type { Metadata } from 'next';
import Link from 'next/link';
import { FadeIn, Stagger, StaggerItem } from '@/components/shared/motion';

export const metadata: Metadata = {
  title: 'Ofis — Vize Makinesi',
  description: 'Ekip, ofis, çalışma yöntemi ve hizmetler hakkında her şey.',
};

const SECTIONS = [
  {
    title: 'Hakkımızda',
    desc: 'Ekip ve danışmanlar',
    to: '/hakkimizda',
    group: 'Hakkımızda',
  },
  {
    title: 'Ekibimiz',
    desc: 'Dosyanızı okuyan danışmanlarımız',
    to: '/ekibimiz',
    group: 'Hakkımızda',
  },
  {
    title: 'Ortaklıklar',
    desc: 'Kurumsal çözümler',
    to: '/ortakliklar',
    group: 'Hakkımızda',
  },
  {
    title: '4.Levent Ofisi',
    desc: 'Selvili Sokağı · D:Kat:1 Daire:1',
    to: '/iletisim',
    group: 'Ziyaret',
  },
  {
    title: 'Nasıl Çalışırız',
    desc: 'Beş adımlı ofis metodumuz',
    to: '/#nasil-calisiyoruz',
    group: 'Vize Hizmetleri',
  },
  {
    title: 'Ücrete Dahil Hizmetler',
    desc: 'Her başvuruda ne sunuyoruz',
    to: '/ucrete-dahil-hizmetler',
    group: 'Vize Hizmetleri',
  },
];

const GROUPS = ['Hakkımızda', 'Ziyaret', 'Vize Hizmetleri'];

export default function OfisPage() {
  return (
    <>
      <section className="container">
        <div className="py-20 grid grid-cols-1 lg:grid-cols-3 gap-16">
          {GROUPS.map((group, gi) => (
            <FadeIn key={group} delay={gi * 0.1}>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-coral mb-6 pb-4 border-b border-border">
                {group}
              </div>
              <Stagger as="ul" className="list-none space-y-1">
                {SECTIONS.filter((s) => s.group === group).map((s) => (
                  <StaggerItem key={s.to} as="li">
                    <Link
                      href={s.to}
                      className="group flex items-start justify-between gap-4 py-4 border-b border-border hover:border-coral transition-colors duration-150"
                    >
                      <div>
                        <div className="font-serif font-semibold text-[20px] leading-tight tracking-[-0.01em] group-hover:text-coral transition-colors duration-150">
                          {s.title}
                        </div>
                        <div className="text-[13px] text-muted mt-1">
                          {s.desc}
                        </div>
                      </div>
                      <span className="text-[14px] text-muted/60 shrink-0 mt-1 group-hover:translate-x-1 transition-transform duration-150">
                        →
                      </span>
                    </Link>
                  </StaggerItem>
                ))}
              </Stagger>
            </FadeIn>
          ))}
        </div>
      </section>
    </>
  );
}
