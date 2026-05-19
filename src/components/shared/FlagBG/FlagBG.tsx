import Image from 'next/image';
import type { FlagBGProps } from './types';

function star(cx: number, cy: number, ro: number, ri: number, points = 5, rotationDeg = 0): string {
  const pts: string[] = [];
  const n = points * 2;
  const rotRad = (rotationDeg * Math.PI) / 180;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2 + rotRad;
    const r = i % 2 === 0 ? ro : ri;
    pts.push(`${Math.round((cx + Math.cos(a) * r) * 1e4) / 1e4},${Math.round((cy + Math.sin(a) * r) * 1e4) / 1e4}`);
  }
  return pts.join(' ');
}

function star7(cx: number, cy: number, ro: number, ri: number): string {
  return star(cx, cy, ro, ri, 7);
}

export default function FlagBG({ presetKey, imageUrl, className, fit = 'slice' }: FlagBGProps) {
  if (imageUrl) {
    return <Image src={imageUrl} alt="" fill className={className} style={{ objectFit: 'cover' }} />;
  }

  const shared = { preserveAspectRatio: fit === 'meet' ? 'xMidYMid meet' : 'xMidYMid slice', className };

  switch (presetKey) {
    case 'uk':
      return <Image src="/flags/uk.svg" alt="UK" fill className={className} style={{ objectFit: 'cover' }} />;
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
            const cantonW = 76;
            const cantonH = (100 / 13) * 7;
            const colStep = cantonW / 6;
            const rowStep = cantonH / 10;
            const x = totalCols === 6
              ? colStep / 2 + col * colStep
              : colStep + col * colStep;
            const y = rowStep / 2 + row * rowStep;
            return (
              <polygon key={i} points={star(x, y, 2.4, 1.0)} fill="#FFFFFF" />
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
          {/* Union Jack canton (top-left 30×15) */}
          <path d="M0,0 L30,15 M30,0 L0,15" stroke="#FFF" strokeWidth="4" />
          <path d="M0,0 L30,15" stroke="#CF142B" strokeWidth="1.5" clipPath="url(#aus-tr)" />
          <path d="M30,0 L0,15" stroke="#CF142B" strokeWidth="1.5" clipPath="url(#aus-tl)" />
          <path d="M0,0 L30,15" stroke="#CF142B" strokeWidth="1.5" clipPath="url(#aus-bl)" />
          <path d="M30,0 L0,15" stroke="#CF142B" strokeWidth="1.5" clipPath="url(#aus-br)" />
          <defs>
            <clipPath id="aus-tr"><polygon points="15,7.5 30,0 30,7.5" /></clipPath>
            <clipPath id="aus-tl"><polygon points="15,7.5 0,0 15,0" /></clipPath>
            <clipPath id="aus-bl"><polygon points="15,7.5 0,15 0,7.5" /></clipPath>
            <clipPath id="aus-br"><polygon points="15,7.5 30,15 15,15" /></clipPath>
          </defs>
          <path d="M15,0 V15 M0,7.5 H30" stroke="#FFF" strokeWidth="5" />
          <path d="M15,0 V15 M0,7.5 H30" stroke="#CF142B" strokeWidth="3" />
          {/* Commonwealth Star — 7-pointed, centred at (15, 22) */}
          <polygon points={star7(15, 22, 4, 1.7)} fill="#FFF" />
          {/* Southern Cross — Alpha (largest, 7-pt) at (45,7.5), Beta (45,22), Gamma (54,16), Delta (52,8), Epsilon 5-pt (38,19) */}
          <polygon points={star7(45, 7.5, 3.5, 1.5)} fill="#FFF" />
          <polygon points={star7(45, 22, 3.5, 1.5)} fill="#FFF" />
          <polygon points={star7(54, 16, 3.5, 1.5)} fill="#FFF" />
          <polygon points={star7(52, 7.5, 3.5, 1.5)} fill="#FFF" />
          <polygon points={star(38, 19, 2, 0.85, 5)} fill="#FFF" />
        </svg>
      );
    case 'china': {
      // Large star center at (5,5). Each small star must have one point aimed at (5,5).
      // Rotation = angle from small star center toward (5,5), offset by 90° because star() starts pointing up.
      const largeX = 5, largeY = 5;
      const smallStars = [
        { cx: 10, cy: 2 },
        { cx: 12, cy: 4 },
        { cx: 12, cy: 7 },
        { cx: 10, cy: 9 },
      ];
      return (
        <svg viewBox="0 0 30 20" {...shared}>
          <rect width="30" height="20" fill="#DE2910" />
          <polygon points={star(largeX, largeY, 3, 1.2)} fill="#FFDE00" />
          {smallStars.map(({ cx, cy }, i) => {
            const angleRad = Math.atan2(largeY - cy, largeX - cx);
            const angleDeg = (angleRad * 180) / Math.PI + 90;
            return <polygon key={i} points={star(cx, cy, 1, 0.4, 5, angleDeg)} fill="#FFDE00" />;
          })}
        </svg>
      );
    }
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
      return <Image src="/flags/Flag_of_Croatia.svg" alt="Croatia" fill className={className} style={{ objectFit: 'cover' }} />;
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
          <rect fill="#0D5EAF" width="27" height="18"/>
          <path fill="none" strokeWidth="2" stroke="#FFF" d="M5,0V11 M0,5H10 M10,3H27 M10,7H27 M0,11H27 M0,15H27"/>
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
      return <Image src="/flags/Flag_of_Liechtenstein.svg" alt="Liechtenstein" fill className={className} style={{ objectFit: 'cover' }} />;
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
      return <Image src="/flags/Flag_of_Malta.svg" alt="Malta" fill className={className} style={{ objectFit: 'cover' }} />;
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
      return <Image src="/flags/portugal.svg" alt="Portugal" fill className={className} style={{ objectFit: 'cover' }} />;
    case 'romania':
      return (
        <svg viewBox="0 0 3 2" {...shared}>
          <rect width="1" height="2" fill="#002B7F" />
          <rect width="1" height="2" x="1" fill="#FCD116" />
          <rect width="1" height="2" x="2" fill="#CE1126" />
        </svg>
      );
    case 'slovakia':
      return <Image src="/flags/Flag_of_Slovakia.svg" alt="Slovakia" fill className={className} style={{ objectFit: 'cover' }} />;
    case 'slovenia':
      return <Image src="/flags/Flag_of_Slovenia.svg" alt="Slovenia" fill className={className} style={{ objectFit: 'cover' }} />;
    case 'spain':
      return <Image src="/flags/spain.svg" alt="Spain" fill className={className} style={{ objectFit: 'cover' }} />;
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
    case 'ireland':
      return (
        <svg viewBox="0 0 3 2" {...shared}>
          <rect width="1" height="2" fill="#169B62" />
          <rect width="1" height="2" x="1" fill="#FFFFFF" />
          <rect width="1" height="2" x="2" fill="#FF883E" />
        </svg>
      );
    default:
      return null;
  }
}
