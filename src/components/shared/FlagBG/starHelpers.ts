// Geometry helpers for star polygons used in flag SVGs.

export function star(
  cx: number,
  cy: number,
  ro: number,
  ri: number,
  points = 5,
  rotationDeg = 0
): string {
  const pts: string[] = [];
  const n = points * 2;
  const rotRad = (rotationDeg * Math.PI) / 180;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2 + rotRad;
    const r = i % 2 === 0 ? ro : ri;
    pts.push(
      `${Math.round((cx + Math.cos(a) * r) * 1e4) / 1e4},${Math.round((cy + Math.sin(a) * r) * 1e4) / 1e4}`
    );
  }
  return pts.join(' ');
}

export function star7(cx: number, cy: number, ro: number, ri: number): string {
  return star(cx, cy, ro, ri, 7);
}
