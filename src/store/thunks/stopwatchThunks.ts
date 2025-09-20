import type { AppDispatch, RootState } from '@store/types';
import { setLapColorIndex } from '@store/slices/stopwatchSlice';
import { PALETTE_LENGTH, cyclicIndex } from '@utils/lapSwipeConfig';

export type Delta = 1 | -1;

/**
 * Инкремент/декремент цветового индекса круга по его id.
 * Источник истины — текущее состояние в Redux (laps), поэтому компоненту
 * не нужно знать текущий colorIndex: это снижает связность и стабилизирует коллбэк.
 */
export const bumpLapColor =
  (lapId: number, delta: Delta) =>
  (dispatch: AppDispatch, getState: () => RootState): void => {
    const { stopwatch } = getState();
    const lap = stopwatch.laps.find((l) => l.id === lapId);
    if (!lap) return;

    const len = PALETTE_LENGTH();
    const next = cyclicIndex(lap.colorIndex, delta, len);

    dispatch(
      setLapColorIndex({
        id: lapId,
        colorIndex: next,
        paletteLength: len,
      }),
    );
  };
