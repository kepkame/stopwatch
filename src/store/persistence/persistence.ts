import type { Store } from '@reduxjs/toolkit';
import type { RootState } from '../types';
import { saveSettings } from '@/services/settingsStorage';

type PersistableSettings = Pick<
  RootState['settings'],
  | 'soundEnabled'
  | 'alertIntervalSec'
  | 'changeTimeByTap'
  | 'keepScreenOn'
  | 'theme'
>;

const selectPersistable = (state: RootState): PersistableSettings => ({
  soundEnabled: state.settings.soundEnabled,
  alertIntervalSec: state.settings.alertIntervalSec,
  changeTimeByTap: state.settings.changeTimeByTap,
  keepScreenOn: state.settings.keepScreenOn,
  theme: state.settings.theme,
});

function debounce(fn: () => void, ms: number): () => void {
  let t: ReturnType<typeof setTimeout> | undefined;
  return () => {
    if (t) clearTimeout(t);
    t = setTimeout(fn, ms);
  };
}

export function initSettingsPersistence(store: Store<RootState>): void {
  let lastSerialized = '';

  const persistSafely = () => {
    const slice = selectPersistable(store.getState());
    const nextSerialized = JSON.stringify(slice);
    if (nextSerialized !== lastSerialized) {
      lastSerialized = nextSerialized;
      saveSettings(slice);
    }
  };

  store.subscribe(debounce(persistSafely, 150));
}
