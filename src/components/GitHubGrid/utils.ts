import { Cell, GridConfig } from './types';

const easeOutQuad = (x: number): number => {
  return 1 - (1 - x) * (1 - x);
};

export const calculateCellEffects = (
  distance: number,
  effectRadius: number,
  force: number,
  angle: number
): { displacement: number; rotation: number; scale: number } => {
  const normalizedDistance = Math.max(0, Math.min(1, distance / effectRadius));
  const baseIntensity = 1 - normalizedDistance;
  
  // Apply easing and reduce the overall effect
  const intensity = easeOutQuad(baseIntensity) * (force * 0.15);
  
  return {
    displacement: (effectRadius - distance) * intensity * 0.3,
    rotation: angle * intensity * 1.2,
    scale: 1 + intensity * 0.3
  };
};