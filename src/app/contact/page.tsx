import type { Metadata } from 'next';
import MapFrame from '@/components/MapFrame/MapFrame';
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
                className="inline-flex items-center justify-center gap-3 font-sans font-medium text-[16px] uppercase tracking-[0.1em] px-10 py-[28px] bg-[#25D366] border border-[#25D366] text-white hover:bg-transparent hover:text-[#25D366] transition-all duration-200 rounded-2xl whitespace-nowrap"
              >
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.114 1.522 5.847L.057 23.882a.5.5 0 0 0 .638.605l6.256-1.643A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.893a9.875 9.875 0 0 1-5.031-1.375l-.36-.214-3.733.979.997-3.639-.235-.374A9.855 9.855 0 0 1 2.107 12C2.107 6.58 6.58 2.107 12 2.107S21.893 6.58 21.893 12 17.42 21.893 12 21.893z" />
                </svg>
                WhatsApp&rsquo;tan Yazın →
              </a>
              <a
                href={SITE.phoneHref}
                className="inline-flex items-center justify-center font-sans font-medium text-[16px] uppercase tracking-[0.1em] px-10 py-[28px] border border-navy text-navy hover:bg-navy hover:text-white transition-all duration-200 rounded-2xl"
              >
                Ofisi Arayın
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
