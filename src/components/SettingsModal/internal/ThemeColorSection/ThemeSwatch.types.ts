import type { Theme } from '@shared/config/settings';

export type ThemeSwatchProps = {
  value: Theme;
  label: string;
  active: boolean;
  onSelect: (v: Theme) => void;
};
