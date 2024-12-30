export interface Cell {
  level: number;
  angle: number;
  scale: number;
  x: number;
  y: number;
}

export interface CellEffects {
  displacement: number;
  rotation: number;
  scale: number;
}

export interface GridConfig {
  horizontalSeparation: number;
  verticalSeparation: number;
  cellSize: number;
  rows: number;
  columns: number;
  effectRadius: number;
  force: number;
}