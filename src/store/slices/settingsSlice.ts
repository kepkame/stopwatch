import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  soundEnabled: boolean;
  alertIntervalSec: number;
  changeTimeByTap: boolean;
  keepScreenOn: boolean;
  theme: string;
}

const initialState: SettingsState = {
  soundEnabled: false,
  alertIntervalSec: 60,
  changeTimeByTap: false,
  keepScreenOn: false,
  theme: 'blue',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
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
  toggleSound,
  setAlertInterval,
  toggleChangeTimeByTap,
  toggleKeepScreenOn,
  setTheme,
} = settingsSlice.actions;
export default settingsSlice.reducer;
