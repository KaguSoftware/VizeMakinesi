import type { MetadataRoute } from 'next';
import { COUNTRIES_DATA, COUNTRY_SLUGS } from '@/data/countries';

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

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${BASE_URL}${path}`,
    changeFrequency: 'monthly',
    priority: path === '/' ? 1 : 0.8,
  }));

  const countryEntries: MetadataRoute.Sitemap = COUNTRY_SLUGS.map((slug) => ({
    url: `${BASE_URL}/visa/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const blogCountryEntries: MetadataRoute.Sitemap = COUNTRIES_DATA
    .filter((c) => c.tourism)
    .map((c) => ({
      url: `${BASE_URL}/blog/${c.slug}`,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

  return [...staticEntries, ...countryEntries, ...blogCountryEntries];
}
