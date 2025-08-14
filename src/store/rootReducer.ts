import { combineReducers } from '@reduxjs/toolkit';
import stopwatch from './slices/stopwatchSlice';
import settings from './slices/settingsSlice';

export const rootReducer = combineReducers({
  stopwatch,
  settings,
});

export type RootReducer = typeof rootReducer;
