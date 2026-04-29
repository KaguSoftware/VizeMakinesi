import type { Metadata } from 'next';
import PageHead from '@/components/PageHead/PageHead';
import TeamGrid from '@/components/TeamGrid/TeamGrid';
import StatsGrid from '@/components/StatsGrid/StatsGrid';
import { ABOUT_STATS } from '@/components/StatsGrid/constants';

export const metadata: Metadata = {
  title: 'Hakkımızda — Vize Makinesi',
  description: 'On sekiz yıl, on iki danışman, 42.000\'den fazla işlenmiş vize.',
};

export default function AboutPage() {
  return (
    <>
      <PageHead
        eyebrow="— Ofis hakkında"
        title={<>Eski bir zanaat, <em className="font-normal italic text-coral">sessizce icra edilir.</em></>}
      />

      {/* Alıntı + İstatistikler */}
      <section className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-20 py-24 border-b border-border items-start">
          <div className="relative pl-16">
            <span className="about-quote-mark font-serif" aria-hidden="true">&ldquo;</span>
            <blockquote className="font-serif italic text-[clamp(32px,3.6vw,52px)] leading-[1.18] tracking-[-0.015em]">
              &ldquo;Bir vize dosyasına iyi bir avukatın dilekçesine baktığı gibi bakıyoruz — her sayfa doğru yerinde, her iddia desteklenmiş, her boşluk sorulmadan açıklanmış.&rdquo;
            </blockquote>
            <cite className="not-italic font-mono text-[11px] uppercase tracking-[0.18em] text-muted block mt-10">
              — Marina Aslan, Kurucu Ortak
            </cite>
          </div>
          <StatsGrid items={ABOUT_STATS} />
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
              Tek bir<br />masadan, 2008'de.
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
