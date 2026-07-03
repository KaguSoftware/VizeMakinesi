"use client";
import { motion } from "framer-motion";
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
          <FadeIn delay={0.18}>
            <motion.a
              href="#cascade-hesaplayici"
              className="inline-flex items-center gap-3 mt-6 font-mono text-[14px] md:text-[21px] uppercase tracking-[0.12em] md:tracking-[0.18em] text-coral group"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("cascade-hesaplayici")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span className="text-coral group-hover:text-navy transition-colors duration-200">
                Cascade hesaplayıcımızı kullanın
              </span>
              <motion.span
                className="text-coral group-hover:text-navy transition-colors duration-200 text-[20px]"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
              >
                →
              </motion.span>
            </motion.a>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
