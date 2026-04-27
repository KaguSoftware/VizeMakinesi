import type { FlagBGProps } from './types';

function star(cx: number, cy: number, ro: number, ri: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? ro : ri;
    // Round to 4 decimal places to prevent server/client floating-point mismatch
    pts.push(`${Math.round((cx + Math.cos(a) * r) * 1e4) / 1e4},${Math.round((cy + Math.sin(a) * r) * 1e4) / 1e4}`);
  }
  return pts.join(' ');
}

export default function FlagBG({ slug, className }: FlagBGProps) {
  const shared = { preserveAspectRatio: 'xMidYMid slice', className };

  switch (slug) {
    case 'uk':
      return (
        <svg viewBox="0 0 60 30" {...shared}>
          <rect width="60" height="30" fill="#012169" />
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFF" strokeWidth="6" />
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2" />
          <path d="M30,0 V30 M0,15 H60" stroke="#FFF" strokeWidth="10" />
          <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
        </svg>
      );
    case 'germany':
      return (
        <svg viewBox="0 0 5 3" {...shared}>
          <rect width="5" height="1" y="0" fill="#000" />
          <rect width="5" height="1" y="1" fill="#DD0000" />
          <rect width="5" height="1" y="2" fill="#FFCE00" />
        </svg>
      );
    case 'france':
      return (
        <svg viewBox="0 0 3 2" {...shared}>
          <rect width="3" height="2" fill="#0055A4" />
          <rect width="1" height="2" x="1" fill="#FFFFFF" />
          <rect width="1" height="2" x="2" fill="#EF4135" />
        </svg>
      );
    case 'italy':
      return (
        <svg viewBox="0 0 3 2" {...shared}>
          <rect width="3" height="2" fill="#008C45" />
          <rect width="1" height="2" x="1" fill="#FFFFFF" />
          <rect width="1" height="2" x="2" fill="#CD212A" />
        </svg>
      );
    case 'netherlands':
      return (
        <svg viewBox="0 0 9 6" {...shared}>
          <rect width="9" height="2" y="0" fill="#AE1C28" />
          <rect width="9" height="2" y="2" fill="#FFFFFF" />
          <rect width="9" height="2" y="4" fill="#21468B" />
        </svg>
      );
    case 'usa':
      return (
        <svg viewBox="0 0 190 100" {...shared}>
          <rect width="190" height="100" fill="#FFFFFF" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <rect key={i} width="190" height={100 / 13} y={(100 / 13) * i * 2} fill="#B22234" />
          ))}
          {/* Canton (blue field) covers top 7 stripes */}
          <rect width="76" height={(100 / 13) * 7} fill="#3C3B6E" />
          {/* 50 stars: 5 rows of 6 + 4 rows of 5, alternating, all inside canton */}
          {Array.from({ length: 50 }).map((_, i) => {
            let row: number, col: number, totalCols: number;
            if (i < 30) {
              row = Math.floor(i / 6) * 2;
              col = i % 6;
              totalCols = 6;
            } else {
              row = Math.floor((i - 30) / 5) * 2 + 1;
              col = (i - 30) % 5;
              totalCols = 5;
            }
            const cantonH = (100 / 13) * 7;
            const rowH = cantonH / 10;
            const x = totalCols === 6 ? 6 + col * 11 : 11 + col * 11;
            const y = row * rowH + rowH / 2;
            return (
              <text key={i} x={x} y={y} fontSize="4" fill="#FFFFFF" textAnchor="middle" dominantBaseline="middle">★</text>
            );
          })}
        </svg>
      );
    case 'canada':
      return (
        <svg viewBox="0 0 24 12" {...shared}>
          <rect width="6" height="12" x="0" fill="#FF0000" />
          <rect width="12" height="12" x="6" fill="#FFFFFF" />
          <rect width="6" height="12" x="18" fill="#FF0000" />
          {/* Maple leaf */}
          <path
            d="M12,1.8 L12.55,3.6 L14.2,2.9 L13.3,4.5 L15,4.5 L13.6,5.7 L14.3,7.1 L12.7,6.5 L12.7,8.5 L11.3,8.5 L11.3,6.5 L9.7,7.1 L10.4,5.7 L9,4.5 L10.7,4.5 L9.8,2.9 L11.45,3.6 Z"
            fill="#FF0000"
          />
        </svg>
      );
    case 'australia':
      return (
        <svg viewBox="0 0 60 30" {...shared}>
          <rect width="60" height="30" fill="#00247D" />
          {/* Union Jack in top-left quarter */}
          <path d="M0,0 L30,15 M30,0 L0,15" stroke="#FFF" strokeWidth="4" />
          <path d="M0,0 L30,15 M30,0 L0,15" stroke="#CF142B" strokeWidth="2" />
          <path d="M15,0 V15 M0,7.5 H30" stroke="#FFF" strokeWidth="6" />
          <path d="M15,0 V15 M0,7.5 H30" stroke="#CF142B" strokeWidth="3" />
          {/* Commonwealth Star below Union Jack */}
          <text x="8" y="24" fontSize="6" fill="#FFF" textAnchor="middle" dominantBaseline="middle">★</text>
          {/* Southern Cross: 5 stars on right half */}
          <text x="45" y="8"  fontSize="5" fill="#FFF" textAnchor="middle" dominantBaseline="middle">★</text>
          <text x="52" y="13" fontSize="3.5" fill="#FFF" textAnchor="middle" dominantBaseline="middle">★</text>
          <text x="49" y="20" fontSize="4.5" fill="#FFF" textAnchor="middle" dominantBaseline="middle">★</text>
          <text x="40" y="22" fontSize="4.5" fill="#FFF" textAnchor="middle" dominantBaseline="middle">★</text>
          <text x="38" y="14" fontSize="4.5" fill="#FFF" textAnchor="middle" dominantBaseline="middle">★</text>
        </svg>
      );
    case 'uae':
      return (
        <svg viewBox="0 0 12 6" {...shared}>
          <rect width="3" height="6" fill="#FF0000" />
          <rect width="9" height="2" x="3" y="0" fill="#00732F" />
          <rect width="9" height="2" x="3" y="2" fill="#FFFFFF" />
          <rect width="9" height="2" x="3" y="4" fill="#000000" />
        </svg>
      );
    case 'schengen':
      return (
        <svg viewBox="0 0 60 40" {...shared}>
          <rect width="60" height="40" fill="#003399" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const r = 12;
            const cx = 30 + Math.cos(a) * r;
            const cy = 20 + Math.sin(a) * r;
            return <polygon key={i} points={star(cx, cy, 1.6, 0.7)} fill="#FFCC00" />;
          })}
        </svg>
      );
    default:
      return null;
  }
}
