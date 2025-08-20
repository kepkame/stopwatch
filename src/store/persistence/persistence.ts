import type { Store } from '@reduxjs/toolkit';
import type { RootState } from '../types';
import { saveSettings } from '@services/settingsStorage';
import { debounce } from '@utils/debounce';

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

const DEBOUNCE_MS = 150;

export function initSettingsPersistence(store: Store<RootState>): () => void {
  let lastSerialized = JSON.stringify(selectPersistable(store.getState()));

  // Persists settings only if there was a meaningful change
  const persistIfChanged = () => {
    const slice = selectPersistable(store.getState());
    const nextSerialized = JSON.stringify(slice);

    if (nextSerialized !== lastSerialized) {
      lastSerialized = nextSerialized;
      try {
        saveSettings(slice);
      } catch {
        // Errors are silently ignored
      }
    }
  };

  const unsubscribe = store.subscribe(debounce(persistIfChanged, DEBOUNCE_MS));

  // Return unsubscribe function so persistence can be stopped when needed
  return () => {
    unsubscribe();
  };
}
