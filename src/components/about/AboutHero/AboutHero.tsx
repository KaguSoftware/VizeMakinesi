import { FadeIn } from '@/components/shared/motion';

const PARAGRAPHS = [
  'Hikâyemiz 2006 yılında, Boğaziçi Üniversitesi\'nde başlayan bir etkinlik serüveniyle başladı. O günden bu yana Gezi Makinesi çatısı altında Magic Break, OTP Istanbul, Label Project ve Bansko gibi pek çok özgün projeye imza attık.',
  'Türkiye\'de ve dünyanın farklı noktalarında turlar, etkinlikler ve seyahat deneyimleri organize ederken, binlerce insanın yolculuğuna eşlik ettik. Bir seyahatin nasıl planlandığını, nerede başladığını ve yola çıkmadan önce nelerin gerektiğini yıllar içinde yaşayarak öğrendik.',
  'Bugün Vize Makinesi olarak, turizm ve organizasyon sektöründe edindiğimiz deneyimi vize danışmanlığına taşıyoruz. Başvuru sahiplerinin seyahat amaçlarını ve kişisel durumlarını değerlendiriyor, güncel başvuru koşullarını dikkate alarak vize başvurularını doğru ve eksiksiz şekilde hazırlamalarına yardımcı oluyoruz.',
];

export default function AboutHero() {
  return (
    <section className="pt-24 pb-20 border-b border-border">
      <div className="container">
        <FadeIn as="div" className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral mb-6">
          — Hakkımızda
        </FadeIn>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <FadeIn as="div">
            <h1 className="font-serif font-bold text-[clamp(32px,4.5vw,56px)] leading-[1.05] tracking-[-0.025em]">
              Vize işine sonradan girmedik&hellip;
            </h1>
          </FadeIn>
          <FadeIn as="div" className="text-[16px] leading-[1.85] text-muted space-y-5">
            {PARAGRAPHS.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
