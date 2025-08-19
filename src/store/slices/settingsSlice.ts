import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { loadSettings } from '@services/settingsStorage';
import { type Theme, SETTINGS_DEFAULTS } from '@shared/config/settings';

interface SettingsState {
  soundEnabled: boolean;
  alertIntervalSec: number;
  changeTimeByTap: boolean;
  keepScreenOn: boolean;
  theme: string;
  isSettingsOpen: boolean;
}

const persisted = loadSettings();

const preferredDefaultTheme = (): Theme => {
  try {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ) {
      return 'darkPeach';
    }
  } catch {
    // ignore
  }
  return SETTINGS_DEFAULTS.theme;
};

const initialState: SettingsState = {
  soundEnabled: persisted.soundEnabled ?? false,
  alertIntervalSec: persisted.alertIntervalSec ?? 40,
  changeTimeByTap: persisted.changeTimeByTap ?? true,
  keepScreenOn: persisted.keepScreenOn ?? true,
  theme: (persisted.theme as Theme | undefined) ?? preferredDefaultTheme(),
  isSettingsOpen: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    openSettings(state) {
      state.isSettingsOpen = true;
    },
    closeSettings(state) {
      state.isSettingsOpen = false;
    },
    toggleSound(state) {
      state.soundEnabled = !state.soundEnabled;
    },
    setAlertInterval(state, action: PayloadAction<number>) {
      state.alertIntervalSec = action.payload;
    },
    toggleChangeTimeByTap(state) {
      state.changeTimeByTap = !state.changeTimeByTap;
    },
    toggleKeepScreenOn(state) {
      state.keepScreenOn = !state.keepScreenOn;
    },
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
    },
  },
});

export const {
  openSettings,
  closeSettings,
  toggleSound,
  setAlertInterval,
  toggleChangeTimeByTap,
  toggleKeepScreenOn,
  setTheme,
} = settingsSlice.actions;

export default settingsSlice.reducer;
