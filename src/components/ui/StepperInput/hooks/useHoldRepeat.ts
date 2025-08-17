import { useCallback, useEffect, useRef } from 'react';

type UseHoldRepeatOptions = {
  initialDelayMs?: number;
  repeatMs?: number;
  disabled?: boolean;
};

/**
 * Universal helper for “holding” a button with auto-repeat
 */
export const useHoldRepeat = (
  action: () => void,
  {
    initialDelayMs = 350,
    repeatMs = 120,
    disabled = false,
  }: UseHoldRepeatOptions = {}
) => {
  const holdTimerRef = useRef<number | null>(null);
  const repeatTimerRef = useRef<number | null>(null);

  // Centralized cancel logic to avoid duplicated cleanup paths.
  const stop = useCallback(() => {
    if (holdTimerRef.current) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (repeatTimerRef.current) {
      window.clearInterval(repeatTimerRef.current);
      repeatTimerRef.current = null;
    }
  }, []);

  // Starts the immediate action, then schedules the repeating phase after the initial delay.
  const start = useCallback(() => {
    if (disabled) return;
    action(); // Fire once immediately for responsive UX.
    holdTimerRef.current = window.setTimeout(() => {
      // After the delay, enter auto-repeat until stopped.
      repeatTimerRef.current = window.setInterval(action, repeatMs);
    }, initialDelayMs);
  }, [action, disabled, initialDelayMs, repeatMs]);

  // Cleanup on unmount or when `stop` identity changes (unlikely).
  useEffect(() => stop, [stop]);

  const handlers = {
    onPointerDown: (e: React.PointerEvent) => {
      if (disabled) return;
      // Capture pointer to ensure up/cancel still fire outside.
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      start();
    },
    // Any end/cancel/leave condition halts the repeat cycle.
    onPointerUp: () => stop(),
    onPointerLeave: () => stop(),
    onPointerCancel: () => stop(),
  };

  return { handlers, stop };
};
