import { useEffect } from 'react';
import { preloadAlert, setAlertSrc } from '@services/sound/sound';
import alertUrl from '/sounds/beep.mp3?url';

/**
 * Initializes the source and preloads the sound once
 */
export function useSoundInit(): void {
  useEffect(() => {
    setAlertSrc(alertUrl);
    preloadAlert(alertUrl);
  }, []);
}
