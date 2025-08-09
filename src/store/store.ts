import { configureStore } from '@reduxjs/toolkit';
import stopwatchReducer from './slices/stopwatchSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    stopwatch: stopwatchReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
