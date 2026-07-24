import type { Metadata } from 'next';
import MapFrame from '@/components/contact/MapFrame/MapFrame';
import { SITE } from '@/data/site';
import { FadeIn, Stagger, StaggerItem } from '@/components/shared/motion';

export const metadata: Metadata = {
  title: 'İletişim — Vize Makinesi',
  description: 'Gelin ya da önceden arayın. Selvili Sokağı, Beşiktaş. Pzt–Cts arası açık.',
};

export default function ContactPage() {
  return (
    <>

      <section className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] py-20 border-b border-border">
          {/* Sol */}
          <div className="pr-0 lg:pr-16">
            <FadeIn as="div" duration={0.55}>
              <h2 className="font-serif font-bold text-[56px] leading-none tracking-[-0.03em] mb-10">
                Vize Makinesi<br />4.Levent
              </h2>
            </FadeIn>

            <Stagger as="div" delayChildren={0.1}>
            {[
              { k: 'Adres', v: `${SITE.address.street},\n${SITE.address.suite}\n${SITE.address.city}`, isAddress: true },
              { k: 'Telefon', v: SITE.phone, href: SITE.phoneHref, serif: true },
              { k: 'E-posta', v: SITE.email, href: `mailto:${SITE.email}` },
            ].map((row) => (
              <StaggerItem key={row.k} className="grid grid-cols-[130px_1fr] gap-5 py-[22px] border-t border-border items-baseline">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{row.k}</div>
                <div className={`text-[16px] leading-relaxed ${row.serif ? 'font-serif font-semibold text-[26px] tracking-[-0.015em]' : ''}`}>
                  {row.href ? (
                    <a
                      href={row.href}
                      className="hover:text-coral transition-colors"
                    >
                      {row.v}
                    </a>
                  ) : row.isAddress ? (
                    <span style={{ whiteSpace: 'pre-line' }}>{row.v}</span>
                  ) : (
                    row.v
                  )}
                </div>
              </StaggerItem>
            ))}
            </Stagger>

            {/* Çalışma Saatleri */}
            <FadeIn as="div" delay={0.2} className="grid grid-cols-[130px_1fr] gap-5 py-[22px] border-t border-b border-border items-start">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Çalışma Saatleri</div>
              <table className="w-full border-collapse">
                <tbody>
                  {SITE.hours.map((h) => (
                    <tr key={h.day} className="flex flex-wrap items-baseline justify-between gap-x-3 sm:table-row border-t border-border first:border-t-0">
                      <td className="block sm:table-cell py-[10px] sm:py-[14px] font-serif font-medium text-[17px]">{h.day}</td>
                      <td className="block sm:table-cell py-[10px] sm:py-[14px] text-right font-mono text-[12px] text-muted">{h.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </FadeIn>

            <FadeIn as="div" delay={0.3} className="flex flex-col gap-3 mt-10 w-full max-w-sm">
              <a
                href="/danisma-al"
                className="inline-flex items-center justify-center gap-3 font-sans font-medium text-[13px] uppercase tracking-[0.1em] px-7 py-4 bg-coral border border-coral text-white hover:bg-transparent hover:text-coral active:scale-[0.98] transition-all duration-200 rounded-2xl whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2"
              >
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
                Danışma Formunu Doldurun →
              </a>
              <a
                href={SITE.phoneHref}
                className="inline-flex items-center justify-center gap-3 font-sans font-medium text-[13px] uppercase tracking-[0.1em] px-7 py-4 border border-navy text-navy hover:bg-navy hover:text-white active:scale-[0.98] transition-all duration-200 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2"
              >
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                Ofisi Arayın
              </a>
              <a
                href="https://www.instagram.com/vizemakinesi/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 font-sans font-medium text-[13px] uppercase tracking-[0.1em] px-7 py-4 border border-[#E1306C] text-[#E1306C] hover:bg-[#E1306C] hover:text-white active:scale-[0.98] transition-all duration-200 rounded-2xl whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E1306C] focus-visible:ring-offset-2"
              >
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram&rsquo;da Takip Edin →
              </a>
            </FadeIn>
          </div>

          {/* Sağ: harita */}
          <div className="pl-0 lg:pl-16 lg:border-l border-border mt-12 lg:mt-0">
            <MapFrame />
          </div>
        </div>
      </section>
    </>
  );
}
