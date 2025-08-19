export const PALETTE_SIZE = 6;
export const SWIPE_THRESHOLD_PX = 28; // minimal horizontal distance to start swipe
export const DOMINANCE_RATIO = 1.2; // horizontal must dominate over vertical
export const MIN_SUCCESS_PX = 48; // minimal pixels to accept swipe
export const SUCCESS_RATIO = 0.33; // or 33% of width, whichever is larger

export function normalizeColorIndex(idx: number, length: number): number {
  const L = Math.max(1, Math.floor(length) || 1);
  return ((idx % L) + L) % L;
}

export function cyclicIndex(current: number, delta: 1 | -1, length: number) {
  return normalizeColorIndex(current + delta, length);
}

export const PALETTE_LENGTH = (): number => {
  try {
    const root = document.documentElement;
    const v = getComputedStyle(root)
      .getPropertyValue('--lap-palette-length')
      .trim();
    const n = Number.parseInt(v, 10);
    return Number.isFinite(n) && n > 0 ? n : 6;
  } catch {
    return 6;
  }
};
