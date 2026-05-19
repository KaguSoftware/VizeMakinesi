import { star, star7 } from './starHelpers';

// ── Image-backed flags ────────────────────────────────────────────────────────
// Presets that delegate to a static SVG file in /public.
export const IMAGE_FLAGS: Record<string, string> = {
  uk: '/flags/uk.svg',
  canada: '/canada_flag.svg',
  croatia: '/flags/Flag_of_Croatia.svg',
  liechtenstein: '/flags/Flag_of_Liechtenstein.svg',
  malta: '/flags/Flag_of_Malta.svg',
  portugal: '/flags/portugal.svg',
  slovakia: '/flags/Flag_of_Slovakia.svg',
  slovenia: '/flags/Flag_of_Slovenia.svg',
  spain: '/flags/spain.svg',
};

// ── Simple striped flags ──────────────────────────────────────────────────────
// Data-driven for flags that are just stacked stripes.
type Stripe = { fill: string; weight?: number }; // weight = relative thickness, defaults to 1
type StripedFlag = {
  viewBox: string;
  orientation: 'horizontal' | 'vertical';
  stripes: Stripe[];
};

export const STRIPED_FLAGS: Record<string, StripedFlag> = {
  germany:     { viewBox: '0 0 5 3', orientation: 'horizontal', stripes: [{ fill: '#000' }, { fill: '#DD0000' }, { fill: '#FFCE00' }] },
  france:      { viewBox: '0 0 3 2', orientation: 'vertical',   stripes: [{ fill: '#0055A4' }, { fill: '#FFFFFF' }, { fill: '#EF4135' }] },
  italy:       { viewBox: '0 0 3 2', orientation: 'vertical',   stripes: [{ fill: '#008C45' }, { fill: '#FFFFFF' }, { fill: '#CD212A' }] },
  netherlands: { viewBox: '0 0 9 6', orientation: 'horizontal', stripes: [{ fill: '#AE1C28' }, { fill: '#FFFFFF' }, { fill: '#21468B' }] },
  belgium:     { viewBox: '0 0 3 2', orientation: 'vertical',   stripes: [{ fill: '#000000' }, { fill: '#FAE042' }, { fill: '#EF3340' }] },
  bulgaria:    { viewBox: '0 0 3 2', orientation: 'horizontal', stripes: [{ fill: '#FFFFFF' }, { fill: '#00966E' }, { fill: '#D62612' }] },
  estonia:     { viewBox: '0 0 3 2', orientation: 'horizontal', stripes: [{ fill: '#0072CE' }, { fill: '#000000' }, { fill: '#FFFFFF' }] },
  hungary:     { viewBox: '0 0 3 2', orientation: 'horizontal', stripes: [{ fill: '#CE2939' }, { fill: '#FFFFFF' }, { fill: '#477050' }] },
  lithuania:   { viewBox: '0 0 5 3', orientation: 'horizontal', stripes: [{ fill: '#FDB913' }, { fill: '#006A44' }, { fill: '#C1272D' }] },
  luxembourg:  { viewBox: '0 0 3 2', orientation: 'horizontal', stripes: [{ fill: '#EF3340' }, { fill: '#FFFFFF' }, { fill: '#00A3E0' }] },
  romania:     { viewBox: '0 0 3 2', orientation: 'vertical',   stripes: [{ fill: '#002B7F' }, { fill: '#FCD116' }, { fill: '#CE1126' }] },
  ireland:     { viewBox: '0 0 3 2', orientation: 'vertical',   stripes: [{ fill: '#169B62' }, { fill: '#FFFFFF' }, { fill: '#FF883E' }] },
  poland:      { viewBox: '0 0 8 5', orientation: 'horizontal', stripes: [{ fill: '#FFFFFF' }, { fill: '#DC143C' }] },
};

// ── Complex flags ─────────────────────────────────────────────────────────────
// Flags with stars, crosses, or custom geometry — each returns an array of SVG
// children for a given viewBox.
type ComplexFlag = {
  viewBox: string;
  render: () => React.ReactNode;
};

