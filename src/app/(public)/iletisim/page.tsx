import type { Metadata } from 'next';
import MapFrame from '@/components/contact/MapFrame/MapFrame';
import { SITE } from '@/data/site';

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
            <h2 className="font-serif font-bold text-[56px] leading-none tracking-[-0.03em] mb-10">
              Vize Makinesi<br />4.Levent
            </h2>

            {[
              { k: 'Adres', v: `${SITE.address.street},\n${SITE.address.suite}\n${SITE.address.city}`, isAddress: true },
              { k: 'Telefon', v: SITE.phone, href: SITE.phoneHref, serif: true },
              { k: 'E-posta', v: SITE.email, href: `mailto:${SITE.email}` },
            ].map((row) => (
              <div key={row.k} className="grid grid-cols-[130px_1fr] gap-5 py-[22px] border-t border-border items-baseline">
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
              </div>
            ))}

            {/* Çalışma Saatleri */}
            <div className="grid grid-cols-[130px_1fr] gap-5 py-[22px] border-t border-b border-border items-start">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Çalışma Saatleri</div>
              <table className="w-full border-collapse">
                <tbody>
                  {SITE.hours.map((h) => (
                    <tr key={h.day} className="border-t border-border first:border-t-0">
                      <td className="py-[14px] font-serif font-medium text-[17px]">{h.day}</td>
                      <td className="py-[14px] text-right font-mono text-[12px] text-muted">{h.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 mt-10 w-full max-w-sm">
              <a
                href={SITE.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 font-sans font-medium text-[13px] uppercase tracking-[0.1em] px-7 py-4 bg-[#25D366] border border-[#25D366] text-white hover:bg-transparent hover:text-[#25D366] transition-all duration-200 rounded-2xl whitespace-nowrap"
              >
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.76-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.114 1.522 5.847L.057 23.882a.5.5 0 0 0 .638.605l6.256-1.643A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.893a9.875 9.875 0 0 1-5.031-1.375l-.36-.214-3.733.979.997-3.639-.235-.374A9.855 9.855 0 0 1 2.107 12C2.107 6.58 6.58 2.107 12 2.107S21.893 6.58 21.893 12 17.42 21.893 12 21.893z" />
                </svg>
                WhatsApp&rsquo;tan Yazın →
              </a>
              <a
                href={SITE.phoneHref}
                className="inline-flex items-center justify-center gap-3 font-sans font-medium text-[13px] uppercase tracking-[0.1em] px-7 py-4 border border-navy text-navy hover:bg-navy hover:text-white transition-all duration-200 rounded-2xl"
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
                className="inline-flex items-center justify-center gap-3 font-sans font-medium text-[13px] uppercase tracking-[0.1em] px-7 py-4 border border-[#E1306C] text-[#E1306C] hover:bg-[#E1306C] hover:text-white transition-all duration-200 rounded-2xl whitespace-nowrap"
              >
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram&rsquo;da Takip Edin →
              </a>
            </div>
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
