import type { FlagBGProps } from './types';

function star(cx: number, cy: number, ro: number, ri: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? ro : ri;
    pts.push(`${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`);
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
          <rect width="1" height="2" x="0" fill="#0055A4" />
          <rect width="1" height="2" x="1" fill="#FFFFFF" />
          <rect width="1" height="2" x="2" fill="#EF4135" />
        </svg>
      );
    case 'italy':
      return (
        <svg viewBox="0 0 3 2" {...shared}>
          <rect width="1" height="2" x="0" fill="#008C45" />
          <rect width="1" height="2" x="1" fill="#F4F5F0" />
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
          {[0, 2, 4, 6, 8, 10, 12].map((i) => (
            <rect key={i} width="190" height={100 / 13} y={(100 / 13) * i} fill="#B22234" />
          ))}
          <rect width="76" height={(100 / 13) * 7} fill="#3C3B6E" />
        </svg>
      );
    case 'canada':
      return (
        <svg viewBox="0 0 24 12" {...shared}>
          <rect width="6" height="12" x="0" fill="#FF0000" />
          <rect width="12" height="12" x="6" fill="#FFFFFF" />
          <rect width="6" height="12" x="18" fill="#FF0000" />
          <path
            d="M12,3 L12.5,4.5 L14,4 L13,5.5 L14.5,6 L13,6.5 L13.5,8 L12.3,7.2 L12,8.5 L11.7,7.2 L10.5,8 L11,6.5 L9.5,6 L11,5.5 L10,4 L11.5,4.5 Z"
            fill="#FF0000"
          />
        </svg>
      );
    case 'australia':
      return (
        <svg viewBox="0 0 60 30" {...shared}>
          <rect width="60" height="30" fill="#00247D" />
          <path d="M0,0 L30,15 M30,0 L0,15 M30,0 L60,15 M60,0 L30,15" stroke="#FFF" strokeWidth="2" />
          <path d="M15,0 V15 M0,7.5 H30" stroke="#FFF" strokeWidth="3" />
          <path d="M15,0 V15 M0,7.5 H30" stroke="#CF142B" strokeWidth="1.5" />
          <circle cx="45" cy="22" r="2" fill="#FFF" />
          <circle cx="50" cy="18" r="1.2" fill="#FFF" />
          <circle cx="52" cy="24" r="1.2" fill="#FFF" />
          <circle cx="46" cy="27" r="1.2" fill="#FFF" />
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
