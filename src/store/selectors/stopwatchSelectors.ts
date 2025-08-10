import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@store/store';
import { formatTime } from '@utils/time/formatTime';

export const selectLaps = (s: RootState) => s.stopwatch.laps;

export const selectMeasuring = createSelector([selectLaps], (laps) => {
  if (!laps.length) return [];
  return laps.map((lap, i, arr) => {
    const prevTs = i === 0 ? 0 : arr[i - 1].timestampMs;
    const timeMs = lap.timestampMs;
    const diffMs = timeMs - prevTs;
    return {
      lap: lap.id,
      time: formatTime(timeMs),
      diff: `+${formatTime(diffMs)}`,
      colorIndex: lap.colorIndex,
    };
  });
});
