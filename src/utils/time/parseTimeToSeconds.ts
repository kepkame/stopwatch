export function parseTimeToSeconds(s?: string): number | null {
  if (!s) return null;

  const parts = s.split(':').map((p) => Number(p));

  if (parts.some((n) => !Number.isFinite(n))) return null;

  // Support ss, mm:ss, hh:mm:ss
  if (parts.length === 1) return Math.max(0, parts[0]);
  if (parts.length === 2) return Math.max(0, parts[0] * 60 + parts[1]);
  if (parts.length === 3)
    return Math.max(0, parts[0] * 3600 + parts[1] * 60 + parts[2]);
  return null;
}
