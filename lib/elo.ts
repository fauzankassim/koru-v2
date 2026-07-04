/**
 * Elo model:
 * - Every topic starts at 1000 Elo = Level 1 (Seedling).
 * - Each quiz question carries its own Elo stake ("points"), set by the AI
 *   based on question difficulty. Correct answer: +points. Wrong: -points.
 * - Every +100 Elo = +1 level, floor of 1000 (can't drop below Level 1).
 * - Level caps at MAX_LEVEL ("Canopy" — intermediate mastery). Elo can keep
 *   climbing past that point from grinding, but the displayed level freezes.
 */
export const BASE_ELO = 1000;
const LEVEL_STEP = 100;
const MAX_LEVEL = 10; // reached at 1900 Elo — intermediate cap

/**
 * Sums per-question Elo deltas from a completed quiz attempt and applies
 * them to the topic's current Elo, floored at the starting value.
 */
export function updateEloFromQuiz(
  currentElo: number,
  results: { isCorrect: boolean; points: number }[]
): { newElo: number; delta: number } {
  const delta = results.reduce((sum, r) => sum + (r.isCorrect ? r.points : -r.points), 0);
  const newElo = Math.max(BASE_ELO, currentElo + delta);
  return { newElo, delta: newElo - currentElo };
}

const GROWTH_STAGES = [
  { maxLevel: 2, label: "Seedling" },
  { maxLevel: 4, label: "Sprout" },
  { maxLevel: 6, label: "Sapling" },
  { maxLevel: 8, label: "Grove" },
  { maxLevel: MAX_LEVEL, label: "Canopy" },
];

export function eloToLevel(elo: number): { level: number; label: string; isMaxLevel: boolean } {
  const rawLevel = Math.floor((elo - BASE_ELO) / LEVEL_STEP) + 1;
  const level = Math.min(MAX_LEVEL, Math.max(1, rawLevel));
  const stage = GROWTH_STAGES.find((s) => level <= s.maxLevel)!;
  return { level, label: stage.label, isMaxLevel: level >= MAX_LEVEL };
}

export function eloToDifficultyLabel(elo: number): "beginner" | "intermediate" | "advanced" {
  const { level } = eloToLevel(elo);
  if (level <= 3) return "beginner";
  if (level <= 7) return "intermediate";
  return "advanced";
}