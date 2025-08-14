import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { loadSettings } from '@services/settingsStorage';

interface SettingsState {
  soundEnabled: boolean;
  alertIntervalSec: number;
  changeTimeByTap: boolean;
  keepScreenOn: boolean;
  theme: string;
  isSettingsOpen: boolean;
}

const persisted = loadSettings();

const initialState: SettingsState = {
  soundEnabled: persisted.soundEnabled ?? false,
  alertIntervalSec: persisted.alertIntervalSec ?? 60,
  changeTimeByTap: persisted.changeTimeByTap ?? true,
  keepScreenOn: persisted.keepScreenOn ?? false,
  theme: persisted.theme ?? 'default',
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
    setTheme(state, action: PayloadAction<string>) {
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