export const COMPLEX_FLAGS: Record<string, ComplexFlag> = {
  usa: {
    viewBox: '0 0 190 100',
    render: () => (
      <>
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
          const x = totalCols === 6 ? colStep / 2 + col * colStep : colStep + col * colStep;
          const y = rowStep / 2 + row * rowStep;
          return <polygon key={i} points={star(x, y, 2.4, 1.0)} fill="#FFFFFF" />;
        })}
      </>
    ),
  },
  australia: {
    viewBox: '0 0 60 30',
    render: () => (
      <>
        <rect width="60" height="30" fill="#00247D" />
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
        <polygon points={star7(15, 22, 4, 1.7)} fill="#FFF" />
        <polygon points={star7(45, 7.5, 3.5, 1.5)} fill="#FFF" />
        <polygon points={star7(45, 22, 3.5, 1.5)} fill="#FFF" />
        <polygon points={star7(54, 16, 3.5, 1.5)} fill="#FFF" />
        <polygon points={star7(52, 7.5, 3.5, 1.5)} fill="#FFF" />
        <polygon points={star(38, 19, 2, 0.85, 5)} fill="#FFF" />
      </>
    ),
  },
  china: {
    viewBox: '0 0 30 20',
    render: () => {
      // Large star center at (5,5). Each small star must have one point aimed at (5,5).
      const largeX = 5, largeY = 5;
      const smallStars = [
        { cx: 10, cy: 2 },
        { cx: 12, cy: 4 },
        { cx: 12, cy: 7 },
        { cx: 10, cy: 9 },
      ];
      return (
        <>
          <rect width="30" height="20" fill="#DE2910" />
          <polygon points={star(largeX, largeY, 3, 1.2)} fill="#FFDE00" />
          {smallStars.map(({ cx, cy }, i) => {
            const angleRad = Math.atan2(largeY - cy, largeX - cx);
            const angleDeg = (angleRad * 180) / Math.PI + 90;
            return <polygon key={i} points={star(cx, cy, 1, 0.4, 5, angleDeg)} fill="#FFDE00" />;
          })}
        </>
      );
    },
  },
  uae: {
    viewBox: '0 0 12 6',
    render: () => (
      <>
        <rect width="3" height="6" fill="#FF0000" />
        <rect width="9" height="2" x="3" y="0" fill="#00732F" />
        <rect width="9" height="2" x="3" y="2" fill="#FFFFFF" />
        <rect width="9" height="2" x="3" y="4" fill="#000000" />
      </>
    ),
  },
  schengen: {
    viewBox: '0 0 60 40',
    render: () => (
      <>
        <rect width="60" height="40" fill="#003399" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
          const r = 12;
          const cx = 30 + Math.cos(a) * r;
          const cy = 20 + Math.sin(a) * r;
          return <polygon key={i} points={star(cx, cy, 1.6, 0.7)} fill="#FFCC00" />;
        })}
      </>
    ),
  },
  austria: {
    viewBox: '0 0 3 2',
    render: () => (
      <>
        <rect width="3" height="2" fill="#ED2939" />
        <rect width="3" height="0.667" y="0.667" fill="#FFFFFF" />
      </>
    ),
  },
  czech: {
    viewBox: '0 0 3 2',
    render: () => (
      <>
        <rect width="3" height="1" fill="#FFFFFF" />
        <rect width="3" height="1" y="1" fill="#D7141A" />
        <polygon points="0,0 1.2,1 0,2" fill="#11457E" />
      </>
    ),
  },
  denmark: {
    viewBox: '0 0 37 28',
    render: () => (
      <>
        <rect width="37" height="28" fill="#C60C30" />
        <rect width="4" height="28" x="9" fill="#FFFFFF" />
        <rect width="37" height="4" y="12" fill="#FFFFFF" />
      </>
    ),
  },
  finland: {
    viewBox: '0 0 18 11',
    render: () => (
      <>
        <rect width="18" height="11" fill="#FFFFFF" />
        <rect width="3" height="11" x="5" fill="#003580" />
        <rect width="18" height="3" y="4" fill="#003580" />
      </>
    ),
  },
  greece: {
    viewBox: '0 0 27 18',
    render: () => (
      <>
        <rect fill="#0D5EAF" width="27" height="18" />
        <path fill="none" strokeWidth="2" stroke="#FFF" d="M5,0V11 M0,5H10 M10,3H27 M10,7H27 M0,11H27 M0,15H27" />
      </>
    ),
  },
  iceland: {
    viewBox: '0 0 25 18',
    render: () => (
      <>
        <rect width="25" height="18" fill="#003897" />
        <rect width="5" height="18" x="7" fill="#FFFFFF" />
        <rect width="25" height="5" y="6.5" fill="#FFFFFF" />
        <rect width="3" height="18" x="8" fill="#D72828" />
        <rect width="25" height="3" y="7.5" fill="#D72828" />
      </>
    ),
  },
  latvia: {
    viewBox: '0 0 2 1',
    render: () => (
      <>
        <rect width="2" height="1" fill="#9E3039" />
        <rect width="2" height="0.2" y="0.4" fill="#FFFFFF" />
      </>
    ),
  },
  norway: {
    viewBox: '0 0 22 16',
    render: () => (
      <>
        <rect width="22" height="16" fill="#EF2B2D" />
        <rect width="4" height="16" x="6" fill="#FFFFFF" />
        <rect width="22" height="4" y="6" fill="#FFFFFF" />
        <rect width="2" height="16" x="7" fill="#002868" />
        <rect width="22" height="2" y="7" fill="#002868" />
      </>
    ),
  },
  sweden: {
    viewBox: '0 0 16 10',
    render: () => (
      <>
        <rect width="16" height="10" fill="#006AA7" />
        <rect width="2" height="10" x="5" fill="#FECC02" />
        <rect width="16" height="2" y="4" fill="#FECC02" />
      </>
    ),
  },
  switzerland: {
    viewBox: '0 0 32 32',
    render: () => (
      <>
        <rect width="32" height="32" fill="#FF0000" />
        <rect width="6" height="20" x="13" y="6" fill="#FFFFFF" />
        <rect width="20" height="6" x="6" y="13" fill="#FFFFFF" />
      </>
    ),
  },
};
