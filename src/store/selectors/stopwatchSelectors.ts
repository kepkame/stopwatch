import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@store/store';
import { formatTime } from '@utils/time/formatTime';

export const selectLaps = (s: RootState) => s.stopwatch.laps;

export const selectMeasuring = createSelector([selectLaps], (laps) => {
  if (!laps.length)
    return [] as Array<{
      lap: number;
      time: string;
      diff: string;
      colorIndex: number;
    }>;

  return laps.map((lap, index, arr) => {
    const previousTimestampMs =
      index === 0 ? 0 : arr[index - 1].timestampMs ?? 0;
    const timeMs = lap.timestampMs ?? 0;
    const diffMs = Math.max(0, timeMs - previousTimestampMs);

    return {
      lap: lap.id,
      time: formatTime(timeMs),
      diff: `+${formatTime(diffMs)}`,
      colorIndex: lap.colorIndex,
    };
  });
});
