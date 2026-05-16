import Image from 'next/image';
import { getTeamMembers } from '@/lib/data/team';

export default async function TeamGrid() {
  const members = await getTeamMembers();

  return (
    <section className="py-24 border-b border-border">
      <div className="container">
        <div className="mb-14">
          <h2 className="font-serif font-bold text-[clamp(22px,5vw,56px)] leading-tight tracking-tight text-navy">
            Dosyanızı okuyan danışmanlarımız.
          </h2>
          <div className="font-mono text-[13px] uppercase tracking-[0.18em] text-muted mt-4">
            {members.length} danışman
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-border">
          {members.map((m, i) => (
            <div
              key={i}
              className="p-5 md:p-12 border-r border-b border-border last:border-r-0 hover:bg-cream transition-colors duration-200"
            >
              {m.photo_url ? (
                <Image
                  src={m.photo_url}
                  alt={m.name}
                  width={120}
                  height={120}
                  className="w-30 h-30 rounded-full object-cover border border-navy mb-7"
                />
              ) : (
                <div className="w-30 h-30 border border-navy rounded-full flex items-center justify-center font-serif italic font-normal text-[40px] tracking-[-0.02em] mb-7">
                  {m.initials}
                </div>
              )}
              <h4 className="font-serif font-semibold text-[22px] mb-2 tracking-[-0.015em]">
                {m.name}
              </h4>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                {m.role}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
