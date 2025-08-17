export const THEME_KEYS = [
  'lightPeach',
  'darkPeach',
  'light',
  'dark',
  'black',
] as const;

export type ThemeKey = (typeof THEME_KEYS)[number];

export const THEME_LABELS: Record<ThemeKey, string> = {
  lightPeach: 'Light – Peach',
  darkPeach: 'Dark – Peach',
  light: 'Light',
  dark: 'Dark',
  black: 'Black',
};
