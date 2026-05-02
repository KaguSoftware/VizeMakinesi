import type { Metadata } from 'next';
import PageHead from '@/components/PageHead/PageHead';

export const metadata: Metadata = {
  title: 'Blog — Vize Makinesi',
  description: 'Vize süreçleri, seyahat tavsiyeleri ve göç hukuku hakkında güncel yazılar.',
};

const POSTS = [
  {
    date: 'Mayıs 2026',
    category: 'Ülke Rehberleri',
    title: 'Hangi Ülkede Ne Yapılır?',
    excerpt:
      "Birleşik Krallık'tan Avustralya'ya, ABD'den Almanya'ya — ülkeye göre değişen vize süreçleri, kritik belgeler ve dikkat edilmesi gereken farklılıklar.",
    slug: '/blog/hangi-ulkede-ne-yapilir',
  },
  {
    date: 'Nisan 2026',
    category: 'Schengen',
    title: 'Schengen Çoklu Giriş Vizesi: 2026 Güncel Rehber',
    excerpt:
      'Uzun geçerlilik süreli çoklu giriş vizeleri için yeni konsolosluk gereksinimleri ve başvuru stratejileri.',
    slug: '#',
  },
  {
    date: 'Mart 2026',
    category: 'ABD',
    title: 'DS-160 Formunda Yapılan En Yaygın 7 Hata',
    excerpt:
      'Yılda binlerce başvuru dosyalarken öğrendiklerimiz — ve bu hatalar nasıl önlenir.',
    slug: '#',
  },
  {
    date: 'Şubat 2026',
    category: 'Pasaport',
    title: 'Acil Pasaport Yenileme: Adım Adım',
    excerpt:
      'Seyahatinize birkaç gün kala pasaportunuzun süresinin dolduğunu fark ettiyseniz yapmanız gerekenler.',
    slug: '#',
  },
  {
    date: 'Ocak 2026',
    category: 'Genel',
    title: 'Vize Reddi Sonrası Ne Yapılmalı?',
    excerpt:
      'Red kararını anlamak, itiraz süreçleri ve yeniden başvuru için güçlü bir dosya oluşturmak.',
    slug: '#',
  },
];

export default function BlogPage() {
  return (
    <>
      <PageHead
        eyebrow="— Ofis yazıları"
        title={<>Bilgi, <em className="font-normal italic text-coral">düz ve işe yarar.</em></>}
        lede="Vize süreçleri, seyahat tavsiyeleri ve göç hukuku hakkında danışmanlarımızdan güncel notlar."
      />

      <section className="container pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px border border-border">
          {POSTS.map((post) => (
            <article
              key={post.title}
              className="p-10 border-border hover:bg-[hsl(var(--color-navy)/0.03)] transition-colors duration-150 group"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-coral">
                  {post.category}
                </span>
                <span className="font-mono text-[10px] text-muted">·</span>
                <span className="font-mono text-[10px] text-muted">{post.date}</span>
              </div>
              <h2 className="font-serif font-bold text-[clamp(20px,2vw,26px)] leading-snug tracking-[-0.015em] mb-4 group-hover:text-coral transition-colors duration-150">
                <a href={post.slug}>{post.title}</a>
              </h2>
              <p className="text-[15px] leading-[1.75] text-muted">{post.excerpt}</p>
              <div className="mt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-coral">
                Devamını oku →
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
