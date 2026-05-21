const STEPS = [
  {
    goal: '1 Yıllık Çok Girişli',
    condition: 'Son 2 yıl içinde 3 adet kısa süreli Schengen vizesi almış ve bunları kurallara uygun kullanmış olmak.',
  },
  {
    goal: '2 Yıllık Çok Girişli',
    condition: 'Son 2 yıl içinde alınmış 1 yıllık çok girişli vizeyi kurallara uygun kullanmış olmak.',
  },
  {
    goal: '5 Yıllık Çok Girişli',
    condition: 'Son 3 yıl içinde alınmış 2 yıllık çok girişli vizeyi kurallara uygun kullanmış olmak.',
  },
];

export default function CascadeSteps() {
  return (
    <section className="py-16 border-b border-border">
      <div className="container">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral mb-4">
          — Kademeli Artış
        </div>
        <h2 className="font-serif font-bold text-[clamp(28px,4vw,48px)] leading-none tracking-tight text-navy mb-12">
          Kademeli Artış Nasıl İşler?
        </h2>
        <p className="font-serif text-[17px] text-muted leading-relaxed mb-10 max-w-2xl">
          Sistem, konsoloslukların değerlendirmelerinde şu standart aşamaları takip etmesini öngörür:
        </p>
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
      </div>
    </section>
  );
}
