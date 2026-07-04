"use client";

import { generateSpiralPath } from "@/lib/spiral";
import { eloToLevel } from "@/lib/elo";

function tierColor(elo: number) {
  const { level } = eloToLevel(elo);
  if (level <= 4) return "hsl(165 19% 40%)"; // fern — seedling/sprout
  if (level <= 8) return "hsl(155 43% 18%)"; // moss — sapling/grove
  return "hsl(46 67% 47%)"; // brass — canopy
}

export function KoruSpiral({ elo, size = 64 }: { elo: number; size?: number }) {
  const { level, isMaxLevel } = eloToLevel(elo);
  const pct = isMaxLevel ? 1 : Math.min(1, Math.max(0, (level - 1) / 9));
  const path = generateSpiralPath(3.5, size / 2 - 4);
  const color = tierColor(elo);

  return (
    <svg width={size} height={size} viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}>
      <path d={path} fill="none" stroke="hsl(107 14% 87%)" strokeWidth={2} strokeLinecap="round" />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray={100}
        strokeDashoffset={100 - pct * 100}
        style={{ transition: "stroke-dashoffset 900ms ease-out, stroke 400ms ease" }}
      />
    </svg>
  );
}