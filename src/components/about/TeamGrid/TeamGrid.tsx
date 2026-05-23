import Image from 'next/image';
import { getTeamMembers } from '@/lib/data/team';
import { FadeIn, Stagger, StaggerItem } from '@/components/shared/motion';

export default async function TeamGrid() {
  const members = await getTeamMembers();


  return (
    <section className="py-24 border-b border-border">
      <div className="container">
        <FadeIn as="div" className="mb-14">
          <h2 className="font-serif font-bold text-[clamp(22px,5vw,56px)] leading-tight tracking-tight text-navy">
            Dosyanızı okuyan danışmanlarımız.
          </h2>
          <div className="font-mono text-[13px] uppercase tracking-[0.18em] text-muted mt-4">
            {members.length} danışman
          </div>
        </FadeIn>
        <Stagger as="div" className="grid grid-cols-2 md:grid-cols-4 border-t border-border">
          {members.map((m, i) => {
            const isLastMobileCol = (i + 1) % 2 === 0
            const isLastDesktopCol = (i + 1) % 4 === 0
            return (
              <StaggerItem
                key={i}
                className={`p-5 md:p-12 border-b border-border [@media(hover:hover)]:hover:bg-cream transition-colors duration-200 ${isLastMobileCol ? 'border-r-0' : 'border-r'} ${isLastDesktopCol ? 'md:border-r-0' : 'md:border-r'}`}
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
                <h4 className="font-serif font-semibold text-[22px] mb-2 tracking-[-0.015em] line-clamp-2">
                  {m.name}
                </h4>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted truncate">
                  {m.role}
                </div>
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>
    </section>
  );
}
