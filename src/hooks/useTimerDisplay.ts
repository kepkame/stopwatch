import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@store/store';
import { useElapsedTime } from '@hooks/useElapsedTime';
import { formatTime } from '@utils/time/formatTime';

export type DisplayMode = 'elapsed' | 'diff' | 'countdown';

const MODE_SEQUENCE: DisplayMode[] = ['elapsed', 'diff', 'countdown'];
const DEFAULT_COUNTDOWN_SEC = 40;

type LapLike = {
  id: number;
  timestampMs: number | null;
  colorIndex: number;
};

const minutesTotal = (milliseconds: number): number => {
  return Math.floor(milliseconds / 60000);
};

type TimerComputed = {
  elapsedMs: number;
  lastDiffMs: number;
  countdownMs: number;
  elapsedStr: string;
  diffStr: string;
  countdownStr: string;
  isElapsedLong: boolean;
  isDiffLong: boolean;
  isCountdownLong: boolean;
};

function computeTimerState(
  elapsedMs: number,
  laps: LapLike[],
  countdownSeconds: number
): TimerComputed {
  try {
    const hasLaps = laps.length > 0;
    const lastLap = hasLaps ? laps[laps.length - 1] : null;
    const lastLapTs: number | null = lastLap ? lastLap.timestampMs : null;
    const prevLapTs: number =
      laps.length > 1 ? laps[laps.length - 2].timestampMs ?? 0 : 0;

    const lastDiffMs = Math.max(
      0,
      lastLapTs !== null ? lastLapTs - prevLapTs : elapsedMs - prevLapTs
    );

    const referenceTs = lastLapTs !== null ? lastLapTs : prevLapTs;
    const sinceRef = Math.max(0, elapsedMs - referenceTs);
    const target = countdownSeconds * 1000;
    const countdownMs = Math.max(0, target - sinceRef);

    const elapsedStr = formatTime(elapsedMs);
    const diffStr = `+${formatTime(lastDiffMs)}`;
    const countdownStr = `-${formatTime(countdownMs)}`;

    const isElapsedLong = minutesTotal(elapsedMs) >= 100;
    const isDiffLong = minutesTotal(lastDiffMs) >= 100;
    const isCountdownLong = minutesTotal(countdownMs) >= 100;

    return {
      elapsedMs,
      lastDiffMs,
      countdownMs,
      elapsedStr,
      diffStr,
      countdownStr,
      isElapsedLong,
      isDiffLong,
      isCountdownLong,
    };
  } catch {
    // Fail-safe defaults to keep UI functional
    const zero = '00:00.00';
    return {
      elapsedMs: 0,
      lastDiffMs: 0,
      countdownMs: 0,
      elapsedStr: zero,
      diffStr: `+${zero}`,
      countdownStr: `-${zero}`,
      isElapsedLong: false,
      isDiffLong: false,
      isCountdownLong: false,
    };
  }
}

const nextMode = (mode: DisplayMode): DisplayMode => {
  const index = MODE_SEQUENCE.indexOf(mode);
  const nextIndex = (index + 1) % MODE_SEQUENCE.length;
  return MODE_SEQUENCE[nextIndex];
};

export type UseTimerDisplayResult = TimerComputed & {
  mode: DisplayMode;
  compact: boolean;
  changeTimeByTap: boolean;
  ariaLabel: string;
  cycleMode: () => void;
};

export function useTimerDisplay(): UseTimerDisplayResult {
  const startEpochMs = useSelector((s: RootState) => s.stopwatch.startEpochMs);
  const accumulatedMs = useSelector(
    (s: RootState) => s.stopwatch.accumulatedMs
  );
  const status = useSelector((s: RootState) => s.stopwatch.status);
  const laps = useSelector((s: RootState) => s.stopwatch.laps as LapLike[]);
  const changeTimeByTap = useSelector(
    (s: RootState) => s.settings.changeTimeByTap
  );

  const elapsedMs = useElapsedTime(startEpochMs, accumulatedMs, status);

  const [mode, setMode] = useState<DisplayMode>('elapsed');
  const compact = mode !== 'elapsed';

  const computed = useMemo(
    () => computeTimerState(elapsedMs, laps, DEFAULT_COUNTDOWN_SEC),
    [elapsedMs, laps]
  );

  const cycleMode = useCallback(() => {
    setMode((current) => nextMode(current));
  }, []);

  const ariaLabel = useMemo(() => {
    switch (mode) {
      case 'elapsed':
        return 'Show last lap diff';
      case 'diff':
        return 'Show countdown';
      case 'countdown':
      default:
        return 'Show total elapsed';
    }
  }, [mode]);

  return {
    ...computed,
    mode,
    compact,
    changeTimeByTap,
    ariaLabel,
    cycleMode,
  };
}
