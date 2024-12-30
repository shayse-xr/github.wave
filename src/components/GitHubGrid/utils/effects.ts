import { CellEffects } from '../types';
import { easeOutQuad } from './easing';

export const calculateCellEffects = (
  distance: number,
  effectRadius: number,
  force: number,
  angle: number
): CellEffects => {
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