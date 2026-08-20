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
      // Blog kapak sayfaları kaldırıldı: makaleler artık iç içe değil,
      // doğrudan /blog/<makale-slug'ı> adresinde yayınlanıyor.
      { source: '/blog/:blog/:article', destination: '/blog/:article', permanent: true },
      // Ülke blog kapakları da kalktığı için yalnızca vize sayfaları eşlenir;
      // eski /blog/<en-slug> adresleri artık bir kapağa değil, akışa döner.
      ...Object.entries(slugMap).flatMap(([en, tr]) => [
        { source: `/vize/${en}`, destination: `/vize/${tr}`, permanent: true },
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
