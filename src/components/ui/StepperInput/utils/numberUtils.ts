export const clampNumber = (v: number, min?: number, max?: number): number => {
  let next = v;
  if (typeof min === 'number') next = Math.max(next, min);
  if (typeof max === 'number') next = Math.min(next, max);
  return next;
};

export const normalizeBounds = (
  min?: number,
  max?: number
): { min?: number; max?: number } => {
  if (typeof min === 'number' && typeof max === 'number' && min > max) {
    // Safe boundary swap
    return { min: max, max: min };
  }
  return { min, max };
};

export const normalizeStep = (step?: number): number => {
  if (!Number.isFinite(step as number)) return 1;
  const s = Math.abs(step as number);
  return s > 0 ? s : 1;
};

export const snapToStep = (
  current: number,
  dir: 1 | -1,
  step: number,
  min?: number,
  max?: number
): number => {
  const anchor = typeof min === 'number' ? min : 0;
  const k = Math.round((current - anchor) / step) + dir;
  const next = anchor + k * step;
  return clampNumber(next, min, max);
};

export const tryParseNumberWithLocale = (raw: string): number | null => {
  const cleaned = raw.replace(/[^\d.,-]/g, '').replace(',', '.');
  if (cleaned.trim() === '') return null;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
};
