import type { Metadata } from 'next';
import VisaTypePage, { visaTypeMetadata } from '@/components/vizeTurleri/VisaTypePage';

// Static segment — takes precedence over the sibling [countrySlug] route.
const SLUG = 'calisma-vizesi';

export const revalidate = 60;

export const metadata: Metadata = visaTypeMetadata(SLUG);

export default function Page() {
    return <VisaTypePage slug={SLUG} />;
}
