import { FadeIn } from "@/components/shared/motion";

const STEPS = [
  {
    goal: '6 Aylık Çok Girişli',
    condition: 'Önceki herhangi bir Tip C Schengen vizesinin bitişinden itibaren 1 yıl içinde başvurmak ve o vizeyi kurallara uygun kullanmış olmak.',
  },
  {
    goal: '1 Yıllık Çok Girişli',
    condition: 'Önceki 6 aylık çok girişli vizenin bitişinden itibaren 2 yıl içinde başvurmak ve o vizeyi kurallara uygun kullanmış olmak.',
  },
  {
    goal: '3 Yıllık Çok Girişli',
    condition: 'Önceki 1 yıllık çok girişli vizenin bitişinden itibaren 2 yıl içinde başvurmak ve o vizeyi kurallara uygun kullanmış olmak.',
  },
  {
    goal: '5 Yıllık Çok Girişli',
    condition: 'Önceki 3 yıllık çok girişli vizenin bitişinden itibaren 2 yıl içinde başvurmak ve o vizeyi kurallara uygun kullanmış olmak.',
  },
];

export default function CascadeSteps() {
  return (
    <section className="py-16 border-b border-border">
      <div className="container">
        <FadeIn>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral mb-4">
            — Kademeli Artış
          </div>
        </FadeIn>
        <FadeIn delay={0.08}>
          <h2 className="font-serif font-bold text-[clamp(28px,4vw,48px)] leading-none tracking-tight text-navy mb-12">
            Kademeli Artış Nasıl İşler?
          </h2>
        </FadeIn>
        <FadeIn delay={0.14}>
          <p className="font-serif text-[17px] text-muted leading-relaxed mb-10 max-w-2xl">
            Sistem, konsoloslukların değerlendirmelerinde şu standart aşamaları takip etmesini öngörür:
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-navy">
                  <th className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted text-left py-4 pr-8">
                    Vize Hedefi
                  </th>
                  <th className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted text-left py-4">
                    Aranan Şart
                  </th>
                </tr>
              </thead>
              <tbody>
                {STEPS.map((step, i) => (
                  <tr key={i} className="border-b border-border group">
                    <td className="py-7 pr-8 align-top">
                      <span className="font-serif font-bold text-[20px] text-navy leading-tight whitespace-nowrap">
                        {step.goal}
                      </span>
                    </td>
                    <td className="py-7 align-top">
                      <span className="font-serif text-[16px] text-muted leading-relaxed">
                        {step.condition}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
