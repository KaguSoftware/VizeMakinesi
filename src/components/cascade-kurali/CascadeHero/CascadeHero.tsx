import { FadeIn } from "@/components/shared/motion";

export default function CascadeHero() {
  return (
    <section className="pt-5 pb-20 border-b border-border">
      <div className="container">
        <div>
          <FadeIn>
            <p className="font-serif text-[clamp(18px,2vw,22px)] text-navy leading-[1.7]">
              <strong>Cascade (Kademeli) Kuralı</strong>, Avrupa Birliği&apos;nin Schengen vizesi başvurularında
              uyguladığı, güvenilir seyahat geçmişine sahip kişilere kademeli olarak daha uzun süreli ve
              çok girişli (Multiple Entry Visa - MEV) vize verilmesini öngören bir sistemdir.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="font-serif text-[clamp(18px,2vw,22px)] text-navy leading-[1.7] mt-2">
              Sürekli vize başvurusu yapma, randevu kovalama ve evrak toplama çilesini bitirmeyi amaçlayan
              bu kurala göre; vizelerinizi kurallara uygun kullandıkça bir sonraki vizenizin süresi
              kademeli olarak uzar.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
