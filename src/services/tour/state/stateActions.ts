import type { Store } from '@reduxjs/toolkit';
import { setLapColorIndex, addLap, start } from '@store/slices/stopwatchSlice';
import { PALETTE_LENGTH, cyclicIndex } from '@utils/lapSwipeConfig';

/**
 * Ensure stopwatch is running; dispatches `start()` if not.
 */
export const ensureRunning = (store: Store): void => {
  const { status } = store.getState().stopwatch;
  if (status !== 'running') store.dispatch(start());
};

/**
 * Add a lap once via Redux.
 */
export const addLapOnce = (store: Store): void => {
  store.dispatch(addLap());
};

/**
 * Rotate latest lap color to the next palette value.
 * No-op if no laps. Palette length captured to keep wrap logic stable.
 */
export const bumpLatestLapColor = (store: Store): void => {
  const laps = store.getState().stopwatch.laps;
  const latest = laps[laps.length - 1];

  if (!latest) return;

  const length = PALETTE_LENGTH();
  const next = cyclicIndex(latest.colorIndex, 1, length);

  store.dispatch(setLapColorIndex({ id: latest.id, colorIndex: next, paletteLength: length }));
};
