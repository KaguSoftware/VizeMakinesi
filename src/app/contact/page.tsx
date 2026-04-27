import type { Metadata } from 'next';
import PageHead from '@/components/PageHead/PageHead';
import MapFrame from '@/components/MapFrame/MapFrame';
import { SITE } from '@/data/site';

export const metadata: Metadata = {
  title: 'İletişim — Vize Makinesi',
  description: 'Gelin ya da önceden arayın. 142 Whitfield Lane, Suite 612. Pzt–Cts arası açık.',
};

export default function ContactPage() {
  return (
    <>
      <PageHead
        eyebrow="— Bize ulaşın"
        title={<>Gelin. <em className="font-normal italic text-coral">Ya da önceden arayın.</em></>}
        lede="Ofisimiz haftada altı gün açık. Öğlene kadar randevusuz kabul; öğleden sonra randevu ile."
      />

      <section className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] py-20 border-b border-border">
          {/* Sol */}
          <div className="pr-0 lg:pr-16">
            <h2 className="font-serif font-bold text-[56px] leading-none tracking-[-0.03em] mb-10">
              Vize Makinesi<br />Şehir Merkezi Şubesi.
            </h2>

            {[
              { k: 'Adres',    v: `${SITE.address.street},\n${SITE.address.suite}\n${SITE.address.city}`, isAddress: true },
              { k: 'Telefon',  v: SITE.phone,   href: SITE.phoneHref,    serif: true },
              { k: 'WhatsApp', v: 'wa.me/15551234567', href: SITE.whatsappHref, external: true },
              { k: 'E-posta',  v: SITE.email,   href: `mailto:${SITE.email}` },
            ].map((row) => (
              <div key={row.k} className="grid grid-cols-[130px_1fr] gap-5 py-[22px] border-t border-border items-baseline">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{row.k}</div>
                <div className={`text-[16px] leading-relaxed ${row.serif ? 'font-serif font-semibold text-[26px] tracking-[-0.015em]' : ''}`}>
                  {row.href ? (
                    <a
                      href={row.href}
                      target={row.external ? '_blank' : undefined}
                      rel={row.external ? 'noopener noreferrer' : undefined}
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

            <div className="flex flex-col gap-3 items-start mt-10">
              <a
                href={SITE.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center font-sans font-medium text-[13px] uppercase tracking-[0.1em] px-8 py-[22px] bg-coral border border-coral text-navy hover:bg-transparent hover:text-coral transition-all duration-200"
              >
                WhatsApp'tan Yazın →
              </a>
              <a
                href={SITE.phoneHref}
                className="inline-flex items-center font-sans font-medium text-[13px] uppercase tracking-[0.1em] px-8 py-[22px] border border-navy text-navy hover:bg-navy hover:text-white transition-all duration-200"
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
