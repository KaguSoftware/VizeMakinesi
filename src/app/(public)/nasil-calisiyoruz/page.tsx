import type { Metadata } from 'next';
import PageHead from '@/components/shared/PageHead/PageHead';
import Timeline from '@/components/shared/Timeline/Timeline';
import ChecklistList from '@/components/shared/ChecklistList/ChecklistList';
import NumberedList from '@/components/shared/NumberedList/NumberedList';

export const metadata: Metadata = {
  title: 'Nasıl Çalışırız — Vize Makinesi',
  description: 'Beş adımlı vize sürecimiz: başvuru, belgeler, teslim, takip ve sonuç.',
};

export default function HowItWorksPage() {
  return (
    <>
      <PageHead
        eyebrow="— Ajansımız nasıl çalışır"
        title="Vizenizi Şansa Değil, Sisteme Bırakın"
        lede="Hayallerinizdeki rotaya giden süreci, tıkır tıkır işleyen bir makine hassasiyetiyle yönetiyoruz."
        titleClassName="font-serif font-bold text-[clamp(32px,4.2vw,68px)] leading-[1.05] tracking-[-0.02em] whitespace-nowrap"
        ledeClassName="font-serif text-[clamp(16px,1.6vw,24px)] text-navy mt-9 leading-[1.45] border-l border-coral pl-6 whitespace-nowrap"
      />
      <section className="container">
        <Timeline />
      </section>

      {/* Gerekli belgeler */}
      <section className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-20 py-20 border-b border-border">
          <div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase mb-6">
              — 01 / Gerekli belgeler
            </div>
            <h2 className="font-serif font-bold text-[clamp(36px,4.5vw,56px)] leading-none tracking-tight">
              Masaya<br />getirdikleriniz.
            </h2>
            <p className="font-serif italic text-[18px] text-navy mt-6 max-w-90 leading-relaxed">
              Eksiksiz bir dosya, vize kararının en önemli belirleyicisidir. Sizinkini satır satır inceliyoruz.
            </p>
          </div>
          <ChecklistList items={REQUIREMENTS} />
        </div>
      </section>

      {/* Ofisimizin üstlendiği */}
      <section className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-20 py-20 border-b border-border">
          <div>
            <div className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase mb-6">
              — 02 / Ofisimizin üstlendiği
            </div>
            <h2 className="font-serif font-bold text-[clamp(36px,4.5vw,56px)] leading-none tracking-tight">
              Sizin yerinize<br />hallettiklerimiz.
            </h2>
            <p className="font-serif italic text-[18px] text-navy mt-6 max-w-90 leading-relaxed">
              Randevu rezervasyonundan pasaportunuzu kapınıza teslim etmeye kadar.
            </p>
          </div>
          <NumberedList items={HANDLES} />
        </div>
      </section>
    </>
  );
}

const REQUIREMENTS = [
  'Geçerlilik süresi en az 6 ay olan pasaport',
  'Biyometrik fotoğraf (son 6 ay içinde çekilmiş)',
  'Seyahat sigortası (tüm Schengen bölgesini kapsamalı)',
  'Banka hesap dökümleri (son 3 aya ait)',
  'Uçuş rezervasyonu (onaylı bilet veya rezervasyon)',
  'Konaklama belgesi (otel rezervasyonu veya davet mektubu)',
  'Gelir belgesi veya işe giriş belgesi',
  'Vize başvuru formu (eksiksiz ve imzalı)',
];

const HANDLES = [
  { title: 'Başvuru Formu', text: 'Başvuru formlarınızı eksiksiz ve hatasız dolduruyoruz.' },
  { title: 'Randevu', text: 'Konsolosluktaki randevunuzu planlıyor ve takip ediyoruz.' },
  { title: 'Belge Kontrolü', text: 'Tüm belgelerinizi teslim öncesinde tek tek inceliyoruz.' },
  { title: 'Dosya Teslimi', text: 'Hazırlanan dosyayı ilgili konsolosluğa teslim ediyoruz.' },
  { title: 'Süreç Takibi', text: 'Başvurunuzu sonuçlanana kadar yakından takip ediyoruz.' },
  { title: 'Pasaport Teslimi', text: 'Vizeli pasaportunuzu adresinize teslim ediyoruz.' },
];
