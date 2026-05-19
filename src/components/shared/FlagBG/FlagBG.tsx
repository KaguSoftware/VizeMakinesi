import Image from 'next/image';
import type { FlagBGProps } from './types';
import { IMAGE_FLAGS, STRIPED_FLAGS, COMPLEX_FLAGS } from './flagDefinitions';

export default function FlagBG({ presetKey, imageUrl, className, fit = 'slice' }: FlagBGProps) {
  // Admin-uploaded image always wins.
  if (imageUrl) {
    return <Image src={imageUrl} alt="" fill className={className} style={{ objectFit: 'cover' }} />;
  }

  if (!presetKey) return null;

  // 1. Image-backed presets
  const imageSrc = IMAGE_FLAGS[presetKey];
  if (imageSrc) {
    return <Image src={imageSrc} alt="" fill className={className} style={{ objectFit: 'cover' }} />;
  }

  const shared = {
    preserveAspectRatio: (fit === 'meet' ? 'xMidYMid meet' : 'xMidYMid slice') as 'xMidYMid meet' | 'xMidYMid slice',
    className,
  };

  // 2. Simple striped presets — render from data.
  const striped = STRIPED_FLAGS[presetKey];
  if (striped) {
    const [w, h] = striped.viewBox.split(' ').slice(2).map(Number);
    const total = striped.stripes.reduce((sum, s) => sum + (s.weight ?? 1), 0);
    // Precompute the offset of each stripe so the JSX map stays pure.
    const offsets = striped.stripes.reduce<number[]>((acc, s) => {
      const prev = acc[acc.length - 1] ?? 0;
      const ratio = (s.weight ?? 1) / total;
      const size = striped.orientation === 'horizontal' ? h * ratio : w * ratio;
      acc.push(prev + size);
      return acc;
    }, [0]);
    return (
      <svg viewBox={striped.viewBox} {...shared}>
        {striped.stripes.map((s, i) => {
          const ratio = (s.weight ?? 1) / total;
          const size = striped.orientation === 'horizontal' ? h * ratio : w * ratio;
          const offset = offsets[i];
          const x = striped.orientation === 'horizontal' ? 0 : offset;
          const y = striped.orientation === 'horizontal' ? offset : 0;
          const rectW = striped.orientation === 'horizontal' ? w : size;
          const rectH = striped.orientation === 'horizontal' ? size : h;
          return <rect key={i} x={x} y={y} width={rectW} height={rectH} fill={s.fill} />;
        })}
      </svg>
    );
  }

  // 3. Complex presets with custom geometry.
  const complex = COMPLEX_FLAGS[presetKey];
  if (complex) {
    return (
      <svg viewBox={complex.viewBox} {...shared}>
        {complex.render()}
      </svg>
    );
  }

  return null;
}
