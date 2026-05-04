import type { Metadata } from 'next';
import Image from 'next/image';
import PageHead from '@/components/shared/PageHead/PageHead';
import { getPartnerships } from '@/lib/data/partnerships';

export const metadata: Metadata = {
  title: 'Ortaklıklar — Vize Makinesi',
  description: 'Seyahat acenteleri, kurumsal firmalar ve sivil toplum kuruluşları için toplu vize çözümleri.',
};

export default async function PartnershipsPage() {
  const partnerships = await getPartnerships();

  return (
    <>
      <PageHead
        eyebrow="— Kurumsal ortaklıklar"
        title={<>Güvenilir <em className="font-normal italic text-coral">iş ortaklarımız.</em></>}
        lede="Vize süreçlerinizi güvence altına alan küresel ağlarla çalışıyoruz."
      />

      <section className="container pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-border">
          {partnerships.map((p, i) => (
            <div
              key={p.id}
              className={`p-12 flex flex-col gap-8${i > 0 ? ' border-t border-border md:border-t-0 md:border-l' : ''}`}
            >
              {p.logo_url && (
                <div className="h-16 flex items-center">
                  <Image
                    src={p.logo_url}
                    alt={p.name}
                    width={200}
                    height={64}
                    className="object-contain object-left"
                  />
                </div>
              )}
              <div>
                {p.eyebrow && (
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-coral mb-3">
                    — {p.eyebrow}
                  </div>
                )}
                <h2 className="font-serif font-bold text-[clamp(20px,2vw,26px)] tracking-[-0.015em] mb-4">
                  {p.name}
                </h2>
                {p.description && (
                  <p className="text-[15px] leading-[1.85] text-muted">{p.description}</p>
                )}
                {p.external_url && (
                  <a
                    href={p.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-2 text-[15px] transition-opacity hover:opacity-80"
                    style={{ color: '#E1306C' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="url(#ig-gradient)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <defs>
                        <linearGradient id="ig-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#F58529"/>
                          <stop offset="50%" stopColor="#DD2A7B"/>
                          <stop offset="100%" stopColor="#8134AF"/>
                        </linearGradient>
                      </defs>
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="17.5" cy="6.5" r="0.5" fill="#DD2A7B" stroke="none"/>
                    </svg>
                    <span style={{ background: 'linear-gradient(45deg, #F58529, #DD2A7B, #8134AF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      @gezimakinesicom
                    </span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
