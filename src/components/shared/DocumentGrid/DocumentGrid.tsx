import { FadeIn } from '@/components/shared/motion';

export interface DocumentGridItem {
  id: string;
  label: string;
  pdf_url: string;
}

/**
 * Downloadable PDF cards.
 *
 * Shared by the "Gerekli Belgeler" section of /vize/[countrySlug] (fed by
 * `country_documents`) and of /vize-turleri/[visa-type] (fed by
 * `visa_type_documents`) so both render identically.
 */
export default function DocumentGrid({ documents }: { documents: DocumentGridItem[] }) {
  if (documents.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {documents.map((doc, i) => (
        <FadeIn key={doc.id} as="div" delay={i * 0.05}>
          <a
            href={doc.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="flex items-center gap-4 p-5 rounded-xl bg-coral/8 border border-coral/20 hover:bg-coral hover:border-coral transition-colors duration-200 group h-full"
          >
            <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-coral text-white group-hover:bg-white group-hover:text-coral transition-colors duration-200">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans font-medium text-[14px] text-coral group-hover:text-white transition-colors duration-200 leading-snug">
                {doc.label}
              </p>
              <p className="font-mono text-[10px] text-coral/60 group-hover:text-white/70 uppercase tracking-wider mt-1">
                PDF — İndir
              </p>
            </div>
          </a>
        </FadeIn>
      ))}
    </div>
  );
}
