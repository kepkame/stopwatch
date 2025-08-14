import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@store/store';

export const selectSettings = (s: RootState) => s.settings;

export const selectIsSettingsOpen = createSelector(
  [selectSettings],
  (settings) => settings.isSettingsOpen
);
