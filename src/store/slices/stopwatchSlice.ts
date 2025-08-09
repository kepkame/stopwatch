import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Lap {
  id: number;
  timestampMs: number; // абсолютное время фиксации
}

interface StopwatchState {
  status: 'idle' | 'running' | 'paused';
  startEpochMs: number | null;
  accumulatedMs: number;
  laps: Lap[];
  nextAlertAtMs: number | null;
}

const initialState: StopwatchState = {
  status: 'idle',
  startEpochMs: null,
  accumulatedMs: 0,
  laps: [],
  nextAlertAtMs: null,
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
        const totalElapsed = state.accumulatedMs + (now - state.startEpochMs);
        state.laps.unshift({
          id: state.laps.length + 1,
          timestampMs: totalElapsed,
        });
        // установка времени следующего сигнала
        // (только если включены звуки и есть интервал в settings)
        // nextAlertAtMs будет задаваться снаружи через thunk
      }
    },
    setNextAlert(state, action: PayloadAction<number | null>) {
      state.nextAlertAtMs = action.payload;
    },
  },
});

export const { start, pause, reset, addLap, setNextAlert } =
  stopwatchSlice.actions;
export default stopwatchSlice.reducer;
