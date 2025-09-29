import { useAppDispatch, useAppSelector } from '@store/hooks';
import { selectTheme } from '@store/selectors/settingsSelectors';
import { setTheme } from '@store/slices/settingsSlice';
import { THEME_META, type Theme } from '@shared/config/settings';
import { Section } from '../Section/Section';
import { ThemeSwatch } from './ThemeSwatch';
import styles from './ThemeColorSection.module.scss';

export const ThemeColorSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const current = useAppSelector(selectTheme);

  const handleOnSelect = (value: Theme) => {
    if (value !== current) dispatch(setTheme(value));
  };

  const themes: Theme[] = Object.keys(THEME_META) as Theme[];

  return (
    <Section title="Theme Color">
      <fieldset className={styles.fieldset}>
        <div role="radiogroup" aria-label="Theme color" className={styles.row}>
          {themes.map((value) => (
            <ThemeSwatch
              key={value}
              value={value}
              label={THEME_META[value].label}
              active={value === current}
              onSelect={handleOnSelect}
            />
          ))}
        </div>
      </fieldset>
    </Section>
  );
};
