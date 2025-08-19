import type { SettingsShape } from '@shared/config/settings';

export const PERSISTED_SETTING_KEYS = [
  'soundEnabled',
  'alertIntervalSec',
  'changeTimeByTap',
  'keepScreenOn',
] as const satisfies readonly (keyof SettingsShape)[];
