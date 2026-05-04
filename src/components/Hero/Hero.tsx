"use client";
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="pt-20 pb-10 relative border-b border-border overflow-hidden">
      {/* Background map */}
      <Image
        src="/Dunya_haritasi.png"
        alt=""
        fill
        className="object-cover blur-sm scale-105 opacity-50"
        priority
        aria-hidden="true"
      />
      <div className="container relative z-10">
        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-15 items-end relative">
          {/* Left: headline */}
          <div className="relative">
            <h1 className="font-serif font-bold text-[clamp(46px,7vw,110px)] leading-none tracking-[-0.02em]">
              Evrakları biz halledelim,{' '}<br />
              siz <span className="text-coral">valizinizi</span><br />
              <span className="text-coral">hazırlayın</span>.
            </h1>
          </div>

          {/* Right: editorial note */}
          <div className="border-l border-border pl-9 pb-3 relative">
            <div className="absolute -top-6 -left-px w-7 h-7 bg-coral flex items-center justify-center font-mono text-[11px] font-medium text-white">
              ¶
            </div>
            <p className="font-serif text-[19px] leading-[1.55] text-coral max-w-95 mb-8">
              Altmıştan fazla ülkede gezginler, aileler ve işletmeler için vize başvurularını hazırlar, sunar ve takip ederiz — bir hukuk bürosunun titizliği ve bir kütüphanecinin sabrıyla.
            </p>
            <Link
              href="/danisma-al"
              className="inline-flex items-center gap-2 font-sans font-medium text-[12px] uppercase tracking-widest px-7 py-4 border border-coral text-coral hover:bg-navy hover:text-white hover:border-cream transition-all duration-200 rounded-2xl"
            >
              Danışma Al →
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
