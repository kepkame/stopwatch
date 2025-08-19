import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  RefObject,
  PointerEvent as ReactPointerEvent,
  PointerEventHandler,
  KeyboardEventHandler,
} from 'react';
import { animate, useMotionValue, useReducedMotion } from 'motion/react';
import {
  DOMINANCE_RATIO,
  SWIPE_THRESHOLD_PX,
  MIN_SUCCESS_PX,
  SUCCESS_RATIO,
} from '@utils/lapSwipeConfig';

export interface UseLapSwipeParams {
  onChangeColor(nextDelta: 1 | -1): void;
}

export interface UseLapSwipeResult {
  containerRef: RefObject<HTMLDivElement | null>;
  overlayRef: RefObject<HTMLDivElement | null>;
  overlayRtl: boolean;
  onPointerDown: PointerEventHandler<HTMLDivElement>;
  onPointerMove: PointerEventHandler<HTMLDivElement>;
  onPointerUp: PointerEventHandler<HTMLDivElement>;
  onPointerCancel: PointerEventHandler<HTMLDivElement>;
  onKeyDown: KeyboardEventHandler<HTMLDivElement>;
}

export const useLapSwipe = ({
  onChangeColor,
}: UseLapSwipeParams): UseLapSwipeResult => {
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const swiped = useRef<boolean>(false);
  const pointerIdRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const lapWidthRef = useRef<number>(0);
  const [overlayRtl, setOverlayRtl] = useState(false);

  const prefersReducedMotion = useReducedMotion();
  const progressX = useMotionValue(0);

  useEffect(() => {
    const unsub = progressX.on('change', (v) => {
      if (overlayRef.current) overlayRef.current.style.width = `${v}px`;
    });
    return () => unsub();
  }, [progressX]);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const update = () => {
      lapWidthRef.current = el.clientWidth;
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const resetGesture = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    try {
      if (pointerIdRef.current !== null) {
        e.currentTarget.releasePointerCapture(pointerIdRef.current);
      }
    } catch {
      // empty
    }
    startX.current = null;
    startY.current = null;
    swiped.current = false;
    pointerIdRef.current = null;
  }, []);

  const commitChange = useCallback(
    (delta: 1 | -1) => onChangeColor(delta),
    [onChangeColor]
  );

  const animateTo = useCallback(
    (to: number, duration: number, ease: 'easeOut' | 'easeIn') => {
      const controls = animate(progressX, to, { duration, ease });
      return controls.finished;
    },
    [progressX]
  );

  // Define onPointerUp before onPointerDown to avoid TDZ when used in deps
  const onPointerUp: PointerEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (swiped.current) {
        const lapWidth = lapWidthRef.current || 0;
        const dx =
          (startX.current !== null ? e.clientX - startX.current : 0) || 0;
        const width = Math.min(Math.abs(dx), lapWidth);
        progressX.set(width);
        const successThreshold = Math.max(
          MIN_SUCCESS_PX,
          SUCCESS_RATIO * lapWidth
        );
        const isSuccess = width >= successThreshold;
        const delta: 1 | -1 = dx > 0 ? 1 : -1;

        if (prefersReducedMotion) {
          if (isSuccess) commitChange(delta);
          progressX.set(0);
        } else {
          if (isSuccess) {
            animateTo(lapWidth, 0.2, 'easeOut').finally(() => {
              commitChange(delta);
              progressX.set(0);
            });
          } else {
            animateTo(0, 0.16, 'easeIn').finally(() => {
              progressX.set(0);
            });
          }
        }
      }
      resetGesture(e as unknown as ReactPointerEvent<HTMLDivElement>);
    },
    [animateTo, commitChange, prefersReducedMotion, resetGesture, progressX]
  );

  const onPointerDown: PointerEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      pointerIdRef.current = e.pointerId;
      startX.current = e.clientX;
      startY.current = e.clientY;
      swiped.current = false;

      const onMove = (ev: PointerEvent) => {
        if (pointerIdRef.current !== ev.pointerId) return;
        if (startX.current === null || startY.current === null) return;
        const dx = ev.clientX - startX.current;
        const dy = ev.clientY - startY.current;
        if (!swiped.current) {
          if (
            Math.abs(dx) >= SWIPE_THRESHOLD_PX &&
            Math.abs(dx) > Math.abs(dy) * DOMINANCE_RATIO
          ) {
            swiped.current = true;
            setOverlayRtl(dx < 0);
            progressX.set(0);
          }
        } else {
          const lapWidth = lapWidthRef.current || 0;
          const width = Math.min(Math.abs(dx), lapWidth);
          progressX.set(width);
        }
        ev.preventDefault();
      };

      const onUp = (ev: PointerEvent) => {
        if (pointerIdRef.current !== ev.pointerId) return;
        const synthetic = ev as unknown as ReactPointerEvent<HTMLDivElement>;
        onPointerUp(synthetic);
        window.removeEventListener('pointermove', onMove, { capture: false });
        window.removeEventListener('pointerup', onUp, { capture: false });
        window.removeEventListener('pointercancel', onUp, { capture: false });
      };

      window.addEventListener('pointermove', onMove, { passive: false });
      window.addEventListener('pointerup', onUp, { passive: false });
      window.addEventListener('pointercancel', onUp, { passive: false });
    },
    [onPointerUp, progressX]
  );

  const onPointerMove: PointerEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (startX.current === null || startY.current === null || swiped.current)
        return;
      const dx = e.clientX - startX.current;
      const dy = e.clientY - startY.current;
      if (
        Math.abs(dx) >= SWIPE_THRESHOLD_PX &&
        Math.abs(dx) > Math.abs(dy) * DOMINANCE_RATIO
      ) {
        swiped.current = true;
        setOverlayRtl(dx < 0);
        progressX.set(0);
        e.preventDefault();
      }
    },
    [progressX]
  );

  const onPointerMoveDragging: PointerEventHandler<HTMLDivElement> =
    useCallback(
      (e) => {
        if (!swiped.current || startX.current === null) return;
        const dx = e.clientX - startX.current;
        const lapWidth = lapWidthRef.current || 0;
        const width = Math.min(Math.abs(dx), lapWidth);
        progressX.set(width);
        e.preventDefault();
      },
      [progressX]
    );

  const onPointerCancel: PointerEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      resetGesture(e as unknown as ReactPointerEvent<HTMLDivElement>);
    },
    [resetGesture]
  );

  const onKeyDown: KeyboardEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      // if (!e.shiftKey) return;
      const lapWidth = lapWidthRef.current || 0;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setOverlayRtl(false);
        if (prefersReducedMotion) {
          commitChange(1);
        } else {
          progressX.set(0);
          animateTo(lapWidth, 0.2, 'easeOut').finally(() => {
            commitChange(1);
            progressX.set(0);
          });
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setOverlayRtl(true);
        if (prefersReducedMotion) {
          commitChange(-1);
        } else {
          progressX.set(0);
          animateTo(lapWidth, 0.2, 'easeOut').finally(() => {
            commitChange(-1);
            progressX.set(0);
          });
        }
      }
    },
    [animateTo, commitChange, prefersReducedMotion, progressX]
  );

  const onPointerMoveRouted: PointerEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (!swiped.current) onPointerMove(e);
      else onPointerMoveDragging(e);
    },
    [onPointerMove, onPointerMoveDragging]
  );

  return {
    containerRef,
    overlayRef,
    overlayRtl,
    onPointerDown,
    onPointerMove: onPointerMoveRouted,
    onPointerUp,
    onPointerCancel,
    onKeyDown,
  };
};
