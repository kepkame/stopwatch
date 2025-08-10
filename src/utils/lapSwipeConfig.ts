export const PALETTE_SIZE = 6;
export const SWIPE_THRESHOLD_PX = 28; // minimal horizontal distance to start swipe
export const DOMINANCE_RATIO = 1.2; // horizontal must dominate over vertical
export const MIN_SUCCESS_PX = 48; // minimal pixels to accept swipe
export const SUCCESS_RATIO = 0.33; // or 33% of width, whichever is larger

export type RadiusMode = 'px20';
export const RADIUS_MODE: RadiusMode = 'px20';

export const cyclicIndex = (
  base: number,
  delta: number,
  size: number = PALETTE_SIZE
): number => {
  return (((base + delta) % size) + size) % size;
};


