import { useEffect, useMemo, useRef } from 'react';
import { useAppSelector } from '@store/hooks';
import { selectAlertIntervalSec } from '@store/selectors/settingsSelectors';
import { useElapsedTime } from '@hooks/useElapsedTime';
import { playTestAlert, preloadAlert } from '@services/sound/sound';

type LapLike = { id: number; timestampMs: number | null; colorIndex: number };

export function useCountdownEndAlert() {
  // Stopwatch + settings state from Redux
  const startEpochMs = useAppSelector((s) => s.stopwatch.startEpochMs);
  const accumulatedMs = useAppSelector((s) => s.stopwatch.accumulatedMs);
  const status = useAppSelector((s) => s.stopwatch.status);
  const laps = useAppSelector((s) => s.stopwatch.laps as LapLike[]);
  const soundEnabled = useAppSelector((s) => s.settings.soundEnabled);
  const countdownSec = useAppSelector(selectAlertIntervalSec);

  // Live elapsed time in ms
  const elapsedMs = useElapsedTime(startEpochMs, accumulatedMs, status);

  // Countdown time remaining based on last lap or previous reference
  const countdownMs = useMemo(() => {
    const hasLaps = laps.length > 0;
    const lastLap = hasLaps ? laps[laps.length - 1] : null;
    const lastLapTs: number | null = lastLap ? lastLap.timestampMs : null;
    const prevLapTs: number =
      laps.length > 1 ? laps[laps.length - 2].timestampMs ?? 0 : 0;
    const referenceTs = lastLapTs !== null ? lastLapTs : prevLapTs;
    const sinceRef = Math.max(0, elapsedMs - referenceTs);
    const target = countdownSec * 1000;

    return Math.max(0, target - sinceRef);
  }, [elapsedMs, laps, countdownSec]);

  useEffect(() => {
    if (soundEnabled) preloadAlert();
  }, [soundEnabled]);

  const prevLeftRef = useRef<number | null>(null);

  // Detect countdown crossing to zero and play alert once
  useEffect(() => {
    if (!soundEnabled) {
      prevLeftRef.current = countdownMs;
      return;
    }
    const prev = prevLeftRef.current;
    const curr = countdownMs;

    if (prev !== null && prev > 0 && curr === 0) {
      void playTestAlert({ allowOverlap: false, volume: 1 });
    }
    prevLeftRef.current = curr;
  }, [countdownMs, soundEnabled]);
}
