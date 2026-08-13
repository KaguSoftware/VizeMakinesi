import { FadeIn } from '@/components/shared/motion';
import DocumentGrid from '@/components/shared/DocumentGrid/DocumentGrid';
import type { DocumentRow } from '@/lib/data/countries';

interface Props {
  countryName: string;
  documents: DocumentRow[];
}

export default function GerekliEvraklar({ countryName, documents }: Props) {
  if (documents.length === 0) return null;

  return (
    <section className="container border-b border-border">
      <div className="pt-16 pb-20 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-16 items-start">
        <FadeIn as="div">
          <h2 className="font-serif font-bold text-[clamp(28px,3.5vw,48px)] leading-none tracking-tight text-navy">
            {countryName} Vize İşlemleri İçin{' '}
            <em className="font-normal italic text-coral">Gerekli Belgeler</em>
          </h2>
        </FadeIn>

        {/* Card markup is shared with the visa-type pages' documents section. */}
        <DocumentGrid documents={documents} />
      </div>
    </section>
  );
}
