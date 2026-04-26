import type { Metadata } from 'next';
import PageHead from '@/components/PageHead/PageHead';
import TeamGrid from '@/components/TeamGrid/TeamGrid';
import StatsGrid from '@/components/StatsGrid/StatsGrid';
import { ABOUT_STATS } from '@/components/StatsGrid/constants';
import BigCTA from '@/components/BigCTA/BigCTA';

export const metadata: Metadata = {
  title: 'About Us — Visa.Office',
  description: 'Eighteen years, twelve consultants, 42,000+ visas processed.',
};

export default function AboutPage() {
  return (
    <>
      <PageHead
        eyebrow="— About the office"
        title={<>An old craft, <em className="font-normal italic text-coral">practised quietly.</em></>}
      />

      {/* Quote + Stats */}
      <section className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-20 py-24 border-b border-border items-start">
          <div className="relative pl-16">
            <span className="about-quote-mark font-serif" aria-hidden="true">&ldquo;</span>
            <blockquote className="font-serif italic text-[clamp(32px,3.6vw,52px)] leading-[1.18] tracking-[-0.015em]">
              &ldquo;We treat a visa file the way a good lawyer treats a brief — every page in its right place, every claim corroborated, every gap explained before it is asked about.&rdquo;
            </blockquote>
            <cite className="not-italic font-mono text-[11px] uppercase tracking-[0.18em] text-muted block mt-10">
              — Marina Aslan, Founding Partner
            </cite>
          </div>
          <StatsGrid items={ABOUT_STATS} />
        </div>
      </section>

      <TeamGrid />

      {/* History */}
      <section className="container py-20 border-b border-border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral mb-4">
              — Our history
            </div>
            <h2 className="font-serif font-bold text-[clamp(36px,4.5vw,56px)] leading-none tracking-[-0.025em]">
              From a single<br />desk in 2008.
            </h2>
          </div>
          <div className="text-[16px] leading-[1.85] text-muted space-y-5">
            <p>
              Visa.Office began in 2008 as a one-person practice serving the diaspora community in our home city. By 2013 we had three consultants and a license to act as authorised agents for two consulates.
            </p>
            <p>
              Today we operate a multi-jurisdiction practice with twelve full-time consultants, in-house translators, and partnerships with VFS, TLS Contact, BLS, and CGI worldwide.
            </p>
            <p>
              We have never advertised on television. Every client comes from a referral, a returning case, or a quiet recommendation between friends.
            </p>
          </div>
        </div>
      </section>

      <BigCTA />
    </>
  );
}
