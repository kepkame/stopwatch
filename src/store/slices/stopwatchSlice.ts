import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const MIN_LAP_GUARD_MS = 500;

interface Lap {
  id: number;
  timestampMs: number;
  /** Index of color in palette: 0-gray,1-pench,2-green,3-blue,4-purple,5-pink */
  colorIndex: number;
}

interface StopwatchState {
  status: 'idle' | 'running' | 'paused';
  startEpochMs: number | null;
  accumulatedMs: number;
  laps: Lap[];
  nextAlertAtMs: number | null;
  lastLapEpochMs: number | null;
}

const initialState: StopwatchState = {
  status: 'idle',
  startEpochMs: null,
  accumulatedMs: 0,
  laps: [],
  nextAlertAtMs: null,
  lastLapEpochMs: null,
};

const stopwatchSlice = createSlice({
  name: 'stopwatch',
  initialState,
  reducers: {
    start(state) {
      if (state.status !== 'running') {
        state.status = 'running';
        state.startEpochMs = Date.now();
      }
    },
    pause(state) {
      if (state.status === 'running' && state.startEpochMs !== null) {
        state.status = 'paused';
        state.accumulatedMs += Date.now() - state.startEpochMs;
        state.startEpochMs = null;
      }
    },
    reset(state) {
      Object.assign(state, initialState);
    },
    addLap(state) {
      if (state.status === 'running' && state.startEpochMs !== null) {
        const now = Date.now();
        // Lock: if the previous Lap was too recent — ignore the press
        if (
          state.lastLapEpochMs !== null &&
          now - state.lastLapEpochMs < MIN_LAP_GUARD_MS
        ) {
          return;
        }
        const totalElapsed = state.accumulatedMs + (now - state.startEpochMs);
        const previousLap = state.laps[state.laps.length - 1] ?? null;
        const nextColorIndex = previousLap ? previousLap.colorIndex : 0; // 0-gray for the very first lap
        state.laps.push({
          id: state.laps.length + 1,
          timestampMs: totalElapsed,
          colorIndex: nextColorIndex,
        });
        state.lastLapEpochMs = now;
        // setting the time for the next alert
        // (only if sounds are enabled and there is an interval in settings)
        // nextAlertAtMs will be set externally via thunk
      }
    },
    /** Set color index for a specific lap by id */
    setLapColorIndex(
      state,
      action: PayloadAction<{ id: number; colorIndex: number }>
    ) {
      const { id, colorIndex } = action.payload;
      const lap = state.laps.find((l) => l.id === id);
      if (!lap) return;
      // normalize within palette range [0..5]
      const paletteSize = 6;
      const normalized =
        ((colorIndex % paletteSize) + paletteSize) % paletteSize;
      lap.colorIndex = normalized;
    },
    setNextAlert(state, action: PayloadAction<number | null>) {
      state.nextAlertAtMs = action.payload;
    },
  },
});

export const { start, pause, reset, addLap, setNextAlert, setLapColorIndex } =
  stopwatchSlice.actions;
export default stopwatchSlice.reducer;
