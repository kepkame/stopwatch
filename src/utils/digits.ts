export const isDigitChar = (ch: string): boolean => ch >= '0' && ch <= '9';

export const collectDigitIndices = (tokens: readonly string[]): number[] =>
  tokens.flatMap((ch, i) => (isDigitChar(ch) ? [i] : []));

/**
 * Build a mask mapping numeric digit indices -> whether they should animate.
 * true = animate, false = static.
 *
 * - `tokens` is the tokenized visible value (e.g. ['0','0',':','0','1','.','2','3'])
 * - `staticRightDigits` — how many rightmost numeric digits should be static (0..n)
 */
export function buildAnimateMask(
  tokens: readonly string[],
  staticRightDigits: number
): Map<number, boolean> {
  // normalize requested static count to a non-negative integer
  const disableCount = Math.max(0, Math.floor(staticRightDigits));

  const indices = collectDigitIndices(tokens);
  if (indices.length === 0) return new Map();

  // fast paths for common cases
  if (disableCount === 0) {
    // animate all numeric indices
    return new Map(indices.map((idx) => [idx, true] as const));
  }

  if (disableCount >= indices.length) {
    // make all numeric indices static
    return new Map(indices.map((idx) => [idx, false] as const));
  }

  // compute cutoff position: indices with position < cutoff will animate
  const cutoff = indices.length - disableCount;
  const entries = indices.map((index, pos) => [index, pos < cutoff] as const);

  return new Map(entries);
}
