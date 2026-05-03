import type { Metadata } from 'next';
import TeamGrid from '@/components/TeamGrid/TeamGrid';

export const metadata: Metadata = {
  title: 'Hakkımızda — Vize Makinesi',
  description: 'On sekiz yıl, on iki danışman, 42.000\'den fazla işlenmiş vize.',
};

export default function AboutPage() {
  return (
    <>
      {/* Alıntı */}
      <section className="container">
        <div className="py-24 border-b border-border">
          <div className="relative pl-16">
            <span className="about-quote-mark font-serif" aria-hidden="true">&ldquo;</span>
            <blockquote className="font-serif italic text-[clamp(28px,3vw,48px)] leading-[1.25] tracking-[-0.015em]">
              Vizemakinesi olarak, dünya genelindeki vize başvurularınızda size kesintisiz ve güvenilir bir hizmet sunmaktan gurur duyuyoruz. Yılların deneyimi ve uzman ekibimizle, vize sürecinizin her adımında yanınızda olmayı hedefliyoruz.
            </blockquote>
            <span className="font-serif text-[120px] text-coral leading-none absolute -bottom-10 right-0 opacity-30 select-none" aria-hidden="true">&rdquo;</span>
          </div>
        </div>
      </section>

      <TeamGrid />

      {/* Tarihçe */}
      <section className="container py-20 border-b border-border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral mb-4">
              — Tarihimiz
            </div>
            <h2 className="font-serif font-bold text-[clamp(36px,4.5vw,56px)] leading-none tracking-[-0.025em]">
              Tek bir<br />masadan, 2008&rsquo;de.
            </h2>
          </div>
          <div className="text-[16px] leading-[1.85] text-muted space-y-5">
            <p>
              Vize Makinesi, 2008 yılında şehrimizde diaspora topluluğuna hizmet veren tek kişilik bir ofis olarak başladı. 2013 yılına kadar üç danışmanımız ve iki konsolosluk için yetkili acente lisansımız vardı.
            </p>
            <p>
              Bugün, on iki tam zamanlı danışman, bünyemizde tercüman ve VFS, TLS Contact, BLS ile CGI dünya genelinde ortaklıklarımızla çok yargı bölgeli bir uygulama yürütüyoruz.
            </p>
            <p>
              Hiç televizyonda reklam vermedik. Her müşteri bir tavsiye, geri dönen bir dava ya da arkadaşlar arasındaki sessiz bir öneri sayesinde bize ulaşır.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
