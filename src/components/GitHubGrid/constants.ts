export const CONTRIBUTION_LEVELS = [
  '#161b22',  // Level 0 - No contributions
  '#0e4429',  // Level 1 - Light
  '#006d32',  // Level 2 - Medium
  '#26a641',  // Level 3 - Heavy
  '#39d353'   // Level 4 - Very Heavy
] as const;

export const DEFAULT_CONFIG = {
  horizontalSeparation: 4,
  verticalSeparation: 4,
  cellSize: 11,
  rows: 7,
  columns: 52,
  effectRadius: 120,
  force: 1
} as const;