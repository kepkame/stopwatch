export const THEME_VALUES = [
  'lightPeach',
  'darkPeach',
  'light',
  'dark',
  'black',
] as const;

export type Theme = (typeof THEME_VALUES)[number];

export const THEME_LABELS: Record<Theme, string> = {
  lightPeach: 'Light Peach',
  darkPeach: 'Dark Peach',
  light: 'Light',
  dark: 'Dark',
  black: 'Black',
};

export const isTheme = (v: unknown): v is Theme =>
  THEME_VALUES.includes(v as Theme);

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
