import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    const slugMap: Record<string, string> = {
      uk:          'ingiltere',
      germany:     'almanya',
      france:      'fransa',
      italy:       'italya',
      netherlands: 'hollanda',
      usa:         'abd',
      canada:      'kanada',
      australia:   'avustralya',
      uae:         'bae',
    };
    return [
      // Schengen bölge sayfası /vize/schengen'den kök seviyeye taşındı.
      { source: '/vize/schengen', destination: '/schengen', permanent: true },
      ...Object.entries(slugMap).flatMap(([en, tr]) => [
        { source: `/vize/${en}`,  destination: `/vize/${tr}`,  permanent: true },
        { source: `/blog/${en}`,  destination: `/blog/${tr}`,  permanent: true },
      ]),
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
