import Image from 'next/image';
import type { FlagBGProps } from './types';

function star(cx: number, cy: number, ro: number, ri: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? ro : ri;
    pts.push(`${Math.round((cx + Math.cos(a) * r) * 1e4) / 1e4},${Math.round((cy + Math.sin(a) * r) * 1e4) / 1e4}`);
  }
  return pts.join(' ');
}

export default function FlagBG({ presetKey, imageUrl, className }: FlagBGProps) {
  if (imageUrl) {
    return <Image src={imageUrl} alt="" fill className={className} style={{ objectFit: 'cover' }} />;
  }

  const shared = { preserveAspectRatio: 'xMidYMid slice', className };

  switch (presetKey) {
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
          <rect width="76" height={(100 / 13) * 7} fill="#3C3B6E" />
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
      return <Image src="/canada_flag.svg" alt="" fill className={className} style={{ objectFit: 'cover' }} />;
    case 'australia':
      return (
        <svg viewBox="0 0 60 30" {...shared}>
          <rect width="60" height="30" fill="#00247D" />
          <path d="M0,0 L30,15 M30,0 L0,15" stroke="#FFF" strokeWidth="4" />
          <path d="M0,0 L30,15 M30,0 L0,15" stroke="#CF142B" strokeWidth="2" />
          <path d="M15,0 V15 M0,7.5 H30" stroke="#FFF" strokeWidth="6" />
          <path d="M15,0 V15 M0,7.5 H30" stroke="#CF142B" strokeWidth="3" />
          <text x="8" y="24" fontSize="6" fill="#FFF" textAnchor="middle" dominantBaseline="middle">★</text>
          <text x="45" y="8"  fontSize="5" fill="#FFF" textAnchor="middle" dominantBaseline="middle">★</text>
          <text x="52" y="13" fontSize="3.5" fill="#FFF" textAnchor="middle" dominantBaseline="middle">★</text>
          <text x="49" y="20" fontSize="4.5" fill="#FFF" textAnchor="middle" dominantBaseline="middle">★</text>
          <text x="40" y="22" fontSize="4.5" fill="#FFF" textAnchor="middle" dominantBaseline="middle">★</text>
          <text x="38" y="14" fontSize="4.5" fill="#FFF" textAnchor="middle" dominantBaseline="middle">★</text>
        </svg>
      );
    case 'china':
      return (
        <svg viewBox="0 0 30 20" {...shared}>
          <rect width="30" height="20" fill="#DE2910" />
          {/* large star */}
          <polygon points={star(5, 5, 3, 1.2)} fill="#FFDE00" />
          {/* four small stars */}
          <polygon points={star(10, 2, 1, 0.4)} fill="#FFDE00" />
          <polygon points={star(12, 4, 1, 0.4)} fill="#FFDE00" />
          <polygon points={star(12, 7, 1, 0.4)} fill="#FFDE00" />
          <polygon points={star(10, 9, 1, 0.4)} fill="#FFDE00" />
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
    // ── Schengen member flags ──
    case 'austria':
      return (
        <svg viewBox="0 0 3 2" {...shared}>
          <rect width="3" height="2" fill="#ED2939" />
          <rect width="3" height="0.667" y="0.667" fill="#FFFFFF" />
        </svg>
      );
    case 'belgium':
      return (
        <svg viewBox="0 0 3 2" {...shared}>
          <rect width="1" height="2" fill="#000000" />
          <rect width="1" height="2" x="1" fill="#FAE042" />
          <rect width="1" height="2" x="2" fill="#EF3340" />
        </svg>
      );
    case 'bulgaria':
      return (
        <svg viewBox="0 0 3 2" {...shared}>
          <rect width="3" height="2" fill="#FFFFFF" />
          <rect width="3" height="0.667" y="0.667" fill="#00966E" />
          <rect width="3" height="0.667" y="1.333" fill="#D62612" />
        </svg>
      );
    case 'croatia':
      return (
        <svg viewBox="0 0 3 2" {...shared}>
          <rect width="3" height="0.667" fill="#FF0000" />
          <rect width="3" height="0.667" y="0.667" fill="#FFFFFF" />
          <rect width="3" height="0.667" y="1.333" fill="#0093DD" />
          {/* simplified checkerboard shield */}
          {[0,1,2,3,4].map((col) =>
            [0,1,2,3,4].map((row) => (
              <rect key={`${col}-${row}`} x={1.2 + col * 0.12} y={0.55 + row * 0.12} width="0.12" height="0.12"
                fill={(col + row) % 2 === 0 ? '#FF0000' : '#FFFFFF'} />
            ))
          )}
        </svg>
      );
    case 'czech':
      return (
        <svg viewBox="0 0 3 2" {...shared}>
          <rect width="3" height="1" fill="#FFFFFF" />
          <rect width="3" height="1" y="1" fill="#D7141A" />
          <polygon points="0,0 1.2,1 0,2" fill="#11457E" />
        </svg>
      );
    case 'denmark':
      return (
        <svg viewBox="0 0 37 28" {...shared}>
          <rect width="37" height="28" fill="#C60C30" />
          <rect width="4" height="28" x="9" fill="#FFFFFF" />
          <rect width="37" height="4" y="12" fill="#FFFFFF" />
        </svg>
      );
    case 'estonia':
      return (
        <svg viewBox="0 0 3 2" {...shared}>
          <rect width="3" height="0.667" fill="#0072CE" />
          <rect width="3" height="0.667" y="0.667" fill="#000000" />
          <rect width="3" height="0.667" y="1.333" fill="#FFFFFF" />
        </svg>
      );
    case 'finland':
      return (
        <svg viewBox="0 0 18 11" {...shared}>
          <rect width="18" height="11" fill="#FFFFFF" />
          <rect width="3" height="11" x="5" fill="#003580" />
          <rect width="18" height="3" y="4" fill="#003580" />
        </svg>
      );
    case 'greece':
      return (
        <svg viewBox="0 0 27 18" {...shared}>
          {[0,1,2,3,4,5,6,7,8].map((i) => (
            <rect key={i} width="27" height="2" y={i * 2} fill={i % 2 === 0 ? '#0D5EAF' : '#FFFFFF'} />
          ))}
          <rect width="10" height="10" fill="#0D5EAF" />
          <rect width="2" height="10" x="4" fill="#FFFFFF" />
          <rect width="10" height="2" y="4" fill="#FFFFFF" />
        </svg>
      );
    case 'hungary':
      return (
        <svg viewBox="0 0 3 2" {...shared}>
          <rect width="3" height="0.667" fill="#CE2939" />
          <rect width="3" height="0.667" y="0.667" fill="#FFFFFF" />
          <rect width="3" height="0.667" y="1.333" fill="#477050" />
        </svg>
      );
    case 'iceland':
      return (
        <svg viewBox="0 0 25 18" {...shared}>
          <rect width="25" height="18" fill="#003897" />
          <rect width="5" height="18" x="7" fill="#FFFFFF" />
          <rect width="25" height="5" y="6.5" fill="#FFFFFF" />
          <rect width="3" height="18" x="8" fill="#D72828" />
          <rect width="25" height="3" y="7.5" fill="#D72828" />
        </svg>
      );
    case 'latvia':
      return (
        <svg viewBox="0 0 2 1" {...shared}>
          <rect width="2" height="1" fill="#9E3039" />
          <rect width="2" height="0.2" y="0.4" fill="#FFFFFF" />
        </svg>
      );
    case 'liechtenstein':
      return (
        <svg viewBox="0 0 5 3" {...shared}>
          <rect width="5" height="1.5" fill="#002B7F" />
          <rect width="5" height="1.5" y="1.5" fill="#CE1126" />
          {/* simplified crown */}
          <rect x="0.3" y="0.7" width="0.8" height="0.5" fill="#FFD700" rx="0.1" />
          <rect x="0.45" y="0.5" width="0.5" height="0.3" fill="#FFD700" rx="0.1" />
        </svg>
      );
    case 'lithuania':
      return (
        <svg viewBox="0 0 5 3" {...shared}>
          <rect width="5" height="1" fill="#FDB913" />
          <rect width="5" height="1" y="1" fill="#006A44" />
          <rect width="5" height="1" y="2" fill="#C1272D" />
        </svg>
      );
    case 'luxembourg':
      return (
        <svg viewBox="0 0 3 2" {...shared}>
          <rect width="3" height="0.667" fill="#EF3340" />
          <rect width="3" height="0.667" y="0.667" fill="#FFFFFF" />
          <rect width="3" height="0.667" y="1.333" fill="#00A3E0" />
        </svg>
      );
    case 'malta':
      return (
        <svg viewBox="0 0 3 2" {...shared}>
          <rect width="1.5" height="2" fill="#FFFFFF" />
          <rect width="1.5" height="2" x="1.5" fill="#CF142B" />
          {/* George Cross outline */}
          <rect x="0.15" y="0.3" width="0.9" height="0.9" fill="none" stroke="#CF142B" strokeWidth="0.06" />
        </svg>
      );
    case 'norway':
      return (
        <svg viewBox="0 0 22 16" {...shared}>
          <rect width="22" height="16" fill="#EF2B2D" />
          <rect width="4" height="16" x="6" fill="#FFFFFF" />
          <rect width="22" height="4" y="6" fill="#FFFFFF" />
          <rect width="2" height="16" x="7" fill="#002868" />
          <rect width="22" height="2" y="7" fill="#002868" />
        </svg>
      );
    case 'poland':
      return (
        <svg viewBox="0 0 8 5" {...shared}>
          <rect width="8" height="2.5" fill="#FFFFFF" />
          <rect width="8" height="2.5" y="2.5" fill="#DC143C" />
        </svg>
      );
    case 'portugal':
      return (
        <svg viewBox="0 0 3 2" {...shared}>
          <rect width="3" height="2" fill="#FF0000" />
          <rect width="1.2" height="2" fill="#006600" />
          {/* simplified coat of arms circle */}
          <circle cx="1.2" cy="1" r="0.3" fill="#FFD700" stroke="#000080" strokeWidth="0.05" />
        </svg>
      );
    case 'romania':
      return (
        <svg viewBox="0 0 3 2" {...shared}>
          <rect width="1" height="2" fill="#002B7F" />
          <rect width="1" height="2" x="1" fill="#FCD116" />
          <rect width="1" height="2" x="2" fill="#CE1126" />
        </svg>
      );
    case 'slovakia':
      return (
        <svg viewBox="0 0 3 2" {...shared}>
          <rect width="3" height="0.667" fill="#FFFFFF" />
          <rect width="3" height="0.667" y="0.667" fill="#0B4EA2" />
          <rect width="3" height="0.667" y="1.333" fill="#EE1C25" />
          {/* simplified double cross on blue/red */}
          <rect x="0.2" y="0.5" width="0.55" height="1.1" fill="#FFFFFF" rx="0.05" />
          <rect x="0.1" y="0.75" width="0.75" height="0.2" fill="#FFFFFF" />
          <rect x="0.1" y="1.05" width="0.75" height="0.2" fill="#FFFFFF" />
        </svg>
      );
    case 'slovenia':
      return (
        <svg viewBox="0 0 3 2" {...shared}>
          <rect width="3" height="0.667" fill="#FFFFFF" />
          <rect width="3" height="0.667" y="0.667" fill="#003DA5" />
          <rect width="3" height="0.667" y="1.333" fill="#EE2436" />
          {/* simplified triglav + stars */}
          <polygon points="0.25,1.1 0.5,0.55 0.75,1.1" fill="#FFFFFF" />
          <polygon points="0.35,0.95 0.5,0.65 0.65,0.95" fill="#003DA5" />
          <circle cx="0.35" cy="0.35" r="0.08" fill="#FFCB00" />
          <circle cx="0.5" cy="0.2" r="0.08" fill="#FFCB00" />
          <circle cx="0.65" cy="0.35" r="0.08" fill="#FFCB00" />
        </svg>
      );
    case 'spain':
      return (
        <svg viewBox="0 0 3 2" {...shared}>
          <rect width="3" height="0.5" fill="#AA151B" />
          <rect width="3" height="1" y="0.5" fill="#F1BF00" />
          <rect width="3" height="0.5" y="1.5" fill="#AA151B" />
        </svg>
      );
    case 'sweden':
      return (
        <svg viewBox="0 0 16 10" {...shared}>
          <rect width="16" height="10" fill="#006AA7" />
          <rect width="2" height="10" x="5" fill="#FECC02" />
          <rect width="16" height="2" y="4" fill="#FECC02" />
        </svg>
      );
    case 'switzerland':
      return (
        <svg viewBox="0 0 32 32" {...shared}>
          <rect width="32" height="32" fill="#FF0000" />
          <rect width="6" height="20" x="13" y="6" fill="#FFFFFF" />
          <rect width="20" height="6" x="6" y="13" fill="#FFFFFF" />
        </svg>
      );
    default:
      return null;
  }
}
