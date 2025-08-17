import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@store/store';
import { selectAlertIntervalSec } from '@store/selectors/settingsSelectors';
import { useElapsedTime } from '@hooks/useElapsedTime';
import { formatTime } from '@utils/time/formatTime';

export type DisplayMode = 'elapsed' | 'diff' | 'countdown';

const MODE_SEQUENCE: DisplayMode[] = ['elapsed', 'diff', 'countdown'];

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
  isElapsedVeryLong: boolean;
  isDiffVeryLong: boolean;
  isCountdownVeryLong: boolean;
};

// Derives all time values, formatted strings, and length flags
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

    // Diff: duration since previous lap or since start
    const lastDiffMs = Math.max(
      0,
      lastLapTs !== null ? lastLapTs - prevLapTs : elapsedMs - prevLapTs
    );

    // Countdown: based on last lap or previous lap timestamp
    const referenceTs = lastLapTs !== null ? lastLapTs : prevLapTs;
    const sinceRef = Math.max(0, elapsedMs - referenceTs);
    const target = countdownSeconds * 1000;
    const countdownMs = Math.max(0, target - sinceRef);

    // Pre-format for display
    const elapsedStr = formatTime(elapsedMs);
    const diffStr = `+${formatTime(lastDiffMs)}`;
    const countdownStr = `-${formatTime(countdownMs)}`;

    // Length flags used for adjusting layout/formatting
    const elapsedMinutes = minutesTotal(elapsedMs);
    const diffMinutes = minutesTotal(lastDiffMs);
    const countdownMinutes = minutesTotal(countdownMs);

    const isElapsedLong = elapsedMinutes >= 100;
    const isDiffLong = diffMinutes >= 100;
    const isCountdownLong = countdownMinutes >= 100;

    const isElapsedVeryLong = elapsedMinutes >= 1000;
    const isDiffVeryLong = diffMinutes >= 1000;
    const isCountdownVeryLong = countdownMinutes >= 1000;

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
      isElapsedVeryLong,
      isDiffVeryLong,
      isCountdownVeryLong,
    };
  } catch {
    // Fallback for safe rendering on unexpected errors
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
      isElapsedVeryLong: false,
      isDiffVeryLong: false,
      isCountdownVeryLong: false,
    };
  }
}

// Rotate display mode in sequence
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
  // Stopwatch state from Redux
  const startEpochMs = useSelector((s: RootState) => s.stopwatch.startEpochMs);
  const accumulatedMs = useSelector(
    (s: RootState) => s.stopwatch.accumulatedMs
  );
  const status = useSelector((s: RootState) => s.stopwatch.status);
  const laps = useSelector((s: RootState) => s.stopwatch.laps as LapLike[]);
  const changeTimeByTap = useSelector(
    (s: RootState) => s.settings.changeTimeByTap
  );

  const countdownSeconds = useSelector(selectAlertIntervalSec);

  // Continuously computed elapsed time
  const elapsedMs = useElapsedTime(startEpochMs, accumulatedMs, status);

  // Current display mode
  const [mode, setMode] = useState<DisplayMode>('elapsed');
  const compact = mode !== 'elapsed';

  // Recompute timer state whenever inputs change
  const computed = useMemo(
    () => computeTimerState(elapsedMs, laps, countdownSeconds),
    [elapsedMs, laps, countdownSeconds]
  );

  // Cycle mode on demand
  const cycleMode = useCallback(() => {
    setMode((current) => nextMode(current));
  }, []);

  // Accessible label for the switch action
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
