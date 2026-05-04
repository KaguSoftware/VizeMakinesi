import type { Metadata } from 'next';
import Image from 'next/image';
import PageHead from '@/components/shared/PageHead/PageHead';

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-border">

          {/* VFS Global */}
          <div className="p-12 flex flex-col gap-8">
            <div className="h-16 flex items-center">
              <Image
                src="/vfs_global.png"
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
          <div className="p-12 flex flex-col gap-8 border-t border-border md:border-t-0 md:border-l md:border-r">
            <div className="h-16 flex items-center">
              <Image
                src="/kosmos.png"
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

          {/* Gezi Makinesi */}
          <div className="p-12 flex flex-col gap-8 border-t border-border md:border-t-0">
            <div className="h-16 flex items-center">
              <Image
                src="/Gezi-Makinesi-Yatay-Logo-siyah.png"
                alt="Gezi Makinesi"
                width={200}
                height={64}
                className="object-contain object-left"
              />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-coral mb-3">— Turizm Acentesi</div>
              <h2 className="font-serif font-bold text-[clamp(20px,2vw,26px)] tracking-[-0.015em] mb-4">Gezi Makinesi</h2>
              <p className="text-[15px] leading-[1.85] text-muted">
                Gezi Makinesi, yurt içi ve yurt dışı tur organizasyonlarında uzmanlaşmış bir turizm acentesidir.
                Bu ortaklık sayesinde vize süreçlerinizi tur paketlerinizle entegre bir şekilde yönetebilir,
                seyahat planlamanızı baştan sona tek elden takip edebilirsiniz.
              </p>
              <a
                href="https://www.instagram.com/gezimakinesicom"
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
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
