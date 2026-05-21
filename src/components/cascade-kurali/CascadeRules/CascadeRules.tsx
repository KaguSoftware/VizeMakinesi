import { FadeIn, Stagger, StaggerItem } from "@/components/shared/motion";

const RULES = [
  {
    title: 'İlk Giriş Kuralı',
    body: 'Vizeyi hangi ülkeden aldıysanız, Schengen bölgesine ilk girişinizi (parmak izi okutulan yer) o ülkeden yapmış olmanız gerekir.',
  },
  {
    title: 'En Uzun Konaklama (Ana Destinasyon)',
    body: 'Seyahatiniz birden fazla ülkeyi kapsıyorsa, en uzun süre vizeyi aldığınız ülkede kalmış olmalısınız.',
  },
  {
    title: 'Süre ve Amaç İhlali',
    body: 'Vizenin size tanıdığı gün sayısını (örneğin 180 gün içinde 90 gün) kesinlikle aşmamış olmanız ve turistik vizeyle ticari faaliyette bulunmamış olmanız.',
  },
];

export default function CascadeRules() {
  return (
    <section className="py-16">
      <div className="container">
        <FadeIn>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral mb-4">
            — Uygunluk Şartları
          </div>
        </FadeIn>
        <FadeIn delay={0.08}>
          <h2 className="font-serif font-bold text-[clamp(28px,4vw,48px)] leading-none tracking-tight text-navy mb-6">
            &ldquo;Kurallara Uygun Kullanım&rdquo; Ne Demek?
          </h2>
        </FadeIn>
        <FadeIn delay={0.14}>
          <p className="font-serif text-[17px] text-muted leading-relaxed mb-12 max-w-2xl">
            Cascade kuralının işlemesi tamamen konsolosluğa vereceğiniz güvene dayalıdır. Geçmiş
            vizelerinizi incelerken şu ihlalleri yapmamış olmanıza bakarlar:
          </p>
        </FadeIn>
        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-8" delayChildren={0.1}>
          {RULES.map((rule, i) => (
            <StaggerItem key={i} className="border border-border p-8">
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral mb-4">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="font-serif font-bold text-[20px] text-navy leading-tight mb-4">
                {rule.title}
              </h3>
              <p className="font-serif text-[15px] text-muted leading-relaxed">
                {rule.body}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
