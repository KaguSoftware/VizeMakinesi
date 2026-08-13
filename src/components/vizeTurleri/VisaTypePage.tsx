import type { Metadata } from 'next';
import { getVisaTypeOrThrow } from '@/data/visaTypes';
import { getVisaTypeFaqs } from '@/lib/data/visaTypeFaqs';
import { getVisaTypeDocuments } from '@/lib/data/visaTypeDocuments';
import FAQ from '@/components/shared/FAQ/FAQ';
import VisaTypeArticle, { VisaTypeCta } from './VisaTypeArticle';

/**
 * Full page body for every /vize-turleri/[visa-type] route. The route files
 * are thin wrappers that only pin the slug, so the layout stays in one place.
 */
export default async function VisaTypePage({ slug }: { slug: string }) {
  const content = getVisaTypeOrThrow(slug);
  const [faqs, documents] = await Promise.all([
    getVisaTypeFaqs(slug),
    getVisaTypeDocuments(slug),
  ]);

  return (
    <>
      <VisaTypeArticle content={content} documents={documents} />

      {faqs.length > 0 && (
        <FAQ
          items={faqs}
          title={
            <>
              {content.faqTitle}{' '}
              <em className="font-normal italic text-coral">sık sorulan sorular.</em>
            </>
          }
        />
      )}

      <VisaTypeCta
        title={content.cta.title}
        text={content.cta.text}
        label={content.cta.label}
        // `tip` only accepts 'vize' | 'hizlandirma', so the visa-type slug
        // would be dropped — link to the default consultation flow instead.
        href="/danisma-al"
      />
    </>
  );
}

export function visaTypeMetadata(slug: string): Metadata {
  const content = getVisaTypeOrThrow(slug);
  return {
    title: `${content.title} — Vize Makinesi`,
    description: content.heroSubtitle,
  };
}
