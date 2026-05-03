import type { Metadata } from 'next';
import { COUNTRIES_DATA } from '@/data/countries';

export const metadata: Metadata = {
  title: 'Blog — Vize Makinesi',
  description: 'Vize süreçleri, seyahat tavsiyeleri ve göç hukuku hakkında güncel yazılar.',
};

type Post = {
  date: string;
  category: string;
  title: string;
  excerpt: string;
  slug: string;
  flag?: string;
};

const POSTS: Post[] = COUNTRIES_DATA
  .filter((c) => c.tourism)
  .map((c) => ({
    date: 'Gezi Rehberi',
    category: c.name,
    title: `${c.name} Gezi Rehberi`,
    excerpt: c.tourism!.intro[0],
    slug: `/blog/${c.slug}`,
    flag: c.flag,
  }));

export default function BlogPage() {
  return (
    <>
      {/* Hero: Hangi Ülkede Ne Yapılır? */}
      <section className="pt-24 pb-[72px] border-b border-border">
        <div className="container">
          <div className="font-mono text-[10px] tracking-[0.2em] text-coral uppercase mb-6">
            — Ofis yazıları
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-16 items-end">
            <div>
              <h1 className="font-serif font-bold text-[clamp(56px,6vw,96px)] leading-none tracking-[-0.02em]">
                Hangi ülkede<br />
                <em className="font-normal italic text-coral">ne yapılır?</em>
              </h1>
            </div>
            <div className="pb-2">
              <p className="font-serif text-[20px] text-navy leading-[1.55] border-l border-coral pl-6">
                Ülkeye göre değişen vize süreçleri, kritik belgeler ve dikkat edilmesi gereken farklılıklar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Country blog posts grid */}
      <section className="container pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px border border-border">
          {POSTS.map((post) => (
            <article
              key={post.title}
              className="p-10 border-border hover:bg-[hsl(var(--color-navy)/0.03)] transition-colors duration-150 group"
            >
              <div className="flex items-center gap-3 mb-6">
                {post.flag && <span className="text-[22px] leading-none">{post.flag}</span>}
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
              <a href={post.slug} className="mt-8 block font-mono text-[11px] uppercase tracking-[0.14em] text-coral">
                Devamını oku →
              </a>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
