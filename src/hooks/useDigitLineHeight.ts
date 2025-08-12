import { useCallback, useEffect, useRef, useState } from 'react';

type UseDigitLineHeightResult<T extends HTMLElement> = {
  lineHeightPx: number;
  measureRef: React.MutableRefObject<T | null>;
  remeasure: () => void;
};

export function useDigitLineHeight<T extends HTMLElement = HTMLElement>(
  deps: unknown[] = []
): UseDigitLineHeightResult<T> {
  const measureRef = useRef<T>(null);
  const [lineHeightPx, setLineHeightPx] = useState<number>(0);

  const doMeasure = useCallback(() => {
    const el = measureRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = Math.max(0, Math.round(rect.height));
    if (next !== lineHeightPx) {
      setLineHeightPx(next);
    }
  }, [lineHeightPx]);

  const remeasure = useCallback(() => {
    requestAnimationFrame(doMeasure);
  }, [doMeasure]);

  useEffect(() => {
    const onResize = () => remeasure();
    window.addEventListener('resize', onResize, { passive: true });
    const id = requestAnimationFrame(doMeasure);
    void document.fonts?.ready?.then(() => remeasure());
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(id);
    };
  }, [doMeasure, remeasure]);

  useEffect(() => {
    remeasure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { lineHeightPx, measureRef, remeasure };
}
