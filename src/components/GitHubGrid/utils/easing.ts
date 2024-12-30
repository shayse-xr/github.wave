export const easeOutQuad = (x: number): number => {
  return 1 - (1 - x) * (1 - x);
};