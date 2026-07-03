import { FadeIn, Stagger, StaggerItem } from '@/components/shared/motion';

const REJECTION_REASONS = [
  {
    title: 'Eksik veya hatalı belgeler',
    desc: 'Gerekli evrakların tamamlanmaması ya da yanlış formatta sunulması en sık ret sebebidir.',
  },
  {
    title: 'Yetersiz mali kanıt',
    desc: 'Banka hesap dökümleri veya gelir belgelerinin konsolosluk standartlarını karşılamaması.',
  },
  {
    title: 'Güçlü bağ ispatı yapılamaması',
    desc: 'Ülkeye dönüş niyetini kanıtlayan iş, aile veya mülkiyet belgelerinin yetersizliği.',
  },
  {
    title: 'Geçmiş vize ihlalleri',
    desc: 'Önceki vizede izin süresi aşımı veya başka bir ülkede yaşanan vize sorunları.',
  },
  {
    title: 'Seyahat amacının belirsizliği',
    desc: 'Davet mektubu, rezervasyon veya program belgelerinin yetersiz ya da tutarsız olması.',
  },
];

const SOLUTIONS = [
  'Eksik belgeleri tamamlayarak yeniden başvuru yapmak mümkündür.',
  'Red kararı gerekçesi incelenerek, sonraki başvuru o alana göre güçlendirilir.',
  'Konsolosluk itiraz mekanizması kullanılarak ret karşı çıkılabilir.',
  'Farklı bir konsolosluk üzerinden başvuru seçeneği değerlendirilebilir.',
  'Profesyonel danışmanlık ile dosyanız yeniden yapılandırılır ve güçlendirilir.',
];

interface Props {
  countryName: string;
}

export default function VizeReddi({ countryName }: Props) {
  return (
    <section className="container border-b border-border">
      <div className="pt-16 pb-20">
        <FadeIn as="div" className="mb-12">
          <h2 className="font-serif font-bold text-[clamp(28px,3.5vw,48px)] leading-none tracking-tight text-navy">
            {countryName} Vize Reddi{' '}
            <em className="font-normal italic text-coral">ve Çözüm Yolları</em>
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-navy/50 mb-5">
              Sık ret sebepleri
            </p>
            <Stagger as="div" className="flex flex-col gap-0">
              {REJECTION_REASONS.map((r, i) => (
                <StaggerItem
                  key={i}
                  className="flex gap-4 py-5 border-b border-navy/10 last:border-0"
                >
                  <div className="font-mono text-[10px] tracking-[0.12em] pt-1 shrink-0 w-6 text-coral font-bold">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <p className="font-sans font-semibold text-[14px] text-navy mb-1">{r.title}</p>
                    <p className="font-sans text-[13px] text-navy/70 leading-relaxed">{r.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <FadeIn as="div" delay={0.15}>
            <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-navy/50 mb-5">
              Çözüm yolları
            </p>
            <div className="bg-navy/3 border border-navy/10 p-6 mb-8">
              <ul className="flex flex-col gap-4">
                {SOLUTIONS.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 font-sans text-[14px] text-navy/80 leading-relaxed">
                    <span className="text-coral mt-0.5 shrink-0">✓</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <p className="font-serif italic text-[16px] text-navy/70 leading-relaxed border-l-2 border-coral pl-4">
              Ret aldıysanız umutsuzluğa kapılmayın. Doğru stratejiyle yeniden başvuruda başarı oranı önemli ölçüde artar.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
