import { useEffect, useRef, useState } from 'react';
import type { DisplayMode } from '@hooks/useTimerDisplay';

export type TimerAltAnimationState = {
  isAltShown: boolean;
  isSoftAltAnimation: boolean;
  isBlinkTransition: boolean;
  shouldBlink: boolean;
};

export function useTimerAltAnimation(
  mode: DisplayMode
): TimerAltAnimationState {
  const [isAltShown, setIsAltShown] = useState<boolean>(false);
  const [shouldBlink, setShouldBlink] = useState<boolean>(false);
  const prevModeRef = useRef<DisplayMode | null>(null);
  const showRafRef = useRef<number | null>(null);

  useEffect(() => {
    if (showRafRef.current !== null) {
      window.cancelAnimationFrame(showRafRef.current);
      showRafRef.current = null;
    }

    const wasDiff = prevModeRef.current === 'diff';
    const isCountdown = mode === 'countdown';
    const isDiff = mode === 'diff';

    const isBlink =
      (wasDiff && isCountdown) ||
      (prevModeRef.current === 'countdown' && isDiff);
    if (isBlink) {
      setShouldBlink(false);
      window.requestAnimationFrame(() => setShouldBlink(true));
    }

    if (wasDiff && isCountdown) {
      setIsAltShown(false);
      showRafRef.current = window.requestAnimationFrame(() => {
        setIsAltShown(true);
        showRafRef.current = null;
      });
    } else if (isDiff || isCountdown) {
      setIsAltShown(false);
      showRafRef.current = window.requestAnimationFrame(() => {
        setIsAltShown(true);
        showRafRef.current = null;
      });
    } else {
      setIsAltShown(false);
    }

    return () => {
      if (showRafRef.current !== null) {
        window.cancelAnimationFrame(showRafRef.current);
        showRafRef.current = null;
      }
    };
  }, [mode]);

  useEffect(() => {
    prevModeRef.current = mode;
  });

  const isSoftAltAnimation =
    prevModeRef.current === 'diff' && mode === 'countdown';
  const isBlinkTransition =
    (prevModeRef.current === 'diff' && mode === 'countdown') ||
    (prevModeRef.current === 'countdown' && mode === 'diff');

  return { isAltShown, isSoftAltAnimation, isBlinkTransition, shouldBlink };
}
