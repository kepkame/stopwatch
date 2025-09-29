export const THEME_META = {
  lightPeach: { label: 'Light Peach', lapPaletteLength: 6 },
  darkPeach: { label: 'Dark Peach', lapPaletteLength: 6 },
  light: { label: 'Light', lapPaletteLength: 2 },
  dark: { label: 'Dark', lapPaletteLength: 2 },
  black: { label: 'Black', lapPaletteLength: 2 },
} as const;

export type Theme = keyof typeof THEME_META;

export const isTheme = (v: unknown): v is Theme => typeof v === 'string' && v in THEME_META;

export const SETTINGS_DEFAULTS = {
  soundEnabled: false,
  alertIntervalSec: 40,
  changeTimeByTap: true,
  keepScreenOn: true,
  theme: 'lightPeach' as Theme,
} as const;

// Basic settings form without UI fields
export type SettingsShape = {
  soundEnabled: boolean;
  alertIntervalSec: number;
  changeTimeByTap: boolean;
  keepScreenOn: boolean;
  theme: Theme;
};
