import { useEffect } from 'react';
import { useAppSelector } from '@store/hooks';
import { selectTheme } from '@store/selectors/settingsSelectors';

export const ThemeEffect: React.FC = () => {
  const theme = useAppSelector(selectTheme);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return null;
};
