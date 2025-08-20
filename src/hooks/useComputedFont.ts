import { useEffect, useState } from 'react';

type AnyElementRef<T extends HTMLElement> =
  | React.RefObject<T>
  | React.MutableRefObject<T | null>;

export function useComputedFont<T extends HTMLElement>(
  ref: AnyElementRef<T>,
  deps: readonly unknown[] = []
): string | undefined {
  const [font, setFont] = useState<string | undefined>(undefined);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const update = () => {
      // Use the full shorthand property to match the actual render
      const computedStyle = window.getComputedStyle(element);
      setFont(computedStyle.font);
    };

    update();

    let resizeObserver: ResizeObserver | null = null;
    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(() => update());

      try {
        resizeObserver.observe(element);
      } catch {
        // ignore observer errors
      }
    }

    const onResize = () => update();
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      window.removeEventListener('resize', onResize);
      try {
        resizeObserver?.disconnect();
      } catch {
        // ignore disconnect errors
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return font;
}
