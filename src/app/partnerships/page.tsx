import type { Metadata } from 'next';
import Image from 'next/image';
import PageHead from '@/components/PageHead/PageHead';

export const metadata: Metadata = {
  title: 'Ortaklıklar — Vize Makinesi',
  description: 'Seyahat acenteleri, kurumsal firmalar ve sivil toplum kuruluşları için toplu vize çözümleri.',
};

export default function PartnershipsPage() {
  return (
    <>
      <PageHead
        eyebrow="— Kurumsal ortaklıklar"
        title={<>Güvenilir <em className="font-normal italic text-coral">iş ortaklarımız.</em></>}
        lede="Vize süreçlerinizi güvence altına alan küresel ağlarla çalışıyoruz."
      />

      <section className="container pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px border border-border">

          {/* VFS Global */}
          <div className="p-12 flex flex-col gap-8">
            <div className="h-16 flex items-center">
              <Image
                src="/vfs_logo.png"
                alt="VFS Global"
                width={160}
                height={64}
                className="object-contain object-left"
              />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-coral mb-3">— Vize Başvuru Merkezi</div>
              <h2 className="font-serif font-bold text-[clamp(20px,2vw,26px)] tracking-[-0.015em] mb-4">VFS Global</h2>
              <p className="text-[15px] leading-[1.85] text-muted">
                Dünyanın en büyük vize dış kaynak hizmetleri şirketi olan VFS Global, 150'den fazla ülkede 3.000'i aşkın
                başvuru merkezi işletmektedir. Vize Makinesi olarak VFS Global altyapısını kullanarak başvurularınızı
                doğrudan yetkili kanallar üzerinden takip ediyor, randevu süreçlerini hızlandırıyor ve evrak
                kontrolünü eksiksiz yürütüyoruz.
              </p>
            </div>
          </div>

          {/* Kosmos */}
          <div className="p-12 flex flex-col gap-8 border-t border-border md:border-t-0 md:border-l">
            <div className="h-16 flex items-center">
              <Image
                src="/kosmos_logo.png"
                alt="Kosmos"
                width={160}
                height={64}
                className="object-contain object-left"
              />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-coral mb-3">— Seyahat & Lojistik</div>
              <h2 className="font-serif font-bold text-[clamp(20px,2vw,26px)] tracking-[-0.015em] mb-4">Kosmos</h2>
              <p className="text-[15px] leading-[1.85] text-muted">
                Kosmos, uluslararası seyahat lojistiği ve kurumsal seyahat yönetimi alanında köklü bir deneyime sahiptir.
                Bu ortaklık sayesinde vize süreçlerinizi uçuş, konaklama ve transfer planlamasıyla tek çatı altında
                yönetebiliyorsunuz. Eksiksiz bir seyahat deneyimi için Kosmos ile koordineli çalışıyoruz.
              </p>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
