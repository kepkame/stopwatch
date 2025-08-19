import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@store/store';

export const selectSettings = (s: RootState) => s.settings;

export const selectIsSettingsOpen = createSelector(
  [selectSettings],
  (settings) => settings.isSettingsOpen
);

export const selectAlertIntervalSec = createSelector(
  [selectSettings],
  (settings) => settings.alertIntervalSec
);

export const selectTheme = createSelector(
  [selectSettings],
  (settings) => settings.theme
);
