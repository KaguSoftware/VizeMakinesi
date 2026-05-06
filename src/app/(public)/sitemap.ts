import type { MetadataRoute } from 'next';
import { getCountrySlugs, getTourismCountries } from '@/lib/data/countries';

const BASE_URL = 'https://vizemakinesi.com';

const STATIC_ROUTES = [
  '/',
  '/about',
  '/blog',
  '/contact',
  '/danisma-al',
  '/fees',
  '/how-it-works',
  '/partnerships',
  '/passport',
  '/schengen',
  '/us-visa-expedite',
  '/visa-regimes',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${BASE_URL}${path}`,
    changeFrequency: 'monthly',
    priority: path === '/' ? 1 : 0.8,
  }));

  const [slugs, tourismCountries] = await Promise.all([
    getCountrySlugs(),
    getTourismCountries(),
  ]);

  const countryEntries: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE_URL}/visa/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const blogCountryEntries: MetadataRoute.Sitemap = tourismCountries.map((c) => ({
    url: `${BASE_URL}/blog/${c.slug}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticEntries, ...countryEntries, ...blogCountryEntries];
}
