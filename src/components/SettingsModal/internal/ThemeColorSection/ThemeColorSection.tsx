import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setTheme } from '@store/slices/settingsSlice';
import { selectSettings } from '@store/selectors/settingsSelectors';
import { Section } from '../Section/Section';
import { ThemeSwatch } from './ThemeSwatch';
import { THEME_KEYS, type ThemeKey } from './themeTokens';
import styles from './ThemeColorSection.module.scss';

export const ThemeColorSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector(selectSettings);

  return (
    <Section title="Theme Color">
      <fieldset className={styles.fieldset}>
        <div
          role="radiogroup"
          aria-label="Theme color"
          className={styles.swatchRow}
        >
          {THEME_KEYS.map((key) => (
            <ThemeSwatch
              key={key}
              name="theme"
              value={key as ThemeKey}
              active={theme === key}
              onSelect={(value) => dispatch(setTheme(value))}
            />
          ))}
        </div>
      </fieldset>
    </Section>
  );
};
