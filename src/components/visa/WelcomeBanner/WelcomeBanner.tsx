import { FadeIn, Stagger, StaggerItem } from '@/components/shared/motion';

interface Props {
  countryName: string;
}

const TRUST_POINTS = [
  { icon: '🛡️', text: 'Uzman danışmanlarımız her adımda yanınızda' },
  { icon: '📋', text: 'Evraklarınızı birlikte hazırlıyoruz, eksik bırakmıyoruz' },
  { icon: '✅', text: 'Onlarca başarılı başvuruyla kazanılmış deneyim' },
];

export default function WelcomeBanner({ countryName }: Props) {
  return (
    <section className="bg-navy text-cream py-14">
      <div className="container">
        <FadeIn as="div" className="font-mono text-[10px] tracking-[0.2em] uppercase text-coral mb-6 pb-4 border-b border-cream/20">
          — Hoş geldiniz
        </FadeIn>
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 items-start">
          <FadeIn as="div">
            <h2 className="font-serif font-bold text-[clamp(28px,3.5vw,48px)] leading-[1.05] tracking-[-0.025em]">
              {countryName} vizesi{' '}
              <em className="font-normal italic text-coral">karmaşık değil</em>,<br />
              biz buradayız.
            </h2>
          </FadeIn>
          <FadeIn as="div" delay={0.1}>
            <p className="font-serif italic text-[18px] leading-relaxed text-cream/80 mb-8">
              Vize sürecinde kendinizi yalnız hissetmenize gerek yok. Başvurunuzun her aşamasında size rehberlik etmek için buradayız — sorularınızı yanıtlar, belgelerinizi kontrol eder ve sürecin sorunsuz ilerlemesini sağlarız.
            </p>
            <Stagger as="ul" className="flex flex-col gap-4">
              {TRUST_POINTS.map(({ icon, text }) => (
                <StaggerItem as="li" key={text} className="flex items-start gap-3 font-sans text-[15px] text-cream/90">
                  <span className="text-[20px] leading-none mt-0.5 shrink-0">{icon}</span>
                  {text}
                </StaggerItem>
              ))}
            </Stagger>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
