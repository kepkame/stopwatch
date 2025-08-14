import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';
import { initSettingsPersistence } from './persistence/persistence';

export const store = configureStore({
  reducer: rootReducer,
});

initSettingsPersistence(store);

export type { RootState, AppDispatch } from './types';
