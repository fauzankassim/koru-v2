// Generates an Archimedean spiral path, normalized to a 0-100 pathLength
// so it can be "grown" with strokeDasharray based on Elo progress.
export function generateSpiralPath(turns: number, maxRadius: number, steps = 120): string {
  const points: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = t * turns * Math.PI * 2;
    const radius = t * maxRadius;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    points.push([x, y]);
  }
  return points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
}