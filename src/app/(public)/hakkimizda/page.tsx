import type { Metadata } from 'next';
import Link from 'next/link';
import { getPageSection } from '@/lib/data/pageSections';

export const metadata: Metadata = {
  title: 'Hakkımızda — Vize Makinesi',
  description: 'On sekiz yıl, on iki danışman, 42.000\'den fazla işlenmiş vize.',
};

const DEFAULT_TARIHCE = {
  title: '2006\'dan bugüne, sınırları aşan tecrübe.',
  paragraphs: [
    'Her şey 2006 yılında, sınır ötesi deneyimlere yön veren Gezi Makinesi ile başladı. Biz sadece insanları bir noktadan diğerine taşımadık; binlerce gezginin hafızasına kazınan devasa festivalleri, Avrupa\'nın en prestijli kayak rotalarını ve her detayı incelikle düşünülmüş üst düzey yurtdışı organizasyonlarını bizzat organize ettik.',
  ],
};

export default async function AboutPage() {
  const section = await getPageSection('about_tarihce');
  const title = section?.title || DEFAULT_TARIHCE.title;
  const paragraphs = section?.paragraphs?.length ? section.paragraphs : DEFAULT_TARIHCE.paragraphs;

  return (
    <>
      {/* Alıntı */}
      <section className="container">
        <div className="py-24">
          <div className="relative pl-16">
            <span className="about-quote-mark font-serif" aria-hidden="true">&ldquo;</span>
            <blockquote className="font-serif italic text-[clamp(28px,3vw,48px)] leading-[1.25] tracking-[-0.015em]">
              Vizemakinesi olarak, dünya genelindeki vize başvurularınızda size kesintisiz ve güvenilir bir hizmet sunmaktan gurur duyuyoruz. Yılların deneyimi ve uzman ekibimizle, vize sürecinizin her adımında yanınızda olmayı hedefliyoruz.
            </blockquote>
            <span className="font-serif text-[120px] text-coral leading-none absolute -bottom-10 right-0 opacity-30 select-none" aria-hidden="true">&rdquo;</span>
          </div>
        </div>
      </section>

      {/* Ekibimiz teaser */}
      <section className="pt-12 pb-24 border-b border-border">
        <div className="container">
          <Link
            href="/ekibimiz"
            className="group flex items-center justify-between gap-8 transition-opacity duration-200"
          >
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral mb-4">
                — Ekibimiz
              </div>
              <h2 className="font-serif font-bold text-[clamp(36px,5vw,56px)] leading-none tracking-[-0.025em] text-navy group-hover:text-coral transition-colors duration-300">
                Ekip arkadaşlarımızla tanışın.
              </h2>
            </div>
            <span className="font-serif text-[clamp(32px,4vw,48px)] text-coral shrink-0 group-hover:translate-x-2 transition-transform duration-200">
              &rarr;
            </span>
          </Link>
        </div>
      </section>

      {/* Tarihçe */}
      <section className="container py-20 mt-16 mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div>
<h2 className="font-serif font-bold text-[clamp(36px,4.5vw,56px)] leading-none tracking-[-0.025em]">
              {title}
            </h2>
          </div>
          <div className="text-[16px] leading-[1.85] text-muted space-y-5">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
